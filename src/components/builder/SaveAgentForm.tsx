import { useToast } from '../shared/ToastContext'

interface SaveAgentFormProps {
  agentName: string
  onAgentNameChange: (name: string) => void
  onSave: () => boolean
  onReset: () => void
  loadedAgentId: string | null
  onUpdate: () => void
  onCreateNew: () => boolean
}

export function SaveAgentForm({
  agentName,
  onAgentNameChange,
  onSave,
  onReset,
  loadedAgentId,
  onUpdate,
  onCreateNew,
}: SaveAgentFormProps) {
  const { addToast } = useToast()

  const handleSave = () => {
    if (!agentName.trim()) {
      addToast('Please enter a name for your agent.', 'error')
      return
    }
    const success = onSave()
    if (success) {
      addToast(`Agent "${agentName}" saved successfully!`, 'success')
    }
  }

  const handleUpdate = () => {
    if (!agentName.trim()) {
      addToast('Please enter a name for your agent.', 'error')
      return
    }
    onUpdate()
  }

  const handleCreateNew = () => {
    if (!agentName.trim()) {
      addToast('Please enter a name for your agent.', 'error')
      return
    }
    onCreateNew()
  }

  return (
    <div className="border-t border-white/[0.07] pt-4 mt-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">
          {loadedAgentId ? 'Editing Agent' : 'Save Agent'}
        </h3>
        {loadedAgentId && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full glass border border-violet-500/30 text-violet-300 text-[10px] font-medium">
            ✎ Loaded
          </span>
        )}
      </div>

      {/* Input row */}
      <input
        type="text"
        placeholder="Enter agent name..."
        value={agentName}
        onChange={e => onAgentNameChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg text-sm input-dark mb-2"
        onKeyDown={e => {
          if (e.key === 'Enter') {
            loadedAgentId ? handleUpdate() : handleSave()
          }
        }}
      />

      {/* Button row */}
      {loadedAgentId ? (
        <div className="flex gap-2">
          <button
            onClick={handleUpdate}
            className="flex-1 py-2 btn-neon-violet rounded-lg text-xs font-semibold focus:outline-none"
          >
            Update
          </button>
          <button
            onClick={handleCreateNew}
            className="flex-1 py-2 btn-neon-emerald rounded-lg text-xs font-semibold focus:outline-none"
          >
            Create New
          </button>
          <button
            onClick={onReset}
            className="px-3 py-2 glass rounded-lg text-xs font-medium text-white/50 hover:text-white/80 hover:bg-white/[0.08] transition-all focus:outline-none shrink-0"
          >
            Discard
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 py-2 btn-neon-violet rounded-lg text-sm font-semibold focus:outline-none"
          >
            Save
          </button>
          <button
            onClick={onReset}
            className="px-4 py-2 glass rounded-lg text-sm font-medium text-white/50 hover:text-white/80 hover:bg-white/[0.08] transition-all focus:outline-none shrink-0"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  )
}
