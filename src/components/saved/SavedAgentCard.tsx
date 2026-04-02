import type { SavedAgent, AgentData } from '../../types'
import { PROFILE_ICONS } from '../../lib/constants'

interface SavedAgentCardProps {
  agent: SavedAgent
  data: AgentData
  onLoad: (agent: SavedAgent) => void
  onDelete: (id: string) => void
  onChat: (agent: SavedAgent) => void
  isRecentlySaved?: boolean
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function SavedAgentCard({ agent, data, onLoad, onDelete, onChat, isRecentlySaved }: SavedAgentCardProps) {
  const profile = data.agentProfiles.find(p => p.id === agent.profileId)

  return (
    <div className={`glass rounded-2xl p-4 shimmer-card card-3d border border-white/[0.07] hover:border-violet-500/30 transition-all duration-300 group flex flex-col h-full${isRecentlySaved ? ' animate-card-highlight' : ''}`}>
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl glass-sm flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform duration-300">
          {profile ? PROFILE_ICONS[profile.id] || '🤖' : '🤖'}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white/90 truncate text-sm">{agent.name}</h3>
          <p className="text-xs text-white/40 mt-0.5">
            {profile?.name || 'No profile'}
          </p>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className="inline-flex items-center px-2 py-0.5 bg-blue-900/40 text-blue-300 rounded-full text-[10px] font-medium border border-blue-500/25">
          ⚡ {agent.skillIds.length} skills
        </span>
        <span className="inline-flex items-center px-2 py-0.5 bg-violet-900/40 text-violet-300 rounded-full text-[10px] font-medium border border-violet-500/25">
          🧠 {agent.layerIds.length} layers
        </span>
        {agent.provider && (
          <span className="inline-flex items-center px-2 py-0.5 bg-emerald-900/40 text-emerald-300 rounded-full text-[10px] font-medium border border-emerald-500/25">
            {agent.provider}
          </span>
        )}
      </div>

      {/* Date — grows to fill space, keeping actions pinned to bottom */}
      <div className="flex-1">
        {agent.createdAt && (
          <p className="text-[10px] text-white/25">{formatDate(agent.createdAt)}</p>
        )}
      </div>

      {/* Actions — always at the bottom, equal-height buttons */}
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => onChat(agent)}
          className="flex-1 h-8 btn-neon-emerald rounded-lg text-xs font-semibold focus:outline-none"
        >
          Chat
        </button>
        <button
          onClick={() => onLoad(agent)}
          className="flex-1 h-8 btn-neon-violet rounded-lg text-xs font-semibold focus:outline-none"
        >
          Load
        </button>
        <button
          onClick={() => onDelete(agent.id)}
          className="w-8 h-8 btn-neon-red rounded-lg text-xs font-semibold focus:outline-none shrink-0"
          aria-label={`Delete ${agent.name}`}
        >
          ✕
        </button>
      </div>
    </div>
  )
}
