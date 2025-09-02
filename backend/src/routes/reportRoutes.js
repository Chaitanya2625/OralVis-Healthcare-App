import { Router } from 'express';
import { authRequired, requireRole } from '../middleware/authMiddleware.js';
import { downloadReport } from '../controllers/reportController.js';

const router = Router();
// Dentist downloads per-scan PDF
router.get('/:id/pdf', authRequired, requireRole('dentist'), downloadReport);
export default router;
