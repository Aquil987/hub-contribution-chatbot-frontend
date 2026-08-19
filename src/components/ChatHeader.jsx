import { CloseIcon } from './CloseIcon'
import { useLanguage } from '../i18n/useLanguage'

export const ChatHeader = ({ onClose }) => {
  const { languages, locale, setLocale, text } = useLanguage()

  return (
    <header className="chat-header">
      <div className="chat-header__identity">
        <span className="chat-header__status" aria-hidden="true" />
        <div>
          <h1>{text.title}</h1>
          <p>{text.subtitle}</p>
        </div>
      </div>
      <div className="chat-header__actions">
        <label className="sr-only" htmlFor="chat-language">
          {text.language}
        </label>
        <select
          id="chat-language"
          className="language-selector"
          value={locale}
          onChange={(event) => setLocale(event.target.value)}
          aria-label={text.language}
        >
          {languages.map((language) => (
            <option key={language.locale} value={language.locale}>
              {language.label}
            </option>
          ))}
        </select>
        <button className="icon-button" type="button" onClick={onClose} aria-label={text.closeChat}>
          <CloseIcon />
        </button>
      </div>
    </header>
  )
}
