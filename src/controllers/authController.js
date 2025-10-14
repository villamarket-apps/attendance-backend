const authService = require('../services/authService');
const { HTTP_STATUS, MESSAGES } = require('../constants');

class AuthController {
  // POST /api/v1/auth/login
  async login(req, res) {
    try {
      const { username, password } = req.body;

      // Validate input
      if (!username || !password) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Username and password are required'
        });
      }

      // Attempt login
      const result = await authService.login(username, password);

      if (!result.success) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: result.message
        });
      }

      // Success
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: MESSAGES.LOGIN_SUCCESS,
        data: {
          token: result.token,
          user: result.user
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.SERVER_ERROR
      });
    }
  }

  // GET /api/v1/auth/verify - Verify if token is valid
  async verifyToken(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: 'No token provided'
        });
      }

      const decoded = authService.verifyToken(token);

      if (!decoded) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: 'Invalid token'
        });
      }

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data: decoded
      });
    } catch (error) {
      console.error('Verify token error:', error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.SERVER_ERROR
      });
    }
  }
}

module.exports = new AuthController();