import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { App } from './App'
import { LanguageProvider } from './i18n/LanguageContext'

const successfulResponse = {
  answer: 'iPhone 12 or newer is supported.',
  conversation_id: 'conversation-1',
  message_id: 'message-1',
  language: 'en',
  escalation_required: false,
}

const mockFetchSuccess = () =>
  vi.spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(successfulResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  )

const renderApp = () =>
  render(
    <LanguageProvider>
      <App />
    </LanguageProvider>,
  )

describe('SoftAge support chat', () => {
  beforeEach(() => window.localStorage.clear())
  afterEach(() => vi.restoreAllMocks())

  it('keeps suggested questions hidden by default', () => {
    renderApp()

    expect(screen.queryByText('Popular questions')).not.toBeInTheDocument()
    expect(screen.queryByText('Which phones are supported?')).not.toBeInTheDocument()
  })

  it('sends on Enter, renders the response, and preserves the conversation ID', async () => {
    const fetchMock = mockFetchSuccess()
    const user = userEvent.setup()
    renderApp()

    const input = screen.getByLabelText('Type your question')
    await user.type(input, 'Which phones are supported?{Enter}')

    expect(screen.getByText('Which phones are supported?')).toBeInTheDocument()
    expect(await screen.findByText(successfulResponse.answer)).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(JSON.parse(String(fetchMock.mock.calls[0][1]?.body))).toMatchObject({
      message: 'Which phones are supported?',
      conversation_id: null,
      locale: 'en',
    })

    await user.type(input, 'And Pixel 6?{Enter}')
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))
    expect(JSON.parse(String(fetchMock.mock.calls[1][1]?.body))).toMatchObject({
      conversation_id: 'conversation-1',
    })
  })

  it('allows Shift + Enter without sending', async () => {
    const fetchMock = mockFetchSuccess()
    const user = userEvent.setup()
    renderApp()

    const input = screen.getByLabelText('Type your question')
    await user.type(input, 'First line{Shift>}{Enter}{/Shift}Second line')

    expect(input).toHaveValue('First line\nSecond line')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('shows a useful network error', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'))
    const user = userEvent.setup()
    renderApp()

    await user.type(screen.getByLabelText('Type your question'), 'Help me{Enter}')

    expect(await screen.findByRole('alert')).toHaveTextContent('Unable to reach support')
  })

  it('starts a clean conversation and can close and reopen the chat', async () => {
    mockFetchSuccess()
    const user = userEvent.setup()
    renderApp()

    await user.type(screen.getByLabelText('Type your question'), 'Question{Enter}')
    expect(await screen.findByText(successfulResponse.answer)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Start a new conversation' }))
    expect(screen.queryByText(successfulResponse.answer)).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Close support chat' }))
    expect(screen.getByRole('button', { name: 'Open SoftAge Support' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Open SoftAge Support' }))
    expect(screen.getByRole('heading', { name: 'SoftAge Support' })).toBeInTheDocument()
  })

  it('translates the UI, persists the selection, and sends the selected locale', async () => {
    const fetchMock = mockFetchSuccess()
    const user = userEvent.setup()
    const firstRender = renderApp()

    expect(screen.getByRole('combobox', { name: 'Language' })).toHaveValue('en')
    await user.selectOptions(screen.getByRole('combobox', { name: 'Language' }), 'es')

    expect(screen.getByRole('heading', { name: 'Soporte de SoftAge' })).toBeInTheDocument()
    expect(screen.getByLabelText('Escribe tu pregunta')).toBeInTheDocument()
    expect(window.localStorage.getItem('softage-chat-locale')).toBe('es')

    await user.type(screen.getByLabelText('Escribe tu pregunta'), '¿Qué teléfonos admiten?{Enter}')
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
    expect(JSON.parse(String(fetchMock.mock.calls[0][1]?.body))).toMatchObject({ locale: 'es' })

    firstRender.unmount()
    renderApp()
    expect(screen.getByRole('combobox', { name: 'Idioma' })).toHaveValue('es')
  })
})
