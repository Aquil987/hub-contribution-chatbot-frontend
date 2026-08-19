import { useLanguage } from '../i18n/useLanguage'

export const SuggestedQuestions = ({ disabled, onSelect }) => {
  const { text } = useLanguage()

  return (
    <section className="suggestions" aria-label={text.suggestedQuestions}>
      <p>{text.popularQuestions}</p>
      <div className="suggestions__list">
        {text.questions.map((question) => (
          <button key={question} type="button" disabled={disabled} onClick={() => onSelect(question)}>
            {question}
          </button>
        ))}
      </div>
    </section>
  )
}
