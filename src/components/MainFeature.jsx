import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'

const MainFeature = () => {
  // Game state
  const [gameState, setGameState] = useState('waiting') // waiting, flying, crashed
  const [multiplier, setMultiplier] = useState(1.0)
  const [betAmount, setBetAmount] = useState(10)
  const [balance, setBalance] = useState(1000)
  const [currentBet, setCurrentBet] = useState(null)
  const [roundHistory, setRoundHistory] = useState([2.45, 1.23, 5.67, 1.89, 3.21])
  const [activePlayers, setActivePlayers] = useState([
    { id: 1, username: 'Player1', bet: 25, cashOut: null },
    { id: 2, username: 'CryptoKing', bet: 100, cashOut: 2.3 },
    { id: 3, username: 'LuckyAce', bet: 50, cashOut: null },
  ])
  
  // Animation refs
  const planeRef = useRef(null)
  const gameInterval = useRef(null)
  const roundTimer = useRef(null)
  
  // Countdown state
  const [countdown, setCountdown] = useState(0)
  const [roundDuration, setRoundDuration] = useState(0)

  // Start new round
  const startNewRound = () => {
    setGameState('waiting')
    setMultiplier(1.0)
    setCurrentBet(null)
    setCountdown(5)
    setRoundDuration(0)
    
    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          startFlying()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const startFlying = () => {
    setGameState('flying')
    setRoundDuration(0)
    
    // Random crash point between 1.1x and 10x
    const crashPoint = Math.random() * (10 - 1.1) + 1.1
    
    gameInterval.current = setInterval(() => {
      setRoundDuration(prev => {
        const newDuration = prev + 100
        const newMultiplier = 1 + (newDuration / 1000) * 0.5 + Math.random() * 0.1
        
        setMultiplier(newMultiplier)
        
        if (newMultiplier >= crashPoint) {
          crashGame(newMultiplier)
          return newDuration
        }
        
        return newDuration
      })
    }, 100)
  }

  const crashGame = (finalMultiplier) => {
    clearInterval(gameInterval.current)
    setGameState('crashed')
    setMultiplier(finalMultiplier)
    
    // Add to history
    setRoundHistory(prev => [finalMultiplier, ...prev.slice(0, 4)])
    
    // Check if player had active bet
    if (currentBet && !currentBet.cashedOut) {
      setBalance(prev => prev - currentBet.amount)
      toast.error(`Crashed at ${finalMultiplier.toFixed(2)}x! Lost $${currentBet.amount}`)
    }
    
    // Start new round after delay
    setTimeout(() => {
      startNewRound()
    }, 3000)
  }

const placeBet = () => {
    if (gameState !== 'waiting') {
      toast.error('Cannot place bet while game is in progress')
      return
    }
    
    if (betAmount > balance) {
      toast.error('Insufficient balance')
      return
    }
    
    if (betAmount < 1) {
      toast.error('Minimum bet is $1')
      return
    }
    
    if (currentBet && !currentBet.cashedOut) {
      toast.error('You already have an active bet')
      return
    }
    
    setCurrentBet({
      amount: betAmount,
      cashedOut: false,
      multiplier: 1.0
    })
    
    toast.success(`Bet placed: $${betAmount}`)
  }

  const cashOut = () => {
    if (!currentBet || currentBet.cashedOut || gameState !== 'flying') {
      toast.error('Cannot cash out right now')
      return
    }
    
    const payout = Math.floor(currentBet.amount * multiplier)
    setBalance(prev => prev - currentBet.amount + payout)
    setCurrentBet(prev => ({ ...prev, cashedOut: true, multiplier: multiplier }))
    
    toast.success(`Cashed out at ${multiplier.toFixed(2)}x! Won $${payout}`)
  }

  // Initialize game
  useEffect(() => {
    startNewRound()
    
    return () => {
      if (gameInterval.current) clearInterval(gameInterval.current)
      if (roundTimer.current) clearInterval(roundTimer.current)
    }
  }, [])

  // Quick bet amounts
  const quickBets = [5, 10, 25, 50, 100]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
      {/* Main Game Area */}
      <div className="lg:col-span-2 space-y-4 lg:space-y-6">
        {/* Game Canvas */}
        <motion.div 
          className="game-card h-64 sm:h-80 lg:h-96 game-canvas relative overflow-hidden"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Multiplier Display */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
            <motion.div
              animate={gameState === 'flying' ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5, repeat: gameState === 'flying' ? Infinity : 0 }}
              className="multiplier-display text-shadow"
            >
              {multiplier.toFixed(2)}x
            </motion.div>
          </div>

          {/* Game Status */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
            <AnimatePresence mode="wait">
              {gameState === 'waiting' && countdown > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="bg-surface-700 rounded-lg px-3 py-2 text-white font-bold"
                >
                  {countdown}s
                </motion.div>
              )}
              {gameState === 'flying' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-success font-bold text-lg glow-text"
                >
                  FLYING
                </motion.div>
              )}
              {gameState === 'crashed' && (
                <motion.div
                  initial={{ scale: 1.5 }}
                  animate={{ scale: 1 }}
                  className="text-accent font-bold text-xl glow-text"
                >
                  CRASHED!
                </motion.div>
              )}
            </AnimatePresence>
          </div>

