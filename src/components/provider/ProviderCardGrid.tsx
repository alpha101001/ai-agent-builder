import { ProviderCard } from './ProviderCard'
import { PROVIDERS } from '../../lib/constants'

interface ProviderCardGridProps {
  selectedProvider: string
  onSelect: (provider: string) => void
}

export function ProviderCardGrid({ selectedProvider, onSelect }: ProviderCardGridProps) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-lg font-semibold text-white/90">AI Provider</h2>
        <span className="text-xs px-2 py-0.5 rounded-full glass text-white/40 border border-white/[0.08]">
          {PROVIDERS.length} providers
        </span>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {PROVIDERS.map(provider => (
          <ProviderCard
            key={provider.name}
            name={provider.name}
            icon={provider.icon}
            color={provider.color}
            glow={provider.glow}
            neonBorder={provider.neonBorder}
            isSelected={selectedProvider === provider.name}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  )
}
