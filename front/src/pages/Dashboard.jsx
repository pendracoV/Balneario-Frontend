// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../component/common/LoadingSpinner';
import { API_BASE_URL } from '../utils/constants';

const Dashboard = () => {
  const { user, isAdmin, isPersonal, authenticatedRequest } = useAuth();
  const [stats, setStats] = useState({
    misReservas: 0,
    reservasActivas: 0,
    proximasReservas: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Obtener estadísticas según el rol del usuario
        if (isAdmin()) {
          // Admin ve estadísticas generales
          const response = await authenticatedRequest(`${API_BASE_URL}/api/reservas`);
          const reservas = await response.json();
          
          setStats({
            totalReservas: reservas.length,
            reservasHoy: reservas.filter(r => {
              const hoy = new Date().toDateString();
              const fechaReserva = new Date(r.fechaInicio).toDateString();
              return fechaReserva === hoy;
            }).length,
            proximasReservas: reservas.slice(0, 5)
          });
        } else {
          // Cliente ve sus propias reservas
          const response = await authenticatedRequest(`${API_BASE_URL}/api/reservas`);
          const todasReservas = await response.json();
          const misReservas = todasReservas.filter(r => r.usuarioId === user.id);
          
          setStats({
            misReservas: misReservas.length,
            reservasActivas: misReservas.filter(r => r.estado === 'confirmada').length,
            proximasReservas: misReservas
              .filter(r => new Date(r.fechaInicio) > new Date())
              .slice(0, 3)
          });
        }
      } catch (error) {
        console.error('Error al cargar dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, isAdmin, authenticatedRequest]);

  if (loading) {
    return <LoadingSpinner text="Cargando dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-gray-900">
            ¡Hola, {user?.nombre}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Bienvenido a tu dashboard del Balneario San Andrés
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {isAdmin() ? (
            <>
              <div className="bg-white p-6 rounded-lg shadow-card">
                <div className="flex items-center">
                  <div className="p-3 bg-primary-100 rounded-full">
                    <svg className="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Reservas</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalReservas || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-card">
                <div className="flex items-center">
                  <div className="p-3 bg-success-100 rounded-full">
                    <svg className="w-6 h-6 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Reservas Hoy</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.reservasHoy || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-card">
                <div className="flex items-center">
                  <div className="p-3 bg-secondary-100 rounded-full">
                    <svg className="w-6 h-6 text-secondary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Ocupación</p>
                    <p className="text-2xl font-semibold text-gray-900">75%</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white p-6 rounded-lg shadow-card">
                <div className="flex items-center">
                  <div className="p-3 bg-primary-100 rounded-full">
                    <svg className="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Mis Reservas</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.misReservas}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-card">
                <div className="flex items-center">
                  <div className="p-3 bg-success-100 rounded-full">
                    <svg className="w-6 h-6 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Activas</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.reservasActivas}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-card">
                <div className="flex items-center">
                  <div className="p-3 bg-warning-100 rounded-full">
                    <svg className="w-6 h-6 text-warning-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Próximas</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.proximasReservas.length}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Acciones Rápidas */}
          <div className="bg-white p-6 rounded-lg shadow-card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to="/reservas"
                className="flex items-center p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors group"
              >
                <div className="p-2 bg-primary-500 rounded-lg group-hover:bg-primary-600 transition-colors">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">
                    {isAdmin() ? 'Ver Reservas' : 'Nueva Reserva'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {isAdmin() ? 'Gestionar todas las reservas' : 'Hacer una nueva reserva'}
                  </p>
                </div>
              </Link>

              <Link
                to="/perfil"
                className="flex items-center p-4 bg-secondary-50 hover:bg-secondary-100 rounded-lg transition-colors group"
              >
                <div className="p-2 bg-secondary-500 rounded-lg group-hover:bg-secondary-600 transition-colors">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">Mi Perfil</p>
                  <p className="text-sm text-gray-600">Actualizar información</p>
                </div>
              </Link>

              {isAdmin() && (
                <>
                  <Link
                    to="/admin/usuarios"
                    className="flex items-center p-4 bg-success-50 hover:bg-success-100 rounded-lg transition-colors group"
                  >
                    <div className="p-2 bg-success-500 rounded-lg group-hover:bg-success-600 transition-colors">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">Usuarios</p>
                      <p className="text-sm text-gray-600">Gestionar usuarios</p>
                    </div>
                  </Link>

                  <Link
                    to="/admin/inventario"
                    className="flex items-center p-4 bg-warning-50 hover:bg-warning-100 rounded-lg transition-colors group"
                  >
                    <div className="p-2 bg-warning-500 rounded-lg group-hover:bg-warning-600 transition-colors">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">Inventario</p>
                      <p className="text-sm text-gray-600">Gestionar productos</p>
                    </div>
                  </Link>
                </>
              )}

              {(isPersonal() || isAdmin()) && (
                <Link
                  to="/personal"
                  className="flex items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group"
                >
                  <div className="p-2 bg-purple-500 rounded-lg group-hover:bg-purple-600 transition-colors">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">Panel Personal</p>
                    <p className="text-sm text-gray-600">Herramientas de trabajo</p>
                  </div>
                </Link>
              )}
            </div>
          </div>

          {/* Próximas Reservas */}
          <div className="bg-white p-6 rounded-lg shadow-card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {isAdmin() ? 'Próximas Reservas' : 'Mis Próximas Reservas'}
              </h2>
              <Link
                to="/reservas"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Ver todas
              </Link>
            </div>

            {stats.proximasReservas.length > 0 ? (
              <div className="space-y-4">
                {stats.proximasReservas.map((reserva, index) => (
                  <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {reserva.tipo === 'privada' ? 'Reserva Privada' : 'Reserva General'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(reserva.fechaInicio).toLocaleDateString()} - {reserva.numeroPersonas} personas
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        reserva.estado === 'confirmada' 
                          ? 'bg-success-100 text-success-800'
                          : reserva.estado === 'pendiente'
                          ? 'bg-warning-100 text-warning-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {reserva.estado}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10m6-10v10m-6-4h12" />
                </svg>
                <p className="text-gray-500">No hay reservas próximas</p>
                <Link
                  to="/reservas"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2 inline-block"
                >
                  Hacer una reserva
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Información importante */}
        <div className="mt-8 bg-primary-50 border border-primary-200 rounded-lg p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-primary-800">
                Información importante
              </h3>
              <div className="mt-2 text-sm text-primary-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Las reservas se deben hacer con mínimo 24 horas de anticipación</li>
                  <li>El pago debe realizarse para confirmar la reserva</li>
                  <li>Cancelaciones gratuitas hasta 12 horas antes del evento</li>
                  <li>Capacidad máxima: 120 personas</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;