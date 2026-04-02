import { useState, useCallback, useRef, useEffect } from 'react'
import type { ChatMessage, SavedAgent, AgentData } from '../types'
import { buildSystemPrompt } from '../lib/system-prompt-builder'
import { FREE_PROVIDER } from '../lib/constants'

// ################ Live Chat Hook ##################
// Manages real AI chat state with streaming support.
// Works alongside the existing useChatPlayground for simulated mode.
//
// Key design decisions:
// - AbortController per request (cancelled on close/unmount/new message)
// - Functional setState updaters to avoid stale closures during streaming
// - System prompt built once on openChat, cached for session
// - streamProviderResponse is loaded lazily to avoid circular imports

interface LiveChatState {
  isOpen: boolean
  messages: ChatMessage[]
  isStreaming: boolean
  activeAgent: SavedAgent | null
  agentData: AgentData | null
  error: string | null
}

interface UseLiveChatReturn extends LiveChatState {
  openChat: (agent: SavedAgent, data: AgentData, apiKey?: string) => Promise<void>
  sendMessage: (text: string) => Promise<void>
  closeChat: () => void
  stopStreaming: () => void
}

function makeId(): string {
  return Math.random().toString(36).slice(2, 10)
}

export function useLiveChat(): UseLiveChatReturn {
  const [state, setState] = useState<LiveChatState>({
    isOpen: false,
    messages: [],
    isStreaming: false,
    activeAgent: null,
    agentData: null,
    error: null,
  })

  const abortControllerRef = useRef<AbortController | null>(null)
  const systemPromptRef = useRef<string>('')
  const apiKeyRef = useRef<string | undefined>(undefined)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

  const stopStreaming = useCallback(() => {
    abortControllerRef.current?.abort()
    setState(prev => ({ ...prev, isStreaming: false }))
  }, [])

  const openChat = useCallback(async (
    agent: SavedAgent,
    data: AgentData,
    apiKey?: string
  ) => {
    apiKeyRef.current = apiKey

    // Build system prompt from profile + skill/layer .md files
    const systemPrompt = await buildSystemPrompt(agent, data)
    systemPromptRef.current = systemPrompt

    setState({
      isOpen: true,
      messages: [],
      isStreaming: false,
      activeAgent: agent,
      agentData: data,
      error: null,
    })
  }, [])

  const closeChat = useCallback(() => {
    abortControllerRef.current?.abort()
    abortControllerRef.current = null
    systemPromptRef.current = ''
    apiKeyRef.current = undefined
    setState({
      isOpen: false,
      messages: [],
      isStreaming: false,
      activeAgent: null,
      agentData: null,
      error: null,
    })
  }, [])

  const sendMessage = useCallback(async (text: string) => {
    setState(prev => {
      if (!prev.activeAgent || prev.isStreaming) return prev
      return prev
    })

    // Abort any in-flight request
    abortControllerRef.current?.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller

    const userMessage: ChatMessage = {
      id: makeId(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    }

    const assistantMessageId = makeId()
    const assistantPlaceholder: ChatMessage = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isStreaming: true,
    }

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage, assistantPlaceholder],
      isStreaming: true,
      error: null,
    }))

    try {
      // Lazy import to avoid circular dependency issues
      const { streamProviderResponse } = await import('../lib/provider-clients')

      const provider = state.activeAgent?.provider ?? FREE_PROVIDER

      // Build conversation history for the API (exclude streaming placeholders)
      const history = state.messages
        .filter(m => !m.isStreaming)
        .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))

      history.push({ role: 'user', content: text })

      const stream = streamProviderResponse(
        provider as Parameters<typeof streamProviderResponse>[0],
        history,
        systemPromptRef.current,
        apiKeyRef.current,
        controller.signal
      )

      for await (const chunk of stream) {
        if (controller.signal.aborted) break

        setState(prev => ({
          ...prev,
          messages: prev.messages.map(m =>
            m.id === assistantMessageId
              ? { ...m, content: m.content + chunk }
              : m
          ),
        }))
      }

      // Mark streaming complete
      setState(prev => ({
        ...prev,
        isStreaming: false,
        messages: prev.messages.map(m =>
          m.id === assistantMessageId
            ? { ...m, isStreaming: false }
            : m
        ),
      }))
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        // User aborted — just mark as done
        setState(prev => ({
          ...prev,
          isStreaming: false,
          messages: prev.messages.map(m =>
            m.id === assistantMessageId
              ? { ...m, isStreaming: false, content: m.content || '[Stopped]' }
              : m
          ),
        }))
        return
      }

      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.'
      setState(prev => ({
        ...prev,
        isStreaming: false,
        error: errorMessage,
        messages: prev.messages.map(m =>
          m.id === assistantMessageId
            ? { ...m, isStreaming: false, content: `⚠️ ${errorMessage}` }
            : m
        ),
      }))
    }
  }, [state.activeAgent, state.messages, state.isStreaming])

  return {
    ...state,
    openChat,
    sendMessage,
    closeChat,
    stopStreaming,
  }
}
