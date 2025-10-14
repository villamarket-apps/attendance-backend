const AttendanceRecord = require('../models/AttendanceRecord');
const Employee = require('../models/Employee');
const { MESSAGES, ATTENDANCE_TYPES } = require('../constants');

class AttendanceService {
  // Create attendance record (check-in or check-out)
  async createRecord(recordData) {
    try {
      const { employee_id, type, timestamp, notes } = recordData;

      // Validate required fields
      if (!employee_id || !type || !timestamp) {
        return { 
          success: false, 
          message: 'Employee ID, type, and timestamp are required' 
        };
      }

      // Validate type
      if (type !== ATTENDANCE_TYPES.CHECK_IN && type !== ATTENDANCE_TYPES.CHECK_OUT) {
        return { 
          success: false, 
          message: 'Type must be check_in or check_out' 
        };
      }

      // Check if employee exists
      const employee = await Employee.findById(employee_id);
      if (!employee) {
        return { success: false, message: MESSAGES.EMPLOYEE_NOT_FOUND };
      }

      // Create record
      const recordId = await AttendanceRecord.create({
        employee_id,
        type,
        timestamp,
        notes
      });

      return {
        success: true,
        message: MESSAGES.ATTENDANCE_CREATED,
        recordId
      };
    } catch (error) {
      throw error;
    }
  }

  // Get today's records
  async getTodayRecords() {
    try {
      return await AttendanceRecord.findToday();
    } catch (error) {
      throw error;
    }
  }

  // Get records by employee ID
  async getRecordsByEmployee(employeeId) {
    try {
      const employee = await Employee.findById(employeeId);
      if (!employee) {
        return { success: false, message: MESSAGES.EMPLOYEE_NOT_FOUND };
      }

      const records = await AttendanceRecord.findByEmployeeId(employeeId);
      return { success: true, records };
    } catch (error) {
      throw error;
    }
  }

  // Get records by employee and date range
  async getRecordsByEmployeeAndDateRange(employeeId, startDate, endDate) {
    try {
      const employee = await Employee.findById(employeeId);
      if (!employee) {
        return { success: false, message: MESSAGES.EMPLOYEE_NOT_FOUND };
      }

      // Validate dates
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start > end) {
        return { success: false, message: MESSAGES.INVALID_DATE_RANGE };
      }

      const records = await AttendanceRecord.findByEmployeeAndDateRange(
        employeeId, 
        startDate, 
        endDate
      );

      return { success: true, records };
    } catch (error) {
      throw error;
    }
  }

  // Update attendance record
  async updateRecord(id, recordData) {
    try {
      const record = await AttendanceRecord.findById(id);
      
      if (!record) {
        return { success: false, message: MESSAGES.ATTENDANCE_NOT_FOUND };
      }

      const { employee_id, type, timestamp, notes } = recordData;

      // If employee_id is being changed, verify new employee exists
      if (employee_id && employee_id !== record.employee_id) {
        const employee = await Employee.findById(employee_id);
        if (!employee) {
          return { success: false, message: MESSAGES.EMPLOYEE_NOT_FOUND };
        }
      }

      // Update record
      await AttendanceRecord.update(id, {
        employee_id: employee_id || record.employee_id,
        type: type || record.type,
        timestamp: timestamp || record.timestamp,
        notes: notes !== undefined ? notes : record.notes
      });

      return {
        success: true,
        message: MESSAGES.ATTENDANCE_UPDATED
      };
    } catch (error) {
      throw error;
    }
  }

  // Delete attendance record
  async deleteRecord(id) {
    try {
      const record = await AttendanceRecord.findById(id);
      
      if (!record) {
        return { success: false, message: MESSAGES.ATTENDANCE_NOT_FOUND };
      }

      await AttendanceRecord.delete(id);

      return {
        success: true,
        message: MESSAGES.ATTENDANCE_DELETED
      };
    } catch (error) {
      throw error;
    }
  }

  // Calculate total hours and payment for date range
  async calculatePayroll(employeeId, startDate, endDate) {
    try {
      // Get employee
      const employee = await Employee.findById(employeeId);
      if (!employee) {
        return { success: false, message: MESSAGES.EMPLOYEE_NOT_FOUND };
      }

      // Get records
      const records = await AttendanceRecord.findByEmployeeAndDateRange(
        employeeId,
        startDate,
        endDate
      );

      if (records.length === 0) {
        return {
          success: true,
          employee: {
            id: employee.id,
            name: employee.name,
            hourly_rate: employee.hourly_rate
          },
          totalHours: 0,
          totalPayment: 0,
          records: []
        };
      }

      // Calculate hours
      const hoursData = this.calculateHoursFromRecords(records);

      return {
        success: true,
        employee: {
          id: employee.id,
          name: employee.name,
          hourly_rate: employee.hourly_rate
        },
        totalHours: hoursData.totalHours,
        totalPayment: hoursData.totalHours * employee.hourly_rate,
        dailyBreakdown: hoursData.dailyBreakdown,
        records
      };
    } catch (error) {
      throw error;
    }
  }

  // Helper: Calculate hours from records
  calculateHoursFromRecords(records) {
    let totalHours = 0;
    const dailyBreakdown = {};

    // Group records by date
    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const date = new Date(record.timestamp).toISOString().split('T')[0];

      if (!dailyBreakdown[date]) {
        dailyBreakdown[date] = {
          date,
          records: [],
          hours: 0
        };
      }

      dailyBreakdown[date].records.push(record);
    }

    // Calculate hours for each day
    Object.keys(dailyBreakdown).forEach(date => {
      const dayRecords = dailyBreakdown[date].records;
      let dayHours = 0;

      // Sort by timestamp
      dayRecords.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      // Pair check-ins with check-outs
      for (let i = 0; i < dayRecords.length - 1; i += 2) {
        if (dayRecords[i].type === ATTENDANCE_TYPES.CHECK_IN && 
            dayRecords[i + 1] && 
            dayRecords[i + 1].type === ATTENDANCE_TYPES.CHECK_OUT) {
          
          const checkIn = new Date(dayRecords[i].timestamp);
          const checkOut = new Date(dayRecords[i + 1].timestamp);
          const hours = (checkOut - checkIn) / (1000 * 60 * 60); // Convert to hours
          
          dayHours += hours;
        }
      }

      dailyBreakdown[date].hours = Math.round(dayHours * 100) / 100; // Round to 2 decimals
      totalHours += dayHours;
    });

    return {
      totalHours: Math.round(totalHours * 100) / 100,
      dailyBreakdown: Object.values(dailyBreakdown)
    };
  }

  // Get last record for employee (to know if they're checked in or out)
  async getLastRecord(employeeId) {
    try {
      const record = await AttendanceRecord.getLastRecord(employeeId);
      return record;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AttendanceService();