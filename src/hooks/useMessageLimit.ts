import { useState, useCallback } from 'react'
import { FREE_MESSAGE_LIMIT, FREE_PROVIDER } from '../lib/constants'
import type { Provider } from '../types'

// ################ Message Limit Hook ##################
// Tracks the user's message count for the OpenRouter Free provider.
// After FREE_MESSAGE_LIMIT messages, hasReachedLimit becomes true,
// which triggers the PaymentModal in LiveChatPlayground.
//
// Count lives in component state (resets automatically when chat closes).
// Only active for the FREE_PROVIDER — other providers are unlimited.

interface UseMessageLimitReturn {
  userMessageCount: number
  hasReachedLimit: boolean
  incrementCount: () => void
  resetCount: () => void
}

export function useMessageLimit(provider: Provider | string): UseMessageLimitReturn {
  const [userMessageCount, setUserMessageCount] = useState(0)

  const isFreeProvider = provider === FREE_PROVIDER

  const incrementCount = useCallback(() => {
    if (!isFreeProvider) return
    setUserMessageCount(prev => prev + 1)
  }, [isFreeProvider])

  const resetCount = useCallback(() => {
    setUserMessageCount(0)
  }, [])

  return {
    userMessageCount,
    hasReachedLimit: isFreeProvider && userMessageCount >= FREE_MESSAGE_LIMIT,
    incrementCount,
    resetCount,
  }
}
