"""
FoodTrack ML Model Training Script
Trains XGBoost and Random Forest models on real delivery data
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestRegressor
from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
import json
import os

print("=" * 60)
print("FoodTrack ML Model Training Pipeline")
print("=" * 60)

# Load the dataset
print("\n[1/7] Loading dataset...")
df = pd.read_csv('../../Food_Delivery_Times.csv')
print(f"✓ Dataset loaded: {len(df)} records")
print(f"✓ Columns: {list(df.columns)}")

# Data preprocessing
print("\n[2/7] Preprocessing data...")

# Handle missing values
df = df.dropna(subset=['Delivery_Time_min'])  # Target variable must exist
df['Courier_Experience_yrs'] = df['Courier_Experience_yrs'].fillna(df['Courier_Experience_yrs'].median())
df['Time_of_Day'] = df['Time_of_Day'].fillna('Evening')  # Most common
df['Weather'] = df['Weather'].fillna('Clear')  # Most common

print(f"✓ After cleaning: {len(df)} records")
print(f"✓ Missing values handled")

# Feature engineering
print("\n[3/7] Engineering features...")

# Create additional features
df['Distance_Category'] = pd.cut(df['Distance_km'], bins=[0, 5, 10, 15, 25], labels=['Very Short', 'Short', 'Medium', 'Long'])
df['Prep_Category'] = pd.cut(df['Preparation_Time_min'], bins=[0, 10, 20, 35], labels=['Fast', 'Normal', 'Slow'])
df['Experience_Category'] = pd.cut(df['Courier_Experience_yrs'], bins=[-1, 2, 5, 15], labels=['Junior', 'Mid', 'Senior'])

# Encode categorical variables
label_encoders = {}
categorical_columns = ['Weather', 'Traffic_Level', 'Time_of_Day', 'Vehicle_Type', 
                       'Distance_Category', 'Prep_Category', 'Experience_Category']

for col in categorical_columns:
    le = LabelEncoder()
    df[col + '_encoded'] = le.fit_transform(df[col].astype(str))
    label_encoders[col] = le

print(f"✓ Feature engineering complete")
print(f"✓ Created {len(categorical_columns)} encoded features")

# Select features for training
feature_columns = [
    'Distance_km',
    'Preparation_Time_min',
    'Courier_Experience_yrs',
    'Weather_encoded',
    'Traffic_Level_encoded',
    'Time_of_Day_encoded',
    'Vehicle_Type_encoded',
    'Distance_Category_encoded',
    'Prep_Category_encoded',
    'Experience_Category_encoded'
]

X = df[feature_columns]
y = df['Delivery_Time_min']

# Scale features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

print(f"✓ Features selected: {len(feature_columns)}")

# Split data
print("\n[4/7] Splitting dataset...")
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.15, random_state=42
)
X_train, X_val, y_train, y_val = train_test_split(
    X_train, y_train, test_size=0.176, random_state=42  # 0.176 of 0.85 ≈ 0.15 of total
)

print(f"✓ Train set: {len(X_train)} samples")
print(f"✓ Validation set: {len(X_val)} samples")
print(f"✓ Test set: {len(X_test)} samples")

# Train XGBoost model
print("\n[5/7] Training XGBoost model...")

xgb_params = {
    'n_estimators': 200,
    'max_depth': 6,
    'learning_rate': 0.1,
    'min_child_weight': 3,
    'subsample': 0.8,
    'colsample_bytree': 0.8,
    'random_state': 42,
    'n_jobs': -1
}

xgb_model = XGBRegressor(**xgb_params)
xgb_model.fit(X_train, y_train, 
              eval_set=[(X_val, y_val)],
              verbose=False)

xgb_pred_test = xgb_model.predict(X_test)
xgb_mae = mean_absolute_error(y_test, xgb_pred_test)
xgb_rmse = np.sqrt(mean_squared_error(y_test, xgb_pred_test))
xgb_r2 = r2_score(y_test, xgb_pred_test)

print(f"✓ XGBoost trained successfully")
print(f"  - MAE: {xgb_mae:.2f} minutes")
print(f"  - RMSE: {xgb_rmse:.2f} minutes")
print(f"  - R² Score: {xgb_r2:.4f}")

# Train Random Forest model
print("\n[6/7] Training Random Forest model...")

rf_params = {
    'n_estimators': 150,
    'max_depth': 15,
    'min_samples_split': 5,
    'min_samples_leaf': 2,
    'random_state': 42,
    'n_jobs': -1
}

rf_model = RandomForestRegressor(**rf_params)
rf_model.fit(X_train, y_train)

rf_pred_test = rf_model.predict(X_test)
rf_mae = mean_absolute_error(y_test, rf_pred_test)
rf_rmse = np.sqrt(mean_squared_error(y_test, rf_pred_test))
rf_r2 = r2_score(y_test, rf_pred_test)

print(f"✓ Random Forest trained successfully")
print(f"  - MAE: {rf_mae:.2f} minutes")
print(f"  - RMSE: {rf_rmse:.2f} minutes")
print(f"  - R² Score: {rf_r2:.4f}")

# Ensemble prediction
print("\n[7/7] Creating ensemble model...")

ensemble_pred = 0.7 * xgb_pred_test + 0.3 * rf_pred_test
ensemble_mae = mean_absolute_error(y_test, ensemble_pred)
ensemble_rmse = np.sqrt(mean_squared_error(y_test, ensemble_pred))
ensemble_r2 = r2_score(y_test, ensemble_pred)
ensemble_accuracy = 100 - (ensemble_mae / y_test.mean() * 100)

print(f"✓ Ensemble model created (70% XGBoost + 30% Random Forest)")
print(f"  - MAE: {ensemble_mae:.2f} minutes")
print(f"  - RMSE: {ensemble_rmse:.2f} minutes")
print(f"  - R² Score: {ensemble_r2:.4f}")
print(f"  - Accuracy: {ensemble_accuracy:.2f}%")

# Save models and preprocessing objects
print("\n" + "=" * 60)
print("Saving models and configurations...")
print("=" * 60)

# Create models directory if it doesn't exist
os.makedirs('models', exist_ok=True)

# Save models
joblib.dump(xgb_model, 'models/xgb_model.pkl')
joblib.dump(rf_model, 'models/rf_model.pkl')
joblib.dump(scaler, 'models/scaler.pkl')
joblib.dump(label_encoders, 'models/label_encoders.pkl')

print("✓ Saved: xgb_model.pkl")
print("✓ Saved: rf_model.pkl")
print("✓ Saved: scaler.pkl")
print("✓ Saved: label_encoders.pkl")

# Save feature names
feature_config = {
    'feature_columns': feature_columns,
    'categorical_columns': categorical_columns
}
with open('models/feature_config.json', 'w') as f:
    json.dump(feature_config, f, indent=2)

print("✓ Saved: feature_config.json")

# Save model metadata
metadata = {
    'model_version': '2.0.0',
    'training_date': pd.Timestamp.now().strftime('%Y-%m-%d %H:%M:%S'),
    'dataset_size': len(df),
    'train_size': len(X_train),
    'val_size': len(X_val),
    'test_size': len(X_test),
    'features_count': len(feature_columns),
    'xgb_performance': {
        'mae': float(xgb_mae),
        'rmse': float(xgb_rmse),
        'r2_score': float(xgb_r2)
    },
    'rf_performance': {
        'mae': float(rf_mae),
        'rmse': float(rf_rmse),
        'r2_score': float(rf_r2)
    },
    'ensemble_performance': {
        'mae': float(ensemble_mae),
        'rmse': float(ensemble_rmse),
        'r2_score': float(ensemble_r2),
        'accuracy': float(ensemble_accuracy)
    }
}

with open('models/model_metadata.json', 'w') as f:
    json.dump(metadata, f, indent=2)

print("✓ Saved: model_metadata.json")

# Feature importance
feature_importance = pd.DataFrame({
    'feature': feature_columns,
    'xgb_importance': xgb_model.feature_importances_,
    'rf_importance': rf_model.feature_importances_
})
feature_importance['avg_importance'] = (feature_importance['xgb_importance'] + feature_importance['rf_importance']) / 2
feature_importance = feature_importance.sort_values('avg_importance', ascending=False)

print("\n" + "=" * 60)
print("Top 5 Most Important Features:")
print("=" * 60)
for idx, row in feature_importance.head(5).iterrows():
    print(f"  {row['feature']}: {row['avg_importance']:.4f}")

print("\n" + "=" * 60)
print("✅ MODEL TRAINING COMPLETE!")
print("=" * 60)
print(f"\nFinal Ensemble Model Performance:")
print(f"  • Accuracy: {ensemble_accuracy:.2f}%")
print(f"  • MAE: {ensemble_mae:.2f} minutes")
print(f"  • RMSE: {ensemble_rmse:.2f} minutes")
print(f"  • R² Score: {ensemble_r2:.4f}")
print(f"\nModels saved in: backend/ml_model/models/")
print("=" * 60)
