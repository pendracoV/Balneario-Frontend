// src/context/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react'
import { USER_ROLES, API_BASE_URL } from '../utils/constants'

const AuthContext = createContext()

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null)
  const [token, setToken]     = useState(localStorage.getItem('authToken'))
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  // función para decodificar el payload de un JWT sin librerías
  const decodeToken = useCallback(tkn => {
    if (!tkn) return null
    try {
      const payload = tkn.split('.')[1]
      const json    = atob(payload)
      return JSON.parse(json)
    } catch {
      return null
    }
  }, [])

  // al montar, recupera de localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('authToken')
    const savedUser  = localStorage.getItem('authUser')
    if (savedToken && savedUser) {
      const decoded = decodeToken(savedToken)
      if (decoded) {
        setToken(savedToken)
        setUser(decoded)
      } else {
        // dato corrupto, limpia todo
        localStorage.removeItem('authToken')
        localStorage.removeItem('authUser')
      }
    }
    setLoading(false)
  }, [decodeToken])

  // LOGIN
  const login = useCallback(async credentials => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Error en login')
      const decoded = decodeToken(data.token)
      if (!decoded) throw new Error('Token inválido')
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('authUser', JSON.stringify(decoded))
      setToken(data.token)
      setUser(decoded)
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [decodeToken])

  // REGISTER
  const register = useCallback(async userData => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Error en registro')
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  // LOGOUT
  const logout = useCallback(() => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')
    setToken(null)
    setUser(null)
    setError(null)
  }, [])

  // FORGOT PASSWORD
  const forgotPassword = useCallback(async email => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Error al enviar email')
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  // RESET PASSWORD
  const resetPassword = useCallback(async resetData => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resetData)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Error al resetear contraseña')
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  // CHEQUEOS DE ROL
  const isAdmin        = useCallback(() => user?.role === USER_ROLES.ADMIN,    [user])
  const isPersonal     = useCallback(() => user?.role === USER_ROLES.PERSONAL, [user])
  const isCliente      = useCallback(() => user?.role === USER_ROLES.CLIENTE,  [user])
  const isAuthenticated = useCallback(() => !!token && !!user,                [token, user])

  // FETCH autenticado
  const authenticatedRequest = useCallback(
    async (url, options = {}) => {
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
      }
      const res = await fetch(url, { ...options, headers })
      if (res.status === 401) {
        logout()
        throw new Error('Sesión expirada')
      }
      return res
    },
    [token, logout]
  )

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    isAdmin,
    isPersonal,
    isCliente,
    isAuthenticated,
    authenticatedRequest,
    setError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
