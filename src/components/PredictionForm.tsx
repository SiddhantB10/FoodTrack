'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MapPin, 
  Cloud, 
  TrendingUp, 
  Clock, 
  Package,
  ArrowRight,
  CheckCircle2,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { predictDelivery, type PredictResponse } from '@/lib/modelApi'

export default function PredictionForm() {
  const [formData, setFormData] = useState({
    distance: '',
    traffic: 'medium',
    weather: 'clear',
    prepTime: '',
    orderSize: 'medium',
  })

  const [result, setResult] = useState<PredictResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const prediction = await predictDelivery({
        distance: parseFloat(formData.distance),
        traffic: formData.traffic as 'low' | 'medium' | 'high',
        weather: formData.weather as 'clear' | 'rainy' | 'stormy',
        prepTime: parseFloat(formData.prepTime),
        orderSize: formData.orderSize as 'small' | 'medium' | 'large',
      })

      setResult(prediction)
    } catch {
      setError('Unable to get prediction from backend API. Please ensure the backend is running on port 8000.')
      setResult(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setResult(null)
    setError(null)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Form */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-2xl shadow-soft p-8 border border-gray-100"
      >
        <h2 className="text-2xl font-display font-bold mb-6 flex items-center">
          <Package className="w-6 h-6 mr-2 text-primary-500" />
          Delivery Details
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-start space-x-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Distance */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 mr-2 text-primary-500" />
              Delivery Distance (km)
            </label>
            <input
              type="number"
              name="distance"
              value={formData.distance}
              onChange={handleInputChange}
              required
              min="0.1"
              step="0.1"
              placeholder="e.g., 5.2"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Traffic Level */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <TrendingUp className="w-4 h-4 mr-2 text-primary-500" />
              Traffic Level
            </label>
            <select
              name="traffic"
              value={formData.traffic}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            >
              <option value="low">Low - Clear roads</option>
              <option value="medium">Medium - Normal flow</option>
              <option value="high">High - Heavy traffic</option>
            </select>
          </div>

          {/* Weather */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Cloud className="w-4 h-4 mr-2 text-primary-500" />
              Weather Condition
            </label>
            <select
              name="weather"
              value={formData.weather}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            >
              <option value="clear">Clear - Good visibility</option>
              <option value="rainy">Rainy - Wet roads</option>
              <option value="stormy">Stormy - Severe conditions</option>
            </select>
          </div>

          {/* Prep Time */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 mr-2 text-primary-500" />
              Restaurant Prep Time (minutes)
            </label>
            <input
              type="number"
              name="prepTime"
              value={formData.prepTime}
              onChange={handleInputChange}
              required
              min="1"
              placeholder="e.g., 15"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Order Size */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Package className="w-4 h-4 mr-2 text-primary-500" />
              Order Size
            </label>
            <select
              name="orderSize"
              value={formData.orderSize}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            >
              <option value="small">Small - 1-2 items</option>
              <option value="medium">Medium - 3-5 items</option>
              <option value="large">Large - 6+ items</option>
            </select>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            className="w-full px-6 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Predicting...</span>
              </>
            ) : (
              <>
                <span>Predict ETA</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </form>
      </motion.div>

      {/* Result */}
      <div className="flex items-center justify-center">
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full"
            >
              <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-8 border border-primary-100 shadow-soft">
                <div className="flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                </div>

                <h3 className="text-center text-2xl font-display font-bold mb-2">
                  Estimated Delivery Time
                </h3>

                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                    className="text-6xl font-bold gradient-text mb-2"
                  >
                    {result.estimatedTime}
                  </motion.div>
                  <div className="text-gray-600 text-lg">minutes</div>
                </div>

                {/* Confidence */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Confidence Score
                    </span>
                    <span className="text-sm font-bold text-primary-600">
                      {result.confidence.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.confidence}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                    />
                  </div>
                </div>

                {/* Factors */}
                <div className="space-y-3">
                  <div className="text-sm font-medium text-gray-700 mb-3">
                    Based on:
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-primary-500" />
                      <span className="text-gray-600">
                        {result.factors.distance} km
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-primary-500" />
                      <span className="text-gray-600 capitalize">
                        {result.factors.traffic} traffic
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Cloud className="w-4 h-4 text-primary-500" />
                      <span className="text-gray-600 capitalize">
                        {result.factors.weather}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-primary-500" />
                      <span className="text-gray-600">
                        {result.factors.prepTime} min prep
                      </span>
                    </div>
                  </div>
                </div>

                {/* Time Window */}
                <div className="mt-6 p-4 bg-white/50 rounded-lg border border-primary-200">
                  <div className="text-center text-sm text-gray-600">
                    Expected arrival between
                  </div>
                  <div className="text-center text-lg font-semibold text-gray-900 mt-1">
                    {Math.max(1, Math.round(result.estimatedTime - 5))} - {Math.round(result.estimatedTime + 5)} minutes
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-gray-400"
            >
              <Clock className="w-24 h-24 mx-auto mb-4 opacity-20" />
              <p className="text-lg">
                Fill in the delivery details to get your ETA prediction
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
