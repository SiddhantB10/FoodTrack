'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Clock, 
  Target,
  MapPin,
  Calendar,
  Activity
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar,
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { fetchModelInfo, predictDelivery } from '@/lib/modelApi'

export default function DashboardPage() {
  const [accuracy, setAccuracy] = useState<number | null>(null)
  const [mae, setMae] = useState<number | null>(null)
  const [r2, setR2] = useState<number | null>(null)
  const [trainingSize, setTrainingSize] = useState<number | null>(null)
  const [averageEta, setAverageEta] = useState<number | null>(null)
  const [averageConfidence, setAverageConfidence] = useState<number | null>(null)
  const [deliveryTimeData, setDeliveryTimeData] = useState<Array<{ distance: string; predictions: number; rainy: number }>>([])
  const [trafficDistribution, setTrafficDistribution] = useState<Array<{ name: string; value: number; color: string }>>([])
  const [weatherImpact, setWeatherImpact] = useState<Array<{ condition: string; avgTime: number }>>([])

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const modelInfo = await fetchModelInfo()
        if (modelInfo) {
          setAccuracy(modelInfo.accuracy)
          setMae(modelInfo.meanAbsoluteError)
          setR2(modelInfo.r2Score)
          setTrainingSize(modelInfo.trainingDataSize)
        }

        const distances = [2, 4, 6, 8, 10, 12]

        const clearPredictions = await Promise.all(
          distances.map((distance) =>
            predictDelivery({
              distance,
              traffic: 'medium',
              weather: 'clear',
              prepTime: 15,
              orderSize: 'medium',
            })
          )
        )

        const rainyPredictions = await Promise.all(
          distances.map((distance) =>
            predictDelivery({
              distance,
              traffic: 'medium',
              weather: 'rainy',
              prepTime: 15,
              orderSize: 'medium',
            })
          )
        )

        const points = distances.map((distance, index) => ({
          distance: `${distance} km`,
          predictions: clearPredictions[index].estimatedTime,
          rainy: rainyPredictions[index].estimatedTime,
        }))
        setDeliveryTimeData(points)

        const allPredictions = [...clearPredictions, ...rainyPredictions]
        setAverageEta(
          allPredictions.reduce((sum, item) => sum + item.estimatedTime, 0) / allPredictions.length
        )
        setAverageConfidence(
          allPredictions.reduce((sum, item) => sum + item.confidence, 0) / allPredictions.length
        )

        const trafficScenarios = await Promise.all([
          predictDelivery({ distance: 6, traffic: 'low', weather: 'clear', prepTime: 15, orderSize: 'medium' }),
          predictDelivery({ distance: 6, traffic: 'medium', weather: 'clear', prepTime: 15, orderSize: 'medium' }),
          predictDelivery({ distance: 6, traffic: 'high', weather: 'clear', prepTime: 15, orderSize: 'medium' }),
        ])

        const trafficValues = trafficScenarios.map((result) => result.estimatedTime)
        const trafficTotal = trafficValues.reduce((sum, value) => sum + value, 0)
        setTrafficDistribution([
          { name: 'Low Traffic ETA', value: Number(((trafficValues[0] / trafficTotal) * 100).toFixed(1)), color: '#10b981' },
          { name: 'Medium Traffic ETA', value: Number(((trafficValues[1] / trafficTotal) * 100).toFixed(1)), color: '#f97316' },
          { name: 'High Traffic ETA', value: Number(((trafficValues[2] / trafficTotal) * 100).toFixed(1)), color: '#ef4444' },
        ])

        const weatherScenarios = await Promise.all([
          predictDelivery({ distance: 6, traffic: 'medium', weather: 'clear', prepTime: 15, orderSize: 'medium' }),
          predictDelivery({ distance: 6, traffic: 'medium', weather: 'rainy', prepTime: 15, orderSize: 'medium' }),
          predictDelivery({ distance: 6, traffic: 'medium', weather: 'stormy', prepTime: 15, orderSize: 'medium' }),
        ])
        setWeatherImpact([
          { condition: 'Clear', avgTime: weatherScenarios[0].estimatedTime },
          { condition: 'Rainy', avgTime: weatherScenarios[1].estimatedTime },
          { condition: 'Stormy', avgTime: weatherScenarios[2].estimatedTime },
        ])
      } catch {
        setDeliveryTimeData([])
        setTrafficDistribution([])
        setWeatherImpact([])
      }
    }

    loadDashboard()
  }, [])

  const stats = useMemo(() => {
    return [
      {
        icon: Target,
        label: 'Overall Accuracy',
        value: accuracy !== null ? `${accuracy.toFixed(1)}%` : 'N/A',
      },
      {
        icon: Clock,
        label: 'Scenario Avg ETA',
        value: averageEta !== null ? `${averageEta.toFixed(1)} min` : 'N/A',
      },
      {
        icon: TrendingUp,
        label: 'Training Records',
        value: trainingSize !== null ? trainingSize.toLocaleString() : 'N/A',
      },
      {
        icon: Activity,
        label: 'Scenario Avg Confidence',
        value: averageConfidence !== null ? `${averageConfidence.toFixed(1)}%` : 'N/A',
      },
    ]
  }, [accuracy, averageEta, averageConfidence, trainingSize])

  const modelMetricData = useMemo(() => {
    return [
      { metric: 'Accuracy', value: accuracy !== null ? Number(accuracy.toFixed(2)) : 0 },
      { metric: 'R2 x 100', value: r2 !== null ? Number((r2 * 100).toFixed(2)) : 0 },
      { metric: 'MAE', value: mae !== null ? Number(mae.toFixed(2)) : 0 },
    ]
  }, [accuracy, r2, mae])

  return (
    <div className="min-h-screen pt-24 pb-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
            Analytics <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-gray-600">
            Live model metrics and scenario-based prediction analytics from the backend API
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-soft border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Delivery Time Predictions vs Actual */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-soft border border-gray-100"
          >
            <h3 className="text-lg font-display font-semibold mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-primary-500" />
              Predicted ETA by Distance and Weather
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={deliveryTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="distance" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    background: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="predictions" 
                  stroke="#f97316" 
                  strokeWidth={3}
                  dot={{ fill: '#f97316', r: 4 }}
                  name="Clear Weather ETA"
                />
                <Line 
                  type="monotone" 
                  dataKey="rainy" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 4 }}
                  name="Rainy Weather ETA"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Accuracy Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl p-6 shadow-soft border border-gray-100"
          >
            <h3 className="text-lg font-display font-semibold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-primary-500" />
              Current Model Metrics
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={modelMetricData}>
                <defs>
                  <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="metric" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    background: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value) => `${value}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#f97316" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#accuracyGradient)"
                  name="Metric Value"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Second Row Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Traffic Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl p-6 shadow-soft border border-gray-100"
          >
            <h3 className="text-lg font-display font-semibold mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-primary-500" />
              Traffic Impact (Scenario Share)
            </h3>
            <div className="flex items-center justify-between">
              <ResponsiveContainer width="50%" height={250}>
                <PieChart>
                  <Pie
                    data={trafficDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {trafficDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {trafficDistribution.map((item) => (
                  <div key={item.name} className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: item.color }}
                    />
                    <div>
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="text-xs text-gray-600">{item.value}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Weather Impact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-xl p-6 shadow-soft border border-gray-100"
          >
            <h3 className="text-lg font-display font-semibold mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-primary-500" />
              Weather Impact on Predicted ETA
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weatherImpact}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="condition" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    background: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value, name) => [
                    name === 'avgTime' ? `${value} min` : value,
                    'Predicted ETA'
                  ]}
                />
                <Bar 
                  dataKey="avgTime" 
                  fill="#f97316" 
                  radius={[8, 8, 0, 0]}
                  name="Avg Time"
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-6 bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-8 border border-primary-100"
        >
          <h3 className="text-xl font-display font-bold mb-4 flex items-center">
            <Calendar className="w-6 h-6 mr-2 text-primary-600" />
            Key Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Peak Hours</div>
              <div className="text-2xl font-bold gradient-text">Scenario Data</div>
              <div className="text-xs text-gray-500 mt-1">Distance range: 2-12 km</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Best Accuracy</div>
              <div className="text-2xl font-bold gradient-text">
                {accuracy !== null ? `${accuracy.toFixed(1)}%` : 'N/A'}
              </div>
              <div className="text-xs text-gray-500 mt-1">Live model accuracy from API</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Model Quality</div>
              <div className="text-2xl font-bold gradient-text">
                {mae !== null ? `${mae.toFixed(2)} MAE` : 'N/A'}
              </div>
              <div className="text-xs text-gray-500 mt-1">Lower MAE means tighter ETA estimates</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
