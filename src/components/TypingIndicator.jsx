import { useLanguage } from '../i18n/useLanguage'

export const TypingIndicator = () => {
  const { text } = useLanguage()

  return (
    <div className="message message--assistant" aria-label={text.assistantTyping}>
      <span className="message__avatar">S</span>
      <div className="typing-indicator" role="status">
        <span />
        <span />
        <span />
        <span className="sr-only">{text.supportTyping}</span>
      </div>
    </div>
  )
}
