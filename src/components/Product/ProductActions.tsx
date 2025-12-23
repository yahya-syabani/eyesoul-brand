import React from 'react'
import * as Icon from '@phosphor-icons/react/dist/ssr'

type ActionButtonProps = {
  active?: boolean
  tooltip?: string
  onClick: (e: React.MouseEvent) => void
  className?: string
  children: React.ReactNode
  'aria-label': string
}

export const ActionButton: React.FC<ActionButtonProps> = ({ active, tooltip, onClick, className, children, 'aria-label': ariaLabel }) => {
  return (
    <button
      type="button"
      className={`${className ?? ''} ${active ? 'active' : ''}`.trim()}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={active}
    >
      {tooltip ? <span className="tag-action bg-black text-white caption2 px-1.5 py-0.5 rounded-sm" aria-hidden="true">{tooltip}</span> : null}
      {children}
    </button>
  )
}

export const WishlistIcon: React.FC<{ active: boolean }> = ({ active }) => {
  return active ? <Icon.Heart size={18} weight="fill" className="text-white" /> : <Icon.Heart size={18} />
}

export const CompareIcon: React.FC<{ variant?: 'repeat' | 'arrows' }> = ({ variant = 'repeat' }) => {
  return variant === 'arrows' ? (
    <Icon.ArrowsCounterClockwise size={18} className="compare-icon" />
  ) : (
    <Icon.Repeat size={18} className="compare-icon" />
  )
}

export const CompareCheckedIcon: React.FC = () => <Icon.CheckCircle size={20} className="checked-icon" />

export const QuickViewIcon: React.FC<{ size?: number }> = ({ size = 18 }) => <Icon.Eye size={size} />

export const AddCartIcon: React.FC<{ size?: number }> = ({ size = 18 }) => <Icon.ShoppingBagOpen size={size} />


