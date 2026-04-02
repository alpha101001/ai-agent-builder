import { useState, useMemo } from 'react'
import { SavedAgentCard } from './SavedAgentCard'
import { useToast } from '../shared/ToastContext'
import { PROFILE_ICONS } from '../../lib/constants'
import type { SavedAgent, AgentData } from '../../types'

interface DriveSync {
  isSignedIn: boolean
  isSyncing: boolean
  lastSynced: number | null
  onSyncToDrive: () => Promise<void>
  onLoadFromDrive: () => Promise<void>
}

interface SavedAgentsListProps {
  agents: SavedAgent[]
  data: AgentData
  onLoad: (agent: SavedAgent) => void
  onDelete: (id: string) => void
  onClearAll: () => void
  onChat: (agent: SavedAgent) => void
  driveSync?: DriveSync
  recentlySavedId?: string | null
}

function formatLastSynced(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  return `${Math.floor(diff / 3600)}h ago`
}

export function SavedAgentsList({
  agents,
  data,
  onLoad,
  onDelete,
  onClearAll,
  onChat,
  driveSync,
  recentlySavedId,
}: SavedAgentsListProps) {
  const { addToast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeProfileFilter, setActiveProfileFilter] = useState<string | null>(null)

  const handleClearAll = () => {
    onClearAll()
    setSearchQuery('')
    setActiveProfileFilter(null)
    addToast('All saved agents cleared.', 'info')
  }

  const handleDelete = (id: string) => {
    const agent = agents.find(a => a.id === id)
    onDelete(id)
    addToast(`Agent "${agent?.name}" deleted.`, 'info')
  }

  // Unique profiles present in the saved agents list
  const profileOptions = useMemo(() => {
    const ids = [...new Set(agents.map(a => a.profileId).filter(Boolean))]
    return ids
      .map(id => data.agentProfiles.find(p => p.id === id))
      .filter((p): p is NonNullable<typeof p> => !!p)
  }, [agents, data.agentProfiles])

  // Filtered agents based on search + profile filter
  const filteredAgents = useMemo(() => {
    const q = searchQuery.toLowerCase()
    return agents.filter(agent => {
      const profile = data.agentProfiles.find(p => p.id === agent.profileId)
      const matchesSearch =
        !q ||
        agent.name.toLowerCase().includes(q) ||
        (profile?.name.toLowerCase().includes(q) ?? false)
      const matchesProfile = !activeProfileFilter || agent.profileId === activeProfileFilter
      return matchesSearch && matchesProfile
    })
  }, [agents, searchQuery, activeProfileFilter, data.agentProfiles])

  const hasAgents = agents.length > 0
  const isFiltering = !!searchQuery || !!activeProfileFilter

  // Hide entire section when no agents AND not signed in (Drive sync unavailable)
  if (agents.length === 0 && !driveSync?.isSignedIn) return null

  return (
    <section data-section="saved-agents">

      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-white/90">Saved Agents</h2>
          {hasAgents && (
            <span className="px-2 py-0.5 rounded-full glass text-violet-300 text-xs font-medium border border-violet-500/25">
              {isFiltering ? `${filteredAgents.length} / ${agents.length}` : agents.length}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Drive sync controls — only when signed in */}
          {driveSync?.isSignedIn && (
            <>
              {driveSync.lastSynced && (
                <span className="text-[10px] text-white/30 hidden sm:inline">
                  Synced {formatLastSynced(driveSync.lastSynced)}
                </span>
              )}

              <button
                onClick={driveSync.onLoadFromDrive}
                disabled={driveSync.isSyncing}
                className="flex items-center gap-1.5 px-3 py-1.5 glass rounded-lg text-xs font-medium text-white/50 hover:text-cyan-300 border border-white/[0.07] hover:border-cyan-500/30 transition-all focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {driveSync.isSyncing ? (
                  <span className="w-3 h-3 rounded-full border border-white/20 border-t-cyan-400 animate-spin" />
                ) : (
                  <span>↓</span>
                )}
                Load from Drive
              </button>

              <button
                onClick={driveSync.onSyncToDrive}
                disabled={driveSync.isSyncing || agents.length === 0}
                className="flex items-center gap-1.5 px-3 py-1.5 glass rounded-lg text-xs font-medium text-white/50 hover:text-violet-300 border border-white/[0.07] hover:border-violet-500/30 transition-all focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {driveSync.isSyncing ? (
                  <span className="w-3 h-3 rounded-full border border-white/20 border-t-violet-400 animate-spin" />
                ) : (
                  <span>↑</span>
                )}
                Sync to Drive
              </button>
            </>
          )}

          {hasAgents && (
            <button
              onClick={handleClearAll}
              className="px-4 py-1.5 btn-neon-red rounded-lg text-xs font-semibold focus:outline-none"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Search + Profile filter — only shown when there are agents */}
      {hasAgents && (
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          {/* Search input */}
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm pointer-events-none">
              ⌕
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name or profile…"
              className="w-full pl-8 pr-8 py-2 rounded-xl input-dark text-sm focus:outline-none focus:ring-1 focus:ring-violet-500/40"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors text-xs"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Profile filter pills — only shown when multiple profiles present */}
          {profileOptions.length > 1 && (
            <div className="flex flex-wrap gap-1.5 items-center">
              {profileOptions.map(profile => (
                <button
                  key={profile.id}
                  onClick={() =>
                    setActiveProfileFilter(prev => (prev === profile.id ? null : profile.id))
                  }
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all focus:outline-none border ${
                    activeProfileFilter === profile.id
                      ? 'bg-violet-600/30 text-violet-200 border-violet-500/50'
                      : 'glass text-white/40 border-white/[0.07] hover:text-white/60 hover:border-violet-500/25'
                  }`}
                >
                  <span>{PROFILE_ICONS[profile.id] || '🤖'}</span>
                  <span className="hidden sm:inline">{profile.name}</span>
                </button>
              ))}
              {activeProfileFilter && (
                <button
                  onClick={() => setActiveProfileFilter(null)}
                  className="text-[10px] text-white/30 hover:text-white/50 transition-colors px-1"
                >
                  Clear
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Empty state: signed in but no local agents yet */}
      {!hasAgents && driveSync?.isSignedIn && (
        <div className="glass rounded-2xl p-8 text-center border border-white/[0.06]">
          <p className="text-3xl mb-3">☁️</p>
          <p className="text-sm font-medium text-white/60 mb-1">No saved agents yet</p>
          <p className="text-xs text-white/30">
            Use <span className="text-cyan-400">↓ Load from Drive</span> to restore your agents, or build and save a new one above.
          </p>
        </div>
      )}

      {/* No search results */}
      {hasAgents && filteredAgents.length === 0 && (
        <div className="glass rounded-2xl p-8 text-center border border-white/[0.06]">
          <p className="text-2xl mb-2">🔍</p>
          <p className="text-sm text-white/50">
            No agents match <span className="text-white/70">"{searchQuery}"</span>
          </p>
          <button
            onClick={() => { setSearchQuery(''); setActiveProfileFilter(null) }}
            className="mt-3 text-xs text-violet-400 hover:text-violet-300 transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Agent grid */}
      {filteredAgents.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAgents.map(agent => (
            <SavedAgentCard
              key={agent.id}
              agent={agent}
              data={data}
              onLoad={onLoad}
              onDelete={handleDelete}
              onChat={onChat}
              isRecentlySaved={recentlySavedId === agent.id}
            />
          ))}
        </div>
      )}
    </section>
  )
}