{/* Animated Plane */}
<div className="absolute bottom-8 left-8 sm:bottom-12 sm:left-12">
            <motion.div
              ref={planeRef}
              animate={
                gameState === 'flying' 
                  ? { 
                      x: multiplier * 60 + (multiplier - 1) * 100,
                      y: -(multiplier * 40 + Math.pow(multiplier - 1, 1.5) * 60),
                      rotate: Math.min(-35, -5 - (multiplier - 1) * 8),
                      scale: 1 + (multiplier - 1) * 0.1
                    }
                  : gameState === 'crashed'
                  ? {
                      x: multiplier * 60 + (multiplier - 1) * 100 + 50,
                      y: -(multiplier * 40 + Math.pow(multiplier - 1, 1.5) * 60) + 200,
                      rotate: [Math.min(-35, -5 - (multiplier - 1) * 8), 45, 180, 270],
                      scale: [1 + (multiplier - 1) * 0.1, 1.4, 0.8, 0.3],
                      opacity: [1, 0.8, 0.4, 0.1]
                    }
                  : {
                      x: 0,
                      y: 0,
                      rotate: -5,
                      scale: 1,
                      opacity: 1
                    }
              }
              transition={{
                duration: gameState === 'flying' 
                  ? 0.1
                  : gameState === 'crashed' 
                  ? 1.5 
                  : 0.6,
                ease: gameState === 'flying' 
                  ? [0.25, 0.46, 0.45, 0.94]
                  : gameState === 'crashed' 
                  ? [0.68, -0.55, 0.265, 1.55]
                  : "easeOut",
                times: gameState === 'crashed' ? [0, 0.3, 0.7, 1] : undefined
              }}
              className={`text-4xl sm:text-6xl filter drop-shadow-lg transition-all ${
                gameState === 'waiting' ? 'animate-gentle-float' : ''
              }`}
            >
              ✈️
            </motion.div>
          </div>

          {/* Enhanced Trail Effects */}
          {gameState === 'flying' && (
            <>
              {/* Main Trail */}
              <motion.div
                className="absolute bottom-8 left-8 sm:bottom-12 sm:left-12"
                animate={{
                  x: [0, 80, 180, 300, 450],
                  y: [0, -40, -120, -180, -250]
                }}
                transition={{
                  duration: Math.max(3, roundDuration / 300),
                  ease: [0.25, 0.46, 0.45, 0.94],
                  times: [0, 0.2, 0.5, 0.8, 1]
                }}
              >
                <motion.div
                  className="w-3 h-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-full"
                  animate={{
                    scale: [0.5, 1.2, 0.8, 1.5, 0.3],
                    opacity: [0.3, 0.8, 0.6, 0.9, 0.2]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
              
              {/* Secondary Trail Particles */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute bottom-8 left-8 sm:bottom-12 sm:left-12"
                  animate={{
                    x: [0, 80, 180, 300, 450],
                    y: [0, -40, -120, -180, -250]
                  }}
                  transition={{
                    duration: Math.max(3, roundDuration / 300),
                    ease: [0.25, 0.46, 0.45, 0.94],
                    times: [0, 0.2, 0.5, 0.8, 1],
                    delay: i * 0.2
                  }}
                >
                  <motion.div
                    className="w-1 h-1 bg-yellow-400 rounded-full"
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 0.6, 0]
                    }}
                    transition={{
                      duration: 0.8 + i * 0.2,
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                  />
                </motion.div>
              ))}
            </>
          )}

          {/* Crash Effect */}
          {gameState === 'crashed' && (
            <motion.div
              className="absolute"
              style={{ left: '480px', top: 'calc(100% - 180px)' }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 2, 1.5], 
                opacity: [0, 1, 0.7],
                rotate: [0, 180, 360]
              }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <div className="text-6xl">💥</div>
            </motion.div>
          )}
        </motion.div>

        {/* Betting Panel */}
        <motion.div 
          className="game-card"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="flex-1 w-full sm:w-auto">
              <label className="block text-sm font-medium text-surface-300 mb-2">
                Bet Amount
              </label>
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400">$</span>
                  <input
                    type="number"
                    value={betAmount}
