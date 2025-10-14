const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const authMiddleware = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

/**
 * @swagger
 * /api/v1/attendance:
 *   post:
 *     summary: Create attendance record (check-in or check-out)
 *     tags: [Attendance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AttendanceRecord'
 *     responses:
 *       201:
 *         description: Record created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', attendanceController.createRecord.bind(attendanceController));

/**
 * @swagger
 * /api/v1/attendance/today:
 *   get:
 *     summary: Get today's attendance records
 *     tags: [Attendance]
 *     responses:
 *       200:
 *         description: List of today's records
 */
router.get('/today', attendanceController.getTodayRecords.bind(attendanceController));

/**
 * @swagger
 * /api/v1/attendance/employee/{employeeId}:
 *   get:
 *     summary: Get attendance records by employee
 *     tags: [Attendance]
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of attendance records
 */
router.get('/employee/:employeeId', attendanceController.getRecordsByEmployee.bind(attendanceController));

/**
 * @swagger
 * /api/v1/attendance/payroll/{employeeId}/pdf:
 *   get:
 *     summary: Generate PDF payroll report for employee
 *     tags: [Attendance]
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: start_date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-10-01
 *       - in: query
 *         name: end_date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-10-12
 *     responses:
 *       200:
 *         description: PDF file
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Invalid date range
 */
router.get('/payroll/:employeeId/pdf', attendanceController.getPayrollPDF.bind(attendanceController));

/**
 * @swagger
 * /api/v1/attendance/payroll/{employeeId}:
 *   get:
 *     summary: Calculate payroll for employee
 *     tags: [Attendance]
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: start_date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-10-01
 *       - in: query
 *         name: end_date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-10-12
 *     responses:
 *       200:
 *         description: Payroll calculation with hours and payment
 *       400:
 *         description: Invalid date range
 */
router.get('/payroll/:employeeId', attendanceController.getPayroll.bind(attendanceController));

/**
 * @swagger
 * /api/v1/attendance/last/{employeeId}:
 *   get:
 *     summary: Get last attendance record for employee
 *     tags: [Attendance]
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Last attendance record
 */
router.get('/last/:employeeId', attendanceController.getLastRecord.bind(attendanceController));

/**
 * @swagger
 * /api/v1/attendance/{id}:
 *   put:
 *     summary: Update attendance record
 *     tags: [Attendance]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AttendanceRecord'
 *     responses:
 *       200:
 *         description: Record updated successfully
 *       404:
 *         description: Record not found
 */
router.put('/:id', attendanceController.updateRecord.bind(attendanceController));

/**
 * @swagger
 * /api/v1/attendance/{id}:
 *   delete:
 *     summary: Delete attendance record
 *     tags: [Attendance]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Record deleted successfully
 *       404:
 *         description: Record not found
 */
router.delete('/:id', attendanceController.deleteRecord.bind(attendanceController));

module.exports = router;