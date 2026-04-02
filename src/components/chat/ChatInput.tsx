import { useState, type KeyboardEvent } from 'react'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled: boolean
  placeholder?: string
  isStreaming?: boolean
  onStop?: () => void
}

export function ChatInput({ onSend, disabled, placeholder = 'Type your message...', isStreaming, onStop }: ChatInputProps) {
  const [value, setValue] = useState('')

  const handleSend = () => {
    if (!value.trim() || disabled) return
    onSend(value)
    setValue('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="glass border-t border-white/[0.07] p-4">
      <div className="flex items-end gap-3">
        <textarea
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none rounded-xl px-4 py-2.5 text-sm input-dark disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Chat message input"
        />
        {isStreaming && onStop ? (
          <button
            onClick={onStop}
            className="px-4 py-2.5 btn-neon-red rounded-xl text-sm font-semibold focus:outline-none flex-shrink-0"
            aria-label="Stop generating"
          >
            ⏹ Stop
          </button>
        ) : (
          <button
            onClick={handleSend}
            disabled={disabled || !value.trim()}
            className="px-4 py-2.5 btn-neon-violet rounded-xl text-sm font-semibold focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            aria-label="Send message"
          >
            Send
          </button>
        )}
      </div>
    </div>
  )
}
