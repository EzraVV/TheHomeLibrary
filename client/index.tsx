import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import './styles/index.css'
import App from './components/App'

const queryClient = new QueryClient()

const rootElement = document.getElementById('app')
if(!rootElement) throw new Error('Failed to find the root element')

document.addEventListener('DOMContentLoaded', () => {
  createRoot(document.getElementById('app') as HTMLElement).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
        <App />
        </BrowserRouter>
      </QueryClientProvider>,
    </React.StrictMode>
  )
})
