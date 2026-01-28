@echo off
echo ============================================================
echo FoodTrack ML Model Training
echo ============================================================
echo.
echo This will train the XGBoost and Random Forest models
echo using your Food_Delivery_Times.csv dataset
echo.
echo Make sure you have installed the ML dependencies:
echo   pip install -r ml_requirements.txt
echo.
pause

cd ml_model
python train_model.py

echo.
echo ============================================================
echo Training Complete!
echo ============================================================
echo.
echo The trained models are saved in: backend/ml_model/models/
echo.
echo Next steps:
echo 1. Start the backend: python main.py
echo 2. The API will automatically use the trained models
echo 3. Check model accuracy at http://localhost:8000/model-info
echo.
pause
