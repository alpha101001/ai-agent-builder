import { useEffect } from 'react'

// ################ Payment Modal ##################
// Shown after the user reaches the 10-message free tier limit on
// OpenRouter (Free). Explains the limit and offers an upgrade path.
// Clicking "Upgrade" triggers onPayment, which opens ComingSoonModal.

interface PaymentModalProps {
  isOpen: boolean
  messageCount: number
  onPayment: () => void
  onClose: () => void
}

export function PaymentModal({ isOpen, messageCount, onPayment, onClose }: PaymentModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-70 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="glass-bright rounded-2xl glow-amber border border-amber-500/20 w-full max-w-sm mx-4 p-6 text-center animate-slide-up">
        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-amber-900/30 border border-amber-500/30 flex items-center justify-center text-2xl mx-auto mb-4">
          🔒
        </div>

        <h2 id="payment-modal-title" className="text-lg font-semibold text-white/90 mb-2">
          You&apos;ve Used Your Free Messages
        </h2>
        <p className="text-sm text-white/50 mb-1">
          You&apos;ve sent <span className="font-semibold text-amber-300">{messageCount} messages</span> on the free tier.
        </p>
        <p className="text-sm text-white/40 mb-6">
          Upgrade your plan to continue chatting with unlimited messages, faster responses, and access to premium AI models.
        </p>

        {/* Features list */}
        <div className="glass rounded-xl p-4 mb-6 text-left space-y-2 border border-white/[0.07]">
          {[
            'Unlimited messages per session',
            'Access to GPT-4o, Claude Opus, Gemini Pro',
            'Faster response times',
            'Priority support',
          ].map(feature => (
            <div key={feature} className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-xs text-white/60">{feature}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 glass border border-white/[0.1] text-white/60 rounded-lg text-sm font-medium hover:text-white/90 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            Close
          </button>
          <button
            onClick={onPayment}
            className="flex-1 px-4 py-2.5 btn-neon-violet rounded-lg text-sm font-semibold focus:outline-none"
          >
            Upgrade Now ✨
          </button>
        </div>
      </div>
    </div>
  )
}
