import { createContext, useContext } from 'react'

export const AuthContext = createContext({
  isLoaded: true,
  isSignedIn: false,
  user: null,
  isClerkConfigured: false,
})

export const useAuthStatus = () => useContext(AuthContext)

