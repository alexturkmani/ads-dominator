import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, Beaker, TrendingUp, Check, Play, Pause,
  Trophy, AlertCircle, Clock, Sparkles
} from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { mockABTests } from '../data/mockData'
import { ABTest } from '../types'

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-US').format(value)
}

export default function ABTesting() {
  const [tests] = useState<ABTest[]>(mockABTests)
  const [, setShowNewTest] = useState(false)

  const activeTests = tests.filter(t => t.status === 'running')
  const completedTests = tests.filter(t => t.status === 'completed')
  const draftTests = tests.filter(t => t.status === 'draft')

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'running':
        return <span className="badge badge-success">Running</span>
      case 'completed':
        return <span className="badge badge-primary">Completed</span>
      case 'draft':
        return <span className="badge">Draft</span>
      default:
        return null
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 95) return 'text-success-400'
    if (confidence >= 80) return 'text-yellow-400'
    return 'text-dark-400'
  }

  const TestCard = ({ test }: { test: ABTest }) => {
    const winner = test.variants.find(v => v.isWinner)
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-xl glass"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">{test.name}</h3>
            <p className="text-dark-400 text-sm">{test.description}</p>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(test.status)}
            {test.status === 'running' && (
              <button className="p-2 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-white">
                <Pause className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-dark-400 mb-6">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            Started: {new Date(test.startDate).toLocaleDateString()}
          </span>
          {test.endDate && (
            <span>Ended: {new Date(test.endDate).toLocaleDateString()}</span>
          )}
          <span className={getConfidenceColor(test.confidence)}>
            {test.confidence}% confidence
          </span>
        </div>

        <div className="space-y-4">
          {test.variants.map((variant) => {
            const isWinner = variant.isWinner
            const isControl = variant.isControl
            const convRate = ((variant.conversions / variant.impressions) * 100).toFixed(2)
            const ctr = ((variant.clicks / variant.impressions) * 100).toFixed(2)
            
            return (
              <div
                key={variant.id}
                className={`p-4 rounded-lg border ${
                  isWinner 
                    ? 'bg-success-500/10 border-success-500/30' 
                    : 'bg-dark-800 border-dark-700'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{variant.name}</span>
                    {isControl && (
                      <span className="text-xs px-2 py-0.5 rounded bg-dark-600 text-dark-300">
                        Control
                      </span>
                    )}
                    {isWinner && (
                      <span className="text-xs px-2 py-0.5 rounded bg-success-500/20 text-success-400 flex items-center gap-1">
                        <Trophy className="w-3 h-3" /> Winner
                      </span>
                    )}
                  </div>
                  {variant.improvement !== undefined && variant.improvement !== 0 && (
                    <span className={`text-sm font-medium ${variant.improvement > 0 ? 'text-success-400' : 'text-red-400'}`}>
                      {variant.improvement > 0 ? '+' : ''}{variant.improvement}%
                    </span>
                  )}
                </div>

                <p className="text-dark-400 text-sm mb-3 line-clamp-2">
                  {variant.content}
                </p>

                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-dark-500">Impressions</div>
                    <div className="text-white font-medium">{formatNumber(variant.impressions)}</div>
                  </div>
                  <div>
                    <div className="text-dark-500">Clicks</div>
                    <div className="text-white font-medium">{formatNumber(variant.clicks)}</div>
                  </div>
                  <div>
                    <div className="text-dark-500">CTR</div>
                    <div className="text-white font-medium">{ctr}%</div>
                  </div>
                  <div>
                    <div className="text-dark-500">Conv. Rate</div>
                    <div className={`font-medium ${isWinner ? 'text-success-400' : 'text-white'}`}>
                      {convRate}%
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {test.status === 'completed' && winner && (
          <div className="mt-4 p-4 rounded-lg bg-primary-500/10 border border-primary-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-primary-400" />
              <span className="font-medium text-white">AI Recommendation</span>
            </div>
            <p className="text-dark-300 text-sm">
              Apply "{winner.name}" to all ad groups for an estimated +{winner.improvement}% improvement in conversion rate.
            </p>
            <button className="mt-3 btn-primary text-sm">
              Apply Winner to Campaign
            </button>
          </div>
        )}
      </motion.div>
    )
  }

  return (
    <DashboardLayout 
      title="A/B Testing" 
      subtitle="Test ad variations to maximize conversions"
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl glass"
        >
          <div className="text-dark-400 text-sm">Active Tests</div>
          <div className="text-2xl font-bold text-white">{activeTests.length}</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-xl glass"
        >
          <div className="text-dark-400 text-sm">Completed</div>
          <div className="text-2xl font-bold text-success-400">{completedTests.length}</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-xl glass"
        >
          <div className="text-dark-400 text-sm">Avg. Improvement</div>
          <div className="text-2xl font-bold text-primary-400">+18.3%</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-xl glass"
        >
          <div className="text-dark-400 text-sm">Tests This Month</div>
          <div className="text-2xl font-bold text-white">7</div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNewTest(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> New A/B Test
          </button>
          <button className="btn-secondary flex items-center gap-2">
            <Beaker className="w-4 h-4" /> AI Suggest Test
          </button>
        </div>
      </div>

      {/* AI Suggestion Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-4 rounded-xl bg-gradient-to-r from-accent-500/10 to-primary-500/10 border border-accent-500/20 flex items-start gap-4"
      >
        <Sparkles className="w-6 h-6 text-accent-400 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="font-semibold text-white mb-1">AI Suggested Test</h4>
          <p className="text-dark-400 text-sm mb-3">
            Based on your top-performing ads, we recommend testing a new headline variation:
            "Same-Day Pest Control Service" vs your current "Professional Pest Control".
            Estimated improvement: +12-18%.
          </p>
          <div className="flex items-center gap-3">
            <button className="btn-primary text-sm flex items-center gap-1">
              <Check className="w-4 h-4" /> Create Test
            </button>
            <button className="text-dark-400 hover:text-white text-sm">
              Dismiss
            </button>
          </div>
        </div>
      </motion.div>

      {/* Active Tests */}
      {activeTests.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Play className="w-5 h-5 text-success-400" />
            Running Tests
          </h2>
          <div className="grid gap-6">
            {activeTests.map((test) => (
              <TestCard key={test.id} test={test} />
            ))}
          </div>
        </div>
      )}

      {/* Completed Tests */}
      {completedTests.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Check className="w-5 h-5 text-primary-400" />
            Completed Tests
          </h2>
          <div className="grid gap-6">
            {completedTests.map((test) => (
              <TestCard key={test.id} test={test} />
            ))}
          </div>
        </div>
      )}

      {/* Draft Tests */}
      {draftTests.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-dark-400" />
            Draft Tests
          </h2>
          <div className="grid gap-6">
            {draftTests.map((test) => (
              <TestCard key={test.id} test={test} />
            ))}
          </div>
        </div>
      )}

      {/* Best Practices */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 p-6 rounded-xl glass"
      >
        <h3 className="text-lg font-semibold text-white mb-4">A/B Testing Best Practices</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-4 h-4 text-primary-400" />
            </div>
            <div>
              <h4 className="font-medium text-white mb-1">Test One Variable</h4>
              <p className="text-dark-400 text-sm">
                Change only one element at a time to clearly identify what drives improvement.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-success-500/20 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-4 h-4 text-success-400" />
            </div>
            <div>
              <h4 className="font-medium text-white mb-1">Wait for Significance</h4>
              <p className="text-dark-400 text-sm">
                Let tests run until they reach 95%+ statistical confidence before declaring a winner.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent-500/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-accent-400" />
            </div>
            <div>
              <h4 className="font-medium text-white mb-1">Apply Winners Quickly</h4>
              <p className="text-dark-400 text-sm">
                Once a clear winner emerges, apply it to maximize gains while testing the next improvement.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  )
}
