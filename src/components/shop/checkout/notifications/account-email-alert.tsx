import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface AccountEmailAlertProps {
  isOpen: boolean
  email: string
  onContinue: () => void
  onChangeEmail: () => void
  onLogin: () => void
  onClose: () => void
}

export function AccountEmailAlert({
  isOpen,
  email,
  onContinue,
  onChangeEmail,
  onLogin,
  onClose,
}: AccountEmailAlertProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Account Found</DialogTitle>
          <DialogDescription>
            The email <span className="font-medium">{email}</span> is associated with an existing
            account.
          </DialogDescription>
        </DialogHeader>

        <div className="pt-4 pb-2">
          <p className="text-sm text-muted-foreground mb-2">
            Choose how you would like to proceed:
          </p>

          <div className="space-y-2">
            <div className="p-3 border rounded-md">
              <h4 className="font-medium text-sm">Sign in to your account</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Access your saved addresses and order history.
              </p>
            </div>

            <div className="p-3 border rounded-md">
              <h4 className="font-medium text-sm">Continue as guest</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Your order will still be associated with this email, but no information will be
                autofilled.
              </p>
            </div>

            <div className="p-3 border rounded-md">
              <h4 className="font-medium text-sm">Use a different email</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Change the email address for this order.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
          <Button className="sm:w-full" variant="outline" onClick={onChangeEmail}>
            Change Email
          </Button>
          <Button className="sm:w-full" variant="secondary" onClick={onLogin}>
            Sign In
          </Button>
          <Button className="sm:w-full" onClick={onContinue}>
            Continue as Guest
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
