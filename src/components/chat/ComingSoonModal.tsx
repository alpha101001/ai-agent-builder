import { useEffect } from 'react'

// ################ Coming Soon Modal ##################
// Shown when the user clicks "Upgrade Now" in the PaymentModal.
// Communicates that the payment/subscription system is under development.

interface ComingSoonModalProps {
  isOpen: boolean
  onClose: () => void
}

const SOCIAL_LINKS = [
  { label: 'Follow on X (Twitter)', href: 'https://x.com', icon: '𝕏' },
  { label: 'Follow on LinkedIn', href: 'https://linkedin.com', icon: 'in' },
]

export function ComingSoonModal({ isOpen, onClose }: ComingSoonModalProps) {
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
      className="fixed inset-0 z-80 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="coming-soon-title"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="glass-bright rounded-2xl glow-violet border border-violet-500/20 w-full max-w-sm mx-4 p-6 text-center animate-slide-up">
        {/* Animated icon */}
        <div className="w-16 h-16 rounded-2xl bg-violet-900/30 border border-violet-500/30 flex items-center justify-center text-3xl mx-auto mb-4 animate-float">
          🚧
        </div>

        <h2 id="coming-soon-title" className="text-lg font-semibold text-white/90 mb-2">
          Feature in Development
        </h2>
        <p className="text-sm text-white/45 mb-4">
          Our payment and subscription system is currently being built.
          We&apos;re working hard to bring you the best experience possible.
        </p>
        <p className="text-sm font-medium text-violet-300 mb-6">
          Follow us for updates on when it launches! 🎉
        </p>

        {/* Social links */}
        <div className="flex gap-3 justify-center mb-6">
          {SOCIAL_LINKS.map(link => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 glass border border-white/[0.1] rounded-lg text-sm text-white/60 hover:text-white/90 hover:border-violet-500/40 transition-all font-medium"
              aria-label={link.label}
            >
              <span className="font-bold">{link.icon}</span>
              {link.label.split(' on ')[1]}
            </a>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full px-4 py-2.5 btn-neon-violet rounded-lg text-sm font-medium focus:outline-none"
        >
          Got It!
        </button>
      </div>
    </div>
  )
}
