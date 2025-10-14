const { pool } = require('../config/database');

class User {
  // Find user by username
  static async findByUsername(username) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const [rows] = await pool.query(
        'SELECT id, username, full_name, created_at FROM users WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Create new user (if needed in the future)
  static async create(userData) {
    try {
      const { username, password, full_name } = userData;
      const [result] = await pool.query(
        'INSERT INTO users (username, password, full_name) VALUES (?, ?, ?)',
        [username, password, full_name]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Update user password
  static async updatePassword(id, hashedPassword) {
    try {
      const [result] = await pool.query(
        'UPDATE users SET password = ? WHERE id = ?',
        [hashedPassword, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;