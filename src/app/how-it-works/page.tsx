'use client'

import { motion } from 'framer-motion'
import { 
  Database, 
  Settings, 
  Brain, 
  Sparkles,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Zap
} from 'lucide-react'

const steps = [
  {
    icon: Database,
    title: 'Data Collection',
    description: 'We gather comprehensive delivery data from multiple sources in real-time.',
    details: [
      'Delivery distance calculated using GPS coordinates',
      'Real-time traffic data from mapping APIs',
      'Weather conditions via meteorological services',
      'Restaurant preparation time from historical data',
      'Order complexity and size parameters',
    ],
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Settings,
    title: 'Data Preprocessing',
    description: 'Raw data is cleaned, normalized, and transformed for optimal model performance.',
    details: [
      'Handle missing values with intelligent imputation',
      'Normalize numerical features to standard scales',
      'Encode categorical variables (traffic, weather)',
      'Feature engineering for time-based patterns',
      'Remove outliers and anomalous data points',
    ],
    color: 'from-primary-500 to-primary-600',
  },
  {
    icon: Brain,
    title: 'ML Model Prediction',
    description: 'Our trained ensemble model processes the data to generate accurate predictions.',
    details: [
      'XGBoost regression for primary predictions',
      'Random Forest for ensemble validation',
      'Feature importance analysis',
      'Confidence score calculation',
      'Model uncertainty quantification',
    ],
    color: 'from-accent-500 to-accent-600',
  },
  {
    icon: Sparkles,
    title: 'ETA Output',
    description: 'Final prediction is delivered with confidence metrics and time windows.',
    details: [
      'Estimated delivery time in minutes',
      'Confidence score (85-99%)',
      'Predicted arrival time window',
      'Key contributing factors breakdown',
      'Real-time updates as conditions change',
    ],
    color: 'from-primary-400 to-accent-500',
  },
]

const benefits = [
  {
    icon: TrendingUp,
    title: '95% Accuracy',
    description: 'Consistently accurate predictions across diverse scenarios',
  },
  {
    icon: Zap,
    title: 'Real-Time Processing',
    description: 'Instant predictions using optimized inference pipeline',
  },
  {
    icon: Brain,
    title: 'Adaptive Learning',
    description: 'Continuous improvement from new delivery data',
  },
]

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Hero Section */}
      <section className="gradient-bg py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              How <span className="gradient-text">FoodTrack</span> Works
            </h1>
            <p className="text-lg text-gray-600">
              Dive deep into our machine learning pipeline and understand how we deliver 
              accurate food delivery time predictions using cutting-edge AI technology.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Visual */}
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className={`relative bg-gradient-to-br ${step.color} rounded-2xl p-12 text-white`}>
                    <div className="absolute top-4 right-4 text-white/20 text-8xl font-bold">
                      {index + 1}
                    </div>
                    <step.icon className="w-20 h-20 mb-6" />
                    <h3 className="text-3xl font-display font-bold mb-4">
                      {step.title}
                    </h3>
                    <p className="text-white/90 text-lg">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <div className="space-y-4">
                    {step.details.map((detail, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: index % 2 === 0 ? 20 : -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 * i }}
                        className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg"
                      >
                        <CheckCircle2 className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{detail}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Flow Diagram */}
      <section className="py-16 gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              End-to-End Pipeline
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From data input to prediction output in milliseconds
            </p>
          </motion.div>

          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-300 via-primary-300 to-accent-300 -translate-y-1/2" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="bg-white rounded-xl p-6 shadow-soft border border-gray-100 text-center">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-4`}>
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-display font-semibold mb-2">{step.title}</h3>
                    <div className="text-sm text-gray-600">{step.description.split('.')[0]}</div>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                      <ArrowRight className="w-6 h-6 text-primary-400" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Why Our Approach Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Advanced machine learning combined with real-world data delivers unmatched accuracy
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-soft border border-gray-100 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-display font-bold mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 gradient-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Ready to Experience It Yourself?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Try our prediction engine and see the accuracy in action
            </p>
            <motion.a
              href="/predict"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-glow transition-all"
            >
              <span>Try FoodTrack Now</span>
              <ArrowRight className="w-5 h-5" />
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
