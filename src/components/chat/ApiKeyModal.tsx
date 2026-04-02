import { useState, useEffect, useRef } from 'react'
import { PROVIDER_API_KEY_URLS } from '../../lib/constants'
import type { Provider } from '../../types'

interface ApiKeyModalProps {
  provider: Provider
  isOpen: boolean
  onSubmit: (apiKey: string) => void
  onCancel: () => void
}

const PROVIDER_ICONS: Partial<Record<Provider, string>> = {
  Claude: '🧠',
  ChatGPT: '💬',
  Gemini: '✨',
  DeepSeek: '🔍',
  Kimi: '🌙',
}

export function ApiKeyModal({ provider, isOpen, onSubmit, onCancel }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const timer = setTimeout(() => inputRef.current?.focus(), 50)
    return () => clearTimeout(timer)
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    if (isOpen) window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onCancel])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = apiKey.trim()
    if (!trimmed) {
      setError('Please enter your API key.')
      return
    }
    onSubmit(trimmed)
  }

  const keyUrl = PROVIDER_API_KEY_URLS[provider]
  const icon = PROVIDER_ICONS[provider] ?? '🔑'

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-key-modal-title"
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}
    >
      <div className="glass-bright rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 animate-slide-up border border-white/[0.12] glow-violet">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl glass-sm flex items-center justify-center text-xl border border-white/[0.1]">
            {icon}
          </div>
          <div>
            <h2 id="api-key-modal-title" className="text-base font-semibold text-white/90">
              Enter your {provider} API Key
            </h2>
            <p className="text-xs text-white/40">Required to chat with this agent</p>
          </div>
          <button
            onClick={onCancel}
            className="ml-auto p-1.5 rounded-lg glass text-white/40 hover:text-white/80 transition-colors"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Info box */}
        <div className="bg-blue-900/20 border border-blue-500/25 rounded-xl p-3 mb-4 flex gap-2">
          <svg className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-xs text-blue-300/80">
            Your key is stored only for this browser session and is never saved to our servers.
            It will be cleared when you close this tab.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="api-key-input" className="block text-sm font-medium text-white/60 mb-1.5">
              API Key
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                id="api-key-input"
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={e => { setApiKey(e.target.value); setError('') }}
                placeholder="sk-..."
                className={`w-full px-3 py-2.5 pr-10 rounded-lg text-sm font-mono input-dark ${
                  error ? 'border-red-500/50 bg-red-900/10' : ''
                }`}
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="button"
                onClick={() => setShowKey(prev => !prev)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                aria-label={showKey ? 'Hide key' : 'Show key'}
              >
                {showKey ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
          </div>

          {keyUrl && (
            <p className="text-xs text-white/35">
              Don&apos;t have a key?{' '}
              <a
                href={keyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-400 hover:text-violet-300 hover:underline font-medium transition-colors"
              >
                Get one from {provider} →
              </a>
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 glass rounded-lg text-sm font-medium text-white/50 hover:text-white/80 transition-all focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 btn-neon-violet rounded-lg text-sm font-semibold focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={!apiKey.trim()}
            >
              Start Chat
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
