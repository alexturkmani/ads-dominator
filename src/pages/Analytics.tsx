import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, Download, TrendingUp, TrendingDown
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'
import DashboardLayout from '../components/DashboardLayout'
import { mockAnalyticsData, deviceBreakdown, geoPerformance } from '../data/mockData'

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-US').format(value)
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(value)
}

const hourlyData = [
  { hour: '00:00', clicks: 45, conversions: 2 },
  { hour: '02:00', clicks: 32, conversions: 1 },
  { hour: '04:00', clicks: 28, conversions: 1 },
  { hour: '06:00', clicks: 89, conversions: 4 },
  { hour: '08:00', clicks: 234, conversions: 12 },
  { hour: '10:00', clicks: 312, conversions: 18 },
  { hour: '12:00', clicks: 289, conversions: 15 },
  { hour: '14:00', clicks: 345, conversions: 22 },
  { hour: '16:00', clicks: 378, conversions: 24 },
  { hour: '18:00', clicks: 412, conversions: 28 },
  { hour: '20:00', clicks: 289, conversions: 16 },
  { hour: '22:00', clicks: 156, conversions: 8 },
]

// Conversion funnel data available for future use
// const conversionFunnel = [
//   { stage: 'Impressions', value: 125000 },
//   { stage: 'Clicks', value: 4250 },
//   { stage: 'Site Visits', value: 3850 },
//   { stage: 'Form Starts', value: 890 },
//   { stage: 'Conversions', value: 156 },
// ]

const campaignPerformance = [
  { name: 'Brand', spend: 2500, conversions: 45, color: '#0ea5e9' },
  { name: 'Non-Brand', spend: 4800, conversions: 68, color: '#d946ef' },
  { name: 'Remarketing', spend: 1800, conversions: 32, color: '#10b981' },
  { name: 'Display', spend: 1200, conversions: 11, color: '#f59e0b' },
]

export default function Analytics() {
  const [dateRange, setDateRange] = useState('7d')

  const filteredData = dateRange === '7d' 
    ? mockAnalyticsData.slice(-7) 
    : dateRange === '14d' 
    ? mockAnalyticsData.slice(-14) 
    : mockAnalyticsData

  const calculateTotals = () => {
    return filteredData.reduce((acc, day) => ({
      impressions: acc.impressions + day.impressions,
      clicks: acc.clicks + day.clicks,
      conversions: acc.conversions + day.conversions,
      spend: acc.spend + day.spend,
    }), { impressions: 0, clicks: 0, conversions: 0, spend: 0 })
  }

  const totals = calculateTotals()
  const ctr = ((totals.clicks / totals.impressions) * 100).toFixed(2)
  const cpa = (totals.spend / totals.conversions).toFixed(2)
  const conversionRate = ((totals.conversions / totals.clicks) * 100).toFixed(2)

  return (
    <DashboardLayout 
      title="Analytics" 
      subtitle="Deep dive into your campaign performance data"
    >
      {/* Date Range & Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-dark-400" />
          <div className="flex rounded-lg bg-dark-800 p-1">
            {[
              { value: '7d', label: '7 Days' },
              { value: '14d', label: '14 Days' },
              { value: '30d', label: '30 Days' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setDateRange(option.value)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  dateRange === option.value
                    ? 'bg-primary-500 text-white'
                    : 'text-dark-400 hover:text-white'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <button className="btn-secondary flex items-center gap-2">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        {[
          { label: 'Impressions', value: formatNumber(totals.impressions), change: 12.5 },
          { label: 'Clicks', value: formatNumber(totals.clicks), change: 8.3 },
          { label: 'CTR', value: `${ctr}%`, change: 2.1 },
          { label: 'Conversions', value: totals.conversions, change: 15.2 },
          { label: 'Conv. Rate', value: `${conversionRate}%`, change: 4.8 },
          { label: 'CPA', value: `$${cpa}`, change: -5.2, invertColor: true },
        ].map((metric, index) => {
          const isPositive = metric.invertColor 
            ? metric.change < 0 
            : metric.change > 0
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 rounded-xl glass"
            >
              <div className="text-dark-400 text-xs mb-1">{metric.label}</div>
              <div className="text-xl font-bold text-white">{metric.value}</div>
              <div className={`flex items-center gap-1 text-xs ${isPositive ? 'text-success-400' : 'text-red-400'}`}>
                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(metric.change)}%
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Main Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Performance Over Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="chart-container"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Performance Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="colorConv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="date" 
                stroke="#64748b" 
                fontSize={12}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                }}
              />
              <Area
                type="monotone"
                dataKey="conversions"
                stroke="#10b981"
                fill="url(#colorConv)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Spend vs Conversions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="chart-container"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Spend vs Conversions</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="date" 
                stroke="#64748b" 
                fontSize={12}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { day: 'numeric' })}
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
              <Bar yAxisId="right" dataKey="spend" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="left" dataKey="conversions" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Second Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Hourly Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="chart-container lg:col-span-2"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Hourly Performance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="hour" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                }}
              />
              <Line 
                type="monotone" 
                dataKey="clicks" 
                stroke="#0ea5e9" 
                strokeWidth={2}
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="conversions" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary-500" /> Clicks
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-success-500" /> Conversions
            </span>
          </div>
        </motion.div>

        {/* Device Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="chart-container"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Device Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={deviceBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
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
          <div className="space-y-2">
            {deviceBreakdown.map((device) => (
              <div key={device.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: device.color }} />
                  <span className="text-dark-300">{device.name}</span>
                </div>
                <span className="text-white">{device.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Campaign Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="chart-container mb-6"
      >
        <h3 className="text-lg font-semibold text-white mb-6">Campaign Performance Comparison</h3>
        <div className="grid md:grid-cols-4 gap-4">
          {campaignPerformance.map((campaign) => (
            <div
              key={campaign.name}
              className="p-4 rounded-xl bg-dark-800 border-l-4"
              style={{ borderLeftColor: campaign.color }}
            >
              <div className="text-white font-medium mb-2">{campaign.name}</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-dark-400">Spend</span>
                  <span className="text-white">{formatCurrency(campaign.spend)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-400">Conversions</span>
                  <span className="text-white">{campaign.conversions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-400">CPA</span>
                  <span className="text-success-400">
                    ${(campaign.spend / campaign.conversions).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Geographic Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="chart-container"
      >
        <h3 className="text-lg font-semibold text-white mb-6">Geographic Performance</h3>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Location</th>
                <th>Impressions</th>
                <th>Clicks</th>
                <th>CTR</th>
                <th>Conversions</th>
                <th>Conv. Rate</th>
                <th>Spend</th>
                <th>CPA</th>
              </tr>
            </thead>
            <tbody>
              {geoPerformance.map((geo) => {
                const ctr = ((geo.clicks / geo.impressions) * 100).toFixed(2)
                const convRate = ((geo.conversions / geo.clicks) * 100).toFixed(2)
                return (
                  <tr key={geo.location}>
                    <td className="font-medium text-white">{geo.location}</td>
                    <td>{formatNumber(geo.impressions)}</td>
                    <td>{formatNumber(geo.clicks)}</td>
                    <td>{ctr}%</td>
                    <td>{geo.conversions}</td>
                    <td className={Number(convRate) > 3 ? 'text-success-400' : 'text-white'}>
                      {convRate}%
                    </td>
                    <td>{formatCurrency(geo.spend)}</td>
                    <td className={geo.cpa < 30 ? 'text-success-400' : 'text-white'}>
                      ${geo.cpa.toFixed(2)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </DashboardLayout>
  )
}
