import { createHash } from 'node:crypto'

const CMS_URL = (process.env.NEXT_PUBLIC_CMS_URL ?? 'http://localhost:3001').replace(/\/$/, '')

export type ContactSubmissionInput = {
  name: string
  email: string
  message: string
  inquiryType?: string
  preferredDate?: string
  honeypotTriggered: boolean
  ip: string
  userAgent: string
  submissionStatus?: 'new' | 'in_progress' | 'resolved' | 'spam'
}

function hashIp(rawIp: string): string {
  if (!rawIp.trim()) return ''
  return createHash('sha256').update(rawIp).digest('hex')
}

export function normalizeRequesterIp(ip: string): string {
  const first = ip.split(',')[0]?.trim() ?? ''
  return first
}

export async function createContactSubmission(input: ContactSubmissionInput): Promise<void> {
  const res = await fetch(`${CMS_URL}/api/contact-submissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    cache: 'no-store',
    body: JSON.stringify({
      name: input.name,
      email: input.email,
      message: input.message,
      inquiryType: input.inquiryType,
      preferredDate: input.preferredDate,
      honeypotTriggered: input.honeypotTriggered,
      ipHash: hashIp(input.ip),
      userAgent: input.userAgent,
      submissionStatus: input.submissionStatus ?? 'new',
    }),
  })

  if (!res.ok) {
    throw new Error(`CMS create failed [${res.status}] POST /api/contact-submissions`)
  }
}
