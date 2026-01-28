'use client'

import { motion } from 'framer-motion'
import { Target, Brain, Zap, Shield, TrendingUp, Clock } from 'lucide-react'

const features = [
  {
    icon: Target,
    title: 'Accurate ETA',
    description: 'Precise delivery time predictions with 95% accuracy using advanced ML algorithms.',
    color: 'from-primary-500 to-primary-600',
  },
  {
    icon: Brain,
    title: 'ML-Driven Predictions',
    description: 'Powered by XGBoost and Random Forest models trained on thousands of delivery scenarios.',
    color: 'from-accent-500 to-accent-600',
  },
  {
    icon: Zap,
    title: 'Real-Time Factors',
    description: 'Considers live traffic, weather conditions, and restaurant preparation times.',
    color: 'from-primary-400 to-accent-400',
  },
  {
    icon: Shield,
    title: 'Reliable & Consistent',
    description: 'Continuous model optimization ensures stable and trustworthy predictions.',
    color: 'from-primary-600 to-accent-500',
  },
  {
    icon: TrendingUp,
    title: 'Adaptive Learning',
    description: 'Models improve over time by learning from historical delivery data patterns.',
    color: 'from-accent-400 to-primary-500',
  },
  {
    icon: Clock,
    title: 'Instant Results',
    description: 'Get your ETA prediction in under 2 seconds with our optimized inference pipeline.',
    color: 'from-primary-500 to-accent-600',
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function Features() {
  return (
    <section className="py-20 bg-white">
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
            Why Choose <span className="gradient-text">FoodTrack</span>?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Cutting-edge machine learning technology combined with real-world data 
            to deliver the most accurate food delivery time predictions.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={item}
              whileHover={{ y: -8 }}
              className="group relative p-8 bg-white rounded-2xl shadow-soft hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-display font-semibold mb-3 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Effect */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 mb-6">
            Ready to experience intelligent delivery predictions?
          </p>
          <motion.a
            href="/predict"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-full font-semibold shadow-lg hover:shadow-glow transition-all"
          >
            Try FoodTrack Now
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
