
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../utils/constants';
import EntradasGenerales from '../components/entradas/EntradasGenerales';
import ConfirmacionEntrada from '../components/entradas/ConfirmacionEntrada';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Entradas = () => {
  const { authenticatedRequest, isPersonal, isAdmin } = useAuth();
  const [vistaActual, setVistaActual] = useState('lista'); // 'lista', 'crear', 'confirmacion'
  const [entradas, setEntradas] = useState([]);
  const [entradaCreada, setEntradaCreada] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('todas');

  useEffect(() => {
    fetchEntradas();
  }, []);

  const fetchEntradas = async () => {
    try {
      setLoading(true);
      const response = await authenticatedRequest(`${API_BASE_URL}/api/entradas`);
      const data = await response.json();
      setEntradas(data);
    } catch (error) {
      console.error('Error al cargar entradas:', error);
      setEntradas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEntradaCreada = (nuevaEntrada) => {
    setEntradaCreada(nuevaEntrada);
    setVistaActual('confirmacion');
    fetchEntradas(); // Recargar la lista
  };

  const handleNuevaEntrada = () => {
    setEntradaCreada(null);
    setVistaActual('crear');
  };

  const handleVolver = () => {
    setEntradaCreada(null);
    setVistaActual('lista');
  };

  const entradasFiltradas = entradas.filter(entrada => {
    if (filtroEstado === 'todas') return true;
    return entrada.estado === filtroEstado;
  });

  const obtenerEstadoColor = (estado) => {
    switch (estado) {
      case 'confirmada':
        return 'bg-success-100 text-success-800 border-success-200';
      case 'pendiente':
        return 'bg-warning-100 text-warning-800 border-warning-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading && vistaActual === 'lista') {
    return <LoadingSpinner text="Cargando entradas..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        
        {/* Vista de confirmación */}
        {vistaActual === 'confirmacion' && entradaCreada && (
          <>
            <div className="mb-6">
              <button
                onClick={handleVolver}
                className="flex items-center text-secondary-600 hover:text-secondary-700 font-medium mb-4"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver a entradas
              </button>
            </div>
            <ConfirmacionEntrada
              entrada={entradaCreada}
              onNuevaEntrada={handleNuevaEntrada}
              onVolver={handleVolver}
            />
          </>
        )}

        {/* Vista de crear entrada */}
        {vistaActual === 'crear' && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-heading font-bold text-gray-900">
                  Nueva Entrada General
                </h1>
                <p className="text-gray-600 mt-2">
                  {isPersonal() || isAdmin() 
                    ? 'Registra entradas generales para clientes presenciales o en línea'
                    : 'Compra tu entrada para disfrutar del balneario'
                  }
                </p>
              </div>
              <button
                onClick={handleVolver}
                className="flex items-center text-secondary-600 hover:text-secondary-700 font-medium"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver a la lista
              </button>
            </div>
            <EntradasGenerales onEntradaCreada={handleEntradaCreada} />
          </>
        )}

        {/* Vista de lista */}
        {vistaActual === 'lista' && (
          <>
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-heading font-bold text-gray-900">
                  {isPersonal() || isAdmin() ? 'Gestión de Entradas' : 'Mis Entradas'}
                </h1>
                <p className="text-gray-600 mt-2">
                  {isPersonal() || isAdmin() 
                    ? 'Administra las entradas generales del balneario'
                    : 'Gestiona tus entradas al balneario'
                  }
                </p>
              </div>
              <button
                onClick={() => setVistaActual('crear')}
                className="bg-secondary-600 hover:bg-secondary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
              >
                + Nueva Entrada
              </button>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-lg shadow-card p-4 mb-6">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFiltroEstado('todas')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filtroEstado === 'todas'
                      ? 'bg-secondary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Todas ({entradas.length})
                </button>
                <button
                  onClick={() => setFiltroEstado('pendiente')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filtroEstado === 'pendiente'
                      ? 'bg-warning-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Pendientes ({entradas.filter(e => e.estado === 'pendiente').length})
                </button>
                <button
                  onClick={() => setFiltroEstado('confirmada')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filtroEstado === 'confirmada'
                      ? 'bg-success-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Confirmadas ({entradas.filter(e => e.estado === 'confirmada').length})
                </button>
              </div>
            </div>

            {/* Lista de entradas */}
            {entradasFiltradas.length === 0 ? (
              <div className="bg-white rounded-lg shadow-card p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a1 1 0 001 1h1a1 1 0 001-1V7a2 2 0 00-2-2H5zM5 14a2 2 0 00-2 2v3a1 1 0 001 1h1a1 1 0 001-1v-3a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay entradas
                </h3>
                <p className="text-gray-600 mb-4">
                  {filtroEstado === 'todas' 
                    ? 'Aún no se han registrado entradas' 
                    : `No hay entradas con estado "${filtroEstado}"`
                  }
                </p>
                <button
                  onClick={() => setVistaActual('crear')}
                  className="bg-secondary-600 hover:bg-secondary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Crear Primera Entrada
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {entradasFiltradas.map((entrada) => (
                  <div key={entrada.id} className="bg-white rounded-lg shadow-card p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 mr-3">
                            Entrada #{entrada.id}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${obtenerEstadoColor(entrada.estado)}`}>
                            {entrada.estado === 'confirmada' ? 'Confirmada' : 'Pendiente'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Fecha:</span> {new Date(entrada.fecha).toLocaleDateString()}
                          </div>
                          <div>
                            <span className="font-medium">Horario:</span> {entrada.horario === 'diurno' ? '☀️ Diurno' : '🌙 Nocturno'}
                          </div>
                          <div>
                            <span className="font-medium">Personas:</span> {entrada.numeroPersonas}
                          </div>
                        </div>
                        
                        {entrada.esPresencial && entrada.clientePresencial && (
                          <div className="mt-2 text-sm text-gray-600">
                            <span className="font-medium">Cliente:</span> {entrada.clientePresencial.nombre} - {entrada.clientePresencial.documento}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center mt-4 lg:mt-0 lg:ml-6">
                        <div className="text-right mr-4">
                          <div className="text-xl font-bold text-secondary-600">
                            ${entrada.precioTotal?.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            ${Math.round(entrada.precioTotal / entrada.numeroPersonas).toLocaleString()}/persona
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          {entrada.estado === 'pendiente' && (
                            <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
                              Pagar
                            </button>
                          )}
                          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm font-medium transition-colors">
                            Detalles
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Información sobre entradas */}
            <div className="mt-8 bg-secondary-50 border border-secondary-200 rounded-lg p-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-secondary-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-secondary-800">
                    Información sobre entradas generales
                  </h3>
                  <div className="mt-2 text-sm text-secondary-700">
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Horario Diurno:</strong> 9:00-12:00 y 14:00-18:00 ($5,000/persona)</li>
                      <li><strong>Horario Nocturno:</strong> 18:00-23:00 ($10,000/persona)</li>
                      <li><strong>Capacidad máxima:</strong> 120 personas</li>
                      <li><strong>Disponibilidad:</strong> Sujeta a reservas privadas y aforo máximo</li>
                      {(isPersonal() || isAdmin()) && (
                        <li><strong>Registro presencial:</strong> Se puede registrar clientes directamente en sitio</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Entradas;