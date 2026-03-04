# OpsMedic - AI Failure Pattern Engine

OpsMedic is a production-ready MVP that analyzes CI/CD logs, classifies failure types using Machine Learning (Random Forest), and predicts probable root causes.

## Project Structure
- `backend/`: FastAPI application with Scikit-learn ML engine.
- `frontend/`: Next.js 14 App Router dashboard with TailwindCSS.

## Local Setup

### Backend
1. Navigate to `backend/`
2. Create a virtual environment: `python -m venv venv`
3. Activate venv: `source venv/bin/activate` (or `venv\Scripts\activate` on Windows)
4. Install dependencies: `pip install -r requirements.txt`
5. Run the server: `uvicorn main:app --reload`
   - Access API at: `http://localhost:8000`

### Frontend
1. Navigate to `frontend/`
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
   - Access Dashboard at: `http://localhost:3000`

## Deployment

### Vercel (Frontend)
1. Push the code to a GitHub repository.
2. Connect the repository to Vercel.
3. Use the following settings:
   - Framework Preset: `Next.js`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
4. Set Environment Variables:
   - `NEXT_PUBLIC_API_URL`: URL of your deployed backend.

### Docker (Backend)
1. Build the image: `docker build -t opsmedic-backend ./backend`
2. Run the container: `docker run -p 8000:8000 opsmedic-backend`
