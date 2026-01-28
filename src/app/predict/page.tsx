'use client'

import { motion } from 'framer-motion'
import PredictionForm from '@/components/PredictionForm'
import { Sparkles } from 'lucide-react'

export default function PredictPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white rounded-full shadow-soft mb-6"
          >
            <Sparkles className="w-4 h-4 text-primary-500" />
            <span className="text-sm font-medium text-gray-700">
              AI-Powered Prediction
            </span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Predict Your <span className="gradient-text">Delivery Time</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enter your delivery details and let our machine learning model 
            calculate an accurate ETA based on multiple real-time factors.
          </p>
        </motion.div>

        {/* Form */}
        <PredictionForm />

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 bg-white rounded-2xl p-8 shadow-soft border border-gray-100"
        >
          <h3 className="text-xl font-display font-bold mb-4 text-center">
            How Our Prediction Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-500 mb-2">95%</div>
              <div className="text-sm text-gray-600">
                Average prediction accuracy
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-500 mb-2">5+</div>
              <div className="text-sm text-gray-600">
                Key factors analyzed
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-500 mb-2">&lt;2s</div>
              <div className="text-sm text-gray-600">
                Prediction response time
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
