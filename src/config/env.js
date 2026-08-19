const parseTimeout = (value) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 20_000
}

export const appConfig = Object.freeze({
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, ''),
  apiTimeoutMs: parseTimeout(import.meta.env.VITE_API_TIMEOUT_MS),
  showSuggestedQuestions: import.meta.env.VITE_SHOW_SUGGESTED_QUESTIONS === 'true',
})
