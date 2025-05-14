import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LoadingProvider } from './Context/LoadingContext.tsx'
import { AuthProvider } from './Context/AuthContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LoadingProvider>
      <AuthProvider>
          <App />
      </AuthProvider>
    </LoadingProvider>
  </StrictMode>
)
