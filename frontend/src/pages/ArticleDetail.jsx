import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { articleAPI } from '../api/client';
import './ArticleDetail.css';

function ArticleDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchArticle();
    }, [id]);

    const fetchArticle = async () => {
        try {
            setLoading(true);
            const response = await articleAPI.getArticleById(id);
            setArticle(response.data || response);
            setError(null);
        } catch (err) {
            setError('Article not found or failed to load.');
            console.error('Error fetching article:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container">
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Loading article...</p>
                </div>
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="container">
                <div className="error">
                    <h2> Error</h2>
                    <p>{error}</p>
                    <Link to="/" className="back-btn">
                        ← Back to Articles
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="article-detail">
                <button onClick={() => navigate(-1)} className="back-btn">
                    ← Back
                </button>

                <article className="article-content">
                    <header className="article-header">
                        <h1>{article.title}</h1>
                        <div className="article-info">
                            <span className="author">👤 {article.author}</span>
                            <span className="date">
                                {new Date(article.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </span>
                        </div>
                    </header>

                    <div className="article-body">
                        {article.content.split('\n').map((paragraph, index) => (
                            paragraph.trim() && <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                </article>
            </div>
        </div>
    );
}

export default ArticleDetail;
