# Auto-Generated Blog - Backend API

Node.js + Express backend with PostgreSQL database and AI-powered article generation.

## 🚀 Features

- RESTful API for blog articles
- PostgreSQL database integration
- AI article generation using HuggingFace API (free)
- Automated daily article generation with node-cron


## 📋 Prerequisites

- Node.js 
- PostgreSQL 
- HuggingFace API key (free) - [Get one here](https://huggingface.co/settings/tokens)

## 🛠️ Setup

### 1. Install Dependencies

```powershell
npm install
```

### 2. Configure Environment

Update `.env` with your configuration:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=blog_db
DB_USER=blog_user
DB_PASSWORD=blog_password

HUGGINGFACE_API_KEY=your_actual_key_here
```

### 3. Start PostgreSQL

Create a database manually:
```sql
CREATE DATABASE blog_db;
CREATE USER blog_user WITH PASSWORD 'blog_password';
GRANT ALL PRIVILEGES ON DATABASE blog_db TO blog_user;
```

### 4. Start the Server

**Development mode :**
```powershell
npm run dev
```

The server will:
- Initialize the database schema automatically
- Generate 3 initial articles (if none exist)
- Start the daily cron job for article generation
- Listen on http://localhost:5000

## 📡 API Endpoints

### Health Check
```
GET /health
```
Returns server health status

### Get All Articles
```
GET /api/articles
```
Returns list of all articles

### Get Single Article
```
GET /api/articles/:id
```
Returns a single article by ID

### Generate New Article
```
POST /api/articles/generate
```
Triggers manual article generation

## 🤖 AI Article Generation

- Uses **HuggingFace's Mistral-7B-Instruct** model
- Automatic generation every day at 9:00 AM
- Generates 3 initial articles on first startup
- Fallback content if API fails

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js       # PostgreSQL connection & schema
│   ├── models/
│   │   └── Article.js        # Article model with CRUD operations
│   ├── routes/
│   │   └── articles.js       # API route handlers
│   ├── services/
│   │   ├── aiClient.js       # HuggingFace AI integration
│   │   └── articleJob.js     # Cron scheduler
│   └── index.js              # Main server entry point
├── package.json
└── README.md
```
