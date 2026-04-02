import type { AgentData, SavedAgent } from '../../types'
import { SKILL_CATEGORY_COLORS, LAYER_TYPE_COLORS, PROVIDERS } from '../../lib/constants'

// ################ Agent Capabilities Panel ##################
// Collapsible sidebar/header section in the chat playground that
// shows what the active agent is configured with: profile, skills,
// layers, and provider. Helps the user understand why the agent
// responds the way it does.

interface AgentCapabilitiesProps {
  agent: SavedAgent
  data: AgentData
}

export function AgentCapabilities({ agent, data }: AgentCapabilitiesProps) {
  const profile = data.agentProfiles.find(p => p.id === agent.profileId)
  const skills = data.skills.filter(s => agent.skillIds.includes(s.id))
  const layers = data.layers.filter(l => agent.layerIds.includes(l.id))
  const provider = PROVIDERS.find(p => p.name === agent.provider)

  return (
    <div className="relative z-10 glass border-b border-white/[0.07] px-4 py-2.5">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {/* Profile */}
        {profile && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 glass border border-white/[0.1] rounded-full font-medium text-white/80">
            🤖 {profile.name}
          </span>
        )}

        {/* Provider */}
        {provider && (
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-medium border ${provider.bgColor} ${provider.color}`}>
            {provider.icon} {provider.name}
          </span>
        )}

        {/* Skills */}
        {skills.map(skill => {
          const colors = SKILL_CATEGORY_COLORS[skill.category]
          return (
            <span
              key={skill.id}
              className={`inline-flex items-center px-2 py-1 rounded-full ${colors.badge}`}
              title={skill.description}
            >
              {skill.name}
            </span>
          )
        })}

        {/* Layers */}
        {layers.map(layer => {
          const colors = LAYER_TYPE_COLORS[layer.type]
          return (
            <span
              key={layer.id}
              className={`inline-flex items-center px-2 py-1 rounded-full ${colors.badge}`}
              title={layer.description}
            >
              {layer.name}
            </span>
          )
        })}
      </div>
    </div>
  )
}

// #################################################
