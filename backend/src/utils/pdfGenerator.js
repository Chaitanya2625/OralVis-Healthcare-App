import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export function generateScanPdf(scan) {
  return new Promise((resolve, reject) => {
    const outDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const filePath = path.join(outDir, `scan-${scan.id}.pdf`);

    const doc = new PDFDocument({ autoFirstPage: true });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(20).text('OralVis Scan Report', { align: 'center' }).moveDown();

    doc.fontSize(12)
      .text(`Patient Name: ${scan.patient_name}`)
      .text(`Patient ID: ${scan.patient_id}`)
      .text(`Scan Type: ${scan.scan_type}`)
      .text(`Region: ${scan.region}`)
      .text(`Upload Date: ${new Date(scan.uploaded_at).toLocaleString()}`)
      .moveDown();

    doc.text('Scan Image:', { underline: true }).moveDown(0.5);

    // Embed image if it is a local path; otherwise place a link
    if (scan.image_url.startsWith('http') && !scan.image_url.includes('localhost/uploads/')) {
      doc.fontSize(10).fillColor('blue').text(scan.image_url, { link: scan.image_url, underline: true });
    } else {
      try {
        const localPath = scan.image_url.replace(/^https?:\/\/[^/]+/, '');
        const abs = path.join(process.cwd(), localPath);
        if (fs.existsSync(abs)) {
          doc.image(abs, { fit: [450, 300] });
        } else {
          doc.text('(Image hosted remotely. Link above if provided.)');
        }
      } catch {
        doc.text('(Image hosted remotely. Link above if provided.)');
      }
    }

    doc.end();
    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
}
