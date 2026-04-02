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
// - activeAgent/messages/isStreaming tracked via refs so sendMessage has
//   zero deps (stable ref) and is never recreated during streaming chunks

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
  // Refs mirror the corresponding state fields so sendMessage can read
  // current values without listing them as deps (which would cause it to
  // be recreated on every streaming chunk).
  const activeAgentRef = useRef<SavedAgent | null>(null)
  const messagesRef = useRef<ChatMessage[]>([])
  const isStreamingRef = useRef(false)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

  const stopStreaming = useCallback(() => {
    abortControllerRef.current?.abort()
    isStreamingRef.current = false
    setState(prev => ({ ...prev, isStreaming: false }))
  }, [])

  const openChat = useCallback(async (
    agent: SavedAgent,
    data: AgentData,
    apiKey?: string
  ) => {
    apiKeyRef.current = apiKey
    activeAgentRef.current = agent
    messagesRef.current = []
    isStreamingRef.current = false

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
    activeAgentRef.current = null
    messagesRef.current = []
    isStreamingRef.current = false
    setState({
      isOpen: false,
      messages: [],
      isStreaming: false,
      activeAgent: null,
      agentData: null,
      error: null,
    })
  }, [])

  // sendMessage has no state deps — reads everything from refs.
  // This keeps the callback reference stable across streaming chunks,
  // preventing unnecessary child re-renders during a long response.
  const sendMessage = useCallback(async (text: string) => {
    if (!activeAgentRef.current || isStreamingRef.current) return

    // Abort any in-flight request
    abortControllerRef.current?.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller
    isStreamingRef.current = true

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

    // Keep ref in sync before state update so history is correct on next send
    messagesRef.current = [...messagesRef.current, userMessage, assistantPlaceholder]

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage, assistantPlaceholder],
      isStreaming: true,
      error: null,
    }))

    try {
      // Lazy import to avoid circular dependency issues
      const { streamProviderResponse } = await import('../lib/provider-clients')

      const provider = activeAgentRef.current.provider ?? FREE_PROVIDER

      // Build conversation history from ref (exclude streaming placeholders)
      const history = messagesRef.current
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

      // Mark streaming complete and sync messages ref
      isStreamingRef.current = false
      setState(prev => {
        const finalMessages = prev.messages.map(m =>
          m.id === assistantMessageId ? { ...m, isStreaming: false } : m
        )
        messagesRef.current = finalMessages
        return { ...prev, isStreaming: false, messages: finalMessages }
      })
    } catch (err: unknown) {
      isStreamingRef.current = false
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
  }, []) // stable ref — no state deps

  return {
    ...state,
    openChat,
    sendMessage,
    closeChat,
    stopStreaming,
  }
}
