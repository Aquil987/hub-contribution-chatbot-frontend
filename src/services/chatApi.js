import { appConfig } from '../config/env'

export class ChatApiError extends Error {
  constructor(message, code, status) {
    super(message)
    this.name = 'ChatApiError'
    this.code = code
    this.status = status
  }
}

const parseErrorMessage = async (response) => {
  try {
    const body = await response.json()
    return body.error?.message ?? body.detail ?? ''
  } catch {
    return ''
  }
}

const isChatResponse = (value) => {
  if (!value || typeof value !== 'object') return false
  const response = value
  return (
    typeof response.answer === 'string' &&
    response.answer.trim().length > 0 &&
    typeof response.conversation_id === 'string' &&
    typeof response.message_id === 'string' &&
    typeof response.escalation_required === 'boolean'
  )
}

export const sendChatMessage = async (payload, externalSignal) => {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort('timeout'), appConfig.apiTimeoutMs)
  const abortFromCaller = () => controller.abort('cancelled')
  externalSignal?.addEventListener('abort', abortFromCaller, { once: true })

  try {
    const response = await fetch(`${appConfig.apiBaseUrl}/api/support/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
      credentials: 'omit',
    })

    if (!response.ok) {
      throw new ChatApiError(await parseErrorMessage(response), 'server', response.status)
    }

    let body
    try {
      body = await response.json()
    } catch {
      throw new ChatApiError('The server returned an empty or invalid answer.', 'invalid-response')
    }
    if (!isChatResponse(body)) {
      throw new ChatApiError('The server returned an empty or invalid answer.', 'invalid-response')
    }
    return body
  } catch (error) {
    if (error instanceof ChatApiError) throw error
    if (controller.signal.aborted && controller.signal.reason === 'timeout') {
      throw new ChatApiError('The request took too long. Please try again.', 'timeout')
    }
    if (externalSignal?.aborted) {
      throw error
    }
    throw new ChatApiError('Unable to reach support. Check your connection and try again.', 'network')
  } finally {
    window.clearTimeout(timeoutId)
    externalSignal?.removeEventListener('abort', abortFromCaller)
  }
}
