'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Login from './login'
import Register from './register'

export enum LOGIN_VIEW {
  SIGN_IN = 'sign-in',
  REGISTER = 'register',
}

export default function LoginTemplate() {
  const [currentView, setCurrentView] = useState<LOGIN_VIEW>(LOGIN_VIEW.SIGN_IN)

  return (
    <div className="w-full flex flex-col items-center">
      <AnimatePresence mode="wait">
        {currentView === LOGIN_VIEW.SIGN_IN ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <Login setCurrentView={setCurrentView} />
          </motion.div>
        ) : (
          <motion.div
            key="register"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <Register setCurrentView={setCurrentView} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
