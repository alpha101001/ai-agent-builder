import { ProfileCard } from './ProfileCard'
import type { AgentProfile } from '../../types'

interface ProfileCardGridProps {
  profiles: AgentProfile[]
  selectedProfileId: string
  onSelect: (id: string) => void
}

export function ProfileCardGrid({ profiles, selectedProfileId, onSelect }: ProfileCardGridProps) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-lg font-semibold text-white/90">Base Profile</h2>
        <span className="text-xs px-2 py-0.5 rounded-full glass text-white/40 border border-white/[0.08]">
          {profiles.length} available
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {profiles.map(profile => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            isSelected={selectedProfileId === profile.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  )
}
