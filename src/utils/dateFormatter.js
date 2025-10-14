/**
 * Convert ISO 8601 date to MySQL DATETIME format
 * @param {string|Date} date - ISO date string or Date object
 * @returns {string} MySQL datetime format (YYYY-MM-DD HH:MM:SS)
 */
function toMySQLDateTime(date) {
  const d = new Date(date);
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Get current datetime in MySQL format
 * @returns {string} Current datetime in MySQL format
 */
function getCurrentMySQLDateTime() {
  return toMySQLDateTime(new Date());
}

/**
 * Format date for MySQL DATE column
 * @param {string|Date} date 
 * @returns {string} MySQL date format (YYYY-MM-DD)
 */
function toMySQLDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

module.exports = {
  toMySQLDateTime,
  getCurrentMySQLDateTime,
  toMySQLDate
};