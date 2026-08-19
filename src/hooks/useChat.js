import { useCallback, useEffect, useRef, useState } from 'react'

import { ChatApiError, sendChatMessage } from '../services/chatApi'
import { useLanguage } from '../i18n/useLanguage'
import { createId } from '../utils/id'

const createWelcomeMessage = () => ({
  id: 'welcome',
  role: 'assistant',
  isWelcome: true,
})

const getErrorMessage = (error, text) => {
  if (!(error instanceof ChatApiError)) return text.errors.generic
  if (error.code === 'network') return text.errors.network
  if (error.code === 'timeout') return text.errors.timeout
  if (error.code === 'invalid-response') return text.errors.invalidResponse
  if (error.code === 'server') return error.message || text.errors.server
  return text.errors.generic
}

export const useChat = () => {
  const { locale, text } = useLanguage()
  const [messages, setMessages] = useState(() => [createWelcomeMessage()])
  const [conversationId, setConversationId] = useState(null)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)
  const abortController = useRef(null)
  const requestInFlight = useRef(false)

  const sendMessage = useCallback(
    async (rawMessage) => {
      const message = rawMessage.trim()
      if (!message || requestInFlight.current) return

      requestInFlight.current = true
      const userMessage = { id: createId(), role: 'user', content: message }
      setMessages((current) => [...current, userMessage])
      setStatus('loading')
      setError(null)
      const controller = new AbortController()
      abortController.current = controller

      try {
        const response = await sendChatMessage(
          {
            message,
            conversation_id: conversationId,
            locale,
          },
          controller.signal,
        )
        setConversationId(response.conversation_id)
        setMessages((current) => [
          ...current,
          {
            id: response.message_id,
            role: 'assistant',
            content: response.answer,
            escalationRequired: response.escalation_required,
          },
        ])
      } catch (requestError) {
        if (!controller.signal.aborted) setError(requestError)
      } finally {
        if (!controller.signal.aborted) setStatus('idle')
        requestInFlight.current = false
        abortController.current = null
      }
    },
    [conversationId, locale],
  )

  const startNewConversation = useCallback(() => {
    abortController.current?.abort()
    abortController.current = null
    requestInFlight.current = false
    setMessages([createWelcomeMessage()])
    setConversationId(null)
    setStatus('idle')
    setError(null)
  }, [])

  useEffect(() => () => abortController.current?.abort(), [])

  return {
    messages,
    status,
    error: error ? getErrorMessage(error, text) : null,
    dismissError: () => setError(null),
    sendMessage,
    startNewConversation,
  }
}
