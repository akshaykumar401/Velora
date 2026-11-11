import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStatus } from '../../features/auth/authContext.js'

const ProtectedRoute = ({ children }) => {
  const { isLoaded, isSignedIn } = useAuthStatus()
  const location = useLocation()

  if (!isLoaded) {
    return (
      <section className="py-24 bg-[#FCF9F2]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12 text-center">
          <p className="text-[11px] tracking-[0.24em] uppercase text-[#8A8379]">
            VERIFYING SESSION...
          </p>
        </div>
      </section>
    )
  }

  if (!isSignedIn) {
    return (
      <Navigate
        to="/sign-in"
        state={{ from: `${location.pathname}${location.search}` }}
        replace
      />
    )
  }

  return children
}

export default ProtectedRoute

