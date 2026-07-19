import clsx from 'clsx'

const baseStyles = {
  solid:
    'inline-flex justify-center rounded-lg py-2 px-3 text-sm font-semibold transition-colors',
  outline:
    'inline-flex justify-center rounded-lg border py-[calc(--spacing(2)-1px)] px-[calc(--spacing(3)-1px)] text-sm transition-colors',
}

const variantStyles = {
  solid: {
    midnightBlue:
      'relative overflow-hidden bg-midnight-blue-700 text-white before:absolute before:inset-0 active:before:bg-transparent hover:before:bg-white/10 active:bg-midnight-blue-800 active:text-white/80 before:transition-colors',
    blue: 'relative overflow-hidden bg-blue-800 text-white before:absolute before:inset-0 active:before:bg-transparent hover:before:bg-white/10 active:bg-blue-900 active:text-white/80 before:transition-colors',
    white:
      'bg-white text-midnight-blue-900 hover:bg-white/90 active:bg-white/90 active:text-midnight-blue-900/70',
    gray: 'bg-gray-800 text-white hover:bg-gray-900 active:bg-gray-800 active:text-white/80',
  },
  outline: {
    gray: 'border-gray-300 text-gray-700 hover:border-gray-400 active:bg-gray-100 active:text-gray-700/80',
  },
}

type VariantProps =
  | {
      variant?: 'solid'
      color?: keyof typeof variantStyles.solid
    }
  | {
      variant: 'outline'
      color?: keyof typeof variantStyles.outline
    }

type AnchorButtonProps = VariantProps &
  Omit<React.ComponentPropsWithoutRef<'a'>, 'color'> & { href: string }

type NativeButtonProps = VariantProps &
  Omit<React.ComponentPropsWithoutRef<'button'>, 'color'> & { href?: never }

type ButtonProps = AnchorButtonProps | NativeButtonProps

export function Button({
  className,
  variant = 'solid',
  color = 'gray',
  ...elementProps
}: ButtonProps) {
  const variantStyle =
    variant === 'outline'
      ? variantStyles.outline[color as keyof typeof variantStyles.outline]
      : variantStyles.solid[color as keyof typeof variantStyles.solid]

  const classes = clsx(baseStyles[variant], variantStyle, className)

  if (typeof elementProps.href === 'string') {
    return <a className={classes} {...elementProps} />
  }

  return <button className={classes} {...elementProps} />
}
