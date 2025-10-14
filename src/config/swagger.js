const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Attendance System API',
      version: '1.0.0',
      description: 'API documentation for Employee Attendance Tracking System',
      contact: {
        name: 'API Support'
      }
    },
    servers: [
      {
        url: 'https://attendance-backend-a2h0.onrender.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Employee: {
          type: 'object',
          required: ['name', 'dni', 'hourly_rate', 'hire_date'],
          properties: {
            id: {
              type: 'integer',
              description: 'Employee ID'
            },
            name: {
              type: 'string',
              description: 'Employee full name'
            },
            dni: {
              type: 'string',
              description: 'Employee DNI (unique)'
            },
            hourly_rate: {
              type: 'number',
              format: 'float',
              description: 'Hourly rate in currency'
            },
            hire_date: {
              type: 'string',
              format: 'date',
              description: 'Hire date (YYYY-MM-DD)'
            },
            is_active: {
              type: 'boolean',
              description: 'Employee active status'
            }
          }
        },
        AttendanceRecord: {
          type: 'object',
          required: ['employee_id', 'type', 'timestamp'],
          properties: {
            id: {
              type: 'integer',
              description: 'Record ID'
            },
            employee_id: {
              type: 'integer',
              description: 'Employee ID'
            },
            type: {
              type: 'string',
              enum: ['check_in', 'check_out'],
              description: 'Type of record'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Record timestamp'
            },
            notes: {
              type: 'string',
              description: 'Optional notes'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js'] // Path to the API routes
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

module.exports = swaggerSpec;