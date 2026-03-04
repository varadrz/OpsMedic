from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from datetime import datetime
from database import Base

class LogRecord(Base):
    __tablename__ = "log_records"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text)
    extracted_features = Column(Text)  # JSON string of features
    actual_label = Column(String, nullable=True)
    predicted_label = Column(String)
    confidence = Column(Float)
    session_id = Column(String, nullable=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
