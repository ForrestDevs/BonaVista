'use client'

import { useState } from 'react'

import Register from '@/components/store/account/register'
import Login from '@/components/store/account/login'

export enum LOGIN_VIEW {
  SIGN_IN = 'sign-in',
  REGISTER = 'register',
}

const LoginTemplate = () => {
  const [currentView, setCurrentView] = useState('sign-in')

  return (
    <div className="w-full flex justify-start px-8 py-8">
      {currentView === 'sign-in' ? (
        <Login setCurrentView={setCurrentView} />
      ) : (
        <Register setCurrentView={setCurrentView} />
      )}
    </div>
  )
}

export default LoginTemplate
