import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Zap, Globe, Building2, Users, MapPin, 
  ArrowRight, ArrowLeft, Check, Sparkles,
  Search, X, Target, Ban
} from 'lucide-react'
import { useStore } from '../store/useStore'
import { businessCategories, searchBusinessTypes, type BusinessType } from '../data/businessTypes'
import { searchLocations, radiusOptions, type Location } from '../data/locations'
import type { LocationTarget } from '../types'

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
  
  // Business type search
  const [businessSearch, setBusinessSearch] = useState('')
  const [selectedBusinessType, setSelectedBusinessType] = useState<BusinessType | null>(null)
  const [showBusinessDropdown, setShowBusinessDropdown] = useState(false)
  
  // Location search
  const [locationSearch, setLocationSearch] = useState('')
  const [showLocationDropdown, setShowLocationDropdown] = useState(false)
  const [locationTargets, setLocationTargets] = useState<LocationTarget[]>([])
  const [selectedLocationForRadius, setSelectedLocationForRadius] = useState<Location | null>(null)
  const [showRadiusModal, setShowRadiusModal] = useState(false)
  const [selectedRadius, setSelectedRadius] = useState(25)
  const [excludeOutsideRadius, setExcludeOutsideRadius] = useState(true)
  
  const [formData, setFormData] = useState({
    websiteUrl: '',
    companyName: '',
    industry: '',
    businessType: '',
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

  // Search results for business types
  const businessSearchResults = useMemo(() => {
    if (!businessSearch.trim()) return [];
    return searchBusinessTypes(businessSearch).slice(0, 10);
  }, [businessSearch]);

  // Search results for locations
  const locationSearchResults = useMemo(() => {
    if (!locationSearch.trim()) return [];
    return searchLocations(locationSearch);
  }, [locationSearch]);

  const handleSelectBusinessType = (type: BusinessType) => {
    setSelectedBusinessType(type);
    setFormData({
      ...formData,
      businessType: type.id,
      industry: type.category,
    });
    setBusinessSearch(type.name);
    setShowBusinessDropdown(false);
  };

  const handleSelectLocation = (location: Location) => {
    if (location.type === 'city' && location.coordinates) {
      // For cities, show radius modal
      setSelectedLocationForRadius(location);
      setShowRadiusModal(true);
    } else {
      // For states/countries, add directly
      addLocationTarget(location, 'include');
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
    
    setLocationTargets(prev => [...prev, newTarget]);
    
    // Also add to legacy format
    if (!formData.targetLocations.includes(location.name)) {
      setFormData(prev => ({
        ...prev,
        targetLocations: [...prev.targetLocations, location.name],
      }));
    }
  };

  const removeLocationTarget = (id: string) => {
    const target = locationTargets.find(t => t.id === id);
    setLocationTargets(prev => prev.filter(t => t.id !== id));
    
    if (target) {
      setFormData(prev => ({
        ...prev,
        targetLocations: prev.targetLocations.filter(l => l !== target.name),
      }));
    }
  };

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
      businessType: formData.businessType,
      targetAudience: formData.targetAudience,
      uniqueSellingPoints: formData.uniqueSellingPoints.split(',').map(s => s.trim()),
      competitors: formData.competitors.split(',').map(s => s.trim()),
      conversionGoal: formData.conversionGoal as 'leads' | 'sales' | 'signups' | 'calls',
      targetLocations: formData.targetLocations,
      locationTargets: locationTargets,
      excludeOutsideRadius: excludeOutsideRadius,
    })
    
    navigate('/dashboard')
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
            <p className="text-dark-400 mb-8">Enter your website URL and tell us about your business.</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-dark-300 mb-2">Website URL</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-500 pointer-events-none" />
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
                  <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-500 pointer-events-none" />
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
                <label className="block text-dark-300 mb-2">Business Type</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-500 pointer-events-none" />
                  <input
                    type="text"
                    value={businessSearch}
                    onChange={(e) => {
                      setBusinessSearch(e.target.value);
                      setShowBusinessDropdown(true);
                    }}
                    onFocus={() => setShowBusinessDropdown(true)}
                    placeholder="Search for your business type (e.g., Pest Control, Plumber, Dentist)"
                    className="input-field pl-12"
                  />
                  {businessSearch && (
                    <button
                      onClick={() => {
                        setBusinessSearch('');
                        setSelectedBusinessType(null);
                        setFormData({ ...formData, businessType: '', industry: '' });
                      }}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-dark-500 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  
                  {/* Search Results Dropdown */}
                  {showBusinessDropdown && businessSearch && businessSearchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-dark-800 border border-dark-600 rounded-lg shadow-xl z-20 max-h-64 overflow-y-auto">
                      {businessSearchResults.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => handleSelectBusinessType(type)}
                          className="w-full px-4 py-3 text-left hover:bg-dark-700 flex items-center justify-between border-b border-dark-700 last:border-0"
                        >
                          <div>
                            <span className="text-white">{type.name}</span>
                            <span className="text-dark-400 text-sm ml-2">• {type.category}</span>
                          </div>
                          {selectedBusinessType?.id === type.id && (
                            <Check className="w-4 h-4 text-primary-400" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {selectedBusinessType && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-full bg-primary-500/20 text-primary-400 text-sm flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      {selectedBusinessType.name}
                    </span>
                    <span className="text-dark-400 text-sm">in {selectedBusinessType.category}</span>
                  </div>
                )}
              </div>
              
              {/* Popular Business Types */}
              {!selectedBusinessType && (
                <div>
                  <p className="text-dark-400 text-sm mb-3">Popular business types:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Pest Control', 'Plumbing', 'HVAC', 'Roofing', 'Dentist', 'Real Estate Agent', 'Personal Injury Lawyer', 'Auto Repair'].map((name) => {
                      const type = searchBusinessTypes(name)[0];
                      return type ? (
                        <button
                          key={name}
                          onClick={() => handleSelectBusinessType(type)}
                          className="px-3 py-1.5 rounded-full text-sm bg-dark-800 text-dark-300 hover:bg-dark-700 hover:text-white transition"
                        >
                          {name}
                        </button>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
              
              {/* Browse by Category */}
              {!selectedBusinessType && !businessSearch && (
                <div>
                  <p className="text-dark-400 text-sm mb-3">Or browse by category:</p>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {businessCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setBusinessSearch(category.name)}
                        className="p-3 rounded-lg border border-dark-700 bg-dark-800 text-left hover:border-dark-600 hover:bg-dark-700 transition"
                      >
                        <span className="text-lg mr-2">{category.icon}</span>
                        <span className="text-dark-300 text-sm">{category.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
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
            <p className="text-dark-400 mb-8">Define where your ads should appear. Use radius targeting to focus on specific areas.</p>
            
            <div className="space-y-6">
              {/* Location Search */}
              <div>
                <label className="block text-dark-300 mb-2">Search for a location</label>
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
                  
                  {/* Location Search Results */}
                  {showLocationDropdown && locationSearch && locationSearchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-dark-800 border border-dark-600 rounded-lg shadow-xl z-20 max-h-64 overflow-y-auto">
                      {locationSearchResults.map((loc) => (
                        <button
                          key={loc.id}
                          onClick={() => handleSelectLocation(loc)}
                          className="w-full px-4 py-3 text-left hover:bg-dark-700 flex items-center justify-between border-b border-dark-700 last:border-0"
                        >
                          <div className="flex items-center gap-3">
                            <MapPin className="w-4 h-4 text-dark-400" />
                            <div>
                              <span className="text-white">{loc.name}</span>
                              <span className="text-dark-400 text-sm ml-2">
                                • {loc.type === 'city' ? 'City' : loc.type === 'state' ? 'State' : 'Country'}
                              </span>
                            </div>
                          </div>
                          {loc.type === 'city' && loc.coordinates && (
                            <span className="text-xs text-primary-400 flex items-center gap-1">
                              <Target className="w-3 h-3" /> Add with radius
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Quick Add Popular Locations */}
              <div>
                <p className="text-dark-400 text-sm mb-3">Quick add:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: 'United States', type: 'country' },
                    { name: 'California', type: 'state' },
                    { name: 'Texas', type: 'state' },
                    { name: 'Florida', type: 'state' },
                    { name: 'New York', type: 'state' },
                  ].map((loc) => {
                    const isAdded = locationTargets.some(t => t.name === loc.name);
                    return (
                      <button
                        key={loc.name}
                        onClick={() => {
                          if (!isAdded) {
                            addLocationTarget(
                              { id: loc.name.toLowerCase().replace(/\s/g, '-'), name: loc.name, type: loc.type as 'country' | 'state', country: 'United States' },
                              'include'
                            );
                          }
                        }}
                        disabled={isAdded}
                        className={`px-3 py-1.5 rounded-full text-sm transition ${
                          isAdded
                            ? 'bg-primary-500/20 text-primary-400 cursor-not-allowed'
                            : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
                        }`}
                      >
                        + {loc.name}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Selected Locations */}
              {locationTargets.length > 0 && (
                <div>
                  <p className="text-dark-300 mb-3">Your target locations:</p>
                  <div className="space-y-2">
                    {locationTargets.filter(t => t.targetType === 'include').map((target) => (
                      <div
                        key={target.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-dark-800 border border-dark-700"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-success-500/20 flex items-center justify-center">
                            <Target className="w-4 h-4 text-success-400" />
                          </div>
                          <div>
                            <span className="text-white">{target.name}</span>
                            {target.radius && (
                              <span className="text-primary-400 text-sm ml-2">
                                {target.radius.value} {target.radius.unit} radius
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => removeLocationTarget(target.id)}
                          className="p-1 rounded hover:bg-dark-600 text-dark-400 hover:text-red-400"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    
                    {/* Excluded Locations */}
                    {locationTargets.filter(t => t.targetType === 'exclude').map((target) => (
                      <div
                        key={target.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/20"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                            <Ban className="w-4 h-4 text-red-400" />
                          </div>
                          <div>
                            <span className="text-white">{target.name}</span>
                            <span className="text-red-400 text-sm ml-2">Excluded</span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeLocationTarget(target.id)}
                          className="p-1 rounded hover:bg-dark-600 text-dark-400 hover:text-red-400"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Exclude Outside Radius Toggle */}
              {locationTargets.some(t => t.radius) && (
                <div className="p-4 rounded-lg bg-dark-800 border border-dark-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Exclude all areas outside radius</p>
                      <p className="text-dark-400 text-sm">Only show ads within your defined radius areas</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={excludeOutsideRadius}
                        onChange={(e) => setExcludeOutsideRadius(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-dark-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                    </label>
                  </div>
                </div>
              )}
            </div>
            
            {/* Radius Modal */}
            <AnimatePresence>
              {showRadiusModal && selectedLocationForRadius && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
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
