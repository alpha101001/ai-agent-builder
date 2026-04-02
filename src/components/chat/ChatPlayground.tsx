import { useState } from 'react'
import type { ChatMessage, SavedAgent, AgentData } from '../../types'
import { ChatMessageList } from './ChatMessageList'
import { ChatInput } from './ChatInput'
import { SuggestedPrompts } from './SuggestedPrompts'
import { AgentCapabilities } from './AgentCapabilities'

// ################ Chat Playground Component ##################
// Full-screen overlay chat interface where users interact with their
// configured agent. This is the PURPOSE of the agent builder — the
// place where the agent comes alive.
//
// Features:
// - Full-screen overlay with smooth enter/exit animations
// - Agent capabilities banner showing active config
// - Auto-scrolling message list with typing indicator
// - Suggested prompts for first-time guidance
// - Responsive: works on mobile and desktop
//
// The chat playground demonstrates how every configuration choice
// affects the agent: profile sets the domain, skills produce action
// cards, layers transform response style.

interface ChatPlaygroundProps {
  agent: SavedAgent
  data: AgentData
  messages: ChatMessage[]
  isTyping: boolean
  onSendMessage: (text: string) => void
  onClose: () => void
}

export function ChatPlayground({
  agent,
  data,
  messages,
  isTyping,
  onSendMessage,
  onClose,
}: ChatPlaygroundProps) {
  const [showCapabilities, setShowCapabilities] = useState(true)
  const hasUserMessages = messages.some(m => m.role === 'user')

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#030015] animate-fade-in">
      {/* Cosmic tint */}
      <div className="pointer-events-none fixed inset-0 z-0"
        style={{ background: 'radial-gradient(ellipse 80% 50% at 20% 20%, rgba(100,30,180,0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 60% at 80% 80%, rgba(0,150,200,0.08) 0%, transparent 60%)' }} />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 py-3 glass border-b border-white/[0.07]">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-lg glass text-white/50 hover:text-white/90 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            aria-label="Close chat playground"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <div>
            <h1 className="text-base font-semibold text-white/90">{agent.name}</h1>
            <p className="text-xs text-white/40">Simulated Interaction</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCapabilities(prev => !prev)}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-all focus:outline-none ${
              showCapabilities
                ? 'bg-violet-900/40 border-violet-500/40 text-violet-300'
                : 'glass border-white/[0.1] text-white/40 hover:text-white/70'
            }`}
          >
            {showCapabilities ? 'Hide' : 'Show'} Config
          </button>
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Agent active" />
        </div>
      </header>

      {/* Capabilities banner */}
      {showCapabilities && <AgentCapabilities agent={agent} data={data} />}

      {/* Messages */}
      <div className="relative z-10 flex-1 overflow-y-auto">
        <ChatMessageList messages={messages} isTyping={isTyping} />
      </div>

      {/* Suggested prompts (only before first user message) */}
      <div className="relative z-10">
        {!hasUserMessages && !isTyping && (
          <SuggestedPrompts profileId={agent.profileId} onSelect={onSendMessage} />
        )}
      </div>

      {/* Input */}
      <div className="relative z-10">
        <ChatInput onSend={onSendMessage} disabled={isTyping} />
      </div>
    </div>
  )
}

// #################################################
