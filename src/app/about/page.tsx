'use client'

import { motion } from 'framer-motion'
import { 
  Brain, 
  Cpu, 
  TrendingUp, 
  Database,
  GitBranch,
  Zap,
  Shield,
  BarChart3,
  Code,
  Users
} from 'lucide-react'
import dynamic from 'next/dynamic'

const FloatingOrb = dynamic(
  () => import('@/components/3D/Scene3D').then((mod) => mod.FloatingOrb),
  { ssr: false }
)

const technologies = [
  {
    name: 'XGBoost',
    description: 'Gradient boosting framework for high-performance predictions',
    icon: TrendingUp,
  },
  {
    name: 'Random Forest',
    description: 'Ensemble learning for robust and reliable predictions',
    icon: GitBranch,
  },
  {
    name: 'Linear Regression',
    description: 'Baseline model for comparative analysis',
    icon: BarChart3,
  },
  {
    name: 'Feature Engineering',
    description: 'Advanced data transformation and normalization techniques',
    icon: Database,
  },
]

const features = [
  {
    icon: Brain,
    title: 'Intelligent Predictions',
    description: 'Our ensemble model combines multiple algorithms including XGBoost and Random Forest to deliver predictions with 95% accuracy.',
  },
  {
    icon: Cpu,
    title: 'Real-Time Processing',
    description: 'Optimized inference pipeline processes predictions in under 2 seconds using GPU-accelerated computations.',
  },
  {
    icon: Shield,
    title: 'Robust & Reliable',
    description: 'Cross-validation and continuous monitoring ensure consistent performance across diverse delivery scenarios.',
  },
  {
    icon: Zap,
    title: 'Adaptive Learning',
    description: 'Models are retrained weekly with new data to adapt to changing traffic patterns, weather conditions, and delivery routes.',
  },
]

const modelSpecs = [
  { label: 'Model Type', value: 'Ensemble (XGBoost + Random Forest)' },
  { label: 'Training Data', value: '100,000+ delivery records' },
  { label: 'Features', value: '12 engineered features' },
  { label: 'Accuracy', value: '95.2% ± 1.5%' },
  { label: 'Inference Time', value: '< 2 seconds' },
  { label: 'Update Frequency', value: 'Weekly retraining' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Hero */}
      <section className="gradient-bg py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
                About <span className="gradient-text">FoodTrack</span>
              </h1>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                FoodTrack is an intelligent delivery time prediction platform powered by 
                cutting-edge machine learning algorithms. We combine real-time data from 
                multiple sources to provide accurate ETA predictions for food deliveries.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our mission is to reduce uncertainty in food delivery experiences by 
                leveraging advanced AI technology to predict arrival times with unprecedented 
                accuracy, helping both customers and delivery services plan better.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-[400px]"
            >
              <FloatingOrb />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              What Makes Us Different
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Advanced machine learning meets real-world delivery challenges
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex space-x-4"
              >
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-display font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-20 gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Powered by Advanced ML
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our prediction engine leverages state-of-the-art machine learning algorithms
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-xl p-6 shadow-soft border border-gray-100 text-center"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-accent-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <tech.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="font-display font-semibold mb-2">{tech.name}</h3>
                <p className="text-sm text-gray-600">{tech.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Model Specifications */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Model Specifications
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Technical details about our machine learning pipeline
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {modelSpecs.map((spec, index) => (
                  <motion.div
                    key={spec.label}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 border-b md:border-r border-gray-200 last:border-b-0 md:odd:border-r md:even:border-r-0"
                  >
                    <div className="text-sm text-gray-600 mb-2">{spec.label}</div>
                    <div className="text-lg font-semibold text-gray-900">{spec.value}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Technical Details */}
      <section className="py-20 gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                How the Model Works
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-display font-semibold mb-3 flex items-center">
                    <Code className="w-5 h-5 mr-2 text-primary-500" />
                    Data Collection
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    We collect data from multiple sources including GPS coordinates for distance 
                    calculation, real-time traffic APIs, weather services, and historical restaurant 
                    preparation times. Each input is validated and preprocessed for consistency.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-display font-semibold mb-3 flex items-center">
                    <Database className="w-5 h-5 mr-2 text-primary-500" />
                    Feature Engineering
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Raw data is transformed into 12 engineered features including normalized distance, 
                    traffic intensity scores, weather impact factors, time-of-day patterns, and 
                    order complexity metrics. Features are scaled using standardization.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-display font-semibold mb-3 flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-primary-500" />
                    Ensemble Prediction
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our ensemble combines XGBoost (70% weight) and Random Forest (30% weight) 
                    predictions. XGBoost handles complex non-linear patterns while Random Forest 
                    provides stability. Final predictions include confidence intervals.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Model Performance
              </h2>
              
              <div className="bg-white rounded-2xl p-8 shadow-soft border border-gray-100 mb-6">
                <h3 className="text-lg font-display font-semibold mb-4">
                  Accuracy Metrics
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Overall Accuracy</span>
                      <span className="text-sm font-semibold text-primary-600">95.2%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full" style={{ width: '95.2%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Mean Absolute Error</span>
                      <span className="text-sm font-semibold text-primary-600">2.1 min</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{ width: '92%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">R² Score</span>
                      <span className="text-sm font-semibold text-primary-600">0.94</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{ width: '94%' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-soft border border-gray-100">
                <h3 className="text-lg font-display font-semibold mb-4">
                  Training Details
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Dataset Size</span>
                    <span className="font-semibold">100,000+ samples</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Train/Val/Test Split</span>
                    <span className="font-semibold">70% / 15% / 15%</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Cross-Validation</span>
                    <span className="font-semibold">5-Fold CV</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Hyperparameter Tuning</span>
                    <span className="font-semibold">Grid Search</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team/Project Info */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Users className="w-16 h-16 mx-auto mb-6 text-primary-500" />
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Academic Project
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              FoodTrack was developed as a mini-project to demonstrate the practical 
              application of machine learning in solving real-world problems. This project 
              showcases data collection, preprocessing, model training, evaluation, and 
              deployment in a production-ready web application.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="px-4 py-2 bg-primary-50 text-primary-600 rounded-full text-sm font-medium">
                Machine Learning
              </span>
              <span className="px-4 py-2 bg-primary-50 text-primary-600 rounded-full text-sm font-medium">
                Web Development
              </span>
              <span className="px-4 py-2 bg-primary-50 text-primary-600 rounded-full text-sm font-medium">
                Data Science
              </span>
              <span className="px-4 py-2 bg-primary-50 text-primary-600 rounded-full text-sm font-medium">
                Full Stack
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Ready to Try It?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Experience the accuracy of our ML predictions firsthand
            </p>
            <motion.a
              href="/predict"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-glow transition-all"
            >
              Predict Delivery Time
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
