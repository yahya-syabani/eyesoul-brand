'use server'

import { headers } from 'next/headers'
import { z } from 'zod'

import { createContactSubmission, normalizeRequesterIp } from '@/lib/cms/contactSubmissions'
import { checkRateLimit } from '@/lib/security/rateLimit'

export type FormState = {
  ok: boolean
  message: string
  fieldErrors?: Partial<Record<'name' | 'email' | 'message' | 'inquiryType' | 'preferredDate', string>>
  values?: Partial<Record<'name' | 'email' | 'message' | 'inquiryType' | 'preferredDate', string>>
}

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(120),
  email: z.string().email('Valid email required'),
  inquiryType: z.string().optional(),
  preferredDate: z.string().optional(),
  message: z.string().min(1, 'Message is required').max(5000),
  website: z.string().max(0).optional(),
})

const newsletterSchema = z.object({
  email: z.string().email('Valid email required'),
  trap: z.string().max(0).optional(),
})

function honeypotTripped(raw: string | null | undefined): boolean {
  return Boolean(raw && String(raw).trim().length > 0)
}

export async function submitContact(_prev: FormState, formData: FormData): Promise<FormState> {
  const trapValue = formData.get('website')?.toString()
  const honeypotTriggered = honeypotTripped(trapValue)
  const reqHeaders = await headers()
  const forwardedFor = reqHeaders.get('x-forwarded-for') ?? reqHeaders.get('x-real-ip') ?? ''
  const requesterIp = normalizeRequesterIp(forwardedFor)
  const userAgent = reqHeaders.get('user-agent') ?? ''

  const parsed = contactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    inquiryType: formData.get('inquiryType') || 'general',
    preferredDate: formData.get('preferredDate') || undefined,
    message: formData.get('message'),
    website: trapValue ?? '',
  })

  if (honeypotTriggered) {
    if (parsed.success) {
      try {
        await createContactSubmission({
          ...parsed.data,
          honeypotTriggered: true,
          submissionStatus: 'spam',
          ip: requesterIp,
          userAgent,
        })
      } catch (error) {
        console.warn('Contact honeypot persistence failed', { hasIp: Boolean(requesterIp), error })
      }
    }
    return { ok: true, message: 'Thanks — we will be in touch shortly.' }
  }

  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors
    const msg = first.name?.[0] ?? first.email?.[0] ?? first.message?.[0] ?? 'Please check the form.'
    return {
      ok: false,
      message: msg,
      fieldErrors: {
        name: first.name?.[0],
        email: first.email?.[0],
        message: first.message?.[0],
      },
      values: {
        name: formData.get('name')?.toString() ?? '',
        email: formData.get('email')?.toString() ?? '',
        inquiryType: formData.get('inquiryType')?.toString() ?? 'general',
        preferredDate: formData.get('preferredDate')?.toString() ?? '',
        message: formData.get('message')?.toString() ?? '',
      },
    }
  }

  const limitResult = checkRateLimit(`contact:${requesterIp || parsed.data.email.toLowerCase()}`, {
    windowMs: 10 * 60 * 1000,
    maxRequests: 5,
  })

  if (!limitResult.allowed) {
    const retryAfterMins = Math.ceil(limitResult.retryAfterMs / 60000)
    console.warn('Contact form rate limit exceeded', {
      hasIp: Boolean(requesterIp),
      retryAfterMs: limitResult.retryAfterMs,
    })
    return {
      ok: false,
      message: `Too many attempts. Please try again in about ${retryAfterMins} minute${retryAfterMins === 1 ? '' : 's'}.`,
      values: {
        name: parsed.data.name,
        email: parsed.data.email,
        inquiryType: parsed.data.inquiryType,
        preferredDate: parsed.data.preferredDate,
        message: parsed.data.message,
      },
    }
  }

  try {
    await createContactSubmission({
      ...parsed.data,
      honeypotTriggered: false,
      submissionStatus: 'new',
      ip: requesterIp,
      userAgent,
    })
  } catch (error) {
    console.error('Contact submission persistence failed', {
      hasIp: Boolean(requesterIp),
      hasUserAgent: Boolean(userAgent),
      error,
    })
    return {
      ok: false,
      message: 'We could not send your message right now. Please try again in a moment.',
      values: {
        name: parsed.data.name,
        email: parsed.data.email,
        inquiryType: parsed.data.inquiryType,
        preferredDate: parsed.data.preferredDate,
        message: parsed.data.message,
      },
    }
  }

  return { ok: true, message: 'Thanks — we will be in touch shortly.' }
}

export async function subscribeNewsletter(_prev: FormState, formData: FormData): Promise<FormState> {
  if (honeypotTripped(formData.get('trap')?.toString())) {
    return { ok: true, message: 'You are subscribed.' }
  }

  const parsed = newsletterSchema.safeParse({
    email: formData.get('email'),
    trap: formData.get('trap')?.toString() ?? '',
  })

  if (!parsed.success) {
    const msg = parsed.error.flatten().fieldErrors.email?.[0] ?? 'Valid email required.'
    return { ok: false, message: msg }
  }

  const email = parsed.data.email
  const apiKey = process.env.MAILCHIMP_API_KEY
  const listId = process.env.MAILCHIMP_AUDIENCE_ID
  const server = process.env.MAILCHIMP_SERVER_PREFIX

  if (!apiKey || !listId || !server) {
    console.error('Missing Mailchimp config:', { apiKey: !!apiKey, listId: !!listId, server: !!server })
    // Fail silently or with a generic message for security
    return { ok: false, message: 'Subscription service unavailable.' }
  }

  try {
    const response = await fetch(
      `https://${server}.api.mailchimp.com/3.0/lists/${listId}/members`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`any:${apiKey}`).toString('base64')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: email,
          status: 'subscribed',
        }),
      }
    )

    const data = await response.json()

    if (response.ok) {
      return { ok: true, message: 'You have been subscribed successfully.' }
    }

    if (data.title === 'Member Exists') {
      return { ok: true, message: 'You are already subscribed.' }
    }

    console.error('Mailchimp API error:', data)
    return { ok: false, message: 'Could not subscribe. Please try again later.' }
  } catch (err) {
    console.error('Mailchimp fetch error:', err)
    return { ok: false, message: 'Network error. Please try again later.' }
  }
}
