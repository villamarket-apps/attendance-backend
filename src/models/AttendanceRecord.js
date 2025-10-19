const { pool } = require('../config/database');
const { toMySQLDateTime } = require('../utils/dateFormatter');

class AttendanceRecord {
  // Create new attendance record
  static async create(recordData) {
    try {
      const { employee_id, type, timestamp, notes = null } = recordData;

      // Convert timestamp to MySQL format
      const mysqlTimestamp = toMySQLDateTime(timestamp);

      const [result] = await pool.query(
        'INSERT INTO attendance_records (employee_id, type, timestamp, notes) VALUES (?, ?, ?, ?)',
        [employee_id, type, mysqlTimestamp, notes]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Find record by ID
  static async findById(id) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM attendance_records WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Get all records for an employee
  static async findByEmployeeId(employeeId) {
    try {
      const [rows] = await pool.query(
        `SELECT ar.*, e.name as employee_name 
       FROM attendance_records ar
       JOIN employees e ON ar.employee_id = e.id
       WHERE ar.employee_id = ? 
       ORDER BY ar.timestamp DESC`,
        [employeeId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get records by employee and date range
  static async findByEmployeeAndDateRange(employeeId, startDate, endDate) {
    try {
      const [rows] = await pool.query(
        `SELECT ar.*, e.name as employee_name 
       FROM attendance_records ar
       JOIN employees e ON ar.employee_id = e.id
       WHERE ar.employee_id = ? 
       AND ar.timestamp >= ? 
       AND ar.timestamp <= ?
       ORDER BY ar.timestamp ASC`,
        [employeeId, startDate, endDate]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get records for a specific date
  static async findByDate(date) {
    try {
      const [rows] = await pool.query(
        `SELECT ar.*, e.name as employee_name 
         FROM attendance_records ar
         JOIN employees e ON ar.employee_id = e.id
         WHERE DATE(ar.timestamp) = ?
         ORDER BY ar.timestamp DESC`,
        [date]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get today's records
  static async findToday() {
    try {
      const [rows] = await pool.query(
        `SELECT ar.*, e.name as employee_name 
         FROM attendance_records ar
         JOIN employees e ON ar.employee_id = e.id
         WHERE DATE(ar.timestamp) = CURDATE()
         ORDER BY ar.timestamp DESC`
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Update attendance record
  static async update(id, recordData) {
    try {
      const { employee_id, type, timestamp, notes } = recordData;
      const [result] = await pool.query(
        'UPDATE attendance_records SET employee_id = ?, type = ?, timestamp = ?, notes = ? WHERE id = ?',
        [employee_id, type, timestamp, notes, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Delete attendance record
  static async delete(id) {
    try {
      const [result] = await pool.query(
        'DELETE FROM attendance_records WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get last record for an employee
  static async getLastRecord(employeeId) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM attendance_records WHERE employee_id = ? ORDER BY timestamp DESC LIMIT 1',
        [employeeId]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AttendanceRecord;