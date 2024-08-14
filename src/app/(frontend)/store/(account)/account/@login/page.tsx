import { Metadata } from 'next'
import LoginTemplate from '@/components/store/account/layout/login-layout'

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to your BonaVista Store account.',
}

export default function Login() {
  return <LoginTemplate />
}
