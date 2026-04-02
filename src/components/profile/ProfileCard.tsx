import { cn } from '../../lib/utils'
import { PROFILE_ICONS, PROFILE_COLORS } from '../../lib/constants'
import type { AgentProfile } from '../../types'

interface ProfileCardProps {
  profile: AgentProfile
  isSelected: boolean
  onSelect: (id: string) => void
}

const DEFAULT_COLORS = { color: 'text-violet-300', glow: 'glow-violet', neonBorder: 'border-neon-violet' }

export function ProfileCard({ profile, isSelected, onSelect }: ProfileCardProps) {
  const colors = PROFILE_COLORS[profile.id] ?? DEFAULT_COLORS

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect(profile.id)
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(profile.id)}
      onKeyDown={handleKeyDown}
      aria-pressed={isSelected}
      className={cn(
        'relative rounded-2xl p-4 cursor-pointer transition-all duration-300 shimmer-card card-3d border-2',
        'focus:outline-none focus:ring-2 focus:ring-violet-500/60 focus:ring-offset-2 focus:ring-offset-transparent',
        isSelected
          ? `glass-bright ${colors.neonBorder} ${colors.glow}`
          : 'glass border-white/[0.07] hover:border-white/[0.18] hover:bg-white/[0.07]'
      )}
    >
      {/* Selected indicator dot — inherits profile color */}
      {isSelected && (
        <span className={cn(
          'absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-current animate-neon-pulse',
          colors.color
        )} />
      )}

      <div className="text-2xl mb-2 animate-float" style={{ display: 'inline-block' }}>
        {PROFILE_ICONS[profile.id] || '🤖'}
      </div>
      <h3 className={cn(
        'font-semibold text-sm mb-1 transition-colors',
        isSelected ? colors.color : 'text-white/80'
      )}>
        {profile.name}
      </h3>
      <p className="text-[11px] text-white/35 line-clamp-2 leading-relaxed">
        {profile.description}
      </p>
    </div>
  )
}
