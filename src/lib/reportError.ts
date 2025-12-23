export type ReportErrorMeta = Record<string, unknown>

export function reportError(error: unknown, meta?: ReportErrorMeta) {
  // Central place to hook in a real error reporting service later (Sentry, LogRocket, etc.)
  // For now we only log to console to avoid introducing vendor dependencies.
  if (meta) {
    // eslint-disable-next-line no-console
    console.error('[error]', error, meta)
    return
  }
  // eslint-disable-next-line no-console
  console.error('[error]', error)
}


