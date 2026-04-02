import { GoogleAuthButton } from '../auth/GoogleAuthButton'
import type { GoogleUser } from '../../hooks/useGoogleAuth'

interface AppHeaderProps {
  sessionTime: number
  googleUser: GoogleUser | null
  isGoogleLoading: boolean
  isGoogleReady: boolean
  onGoogleSignIn: () => void
  onGoogleSignOut: () => void
}

export function AppHeader({
  sessionTime,
  googleUser,
  isGoogleLoading,
  isGoogleReady,
  onGoogleSignIn,
  onGoogleSignOut,
}: AppHeaderProps) {
  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <header className="mb-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          {/* Eyebrow label */}
          <p className="text-xs font-semibold tracking-widest uppercase text-violet-400/80 mb-2 animate-fade-in">
            ✦ Next-Gen AI Agent Studio
          </p>

          {/* Main heading with animated gradient */}
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight animate-gradient-text leading-tight">
            AI Agent Builder
          </h1>

          {/* Subtitle */}
          <p className="text-white/45 mt-2 text-sm sm:text-base font-light">
            Compose, configure and deploy intelligent agents with real AI providers
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {/* Google auth button */}
          <GoogleAuthButton
            user={googleUser}
            isLoading={isGoogleLoading}
            isReady={isGoogleReady}
            onSignIn={onGoogleSignIn}
            onSignOut={onGoogleSignOut}
          />

          {/* Session timer glass pill */}
          <span className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm font-medium text-white/70">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-400" />
            </span>
            Session {formatTime(sessionTime)}
          </span>
        </div>
      </div>

      {/* Decorative divider */}
      <div className="mt-6 section-divider" />
    </header>
  )
}
