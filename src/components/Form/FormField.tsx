'use client'

import React, { forwardRef } from 'react'
import { FieldError } from '@/types'
import FormError from './FormError'

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: FieldError | string
  helperText?: string
  required?: boolean
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, helperText, required, id, className, ...props }, ref) => {
    const fieldId = id || `field-${props.name || 'input'}`
    const errorId = error ? `${fieldId}-error` : undefined
    const helperId = helperText ? `${fieldId}-helper` : undefined
    const ariaDescribedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined

    return (
      <div className="form-field">
        {label && (
          <label htmlFor={fieldId} className="caption1 text-secondary mb-2 block">
            {label}
            {required && <span className="text-red ml-1" aria-label="required">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={fieldId}
          className={`w-full px-4 py-3 rounded-lg border ${
            error ? 'border-red' : 'border-line'
          } focus:border-black focus:outline-none transition-colors ${className || ''}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={ariaDescribedBy}
          aria-required={required}
          {...props}
        />
        {helperText && !error && (
          <p id={helperId} className="caption2 text-secondary2 mt-1">
            {helperText}
          </p>
        )}
        <FormError error={error} id={errorId} />
      </div>
    )
  }
)

FormField.displayName = 'FormField'

export default FormField

