import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Search, Filter, Play, Pause, 
  Edit2, TrendingUp, TrendingDown, Settings2,
  MapPin, Target, X, Ban
} from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { useStore } from '../store/useStore'
import { Campaign, LocationTarget } from '../types'
import { searchLocations, radiusOptions, type Location } from '../data/locations'

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
  const [showLocationSettings, setShowLocationSettings] = useState(false)
  
  // Location targeting state
  const [locationSearch, setLocationSearch] = useState('')
  const [showLocationDropdown, setShowLocationDropdown] = useState(false)
  const [campaignLocations, setCampaignLocations] = useState<LocationTarget[]>([])
  const [selectedLocationForRadius, setSelectedLocationForRadius] = useState<Location | null>(null)
  const [showRadiusModal, setShowRadiusModal] = useState(false)
  const [selectedRadius, setSelectedRadius] = useState(25)
  const [excludeOutsideRadius, setExcludeOutsideRadius] = useState(true)

  const locationSearchResults = useMemo(() => {
    if (!locationSearch.trim()) return [];
    return searchLocations(locationSearch);
  }, [locationSearch]);

  const handleSelectLocation = (location: Location, targetType: 'include' | 'exclude' = 'include') => {
    if (location.type === 'city' && location.coordinates && targetType === 'include') {
      setSelectedLocationForRadius(location);
      setShowRadiusModal(true);
    } else {
      addLocationTarget(location, targetType);
    }
    setLocationSearch('');
    setShowLocationDropdown(false);
  };

  const addLocationTarget = (location: Location, targetType: 'include' | 'exclude', radius?: number) => {
    const newTarget: LocationTarget = {
      id: `${location.id}-${Date.now()}`,
      name: location.name,
      type: location.type,
      targetType,
      coordinates: location.coordinates,
      ...(radius && { radius: { value: radius, unit: 'miles' as const } }),
    };
    setCampaignLocations(prev => [...prev, newTarget]);
  };

  const removeLocationTarget = (id: string) => {
    setCampaignLocations(prev => prev.filter(t => t.id !== id));
  };

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
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-500 pointer-events-none" />
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
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl bg-dark-900 border border-dark-700"
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

            {/* Location Targeting Section */}
            <div className="mb-6">
              <div 
                className="flex items-center justify-between p-4 rounded-xl bg-dark-800 cursor-pointer hover:bg-dark-700 transition"
                onClick={() => setShowLocationSettings(!showLocationSettings)}
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary-400" />
                  <div>
                    <div className="text-white font-medium">Location Targeting</div>
                    <div className="text-dark-400 text-sm">
                      {selectedCampaign.targetLocations.length > 0 
                        ? selectedCampaign.targetLocations.join(', ')
                        : 'No locations set'}
                    </div>
                  </div>
                </div>
                <Settings2 className={`w-5 h-5 text-dark-400 transition ${showLocationSettings ? 'rotate-90' : ''}`} />
              </div>
              
              <AnimatePresence>
                {showLocationSettings && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 p-4 rounded-xl border border-dark-700 space-y-4">
                      {/* Location Search */}
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-500 pointer-events-none" />
                        <input
                          type="text"
                          value={locationSearch}
                          onChange={(e) => {
                            setLocationSearch(e.target.value);
                            setShowLocationDropdown(true);
                          }}
                          onFocus={() => setShowLocationDropdown(true)}
                          placeholder="Search cities, states, or countries..."
                          className="input-field pl-12"
                        />
                        
                        {showLocationDropdown && locationSearch && locationSearchResults.length > 0 && (
                          <div className="absolute top-full left-0 right-0 mt-2 bg-dark-800 border border-dark-600 rounded-lg shadow-xl z-30 max-h-48 overflow-y-auto">
                            {locationSearchResults.map((loc) => (
                              <div
                                key={loc.id}
                                className="px-4 py-2 hover:bg-dark-700 flex items-center justify-between border-b border-dark-700 last:border-0"
                              >
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-dark-400" />
                                  <span className="text-white">{loc.name}</span>
                                  <span className="text-dark-500 text-xs">
                                    {loc.type === 'city' ? 'City' : loc.type === 'state' ? 'State' : 'Country'}
                                  </span>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleSelectLocation(loc, 'include')}
                                    className="px-2 py-1 text-xs rounded bg-success-500/20 text-success-400 hover:bg-success-500/30"
                                  >
                                    {loc.type === 'city' ? '+ Radius' : '+ Include'}
                                  </button>
                                  <button
                                    onClick={() => handleSelectLocation(loc, 'exclude')}
                                    className="px-2 py-1 text-xs rounded bg-red-500/20 text-red-400 hover:bg-red-500/30"
                                  >
                                    Exclude
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Current Locations */}
                      {campaignLocations.length > 0 && (
                        <div className="space-y-2">
                          {campaignLocations.filter(t => t.targetType === 'include').map((target) => (
                            <div
                              key={target.id}
                              className="flex items-center justify-between p-3 rounded-lg bg-dark-800 border border-dark-700"
                            >
                              <div className="flex items-center gap-3">
                                <Target className="w-4 h-4 text-success-400" />
                                <span className="text-white">{target.name}</span>
                                {target.radius && (
                                  <span className="text-primary-400 text-sm">
                                    {target.radius.value} {target.radius.unit} radius
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => removeLocationTarget(target.id)}
                                className="p-1 rounded hover:bg-dark-600 text-dark-400 hover:text-red-400"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          
                          {campaignLocations.filter(t => t.targetType === 'exclude').map((target) => (
                            <div
                              key={target.id}
                              className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/20"
                            >
                              <div className="flex items-center gap-3">
                                <Ban className="w-4 h-4 text-red-400" />
                                <span className="text-white">{target.name}</span>
                                <span className="text-red-400 text-sm">Excluded</span>
                              </div>
                              <button
                                onClick={() => removeLocationTarget(target.id)}
                                className="p-1 rounded hover:bg-dark-600 text-dark-400 hover:text-white"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Exclude Outside Radius */}
                      {campaignLocations.some(t => t.radius) && (
                        <div className="flex items-center justify-between p-3 rounded-lg bg-dark-800">
                          <div className="text-dark-300 text-sm">Exclude all areas outside defined radius</div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={excludeOutsideRadius}
                              onChange={(e) => setExcludeOutsideRadius(e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-dark-600 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-500"></div>
                          </label>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedCampaign(null)}
                className="btn-secondary"
              >
                Close
              </button>
              <button className="btn-primary flex items-center gap-2">
                <Edit2 className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      
      {/* Radius Modal */}
      <AnimatePresence>
        {showRadiusModal && selectedLocationForRadius && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60]"
            onClick={() => setShowRadiusModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-dark-900 border border-dark-700 rounded-xl p-6 w-full max-w-md m-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-2">Set targeting radius</h3>
              <p className="text-dark-400 mb-6">
                Target people within a specific distance from <span className="text-white">{selectedLocationForRadius.name}</span>
              </p>
              
              <div className="mb-6">
                <label className="block text-dark-300 mb-2">Radius</label>
                <select
                  value={selectedRadius}
                  onChange={(e) => setSelectedRadius(Number(e.target.value))}
                  className="input-field"
                >
                  {radiusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRadiusModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    addLocationTarget(selectedLocationForRadius, 'include', selectedRadius);
                    setShowRadiusModal(false);
                    setSelectedLocationForRadius(null);
                  }}
                  className="flex-1 btn-primary"
                >
                  Add Location
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  )
}
