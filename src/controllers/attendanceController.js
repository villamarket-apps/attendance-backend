const attendanceService = require('../services/attendanceService');
const { HTTP_STATUS, MESSAGES } = require('../constants');
const { generatePayrollPDF } = require('../utils/pdfGenerator');

class AttendanceController {
  // POST /api/v1/attendance
  async createRecord(req, res) {
    try {
      const recordData = req.body;

      const result = await attendanceService.createRecord(recordData);

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
          recordId: result.recordId
        }
      });
    } catch (error) {
      console.error('Create attendance record error:', error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.SERVER_ERROR
      });
    }
  }

  // GET /api/v1/attendance/today
  async getTodayRecords(req, res) {
    try {
      const records = await attendanceService.getTodayRecords();

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data: records
      });
    } catch (error) {
      console.error('Get today records error:', error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.SERVER_ERROR
      });
    }
  }

  // GET /api/v1/attendance/employee/:employeeId
  async getRecordsByEmployee(req, res) {
    try {
      const { employeeId } = req.params;
      const { start_date, end_date } = req.query;

      let result;

      if (start_date && end_date) {
        // Get records with date range
        result = await attendanceService.getRecordsByEmployeeAndDateRange(
          employeeId,
          start_date,
          end_date
        );
      } else {
        // Get all records
        result = await attendanceService.getRecordsByEmployee(employeeId);
      }

      if (!result.success) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: result.message
        });
      }

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data: result.records
      });
    } catch (error) {
      console.error('Get records by employee error:', error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.SERVER_ERROR
      });
    }
  }

  // GET /api/v1/attendance/payroll/:employeeId
  async getPayroll(req, res) {
    try {
      const { employeeId } = req.params;
      const { start_date, end_date } = req.query;

      if (!start_date || !end_date) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Start date and end date are required'
        });
      }

      const result = await attendanceService.calculatePayroll(
        employeeId,
        start_date,
        end_date
      );

      if (!result.success) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: result.message
        });
      }

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Get payroll error:', error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.SERVER_ERROR
      });
    }
  }

  // GET /api/v1/attendance/payroll/:employeeId/pdf
  async getPayrollPDF(req, res) {
    try {
      const { employeeId } = req.params;
      const { start_date, end_date } = req.query;

      if (!start_date || !end_date) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Start date and end date are required'
        });
      }

      const result = await attendanceService.calculatePayroll(
        employeeId,
        start_date,
        end_date
      );

      if (!result.success) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: result.message
        });
      }

      // Generate PDF
      const doc = generatePayrollPDF(result, start_date, end_date);

      // Set response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=payroll_${result.employee.name.replace(/\s+/g, '_')}_${start_date}_${end_date}.pdf`);

      // Pipe PDF to response
      doc.pipe(res);
      doc.end();
    } catch (error) {
      console.error('Generate payroll PDF error:', error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.SERVER_ERROR
      });
    }
  }

  // PUT /api/v1/attendance/:id
  async updateRecord(req, res) {
    try {
      const { id } = req.params;
      const recordData = req.body;

      const result = await attendanceService.updateRecord(id, recordData);

      if (!result.success) {
        const statusCode = result.message === MESSAGES.ATTENDANCE_NOT_FOUND
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
      console.error('Update attendance record error:', error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.SERVER_ERROR
      });
    }
  }

  // DELETE /api/v1/attendance/:id
  async deleteRecord(req, res) {
    try {
      const { id } = req.params;

      const result = await attendanceService.deleteRecord(id);

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
      console.error('Delete attendance record error:', error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.SERVER_ERROR
      });
    }
  }

  // GET /api/v1/attendance/last/:employeeId
  async getLastRecord(req, res) {
    try {
      const { employeeId } = req.params;

      const record = await attendanceService.getLastRecord(employeeId);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data: record
      });
    } catch (error) {
      console.error('Get last record error:', error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.SERVER_ERROR
      });
    }
  }
}

module.exports = new AttendanceController();