import { NextResponse } from 'next/server'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { reportError } from './reportError'
import { ERROR_MESSAGES } from './api-constants'

/**
 * Custom API Error class for standardized error handling
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Standardized API error handler
 * Handles different error types and returns appropriate HTTP responses
 * Logs detailed errors server-side but returns generic messages to clients
 */
export function handleApiError(error: unknown): NextResponse {
  // Zod validation errors
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        error: ERROR_MESSAGES.VALIDATION_FAILED,
        message: ERROR_MESSAGES.VALIDATION_FAILED,
        issues: error.issues,
      },
      { status: 400 }
    )
  }

  // Custom ApiError instances
  if (error instanceof ApiError) {
    const response: { error: string; message: string; code?: string } = {
      error: error.message,
      message: error.message,
    }
    if (error.code) {
      response.code = error.code
    }
    return NextResponse.json(response, { status: error.status })
  }

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Log the actual error for debugging
    reportError(error, { type: 'prisma_error', code: error.code })

    // Handle specific Prisma error codes
    if (error.code === 'P2002') {
      // Unique constraint violation
      const target = (error.meta?.target as string[]) || []
      if (target.includes('email')) {
        return NextResponse.json(
          {
            error: ERROR_MESSAGES.EMAIL_ALREADY_EXISTS,
            message: ERROR_MESSAGES.EMAIL_ALREADY_EXISTS,
          },
          { status: 400 }
        )
      }
      return NextResponse.json(
        {
          error: ERROR_MESSAGES.VALIDATION_FAILED,
          message: 'A record with this value already exists',
        },
        { status: 400 }
      )
    }
    if (error.code === 'P2025') {
      // Record not found
      return NextResponse.json(
        {
          error: ERROR_MESSAGES.NOT_FOUND,
          message: ERROR_MESSAGES.NOT_FOUND,
        },
        { status: 404 }
      )
    }
    // Generic Prisma error
    return NextResponse.json(
      {
        error: ERROR_MESSAGES.INTERNAL_ERROR,
        message: ERROR_MESSAGES.INTERNAL_ERROR,
      },
      { status: 500 }
    )
  }

  // Prisma validation errors
  if (error instanceof Prisma.PrismaClientValidationError) {
    reportError(error, { type: 'prisma_validation_error' })
    return NextResponse.json(
      {
        error: ERROR_MESSAGES.VALIDATION_FAILED,
        message: ERROR_MESSAGES.VALIDATION_FAILED,
      },
      { status: 400 }
    )
  }

  // Unknown errors - log details but return generic message
  reportError(error, { type: 'unknown_error' })
  return NextResponse.json(
    {
      error: ERROR_MESSAGES.INTERNAL_ERROR,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
    },
    { status: 500 }
  )
}

/**
 * Helper to create a 404 error
 */
export function createNotFoundError(resource: string = 'Resource'): ApiError {
  return new ApiError(404, `${resource} not found`, 'NOT_FOUND')
}

/**
 * Helper to create a 400 validation error
 */
export function createValidationError(message: string): ApiError {
  return new ApiError(400, message, 'VALIDATION_ERROR')
}

/**
 * Helper to create a 403 forbidden error
 */
export function createForbiddenError(message: string = ERROR_MESSAGES.FORBIDDEN): ApiError {
  return new ApiError(403, message, 'FORBIDDEN')
}

/**
 * Helper to create a 401 unauthorized error
 */
export function createUnauthorizedError(message: string = ERROR_MESSAGES.UNAUTHORIZED): ApiError {
  return new ApiError(401, message, 'UNAUTHORIZED')
}

