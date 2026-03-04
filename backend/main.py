from fastapi import FastAPI, Depends, HTTPException, Body, Query, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import json
import pandas as pd
from datetime import datetime
from typing import Optional

import models, engine, database
from database import engine as db_engine, get_db
from github import Github
import httpx
import os
import seed_data
from sklearn.model_selection import train_test_split as sk_train_test_split

# Create database tables
models.Base.metadata.create_all(bind=db_engine)

app = FastAPI(title="OpsMedic API")

# Use a router to handle both / and /api prefixes (for Vercel)
router = APIRouter()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ml_engine = engine.MLModel()

@app.on_event("startup")
async def startup_event():
    # If model is not trained, seed it
    if not ml_engine.is_trained:
        print("Model not trained. Seeding baseline data...")
        data = pd.DataFrame(seed_data.BASELINE_LOGS)
        ml_engine.train(data)
        print(f"ML Model seeded with {len(seed_data.BASELINE_LOGS)} baseline records.")

@router.get("/")
async def root():
    return {"message": "OpsMedic API is running"}

@router.post("/predict")
async def predict_failure(log_data: dict = Body(...), db: Session = Depends(get_db)):
    content = log_data.get("content", "")
    session_id = log_data.get("session_id")
    if not content:
        raise HTTPException(status_code=400, detail="Log content is required")
    
    # Extract features
    features = engine.FeatureExtractor.extract(content)
    
    # Predict
    label, confidence = ml_engine.predict(content)
    top_keywords = ml_engine.get_top_keywords(content)
    is_safe = label.lower() in ["safe", "healthy", "healthy / safe"]
    
    # Save to history
    db_record = models.LogRecord(
        content=content,
        extracted_features=json.dumps(features),
        predicted_label=label,
        confidence=confidence,
        session_id=session_id
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    
    return {
        "id": db_record.id,
        "prediction": label,
        "confidence": confidence,
        "features": features,
        "top_keywords": top_keywords,
        "timestamp": db_record.timestamp,
        "is_safe": is_safe
    }

@router.post("/train")
async def train_model(db: Session = Depends(get_db)):
    # Fetch records with actual labels
    labeled_records = db.query(models.LogRecord).filter(models.LogRecord.actual_label != None).all()
    
    # Combine with seed data for a stronger base
    seed_df = pd.DataFrame(seed_data.BASELINE_LOGS)
    
    if labeled_records:
        user_df = pd.DataFrame([{
            "content": r.content,
            "label": r.actual_label
        } for r in labeled_records])
        data = pd.concat([seed_df, user_df], ignore_index=True)
    else:
        data = seed_df
    
    if len(data) < 5:
        return {"status": "error", "message": "Not enough data for training"}
    
    # Simple accuracy check using split
    try:
        train_data, test_data = sk_train_test_split(data, test_size=0.2, random_state=42)
        ml_engine.train(train_data)
        
        # Test accuracy on the 20% split
        correct = 0
        for _, row in test_data.iterrows():
            pred, _ = ml_engine.predict(row['content'])
            if pred == row['label']:
                correct += 1
        
        accuracy = correct / len(test_data) if len(test_data) > 0 else 1.0
        
        # Final train on full data
        ml_engine.train(data)
        
        return {
            "status": "success", 
            "message": f"Model trained on {len(data)} records",
            "accuracy": f"{accuracy:.2%}"
        }
    except Exception as e:
        # Fallback if split fails (e.g. too few samples of a class)
        ml_engine.train(data)
        return {"status": "success", "message": f"Model trained on {len(data)} records (accuracy check skipped)"}

@router.get("/history")
async def get_history(session_id: Optional[str] = Query(None), db: Session = Depends(get_db)):
    query = db.query(models.LogRecord)
    if session_id:
        query = query.filter(models.LogRecord.session_id == session_id)
    records = query.order_by(models.LogRecord.timestamp.desc()).limit(50).all()
    return [{"id": r.id, "prediction": r.predicted_label, "confidence": r.confidence, "timestamp": r.timestamp} for r in records]

@router.post("/analyze-repo")
async def analyze_repo(repo_data: dict = Body(...), db: Session = Depends(get_db)):
    repo_url = repo_data.get("url", "")
    session_id = repo_data.get("session_id")
    if not repo_url:
        raise HTTPException(status_code=400, detail="Repository URL is required")
    
    # Extract owner/repo from URL
    try:
        # Expected: https://github.com/owner/repo
        parts = repo_url.strip("/").split("/")
        owner, repo_name = parts[-2], parts[-1]
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid GitHub repository URL. Expected format: https://github.com/owner/repo")

    try:
        # Initialize GitHub client
        g = Github()
        repo = g.get_repo(f"{owner}/{repo_name}")
        
        # Get latest failed workflow runs
        runs = repo.get_workflow_runs(status="failure")
        if runs.totalCount == 0:
            # Save healthy result to history too
            db_record = models.LogRecord(
                content=f"Repository scan: {repo_url} - No failures found",
                extracted_features=json.dumps({}),
                predicted_label="Healthy / Safe",
                confidence=1.0,
                session_id=session_id
            )
            db.add(db_record)
            db.commit()
            db.refresh(db_record)

            return {
                "id": db_record.id,
                "status": "success", 
                "message": "No failed workflow runs found. This repository is healthy!",
                "prediction": "Healthy / Safe",
                "confidence": 1.0,
                "is_safe": True,
                "features": {},
                "top_keywords": [],
                "timestamp": db_record.timestamp
            }
        
        latest_run = runs[0]
        jobs = latest_run.jobs()
        failed_job = next((j for j in jobs if j.conclusion == "failure"), None)
        
        if not failed_job:
            return {"status": "error", "message": "Could not identify the failed job in the latest run."}

        # Fetch logs via the API (using httpx for the redirect)
        log_url = f"https://api.github.com/repos/{owner}/{repo_name}/actions/jobs/{failed_job.id}/logs"
        
        async with httpx.AsyncClient() as client:
            response = await client.get(log_url, follow_redirects=True)
            if response.status_code != 200:
                return {"status": "error", "message": f"Failed to fetch logs from GitHub (HTTP {response.status_code})"}
            
            log_content = response.text

        # Analyze
        features = engine.FeatureExtractor.extract(log_content)
        label, confidence = ml_engine.predict(log_content)
        top_keywords = ml_engine.get_top_keywords(log_content)
        is_safe = label.lower() in ["safe", "healthy", "healthy / safe"]
        
        # Save to history (truncate for DB)
        db_record = models.LogRecord(
            content=log_content[:5000],
            extracted_features=json.dumps(features),
            predicted_label=label,
            confidence=confidence,
            session_id=session_id
        )
        db.add(db_record)
        db.commit()
        db.refresh(db_record)
        
        return {
            "id": db_record.id,
            "prediction": label,
            "confidence": confidence,
            "features": features,
            "top_keywords": top_keywords,
            "timestamp": db_record.timestamp,
            "is_safe": is_safe,
            "job_name": failed_job.name,
            "run_url": latest_run.html_url
        }

    except Exception as e:
        print(f"Repo analysis error: {e}")
        raise HTTPException(status_code=500, detail=f"GitHub API error: {str(e)}")

# Include the router twice: with and without /api prefix
app.include_router(router)
app.include_router(router, prefix="/api")
