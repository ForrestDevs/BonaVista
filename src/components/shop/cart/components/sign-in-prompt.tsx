import { Button } from '@components/ui/button'
import { YnsLink } from '@components/ui/link'

const SignInPrompt = () => {
  return (
    <div className="bg-white flex items-center justify-between p-4 rounded-lg shadow-sm">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Already have an account?</h2>
        <p className="text-sm text-gray-600 mt-1">Sign in for a better experience.</p>
      </div>
      <div>
        <YnsLink href="/shop/account">
          <Button variant="outline" className="h-10" data-testid="sign-in-button">
            Sign in
          </Button>
        </YnsLink>
      </div>
    </div>
  )
}

export default SignInPrompt
