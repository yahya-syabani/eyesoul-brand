import React from 'react'

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string
  children: React.ReactNode
  className?: string
}

const IconButton: React.FC<IconButtonProps> = ({
  'aria-label': ariaLabel,
  children,
  className = '',
  ...props
}) => {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={className}
      {...props}
    >
      {children}
    </button>
  )
}

export default IconButton

