# Auto-Generated Blog - Frontend

React + Vite frontend application for the AI-powered blog.

## 🚀 Features

- Browse all AI-generated articles
- View full article details
- Generate new articles on demand
- Responsive design with modern UI
- Real-time data fetching from backend API
- Loading states and error handling

## 📋 Prerequisites

- Node.js 18+
- Backend API running


## 📁 Project Structure

```
frontend/src/
├── api/
│   └── client.js          # API client for backend calls
├── pages/
│   ├── ArticleList.jsx    # Home page - article grid
│   ├── ArticleList.css    # Styling for article list
│   ├── ArticleDetail.jsx  # Article detail page
│   └── ArticleDetail.css  # Styling for article detail
├── App.jsx                # Main app with routing
├── App.css                # Global app styles
├── main.jsx               # Entry point
└── index.css              # Base CSS
```

## 🎨 Pages

### Home Page (/)
- Displays all articles in a responsive grid
- Article count indicator
- "Generate New Article" button
- Article preview cards with title, preview, author, and date

### Article Detail Page (/article/:id)
- Full article content
- Back navigation button
- Author and timestamp
- Formatted text display

## 🔌 API Integration

The frontend connects to the backend API at `http://localhost:`:

- `GET /api/articles` - Fetch all articles
- `GET /api/articles/:id` - Fetch single article
- `POST /api/articles/generate` - Generate new article

## 🎨 Design Features

- Modern purple gradient theme
- Card-based layout
- Smooth hover animations
- Responsive for mobile, tablet, and desktop
- Loading spinners
- Error states with retry options

## 🔧 Technologies

- **React** 18
- **Vite** 5
- **React Router** 6
- **Axios** for API calls
- **CSS3** with custom styling

## 🐛 Troubleshooting

### Backend Connection Issues

If you see "Failed to load articles":
1. Make sure backend is running: `cd ../backend && npm run dev`
2. Verify backend is on port 3001
3. Check `.env` file has correct `VITE_API_URL`

## 👤 Author

Mahmoud Ashraf
- GitHub: [@mahmoudAshraf283](https://github.com/mahmoudAshraf283)
