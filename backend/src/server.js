import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import './models/init.js'; // initialize/seed DB on first run

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));
