import { motion } from 'framer-motion'
import { 
  TrendingUp, TrendingDown, DollarSign, Target, 
  ArrowRight, Sparkles, Brain, Check, X
} from 'lucide-react'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts'
import DashboardLayout from '../components/DashboardLayout'
import { useStore } from '../store/useStore'
import { mockAnalyticsData, deviceBreakdown, geoPerformance } from '../data/mockData'

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-US').format(value)
}

export default function Dashboard() {
  const { metrics, campaigns, recommendations, applyRecommendation, dismissRecommendation } = useStore()
  
  const activeCampaigns = campaigns.filter(c => c.status === 'active')
  const pendingRecommendations = recommendations.filter(r => r.status === 'pending')

  const stats = [
    {
      label: 'Total Spend',
      value: formatCurrency(metrics.totalSpend),
      change: metrics.spendChange,
      icon: DollarSign,
      color: 'primary',
    },
    {
      label: 'Conversions',
      value: formatNumber(metrics.totalConversions),
      change: metrics.conversionsChange,
      icon: Target,
      color: 'success',
    },
    {
      label: 'Avg. CPA',
      value: formatCurrency(metrics.averageCPA),
      change: metrics.cpaChange,
      icon: TrendingDown,
      color: 'accent',
      invertChange: true,
    },
    {
      label: 'ROAS',
      value: `${metrics.averageROAS}x`,
      change: metrics.roasChange,
      icon: TrendingUp,
      color: 'success',
    },
  ]

  const secondaryStats = [
    { label: 'Total Clicks', value: formatNumber(metrics.totalClicks) },
    { label: 'Impressions', value: formatNumber(metrics.totalImpressions) },
    { label: 'Avg. CTR', value: `${metrics.averageCTR}%` },
    { label: 'Avg. CPC', value: formatCurrency(metrics.averageCPC) },
  ]

  return (
    <DashboardLayout 
      title="Dashboard" 
      subtitle="Real-time overview of your Google Ads performance"
    >
      {/* AI Status Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-4 rounded-xl bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-500/20 flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">AI is actively optimizing your campaigns</h3>
            <p className="text-dark-400 text-sm">
              Last optimization: 12 minutes ago • {pendingRecommendations.length} new recommendations available
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="w-3 h-3 bg-success-400 rounded-full inline-block" />
          </div>
          <span className="text-success-400 font-medium">Active</span>
        </div>
      </motion.div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => {
          const isPositive = stat.invertChange ? stat.change < 0 : stat.change > 0
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="stat-card"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-${stat.color}-500/20 flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                </div>
                <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-success-400' : 'text-red-400'}`}>
                  {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {Math.abs(stat.change)}%
                </div>
              </div>
              <div className="text-dark-400 text-sm mb-1">{stat.label}</div>
              <div className="text-3xl font-bold text-white">{stat.value}</div>
            </motion.div>
          )
        })}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {secondaryStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.05 }}
            className="p-4 rounded-xl glass"
          >
            <div className="text-dark-400 text-sm">{stat.label}</div>
            <div className="text-xl font-semibold text-white">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Performance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 chart-container"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Performance Overview</h3>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary-500" />
                Conversions
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-accent-500" />
                Spend
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={mockAnalyticsData.slice(-14)}>
              <defs>
                <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d946ef" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#d946ef" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="date" 
                stroke="#64748b" 
                fontSize={12}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis yAxisId="left" stroke="#64748b" fontSize={12} />
              <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                }}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="conversions"
                stroke="#0ea5e9"
                fill="url(#colorConversions)"
                strokeWidth={2}
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="spend"
                stroke="#d946ef"
                fill="url(#colorSpend)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Device Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="chart-container"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Device Breakdown</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={deviceBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {deviceBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {deviceBreakdown.map((device) => (
              <div key={device.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: device.color }} 
                  />
                  <span className="text-dark-300">{device.name}</span>
                </div>
                <span className="text-white font-medium">{device.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* AI Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="chart-container"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent-400" />
              AI Recommendations
            </h3>
            <a href="/recommendations" className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <div className="space-y-4">
            {pendingRecommendations.slice(0, 3).map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-xl bg-dark-800 border border-dark-700 hover:border-dark-600 transition"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className={`badge badge-${rec.priority === 'high' ? 'danger' : rec.priority === 'medium' ? 'warning' : 'primary'} mb-2`}>
                      {rec.priority} priority
                    </span>
                    <h4 className="font-medium text-white">{rec.title}</h4>
                  </div>
                  <span className="text-success-400 font-semibold">{rec.impact}</span>
                </div>
                <p className="text-dark-400 text-sm mb-4">{rec.description}</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => applyRecommendation(rec.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition"
                  >
                    <Check className="w-4 h-4" /> Apply
                  </button>
                  <button
                    onClick={() => dismissRecommendation(rec.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-dark-700 text-dark-300 text-sm rounded-lg hover:bg-dark-600 transition"
                  >
                    <X className="w-4 h-4" /> Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Active Campaigns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="chart-container"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Active Campaigns</h3>
            <a href="/campaigns" className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1">
              Manage <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <div className="space-y-4">
            {activeCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="p-4 rounded-xl bg-dark-800 border border-dark-700"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-white">{campaign.name}</h4>
                    <span className="badge badge-success">Active</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold">${campaign.dailySpend.toFixed(2)}/day</div>
                    <div className="text-dark-400 text-sm">${campaign.budget} budget</div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-dark-400">Clicks</div>
                    <div className="text-white">{formatNumber(campaign.clicks)}</div>
                  </div>
                  <div>
                    <div className="text-dark-400">Conv.</div>
                    <div className="text-white">{campaign.conversions}</div>
                  </div>
                  <div>
                    <div className="text-dark-400">CPA</div>
                    <div className="text-white">${campaign.cpa.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-dark-400">ROAS</div>
                    <div className="text-success-400">{campaign.roas}x</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Geographic Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="chart-container mt-6"
      >
        <h3 className="text-lg font-semibold text-white mb-6">Top Performing Locations</h3>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Location</th>
                <th>Impressions</th>
                <th>Clicks</th>
                <th>Conversions</th>
                <th>Spend</th>
                <th>CPA</th>
              </tr>
            </thead>
            <tbody>
              {geoPerformance.map((geo) => (
                <tr key={geo.location}>
                  <td className="font-medium text-white">{geo.location}</td>
                  <td>{formatNumber(geo.impressions)}</td>
                  <td>{formatNumber(geo.clicks)}</td>
                  <td>{geo.conversions}</td>
                  <td>${geo.spend.toFixed(2)}</td>
                  <td className="text-success-400">${geo.cpa.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </DashboardLayout>
  )
}
