import { Metadata } from 'next'
import LoginTemplate from '@components/auth'


export const metadata: Metadata = {
  title: 'Login',
  description: 'Login or create an account to get started.',
}

export default function Login() {
  return <LoginTemplate />
}
