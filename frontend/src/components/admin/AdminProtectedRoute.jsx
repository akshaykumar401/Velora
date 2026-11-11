import { Navigate, useLocation } from 'react-router-dom'
import { useAdmin } from '../../features/admin/adminContext.js'

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAdmin()
  const location = useLocation()

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/admin/login"
        state={{ from: `${location.pathname}${location.search}` }}
        replace
      />
    )
  }

  return children
}

export default AdminProtectedRoute

