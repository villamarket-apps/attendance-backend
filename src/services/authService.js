const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthService {
  // Login user
  async login(username, password) {
    try {
      // Find user by username
      const user = await User.findByUsername(username);
      
      if (!user) {
        return { success: false, message: 'Invalid credentials' };
      }

      // Compare password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return { success: false, message: 'Invalid credentials' };
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user.id, 
          username: user.username 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      return {
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          full_name: user.full_name
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Verify token
  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  // Hash password (utility method for creating users)
  async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }
}

module.exports = new AuthService();