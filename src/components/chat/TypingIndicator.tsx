// ################ Typing Indicator Component ##################
// Animated three-dot indicator shown while the agent is "thinking".
// Uses staggered CSS animations for a natural pulsing effect.

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="w-8 h-8 rounded-full glass border border-violet-500/25 flex items-center justify-center text-sm flex-shrink-0">
        🤖
      </div>
      <div className="glass rounded-2xl rounded-bl-sm border border-white/[0.07] px-4 py-3 flex items-center gap-1.5">
        <span className="w-2 h-2 bg-violet-400 rounded-full animate-thinking-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 bg-violet-400 rounded-full animate-thinking-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 bg-violet-400 rounded-full animate-thinking-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  )
}

// #################################################
