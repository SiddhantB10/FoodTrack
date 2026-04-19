"""
Real ML Model Predictor for FoodTrack
Uses trained XGBoost and Gradient Boosting models
"""

import joblib
import numpy as np
import json
import os
from typing import Dict, Tuple


ORDER_SIZE_MULTIPLIER = {
    'small': 0.95,
    'medium': 1.00,
    'large': 1.08,
}

class MLPredictor:
    def __init__(self, models_dir: str = 'ml_model/models'):
        """Initialize the ML predictor with trained models"""
        self.models_dir = models_dir
        self.xgb_model = None
        self.secondary_model = None
        self.scaler = None
        self.label_encoders = None
        self.feature_config = None
        self.metadata = None
        self.is_loaded = False
        
        # Try to load models
        self.load_models()
    
    def load_models(self):
        """Load all trained models and preprocessors"""
        try:
            model_path = os.path.join(self.models_dir, 'xgb_model.pkl')
            if os.path.exists(model_path):
                self.xgb_model = joblib.load(model_path)
                gbr_path = os.path.join(self.models_dir, 'gbr_model.pkl')
                rf_path = os.path.join(self.models_dir, 'rf_model.pkl')
                if os.path.exists(gbr_path):
                    self.secondary_model = joblib.load(gbr_path)
                elif os.path.exists(rf_path):
                    # Backward compatibility with older model artifacts.
                    self.secondary_model = joblib.load(rf_path)
                else:
                    raise FileNotFoundError('No secondary ensemble model found (gbr_model.pkl/rf_model.pkl)')
                self.scaler = joblib.load(os.path.join(self.models_dir, 'scaler.pkl'))
                self.label_encoders = joblib.load(os.path.join(self.models_dir, 'label_encoders.pkl'))
                
                with open(os.path.join(self.models_dir, 'feature_config.json'), 'r') as f:
                    self.feature_config = json.load(f)
                
                with open(os.path.join(self.models_dir, 'model_metadata.json'), 'r') as f:
                    self.metadata = json.load(f)
                
                self.is_loaded = True
                print(f"✓ Models loaded successfully (v{self.metadata['model_version']})")
                print(f"✓ Model accuracy: {self.metadata['ensemble_performance']['accuracy']:.2f}%")
            else:
                print("⚠ Trained models not found. Using fallback prediction.")
                self.is_loaded = False
        except Exception as e:
            print(f"⚠ Error loading models: {str(e)}")
            self.is_loaded = False
    
    def prepare_features(
        self,
        distance: float,
        traffic: str,
        weather: str,
        prep_time: float,
        order_size: str,
        traffic_index: float | None = None,
        weather_severity: float | None = None,
        restaurant_load: float | None = None,
        rider_availability: float | None = None,
        pickup_delay_min: float | None = None,
    ) -> np.ndarray:
        """Prepare input features for prediction"""
        
        # Map frontend inputs to dataset format
        traffic_map = {'low': 'Low', 'medium': 'Medium', 'high': 'High'}
        weather_map = {'clear': 'Clear', 'rainy': 'Rainy', 'stormy': 'Snowy'}
        
        traffic_level = traffic_map.get(traffic.lower(), 'Medium')
        weather_condition = weather_map.get(weather.lower(), 'Clear')
        
        # Heuristic defaults for fields absent from frontend request.
        courier_experience = max(1.0, min(10.0, 6.0 - (0.15 * distance)))
        time_of_day = 'Evening'
        vehicle_type = 'Scooter'  # Most common

        # Incorporate order size as an additional signal even though it is not
        # a dedicated trained feature. Larger orders usually have handling overhead.
        prep_time_adjusted = prep_time * ORDER_SIZE_MULTIPLIER.get(order_size.lower(), 1.0)

        # Operational signal features (optional API inputs override heuristic estimates).
        inferred_traffic_index = {'low': 30.0, 'medium': 60.0, 'high': 85.0}.get(traffic.lower(), 60.0)
        inferred_weather_severity = {'clear': 10.0, 'rainy': 60.0, 'stormy': 80.0}.get(weather.lower(), 35.0)
        traffic_index = float(np.clip(traffic_index if traffic_index is not None else inferred_traffic_index, 0.0, 100.0))
        weather_severity = float(np.clip(weather_severity if weather_severity is not None else inferred_weather_severity, 0.0, 100.0))

        if restaurant_load is None:
            restaurant_load = float(np.clip((prep_time_adjusted / 35.0) * 100.0, 0.0, 100.0))
        else:
            restaurant_load = float(np.clip(restaurant_load, 0.0, 100.0))

        if rider_availability is None:
            rider_availability = float(np.clip(100 - (0.45 * traffic_index) - (0.35 * weather_severity) + (2.0 * courier_experience), 5.0, 100.0))
        else:
            rider_availability = float(np.clip(rider_availability, 0.0, 100.0))

        if pickup_delay_min is None:
            pickup_delay_min = float(np.clip((0.08 * prep_time_adjusted) + (0.03 * traffic_index), 0.0, 25.0))
        else:
            pickup_delay_min = float(np.clip(pickup_delay_min, 0.0, 120.0))
        
        # Create categorical features
        distance_category = (
            'Very Short' if distance <= 5 else
            'Short' if distance <= 10 else
            'Medium' if distance <= 15 else
            'Long'
        )
        
        prep_category = (
            'Fast' if prep_time <= 10 else
            'Normal' if prep_time <= 20 else
            'Slow'
        )
        
        experience_category = (
            'Junior' if courier_experience <= 2 else
            'Mid' if courier_experience <= 5 else
            'Senior'
        )

        distance_prep_interaction = distance * prep_time_adjusted
        distance_squared = distance ** 2
        prep_squared = prep_time_adjusted ** 2
        distance_per_experience = distance / (courier_experience + 1.0)
        distance_weather_interaction = distance * (weather_severity / 100.0)
        traffic_prep_interaction = traffic_index * prep_time_adjusted
        
        # Encode categorical variables
        encoded_features = {}
        categorical_mappings = {
            'Weather': weather_condition,
            'Traffic_Level': traffic_level,
            'Time_of_Day': time_of_day,
            'Vehicle_Type': vehicle_type,
            'Distance_Category': distance_category,
            'Prep_Category': prep_category,
            'Experience_Category': experience_category
        }
        
        for col, value in categorical_mappings.items():
            try:
                encoded_features[col + '_encoded'] = self.label_encoders[col].transform([value])[0]
            except:
                # Fallback to default encoding if value not seen during training
                encoded_features[col + '_encoded'] = 0
        
        feature_values = {
            'Distance_km': distance,
            'Preparation_Time_min': prep_time_adjusted,
            'Courier_Experience_yrs': courier_experience,
            'Traffic_Index': traffic_index,
            'Weather_Severity': weather_severity,
            'Restaurant_Load': restaurant_load,
            'Rider_Availability': rider_availability,
            'Pickup_Delay_min': pickup_delay_min,
            'Distance_Weather_Interaction': distance_weather_interaction,
            'Traffic_Prep_Interaction': traffic_prep_interaction,
            'Distance_Prep_Interaction': distance_prep_interaction,
            'Distance_Squared': distance_squared,
            'Prep_Squared': prep_squared,
            'Distance_per_Experience': distance_per_experience,
            'Weather_encoded': encoded_features['Weather_encoded'],
            'Traffic_Level_encoded': encoded_features['Traffic_Level_encoded'],
            'Time_of_Day_encoded': encoded_features['Time_of_Day_encoded'],
            'Vehicle_Type_encoded': encoded_features['Vehicle_Type_encoded'],
            'Distance_Category_encoded': encoded_features['Distance_Category_encoded'],
            'Prep_Category_encoded': encoded_features['Prep_Category_encoded'],
            'Experience_Category_encoded': encoded_features['Experience_Category_encoded']
        }

        # Use training-time feature order from config for robust compatibility.
        configured_features = (self.feature_config or {}).get('feature_columns', [])
        if not configured_features:
            configured_features = [
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
                'Experience_Category_encoded'
            ]

        features = np.array(
            [feature_values.get(name, 0.0) for name in configured_features],
            dtype=float
        ).reshape(1, -1)
        
        # Scale features
        features_scaled = self.scaler.transform(features)
        
        return features_scaled
    
    def predict(
        self,
        distance: float,
        traffic: str,
        weather: str,
        prep_time: float,
        order_size: str,
        traffic_index: float | None = None,
        weather_severity: float | None = None,
        restaurant_load: float | None = None,
        rider_availability: float | None = None,
        pickup_delay_min: float | None = None,
    ) -> Tuple[float, float]:
        """
        Make prediction using ensemble model
        Returns: (estimated_time, confidence)
        """
        
        if not self.is_loaded:
            # Fallback to simple calculation if models not loaded
            return self._fallback_predict(distance, traffic, weather, prep_time, order_size)
        
        try:
            # Prepare features
            features = self.prepare_features(
                distance=distance,
                traffic=traffic,
                weather=weather,
                prep_time=prep_time,
                order_size=order_size,
                traffic_index=traffic_index,
                weather_severity=weather_severity,
                restaurant_load=restaurant_load,
                rider_availability=rider_availability,
                pickup_delay_min=pickup_delay_min,
            )
            
            # Make predictions with both models
            xgb_pred = self.xgb_model.predict(features)[0]
            secondary_pred = self.secondary_model.predict(features)[0]
            
            # Ensemble weights are learned during training and saved in metadata.
            weights = (self.metadata or {}).get('ensemble_weights', {})
            xgb_weight = float(weights.get('xgb', 0.7))
            secondary_weight = float(weights.get('gbr', weights.get('rf', 0.3)))
            total_weight = xgb_weight + secondary_weight
            if total_weight <= 0:
                xgb_weight, secondary_weight = 0.7, 0.3
                total_weight = 1.0
            xgb_weight /= total_weight
            secondary_weight /= total_weight

            estimated_time = (xgb_weight * xgb_pred) + (secondary_weight * secondary_pred)

            # Add lightweight order-size calibration after ensemble.
            estimated_time *= ORDER_SIZE_MULTIPLIER.get(order_size.lower(), 1.0)

            # Keep predictions within a realistic range from training distribution.
            target_stats = (self.metadata or {}).get('target_stats', {})
            y_min = float(target_stats.get('min', 5.0))
            y_max = float(target_stats.get('max', 120.0))
            estimated_time = float(np.clip(estimated_time, y_min, y_max))
            
            # Confidence based on model agreement and historical ensemble accuracy.
            pred_diff = abs(xgb_pred - secondary_pred)
            denom = max(estimated_time, 1e-6)
            agreement_factor = max(0.0, 1.0 - (pred_diff / denom))
            
            base_accuracy = self.metadata['ensemble_performance']['accuracy']
            confidence = base_accuracy * agreement_factor
            
            # Keep confidence deterministic and bounded.
            confidence = float(np.clip(confidence, 80.0, 99.0))
            
            return max(5.0, estimated_time), confidence
            
        except Exception as e:
            print(f"Error in prediction: {str(e)}")
            return self._fallback_predict(distance, traffic, weather, prep_time, order_size)
    
    def _fallback_predict(self, distance: float, traffic: str, weather: str, 
                          prep_time: float, order_size: str) -> Tuple[float, float]:
        """Fallback prediction if models are not available"""
        
        # Simple rule-based calculation
        base_time = distance * 3.0
        
        traffic_multiplier = {'low': 0.8, 'medium': 1.0, 'high': 1.3}.get(traffic.lower(), 1.0)
        weather_multiplier = {'clear': 1.0, 'rainy': 1.2, 'stormy': 1.4}.get(weather.lower(), 1.0)
        order_multiplier = {'small': 0.9, 'medium': 1.0, 'large': 1.1}.get(order_size.lower(), 1.0)
        
        estimated_time = (base_time * traffic_multiplier * weather_multiplier * 
                         order_multiplier + prep_time)
        
        confidence = 88.0
        
        return max(10, estimated_time), min(99, max(85, confidence))
    
    def get_model_info(self) -> Dict:
        """Get information about loaded models"""
        if self.is_loaded and self.metadata:
            return {
                'status': 'loaded',
                'version': self.metadata['model_version'],
                'accuracy': self.metadata['ensemble_performance']['accuracy'],
                'mae': self.metadata['ensemble_performance']['mae'],
                'r2_score': self.metadata['ensemble_performance']['r2_score'],
                'training_date': self.metadata['training_date'],
                'dataset_size': self.metadata['dataset_size']
            }
        else:
            return {
                'status': 'fallback',
                'version': 'N/A',
                'message': 'Using rule-based prediction. Train models for better accuracy.'
            }
