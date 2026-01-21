import { ReactNode, useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap, LayoutDashboard, Target, Search, BarChart3, 
  Beaker, Settings, ChevronLeft, ChevronRight,
  Bell, User, HelpCircle, Sparkles, Menu, X
} from 'lucide-react'
import { useStore } from '../store/useStore'

interface DashboardLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Target, label: 'Campaigns', path: '/campaigns' },
  { icon: Search, label: 'Keywords', path: '/keywords' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Beaker, label: 'A/B Testing', path: '/ab-testing' },
  { icon: Settings, label: 'Settings', path: '/settings' },
]

export default function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const location = useLocation()
  const { sidebarOpen, toggleSidebar, user, recommendations, autoOptimize } = useStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(true)
  
  const pendingRecommendations = recommendations.filter(r => r.status === 'pending').length

  // Handle responsive detection
  useEffect(() => {
    const checkIsDesktop = () => setIsDesktop(window.innerWidth >= 1024)
    checkIsDesktop()
    window.addEventListener('resize', checkIsDesktop)
    return () => window.removeEventListener('resize', checkIsDesktop)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-dark-950 flex">
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Hidden on mobile unless menu open */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-dark-900 border-r border-dark-800 z-50 flex flex-col transition-all duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
        style={{ width: sidebarOpen ? 256 : 80 }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-dark-800">
          <Link to="/dashboard" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 text-white" />
            </div>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-lg font-bold text-white"
              >
                AdsDominator
              </motion.span>
            )}
          </Link>
          {/* Mobile close button */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`sidebar-item ${isActive ? 'active' : ''}`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {sidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* AI Status */}
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 mx-1 p-4 rounded-xl bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-primary-500/20"
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-accent-400" />
                <span className="font-medium text-white">AI Optimization</span>
              </div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-dark-400">Status</span>
                <span className={autoOptimize ? 'text-success-400' : 'text-dark-400'}>
                  {autoOptimize ? 'Active' : 'Paused'}
                </span>
              </div>
              {pendingRecommendations > 0 && (
                <div className="text-sm text-accent-400">
                  {pendingRecommendations} new recommendations
                </div>
              )}
            </motion.div>
          )}
        </nav>

        {/* Toggle Button - Desktop only */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-dark-800 border border-dark-700 items-center justify-center text-dark-400 hover:text-white transition"
        >
          {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {/* User Section */}
        <div className="p-4 border-t border-dark-800">
          <Link
            to="/settings"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-dark-800 transition"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold flex-shrink-0">
              {user?.name?.charAt(0) || 'U'}
            </div>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 min-w-0"
              >
                <div className="font-medium text-white truncate">{user?.name || 'User'}</div>
                <div className="text-sm text-dark-400 truncate">{user?.email}</div>
              </motion.div>
            )}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 w-full ${isDesktop ? '' : ''}`}
        style={{ marginLeft: isDesktop ? (sidebarOpen ? 256 : 80) : 0 }}
      >
        {/* Top Header */}
        <header className="h-16 bg-dark-900/50 backdrop-blur-lg border-b border-dark-800 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger menu */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white">{title}</h1>
              {subtitle && <p className="text-xs sm:text-sm text-dark-400 hidden sm:block">{subtitle}</p>}
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search */}
            <div className="relative hidden lg:block">
              <input
                type="text"
                placeholder="Search..."
                className="w-64 px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500"
              />
            </div>

            {/* Help */}
            <button className="p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800 transition">
              <HelpCircle className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <button className="p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800 transition relative">
              <Bell className="w-5 h-5" />
              {pendingRecommendations > 0 && (
                <span className="notification-dot" />
              )}
            </button>

            {/* User Menu */}
            <button className="p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800 transition">
              <User className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 sm:p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
