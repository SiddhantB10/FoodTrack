"""FoodTrack ML training script with automatic best-variant selection."""

import json
import os

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from xgboost import XGBRegressor


def mae_weights(mae_a: float, mae_b: float) -> tuple[float, float]:
    inv_a = 1.0 / max(mae_a, 1e-6)
    inv_b = 1.0 / max(mae_b, 1e-6)
    total = inv_a + inv_b
    return inv_a / total, inv_b / total


def add_common_features(df: pd.DataFrame) -> pd.DataFrame:
    data = df.copy()
    data['Distance_Category'] = pd.cut(data['Distance_km'], bins=[0, 5, 10, 15, 25], labels=['Very Short', 'Short', 'Medium', 'Long'])
    data['Prep_Category'] = pd.cut(data['Preparation_Time_min'], bins=[0, 10, 20, 35], labels=['Fast', 'Normal', 'Slow'])
    data['Experience_Category'] = pd.cut(data['Courier_Experience_yrs'], bins=[-1, 2, 5, 15], labels=['Junior', 'Mid', 'Senior'])
    return data


def add_operational_features(df: pd.DataFrame) -> pd.DataFrame:
    data = df.copy()
    if 'Traffic_Index' not in data.columns:
        data['Traffic_Index'] = data['Traffic_Level'].map({'Low': 30, 'Medium': 60, 'High': 85}).fillna(60)
    if 'Weather_Severity' not in data.columns:
        data['Weather_Severity'] = data['Weather'].map({'Clear': 10, 'Rainy': 60, 'Snowy': 80}).fillna(35)
    if 'Restaurant_Load' not in data.columns:
        prep_norm = (data['Preparation_Time_min'] - data['Preparation_Time_min'].min()) / (
            max(data['Preparation_Time_min'].max() - data['Preparation_Time_min'].min(), 1e-6)
        )
        data['Restaurant_Load'] = np.clip((prep_norm * 100), 0, 100)
    if 'Rider_Availability' not in data.columns:
        data['Rider_Availability'] = np.clip(
            100 - (0.45 * data['Traffic_Index']) - (0.35 * data['Weather_Severity']) + (2.0 * data['Courier_Experience_yrs']),
            5,
            100,
        )
    if 'Pickup_Delay_min' not in data.columns:
        data['Pickup_Delay_min'] = np.clip(
            (0.08 * data['Preparation_Time_min']) + (0.03 * data['Traffic_Index']),
            0,
            25,
        )
    data['Distance_Weather_Interaction'] = data['Distance_km'] * (data['Weather_Severity'] / 100.0)
    data['Traffic_Prep_Interaction'] = data['Traffic_Index'] * data['Preparation_Time_min']
    return data


def encode_categories(df: pd.DataFrame, categorical_columns: list[str]) -> tuple[pd.DataFrame, dict[str, LabelEncoder]]:
    data = df.copy()
    label_encoders: dict[str, LabelEncoder] = {}
    for col in categorical_columns:
        le = LabelEncoder()
        data[col + '_encoded'] = le.fit_transform(data[col].astype(str))
        label_encoders[col] = le
    return data, label_encoders


def evaluate(y_true, y_pred) -> tuple[float, float, float, float]:
    mae = mean_absolute_error(y_true, y_pred)
    rmse = np.sqrt(mean_squared_error(y_true, y_pred))
    r2 = r2_score(y_true, y_pred)
    accuracy = 100 - (mae / y_true.mean() * 100)
    return mae, rmse, r2, accuracy


