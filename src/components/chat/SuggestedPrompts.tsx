import { SUGGESTED_PROMPTS } from '../../lib/response-templates'

// ################ Suggested Prompts Component ##################
// Displays profile-specific conversation starters as clickable chips.
// Shown at the bottom of the chat when the user hasn't sent a message yet,
// giving them quick ways to explore the agent's capabilities.

interface SuggestedPromptsProps {
  profileId: string
  onSelect: (prompt: string) => void
}

export function SuggestedPrompts({ profileId, onSelect }: SuggestedPromptsProps) {
  const prompts = SUGGESTED_PROMPTS[profileId]
  if (!prompts || prompts.length === 0) return null

  return (
    <div className="px-4 pb-3">
      <p className="text-xs text-white/30 mb-2">Try asking:</p>
      <div className="flex flex-wrap gap-2">
        {prompts.map(prompt => (
          <button
            key={prompt}
            onClick={() => onSelect(prompt)}
            className="px-3 py-1.5 text-xs glass border border-white/[0.1] rounded-full text-white/60 hover:text-white/90 hover:border-violet-500/40 transition-all focus:outline-none focus:ring-2 focus:ring-violet-500/50"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  )
}

// #################################################
