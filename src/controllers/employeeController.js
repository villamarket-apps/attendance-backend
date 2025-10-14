const employeeService = require('../services/employeeService');
const { HTTP_STATUS, MESSAGES } = require('../constants');

class EmployeeController {
  // GET /api/v1/employees
  async getAllEmployees(req, res) {
    try {
      const { active_only } = req.query;
      const onlyActive = active_only === 'true';

      const employees = await employeeService.getAllEmployees(onlyActive);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data: employees
      });
    } catch (error) {
      console.error('Get all employees error:', error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.SERVER_ERROR
      });
    }
  }

  // GET /api/v1/employees/:id
  async getEmployeeById(req, res) {
    try {
      const { id } = req.params;

      const result = await employeeService.getEmployeeById(id);

      if (!result.success) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: result.message
        });
      }

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data: result.employee
      });
    } catch (error) {
      console.error('Get employee by ID error:', error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.SERVER_ERROR
      });
    }
  }

  // POST /api/v1/employees
  async createEmployee(req, res) {
    try {
      const employeeData = req.body;

      const result = await employeeService.createEmployee(employeeData);

      if (!result.success) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: result.message
        });
      }

      return res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: result.message,
        data: {
          employeeId: result.employeeId
        }
      });
    } catch (error) {
      console.error('Create employee error:', error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.SERVER_ERROR
      });
    }
  }

  // PUT /api/v1/employees/:id
  async updateEmployee(req, res) {
    try {
      const { id } = req.params;
      const employeeData = req.body;

      const result = await employeeService.updateEmployee(id, employeeData);

      if (!result.success) {
        const statusCode = result.message === MESSAGES.EMPLOYEE_NOT_FOUND 
          ? HTTP_STATUS.NOT_FOUND 
          : HTTP_STATUS.BAD_REQUEST;

        return res.status(statusCode).json({
          success: false,
          message: result.message
        });
      }

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      console.error('Update employee error:', error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.SERVER_ERROR
      });
    }
  }

  // DELETE /api/v1/employees/:id
  async deleteEmployee(req, res) {
    try {
      const { id } = req.params;
      const { permanent } = req.query;

      let result;
      if (permanent === 'true') {
        result = await employeeService.permanentlyDeleteEmployee(id);
      } else {
        result = await employeeService.deleteEmployee(id);
      }

      if (!result.success) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: result.message
        });
      }

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      console.error('Delete employee error:', error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.SERVER_ERROR
      });
    }
  }

  // PATCH /api/v1/employees/:id/hourly-rate
  async updateHourlyRate(req, res) {
    try {
      const { id } = req.params;
      const { hourly_rate } = req.body;

      if (hourly_rate === undefined || hourly_rate === null) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Hourly rate is required'
        });
      }

      const result = await employeeService.updateHourlyRate(id, hourly_rate);

      if (!result.success) {
        const statusCode = result.message === MESSAGES.EMPLOYEE_NOT_FOUND 
          ? HTTP_STATUS.NOT_FOUND 
          : HTTP_STATUS.BAD_REQUEST;

        return res.status(statusCode).json({
          success: false,
          message: result.message
        });
      }

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      console.error('Update hourly rate error:', error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.SERVER_ERROR
      });
    }
  }
}

module.exports = new EmployeeController();