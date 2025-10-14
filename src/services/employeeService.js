const Employee = require('../models/Employee');
const { MESSAGES } = require('../constants');

class EmployeeService {
  // Get all employees
  async getAllEmployees(onlyActive = false) {
    try {
      return await Employee.findAll(onlyActive);
    } catch (error) {
      throw error;
    }
  }

  // Get employee by ID
  async getEmployeeById(id) {
    try {
      const employee = await Employee.findById(id);
      
      if (!employee) {
        return { success: false, message: MESSAGES.EMPLOYEE_NOT_FOUND };
      }

      return { success: true, employee };
    } catch (error) {
      throw error;
    }
  }

  // Create new employee
  async createEmployee(employeeData) {
    try {
      const { name, dni, hourly_rate, hire_date, is_active } = employeeData;

      // Validate required fields
      if (!name || !dni || !hourly_rate || !hire_date) {
        return { 
          success: false, 
          message: 'Name, DNI, hourly rate, and hire date are required' 
        };
      }

      // Check if DNI already exists
      const existingEmployee = await Employee.findByDni(dni);
      if (existingEmployee) {
        return { success: false, message: MESSAGES.DNI_ALREADY_EXISTS };
      }

      // Create employee
      const employeeId = await Employee.create({
        name,
        dni,
        hourly_rate,
        hire_date,
        is_active: is_active !== undefined ? is_active : true
      });

      return {
        success: true,
        message: MESSAGES.EMPLOYEE_CREATED,
        employeeId
      };
    } catch (error) {
      throw error;
    }
  }

  // Update employee
  async updateEmployee(id, employeeData) {
    try {
      const { name, dni, hourly_rate, hire_date, is_active } = employeeData;

      // Check if employee exists
      const employee = await Employee.findById(id);
      if (!employee) {
        return { success: false, message: MESSAGES.EMPLOYEE_NOT_FOUND };
      }

      // If DNI is being changed, check if new DNI already exists
      if (dni && dni !== employee.dni) {
        const existingEmployee = await Employee.findByDni(dni);
        if (existingEmployee) {
          return { success: false, message: MESSAGES.DNI_ALREADY_EXISTS };
        }
      }

      // Update employee
      const updated = await Employee.update(id, {
        name: name || employee.name,
        dni: dni || employee.dni,
        hourly_rate: hourly_rate !== undefined ? hourly_rate : employee.hourly_rate,
        hire_date: hire_date || employee.hire_date,
        is_active: is_active !== undefined ? is_active : employee.is_active
      });

      if (!updated) {
        return { success: false, message: 'Failed to update employee' };
      }

      return {
        success: true,
        message: MESSAGES.EMPLOYEE_UPDATED
      };
    } catch (error) {
      throw error;
    }
  }

  // Delete employee (soft delete)
  async deleteEmployee(id) {
    try {
      const employee = await Employee.findById(id);
      
      if (!employee) {
        return { success: false, message: MESSAGES.EMPLOYEE_NOT_FOUND };
      }

      await Employee.softDelete(id);

      return {
        success: true,
        message: MESSAGES.EMPLOYEE_DELETED
      };
    } catch (error) {
      throw error;
    }
  }

  // Permanently delete employee
  async permanentlyDeleteEmployee(id) {
    try {
      const employee = await Employee.findById(id);
      
      if (!employee) {
        return { success: false, message: MESSAGES.EMPLOYEE_NOT_FOUND };
      }

      await Employee.hardDelete(id);

      return {
        success: true,
        message: 'Employee permanently deleted'
      };
    } catch (error) {
      throw error;
    }
  }

  // Update only hourly rate
  async updateHourlyRate(id, hourlyRate) {
    try {
      // Validate hourly rate
      if (hourlyRate === undefined || hourlyRate === null || hourlyRate < 0) {
        return { 
          success: false, 
          message: 'Valid hourly rate is required' 
        };
      }

      // Check if employee exists
      const employee = await Employee.findById(id);
      if (!employee) {
        return { success: false, message: MESSAGES.EMPLOYEE_NOT_FOUND };
      }

      // Update hourly rate
      const updated = await Employee.updateHourlyRate(id, hourlyRate);

      if (!updated) {
        return { success: false, message: 'Failed to update hourly rate' };
      }

      return {
        success: true,
        message: 'Hourly rate updated successfully'
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new EmployeeService();