onChange={(e) => setBetAmount(Math.max(1, Math.min(balance, parseInt(e.target.value) || 1)))}
                    className="input-field pl-8 w-full"
                    min="1"
                    max={balance}
                  />
                </div>
                <button
                  onClick={() => setBetAmount(Math.floor(balance / 2))}
                  className="px-3 py-2 text-sm bg-surface-600 text-white rounded-lg hover:bg-surface-500 transition-colors"
                >
                  1/2
                </button>
                <button
                  onClick={() => setBetAmount(balance)}
                  className="px-3 py-2 text-sm bg-surface-600 text-white rounded-lg hover:bg-surface-500 transition-colors"
                >
                  Max
                </button>
              </div>
              
              {/* Quick Bet Buttons */}
              <div className="flex flex-wrap gap-2 mt-3">
                {quickBets.map(amount => (
                  <button
                    key={amount}
onClick={() => setBetAmount(Math.min(amount, balance))}
                    className="px-3 py-1 text-xs bg-surface-700 text-white rounded-lg hover:bg-surface-600 transition-colors"
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col space-y-3 w-full sm:w-auto">
              {/* Bet/Cash Out Button */}
              {!currentBet || currentBet.cashedOut ? (
                <button
                  onClick={placeBet}
disabled={gameState !== 'waiting' || betAmount > balance || betAmount < 1}
                  className="bet-button disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  <ApperIcon name="Plane" className="w-5 h-5 mr-2" />
                  Place Bet
                </button>
              ) : (
                <button
                  onClick={cashOut}
                  disabled={gameState !== 'flying'}
                  className="cashout-button disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  <ApperIcon name="DollarSign" className="w-5 h-5 mr-2" />
                  Cash Out
                </button>
              )}

              {/* Current Bet Display */}
              {currentBet && (
                <div className="text-center p-2 bg-surface-700 rounded-lg">
                  <div className="text-xs text-surface-400">Current Bet</div>
                  <div className="text-white font-bold">${currentBet.amount}</div>
                  {currentBet.cashedOut && (
                    <div className="text-success text-xs">
                      Cashed out at {currentBet.multiplier.toFixed(2)}x
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Sidebar */}
      <div className="space-y-4 lg:space-y-6">
        {/* Balance */}
        <motion.div 
          className="game-card text-center"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <div className="text-surface-400 text-sm mb-1">Balance</div>
          <div className="text-2xl sm:text-3xl font-bold text-white">${balance}</div>
        </motion.div>

        {/* Round History */}
        <motion.div 
          className="game-card"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h3 className="text-white font-semibold mb-4 flex items-center">
            <ApperIcon name="History" className="w-5 h-5 mr-2" />
            Recent Crashes
          </h3>
          <div className="space-y-2">
            {roundHistory.map((crash, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center justify-between p-2 rounded-lg ${
                  crash >= 2 ? 'bg-success/20 text-success' : 'bg-accent/20 text-accent'
                }`}
              >
                <span className="font-mono">{crash.toFixed(2)}x</span>
                <ApperIcon 
                  name={crash >= 2 ? "TrendingUp" : "TrendingDown"} 
                  className="w-4 h-4" 
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Active Players */}
        <motion.div 
          className="game-card"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h3 className="text-white font-semibold mb-4 flex items-center">
            <ApperIcon name="Users" className="w-5 h-5 mr-2" />
            Active Players
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {activePlayers.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-2 bg-surface-700 rounded-lg text-sm"
              >
                <span className="text-white truncate">{player.username}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-surface-300">${player.bet}</span>
                  {player.cashOut ? (
                    <span className="text-success font-bold">{player.cashOut}x</span>
                  ) : (
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default MainFeature