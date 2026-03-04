import re
import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import os
import json

MODEL_PATH = "model.joblib"
VECTORIZER_PATH = "vectorizer.joblib"

class FeatureExtractor:
    @staticmethod
    def extract(log_content: str):
        features = {
            "has_stack_trace": bool(re.search(r"at (?:[\w\.]+\/)*[\w\.]+\([\w\.]+\.java:\d+\)", log_content)) or bool(re.search(r"File \".*\", line \d+", log_content)),
            "is_timeout": "timeout" in log_content.lower() or "timed out" in log_content.lower(),
            "is_dependency_error": any(kw in log_content.lower() for kw in ["not found", "could not resolve", "dependency", "missing package"]),
            "is_assertion_failure": "assertionerror" in log_content.lower() or "failed" in log_content.lower(),
            "exit_code": re.search(r"exit code (\d+)", log_content.lower()).group(1) if re.search(r"exit code (\d+)", log_content.lower()) else "0"
        }
        return features

class MLModel:
    def __init__(self):
        self.model = None
        self.vectorizer = None
        self.load()

    def load(self):
        if os.path.exists(MODEL_PATH) and os.path.exists(VECTORIZER_PATH):
            self.model = joblib.load(MODEL_PATH)
            self.vectorizer = joblib.load(VECTORIZER_PATH)

    def save(self):
        if self.model and self.vectorizer:
            joblib.dump(self.model, MODEL_PATH)
            joblib.dump(self.vectorizer, VECTORIZER_PATH)

    def train(self, data: pd.DataFrame):
        # data should have 'content' and 'label'
        self.vectorizer = TfidfVectorizer(max_features=5000)
        X = self.vectorizer.fit_transform(data['content'])
        y = data['label']
        
        self.model = RandomForestClassifier(n_estimators=100)
        self.model.fit(X, y)
        self.save()

    def predict(self, log_content: str):
        if not self.model or not self.vectorizer:
            return "Unknown", 0.0
        
        X = self.vectorizer.transform([log_content])
        probs = self.model.predict_proba(X)[0]
        max_idx = probs.argmax()
        label = self.model.classes_[max_idx]
        confidence = probs[max_idx]
        
        return label, float(confidence)

    def get_top_keywords(self, log_content: str, top_n=5):
        if not self.vectorizer:
            return []
        
        feature_names = self.vectorizer.get_feature_names_out()
        tfidf_matrix = self.vectorizer.transform([log_content])
        scores = tfidf_matrix.toarray()[0]
        
        top_indices = scores.argsort()[-top_n:][::-1]
        return [feature_names[i] for i in top_indices if scores[i] > 0]
