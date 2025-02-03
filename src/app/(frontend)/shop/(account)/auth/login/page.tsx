import React from 'react'
import { Metadata } from 'next'
import LoginTemplate from '@/components/auth'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Login | BonaVista LeisureScapes',
    description: 'Login or create an account to get started.',
  }
}

export default function LoginPage() {
  return <LoginTemplate />
}
