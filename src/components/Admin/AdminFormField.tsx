'use client'

import React from 'react'

interface AdminFormFieldProps {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}

export const AdminFormField: React.FC<AdminFormFieldProps> = ({
  label,
  error,
  required,
  children,
}) => {
  return (
    <div className="space-y-1">
      <label className="text-title">
        {label}
        {required && <span className="text-red ml-1">*</span>}
      </label>
      {children}
      {error && <div className="text-red text-sm">{error}</div>}
    </div>
  )
}

interface AdminInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  required?: boolean
}

export const AdminInput: React.FC<AdminInputProps> = ({
  label,
  error,
  required,
  className,
  ...props
}) => {
  return (
    <AdminFormField label={label} error={error} required={required}>
      <input
        className={`w-full border ${error ? 'border-red' : 'border-line'} rounded px-3 py-2 ${className || ''}`}
        {...props}
      />
    </AdminFormField>
  )
}

interface AdminTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  required?: boolean
}

export const AdminTextarea: React.FC<AdminTextareaProps> = ({
  label,
  error,
  required,
  className,
  ...props
}) => {
  return (
    <AdminFormField label={label} error={error} required={required}>
      <textarea
        className={`w-full border ${error ? 'border-red' : 'border-line'} rounded px-3 py-2 ${className || ''}`}
        {...props}
      />
    </AdminFormField>
  )
}

interface AdminSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  required?: boolean
  options: { value: string; label: string }[]
}

export const AdminSelect: React.FC<AdminSelectProps> = ({
  label,
  error,
  required,
  options,
  className,
  ...props
}) => {
  return (
    <AdminFormField label={label} error={error} required={required}>
      <select
        className={`w-full border ${error ? 'border-red' : 'border-line'} rounded px-3 py-2 ${className || ''}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </AdminFormField>
  )
}

