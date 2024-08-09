import * as React from 'react'
import { cn } from '@/lib/utils/cn'
import { Slot } from '@radix-ui/react-slot'
import { VariantProps, cva } from 'class-variance-authority'

const textVariants = cva('base-class', {
  variants: {
    size: {
      xsmall: 'text-xs',
      small: 'text-sm',
      base: 'text-base',
      large: 'text-lg',
      xlarge: 'text-xl',
    },
    weight: {
      regular: 'font-normal',
      plus: 'font-medium',
    },
    family: {
      sans: 'font-sans',
      mono: 'font-mono',
    },
    leading: {
      normal: 'leading-normal',
      compact: 'leading-tight',
    },
  },
  defaultVariants: {
    family: 'sans',
    size: 'base',
    weight: 'regular',
    leading: 'normal',
  },
  compoundVariants: [
    {
      size: 'xsmall',
      leading: 'normal',
      class: 'txt-xsmall',
    },
    {
      size: 'xsmall',
      leading: 'compact',
      class: 'txt-compact-xsmall',
    },
    {
      size: 'small',
      leading: 'normal',
      class: 'txt-small',
    },
    {
      size: 'small',
      leading: 'compact',
      class: 'txt-compact-small',
    },
    {
      size: 'base',
      leading: 'normal',
      class: 'txt-medium',
    },
    {
      size: 'base',
      leading: 'compact',
      class: 'txt-compact-medium',
    },
    {
      size: 'large',
      leading: 'normal',
      class: 'txt-large',
    },
    {
      size: 'large',
      leading: 'compact',
      class: 'txt-compact-large',
    },
    {
      size: 'xlarge',
      leading: 'normal',
      class: 'txt-xlarge',
    },
    {
      size: 'xlarge',
      leading: 'compact',
      class: 'txt-compact-xlarge',
    },
  ],
})

interface TextProps extends React.ComponentPropsWithoutRef<'p'>, VariantProps<typeof textVariants> {
  asChild?: boolean
  as?: 'p' | 'span' | 'div'
}

/**
 * This component is based on the `p` element and supports all of its props
 */
const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  (
    {
      className,
      asChild = false,
      as = 'p',
      size = 'base',
      weight = 'regular',
      family = 'sans',
      leading = 'normal',
      children,
      ...props
    }: TextProps,
    ref,
  ) => {
    const Component = asChild ? Slot : as

    return (
      <Component
        ref={ref}
        className={cn(textVariants({ size, weight, family, leading }), className)}
        {...props}
      >
        {children}
      </Component>
    )
  },
)

Text.displayName = 'Text'

export { Text }
