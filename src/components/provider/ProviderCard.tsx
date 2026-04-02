import { cn } from '../../lib/utils'

interface ProviderCardProps {
  name: string
  icon: string
  color: string
  glow: string
  neonBorder: string
  isSelected: boolean
  onSelect: (name: string) => void
}

export function ProviderCard({ name, icon, color, glow, neonBorder, isSelected, onSelect }: ProviderCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect(name)
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(name)}
      onKeyDown={handleKeyDown}
      aria-pressed={isSelected}
      className={cn(
        'relative rounded-2xl border-2 p-4 cursor-pointer transition-all duration-300 text-center card-3d shimmer-card',
        'focus:outline-none focus:ring-2 focus:ring-violet-500/60 focus:ring-offset-2 focus:ring-offset-transparent',
        isSelected
          ? `glass-bright ${neonBorder} ${glow}`
          : 'glass border-white/[0.08] hover:border-white/[0.18] hover:bg-white/[0.06]'
      )}
    >
      {isSelected && (
        <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-current opacity-80 animate-neon-pulse" style={{ color: 'inherit' }} />
      )}
      <div className={cn('text-2xl mb-1.5', isSelected && 'animate-float')} style={{ display: 'block' }}>
        {icon}
      </div>
      <span className={cn('font-semibold text-xs leading-tight block', isSelected ? color : 'text-white/60')}>
        {name}
      </span>
    </div>
  )
}
