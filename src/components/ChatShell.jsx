import { appConfig } from '../config/env'
import { useChat } from '../hooks/useChat'
import { useLanguage } from '../i18n/useLanguage'
import { ChatComposer } from './ChatComposer'
import { ChatHeader } from './ChatHeader'
import { ErrorBanner } from './ErrorBanner'
import { MessageList } from './MessageList'

export const ChatShell = ({ onClose }) => {
  const { text } = useLanguage()
  const {
    messages,
    status,
    error,
    dismissError,
    sendMessage,
    startNewConversation,
  } = useChat()
  const isLoading = status === 'loading'

  return (
    <section className="chat-shell" aria-label={text.chatLabel}>
      <ChatHeader onClose={onClose} />
      <MessageList
        messages={messages}
        isLoading={isLoading}
        showSuggestedQuestions={appConfig.showSuggestedQuestions}
        onSuggestionSelect={sendMessage}
      />
      <footer className="chat-footer">
        {error && <ErrorBanner message={error} onDismiss={dismissError} />}
        <ChatComposer disabled={isLoading} onSend={sendMessage} />
        <p className="chat-footer__notice">
          {text.notice}
        </p>
        <button
          className="new-conversation"
          type="button"
          onClick={startNewConversation}
          disabled={isLoading}
        >
          {text.newConversation}
        </button>
      </footer>
    </section>
  )
}
