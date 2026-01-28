# FoodTrack Backend API

FastAPI backend for FoodTrack ML predictions.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate virtual environment:
- Windows: `venv\Scripts\activate`
- Mac/Linux: `source venv/bin/activate`

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the server:
```bash
python main.py
```

Or use uvicorn directly:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

- `GET /` - API info
- `GET /health` - Health check
- `POST /predict` - Make prediction
- `GET /model-info` - Model information

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Example Request

```bash
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "distance": 5.2,
    "traffic": "medium",
    "weather": "clear",
    "prepTime": 15,
    "orderSize": "medium"
  }'
```

## Production Deployment

For production, consider:
1. Replace simulated model with actual trained ML model (XGBoost/Random Forest)
2. Add authentication and rate limiting
3. Implement request logging and monitoring
4. Use production ASGI server (gunicorn + uvicorn workers)
5. Add model versioning and A/B testing
6. Implement caching for repeated predictions
