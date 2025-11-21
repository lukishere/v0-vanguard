// Cookie management utilities

export type CookieCategory = 'necessary' | 'analytics' | 'functional' | 'marketing'

export interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  functional: boolean
  marketing: boolean
}

export const COOKIE_CONSENT_KEY = 'vanguard-cookie-consent'
export const COOKIE_PREFERENCES_KEY = 'vanguard-cookie-preferences'

// Necessary cookies are always enabled
const DEFAULT_PREFERENCES: CookiePreferences = {
  necessary: true,
  analytics: false,
  functional: false,
  marketing: false,
}

export function getCookiePreferences(): CookiePreferences | null {
  if (typeof window === 'undefined') return null

  try {
    const stored = localStorage.getItem(COOKIE_PREFERENCES_KEY)
    if (!stored) return null

    const preferences = JSON.parse(stored) as CookiePreferences
    // Ensure necessary cookies are always enabled
    preferences.necessary = true
    return preferences
  } catch {
    return null
  }
}

export function saveCookiePreferences(preferences: CookiePreferences): void {
  if (typeof window === 'undefined') return

  try {
    // Ensure necessary cookies are always enabled
    preferences.necessary = true
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(preferences))
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true')

    // Apply cookie preferences
    applyCookiePreferences(preferences)
  } catch (error) {
    console.error('Error saving cookie preferences:', error)
  }
}

export function hasConsent(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(COOKIE_CONSENT_KEY) === 'true'
}

export function clearCookiePreferences(): void {
  if (typeof window === 'undefined') return

  localStorage.removeItem(COOKIE_CONSENT_KEY)
  localStorage.removeItem(COOKIE_PREFERENCES_KEY)

  // Clear analytics cookies if they exist
  clearAnalyticsCookies()
}

export function getDefaultPreferences(): CookiePreferences {
  return { ...DEFAULT_PREFERENCES }
}

function applyCookiePreferences(preferences: CookiePreferences): void {
  // Apply analytics cookies if enabled
  if (preferences.analytics) {
    // Initialize analytics (e.g., Google Analytics)
    // This would be where you initialize your analytics service
    if (typeof window !== 'undefined' && (window as any).gtag) {
      // Enable Google Analytics if available
      console.log('Analytics enabled')
    }
  } else {
    clearAnalyticsCookies()
  }

  // Apply functional cookies if enabled
  if (preferences.functional) {
    // Initialize functional features
    console.log('Functional cookies enabled')
  }

  // Apply marketing cookies if enabled
  if (preferences.marketing) {
    // Initialize marketing features
    console.log('Marketing cookies enabled')
  }
}

function clearAnalyticsCookies(): void {
  // Clear analytics cookies
  if (typeof window === 'undefined') return

  // Clear Google Analytics cookies
  const analyticsCookies = ['_ga', '_gid', '_gat', '_gat_gtag_*']
  analyticsCookies.forEach(cookieName => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
  })
}

// Cookie category descriptions
export const COOKIE_CATEGORIES = {
  necessary: {
    name: {
      en: 'Necessary Cookies',
      es: 'Cookies Necesarias',
    },
    description: {
      en: 'These cookies are essential for the website to function properly. They cannot be disabled.',
      es: 'Estas cookies son esenciales para el funcionamiento del sitio web. No se pueden desactivar.',
    },
  },
  analytics: {
    name: {
      en: 'Analytics Cookies',
      es: 'Cookies Analíticas',
    },
    description: {
      en: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.',
      es: 'Estas cookies nos ayudan a entender cómo los visitantes interactúan con nuestro sitio web recopilando y reportando información de forma anónima.',
    },
  },
  functional: {
    name: {
      en: 'Functional Cookies',
      es: 'Cookies Funcionales',
    },
    description: {
      en: 'These cookies enable enhanced functionality and personalization, such as remembering your preferences.',
      es: 'Estas cookies permiten funcionalidades mejoradas y personalización, como recordar sus preferencias.',
    },
  },
  marketing: {
    name: {
      en: 'Marketing Cookies',
      es: 'Cookies de Marketing',
    },
    description: {
      en: 'These cookies are used to deliver relevant advertisements and track campaign effectiveness.',
      es: 'Estas cookies se utilizan para mostrar anuncios relevantes y rastrear la efectividad de las campañas.',
    },
  },
} as const




