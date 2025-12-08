import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const articleAPI = {
  // Get all articles
  getAllArticles: async () => {
    const response = await axios.get(`${API_BASE_URL}/api/articles`);
    return response.data;
  },

  // Get single article by ID
  getArticleById: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/api/articles/${id}`);
    return response.data;
  },

  // Generate new article
  generateArticle: async () => {
    const response = await axios.post(`${API_BASE_URL}/api/articles/generate`);
    return response.data;
  },
};

export default articleAPI;
