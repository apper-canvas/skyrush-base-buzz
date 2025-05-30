import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <motion.div 
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="mx-auto w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-accent to-red-600 rounded-2xl flex items-center justify-center mb-8"
        >
          <ApperIcon name="PlaneCrash" className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
        </motion.div>
        
        <h1 className="text-6xl sm:text-8xl font-bold text-white mb-4 glow-text">404</h1>
        <h2 className="text-xl sm:text-2xl font-semibold text-surface-300 mb-4">Flight Not Found</h2>
        <p className="text-surface-400 mb-8 max-w-md">
          Looks like this plane crashed before reaching its destination. 
          Let's get you back to the game!
        </p>
        
        <Link 
          to="/" 
          className="inline-flex items-center space-x-2 bet-button"
        >
          <ApperIcon name="Home" className="w-5 h-5" />
          <span>Return to Game</span>
        </Link>
      </motion.div>
    </div>
  )
}

export default NotFound