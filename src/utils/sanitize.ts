const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g

export function sanitizeForMetadata(input: string, maxLen = 80) {
  return input
    .replace(CONTROL_CHARS, '')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, maxLen)
}


