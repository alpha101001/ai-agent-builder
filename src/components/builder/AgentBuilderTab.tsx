import type { AgentData } from '@/types'
import type { useAgentBuilder } from '@/hooks/useAgentBuilder'
import { DndWrapper } from '@/components/shared/DndWrapper'
import { ProfileCardGrid } from '@/components/profile/ProfileCardGrid'
import { SkillPool } from '@/components/skills/SkillPool'
import { LayerPool } from '@/components/layers/LayerPool'
import { ProviderCardGrid } from '@/components/provider/ProviderCardGrid'
import { AgentPreview } from '@/components/builder/AgentPreview'
import { SaveAgentForm } from '@/components/builder/SaveAgentForm'

interface AgentBuilderTabProps {
  data: AgentData
  builder: ReturnType<typeof useAgentBuilder>
  onSave: () => boolean
  onUpdate: () => void
  onCreateNew: () => boolean
}

export function AgentBuilderTab({ data, builder, onSave, onUpdate, onCreateNew }: AgentBuilderTabProps) {
  return (
    <DndWrapper
      skills={data.skills}
      layers={data.layers}
      selectedSkillIds={builder.selectedSkills}
      selectedLayerIds={builder.selectedLayers}
      onSkillAdd={builder.addSkill}
      onLayerAdd={builder.addLayer}
      onSkillReorder={builder.reorderSkills}
      onLayerReorder={builder.reorderLayers}
    >
      <main className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Configuration Options */}
        <div className="lg:col-span-3 space-y-8">
          <ProfileCardGrid
            profiles={data.agentProfiles}
            selectedProfileId={builder.selectedProfile}
            onSelect={builder.setSelectedProfile}
          />

          <section>
            <h2 className="text-lg font-semibold text-white/90 mb-1">Skills</h2>
            <p className="text-sm text-white/40 mb-3">Drag to the preview panel or click to add</p>
            <SkillPool
              skills={data.skills}
              selectedSkillIds={builder.selectedSkills}
              onAdd={builder.addSkill}
            />
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white/90 mb-1">Personality Layers</h2>
            <p className="text-sm text-white/40 mb-3">Drag to the preview panel or click to add</p>
            <LayerPool
              layers={data.layers}
              selectedLayerIds={builder.selectedLayers}
              onAdd={builder.addLayer}
            />
          </section>

          <ProviderCardGrid
            selectedProvider={builder.selectedProvider}
            onSelect={builder.setSelectedProvider}
          />
        </div>

        {/* Right: Agent Preview (sticky on desktop) */}
        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-6">
            <h2 className="text-lg font-semibold text-white/90 mb-3">Agent Configuration</h2>
            <div className="glass rounded-2xl p-5 shimmer-card">
              <AgentPreview
                data={data}
                selectedProfile={builder.selectedProfile}
                selectedSkillIds={builder.selectedSkills}
                selectedLayerIds={builder.selectedLayers}
                selectedProvider={builder.selectedProvider}
                onRemoveSkill={builder.removeSkill}
                onRemoveLayer={builder.removeLayer}
              />
              <SaveAgentForm
                agentName={builder.agentName}
                onAgentNameChange={builder.setAgentName}
                onSave={onSave}
                onReset={builder.reset}
                loadedAgentId={builder.loadedAgentId}
                onUpdate={onUpdate}
                onCreateNew={onCreateNew}
              />
            </div>
          </div>
        </div>
      </main>
    </DndWrapper>
  )
}
