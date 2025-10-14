const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function hashAdminPassword() {
  try {
    // Create connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('Connected to database');

    // Hash password
    const plainPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    console.log('Hashed password:', hashedPassword);

    // Update password in database
    await connection.query(
      'UPDATE users SET password = ? WHERE username = ?',
      [hashedPassword, 'admin']
    );

    console.log('✅ Admin password updated successfully');
    console.log('Username: admin');
    console.log('Password: admin123');

    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

hashAdminPassword();