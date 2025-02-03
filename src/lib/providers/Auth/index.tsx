'use client'

import type { User } from '@payload-types'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { createUser, loginUser, getCurrentUser, resetPassword, forgotPassword } from './actions'

export type ResetPassword = (args: {
  password: string
  passwordConfirm: string
  token: string
}) => Promise<void>

export type ForgotPassword = (args: { email: string }) => Promise<void> 

export type Create = (args: {
  email: string
  password: string
  passwordConfirm: string
}) => Promise<User | null> 

export type Login = (args: { email: string; password: string }) => Promise<User>

export type Logout = () => Promise<void>

export type AuthContext = {
  create: Create
  forgotPassword: ForgotPassword
  login: Login
  logout: Logout
  resetPassword: ResetPassword
  setUser: (user: User | null) => void 
  status: 'loggedIn' | 'loggedOut' | undefined
  user?: User | null
}

const Context = createContext({} as AuthContext)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>()

  // used to track the single event of logging in or logging out
  // useful for `useEffect` hooks that should only run once
  const [status, setStatus] = useState<'loggedIn' | 'loggedOut' | undefined>()

  const create = useCallback<Create>(async (args) => {
    try {
      const res = await createUser(args.email, args.password)

      if (res) {
        setUser(res)
        setStatus('loggedIn')
        return res
      } else {
        throw new Error('Invalid login')
      }
    } catch (e) {
      throw new Error('An error occurred while attempting to login.')
    }
  }, [])

  const login = useCallback<Login>(async (args) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/login`, {
        body: JSON.stringify({
          email: args.email,
          password: args.password,
        }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      if (res.ok) {
        const { errors, user } = await res.json()
        if (errors) throw new Error(errors[0].message)
        console.log('user', user)
        setUser(user)
        setStatus('loggedIn')
        return user
      }

      throw new Error('Invalid login')
    } catch (e) {
      throw new Error('An error occurred while attempting to login.')
    }
  }, [])

  const logout = useCallback<Logout>(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/logout`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      if (res.ok) {
        setUser(null)
        setStatus('loggedOut')
      } else {
        throw new Error('An error occurred while attempting to logout.')
      }
    } catch (e) {
      throw new Error('An error occurred while attempting to logout.')
    }
  }, [])

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'GET',
        })

        if (res.ok) {
          const { user: meUser } = await res.json()
          setUser(meUser || null)
          setStatus(meUser ? 'loggedIn' : undefined)
        } else {
          // throw new Error('An error occurred while fetching your account.')
        }
      } catch (e) {
        setUser(null)
        // throw new Error('An error occurred while fetching your account.')
      }
    }

    void fetchMe()
  }, [])

  const forgotPassword = useCallback<ForgotPassword>(async (args) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/forgot-password`, {
        body: JSON.stringify({
          email: args.email,
        }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      if (res.ok) {
        const { data, errors } = await res.json()
        if (errors) throw new Error(errors[0].message)
        setUser(data?.loginUser?.user)
      } else {
        throw new Error('Invalid login')
      }
    } catch (e) {
      throw new Error('An error occurred while attempting to login.')
    }
  }, [])

  const resetPassword = useCallback<ResetPassword>(async (args) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/reset-password`, {
        body: JSON.stringify({
          password: args.password,
          passwordConfirm: args.passwordConfirm,
          token: args.token,
        }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      if (res.ok) {
        const { data, errors } = await res.json()
        if (errors) throw new Error(errors[0].message)
        setUser(data?.loginUser?.user)
        setStatus(data?.loginUser?.user ? 'loggedIn' : undefined)
      } else {
        throw new Error('Invalid login')
      }
    } catch (e) {
      throw new Error('An error occurred while attempting to login.')
    }
  }, [])

  return (
    <Context.Provider
      value={{
        create,
        forgotPassword,
        login,
        logout,
        resetPassword,
        setUser,
        status,
        user,
      }}
    >
      {children}
    </Context.Provider>
  )
}

type UseAuth<T = User> = () => AuthContext

export const useAuth: UseAuth = () => useContext(Context)
