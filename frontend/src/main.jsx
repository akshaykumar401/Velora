import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './styles/index.css'
import AppRouter from './App/AppRouter.jsx'
import { store } from './App/store.js'
import { ClerkAuthProvider } from './features/auth/ClerkAuthProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ClerkAuthProvider>
        <AppRouter />
      </ClerkAuthProvider>
    </Provider>
  </StrictMode>,
)
