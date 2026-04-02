import type { ChatMessage } from '../../types'
import { SkillActionCard } from './SkillActionCard'

interface ChatBubbleProps {
  message: ChatMessage
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex items-start gap-3 px-4 py-2 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm border ${
          isUser
            ? 'glass border-violet-500/30'
            : 'glass border-white/[0.1]'
        }`}
      >
        {isUser ? '👤' : '🤖'}
      </div>

      {/* Message content */}
      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? 'bg-violet-600/70 text-white/95 rounded-br-sm border border-violet-500/30'
              : 'glass text-white/85 rounded-bl-sm border border-white/[0.07]'
          }`}
        >
          {message.content}
        </div>

        {/* Skill action cards (assistant only) */}
        {message.skillCards && message.skillCards.length > 0 && (
          <div className="mt-2 w-full space-y-2">
            {message.skillCards.map(card => (
              <SkillActionCard key={card.skillId} card={card} />
            ))}
          </div>
        )}

        {/* Timestamp */}
        <span className="text-[10px] text-white/25 mt-1 px-1">
          {new Date(message.timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  )
}
