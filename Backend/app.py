from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import numpy as np
import os
from pymongo import MongoClient
from datetime import datetime
from typing import Optional
from dotenv import load_dotenv
import certifi

load_dotenv()

with open("wine_model.pkl", "rb") as f:
    model = pickle.load(f)

with open("label_encoder.pkl", "rb") as f:
    label_encoder = pickle.load(f)

app = FastAPI()

# MongoDB setup
MONGODB_URI = os.environ.get("MONGODB_URI")
DB_NAME = os.environ.get("DB_NAME", "wyne_db")

client = None
db = None

if MONGODB_URI:
    client = MongoClient(MONGODB_URI, tlsCAFile=certifi.where())
    db = client[DB_NAME]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "Wyne Backend is running"}


class WineFeatures(BaseModel):
    fixedAcidity: float
    volatileAcidity: float
    citricAcid: float
    residualSugar: float
    chlorides: float
    freeSulfurDioxide: float
    totalSulfurDioxide: float
    density: float
    pH: float
    sulphates: float
    alcohol: float
    userId: Optional[str] = None


@app.post("/predict")
def predict_wine(data: WineFeatures):
    input_data = np.array([[
        data.fixedAcidity,
        data.volatileAcidity,
        data.citricAcid,
        data.residualSugar,
        data.chlorides,
        data.freeSulfurDioxide,
        data.totalSulfurDioxide,
        data.density,
        data.pH,
        data.sulphates,
        data.alcohol
    ]])

    prediction_encoded = model.predict(input_data)
    prediction = label_encoder.inverse_transform(prediction_encoded)
    result = int(prediction[0])

    # Save to MongoDB if userId is provided
    if db is not None and data.userId:
        try:
            db.predictions.insert_one({
                "userId": data.userId,
                "features": {
                    "fixedAcidity": data.fixedAcidity,
                    "volatileAcidity": data.volatileAcidity,
                    "citricAcid": data.citricAcid,
                    "residualSugar": data.residualSugar,
                    "chlorides": data.chlorides,
                    "freeSulfurDioxide": data.freeSulfurDioxide,
                    "totalSulfurDioxide": data.totalSulfurDioxide,
                    "density": data.density,
                    "pH": data.pH,
                    "sulphates": data.sulphates,
                    "alcohol": data.alcohol
                },
                "quality": result,
                "timestamp": datetime.utcnow()
            })
        except Exception as e:
            print(f"Warning: Could not save to MongoDB: {e}")

    return {"quality": result}

@app.post("/predict_bulk")
def predict_wine_bulk(data_list: list[WineFeatures]):
    results = []
    
    # Process in batches or all at once
    for data in data_list:
        input_data = np.array([[
            data.fixedAcidity,
            data.volatileAcidity,
            data.citricAcid,
            data.residualSugar,
            data.chlorides,
            data.freeSulfurDioxide,
            data.totalSulfurDioxide,
            data.density,
            data.pH,
            data.sulphates,
            data.alcohol
        ]])

        prediction_encoded = model.predict(input_data)
        prediction = label_encoder.inverse_transform(prediction_encoded)
        result = int(prediction[0])
        
        results.append({
            "quality": result,
            "features": data.dict()
        })

        # Save to MongoDB if userId is provided
        if db is not None and data.userId:
            try:
                db.predictions.insert_one({
                    "userId": data.userId,
                    "features": data.dict(),
                    "quality": result,
                    "timestamp": datetime.utcnow()
                })
            except Exception as e:
                print(f"Warning: Could not save to MongoDB: {e}")

    return {"results": results}


@app.get("/history/{user_id}")
def get_history(user_id: str):
    if db is None:
        return {"history": [], "error": "Database not connected"}

    records = list(
        db.predictions.find(
            {"userId": user_id},
            {"_id": 0}
        ).sort("timestamp", -1).limit(50)
    )

    # Convert datetime to string for JSON serialization
    for r in records:
        if "timestamp" in r:
            r["timestamp"] = r["timestamp"].strftime("%Y-%m-%d %H:%M:%S")

    return {"history": records}

class ActivityLog(BaseModel):
    email: str
    action: str
    timestamp: Optional[str] = None

@app.post("/log_activity")
def log_activity(data: ActivityLog):
    if db is not None:
        try:
            db.activity_logs.insert_one({
                "email": data.email,
                "action": data.action,
                "timestamp": datetime.utcnow()
            })
            return {"status": "success"}
        except Exception as e:
            print(f"Warning: Could not save activity log: {e}")
            return {"status": "error", "message": str(e)}
    return {"status": "error", "message": "Database not connected"}

@app.get("/admin/logs")
def get_admin_logs(admin_email: str):
    admin_emails_env = os.environ.get("ADMIN_EMAIL", "admin@wyne.com")
    admin_emails = [email.strip() for email in admin_emails_env.split(",")]
    if admin_email not in admin_emails:
        return {"logs": [], "error": "Unauthorized"}
        
    if db is None:
        return {"logs": [], "error": "Database not connected"}

    records = list(
        db.activity_logs.find(
            {},
            {"_id": 0}
        ).sort("timestamp", -1).limit(100)
    )

    for r in records:
        if "timestamp" in r:
            r["timestamp"] = r["timestamp"].strftime("%Y-%m-%d %H:%M:%S")

    return {"logs": records}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
