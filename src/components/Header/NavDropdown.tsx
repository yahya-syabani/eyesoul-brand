'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Link, usePathname } from '@/i18n/routing'
import * as Icon from '@phosphor-icons/react/dist/ssr'
import { NavDropdownItem } from '@/types/navigation'
import { useClickOutside } from '@/hooks/useClickOutside'

interface NavDropdownProps {
  item: NavDropdownItem
  isActive: (href: string) => boolean
}

const NavDropdown: React.FC<NavDropdownProps> = ({ item, isActive }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)
  const dropdownRef = useRef<HTMLLIElement>(null)
  const pathname = usePathname()

  useClickOutside(dropdownRef, () => {
    setIsOpen(false)
    setFocusedIndex(null)
  })

  // Check if any sub-item is active
  const hasActiveItem = item.items.some(subItem => isActive(subItem.href))

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setIsOpen(!isOpen)
      if (!isOpen) {
        setFocusedIndex(0)
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      setFocusedIndex(null)
      dropdownRef.current?.querySelector('button')?.focus()
    } else if (isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault()
      const currentIndex = focusedIndex ?? 0
      let newIndex = currentIndex

      if (e.key === 'ArrowDown') {
        newIndex = (currentIndex + 1) % item.items.length
      } else {
        newIndex = (currentIndex - 1 + item.items.length) % item.items.length
      }

      setFocusedIndex(newIndex)
    } else if (isOpen && e.key === 'Enter' && focusedIndex !== null) {
      e.preventDefault()
      const selectedItem = item.items[focusedIndex]
      if (selectedItem) {
        window.location.href = selectedItem.href
      }
    }
  }

  // Focus management for keyboard navigation
  useEffect(() => {
    if (isOpen && focusedIndex !== null) {
      const menuItems = dropdownRef.current?.querySelectorAll('.sub-menu a')
      if (menuItems && menuItems[focusedIndex]) {
        ;(menuItems[focusedIndex] as HTMLElement).focus()
      }
    }
  }, [isOpen, focusedIndex])

  return (
    <li
      ref={dropdownRef}
      className="h-full relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className={`text-button-uppercase duration-300 h-full flex items-center justify-center gap-1.5 ${
          hasActiveItem ? 'active' : ''
        }`}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={`${item.label} menu`}
        type="button"
      >
        {item.label}
        <Icon.CaretDown
          size={12}
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      <div className={`nav-dropdown-wrapper ${isOpen ? 'open' : ''}`}>
        <ul
          className="nav-dropdown-menu"
          role="menu"
          aria-label={`${item.label} submenu`}
        >
          {item.items.map((subItem, index) => (
            <li key={subItem.href} role="none">
              <Link
                href={subItem.href}
                className={`nav-dropdown-item ${isActive(subItem.href) ? 'active' : ''} ${
                  focusedIndex === index ? 'focused' : ''
                }`}
                role="menuitem"
                tabIndex={isOpen ? 0 : -1}
                onClick={() => setIsOpen(false)}
                onFocus={() => setFocusedIndex(index)}
              >
                <span className="nav-dropdown-item-text">{subItem.label}</span>
                {isActive(subItem.href) && (
                  <Icon.Check size={16} className="nav-dropdown-item-check" aria-hidden="true" />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  )
}

export default NavDropdown

