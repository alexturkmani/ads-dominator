import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, Search, Filter, Play, Pause, 
  Edit2, TrendingUp, TrendingDown, Settings2
} from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { useStore } from '../store/useStore'
import { Campaign } from '../types'

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

export default function Campaigns() {
  const { campaigns, updateCampaign } = useStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleStatusToggle = (campaign: Campaign) => {
    const newStatus = campaign.status === 'active' ? 'paused' : 'active'
    updateCampaign(campaign.id, { status: newStatus })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="badge badge-success">Active</span>
      case 'paused':
        return <span className="badge badge-warning">Paused</span>
      case 'ended':
        return <span className="badge badge-danger">Ended</span>
      default:
        return <span className="badge">Draft</span>
    }
  }

  return (
    <DashboardLayout 
      title="Campaigns" 
      subtitle="Manage and optimize your Google Ads campaigns"
    >
      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-500" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-12 w-full"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field pr-10 appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="ended">Ended</option>
            </select>
            <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-500 pointer-events-none" />
          </div>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Campaign
        </button>
      </div>

      {/* Campaign Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl glass"
        >
          <div className="text-dark-400 text-sm">Total Campaigns</div>
          <div className="text-2xl font-bold text-white">{campaigns.length}</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-xl glass"
        >
          <div className="text-dark-400 text-sm">Active</div>
          <div className="text-2xl font-bold text-success-400">
            {campaigns.filter(c => c.status === 'active').length}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-xl glass"
        >
          <div className="text-dark-400 text-sm">Total Budget</div>
          <div className="text-2xl font-bold text-white">
            {formatCurrency(campaigns.reduce((sum, c) => sum + c.budget, 0))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-xl glass"
        >
          <div className="text-dark-400 text-sm">Avg. ROAS</div>
          <div className="text-2xl font-bold text-primary-400">
            {(campaigns.reduce((sum, c) => sum + c.roas, 0) / campaigns.length).toFixed(1)}x
          </div>
        </motion.div>
      </div>

      {/* Campaigns List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="chart-container"
      >
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Status</th>
                <th>Budget</th>
                <th>Spend</th>
                <th>Impressions</th>
                <th>Clicks</th>
                <th>CTR</th>
                <th>Conversions</th>
                <th>CPA</th>
                <th>ROAS</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.map((campaign, index) => (
                <motion.tr
                  key={campaign.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="group"
                >
                  <td>
                    <div>
                      <div className="font-medium text-white">{campaign.name}</div>
                      <div className="text-dark-500 text-xs">{campaign.type}</div>
                    </div>
                  </td>
                  <td>{getStatusBadge(campaign.status)}</td>
                  <td className="text-white">{formatCurrency(campaign.budget)}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <span className="text-white">${campaign.dailySpend.toFixed(2)}/day</span>
                    </div>
                  </td>
                  <td>{formatNumber(campaign.impressions)}</td>
                  <td>{formatNumber(campaign.clicks)}</td>
                  <td>
                    <span className={campaign.ctr > 3 ? 'text-success-400' : campaign.ctr > 2 ? 'text-white' : 'text-red-400'}>
                      {campaign.ctr}%
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <span className="text-white">{campaign.conversions}</span>
                      {(campaign.conversionChange ?? 0) > 0 ? (
                        <TrendingUp className="w-4 h-4 text-success-400" />
                      ) : (campaign.conversionChange ?? 0) < 0 ? (
                        <TrendingDown className="w-4 h-4 text-red-400" />
                      ) : null}
                    </div>
                  </td>
                  <td className={campaign.cpa < 30 ? 'text-success-400' : campaign.cpa < 50 ? 'text-white' : 'text-red-400'}>
                    ${campaign.cpa.toFixed(2)}
                  </td>
                  <td className={campaign.roas >= 3 ? 'text-success-400' : campaign.roas >= 2 ? 'text-white' : 'text-red-400'}>
                    {campaign.roas}x
                  </td>
                  <td>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => handleStatusToggle(campaign)}
                        className="p-2 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-white transition"
                        title={campaign.status === 'active' ? 'Pause' : 'Resume'}
                      >
                        {campaign.status === 'active' ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => setSelectedCampaign(campaign)}
                        className="p-2 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-white transition"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-white transition"
                        title="Settings"
                      >
                        <Settings2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCampaigns.length === 0 && (
          <div className="text-center py-12">
            <p className="text-dark-400">No campaigns found matching your criteria</p>
          </div>
        )}
      </motion.div>

      {/* Campaign Details Panel */}
      {selectedCampaign && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedCampaign(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl p-6 rounded-2xl bg-dark-900 border border-dark-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedCampaign.name}</h2>
                <p className="text-dark-400">{selectedCampaign.type} Campaign</p>
              </div>
              {getStatusBadge(selectedCampaign.status)}
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="p-4 rounded-xl bg-dark-800">
                <div className="text-dark-400 text-sm mb-1">Daily Budget</div>
                <div className="text-2xl font-bold text-white">{formatCurrency(selectedCampaign.budget)}</div>
              </div>
              <div className="p-4 rounded-xl bg-dark-800">
                <div className="text-dark-400 text-sm mb-1">Current Spend</div>
                <div className="text-2xl font-bold text-white">${selectedCampaign.dailySpend.toFixed(2)}/day</div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 rounded-lg bg-dark-800">
                <div className="text-xl font-bold text-white">{formatNumber(selectedCampaign.impressions)}</div>
                <div className="text-dark-400 text-xs">Impressions</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-dark-800">
                <div className="text-xl font-bold text-white">{formatNumber(selectedCampaign.clicks)}</div>
                <div className="text-dark-400 text-xs">Clicks</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-dark-800">
                <div className="text-xl font-bold text-success-400">{selectedCampaign.conversions}</div>
                <div className="text-dark-400 text-xs">Conversions</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-dark-800">
                <div className="text-xl font-bold text-primary-400">{selectedCampaign.roas}x</div>
                <div className="text-dark-400 text-xs">ROAS</div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedCampaign(null)}
                className="btn-secondary"
              >
                Close
              </button>
              <button className="btn-primary flex items-center gap-2">
                <Edit2 className="w-4 h-4" /> Edit Campaign
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </DashboardLayout>
  )
}
