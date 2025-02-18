import { cn } from '@/lib/utils/cn'
import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
}

export const LoadingSpinner = ({ className, size = 'md' }: LoadingSpinnerProps) => {
  return (
    <Loader2
      className={cn('animate-spin text-gray-500', sizeClasses[size], className)}
      aria-label="Loading"
    />
  )
} 