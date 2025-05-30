// src/App.jsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ReservasProvider }     from './context/ReservasContext'

// Páginas
import Home       from './pages/Home'
import Login      from './pages/Login'
import Register   from './pages/Register'
import Dashboard  from './pages/Dashboard'
import Reservas   from './pages/Reservas'
import Perfil     from './pages/Perfil'
import NotFound   from './pages/NotFound'
import TurnoForm  from './component/turno/TurnoForm'

// Protecciones y layout
import ProtectedRoute from './component/common/ProtectedRoute'
import { AdminRoute } from './component/common/AdminRoute'
import { PersonalRoute } from './component/common/PersonalRoute'
import Layout from './component/common/Layout'

const ReservasRoute = () => {
  const { isAdmin, isPersonal } = useAuth()
  if (isAdmin() || isPersonal()) {
    return <Navigate to="/turnos" replace />
  }
  return (
    <Layout>
      <Reservas />
    </Layout>
  )
}

function AppRoutes() {
  const { isAdmin, isPersonal } = useAuth()

  return (
    <Routes>
      {/* Públicas */}
      <Route path="/"        element={<Layout><Home /></Layout>} />
      <Route path="/login"   element={<Login />} />
      <Route path="/register"element={<Register />} />

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        }
      />

      {/* Reservas */}
      <Route
        path="/reservas"
        element={
          <ProtectedRoute>
            <ReservasRoute />
          </ProtectedRoute>
        }
      />

      {/* Turnos: admin o personal */}
      <Route
        path="/turnos"
        element={
          <ProtectedRoute>
            {isAdmin() ? (
              <AdminRoute>
                <Layout><TurnoForm /></Layout>
              </AdminRoute>
            ) : (
              <PersonalRoute>
                <Layout><TurnoForm /></Layout>
              </PersonalRoute>
            )}
          </ProtectedRoute>
        }
      />

      {/* Perfil (solo clientes) */}
      <Route
        path="/perfil"
        element={
          <ProtectedRoute>
            <Layout><Perfil /></Layout>
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ReservasProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <AppRoutes />
          </div>
        </Router>
      </ReservasProvider>
    </AuthProvider>
  )
}
