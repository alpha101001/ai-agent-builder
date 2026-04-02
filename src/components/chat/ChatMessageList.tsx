import { useEffect, useRef } from 'react'
import type { ChatMessage } from '../../types'
import { ChatBubble } from './ChatBubble'
import { TypingIndicator } from './TypingIndicator'

// ################ Chat Message List Component ##################
// Scrollable message container that auto-scrolls to the latest message.
// Shows the typing indicator at the bottom when the agent is "thinking".

interface ChatMessageListProps {
  messages: ChatMessage[]
  isTyping: boolean
}

export function ChatMessageList({ messages, isTyping }: ChatMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  return (
    <div className="flex-1 overflow-y-auto py-4 space-y-1">
      {messages.map(message => (
        <ChatBubble key={message.id} message={message} />
      ))}
      {isTyping && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  )
}

// #################################################
