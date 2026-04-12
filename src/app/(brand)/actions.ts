'use server'

import { z } from 'zod'

export type FormState = {
  ok: boolean
  message: string
}

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(120),
  email: z.string().email('Valid email required'),
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
  if (honeypotTripped(formData.get('website')?.toString())) {
    return { ok: true, message: 'Thanks — we will be in touch shortly.' }
  }

  const parsed = contactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
    website: formData.get('website')?.toString() ?? '',
  })

  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors
    const msg = first.name?.[0] ?? first.email?.[0] ?? first.message?.[0] ?? 'Please check the form.'
    return { ok: false, message: msg }
  }

  // EP-6: Resend send. Stub succeeds locally.
  void parsed.data
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
