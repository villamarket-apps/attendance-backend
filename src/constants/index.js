// Attendance record types
const ATTENDANCE_TYPES = {
  CHECK_IN: 'check_in',
  CHECK_OUT: 'check_out'
};

// HTTP Status codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

// Response messages
const MESSAGES = {
  // Auth
  LOGIN_SUCCESS: 'Login successful',
  LOGIN_FAILED: 'Invalid credentials',
  UNAUTHORIZED: 'Unauthorized access',
  
  // Employee
  EMPLOYEE_CREATED: 'Employee created successfully',
  EMPLOYEE_UPDATED: 'Employee updated successfully',
  EMPLOYEE_DELETED: 'Employee deleted successfully',
  EMPLOYEE_NOT_FOUND: 'Employee not found',
  DNI_ALREADY_EXISTS: 'DNI already exists',
  
  // Attendance
  ATTENDANCE_CREATED: 'Attendance record created successfully',
  ATTENDANCE_UPDATED: 'Attendance record updated successfully',
  ATTENDANCE_DELETED: 'Attendance record deleted successfully',
  ATTENDANCE_NOT_FOUND: 'Attendance record not found',
  INVALID_DATE_RANGE: 'Invalid date range',
  
  // General
  SERVER_ERROR: 'Internal server error',
  VALIDATION_ERROR: 'Validation error'
};

module.exports = {
  ATTENDANCE_TYPES,
  HTTP_STATUS,
  MESSAGES
};