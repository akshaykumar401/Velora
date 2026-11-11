import { useLocation } from 'react-router-dom'
import { Show, SignIn } from '@clerk/react'
import {
  AuthShell,
  ClerkSetupNotice,
  SignedInActiveCard,
} from '../../components/auth'
import {
  isClerkConfigured,
  veloraClerkAppearance,
} from '../../features/auth/clerkConfig.js'

const SignInPage = () => {
  const location = useLocation()
  const redirectTo = location.state?.from || '/profile'

  return (
    <AuthShell
      eyebrow="CLIENT SIGN IN"
      title="Welcome Back to the House"
      subtitle="Sign in with your Velora credentials to unlock saving pieces, adding items to your bag, and expedited checkout."
      switchPrompt="New to Velora?"
      switchLabel="Create an account"
      switchTo="/sign-up"
      switchState={{ from: redirectTo }}
    >
      {isClerkConfigured ? (
        <>
          <Show when="signed-out">
            <SignIn
              routing="path"
              path="/sign-in"
              signUpUrl="/sign-up"
              fallbackRedirectUrl={redirectTo}
              appearance={veloraClerkAppearance}
            />
          </Show>

          <Show when="signed-in">
            <SignedInActiveCard
              title="You are already signed in"
              description="Continue to your client account or browse the seasonal collection."
            />
          </Show>
        </>
      ) : (
        <ClerkSetupNotice mode="sign-in" />
      )}
    </AuthShell>
  )
}

export default SignInPage
