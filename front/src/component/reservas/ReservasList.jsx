// src/components/reservas/ReservasList.jsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL, ESTADOS_RESERVA } from '../../utils/constants';
import ReservaCard from './ReservaCard';
import LoadingSpinner from '../common/LoadingSpinner';

const ReservasList = ({ reservas, onUpdate }) => {
  const { authenticatedRequest } = useAuth();
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [loading, setLoading] = useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);

  // Filtrar reservas según el estado seleccionado
  const reservasFiltradas = reservas.filter(reserva => {
    if (filtroEstado === 'todas') return true;
    return reserva.estado === filtroEstado;
  });

  // Ordenar reservas por fecha (más recientes primero)
  const reservasOrdenadas = reservasFiltradas.sort((a, b) => 
    new Date(b.fechaInicio) - new Date(a.fechaInicio)
  );

  const handleCancelarReserva = async (reservaId) => {
    if (!confirm('¿Estás seguro de que quieres cancelar esta reserva?')) {
      return;
    }

    try {
      setLoading(true);
      
      const response = await authenticatedRequest(`${API_BASE_URL}/api/reservas/${reservaId}`, {
        method: 'PATCH',
        body: JSON.stringify({ estado: 'cancelacion_pendiente' })
      });

      if (!response.ok) {
        throw new Error('Error al cancelar la reserva');
      }

      onUpdate();
    } catch (error) {
      alert('Error al cancelar la reserva: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleModificarReserva = async (reservaId, cambios) => {
    try {
      setLoading(true);
      
      const response = await authenticatedRequest(`${API_BASE_URL}/api/reservas/${reservaId}`, {
        method: 'PUT',
        body: JSON.stringify(cambios)
      });

      if (!response.ok) {
        throw new Error('Error al modificar la reserva');
      }

      onUpdate();
      setReservaSeleccionada(null);
    } catch (error) {
      alert('Error al modificar la reserva: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const obtenerEstadoColor = (estado) => {
    const colores = {
      'pendiente': 'bg-warning-100 text-warning-800',
      'confirmada': 'bg-success-100 text-success-800',
      'cancelacion_pendiente': 'bg-error-100 text-error-800',
      'cancelada': 'bg-gray-100 text-gray-800',
      'completada': 'bg-primary-100 text-primary-800'
    };
    return colores[estado] || 'bg-gray-100 text-gray-800';
  };

  const obtenerEstadoTexto = (estado) => {
    const textos = {
      'pendiente': 'Pendiente',
      'confirmada': 'Confirmada',
      'cancelacion_pendiente': 'Cancelación Pendiente',
      'cancelada': 'Cancelada',
      'completada': 'Completada'
    };
    return textos[estado] || estado;
  };

  if (loading && reservas.length === 0) {
    return <LoadingSpinner text="Cargando reservas..." />;
  }

  return (
    <div>
      {/* Filtros */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFiltroEstado('todas')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filtroEstado === 'todas'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Todas ({reservas.length})
          </button>
          
          {Object.values(ESTADOS_RESERVA).map(estado => {
            const count = reservas.filter(r => r.estado === estado).length;
            if (count === 0) return null;
            
            return (
              <button
                key={estado}
                onClick={() => setFiltroEstado(estado)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filtroEstado === estado
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {obtenerEstadoTexto(estado)} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Lista de reservas */}
      {reservasOrdenadas.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10m6-10v10m-6-4h12" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filtroEstado === 'todas' ? 'No tienes reservas' : `No hay reservas ${obtenerEstadoTexto(filtroEstado).toLowerCase()}`}
          </h3>
          <p className="text-gray-600 mb-4">
            {filtroEstado === 'todas' 
              ? 'Crea tu primera reserva para comenzar a disfrutar del balneario'
              : 'Prueba cambiando el filtro para ver otras reservas'
            }
          </p>
          {filtroEstado === 'todas' && (
            <button
              onClick={() => window.location.reload()}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Crear Nueva Reserva
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {reservasOrdenadas.map((reserva) => (
            <ReservaCard
              key={reserva.id}
              reserva={reserva}
              onCancelar={handleCancelarReserva}
              onModificar={handleModificarReserva}
              loading={loading}
            />
          ))}
        </div>
      )}

      {/* Información adicional */}
      {reservasOrdenadas.length > 0 && (
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-gray-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-gray-800">Información sobre tus reservas</h4>
              <div className="mt-1 text-xs text-gray-700">
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Pendiente:</strong> Reserva creada, esperando confirmación de pago</li>
                  <li><strong>Confirmada:</strong> Pago verificado, reserva activa</li>
                  <li><strong>Cancelación Pendiente:</strong> Solicitud de cancelación en proceso</li>
                  <li><strong>Cancelada:</strong> Reserva cancelada y reembolso procesado</li>
                  <li><strong>Completada:</strong> Reserva utilizada exitosamente</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservasList;