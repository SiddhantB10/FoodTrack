'use client'

import { motion } from 'framer-motion'
import { Database, Settings, Brain, Sparkles } from 'lucide-react'

const steps = [
  {
    icon: Database,
    title: 'Data Collection',
    description: 'Gather real-time data including delivery distance, traffic conditions, weather, restaurant prep time, and order size.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Settings,
    title: 'Data Preprocessing',
    description: 'Clean and normalize data, handle missing values, and engineer features for optimal model performance.',
    color: 'from-primary-500 to-primary-600',
  },
  {
    icon: Brain,
    title: 'ML Model Prediction',
    description: 'Run the processed data through our trained XGBoost model to generate accurate time predictions.',
    color: 'from-accent-500 to-accent-600',
  },
  {
    icon: Sparkles,
    title: 'ETA Output',
    description: 'Receive your predicted delivery time with confidence scores and estimated arrival window.',
    color: 'from-primary-400 to-accent-500',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-20 gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            How <span className="gradient-text">FoodTrack</span> Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our intelligent prediction pipeline combines multiple data sources 
            and advanced machine learning to estimate your delivery time.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-primary-200 to-accent-200 -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                {/* Step Number */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-white rounded-full border-4 border-primary-200 flex items-center justify-center font-bold text-primary-600 shadow-lg z-20">
                  {index + 1}
                </div>

                {/* Card */}
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-white rounded-2xl p-6 pt-10 shadow-soft hover:shadow-xl transition-all duration-300 h-full border border-gray-100"
                >
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 mx-auto`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-display font-semibold mb-3 text-center text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-center text-sm leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="inline-block bg-white rounded-2xl p-8 shadow-soft">
            <h3 className="text-2xl font-display font-bold mb-3">
              Want to Learn More?
            </h3>
            <p className="text-gray-600 mb-6 max-w-md">
              Dive deeper into our machine learning model, algorithms, and the science behind accurate predictions.
            </p>
            <motion.a
              href="/about"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-8 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-full font-semibold shadow-lg hover:shadow-glow transition-all"
            >
              Explore the Technology
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
