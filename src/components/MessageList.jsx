import { useEffect, useRef } from 'react'

import { MessageBubble } from './MessageBubble'
import { SuggestedQuestions } from './SuggestedQuestions'
import { TypingIndicator } from './TypingIndicator'

export const MessageList = ({
  messages,
  isLoading,
  showSuggestedQuestions,
  onSuggestionSelect,
}) => {
  const endMarker = useRef(null)
  const hasStarted = messages.some((message) => message.role === 'user')

  useEffect(() => {
    endMarker.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [messages, isLoading])

  return (
    <main className="message-list" aria-live="polite" aria-busy={isLoading}>
      <div className="message-list__inner">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {showSuggestedQuestions && !hasStarted && (
          <SuggestedQuestions disabled={isLoading} onSelect={onSuggestionSelect} />
        )}
        {isLoading && <TypingIndicator />}
        <div ref={endMarker} aria-hidden="true" />
      </div>
    </main>
  )
}
