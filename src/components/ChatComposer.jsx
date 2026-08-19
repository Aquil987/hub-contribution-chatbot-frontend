import { useRef, useState } from 'react'

import { SendIcon } from './SendIcon'
import { useLanguage } from '../i18n/useLanguage'

const MAX_MESSAGE_LENGTH = 4000

export const ChatComposer = ({ disabled, onSend }) => {
  const { text } = useLanguage()
  const [message, setMessage] = useState('')
  const textarea = useRef(null)

  const submit = () => {
    const trimmed = message.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setMessage('')
    textarea.current?.focus()
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    submit()
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      submit()
    }
  }

  return (
    <form className="composer" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="support-message">
        {text.inputLabel}
      </label>
      <textarea
        ref={textarea}
        id="support-message"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        onKeyDown={handleKeyDown}
        maxLength={MAX_MESSAGE_LENGTH}
        rows={1}
        placeholder={text.inputPlaceholder}
        disabled={disabled}
      />
      <button
        className="send-button"
        type="submit"
        disabled={disabled || !message.trim()}
        aria-label={disabled ? text.waiting : text.send}
      >
        <SendIcon />
      </button>
    </form>
  )
}
