import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface DifferentEmailAlertProps {
  isOpen: boolean
  email: string
  suggestedEmail: string
  hasExistingAccount: boolean
  onContinue: () => void
  onChangeEmail: () => void
  onUseAccountEmail: () => void
  onClose: () => void
}

export function DifferentEmailAlert({
  isOpen,
  email,
  suggestedEmail,
  hasExistingAccount,
  onContinue,
  onChangeEmail,
  onUseAccountEmail,
  onClose,
}: DifferentEmailAlertProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Using Different Email</DialogTitle>
          <DialogDescription>
            You&apos;re using a different email than your account email.
          </DialogDescription>
        </DialogHeader>
        <div className="">
          {hasExistingAccount && (
            <div className="rounded-md bg-amber-50 p-3 mb-4 border border-amber-200">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> The email <span className="font-medium">{email}</span> is
                associated with another account.
              </p>
            </div>
          )}

          <p className="text-sm text-muted-foreground mb-4">
            Using a different email means this order won&apos;t appear in your account history. How
            would you like to proceed?
          </p>

          <div className="space-y-2">
            <button 
              onClick={onUseAccountEmail}
              className="w-full p-3 border rounded-md text-left transition-all duration-200 hover:bg-gray-50 hover:border-primary hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary group"
            >
              <h4 className="font-medium text-sm group-hover:text-primary">Use account email</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Use <span className="font-medium">{suggestedEmail}</span> to keep this order in your
                account history.
              </p>
            </button>

            <button
              onClick={onContinue}
              className="w-full p-3 border rounded-md text-left transition-all duration-200 hover:bg-gray-50 hover:border-primary hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary group"
            >
              <h4 className="font-medium text-sm group-hover:text-primary">Continue with different email</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Use <span className="font-medium">{email}</span> for this order only.
              </p>
            </button>

            <button
              onClick={onChangeEmail}
              className="w-full p-3 border rounded-md text-left transition-all duration-200 hover:bg-gray-50 hover:border-primary hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary group"
            >
              <h4 className="font-medium text-sm group-hover:text-primary">Enter another email</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Change the email address for this order.
              </p>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
