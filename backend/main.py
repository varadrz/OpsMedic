from fastapi import FastAPI, Depends, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import json
import pandas as pd
from datetime import datetime

import models, engine, database
from database import engine as db_engine, get_db
from github import Github
import httpx
import os

# Create database tables
models.Base.metadata.create_all(bind=db_engine)

app = FastAPI(title="OpsMedic API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ml_engine = engine.MLModel()

@app.get("/")
async def root():
    return {"message": "OpsMedic API is running"}

@app.post("/predict")
async def predict_failure(log_data: dict = Body(...), db: Session = Depends(get_db)):
    content = log_data.get("content", "")
    if not content:
        raise HTTPException(status_code=400, detail="Log content is required")
    
    # Extract features
    features = engine.FeatureExtractor.extract(content)
    
    # Predict
    label, confidence = ml_engine.predict(content)
    top_keywords = ml_engine.get_top_keywords(content)
    
    # Save to history
    db_record = models.LogRecord(
        content=content,
        extracted_features=json.dumps(features),
        predicted_label=label,
        confidence=confidence
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
        "timestamp": db_record.timestamp
    }

@app.post("/train")
async def train_model(db: Session = Depends(get_db)):
    # Fetch records with actual labels if available, or just all for "simulated" training
    records = db.query(models.LogRecord).filter(models.LogRecord.actual_label != None).all()
    
    if len(records) < 5:
        # If not enough labeled data, check if we have any data to simulate a starting model
        records = db.query(models.LogRecord).limit(50).all()
        
    if not records:
        return {"status": "error", "message": "No data available for training"}
    
    data = pd.DataFrame([{
        "content": r.content,
        "label": r.actual_label or r.predicted_label
    } for r in records])
    
    ml_engine.train(data)
    return {"status": "success", "message": f"Model trained on {len(records)} records"}

@app.get("/history")
async def get_history(db: Session = Depends(get_db)):
    records = db.query(models.LogRecord).order_by(models.LogRecord.timestamp.desc()).limit(50).all()
    return [{"id": r.id, "prediction": r.predicted_label, "confidence": r.confidence, "timestamp": r.timestamp} for r in records]

@app.post("/analyze-repo")
async def analyze_repo(repo_data: dict = Body(...), db: Session = Depends(get_db)):
    repo_url = repo_data.get("url", "")
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
            return {"status": "error", "message": "No failed workflow runs found in the repository."}
        
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
        
        # Save to history (truncate for DB)
        db_record = models.LogRecord(
            content=log_content[:5000],
            extracted_features=json.dumps(features),
            predicted_label=label,
            confidence=confidence
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
            "job_name": failed_job.name,
            "run_url": latest_run.html_url
        }

    except Exception as e:
        print(f"Repo analysis error: {e}")
        raise HTTPException(status_code=500, detail=f"GitHub API error: {str(e)}")
