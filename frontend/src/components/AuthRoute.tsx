import axios from 'axios'
import { Navigate } from 'react-router-dom'
import { BACKEND_URL } from '../constants'
import { useEffect, useState } from 'react'

export default function AuthRoute({ children }: { children: JSX.Element }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  const checkLoggedIn = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/auth/verify`, {
        withCredentials: true,
      })

      if (response.status == 200) {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
    } catch (error) {
      setIsAuthenticated(false)
    }
  }

  useEffect(() => {
    checkLoggedIn()
  }, [])

  if (isAuthenticated === false) {
    console.log('redirect')
    console.log(isAuthenticated)
    return <Navigate to="/" replace />
  }

  return children
}
