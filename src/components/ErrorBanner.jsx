import { useLanguage } from '../i18n/useLanguage'

export const ErrorBanner = ({ message, onDismiss }) => {
  const { text } = useLanguage()

  return (
    <div className="error-banner" role="alert">
      <span>{message}</span>
      <button type="button" onClick={onDismiss} aria-label={text.dismissError}>
        {text.dismiss}
      </button>
    </div>
  )
}
