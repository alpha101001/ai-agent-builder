import { useState, useEffect, useCallback, useRef } from 'react'

// ################ useGoogleAuth Hook ##################
// Loads Google Identity Services (GIS) dynamically and exposes
// a token-client-based OAuth flow. Access tokens are kept only in
// React state (never localStorage) to prevent token leakage.
//
// Required scopes:
//   openid / email / profile  → user identity
//   drive.appdata             → private app-data folder in Drive
//
// Usage:
//   const { user, signIn, signOut, accessToken, isReady } = useGoogleAuth(clientId)

export interface GoogleUser {
  email: string
  name: string
  picture: string
}

interface TokenClient {
  requestAccessToken(options?: { prompt?: string }): void
}

interface GisOAuth2 {
  initTokenClient(config: {
    client_id: string
    scope: string
    callback: (response: { access_token?: string; error?: string }) => void
    error_callback?: (error: { type: string }) => void
  }): TokenClient
  revoke(token: string, callback: () => void): void
}

declare global {
  interface Window {
    google: {
      accounts: {
        oauth2: GisOAuth2
      }
    }
  }
}

const SCOPES = [
  'openid',
  'email',
  'profile',
  'https://www.googleapis.com/auth/drive.appdata',
].join(' ')

export function useGoogleAuth(clientId: string) {
  const [user, setUser] = useState<GoogleUser | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const tokenClientRef = useRef<TokenClient | null>(null)

  // Load GIS script once when clientId is available
  useEffect(() => {
    if (!clientId) return

    const init = () => {
      if (!window.google?.accounts?.oauth2) return

      tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: SCOPES,
        callback: async (response) => {
          if (response.error || !response.access_token) {
            setIsLoading(false)
            return
          }
          setAccessToken(response.access_token)
          try {
            const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${response.access_token}` },
            })
            const info = await res.json() as { email: string; name: string; picture: string }
            setUser({ email: info.email, name: info.name, picture: info.picture })
          } catch {
            // User info unavailable — token still usable for Drive
          } finally {
            setIsLoading(false)
          }
        },
        error_callback: () => {
          setIsLoading(false)
        },
      })

      setIsReady(true)
    }

    // GIS already loaded (e.g. script tag in HTML, or second init)
    if (window.google?.accounts?.oauth2) {
      init()
      return
    }

    // Dynamically load GIS script
    const existing = document.querySelector('script[src*="accounts.google.com/gsi/client"]')
    if (existing) {
      existing.addEventListener('load', init)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = init
    document.head.appendChild(script)
  }, [clientId])

  const signIn = useCallback(() => {
    if (!tokenClientRef.current) return
    setIsLoading(true)
    // Empty string prompt = skip consent screen if already granted
    tokenClientRef.current.requestAccessToken({ prompt: '' })
  }, [])

  const signOut = useCallback(() => {
    if (accessToken && window.google?.accounts?.oauth2) {
      window.google.accounts.oauth2.revoke(accessToken, () => {})
    }
    setUser(null)
    setAccessToken(null)
  }, [accessToken])

  return { user, accessToken, signIn, signOut, isLoading, isReady }
}

// #################################################
