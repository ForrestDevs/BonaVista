import type { Metadata } from 'next'

import { mergeOpenGraph } from '@lib/utils/mergeOpenGraph'
import React, { Suspense } from 'react'

import { ResetPasswordForm } from './reset-form.client'

export default function ResetPassword() {
  return (
    <div className="container py-16">
      <h1 className="text-xl mb-4">Reset Password</h1>
      <p>Please enter a new password below.</p>
      <Suspense fallback={<React.Fragment />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Reset Password | BonaVista LeisureScapes',
    description: 'Enter a new password.',
    openGraph: mergeOpenGraph({
      title: 'Reset Password',
      url: '/reset-password',
    }),
  }
}
