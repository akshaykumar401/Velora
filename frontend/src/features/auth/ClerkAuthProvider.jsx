import { useMemo } from 'react'
import { ClerkProvider, useAuth, useUser } from '@clerk/react'
import { AuthContext } from './authContext.js'
import {
  CLERK_PUBLISHABLE_KEY,
  isClerkConfigured,
  veloraClerkAppearance,
} from './clerkConfig.js'

const ClerkAuthBridge = ({ children }) => {
  const { isLoaded: authLoaded, isSignedIn } = useAuth()
  const { isLoaded: userLoaded, user } = useUser()

  const value = useMemo(
    () => ({
      isLoaded: authLoaded && userLoaded,
      isSignedIn: Boolean(isSignedIn),
      user: user || null,
      isClerkConfigured: true,
    }),
    [authLoaded, userLoaded, isSignedIn, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const ClerkAuthProvider = ({ children }) => {
  const fallbackValue = useMemo(
    () => ({
      isLoaded: true,
      isSignedIn: false,
      user: null,
      isClerkConfigured: false,
    }),
    [],
  )

  if (!isClerkConfigured) {
    return (
      <AuthContext.Provider value={fallbackValue}>
        {children}
      </AuthContext.Provider>
    )
  }

  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      appearance={veloraClerkAppearance}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/profile"
      signUpFallbackRedirectUrl="/profile"
      afterSignOutUrl="/"
    >
      <ClerkAuthBridge>{children}</ClerkAuthBridge>
    </ClerkProvider>
  )
}
