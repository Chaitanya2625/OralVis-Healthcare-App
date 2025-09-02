import { run, all, get as getRow } from '../config/db.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { cloudinary, hasCloudinary } from '../config/cloudinary.js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads dir exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Multer setup
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadsDir),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    cb(null, name);
  }
});

export const upload = multer({
  storage,
  fileFilter: (_, file, cb) => {
    const ok = ['image/jpeg', 'image/png'].includes(file.mimetype);
    cb(ok ? null : new Error('Only JPG/PNG allowed'), ok);
  },
  limits: { fileSize: 8 * 1024 * 1024 } // 8MB
});

async function uploadToCloud(localPath) {
  if (!hasCloudinary) return null;

  console.log("🔑 Cloudinary config:", {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY ? "SET" : "MISSING",
    api_secret: process.env.CLOUDINARY_API_SECRET ? "SET" : "MISSING"
  });

  const res = await cloudinary.uploader.upload(localPath, {
    folder: 'oralvis-scans'
  });
  return res.secure_url;
}

export async function createScan(req, res) {
  try {
    const { patient_name, patient_id, scan_type, region } = req.body || {};
    if (!patient_name || !patient_id || !scan_type || !region || !req.file) {
      return res.status(400).json({ message: 'Missing required fields or file' });
    }

    const localPath = req.file.path;
    let imageUrl;

    try {
      if (hasCloudinary) {
        imageUrl = await uploadToCloud(localPath);
        fs.unlink(localPath, () => {}); // cleanup
      }
    } catch (err) {
      console.error("❌ Cloudinary upload failed:", err.message);
    }

    // Fallback: serve local file if Cloudinary failed
    if (!imageUrl) {
      const base = process.env.PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
      imageUrl = `${base}/uploads/${path.basename(localPath)}`;
      console.log("⚠️ Using local file instead:", imageUrl);
    }

    const now = new Date().toISOString();
    const u = await run(
      `INSERT INTO scans(patient_name, patient_id, scan_type, region, image_url, uploaded_at, uploaded_by)
       VALUES(?,?,?,?,?,?,?)`,
      [patient_name, patient_id, scan_type, region, imageUrl, now, req.user.id]
    );
    const row = await getRow('SELECT * FROM scans WHERE id = ?', [u.lastID]);
    res.status(201).json(row);
  } catch (e) {
    console.error("Upload error:", e);
    res.status(500).json({ message: 'Upload failed', error: e.message });
  }
}

export async function listScans(_req, res) {
  try {
    const rows = await all(`SELECT * FROM scans ORDER BY datetime(uploaded_at) DESC`);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: 'Fetch failed', error: e.message });
  }
}

export async function getScan(req, res) {
  try {
    const row = await getRow(`SELECT * FROM scans WHERE id = ?`, [req.params.id]);
    if (!row) return res.status(404).json({ message: 'Not found' });
    res.json(row);
  } catch (e) {
    res.status(500).json({ message: 'Fetch failed', error: e.message });
  }
}
