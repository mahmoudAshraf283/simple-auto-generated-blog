import pool from '../config/database.js';

class Article {
  // Get all articles
  static async findAll() {
    const result = await pool.query(
      'SELECT * FROM articles ORDER BY created_at DESC'
    );
    return result.rows;
  }

  // Get single article by ID
  static async findById(id) {
    const result = await pool.query(
      'SELECT * FROM articles WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  // Create new article
  static async create({ title, content, author = 'AI Blog Generator' }) {
    const result = await pool.query(
      `INSERT INTO articles (title, content, author, created_at, updated_at) 
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
       RETURNING *`,
      [title, content, author]
    );
    return result.rows[0];
  }

  // Update article
  static async update(id, { title, content }) {
    const result = await pool.query(
      `UPDATE articles 
       SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $3 
       RETURNING *`,
      [title, content, id]
    );
    return result.rows[0];
  }

  // Delete article
  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM articles WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }

  // Get article count
  static async count() {
    const result = await pool.query('SELECT COUNT(*) FROM articles');
    return parseInt(result.rows[0].count);
  }
}

export default Article;
