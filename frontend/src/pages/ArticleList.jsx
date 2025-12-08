import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { articleAPI } from '../api/client';
import './ArticleList.css';

function ArticleList() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            setLoading(true);
            const data = await articleAPI.getAllArticles();
            setArticles(data.data || data);
            setError(null);
        } catch (err) {
            setError('Failed to load articles. Please make sure the backend is running on port 3001.');
            console.error('Error fetching articles:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateArticle = async () => {
        try {
            setGenerating(true);
            await articleAPI.generateArticle();
            await fetchArticles();
        } catch (err) {
            console.error('Error generating article:', err);
        } finally {
            setGenerating(false);
        }
    };

    if (loading) {
        return (
            <div className="container">
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Loading articles...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <div className="error">
                    <h2> Error</h2>
                    <p>{error}</p>
                    <button onClick={fetchArticles} className="retry-btn">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <header className="header">
                <h1> AI-Generated Blog</h1>
            </header>

            <div className="actions">
                <button
                    onClick={handleGenerateArticle}
                    className="generate-btn"
                    disabled={generating}
                >
                    {generating ? 'Generating...' : 'Generate New Article'}
                </button>
                <span className="article-count">{articles.length} articles</span>
            </div>

            {articles.length === 0 ? (
                <div className="no-articles">
                    <h2> No articles yet</h2>
                    <p>Click the button above to generate your first article!</p>
                </div>
            ) : (
                <div className="articles-grid">
                    {articles.map((article) => (
                        <Link to={`/article/${article.id}`} key={article.id} className="article-card">
                            <div className="article-card-content">
                                <h2>{article.title}</h2>
                                <p className="article-preview">
                                    {article.content.substring(0, 150)}...
                                </p>
                                <div className="article-meta">
                                    <span className="author">👤 {article.author}</span>
                                    <span className="date">
                                        {new Date(article.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ArticleList;
