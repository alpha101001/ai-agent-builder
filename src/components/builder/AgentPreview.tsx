import { SelectedSkills } from '../skills/SelectedSkills'
import { SelectedLayers } from '../layers/SelectedLayers'
import { EmptyState } from '../shared/EmptyState'
import { PROFILE_ICONS, PROVIDERS } from '../../lib/constants'
import type { AgentData } from '../../types'

interface AgentPreviewProps {
  data: AgentData
  selectedProfile: string
  selectedSkillIds: string[]
  selectedLayerIds: string[]
  selectedProvider: string
  onRemoveSkill: (id: string) => void
  onRemoveLayer: (id: string) => void
}

export function AgentPreview({
  data,
  selectedProfile,
  selectedSkillIds,
  selectedLayerIds,
  selectedProvider,
  onRemoveSkill,
  onRemoveLayer,
}: AgentPreviewProps) {
  const profile = data.agentProfiles.find(p => p.id === selectedProfile)
  const providerConfig = PROVIDERS.find(p => p.name === selectedProvider)

  return (
    <div className="space-y-5">
      {/* Profile Banner */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-2">Profile</h3>
        {profile ? (
          <div className="glass-sm rounded-xl p-3 flex items-center gap-3 border border-violet-500/20">
            <span className="text-2xl">{PROFILE_ICONS[profile.id] || '🤖'}</span>
            <div>
              <span className="font-semibold text-violet-300 text-sm">{profile.name}</span>
              <p className="text-[11px] text-white/40 mt-0.5 line-clamp-1">{profile.description}</p>
            </div>
          </div>
        ) : (
          <EmptyState icon="👤" message="Select a base profile" className="py-3 glass-sm rounded-xl" />
        )}
      </div>

      {/* Skills Drop Zone */}
      <SelectedSkills
        skills={data.skills}
        selectedSkillIds={selectedSkillIds}
        onRemove={onRemoveSkill}
      />

      {/* Layers Drop Zone */}
      <SelectedLayers
        layers={data.layers}
        selectedLayerIds={selectedLayerIds}
        onRemove={onRemoveLayer}
      />

      {/* Provider */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-2">Provider</h3>
        {selectedProvider && providerConfig ? (
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 glass-sm rounded-full text-sm font-medium ${providerConfig.color} border border-white/[0.12]`}>
            <span>{providerConfig.icon}</span>
            {selectedProvider}
          </span>
        ) : (
          <span className="text-xs text-white/30">No provider selected</span>
        )}
      </div>
    </div>
  )
}
