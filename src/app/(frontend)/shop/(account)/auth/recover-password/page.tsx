import type { Metadata } from 'next'

import { mergeOpenGraph } from '@lib/utils/mergeOpenGraph'
import React from 'react'

import { RecoverPasswordForm } from './recover-form.client'

export default async function RecoverPassword() {
  return (
    <div className="container py-16">
      <RecoverPasswordForm />
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Recover Password | BonaVista LeisureScapes',
    description: 'Enter your email address to recover your password.',
    openGraph: mergeOpenGraph({
      title: 'Recover Password',
      url: '/recover-password',
    }),
  }
}
