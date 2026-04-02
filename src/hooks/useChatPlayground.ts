import { useState, useCallback, useRef, useEffect } from 'react'
import type { ChatMessage, SavedAgent, AgentData } from '../types'
import { generateResponse, generateGreeting } from '../lib/simulation-engine'

// ################ useChatPlayground Hook ##################
// Manages the chat playground state: message history, typing indicator,
// and agent lifecycle. Connects the simulation engine to the UI.
//
// Flow:
// 1. openChat(agent) — loads the agent, generates greeting message
// 2. sendMessage(text) — adds user message, triggers simulated response
// 3. closeChat() — clears state, returns to builder view
//
// The typing delay is randomized (800–1500ms) to feel natural.
// Messages persist only for the current session (not localStorage).

export function useChatPlayground() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [activeAgent, setActiveAgent] = useState<SavedAgent | null>(null)
  const [agentData, setAgentData] = useState<AgentData | null>(null)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  const openChat = useCallback((agent: SavedAgent, data: AgentData) => {
    setActiveAgent(agent)
    setAgentData(data)

    const greeting = generateGreeting(agent.profileId)
    const greetingMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: greeting,
      timestamp: Date.now(),
      skillCards: [],
    }
    setMessages([greetingMessage])
    setIsTyping(false)
  }, [])

  const sendMessage = useCallback((text: string) => {
    if (!activeAgent || !text.trim()) return

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text.trim(),
      timestamp: Date.now(),
    }

    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)

    const delay = 800 + Math.random() * 700

    typingTimeoutRef.current = setTimeout(() => {
      const { text: responseText, skillCards } = generateResponse({
        userMessage: text,
        profileId: activeAgent.profileId,
        skillIds: activeAgent.skillIds,
        layerIds: activeAgent.layerIds,
      })

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: responseText,
        timestamp: Date.now(),
        skillCards: skillCards.length > 0 ? skillCards : undefined,
      }

      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
    }, delay)
  }, [activeAgent])

  const closeChat = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    setActiveAgent(null)
    setAgentData(null)
    setMessages([])
    setIsTyping(false)
  }, [])

  return {
    messages,
    isTyping,
    activeAgent,
    agentData,
    isOpen: activeAgent !== null,
    openChat,
    sendMessage,
    closeChat,
  }
}

// #################################################
