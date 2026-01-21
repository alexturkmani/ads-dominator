import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Zap, Target, TrendingUp, BarChart3, Brain, DollarSign, 
  ChevronRight, Check, ArrowRight, Sparkles,
  LineChart, Rocket, Play, Star
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'AI-Powered A/B Testing',
    description: 'Automatically create and test multiple ad variations. Winners get more budget, losers are replaced automatically.',
  },
  {
    icon: Target,
    title: 'Smart Keyword Discovery',
    description: 'Find high-intent keywords your competitors miss. Our AI identifies underpriced opportunities with the best conversion potential.',
  },
  {
    icon: DollarSign,
    title: 'Intelligent Budget Allocation',
    description: 'AI monitors performance 24/7 and reallocates budget in real-time to maximize conversions at the lowest cost.',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    description: 'See everything: which ads work, what each lead costs, and exactly how your budget is spent. Updated in real-time.',
  },
]

const steps = [
  {
    number: '01',
    title: 'Connect Your Google Ads',
    description: 'Link your Google Ads account securely. We analyze your business, products, and competitors instantly.',
  },
  {
    number: '02',
    title: 'AI Generates Your Strategy',
    description: 'Our AI creates optimized ad copy and identifies high-potential keywords based on your business profile.',
  },
  {
    number: '03',
    title: 'Set Your Targets',
    description: 'Define your target locations, conversion goals, and budget. The AI adapts to your specific requirements.',
  },
  {
    number: '04',
    title: 'Launch & Dominate',
    description: 'Your campaigns go live with 24/7 AI optimization. Watch your conversions increase while CPA decreases.',
  },
]

const stats = [
  { value: '47%', label: 'Average CPA Reduction' },
  { value: '3.2x', label: 'Average ROAS Improvement' },
  { value: '24/7', label: 'AI Optimization' },
  { value: '500+', label: 'Businesses Trust Us' },
]

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Marketing Director',
    company: 'TechStart Inc.',
    content: 'We reduced our CPA by 52% in the first month. The AI found keywords we never would have thought of.',
    avatar: 'SJ',
  },
  {
    name: 'Michael Chen',
    role: 'Founder',
    company: 'GrowthLabs',
    content: 'Finally, agency-level results without the agency price tag. Our ROAS went from 2.1x to 5.4x.',
    avatar: 'MC',
  },
  {
    name: 'Emily Rodriguez',
    role: 'E-commerce Manager',
    company: 'StyleHub',
    content: 'The A/B testing alone is worth it. We\'re constantly improving without lifting a finger.',
    avatar: 'ER',
  },
]

