import { useLocation } from 'react-router-dom'
import { Show, SignUp } from '@clerk/react'
import {
  AuthShell,
  ClerkSetupNotice,
  SignedInActiveCard,
} from '../../components/auth'
import {
  isClerkConfigured,
  veloraClerkAppearance,
} from '../../features/auth/clerkConfig.js'

const SignUpPage = () => {
  const location = useLocation()
  const redirectTo = location.state?.from || '/profile'

  return (
    <AuthShell
      eyebrow="PRIVATE MEMBERSHIP"
      title="Join the Velora Circle"
      subtitle="Create your client account for curated wardrobe archiving, private seasonal previews, and seamless atelier care."
      switchPrompt="Already have a Velora account?"
      switchLabel="Sign in"
      switchTo="/sign-in"
      switchState={{ from: redirectTo }}
    >
      {isClerkConfigured ? (
        <>
          <Show when="signed-out">
            <SignUp
              routing="path"
              path="/sign-up"
              signInUrl="/sign-in"
              fallbackRedirectUrl={redirectTo}
              appearance={veloraClerkAppearance}
            />
          </Show>

          <Show when="signed-in">
            <SignedInActiveCard
              title="Your membership is active"
              description="Visit your profile to review saved addresses and order history."
            />
          </Show>
        </>
      ) : (
        <ClerkSetupNotice mode="sign-up" />
      )}
    </AuthShell>
  )
}

export default SignUpPage
