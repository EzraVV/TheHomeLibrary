import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import './styles/index.css'
import App from './components/App.tsx'

const queryClient = new QueryClient()

const rootElement = document.getElementById('app')
if(!rootElement) throw new Error('Failed to find the root element')

document.addEventListener('DOMContentLoaded', () => {
  createRoot(document.getElementById('app') as HTMLElement).render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>,
  )
})