const faqs = [
  {
    question: 'Do I need Google Ads experience?',
    answer: 'Not at all! Our AI handles everything from keyword research to bid optimization. You just set your goals and budget.',
  },
  {
    question: 'How quickly will I see results?',
    answer: 'Most users see improvements within the first week. Significant CPA reductions typically happen within 2-4 weeks as the AI learns.',
  },
  {
    question: 'Can I still control my campaigns?',
    answer: 'Absolutely. You have full visibility and control. Override any AI decision, pause campaigns, or adjust targets anytime.',
  },
  {
    question: 'What budget do I need?',
    answer: 'We work with budgets from $1,000/month up to $100,000+. The AI optimizes effectively at any scale.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">AdsDominator</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-dark-300 hover:text-white transition">Features</a>
              <a href="#how-it-works" className="text-dark-300 hover:text-white transition">How It Works</a>
              <a href="#pricing" className="text-dark-300 hover:text-white transition">Pricing</a>
              <a href="#faq" className="text-dark-300 hover:text-white transition">FAQ</a>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-dark-300 hover:text-white transition">Log In</Link>
              <Link to="/onboarding" className="btn-primary">
                Get Started <ArrowRight className="w-4 h-4 inline ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 animated-bg opacity-50" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
              <Sparkles className="w-4 h-4 text-accent-400" />
              <span className="text-sm text-dark-200">AI-Powered Google Ads Optimization</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-white">Dominate Your Competition</span>
              <br />
              <span className="gradient-text">With AI-Optimized Ads</span>
            </h1>
            
            <p className="text-xl text-dark-300 max-w-3xl mx-auto mb-10">
              Get more conversions at lower costs. Our AI optimizes your Google Ads 24/7,
              finding opportunities humans miss and maximizing every dollar you spend.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link to="/onboarding" className="btn-primary text-lg px-8 py-4">
                Start Optimizing Now <Rocket className="w-5 h-5 inline ml-2" />
              </Link>
              <button className="btn-secondary text-lg px-8 py-4 flex items-center gap-2">
                <Play className="w-5 h-5" /> Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                  <div className="text-dark-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-20"
          >
            <div className="relative rounded-2xl overflow-hidden glass p-2 glow">
              <div className="bg-dark-900 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Total Spend', value: '$12,456', change: '+12%', up: true },
                    { label: 'Conversions', value: '342', change: '+23%', up: true },
                    { label: 'Avg. CPA', value: '$36.43', change: '-8.7%', up: false },
                    { label: 'ROAS', value: '4.8x', change: '+15%', up: true },
                  ].map((metric, i) => (
                    <div key={i} className="p-4 rounded-lg bg-dark-800">
                      <div className="text-dark-400 text-sm mb-1">{metric.label}</div>
                      <div className="text-2xl font-bold text-white">{metric.value}</div>
                      <div className={metric.up ? 'text-success-400' : 'text-red-400'}>
                        {metric.change}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="h-48 bg-dark-800 rounded-lg flex items-center justify-center">
                  <LineChart className="w-full h-full text-primary-500/20 p-8" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              What AdsDominator Does Automatically
            </h2>
            <p className="text-xl text-dark-400 max-w-2xl mx-auto">
              AI-powered optimization that runs 24/7, so you don't have to become a Google Ads expert.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-2xl glass card-hover"
              >
                <div className="feature-icon mb-6">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-dark-300 text-lg">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-500/5 to-transparent" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Get Started in Minutes
            </h2>
            <p className="text-xl text-dark-400 max-w-2xl mx-auto">
              Launch optimized campaigns with automated creative and keyword targeting in just a few steps.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="p-6 rounded-2xl glass h-full">
                  <div className="text-5xl font-bold gradient-text mb-4">{step.number}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-dark-400">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className="hidden lg:block absolute top-1/2 -right-4 w-8 h-8 text-dark-600 transform -translate-y-1/2" />
                )}
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/onboarding" className="btn-primary text-lg px-8 py-4">
              Start Your Free Trial <ArrowRight className="w-5 h-5 inline ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Trusted by Growing Businesses
            </h2>
            <p className="text-xl text-dark-400">See what our customers have to say</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-2xl glass"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-dark-200 text-lg mb-6">"{testimonial.content}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-dark-400 text-sm">{testimonial.role}, {testimonial.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-500/5 to-transparent" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-dark-400">One plan, unlimited potential</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 md:p-12 rounded-3xl glass glow-accent"
          >
            <div className="text-center mb-8">
              <div className="text-6xl font-bold text-white mb-2">
                $299<span className="text-2xl text-dark-400">/month</span>
              </div>
              <div className="text-dark-400 text-lg">+ 10% of ad spend from the 2nd month</div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {[
                'Unlimited campaigns',
                '24/7 AI optimization',
                'Automatic A/B testing',
                'Smart keyword discovery',
                'Real-time analytics',
                'Budget reallocation',
                'Competitor analysis',
                'Dedicated support',
                'No long-term contracts',
                'Setup in under 24 hours',
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-success-400" />
                  <span className="text-dark-200">{feature}</span>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link to="/onboarding" className="btn-primary text-lg px-12 py-4 inline-block">
                Start 14-Day Free Trial
              </Link>
              <p className="text-dark-500 mt-4">No credit card required</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-xl glass"
              >
                <h3 className="text-lg font-semibold text-white mb-2">{faq.question}</h3>
                <p className="text-dark-400">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-12 rounded-3xl bg-gradient-to-r from-primary-600 to-accent-600 text-center"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Dominate Your Competition?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Join 500+ businesses getting better results with AI-powered optimization.
            </p>
            <Link to="/onboarding" className="inline-block px-8 py-4 bg-white text-dark-900 font-semibold rounded-lg hover:bg-dark-100 transition">
              Get Started Free <ArrowRight className="w-5 h-5 inline ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-dark-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">AdsDominator</span>
            </div>
            <div className="flex items-center gap-8 text-dark-400">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" className="hover:text-white transition">Terms of Service</a>
              <a href="#" className="hover:text-white transition">Contact</a>
            </div>
            <div className="text-dark-500">
              © 2024 AdsDominator. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
