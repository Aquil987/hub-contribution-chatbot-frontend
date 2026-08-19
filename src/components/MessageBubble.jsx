import { useLanguage } from '../i18n/useLanguage'

export const MessageBubble = ({ message }) => {
  const { text } = useLanguage()
  const messageLabel = message.role === 'assistant' ? text.assistantMessage : text.userMessage
  const content = message.isWelcome ? text.welcome : message.content

  return (
    <article className={`message message--${message.role}`} aria-label={messageLabel}>
      {message.role === 'assistant' && <span className="message__avatar">S</span>}
      <div className="message__content">
        <p>{content}</p>
        {message.escalationRequired && <span className="message__note">{text.followUp}</span>}
      </div>
    </article>
  )
}
