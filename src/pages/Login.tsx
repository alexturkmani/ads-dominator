import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Mail, Lock, Eye, EyeOff, ArrowRight, X, CheckCircle } from 'lucide-react'
import { useStore } from '../store/useStore'

export default function Login() {
  const navigate = useNavigate()
  const { setUser } = useStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Password reset state
  const [showResetModal, setShowResetModal] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetLoading, setResetLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [resetError, setResetError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    setTimeout(() => {
      if (email && password) {
        setUser({
          id: '1',
          email,
          name: 'Demo User',
          company: 'Demo Company',
          plan: 'pro',
          createdAt: new Date().toISOString(),
        })
        navigate('/dashboard')
      } else {
        setError('Please enter your email and password')
      }
      setIsLoading(false)
    }, 1000)
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setResetError('')
    
    if (!resetEmail) {
      setResetError('Please enter your email address')
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(resetEmail)) {
      setResetError('Please enter a valid email address')
      return
    }

    setResetLoading(true)

    // Simulate API call - In production, this would call your backend
    setTimeout(() => {
      setResetLoading(false)
      setResetSent(true)
    }, 1500)
  }

  const closeResetModal = () => {
    setShowResetModal(false)
    setResetEmail('')
    setResetSent(false)
    setResetError('')
  }

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 animated-bg opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-accent-500/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">AdsDominator</span>
          </Link>
        </div>

        <div className="p-4 sm:p-8 rounded-2xl glass">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-dark-400 mb-6 sm:mb-8 text-sm sm:text-base">Log in to access your dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                {error}
              </div>
            )}

            <div>
              <label className="block text-dark-300 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-500 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="input-field pl-12"
                />
              </div>
            </div>

            <div>
              <label className="block text-dark-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-500 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-dark-500 hover:text-dark-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-dark-400 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-dark-600 bg-dark-800" />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => {
                  setShowResetModal(true)
                  setResetEmail(email) // Pre-fill with login email if entered
                }}
                className="text-primary-400 hover:text-primary-300"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Log In <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-dark-700 text-center">
            <p className="text-dark-400">
              Don't have an account?{' '}
              <Link to="/onboarding" className="text-primary-400 hover:text-primary-300 font-medium">
                Get Started
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-xl glass text-center">
          <p className="text-dark-400 text-sm mb-2">Want to explore the dashboard?</p>
          <button
            onClick={() => {
              setUser({
                id: 'demo',
                email: 'demo@adsdominator.com',
                name: 'Demo User',
                company: 'Demo Company',
                plan: 'pro',
                createdAt: new Date().toISOString(),
              })
              navigate('/dashboard')
            }}
            className="text-primary-400 hover:text-primary-300 font-medium"
          >
                      Enter Demo Mode →
          </button>
        </div>
      </motion.div>

      {/* Password Reset Modal */}
      <AnimatePresence>
        {showResetModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closeResetModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md p-6 rounded-2xl glass"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Reset Password</h2>
                <button
                  onClick={closeResetModal}
                  className="p-2 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {resetSent ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-success-500/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-success-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Check your email</h3>
                  <p className="text-dark-400 mb-6">
                    We've sent a password reset link to <span className="text-white">{resetEmail}</span>
                  </p>
                  <p className="text-dark-500 text-sm mb-6">
                    Didn't receive the email? Check your spam folder or try again.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setResetSent(false)}
                      className="flex-1 btn-secondary"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={closeResetModal}
                      className="flex-1 btn-primary"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <p className="text-dark-400 text-sm">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>

                  {resetError && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                      {resetError}
                    </div>
                  )}

                  <div>
                    <label className="block text-dark-300 mb-2 text-sm">Email address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-500 pointer-events-none" />
                      <input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="input-field pl-12"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeResetModal}
                      className="flex-1 btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={resetLoading}
                      className="flex-1 btn-primary flex items-center justify-center gap-2"
                    >
                      {resetLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        'Send Reset Link'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