def train_variant(
    variant_name: str,
    df: pd.DataFrame,
    feature_columns: list[str],
    categorical_columns: list[str],
) -> dict:
    encoded_df, label_encoders = encode_categories(df, categorical_columns)

    X = encoded_df[feature_columns]
    y = encoded_df['Delivery_Time_min']

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.15, random_state=42)
    X_train, X_val, y_train, y_val = train_test_split(X_train, y_train, test_size=0.176, random_state=42)

    xgb_model = XGBRegressor(
        n_estimators=300,
        max_depth=4,
        learning_rate=0.03,
        min_child_weight=5,
        subsample=0.85,
        colsample_bytree=0.75,
        reg_alpha=0,
        reg_lambda=1,
        objective='reg:squarederror',
        random_state=42,
        n_jobs=-1,
    )
    xgb_model.fit(X_train, y_train, eval_set=[(X_val, y_val)], verbose=False)

    gbr_model = GradientBoostingRegressor(
        n_estimators=700,
        learning_rate=0.02,
        max_depth=2,
        subsample=0.9,
        min_samples_split=6,
        min_samples_leaf=2,
        random_state=42,
    )
    gbr_model.fit(X_train, y_train)

    xgb_val_pred = xgb_model.predict(X_val)
    gbr_val_pred = gbr_model.predict(X_val)

    xgb_val_mae = mean_absolute_error(y_val, xgb_val_pred)
    gbr_val_mae = mean_absolute_error(y_val, gbr_val_pred)
    xgb_weight, gbr_weight = mae_weights(xgb_val_mae, gbr_val_mae)

    xgb_test_pred = xgb_model.predict(X_test)
    gbr_test_pred = gbr_model.predict(X_test)
    ensemble_pred = xgb_weight * xgb_test_pred + gbr_weight * gbr_test_pred

    xgb_metrics = evaluate(y_test, xgb_test_pred)
    gbr_metrics = evaluate(y_test, gbr_test_pred)
    ensemble_metrics = evaluate(y_test, ensemble_pred)

    print(f"\nVariant: {variant_name}")
    print(f"  Features: {len(feature_columns)}")
    print(f"  Ensemble val MAE: {(xgb_weight * xgb_val_mae + gbr_weight * gbr_val_mae):.4f}")
    print(f"  Ensemble test MAE: {ensemble_metrics[0]:.4f}")
    print(f"  Ensemble test accuracy: {ensemble_metrics[3]:.4f}%")

    return {
        'variant_name': variant_name,
        'df': encoded_df,
        'label_encoders': label_encoders,
        'feature_columns': feature_columns,
        'categorical_columns': categorical_columns,
        'scaler': scaler,
        'xgb_model': xgb_model,
        'gbr_model': gbr_model,
        'xgb_weight': xgb_weight,
        'gbr_weight': gbr_weight,
        'xgb_val_mae': xgb_val_mae,
        'gbr_val_mae': gbr_val_mae,
        'xgb_metrics': xgb_metrics,
        'gbr_metrics': gbr_metrics,
        'ensemble_metrics': ensemble_metrics,
        'dataset_size': len(df),
        'train_size': len(X_train),
        'val_size': len(X_val),
        'test_size': len(X_test),
        'target_stats': {
            'min': float(y.min()),
            'max': float(y.max()),
            'mean': float(y.mean()),
        },
    }


