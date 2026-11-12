import { useEffect, useMemo } from 'react'
import { ClerkProvider, useAuth, useUser } from '@clerk/react'
import { useAppDispatch, useAppSelector } from '../../App/hooks.js'
import { fetchCatalog } from '../catalog/catalogSlice.js'
import {
  resetCustomerState,
  syncCustomerSession,
} from '../store/customerSlice.js'
import { bootstrapAdminThunk } from '../admin/adminSlice.js'
import { setCustomerTokenGetter } from '../../services/apiClient.js'
import { AuthContext } from './authContext.js'
import {
  CLERK_PUBLISHABLE_KEY,
  isClerkConfigured,
  veloraClerkAppearance,
} from './clerkConfig.js'

const AppBootstrapEffects = ({ isLoaded, isSignedIn, user }) => {
  const dispatch = useAppDispatch()
  const adminAuthenticated = useAppSelector(
    (state) => state.admin.isAuthenticated,
  )

  useEffect(() => {
    dispatch(fetchCatalog())
  }, [dispatch])

  useEffect(() => {
    if (!isLoaded) return
    if (isSignedIn && user) {
      dispatch(
        syncCustomerSession({
          fullName: user.fullName || user.username || '',
          email: user.primaryEmailAddress?.emailAddress || '',
          avatarUrl: user.imageUrl || '',
        }),
      )
    } else {
      dispatch(resetCustomerState())
    }
  }, [
    dispatch,
    isLoaded,
    isSignedIn,
    user,
  ])

  useEffect(() => {
    if (adminAuthenticated) {
      dispatch(bootstrapAdminThunk())
    }
  }, [dispatch, adminAuthenticated])

  return null
}

const ClerkAuthBridge = ({ children }) => {
  const { isLoaded: authLoaded, isSignedIn, getToken } = useAuth()
  const { isLoaded: userLoaded, user } = useUser()

  useEffect(() => {
    setCustomerTokenGetter(isSignedIn ? getToken : null)
    return () => setCustomerTokenGetter(null)
  }, [getToken, isSignedIn])

  const value = useMemo(
    () => ({
      isLoaded: authLoaded && userLoaded,
      isSignedIn: Boolean(isSignedIn),
      user: user || null,
      isClerkConfigured: true,
    }),
    [authLoaded, userLoaded, isSignedIn, user],
  )

  return (
    <AuthContext.Provider value={value}>
      <AppBootstrapEffects
        isLoaded={value.isLoaded}
        isSignedIn={value.isSignedIn}
        user={value.user}
      />
      {children}
    </AuthContext.Provider>
  )
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
        <AppBootstrapEffects isLoaded isSignedIn={false} user={null} />
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
