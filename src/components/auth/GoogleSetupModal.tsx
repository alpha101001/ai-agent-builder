import { useState } from 'react'

// ################ GoogleSetupModal ##################
// Shown when VITE_USE_ENV_CREDENTIALS=false and the user has not
// yet provided their own Google OAuth Client ID.
// On submit the Client ID is persisted to localStorage so this
// modal is only shown once per browser session.

interface GoogleSetupModalProps {
  isOpen: boolean
  onConnect: (clientId: string) => void
  onSkip: () => void
}

export const STORED_CLIENT_ID_KEY = 'googleClientId'

export function GoogleSetupModal({ isOpen, onConnect, onSkip }: GoogleSetupModalProps) {
  const [clientId, setClientId] = useState('')
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleConnect = () => {
    const trimmed = clientId.trim()
    if (!trimmed) {
      setError('Please enter your Google Client ID.')
      return
    }
    if (!trimmed.endsWith('.apps.googleusercontent.com')) {
      setError('Client ID should end with .apps.googleusercontent.com')
      return
    }
    localStorage.setItem(STORED_CLIENT_ID_KEY, trimmed)
    onConnect(trimmed)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onSkip} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md glass-bright rounded-2xl glow-violet border border-violet-500/20 p-6 animate-fade-in">
        {/* Icon */}
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-violet-900/30 border border-violet-500/30 mx-auto mb-5">
          <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none">
            <path d="M22 12.1C22 6.5 17.5 2 12 2S2 6.5 2 12c0 5 3.7 9.1 8.4 9.9v-7H7.9V12h2.5v-2.2c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7C18.3 21.1 22 17 22 12.1z" fill="#ffffff" fillOpacity="0.7" />
          </svg>
        </div>

        <h2 className="text-lg font-bold text-white/90 text-center mb-1">Connect Google Drive</h2>
        <p className="text-sm text-white/45 text-center mb-5">
          Sync your saved agents across devices. Enter your Google OAuth Client ID to get started.
        </p>

        {/* Instructions */}
        <div className="glass rounded-xl border border-white/[0.07] p-3 mb-4 text-xs text-white/50 space-y-1">
          <p className="text-white/70 font-medium mb-1.5">How to get a Client ID:</p>
          <p>1. Go to <span className="text-violet-300">console.cloud.google.com</span></p>
          <p>2. Create project → enable <span className="text-violet-300">Google Drive API</span></p>
          <p>3. Credentials → Create → <span className="text-violet-300">OAuth 2.0 Client ID</span></p>
          <p>4. Type: <span className="text-violet-300">Web application</span></p>
          <p>5. Add your origin to Authorized JavaScript origins</p>
        </div>

        <input
          type="text"
          placeholder="123456789-xxx.apps.googleusercontent.com"
          value={clientId}
          onChange={e => {
            setClientId(e.target.value)
            setError('')
          }}
          onKeyDown={e => e.key === 'Enter' && handleConnect()}
          className="w-full px-3 py-2.5 rounded-lg text-sm input-dark mb-2 font-mono"
        />

        {error && (
          <p className="text-red-400 text-xs mb-3">{error}</p>
        )}

        <div className="flex gap-2 mt-1">
          <button
            onClick={handleConnect}
            className="flex-1 py-2.5 btn-neon-violet rounded-xl text-sm font-semibold focus:outline-none"
          >
            Connect Drive
          </button>
          <button
            onClick={onSkip}
            className="px-4 py-2.5 glass rounded-xl text-sm font-medium text-white/40 hover:text-white/70 transition-colors focus:outline-none shrink-0"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  )
}
