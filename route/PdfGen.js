const PDFDocument = require('pdfkit');

async function generatePdf(formData) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();

    // Pipe the PDF document to a buffer
    const buffers = [];
    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve(pdfBuffer);
    });

    // PDF generation logic
    doc.fontSize(24).text('Form Data', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text(`Name: ${formData.name}`);
    doc.fontSize(16).text(`Gender: ${formData.gender}`);
    // Add more fields as needed

    // Finalize the PDF document
    doc.end();
  });
}

module.exports = {
  generatePdf,
};
