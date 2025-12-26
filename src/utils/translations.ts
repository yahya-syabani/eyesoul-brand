/**
 * Translation utility functions for handling database content translations
 * 
 * Supports both old String format (backward compatibility) and new JSON format:
 * - String: "Sunglasses" (old format)
 * - JSON: { "en": "Sunglasses", "id": "Kacamata Hitam" } (new format)
 */

export type TranslationObject = {
  en: string
  id?: string
}

/**
 * Get translated text from content that can be either a string or translation object
 * 
 * @param content - Can be a string (old format), translation object (new format), null, or undefined
 * @param locale - The locale to retrieve ('en' or 'id')
 * @returns The translated string, or empty string if content is null/undefined
 * 
 * @example
 * // Old format (backward compatibility)
 * getTranslatedText("Sunglasses", "en") // Returns "Sunglasses"
 * 
 * // New format
 * getTranslatedText({ en: "Sunglasses", id: "Kacamata Hitam" }, "id") // Returns "Kacamata Hitam"
 * 
 * // Fallback to English if Indonesian missing
 * getTranslatedText({ en: "Sunglasses", id: "" }, "id") // Returns "Sunglasses"
 */
export function getTranslatedText(
  content: string | TranslationObject | null | undefined,
  locale: string
): string {
  // Handle null/undefined
  if (!content) return ''

  // Handle old String format (backward compatibility)
  if (typeof content === 'string') {
    return content
  }

  // Handle new JSON format
  if (typeof content === 'object' && content !== null) {
    const translation = content as TranslationObject
    
    // Try requested locale first
    if (locale === 'id' && translation.id && translation.id.trim() !== '') {
      return translation.id
    }
    
    // Fallback to English (always required)
    if (translation.en) {
      return translation.en
    }
    
    // If English is also missing, return empty string
    return ''
  }

  // Fallback for unexpected types
  return ''
}

/**
 * Check if content has a translation for the given locale
 * 
 * @param content - Content to check
 * @param locale - Locale to check for
 * @returns true if translation exists, false otherwise
 */
export function hasTranslation(
  content: string | TranslationObject | null | undefined,
  locale: string
): boolean {
  if (!content) return false
  
  if (typeof content === 'string') {
    // Old format always has content (it's the English version)
    return locale === 'en' && content.trim() !== ''
  }
  
  if (typeof content === 'object' && content !== null) {
    const translation = content as TranslationObject
    
    if (locale === 'id') {
      return !!(translation.id && translation.id.trim() !== '')
    }
    
    // English is always required
    return !!(translation.en && translation.en.trim() !== '')
  }
  
  return false
}

/**
 * Convert a string to translation object format
 * Useful for migrating old data or normalizing input
 * 
 * @param text - String to convert
 * @param existingTranslations - Optional existing translations to merge with
 * @returns Translation object with English set to text
 */
export function stringToTranslation(
  text: string,
  existingTranslations?: TranslationObject | null
): TranslationObject {
  return {
    en: text || '',
    id: existingTranslations?.id || ''
  }
}

/**
 * Validate translation object structure
 * 
 * @param translations - Translation object to validate
 * @returns true if valid, false otherwise
 */
export function isValidTranslation(translations: unknown): translations is TranslationObject {
  if (!translations || typeof translations !== 'object') {
    return false
  }
  
  const t = translations as Record<string, unknown>
  
  // English is required
  if (typeof t.en !== 'string') {
    return false
  }
  
  // Indonesian is optional, but if present must be string
  if (t.id !== undefined && typeof t.id !== 'string') {
    return false
  }
  
  return true
}

