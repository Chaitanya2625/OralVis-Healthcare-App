import { Router } from 'express';
import { authRequired, requireRole } from '../middleware/authMiddleware.js';
import { createScan, listScans, getScan, upload } from '../controllers/scanController.js';

const router = Router();

// Only Technician can upload
router.post(
  '/',
  authRequired,
  requireRole('technician'),
  upload.single('image'),
  createScan
);

// Only Dentist can list scans (as per brief)
router.get('/', authRequired, requireRole('dentist'), listScans);

// Common: fetch single (allow dentist; feel free to tighten)
router.get('/:id', authRequired, requireRole('dentist'), getScan);

export default router;
