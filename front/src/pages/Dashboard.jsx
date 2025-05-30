// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../component/common/LoadingSpinner'
import { API_BASE_URL, RUTAS } from '../utils/constants'

const Dashboard = () => {
  const { user, isAdmin, isPersonal, authenticatedRequest } = useAuth()
  const [stats, setStats] = useState({
    totalReservas:    0,
    reservasHoy:      0,
    misReservas:      0,
    reservasActivas:  0,
    proximasReservas: []
  })
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  // **Aquí** el log se ejecuta en cada render y aparecerá en la DevTools Console
  console.log('Dashboard:', {
    isAdmin:    isAdmin(),
    isPersonal: isPersonal(),
    user
  })

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Traer todas las reservas
        const resR = await authenticatedRequest(`${API_BASE_URL}/api/reservas`)
        if (!resR.ok) throw new Error('No se pudieron cargar reservas')
        const reservas = await resR.json()
        const hoyStr  = new Date().toDateString()

        if (isAdmin()) {
          // Stats para admin
          setStats(s => ({
            ...s,
            totalReservas:    reservas.length,
            reservasHoy:      reservas.filter(r => new Date(r.fecha_inicio).toDateString() === hoyStr).length,
            proximasReservas: reservas.slice(0, 5)
          }))
        } else {
          // Reservas propias
          const own = reservas.filter(r => r.cliente_id === user.id)

          // Traer pagos
          const resP = await authenticatedRequest(`${API_BASE_URL}/api/pagos`)
          if (!resP.ok) throw new Error('No se pudieron cargar pagos')
          const pagos = await resP.json()

          setStats(s => ({
            ...s,
            misReservas:      own.length,
            reservasActivas:  own.filter(r => pagos.some(p => p.reserva_id === r.id)).length,
            proximasReservas: own.filter(r => new Date(r.fecha_inicio) > new Date()).slice(0, 3)
          }))
        }
      } catch (err) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user.id, isAdmin, isPersonal, authenticatedRequest])

  if (loading) return <LoadingSpinner text="Cargando dashboard..." />
  if (error)   return <p className="p-6 text-center text-red-600">{error}</p>

  const { totalReservas, reservasHoy, misReservas, reservasActivas, proximasReservas } = stats

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">¡Hola, {user.nombre}! 👋</h1>
          <p className="text-gray-600 mt-1">Bienvenido al dashboard</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {isAdmin() ? (
            <>
              <StatCard label="Total Reservas" value={totalReservas} />
              <StatCard label="Reservas Hoy"   value={reservasHoy} />
              <StatCard label="Ocupación"      value="75%"       />
            </>
          ) : (
            <>
              <StatCard label="Mis Reservas" value={misReservas} />
              <StatCard label="Activas"      value={reservasActivas} />
              <StatCard label="Próximas"     value={proximasReservas.length} />
            </>
          )}
        </div>

        {/* Acciones Rápidas */}
        <div className="bg-white p-6 rounded-lg shadow-card mb-8">
          <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            { (isAdmin() || isPersonal()) ? (
              <QuickLink
                to={RUTAS.TURNOS}
                title="Gestionar Turnos"
                subtitle="Crear y editar bloques de turno"
                iconPath="M4 3h12v2H4V3zm0 4h12v2H4V7zm0 4h12v2H4v-2zm0 4h12v2H4v-2z"
              />
            ) : (
              <QuickLink
                to={RUTAS.RESERVAS}
                title="Nueva Reserva"
                subtitle="Hacer una nueva reserva"
                iconPath="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              />
            )}
            <QuickLink
              to={RUTAS.PERFIL}
              title="Mi Perfil"
              subtitle="Actualizar información"
              iconPath="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            />
          </div>
        </div>

        {/* Próximas Reservas */}
        <div className="bg-white p-6 rounded-lg shadow-card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {isAdmin() ? 'Próximas Reservas' : 'Mis Próximas Reservas'}
            </h2>
            <Link to={RUTAS.RESERVAS} className="text-primary-600 hover:text-primary-700 text-sm">
              Ver todas
            </Link>
          </div>

          {proximasReservas.length > 0 ? (
            proximasReservas.map((r,i) => <NextItem key={i} reserva={r} />)
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard

// —————————————————————————————————————————————————————————————————————————
// COMPONENTES AUXILIARES
// —————————————————————————————————————————————————————————————————————————

const StatCard = ({ label, value }) => (
  <div className="bg-white p-6 rounded-lg shadow-card">
    <div className="flex items-center">
      <div className="p-3 bg-primary-100 rounded-full" />
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
)

const QuickLink = ({ to, title, subtitle, iconPath }) => (
  <Link to={to} className="flex items-center p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors group">
    <div className="p-2 bg-primary-500 rounded-lg group-hover:bg-primary-600 transition-colors">
      <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
        <path d={iconPath} />
      </svg>
    </div>
    <div className="ml-3">
      <p className="font-medium text-gray-900">{title}</p>
      <p className="text-sm text-gray-600">{subtitle}</p>
    </div>
  </Link>
)

const NextItem = ({ reserva }) => (
  <div className="flex items-center p-4 bg-gray-50 rounded-lg mb-4">
    <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
      </svg>
    </div>
    <div className="ml-4 flex-1">
      <p className="text-sm font-medium text-gray-900">
        {reserva.tipo === 'privada' ? 'Privada' : 'General'}
      </p>
      <p className="text-sm text-gray-600">
        {new Date(reserva.fecha_inicio).toLocaleDateString()} – {reserva.personas} pers.
      </p>
    </div>
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
      reserva.estado === 'confirmada'
        ? 'bg-success-100 text-success-800'
        : 'bg-warning-100 text-warning-800'
    }`}>
      {reserva.estado}
    </span>
  </div>
)

const EmptyState = () => (
  <div className="text-center py-8">
    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10m6-10v10m-6-4h12" />
    </svg>
    <p className="text-gray-500">No hay reservas próximas</p>
    <Link to={RUTAS.RESERVAS} className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2 inline-block">
      Hacer una reserva
    </Link>
  </div>
)
