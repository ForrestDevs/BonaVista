'use client'

import { useFormState } from 'react-dom'
import { Input } from '@/components/ui/input'
import { LOGIN_VIEW } from '@/components/store/account/layout/login-layout'
import { signUp } from '@/components/store/account/actions'
import { Alert } from '@/components/ui/alert'
import { YnsLink } from '@/components/ui/link'
import { Button } from '@/components/ui/button'

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Register = ({ setCurrentView }: Props) => {
  const [message, formAction] = useFormState(signUp, null)

  return (
    <div className="max-w-sm flex flex-col items-center" data-testid="register-page">
      <h1 className="text-large-semi uppercase mb-6">Become a Medusa Store Member</h1>
      <p className="text-center text-base-regular text-ui-fg-base mb-4">
        Create your Medusa Store Member profile, and get access to an enhanced shopping experience.
      </p>
      <form className="w-full flex flex-col" action={formAction}>
        <div className="flex flex-col w-full gap-y-2">
          <Input name="name" required autoComplete="name" data-testid="name-input" />
          <Input
            name="email"
            required
            type="email"
            autoComplete="email"
            data-testid="email-input"
          />
          <Input
            name="password"
            required
            type="password"
            autoComplete="new-password"
            data-testid="password-input"
          />
        </div>
        <Alert variant="destructive" data-testid="register-error">
          {message}
        </Alert>
        <span className="text-center text-ui-fg-base text-small-regular mt-6">
          By creating an account, you agree to Medusa Store&apos;s{' '}
          <YnsLink href="/content/privacy-policy" className="underline">
            Privacy Policy
          </YnsLink>{' '}
          and{' '}
          <YnsLink href="/content/terms-of-use" className="underline">
            Terms of Use
          </YnsLink>
          .
        </span>
        <Button className="w-full mt-6" data-testid="register-button">
          Join
        </Button>
      </form>
      <span className="text-center text-ui-fg-base text-small-regular mt-6">
        Already a member?{' '}
        <button onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)} className="underline">
          Sign in
        </button>
        .
      </span>
    </div>
  )
}

export default Register
