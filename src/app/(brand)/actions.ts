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

  // EP-6: Mailchimp / Resend Audiences. Stub succeeds.
  void parsed.data.email
  return { ok: true, message: 'You are subscribed.' }
}
