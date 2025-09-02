import { get } from '../config/db.js';
import { generateScanPdf } from '../utils/pdfGenerator.js';
import path from 'path';
import fs from 'fs';

export async function downloadReport(req, res) {
  try {
    const scan = await get('SELECT * FROM scans WHERE id = ?', [req.params.id]);
    if (!scan) return res.status(404).json({ message: 'Scan not found' });
    const pdfPath = await generateScanPdf(scan);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=scan-${scan.id}.pdf`);
    const stream = fs.createReadStream(pdfPath);
    stream.pipe(res).on('finish', () => {
      // optional cleanup
      setTimeout(() => fs.unlink(pdfPath, () => {}), 5000);
    });
  } catch (e) {
    res.status(500).json({ message: 'PDF generation failed', error: e.message });
  }
}
