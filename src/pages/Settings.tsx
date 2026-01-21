import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  User, Building2, CreditCard, Bell, Lock, Link2,
  Save, Trash2, Check, ExternalLink, Search, X
} from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { useStore } from '../store/useStore'
import { businessCategories, searchBusinessTypes } from '../data/businessTypes'

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'company', label: 'Company', icon: Building2 },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'integrations', label: 'Integrations', icon: Link2 },
  { id: 'security', label: 'Security', icon: Lock },
]

export default function Settings() {
  const { user, businessProfile } = useStore()
  const [activeTab, setActiveTab] = useState('profile')
  const [saved, setSaved] = useState(false)
  const [industrySearch, setIndustrySearch] = useState('')
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false)
  
  const [profile, setProfile] = useState({
    name: user?.name || 'Demo User',
    email: user?.email || 'demo@adsdominator.com',
    phone: '+1 (555) 123-4567',
    timezone: 'America/Los_Angeles',
  })

  const [company, setCompany] = useState({
    name: user?.company || 'Demo Company',
    website: businessProfile?.websiteUrl || 'https://example.com',
    industry: businessProfile?.industry || 'Local Services',
    businessType: businessProfile?.businessType || '',
    size: '1-10 employees',
  })

  const industrySearchResults = useMemo(() => {
    if (!industrySearch.trim()) return [];
    return searchBusinessTypes(industrySearch).slice(0, 8);
  }, [industrySearch]);

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    budgetAlerts: true,
    performanceReports: true,
    aiRecommendations: true,
    weeklyDigest: true,
    newFeatures: false,
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-dark-300 mb-2">Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-dark-300 mb-2">Email Address</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-dark-300 mb-2">Phone Number</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-dark-300 mb-2">Timezone</label>
              <select
                value={profile.timezone}
                onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                className="input-field"
              >
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="Europe/Paris">Paris (CET)</option>
              </select>
            </div>
          </div>
        )
      
      case 'company':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-dark-300 mb-2">Company Name</label>
              <input
                type="text"
                value={company.name}
                onChange={(e) => setCompany({ ...company, name: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-dark-300 mb-2">Website</label>
              <input
                type="url"
                value={company.website}
                onChange={(e) => setCompany({ ...company, website: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-dark-300 mb-2">Industry / Business Type</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-500 pointer-events-none" />
                <input
                  type="text"
                  value={industrySearch || company.industry}
                  onChange={(e) => {
                    setIndustrySearch(e.target.value);
                    setShowIndustryDropdown(true);
                  }}
                  onFocus={() => setShowIndustryDropdown(true)}
                  placeholder="Search for your business type..."
                  className="input-field pl-12"
                />
                {(industrySearch || company.industry) && (
                  <button
                    onClick={() => {
                      setIndustrySearch('');
                      setCompany({ ...company, industry: '', businessType: '' });
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-dark-500 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                
                {showIndustryDropdown && industrySearch && industrySearchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-dark-800 border border-dark-600 rounded-lg shadow-xl z-20 max-h-64 overflow-y-auto">
                    {industrySearchResults.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => {
                          setCompany({ ...company, industry: type.category, businessType: type.id });
                          setIndustrySearch(type.name);
                          setShowIndustryDropdown(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-dark-700 flex items-center justify-between border-b border-dark-700 last:border-0"
                      >
                        <div>
                          <span className="text-white">{type.name}</span>
                          <span className="text-dark-400 text-sm ml-2">• {type.category}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {!industrySearch && !company.businessType && (
                <div className="mt-3">
                  <p className="text-dark-500 text-sm mb-2">Or select a category:</p>
                  <div className="flex flex-wrap gap-2">
                    {businessCategories.slice(0, 6).map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setCompany({ ...company, industry: cat.name });
                          setIndustrySearch('');
                          setShowIndustryDropdown(false);
                        }}
                        className="px-3 py-1.5 rounded-full text-xs bg-dark-700 text-dark-300 hover:bg-dark-600 hover:text-white transition"
                      >
                        {cat.icon} {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div>
              <label className="block text-dark-300 mb-2">Company Size</label>
              <select
                value={company.size}
                onChange={(e) => setCompany({ ...company, size: e.target.value })}
                className="input-field"
              >
                <option>1-10 employees</option>
                <option>11-50 employees</option>
                <option>51-200 employees</option>
                <option>201-500 employees</option>
                <option>500+ employees</option>
              </select>
            </div>
          </div>
        )
      
      case 'billing':
        return (
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-500/20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">Pro Plan</h3>
                  <p className="text-dark-400">$299/month • Renews on Dec 15, 2024</p>
                </div>
                <span className="badge badge-success">Active</span>
              </div>
              <div className="flex gap-3">
                <button className="btn-secondary text-sm">Change Plan</button>
                <button className="text-dark-400 hover:text-white text-sm">Cancel Subscription</button>
              </div>
            </div>

            <div>
              <h4 className="text-white font-medium mb-4">Payment Method</h4>
              <div className="p-4 rounded-lg bg-dark-800 border border-dark-700 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 rounded bg-dark-600 flex items-center justify-center text-xs font-bold text-white">
                    VISA
                  </div>
                  <div>
                    <div className="text-white">•••• •••• •••• 4242</div>
                    <div className="text-dark-400 text-sm">Expires 12/2025</div>
                  </div>
                </div>
                <button className="text-primary-400 hover:text-primary-300 text-sm">
                  Update
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-white font-medium mb-4">Billing History</h4>
              <div className="space-y-2">
                {[
                  { date: 'Nov 15, 2024', amount: '$299.00', status: 'Paid' },
                  { date: 'Oct 15, 2024', amount: '$299.00', status: 'Paid' },
                  { date: 'Sep 15, 2024', amount: '$299.00', status: 'Paid' },
                ].map((invoice, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-dark-800 border border-dark-700 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-white">{invoice.date}</div>
                      <div className="text-dark-400 text-sm">Pro Plan Monthly</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-white">{invoice.amount}</span>
                      <span className="badge badge-success text-xs">{invoice.status}</span>
                      <button className="text-primary-400 hover:text-primary-300 text-sm">
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      
      case 'notifications':
        return (
          <div className="space-y-4">
            {[
              { key: 'emailAlerts', label: 'Email Alerts', desc: 'Receive important account alerts via email' },
              { key: 'budgetAlerts', label: 'Budget Alerts', desc: 'Get notified when campaigns approach budget limits' },
              { key: 'performanceReports', label: 'Performance Reports', desc: 'Weekly and monthly performance summaries' },
              { key: 'aiRecommendations', label: 'AI Recommendations', desc: 'New optimization recommendations from AI' },
              { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Summary of your account activity' },
              { key: 'newFeatures', label: 'New Features', desc: 'Updates about new platform features' },
            ].map((item) => (
              <div
                key={item.key}
                className="p-4 rounded-lg bg-dark-800 border border-dark-700 flex items-center justify-between"
              >
                <div>
                  <div className="text-white font-medium">{item.label}</div>
                  <div className="text-dark-400 text-sm">{item.desc}</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications[item.key as keyof typeof notifications]}
                    onChange={(e) => setNotifications({ 
                      ...notifications, 
                      [item.key]: e.target.checked 
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-dark-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>
            ))}
          </div>
        )
      
      case 'integrations':
        return (
          <div className="space-y-4">
            {[
              { 
                name: 'Google Ads', 
                desc: 'Connect your Google Ads account', 
                connected: true,
                icon: '🔗'
              },
              { 
                name: 'Google Analytics', 
                desc: 'Import analytics data for deeper insights', 
                connected: true,
                icon: '📊'
              },
              { 
                name: 'Google Tag Manager', 
                desc: 'Track conversions with GTM', 
                connected: false,
                icon: '🏷️'
              },
              { 
                name: 'Slack', 
                desc: 'Get notifications in Slack', 
                connected: false,
                icon: '💬'
              },
              { 
                name: 'Zapier', 
                desc: 'Connect with 5000+ apps', 
                connected: false,
                icon: '⚡'
              },
            ].map((integration) => (
              <div
                key={integration.name}
                className="p-4 rounded-lg bg-dark-800 border border-dark-700 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-dark-700 flex items-center justify-center text-2xl">
                    {integration.icon}
                  </div>
                  <div>
                    <div className="text-white font-medium">{integration.name}</div>
                    <div className="text-dark-400 text-sm">{integration.desc}</div>
                  </div>
                </div>
                {integration.connected ? (
                  <div className="flex items-center gap-3">
                    <span className="badge badge-success">Connected</span>
                    <button className="text-dark-400 hover:text-white text-sm">
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <button className="btn-secondary text-sm flex items-center gap-1">
                    Connect <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )
      
      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-white font-medium mb-4">Change Password</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-dark-300 mb-2">Current Password</label>
                  <input type="password" className="input-field" placeholder="••••••••" />
                </div>
                <div>
                  <label className="block text-dark-300 mb-2">New Password</label>
                  <input type="password" className="input-field" placeholder="••••••••" />
                </div>
                <div>
                  <label className="block text-dark-300 mb-2">Confirm New Password</label>
                  <input type="password" className="input-field" placeholder="••••••••" />
                </div>
                <button className="btn-secondary">Update Password</button>
              </div>
            </div>

            <div className="pt-6 border-t border-dark-700">
              <h4 className="text-white font-medium mb-4">Two-Factor Authentication</h4>
              <div className="p-4 rounded-lg bg-dark-800 border border-dark-700 flex items-center justify-between">
                <div>
                  <div className="text-white">2FA is currently disabled</div>
                  <div className="text-dark-400 text-sm">
                    Add an extra layer of security to your account
                  </div>
                </div>
                <button className="btn-primary text-sm">Enable 2FA</button>
              </div>
            </div>

            <div className="pt-6 border-t border-dark-700">
              <h4 className="text-white font-medium mb-4">Active Sessions</h4>
              <div className="space-y-2">
                {[
                  { device: 'Chrome on Windows', location: 'Los Angeles, CA', current: true },
                  { device: 'Safari on iPhone', location: 'Los Angeles, CA', current: false },
                ].map((session, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-dark-800 border border-dark-700 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-white flex items-center gap-2">
                        {session.device}
                        {session.current && (
                          <span className="text-xs px-2 py-0.5 rounded bg-success-500/20 text-success-400">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="text-dark-400 text-sm">{session.location}</div>
                    </div>
                    {!session.current && (
                      <button className="text-red-400 hover:text-red-300 text-sm">
                        Revoke
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-dark-700">
              <h4 className="text-red-400 font-medium mb-4">Danger Zone</h4>
              <button className="px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition flex items-center gap-2">
                <Trash2 className="w-4 h-4" /> Delete Account
              </button>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <DashboardLayout 
      title="Settings" 
      subtitle="Manage your account and preferences"
    >
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="p-4 rounded-xl glass">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
                    activeTab === tab.id
                      ? 'bg-primary-500/10 text-primary-400'
                      : 'text-dark-400 hover:bg-dark-800 hover:text-white'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-3"
        >
          <div className="p-6 rounded-xl glass">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                {tabs.find(t => t.id === activeTab)?.label}
              </h2>
              {['profile', 'company', 'notifications'].includes(activeTab) && (
                <button
                  onClick={handleSave}
                  className={`btn-primary flex items-center gap-2 ${saved ? 'bg-success-500' : ''}`}
                >
                  {saved ? (
                    <>
                      <Check className="w-4 h-4" /> Saved
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Save Changes
                    </>
                  )}
                </button>
              )}
            </div>
            {renderContent()}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
