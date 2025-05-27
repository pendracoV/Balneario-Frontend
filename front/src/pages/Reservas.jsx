// src/pages/Reservas.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../component/common/LoadingSpinner';
import CrearReserva from '../component/reservas/CrearReserva';
import ReservasList from '../component/reservas/ReservasList';
import { API_BASE_URL } from '../utils/constants';

const Reservas = () => {
  const { authenticatedRequest } = useAuth();
  const [activeTab, setActiveTab] = useState('mis-reservas');
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCrearReserva, setShowCrearReserva] = useState(false);

  useEffect(() => {
    fetchReservas();
  }, []);

  const fetchReservas = async () => {
    try {
      setLoading(true);
      const response = await authenticatedRequest(`${API_BASE_URL}/api/reservas`);
      const data = await response.json();
      setReservas(data);
    } catch (error) {
      console.error('Error al cargar reservas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReservaCreada = () => {
    setShowCrearReserva(false);
    fetchReservas();
    setActiveTab('mis-reservas');
  };

  if (loading) {
    return <LoadingSpinner text="Cargando reservas..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">

        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
            Gestión de Reservas
          </h1>
          <p className="text-gray-600">
            Administra tus reservas en el Balneario San Andrés
          </p>
        </div>


        <div className="bg-white rounded-lg shadow-card mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => {
                  setActiveTab('mis-reservas');
                  setShowCrearReserva(false);
                }}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'mis-reservas'
                    ? 'border-b-2 border-primary-500 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Mis Reservas
              </button>
              <button
                onClick={() => {
                  setActiveTab('nueva-reserva');
                  setShowCrearReserva(true);
                }}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'nueva-reserva'
                    ? 'border-b-2 border-primary-500 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Nueva Reserva
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'mis-reservas' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Mis Reservas ({reservas.length})
                  </h2>
                  <button
                    onClick={() => {
                      setActiveTab('nueva-reserva');
                      setShowCrearReserva(true);
                    }}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    Nueva Reserva
                  </button>
                </div>
                <ReservasList reservas={reservas} onUpdate={fetchReservas} />
              </div>
            )}

            {activeTab === 'nueva-reserva' && showCrearReserva && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Crear Nueva Reserva
                  </h2>
                  <button
                    onClick={() => {
                      setActiveTab('mis-reservas');
                      setShowCrearReserva(false);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Cancelar
                  </button>
                </div>
                <CrearReserva onReservaCreada={handleReservaCreada} />
              </div>
            )}
          </div>
        </div>

        <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-primary-800">
                Información sobre reservas
              </h3>
              <div className="mt-2 text-sm text-primary-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Reservas Privadas:</strong> Entre semana (min. 10 personas - $20.000/persona) | Fin de semana (min. 15 personas - $25.000/persona)</li>
                  <li><strong>Horarios:</strong> Diurno (9:00-12:00 y 14:00-18:00) | Nocturno (18:00-23:00)</li>
                  <li><strong>Servicios adicionales:</strong> Cocina ($25.000) | Cuarto ($50.000/noche)</li>
                  <li><strong>Capacidad máxima:</strong> 120 personas</li>
                  <li><strong>Cargo adicional:</strong> $100.000 si no se alcanza el mínimo de personas</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservas;