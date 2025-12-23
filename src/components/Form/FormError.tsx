'use client'

import React from 'react'
import { FieldError } from '@/types'

interface FormErrorProps {
  error?: FieldError | string
  id?: string
}

const FormError: React.FC<FormErrorProps> = ({ error, id }) => {
  if (!error) return null

  const errorMessage = typeof error === 'string' ? error : error.message

  return (
    <p
      id={id}
      className="form-error caption2 text-red mt-1"
      role="alert"
      aria-live="polite"
    >
      {errorMessage}
    </p>
  )
}

export default FormError

