from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import numpy as np
from typing import Literal
import uvicorn
from ml_predictor import MLPredictor

app = FastAPI(
    title="FoodTrack ML API",
    description="Machine Learning API for food delivery time predictions with real trained models",
    version="2.0.0"
)

# CORS middleware for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictionInput(BaseModel):
    distance: float = Field(..., gt=0, description="Delivery distance in kilometers")
    traffic: Literal["low", "medium", "high"] = Field(..., description="Traffic level")
    weather: Literal["clear", "rainy", "stormy"] = Field(..., description="Weather condition")
    prepTime: float = Field(..., gt=0, description="Restaurant preparation time in minutes")
    orderSize: Literal["small", "medium", "large"] = Field(..., description="Order size")
    trafficIndex: float | None = Field(default=None, ge=0, le=100, description="Optional numeric traffic index (0-100)")
    weatherSeverity: float | None = Field(default=None, ge=0, le=100, description="Optional weather severity score (0-100)")
    restaurantLoad: float | None = Field(default=None, ge=0, le=100, description="Optional restaurant load score (0-100)")
    riderAvailability: float | None = Field(default=None, ge=0, le=100, description="Optional rider availability score (0-100)")
    pickupDelayMin: float | None = Field(default=None, ge=0, le=120, description="Optional pickup delay in minutes")

class PredictionOutput(BaseModel):
    estimatedTime: float
    confidence: float
    factors: dict
    modelVersion: str
    predictionId: str
    modelInfo: dict

# Initialize real ML predictor
print("\n🚀 Initializing FoodTrack ML Predictor...")
predictor = MLPredictor()
print("✓ Predictor ready!\n")

@app.get("/")
def read_root():
    model_info = predictor.get_model_info()
    return {
        "message": "FoodTrack ML API - Real Trained Models",
        "version": "2.0.0",
        "status": "online",
        "model_status": model_info['status'],
        "model_accuracy": model_info.get('accuracy', 'N/A')
    }

@app.get("/health")
def health_check():
    model_info = predictor.get_model_info()
    return {
        "status": "healthy",
        "model_loaded": predictor.is_loaded,
        "model_info": model_info
    }

@app.post("/predict", response_model=PredictionOutput)
def predict_delivery_time(data: PredictionInput):
    """
    Predict food delivery time based on input parameters
    
    Parameters:
    - distance: Delivery distance in km
    - traffic: Traffic level (low/medium/high)
    - weather: Weather condition (clear/rainy/stormy)
    - prepTime: Restaurant preparation time in minutes
    - orderSize: Order size (small/medium/large)
    
    Returns:
    - estimatedTime: Predicted delivery time in minutes
    - confidence: Prediction confidence score (0-100)
    - factors: Input factors used for prediction
    """
    try:
        # Make prediction using real ML models
        estimated_time, confidence = predictor.predict(
            distance=data.distance,
            traffic=data.traffic,
            weather=data.weather,
            prep_time=data.prepTime,
            order_size=data.orderSize,
            traffic_index=data.trafficIndex,
            weather_severity=data.weatherSeverity,
            restaurant_load=data.restaurantLoad,
            rider_availability=data.riderAvailability,
            pickup_delay_min=data.pickupDelayMin,
        )
        
        # Generate prediction ID
        import uuid
        prediction_id = str(uuid.uuid4())
        
        # Get model info
        model_info = predictor.get_model_info()
        
        return PredictionOutput(
            estimatedTime=round(estimated_time, 1),
            confidence=round(confidence, 1),
            factors={
                "distance": data.distance,
                "traffic": data.traffic,
                "weather": data.weather,
                "prepTime": data.prepTime,
                "orderSize": data.orderSize,
                "trafficIndex": data.trafficIndex,
                "weatherSeverity": data.weatherSeverity,
                "restaurantLoad": data.restaurantLoad,
                "riderAvailability": data.riderAvailability,
                "pickupDelayMin": data.pickupDelayMin,
            },
            modelVersion=model_info.get('version', '2.0.0'),
            predictionId=prediction_id,
            modelInfo={
                "status": model_info['status'],
                "accuracy": model_info.get('accuracy', 'N/A'),
                "using_real_model": predictor.is_loaded
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.get("/model-info")
def get_model_info():
    model_info = predictor.get_model_info()
    
    if predictor.is_loaded:
        return {
            "modelVersion": model_info['version'],
            "modelType": "Ensemble (XGBoost + Gradient Boosting, dynamically weighted)",
            "status": "Real trained models loaded",
            "features": [
                "distance_km",
                "preparation_time",
                "courier_experience",
                "weather",
                "traffic_level",
                "time_of_day",
                "vehicle_type",
                "distance_category",
                "prep_category",
                "experience_category"
            ],
            "accuracy": model_info['accuracy'],
            "meanAbsoluteError": model_info['mae'],
            "r2Score": model_info['r2_score'],
            "trainingDataSize": model_info['dataset_size'],
            "lastUpdated": model_info['training_date'],
            "using_real_model": True
        }
    else:
        return {
            "modelVersion": "N/A",
            "modelType": "Rule-based fallback",
            "status": "Models not trained yet",
            "message": "Run 'python ml_model/train_model.py' to train real models",
            "using_real_model": False
        }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
