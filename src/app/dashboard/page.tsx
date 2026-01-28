'use client'

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

// Sample data
const deliveryTimeData = [
  { time: '8 AM', predictions: 12, actual: 11 },
  { time: '10 AM', predictions: 18, actual: 19 },
  { time: '12 PM', predictions: 35, actual: 33 },
  { time: '2 PM', predictions: 28, actual: 30 },
  { time: '4 PM', predictions: 22, actual: 21 },
  { time: '6 PM', predictions: 42, actual: 40 },
  { time: '8 PM', predictions: 38, actual: 39 },
  { time: '10 PM', predictions: 15, actual: 16 },
]

const accuracyData = [
  { week: 'Week 1', accuracy: 88 },
  { week: 'Week 2', accuracy: 90 },
  { week: 'Week 3', accuracy: 92 },
  { week: 'Week 4', accuracy: 94 },
  { week: 'Week 5', accuracy: 95 },
  { week: 'Week 6', accuracy: 95.5 },
]

const trafficDistribution = [
  { name: 'Low Traffic', value: 35, color: '#10b981' },
  { name: 'Medium Traffic', value: 45, color: '#f97316' },
  { name: 'High Traffic', value: 20, color: '#ef4444' },
]

const weatherImpact = [
  { condition: 'Clear', avgTime: 25, count: 450 },
  { condition: 'Rainy', avgTime: 32, count: 180 },
  { condition: 'Stormy', avgTime: 38, count: 70 },
]

const stats = [
  {
    icon: Target,
    label: 'Overall Accuracy',
    value: '95.2%',
    change: '+2.1%',
    positive: true,
  },
  {
    icon: Clock,
    label: 'Avg Delivery Time',
    value: '28 min',
    change: '-3 min',
    positive: true,
  },
  {
    icon: TrendingUp,
    label: 'Total Predictions',
    value: '10,247',
    change: '+1,234',
    positive: true,
  },
  {
    icon: Activity,
    label: 'Model Confidence',
    value: '92.8%',
    change: '+1.5%',
    positive: true,
  },
]

export default function DashboardPage() {
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
            Real-time insights into prediction performance and delivery patterns
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
                <span className={`text-sm font-medium ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
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
              Predicted vs Actual Delivery Times
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={deliveryTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="time" stroke="#9ca3af" />
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
                  name="Predictions"
                />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 4 }}
                  name="Actual"
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
              Model Accuracy Over Time
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={accuracyData}>
                <defs>
                  <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" domain={[85, 100]} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value) => `${value}%`}
                />
                <Area 
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="#f97316" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#accuracyGradient)"
                  name="Accuracy"
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
              Traffic Condition Distribution
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
              Weather Impact on Delivery Time
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
                    name === 'avgTime' ? 'Avg Time' : 'Orders'
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
              <div className="text-2xl font-bold gradient-text">6-8 PM</div>
              <div className="text-xs text-gray-500 mt-1">Highest order volume</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Best Accuracy</div>
              <div className="text-2xl font-bold gradient-text">Clear Weather</div>
              <div className="text-xs text-gray-500 mt-1">97% prediction accuracy</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Avg Response</div>
              <div className="text-2xl font-bold gradient-text">1.8s</div>
              <div className="text-xs text-gray-500 mt-1">Prediction latency</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
