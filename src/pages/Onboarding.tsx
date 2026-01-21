import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Zap, Globe, Building2, Users, MapPin, 
  ArrowRight, ArrowLeft, Check, Sparkles 
} from 'lucide-react'
import { useStore } from '../store/useStore'

const industries = [
  'E-commerce', 'SaaS / Software', 'Local Services', 'Healthcare', 
  'Real Estate', 'Finance', 'Education', 'Travel', 'Food & Beverage', 'Other'
]

const conversionGoals = [
  { id: 'leads', label: 'Lead Generation', description: 'Form submissions, calls, inquiries' },
  { id: 'sales', label: 'Online Sales', description: 'E-commerce purchases' },
  { id: 'signups', label: 'Sign Ups', description: 'Account registrations, trials' },
  { id: 'calls', label: 'Phone Calls', description: 'Inbound sales calls' },
]

const budgetRanges = [
  '$1,000 - $3,000', '$3,000 - $10,000', '$10,000 - $30,000', '$30,000+'
]

export default function Onboarding() {
  const navigate = useNavigate()
  const { setUser, setBusinessProfile } = useStore()
  const [step, setStep] = useState(1)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  
  const [formData, setFormData] = useState({
    websiteUrl: '',
    companyName: '',
    industry: '',
    targetAudience: '',
    conversionGoal: '',
    monthlyBudget: '',
    targetLocations: [] as string[],
    competitors: '',
    uniqueSellingPoints: '',
    email: '',
    password: '',
  })

  const totalSteps = 5

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleComplete = async () => {
    setIsAnalyzing(true)
    
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setUser({
      id: '1',
      email: formData.email,
      name: formData.companyName,
      company: formData.companyName,
      plan: 'pro',
      createdAt: new Date().toISOString(),
    })
    
    setBusinessProfile({
      websiteUrl: formData.websiteUrl,
      industry: formData.industry,
      targetAudience: formData.targetAudience,
      uniqueSellingPoints: formData.uniqueSellingPoints.split(',').map(s => s.trim()),
      competitors: formData.competitors.split(',').map(s => s.trim()),
      conversionGoal: formData.conversionGoal as 'leads' | 'sales' | 'signups' | 'calls',
      targetLocations: formData.targetLocations,
    })
    
    navigate('/dashboard')
  }

  const addLocation = (location: string) => {
    if (location && !formData.targetLocations.includes(location)) {
      setFormData({
        ...formData,
        targetLocations: [...formData.targetLocations, location],
      })
    }
  }

  const removeLocation = (location: string) => {
    setFormData({
      ...formData,
      targetLocations: formData.targetLocations.filter(l => l !== location),
    })
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-2xl font-bold text-white mb-2">Let's analyze your business</h2>
            <p className="text-dark-400 mb-8">Enter your website URL and we'll understand your products, services, and competition.</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-dark-300 mb-2">Website URL</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-500" />
                  <input
                    type="url"
                    value={formData.websiteUrl}
                    onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                    placeholder="https://yourcompany.com"
                    className="input-field pl-12"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-dark-300 mb-2">Company Name</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-500" />
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="Your Company Name"
                    className="input-field pl-12"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-dark-300 mb-2">Industry</label>
                <div className="grid grid-cols-2 gap-3">
                  {industries.map((industry) => (
                    <button
                      key={industry}
                      onClick={() => setFormData({ ...formData, industry })}
                      className={`p-3 rounded-lg border text-left transition ${
                        formData.industry === industry
                          ? 'border-primary-500 bg-primary-500/10 text-white'
                          : 'border-dark-700 bg-dark-800 text-dark-300 hover:border-dark-600'
                      }`}
                    >
                      {industry}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )
      
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-2xl font-bold text-white mb-2">Who are your customers?</h2>
            <p className="text-dark-400 mb-8">Help us understand your target audience and competition.</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-dark-300 mb-2">Target Audience</label>
                <div className="relative">
                  <Users className="absolute left-4 top-4 w-5 h-5 text-dark-500" />
                  <textarea
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    placeholder="Describe your ideal customers (e.g., homeowners aged 35-55 in suburban areas)"
                    className="input-field pl-12 h-24 resize-none"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-dark-300 mb-2">Your Unique Selling Points</label>
                <textarea
                  value={formData.uniqueSellingPoints}
                  onChange={(e) => setFormData({ ...formData, uniqueSellingPoints: e.target.value })}
                  placeholder="What makes you different? (separate with commas)"
                  className="input-field h-24 resize-none"
                />
              </div>
              
              <div>
                <label className="block text-dark-300 mb-2">Main Competitors (optional)</label>
                <textarea
                  value={formData.competitors}
                  onChange={(e) => setFormData({ ...formData, competitors: e.target.value })}
                  placeholder="List competitor websites (separate with commas)"
                  className="input-field h-20 resize-none"
                />
              </div>
            </div>
          </motion.div>
        )
      
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-2xl font-bold text-white mb-2">Set your conversion goals</h2>
            <p className="text-dark-400 mb-8">What action do you want customers to take?</p>
            
            <div className="space-y-6">
              <div className="grid gap-4">
                {conversionGoals.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => setFormData({ ...formData, conversionGoal: goal.id })}
                    className={`p-5 rounded-xl border text-left transition flex items-start gap-4 ${
                      formData.conversionGoal === goal.id
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-dark-700 bg-dark-800 hover:border-dark-600'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      formData.conversionGoal === goal.id
                        ? 'border-primary-500 bg-primary-500'
                        : 'border-dark-600'
                    }`}>
                      {formData.conversionGoal === goal.id && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{goal.label}</div>
                      <div className="text-dark-400 text-sm">{goal.description}</div>
                    </div>
                  </button>
                ))}
              </div>
              
              <div>
                <label className="block text-dark-300 mb-2">Monthly Ad Budget</label>
                <div className="grid grid-cols-2 gap-3">
                  {budgetRanges.map((range) => (
                    <button
                      key={range}
                      onClick={() => setFormData({ ...formData, monthlyBudget: range })}
                      className={`p-4 rounded-lg border text-center transition ${
                        formData.monthlyBudget === range
                          ? 'border-primary-500 bg-primary-500/10 text-white'
                          : 'border-dark-700 bg-dark-800 text-dark-300 hover:border-dark-600'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )
      
      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-2xl font-bold text-white mb-2">Target locations</h2>
            <p className="text-dark-400 mb-8">Where should your ads appear?</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-dark-300 mb-2">Add Locations</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-500" />
                  <input
                    type="text"
                    placeholder="Enter city, state, or country and press Enter"
                    className="input-field pl-12"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addLocation((e.target as HTMLInputElement).value)
                        ;(e.target as HTMLInputElement).value = ''
                      }
                    }}
                  />
                </div>
              </div>
              
              <div>
                <p className="text-dark-400 text-sm mb-3">Quick add:</p>
                <div className="flex flex-wrap gap-2">
                  {['United States', 'Canada', 'United Kingdom', 'Australia', 'California', 'Texas', 'New York'].map((loc) => (
                    <button
                      key={loc}
                      onClick={() => addLocation(loc)}
                      disabled={formData.targetLocations.includes(loc)}
                      className={`px-3 py-1.5 rounded-full text-sm transition ${
                        formData.targetLocations.includes(loc)
                          ? 'bg-primary-500/20 text-primary-400 cursor-not-allowed'
                          : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
                      }`}
                    >
                      + {loc}
                    </button>
                  ))}
                </div>
              </div>
              
              {formData.targetLocations.length > 0 && (
                <div>
                  <p className="text-dark-300 mb-3">Selected locations:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.targetLocations.map((loc) => (
                      <span
                        key={loc}
                        className="px-3 py-1.5 rounded-full bg-primary-500/20 text-primary-400 flex items-center gap-2"
                      >
                        {loc}
                        <button
                          onClick={() => removeLocation(loc)}
                          className="hover:text-white"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )
      
      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-2xl font-bold text-white mb-2">Create your account</h2>
            <p className="text-dark-400 mb-8">Almost there! Set up your login credentials.</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-dark-300 mb-2">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@company.com"
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-dark-300 mb-2">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Create a secure password"
                  className="input-field"
                />
              </div>
              
              <div className="p-4 rounded-xl bg-dark-800 border border-dark-700">
                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent-400" />
                  What happens next?
                </h4>
                <ul className="space-y-2 text-dark-400 text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-success-400 mt-0.5" />
                    AI analyzes your website and competitors
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-success-400 mt-0.5" />
                    Generate optimized ad copy and keywords
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-success-400 mt-0.5" />
                    Set up your campaigns for maximum conversions
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        )
    }
  }

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-dark-700" />
            <div className="absolute inset-0 rounded-full border-4 border-t-primary-500 border-r-accent-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-primary-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">AI is analyzing your business...</h2>
          <p className="text-dark-400 max-w-md">
            We're studying your website, understanding your products, and identifying opportunities to dominate your competition.
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 animated-bg opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />

      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">AdsDominator</span>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between text-sm text-dark-400 mb-2">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round((step / totalSteps) * 100)}% complete</span>
          </div>
          <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              className="h-full bg-gradient-to-r from-primary-500 to-accent-500"
            />
          </div>
        </div>

        <div className="p-8 rounded-2xl glass">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>

          <div className="flex justify-between mt-8 pt-6 border-t border-dark-700">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                step === 1
                  ? 'text-dark-600 cursor-not-allowed'
                  : 'text-dark-300 hover:text-white hover:bg-dark-800'
              }`}
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={handleNext}
              className="btn-primary flex items-center gap-2"
            >
              {step === totalSteps ? 'Launch Dashboard' : 'Continue'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
