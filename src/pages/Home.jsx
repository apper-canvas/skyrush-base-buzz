import { useState, useEffect } from 'react'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'
import { motion } from 'framer-motion'

const Home = () => {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen animated-bg">
      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="border-b border-surface-700/50 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <ApperIcon name="Plane" className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white glow-text">
                SkyRush
              </h1>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-surface-300 text-sm">
                <ApperIcon name="Clock" className="w-4 h-4" />
                <span>{currentTime.toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center space-x-2 bg-surface-800 rounded-lg px-3 py-2">
                <ApperIcon name="Users" className="w-4 h-4 text-primary" />
                <span className="text-white text-sm font-medium">1,247</span>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Game Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <MainFeature />
      </main>

      {/* Footer */}
      <motion.footer 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="border-t border-surface-700/50 mt-8 sm:mt-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4 text-surface-400 text-sm">
              <span>© 2024 SkyRush</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Provably Fair Gaming</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-success text-sm">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span>Server Online</span>
              </div>
              <div className="flex items-center space-x-2 text-surface-400 text-sm">
                <ApperIcon name="Shield" className="w-4 h-4" />
                <span>Secure</span>
              </div>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}

export default Home