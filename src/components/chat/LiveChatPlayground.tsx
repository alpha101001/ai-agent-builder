import { useState, useEffect, useRef } from 'react'
import type { SavedAgent, AgentData } from '../../types'
import { useLiveChat } from '../../hooks/useLiveChat'
import { useMessageLimit } from '../../hooks/useMessageLimit'
import { FREE_PROVIDER } from '../../lib/constants'
import { ChatBubble } from './ChatBubble'
import { ChatInput } from './ChatInput'
import { AgentCapabilities } from './AgentCapabilities'
import { SuggestedPrompts } from './SuggestedPrompts'
import { PaymentModal } from './PaymentModal'
import { ComingSoonModal } from './ComingSoonModal'

// ################ Live Chat Playground ##################
// Full-screen overlay chat interface powered by real AI providers.
// Handles:
//   - Streaming token-by-token responses with animated cursor
//   - 10-message limit for OpenRouter Free tier
//   - Payment → Coming Soon modal chain
//   - Stop generation button
//   - Error display with contextual messages
//   - System prompt built from the agent's skills and layers (.md files)

interface LiveChatPlaygroundProps {
  agent: SavedAgent
  data: AgentData
  apiKey?: string
  onClose: () => void
}

export function LiveChatPlayground({ agent, data, apiKey, onClose }: LiveChatPlaygroundProps) {
  const [showCapabilities, setShowCapabilities] = useState(true)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showComingSoonModal, setShowComingSoonModal] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const chat = useLiveChat()
  const limit = useMessageLimit(agent.provider)

  const isFree = agent.provider === FREE_PROVIDER

  // Open chat on mount
  useEffect(() => {
    chat.openChat(agent, data, apiKey)
    return () => chat.closeChat()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Auto-scroll on new messages / streaming
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat.messages])

  // Show payment modal when limit reached
  useEffect(() => {
    if (limit.hasReachedLimit) {
      setShowPaymentModal(true)
    }
  }, [limit.hasReachedLimit])

  const handleSend = (text: string) => {
    if (limit.hasReachedLimit) {
      setShowPaymentModal(true)
      return
    }
    limit.incrementCount()
    chat.sendMessage(text)
  }

  const hasUserMessages = chat.messages.some(m => m.role === 'user')
  const remainingMessages = isFree ? Math.max(0, 10 - limit.userMessageCount) : null

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#030015] animate-fade-in">
      {/* Cosmic tint behind chat */}
      <div className="pointer-events-none fixed inset-0 z-0"
        style={{ background: 'radial-gradient(ellipse 80% 50% at 20% 20%, rgba(100,30,180,0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 60% at 80% 80%, rgba(0,150,200,0.08) 0%, transparent 60%)' }} />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 py-3 glass border-b border-white/[0.07]">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-lg glass text-white/50 hover:text-white/90 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            aria-label="Close chat"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <div>
            <h1 className="text-base font-semibold text-white/90">{agent.name}</h1>
            <p className="text-xs text-white/40">
              {isFree ? `Free Tier · ${remainingMessages} messages left` : `Powered by ${agent.provider}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isFree && remainingMessages !== null && (
            <div className={`px-2 py-1 rounded-full text-xs font-medium border ${
              remainingMessages <= 3
                ? 'bg-red-900/40 text-red-300 border-red-500/30'
                : 'bg-teal-900/40 text-teal-300 border-teal-500/30'
            }`}>
              {remainingMessages}/{10}
            </div>
          )}
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
          <div
            className={`w-2 h-2 rounded-full ${chat.isStreaming ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`}
            title={chat.isStreaming ? 'Generating...' : 'Ready'}
          />
        </div>
      </header>

      {/* Capabilities banner */}
      {showCapabilities && <AgentCapabilities agent={agent} data={data} />}

      {/* Error banner */}
      {chat.error && (
        <div className="relative z-10 px-4 py-2 bg-red-900/30 border-b border-red-500/25 flex items-center gap-2">
          <svg className="w-4 h-4 text-red-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-xs text-red-300 flex-1">{chat.error}</p>
        </div>
      )}

      {/* Messages */}
      <div className="relative z-10 flex-1 overflow-y-auto">
        {chat.messages.length === 0 && !chat.isStreaming && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 pb-8">
            <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center text-2xl mb-4 animate-float border border-white/[0.08]">
              🤖
            </div>
            <h3 className="text-base font-semibold text-white/80 mb-1">{agent.name} is ready</h3>
            <p className="text-sm text-white/35 max-w-xs">
              Start a conversation below. This agent is configured with your selected skills and behavioral layers.
            </p>
          </div>
        )}

        {chat.messages.map(message => {
          // Show thinking animation while waiting for first token
          const isThinking = message.isStreaming && message.role === 'assistant' && message.content === ''

          if (isThinking) {
            return (
              <div key={message.id} className="flex items-start gap-3 px-4 py-2">
                <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm glass border border-violet-500/25">
                  🤖
                </div>
                <div className="glass rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5 border border-white/[0.07]">
                  <span className="w-2 h-2 rounded-full bg-violet-400 animate-thinking-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-violet-400 animate-thinking-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-violet-400 animate-thinking-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )
          }

          return (
            <div key={message.id}>
              <ChatBubble message={message} />
              {/* Streaming cursor after content starts arriving */}
              {message.isStreaming && message.role === 'assistant' && message.content !== '' && (
                <div className="px-4 pl-16 pb-1">
                  <span className="inline-block w-1.5 h-4 bg-violet-400 rounded-sm animate-pulse" />
                </div>
              )}
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts (first message only, not streaming) */}
      <div className="relative z-10">
        {!hasUserMessages && !chat.isStreaming && (
          <SuggestedPrompts profileId={agent.profileId} onSelect={handleSend} />
        )}
      </div>

      {/* Input */}
      <div className="relative z-10">
      <ChatInput
        onSend={handleSend}
        disabled={chat.isStreaming || limit.hasReachedLimit}
        isStreaming={chat.isStreaming}
        onStop={chat.stopStreaming}
        placeholder={
          limit.hasReachedLimit
            ? 'Free message limit reached. Upgrade to continue.'
            : 'Type your message...'
        }
      />
      </div>

      {/* Modals */}
      <PaymentModal
        isOpen={showPaymentModal}
        messageCount={limit.userMessageCount}
        onPayment={() => {
          setShowPaymentModal(false)
          setShowComingSoonModal(true)
        }}
        onClose={() => setShowPaymentModal(false)}
      />

      <ComingSoonModal
        isOpen={showComingSoonModal}
        onClose={() => setShowComingSoonModal(false)}
      />
    </div>
  )
}
