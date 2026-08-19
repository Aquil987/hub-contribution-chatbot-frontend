import { useState } from 'react'

import { ChatShell } from './components/ChatShell'
import { useLanguage } from './i18n/useLanguage'

export const App = () => {
  const [isOpen, setIsOpen] = useState(true)
  const { text } = useLanguage()

  return (
    <div className="app-shell">
      <div className="app-shell__ambient app-shell__ambient--one" aria-hidden="true" />
      <div className="app-shell__ambient app-shell__ambient--two" aria-hidden="true" />
      {isOpen ? (
        <ChatShell onClose={() => setIsOpen(false)} />
      ) : (
        <button className="open-chat-button" type="button" onClick={() => setIsOpen(true)}>
          <span aria-hidden="true">S</span>
          {text.openChat}
        </button>
      )}
    </div>
  )
}
