import { db, run } from '../config/db.js';
import bcrypt from 'bcryptjs';

async function init() {
  await run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT CHECK(role IN ('technician','dentist')) NOT NULL
  );`);

  await run(`CREATE TABLE IF NOT EXISTS scans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_name TEXT NOT NULL,
    patient_id TEXT NOT NULL,
    scan_type TEXT CHECK(scan_type IN ('RGB')) NOT NULL,
    region TEXT CHECK(region IN ('Frontal','Upper Arch','Lower Arch')) NOT NULL,
    image_url TEXT NOT NULL,
    uploaded_at TEXT NOT NULL,
    uploaded_by INTEGER NOT NULL,
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
  );`);

  // Seed demo users if they don't exist
  const techPass = await bcrypt.hash('tech123', 10);
  const dentistPass = await bcrypt.hash('dentist123', 10);

  await run(`INSERT OR IGNORE INTO users(email, password_hash, role) VALUES
    ('tech@oralvis.com', ?, 'technician')`, [techPass]);

  await run(`INSERT OR IGNORE INTO users(email, password_hash, role) VALUES
    ('dentist@oralvis.com', ?, 'dentist')`, [dentistPass]);

  console.log('DB initialized. Default users:');
  console.log('Technician -> email: tech@oralvis.com, password: tech123');
  console.log('Dentist    -> email: dentist@oralvis.com, password: dentist123');
}

// Run initializer
init().catch(e => {
  console.error('DB init failed:', e);
});
