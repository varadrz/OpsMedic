# 🏥 OpsMedic
**AI-Powered CI/CD Failure Analysis & Prediction Engine**

OpsMedic is a sophisticated DevOps observability tool designed to intelligently classify and analyze software failure patterns. By leveraging Machine Learning (Random Forest), it transforms raw log data into actionable root-cause insights, helping engineers resolve infrastructure and application issues faster.

---

## 🚀 Key Features

- **Automated Root-Cause Analysis**: Instantly classify logs into failure categories (Timeout, Dependency, Assertion, etc.).
- **GitHub Repository Analysis**: Fetch and analyze recent workflow logs directly from your GitHub repositories.
- **ML Training Dashboard**: Retrain and refine the underlying model with fresh data to improve accuracy.
- **Visual Analytics**: Interactive dashboard with confidence scores and feature importance.
- **Persistence**: Full history tracking of all log analyses for audit and pattern recognition.

---

## 🛠️ Technology Stack

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | Next.js 14, React, TailwindCSS | Direct Data Input & Repo Analysis Dashboard |
| **Backend** | FastAPI, Python | High-performance Async API Layer |
| **ML Engine** | Scikit-learn (Random Forest) | Classification & Feature Extraction |
| **Database** | SQLite (SQLAlchemy) | Analysis Persistence & History |
| **Deployment**| Vercel | Native Hybrid Deployment |

---

## 📦 Project Structure

```bash
OpsMedic/
├── api/              # Vercel Serverless Entry Point
├── backend/          # FastAPI App & ML Engine
│   ├── main.py       # API Endpoints & Logic
│   ├── engine.py     # ML Model Implementation
│   └── database.py   # SQLAlchemy Configuration
└── frontend/         # Next.js Dashboard
    └── src/app       # Interactive UI & State
```

---

## ⚙️ Quick Start

### 1. Prerequisites
- Python 3.9+
- Node.js 18+

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate | Unix: source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```
*API accessible at `http://localhost:8000`*

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Dashboard accessible at `http://localhost:3000`*

---

## ☁️ Deployment

OpsMedic is optimized for **Vercel**. 

- **Frontend**: Automatically detected as a Next.js project.
- **Backend**: Native Python runtime support via the `api/` directory.
- **Environment**: Remove any `NEXT_PUBLIC_API_URL` to allow the app to use its intelligent relative routing.

---

*OpsMedic — Engineering Reliability through Intelligence.*
