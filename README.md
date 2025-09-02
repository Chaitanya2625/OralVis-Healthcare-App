# OralVis Healthcare App

OralVis is a healthcare web application built with a **React frontend** and **Node.js/Express backend**.  
It supports two roles:

- **Technician** → Upload patient scans (JPG/PNG).
- **Dentist** → View patient scans and download reports (PDF).

---

## 🚀 Features
- Authentication (JWT-based).
- Technician: upload dental scans.
- Dentist: view scans and generate PDF reports.
- Image uploads stored locally or in **Cloudinary**.
- SQLite database for persistence.

---

## 🛠 Tech Stack
- **Frontend**: React, TailwindCSS, Axios
- **Backend**: Node.js, Express, SQLite, JWT, Multer, Cloudinary
- **Database**: SQLite (file-based)
- **Deployment-ready**: Works locally or can be deployed with Docker/Cloud

---

## 📂 Project Structure
oralvis-healthcare-app/
├── backend/ # Express backend
├── frontend/ # React frontend
├── uploads/ # Local uploads (if Cloudinary not configured)
└── README.md # Main project docs

yaml
Copy code

---

## ⚙️ Setup Instructions

### 1. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/oralvis-healthcare-app.git
cd oralvis-healthcare-app
2. Backend Setup
See backend/README.md

3. Frontend Setup
See frontend/README.md

👥 Default Users
When you run the seed command:

Technician

Email: tech@oralvis.com

Password: tech123

Dentist

Email: dentist@oralvis.com

Password: dentist123

yaml
Copy code

---

## 📄 backend/README.md

```markdown
# OralVis Backend

Express.js backend with authentication, role-based access, and scan/report APIs.

---

## 🔧 Setup

### 1. Install Dependencies
```bash
cd backend
npm install
2. Environment Variables
Create .env in backend/:

ini
Copy code
PORT=5000
JWT_SECRET=supersecretkey

# Optional Cloudinary (for image hosting)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
3. Initialize Database
bash
Copy code
npm run seed
This will create the SQLite DB and insert default users.

4. Start Server
bash
Copy code
npm run dev
Server will run at:
👉 http://localhost:5000

🔗 API Endpoints
Authentication
POST /api/auth/login → returns JWT

Scans
POST /api/scans (technician only) → upload scan

GET /api/scans (dentist only) → list scans

GET /api/scans/:id (dentist only) → fetch single scan

Reports
GET /api/reports/:id/pdf (dentist only) → download PDF report

📦 Notes
If Cloudinary is not configured, images will be stored in /uploads locally.

Use Authorization: Bearer <token> in headers for all protected routes.

yaml
Copy code

---

## 📄 frontend/README.md

```markdown
# OralVis Frontend

React frontend for OralVis Healthcare App.  
Technicians can upload scans; Dentists can view and download reports.

---

## 🔧 Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
2. Configure API URL
Create .env in frontend/:
bash
VITE_API_URL=http://localhost:5000/api
3. Run Development Server
bash
npm run dev
Frontend will run at:
👉 http://localhost:5173

🖥 Usage
Login as Technician or Dentist.

Technician → Fill form & upload JPG/PNG.

Dentist → View scans and generate PDF reports.