def main() -> None:
    print("=" * 60)
    print("FoodTrack ML Model Training Pipeline")
    print("=" * 60)

    print("\n[1/7] Loading dataset...")
    raw_df = pd.read_csv('../../Food_Delivery_Times.csv')
    print(f"✓ Dataset loaded: {len(raw_df)} records")
    print(f"✓ Columns: {list(raw_df.columns)}")

    print("\n[2/7] Preprocessing data...")
    df = raw_df.dropna(subset=['Delivery_Time_min']).copy()
    df['Courier_Experience_yrs'] = df['Courier_Experience_yrs'].fillna(df['Courier_Experience_yrs'].median())
    df['Time_of_Day'] = df['Time_of_Day'].fillna('Evening')
    df['Weather'] = df['Weather'].fillna('Clear')
    df['Traffic_Level'] = df['Traffic_Level'].fillna('Medium')
    print(f"✓ After cleaning: {len(df)} records")

    print("\n[3/7] Engineering features...")
    categorical_columns = [
        'Weather',
        'Traffic_Level',
        'Time_of_Day',
        'Vehicle_Type',
        'Distance_Category',
        'Prep_Category',
        'Experience_Category',
    ]

    base_df = add_common_features(df)
    ops_df = add_operational_features(base_df)

    base_features = [
        'Distance_km',
        'Preparation_Time_min',
        'Courier_Experience_yrs',
        'Weather_encoded',
        'Traffic_Level_encoded',
        'Time_of_Day_encoded',
        'Vehicle_Type_encoded',
        'Distance_Category_encoded',
        'Prep_Category_encoded',
        'Experience_Category_encoded',
    ]

    operational_features = [
        'Distance_km',
        'Preparation_Time_min',
        'Courier_Experience_yrs',
        'Traffic_Index',
        'Weather_Severity',
        'Restaurant_Load',
        'Rider_Availability',
        'Pickup_Delay_min',
        'Distance_Weather_Interaction',
        'Traffic_Prep_Interaction',
        'Weather_encoded',
        'Traffic_Level_encoded',
        'Time_of_Day_encoded',
        'Vehicle_Type_encoded',
        'Distance_Category_encoded',
        'Prep_Category_encoded',
        'Experience_Category_encoded',
    ]

    print("✓ Prepared baseline and operational feature variants")

    print("\n[4/7] Training and evaluating variants...")
    baseline_result = train_variant('baseline', base_df, base_features, categorical_columns)
    operational_result = train_variant('operational', ops_df, operational_features, categorical_columns)

    best = baseline_result
    if operational_result['xgb_weight'] * operational_result['xgb_val_mae'] + operational_result['gbr_weight'] * operational_result['gbr_val_mae'] < \
       baseline_result['xgb_weight'] * baseline_result['xgb_val_mae'] + baseline_result['gbr_weight'] * baseline_result['gbr_val_mae']:
        best = operational_result

    print("\n[5/7] Selecting best variant...")
    print(f"✓ Selected variant: {best['variant_name']}")

    print("\n[6/7] Saving models and configurations...")
    os.makedirs('models', exist_ok=True)

    joblib.dump(best['xgb_model'], 'models/xgb_model.pkl')
    joblib.dump(best['gbr_model'], 'models/gbr_model.pkl')
    joblib.dump(best['scaler'], 'models/scaler.pkl')
    joblib.dump(best['label_encoders'], 'models/label_encoders.pkl')

    feature_config = {
        'feature_columns': best['feature_columns'],
        'categorical_columns': best['categorical_columns'],
    }
    with open('models/feature_config.json', 'w') as f:
        json.dump(feature_config, f, indent=2)

    xgb_mae, xgb_rmse, xgb_r2, _ = best['xgb_metrics']
    gbr_mae, gbr_rmse, gbr_r2, _ = best['gbr_metrics']
    ens_mae, ens_rmse, ens_r2, ens_acc = best['ensemble_metrics']

    metadata = {
        'model_version': '2.3.1',
        'training_date': pd.Timestamp.now().strftime('%Y-%m-%d %H:%M:%S'),
        'dataset_size': best['dataset_size'],
        'train_size': best['train_size'],
        'val_size': best['val_size'],
        'test_size': best['test_size'],
        'features_count': len(best['feature_columns']),
        'feature_variant': best['variant_name'],
        'target_stats': best['target_stats'],
        'operational_features_enabled': best['variant_name'] == 'operational',
        'ensemble_weights': {
            'xgb': float(best['xgb_weight']),
            'gbr': float(best['gbr_weight']),
        },
        'xgb_performance': {
            'mae': float(xgb_mae),
            'rmse': float(xgb_rmse),
            'r2_score': float(xgb_r2),
            'val_mae': float(best['xgb_val_mae']),
        },
        'gbr_performance': {
            'mae': float(gbr_mae),
            'rmse': float(gbr_rmse),
            'r2_score': float(gbr_r2),
            'val_mae': float(best['gbr_val_mae']),
        },
        'ensemble_performance': {
            'mae': float(ens_mae),
            'rmse': float(ens_rmse),
            'r2_score': float(ens_r2),
            'accuracy': float(ens_acc),
        },
        'variant_comparison': {
            'baseline_accuracy': float(baseline_result['ensemble_metrics'][3]),
            'operational_accuracy': float(operational_result['ensemble_metrics'][3]),
        },
    }

    with open('models/model_metadata.json', 'w') as f:
        json.dump(metadata, f, indent=2)

    print("✓ Saved all model artifacts and metadata")

    print("\n[7/7] Reporting top feature importances...")
    feature_importance = pd.DataFrame(
        {
            'feature': best['feature_columns'],
            'xgb_importance': best['xgb_model'].feature_importances_,
            'gbr_importance': best['gbr_model'].feature_importances_,
        }
    )
    feature_importance['avg_importance'] = (
        feature_importance['xgb_importance'] + feature_importance['gbr_importance']
    ) / 2
    feature_importance = feature_importance.sort_values('avg_importance', ascending=False)

    print("\n" + "=" * 60)
    print("Top 5 Most Important Features")
    print("=" * 60)
    for _, row in feature_importance.head(5).iterrows():
        print(f"  {row['feature']}: {row['avg_importance']:.4f}")

    print("\n" + "=" * 60)
    print("✅ MODEL TRAINING COMPLETE")
    print("=" * 60)
    print(f"Selected variant: {best['variant_name']}")
    print(f"Accuracy: {ens_acc:.2f}%")
    print(f"MAE: {ens_mae:.2f} minutes")
    print(f"RMSE: {ens_rmse:.2f} minutes")
    print(f"R² Score: {ens_r2:.4f}")
    print("=" * 60)


if __name__ == '__main__':
    main()
