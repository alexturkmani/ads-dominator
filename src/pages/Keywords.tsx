import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, Plus, TrendingUp, TrendingDown, Sparkles, 
  Check, X, AlertTriangle, ArrowUp, ArrowDown
} from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { mockKeywords, mockKeywordSuggestions as keywordSuggestions } from '../data/mockData'
import { Keyword } from '../types'

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-US').format(value)
}

export default function Keywords() {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<keyof Keyword>('conversions')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [showSuggestions, setShowSuggestions] = useState(true)

  const keywords = mockKeywords

  const filteredKeywords = keywords
    .filter((kw) => kw.keyword.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      const aVal = a[sortBy] as number
      const bVal = b[sortBy] as number
      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal
    })

  const handleSort = (column: keyof Keyword) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')
    } else {
      setSortBy(column)
      setSortOrder('desc')
    }
  }

  const getMatchTypeBadge = (matchType: string) => {
    switch (matchType) {
      case 'exact':
        return <span className="badge badge-primary">Exact</span>
      case 'phrase':
        return <span className="badge badge-accent">Phrase</span>
      case 'broad':
        return <span className="badge">Broad</span>
      default:
        return null
    }
  }

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="w-2 h-2 rounded-full bg-success-400" />
      case 'paused':
        return <span className="w-2 h-2 rounded-full bg-yellow-400" />
      default:
        return <span className="w-2 h-2 rounded-full bg-dark-500" />
    }
  }

  const getQualityScoreColor = (score: number) => {
    if (score >= 8) return 'text-success-400'
    if (score >= 6) return 'text-yellow-400'
    return 'text-red-400'
  }

  const SortIcon = ({ column }: { column: keyof Keyword }) => {
    if (sortBy !== column) return null
    return sortOrder === 'desc' ? (
      <ArrowDown className="w-4 h-4 inline ml-1" />
    ) : (
      <ArrowUp className="w-4 h-4 inline ml-1" />
    )
  }

  return (
    <DashboardLayout 
      title="Keywords" 
      subtitle="Discover high-converting keywords and optimize bids"
    >
      {/* Keyword Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl glass"
        >
          <div className="text-dark-400 text-sm">Total Keywords</div>
          <div className="text-2xl font-bold text-white">{keywords.length}</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-xl glass"
        >
          <div className="text-dark-400 text-sm">Avg. Quality Score</div>
          <div className="text-2xl font-bold text-success-400">
            {(keywords.reduce((sum, k) => sum + k.qualityScore, 0) / keywords.length).toFixed(1)}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-xl glass"
        >
          <div className="text-dark-400 text-sm">Total Conversions</div>
          <div className="text-2xl font-bold text-white">
            {formatNumber(keywords.reduce((sum, k) => sum + k.conversions, 0))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-xl glass"
        >
          <div className="text-dark-400 text-sm">Avg. CPA</div>
          <div className="text-2xl font-bold text-primary-400">
            ${(keywords.reduce((sum, k) => sum + k.cpa, 0) / keywords.length).toFixed(2)}
          </div>
        </motion.div>
      </div>

      {/* AI Keyword Suggestions */}
      {showSuggestions && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-6 rounded-xl bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-500/20"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent-400" />
              AI-Suggested Keywords
            </h3>
            <button
              onClick={() => setShowSuggestions(false)}
              className="text-dark-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid gap-3">
            {keywordSuggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion.keyword}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg bg-dark-800 border border-dark-700 flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-medium text-white">{suggestion.keyword}</span>
                    {getMatchTypeBadge(suggestion.matchType)}
                    <span className={`text-sm ${
                      suggestion.competition === 'low' ? 'text-success-400' :
                      suggestion.competition === 'medium' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {suggestion.competition} competition
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-dark-400">
                    <span>Est. CPC: ${suggestion.estimatedCpc.toFixed(2)}</span>
                    <span>Volume: {formatNumber(suggestion.searchVolume)}/mo</span>
                    <span className="text-success-400">
                      Opportunity: {suggestion.opportunityScore}%
                    </span>
                  </div>
                </div>
                <button className="btn-primary text-sm flex items-center gap-1">
                  <Plus className="w-4 h-4" /> Add
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-500" />
          <input
            type="text"
            placeholder="Search keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-12 w-full"
          />
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Keywords
        </button>
      </div>

      {/* Keywords Table */}
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
                <th>Status</th>
                <th>Keyword</th>
                <th>Match Type</th>
                <th 
                  className="cursor-pointer hover:text-white"
                  onClick={() => handleSort('qualityScore')}
                >
                  Quality Score <SortIcon column="qualityScore" />
                </th>
                <th 
                  className="cursor-pointer hover:text-white"
                  onClick={() => handleSort('impressions')}
                >
                  Impressions <SortIcon column="impressions" />
                </th>
                <th 
                  className="cursor-pointer hover:text-white"
                  onClick={() => handleSort('clicks')}
                >
                  Clicks <SortIcon column="clicks" />
                </th>
                <th 
                  className="cursor-pointer hover:text-white"
                  onClick={() => handleSort('ctr')}
                >
                  CTR <SortIcon column="ctr" />
                </th>
                <th 
                  className="cursor-pointer hover:text-white"
                  onClick={() => handleSort('conversions')}
                >
                  Conversions <SortIcon column="conversions" />
                </th>
                <th 
                  className="cursor-pointer hover:text-white"
                  onClick={() => handleSort('cpa')}
                >
                  CPA <SortIcon column="cpa" />
                </th>
                <th>Bid</th>
              </tr>
            </thead>
            <tbody>
              {filteredKeywords.map((kw, index) => (
                <motion.tr
                  key={kw.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.02 * index }}
                  className="group"
                >
                  <td>
                    <div className="flex items-center justify-center">
                      {getStatusIndicator(kw.status)}
                    </div>
                  </td>
                  <td>
                    <span className="font-medium text-white">{kw.keyword}</span>
                  </td>
                  <td>{getMatchTypeBadge(kw.matchType)}</td>
                  <td>
                    <span className={getQualityScoreColor(kw.qualityScore)}>
                      {kw.qualityScore}/10
                    </span>
                  </td>
                  <td>{formatNumber(kw.impressions)}</td>
                  <td>{formatNumber(kw.clicks)}</td>
                  <td>
                    <span className={kw.ctr > 5 ? 'text-success-400' : kw.ctr > 3 ? 'text-white' : 'text-red-400'}>
                      {kw.ctr}%
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <span className="text-white">{kw.conversions}</span>
                      {kw.conversions > 10 ? (
                        <TrendingUp className="w-4 h-4 text-success-400" />
                      ) : null}
                    </div>
                  </td>
                  <td className={kw.cpa < 25 ? 'text-success-400' : kw.cpa < 40 ? 'text-white' : 'text-red-400'}>
                    ${kw.cpa.toFixed(2)}
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="text-white">${kw.bid.toFixed(2)}</span>
                      <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                        <button className="p-1 rounded hover:bg-dark-700 text-dark-400 hover:text-success-400">
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button className="p-1 rounded hover:bg-dark-700 text-dark-400 hover:text-red-400">
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredKeywords.length === 0 && (
          <div className="text-center py-12">
            <p className="text-dark-400">No keywords found matching your search</p>
          </div>
        )}
      </motion.div>

      {/* Negative Keywords Alert */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-start gap-4"
      >
        <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
        <div>
          <h4 className="font-semibold text-white mb-1">3 Negative Keywords Suggested</h4>
          <p className="text-dark-400 text-sm">
            AI detected search terms wasting budget: "free pest control", "diy pest control", "pest control jobs".
            Add these as negative keywords to improve campaign efficiency.
          </p>
          <button className="mt-3 text-primary-400 hover:text-primary-300 text-sm font-medium">
            Review & Add Negative Keywords →
          </button>
        </div>
      </motion.div>
    </DashboardLayout>
  )
}
