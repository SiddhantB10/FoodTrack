# 🚀 FoodTrack Quick Start Guide

## ⚡ Start Your Application (FASTEST METHOD)

### Option 1: Double-click this file
```
START_FOODTRACK.bat
```
This will automatically start both frontend and backend!

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd c:\Users\siddh\Desktop\FoodTrack\backend
python main.py
```

**Terminal 2 - Frontend:**
```bash
cd c:\Users\siddh\Desktop\FoodTrack
npm run dev
```

---

## 🌐 Access Your Application

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Main application |
| **Prediction Page** | http://localhost:3000/predict | ML prediction form |
| **Dashboard** | http://localhost:3000/dashboard | Analytics |
| **Backend API** | http://localhost:8000 | API server |
| **API Docs** | http://localhost:8000/docs | Interactive API testing |
| **Model Info** | http://localhost:8000/model-info | ML model metrics |

---

## 🎯 Test ML Predictions

### Via Web Interface (Recommended)
1. Go to http://localhost:3000/predict
2. Fill in delivery details:
   - Distance: 5.2 km
   - Traffic: Medium
   - Weather: Clear
   - Prep Time: 20 minutes
   - Order Size: Medium
3. Click "Predict Delivery Time"
4. See results with 86.79% accuracy!

### Via API (PowerShell)
```powershell
curl -X POST "http://localhost:8000/predict" `
  -H "Content-Type: application/json" `
  -d '{
    "distance": 5.2,
    "traffic": "medium",
    "weather": "clear",
    "prepTime": 20,
    "orderSize": "medium"
  }'
```

---

## 🔄 Retrain ML Models (If Needed)

If you want to retrain with more data:

```bash
cd c:\Users\siddh\Desktop\FoodTrack\backend\ml_model
python train_model.py
```

Then restart the backend server to load new models.

---

## 📊 Current ML Model Stats

- **Model**: Ensemble (XGBoost 70% + Random Forest 30%)
- **Accuracy**: 86.79%
- **MAE**: 7.39 minutes
- **Training Data**: 1,000 real delivery records
- **Status**: ✅ Production Ready

---

## 🛠️ Troubleshooting

### Backend won't start?
```bash
pip install -r backend/requirements.txt
```

### Frontend has errors?
```bash
npm install
```

### Need to stop servers?
- **Frontend**: Press `Ctrl + C` in the terminal
- **Backend**: Press `Ctrl + C` in the terminal

---

## 📖 Full Documentation

- **ML_INTEGRATION_SUMMARY.md** - Complete ML integration details
- **README.md** - Project overview
- **SETUP_GUIDE.md** - Detailed setup instructions
- **DEPLOYMENT.md** - Production deployment guide

---

## ✅ Checklist

- [ ] Both servers are running (frontend + backend)
- [ ] Can access http://localhost:3000
- [ ] Can access http://localhost:8000/docs
- [ ] Test prediction works on prediction page
- [ ] Model accuracy shows 86.79%
- [ ] All pages load without errors

If all checked ✅, you're ready to go! 🎉

---

**Need Help?** Check ML_INTEGRATION_SUMMARY.md for detailed documentation.
