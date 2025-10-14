const PDFDocument = require('pdfkit');

/**
 * Generate payroll report PDF
 * @param {Object} payrollData - Payroll data from attendanceService.calculatePayroll
 * @param {string} startDate - Start date string
 * @param {string} endDate - End date string
 * @returns {PDFDocument} PDF document stream
 */
function generatePayrollPDF(payrollData, startDate, endDate) {
  const doc = new PDFDocument({ margin: 50 });

  const { employee, totalHours, totalPayment, dailyBreakdown, records } = payrollData;

  // Title
  doc.fontSize(20)
     .font('Helvetica-Bold')
     .text('Reporte', { align: 'center' });

  doc.moveDown();

  // Date range
  doc.fontSize(12)
     .font('Helvetica')
     .text(`Periodo: ${formatDate(startDate)} - ${formatDate(endDate)}`, { align: 'center' });

  doc.moveDown(2);

  // Employee information
  doc.fontSize(14)
     .font('Helvetica-Bold')
     .text('Informacion');

  doc.fontSize(11)
     .font('Helvetica')
     .text(`Nombre: ${employee.name}`)
     .moveDown();

  // Summary box
  doc.fontSize(14)
     .font('Helvetica-Bold')
     .text('Resumen');

  doc.fontSize(11)
     .font('Helvetica')
     .text(`Total de Horas Trabajadas: ${totalHours.toFixed(2)} horas`)
     .text(`Total de Pago: $${totalPayment.toFixed(2)}`)
     .moveDown(2);

  // Daily breakdown
  doc.fontSize(14)
     .font('Helvetica-Bold')
     .text('Observaciones Diarias');

  doc.moveDown(0.5);

  // Check if there are records
  if (!dailyBreakdown || dailyBreakdown.length === 0) {
    doc.fontSize(11)
       .font('Helvetica')
       .text('No se encontraron registros de asistencia para este periodo.', { align: 'center' });
    
    doc.moveDown(3);
    doc.fontSize(8)
       .font('Helvetica')
       .text(`Generado el: ${new Date().toLocaleString()}`, { align: 'center' });
    
    return doc;
  }

  // Table header
  const tableTop = doc.y;
  const col1X = 50;
  const col2X = 200;
  const col3X = 350;
  const col4X = 450;

  doc.fontSize(10)
     .font('Helvetica-Bold');

  doc.text('Fecha', col1X, tableTop);
  doc.text('Ingreso', col2X, tableTop);
  doc.text('Salida', col3X, tableTop);
  doc.text('Horas', col4X, tableTop);

  // Draw line under header
  doc.moveTo(col1X, doc.y + 5)
     .lineTo(550, doc.y + 5)
     .stroke();

  doc.moveDown(0.5);

  // Table rows
  doc.font('Helvetica').fontSize(9);

  dailyBreakdown.forEach(day => {
    const dayRecords = day.records;
    let currentY = doc.y;

    // Group check-ins and check-outs
    for (let i = 0; i < dayRecords.length; i += 2) {
      if (i > 0) {
        currentY = doc.y;
      }

      const checkIn = dayRecords[i];
      const checkOut = dayRecords[i + 1];

      if (i === 0) {
        doc.text(formatDate(day.date), col1X, currentY);
      } else {
        doc.text('', col1X, currentY); // Empty for continuation
      }

      if (checkIn && checkIn.type === 'check_in') {
        doc.text(formatTime(checkIn.timestamp), col2X, currentY);
      }

      if (checkOut && checkOut.type === 'check_out') {
        doc.text(formatTime(checkOut.timestamp), col3X, currentY);
        
        // Calculate hours for this pair
        const hours = calculateHoursBetween(checkIn.timestamp, checkOut.timestamp);
        doc.text(hours.toFixed(2), col4X, currentY);
      }

      doc.moveDown(0.3);
    }

    // Daily total
    // doc.font('Helvetica-Bold')
    //    .text(`Total Diario: ${day.hours.toFixed(2)} horas`, col3X, doc.y);
    
    doc.font('Helvetica');
    doc.moveDown(0.5);

    // Add page break if needed
    if (doc.y > 700) {
      doc.addPage();
    }
  });

  // Draw line before total
  doc.moveDown();
  doc.moveTo(col1X, doc.y)
     .lineTo(550, doc.y)
     .stroke();

  doc.moveDown(0.5);

  // Grand total
  doc.fontSize(12)
     .font('Helvetica-Bold')
     .text(`TOTAL HORAS: ${totalHours.toFixed(2)}`, col3X, doc.y)
     .moveDown(0.3)
     .text(`TOTAL DE PAGO: $${totalPayment.toFixed(2)}`, col3X, doc.y);

  // Footer
  doc.moveDown(3);
  doc.fontSize(8)
     .font('Helvetica')
     .text(`Generado el: ${new Date().toLocaleString()}`, { align: 'center' });

  return doc;
}

/**
 * Format date for display
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${day}/${month}/${year}`;
}

/**
 * Format time for display (HH:MM)
 */
function formatTime(timestamp) {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Calculate hours between two timestamps
 */
function calculateHoursBetween(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return (endDate - startDate) / (1000 * 60 * 60);
}

module.exports = {
  generatePayrollPDF
};