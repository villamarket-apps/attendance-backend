const { pool } = require('../config/database');
const { toMySQLDate } = require('../utils/dateFormatter');

class Employee {
  // Get all employees
  static async findAll(onlyActive = false) {
    try {
      let query = 'SELECT * FROM employees';
      if (onlyActive) {
        query += ' WHERE is_active = true';
      }
      query += ' ORDER BY name ASC';
      
      const [rows] = await pool.query(query);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Find employee by ID
  static async findById(id) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM employees WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Find employee by DNI
  static async findByDni(dni) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM employees WHERE dni = ?',
        [dni]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Create new employee
  static async create(employeeData) {
    try {
      const { name, dni, hourly_rate, hire_date, is_active = true } = employeeData;
      const mysqlDate = toMySQLDate(hire_date);
      
      const [result] = await pool.query(
        'INSERT INTO employees (name, dni, hourly_rate, hire_date, is_active) VALUES (?, ?, ?, ?, ?)',
        [name, dni, hourly_rate, mysqlDate, is_active]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Update employee
  static async update(id, employeeData) {
    try {
      const { name, dni, hourly_rate, hire_date, is_active } = employeeData;
      const mysqlDate = toMySQLDate(hire_date);
      
      const [result] = await pool.query(
        'UPDATE employees SET name = ?, dni = ?, hourly_rate = ?, hire_date = ?, is_active = ? WHERE id = ?',
        [name, dni, hourly_rate, mysqlDate, is_active, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Delete employee (soft delete - set is_active to false)
  static async softDelete(id) {
    try {
      const [result] = await pool.query(
        'UPDATE employees SET is_active = false WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Hard delete employee (permanent delete)
  static async hardDelete(id) {
    try {
      const [result] = await pool.query(
        'DELETE FROM employees WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Update only hourly rate
  static async updateHourlyRate(id, hourlyRate) {
    try {
      const [result] = await pool.query(
        'UPDATE employees SET hourly_rate = ? WHERE id = ?',
        [hourlyRate, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Employee;