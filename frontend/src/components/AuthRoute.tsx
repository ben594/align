/**
 * AuthRoute.tsx
 *
 * This file defines an `AuthRoute` component that protects routes by checking if the user is authenticated.
 * If the user is not authenticated, they are redirected to the authentication page.
 */

import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
export default function AuthRoute({ children }: { children: JSX.Element }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const checkLoggedIn = () => {
    const token = sessionStorage.getItem('jwt')
    if (!token) {
      console.error('User not authenticated.')
      setIsAuthenticated(false)
    } else {
      setIsAuthenticated(true)
    }
  }
  useEffect(() => {
    checkLoggedIn()
  }, [])
  if (isAuthenticated === false) {
    return <Navigate to="/auth" replace />
  }
  return children
}
