import clsx, { type ClassValue } from 'clsx'

/** Classname helper (thin `clsx` wrapper for shared UI in EP-3+). */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs)
}
