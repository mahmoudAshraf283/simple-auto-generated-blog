import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initializeDatabase } from "./config/database.js";
import articlesRouter from "./routes/articles.js";
import {
  startArticleScheduler,
  generateInitialArticles,
} from "./services/articleJob.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Auto-Generated Blog API is running",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/articles", articlesRouter);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Auto-Generated Blog API",
    version: "1.0.0",
    endpoints: {
      health: "GET /health",
      articles: "GET /api/articles",
      article: "GET /api/articles/:id",
      generate: "POST /api/articles/generate",
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Initialize and start server
async function startServer() {
  try {
    // Initialize database
    await initializeDatabase();

    // Generate initial articles if needed
    await generateInitialArticles();

    // Start the cron scheduler for daily article generation
    startArticleScheduler();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`\n Server running on port ${PORT}`);
      console.log(`API URL: http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log(`Articles API: http://localhost:${PORT}/api/articles\n`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
