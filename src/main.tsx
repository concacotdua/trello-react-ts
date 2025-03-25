import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary'
import AppProvider from './hooks/app-provider.tsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <ErrorBoundary>
        <App />
        <ToastContainer position='bottom-right' />
      </ErrorBoundary>
    </AppProvider>
  </StrictMode>
)
