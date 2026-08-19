import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './App'
import { LanguageProvider } from './i18n/LanguageContext'
import './styles/global.css'
import './styles/chat.css'

const rootElement = document.getElementById('root')

if (!rootElement) throw new Error('Root element was not found')

createRoot(rootElement).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
)
