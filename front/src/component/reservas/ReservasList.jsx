import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL, ESTADOS_RESERVA } from '../../utils/constants';
import ReservaCard from './ReservaCard';
import LoadingSpinner from '../common/LoadingSpinner';

const ReservasList = ({ reservas, onUpdate }) => {
  const { authenticatedRequest } = useAuth();
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [loading, setLoading] = useState(false);
  const [pagos, setPagos] = useState([]);

  // Traer todos los pagos al montar y tras cada pago
  const fetchPagos = async () => {
    try {
      const res = await authenticatedRequest(`${API_BASE_URL}/api/pagos`);
      if (res.ok) {
        const data = await res.json();
        setPagos(data);
      }
    } catch (e) {
      console.error('Error fetching pagos:', e);
    }
  };
  useEffect(() => {
    fetchPagos();
  }, []);

  // Filtrado y orden
  const reservasFiltradas = reservas.filter(r =>
    filtroEstado === 'todas' ? true : r.estado.toLowerCase() === filtroEstado
  );
  const reservasOrdenadas = reservasFiltradas.sort((a, b) =>
    new Date(b.fecha_inicio) - new Date(a.fecha_inicio)
  );

  // Cancelar (DELETE)
  const handleCancelarReserva = async (reservaId) => {
    if (!confirm('¿Seguro que quieres cancelar esta reserva?')) return;
    try {
      setLoading(true);
      const res = await authenticatedRequest(
        `${API_BASE_URL}/api/reservas/${reservaId}`,
        { method: 'DELETE' }
      );
      if (!res.ok) throw new Error();
      onUpdate();
      await fetchPagos();
    } catch {
      alert('Error al cancelar');
    } finally {
      setLoading(false);
    }
  };

  // Modificar personas (PUT)
  const handleModificarReserva = async (reservaId, cambios) => {
    try {
      setLoading(true);
      const res = await authenticatedRequest(
        `${API_BASE_URL}/api/reservas/${reservaId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cambios),
        }
      );
      if (!res.ok) throw new Error();
      onUpdate();
    } catch {
      alert('Error al modificar');
    } finally {
      setLoading(false);
    }
  };

  // Pagar (POST + recarga de pagos)
  const handlePagarReserva = async (reservaId) => {
    try {
      setLoading(true);
      const pagoRes = await authenticatedRequest(
        `${API_BASE_URL}/api/pagos`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reservaId, metodo_pago: 'transferencia' })
        }
      );
      if (!pagoRes.ok) throw new Error();
      await fetchPagos();
      onUpdate();
    } catch {
      alert('Error al registrar pago');
    } finally {
      setLoading(false);
    }
  };

  // Helpers UI
  const obtenerEstadoTexto = e => {
    const t = {
      pendiente: 'Pendiente',
      confirmada: 'Confirmada',
      cancelacion_pendiente: 'Cancelación Pendiente',
      cancelada: 'Cancelada',
      completada: 'Completada',
    };
    return t[e.toLowerCase()] || e;
  };

  return (
    <div>
      {/* Filtros */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFiltroEstado('todas')}
          className={`px-4 py-2 rounded-lg text-sm ${
            filtroEstado === 'todas'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Todas ({reservas.length})
        </button>
        {Object.values(ESTADOS_RESERVA).map(est => {
          const cnt = reservas.filter(r => r.estado.toLowerCase() === est).length;
          return (
            cnt > 0 && (
              <button
                key={est}
                onClick={() => setFiltroEstado(est)}
                className={`px-4 py-2 rounded-lg text-sm ${
                  filtroEstado === est
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {obtenerEstadoTexto(est)} ({cnt})
              </button>
            )
          );
        })}
      </div>

      {/* Lista */}
      {loading && reservas.length === 0 ? (
        <LoadingSpinner text="Cargando reservas..." />
      ) : reservasOrdenadas.length === 0 ? (
        <div className="text-center py-12">
          {/* … mensaje “sin reservas” … */}
        </div>
      ) : (
        <div className="space-y-4">
          {reservasOrdenadas.map(r => (
            <ReservaCard
              key={r.id}
              reserva={r}
              onCancelar={handleCancelarReserva}
              onModificar={handleModificarReserva}
              onPagar={handlePagarReserva}
              loading={loading}
              // Indico si ya existe pago para esta reserva
              isPaid={pagos.some(p => p.reserva_id === r.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReservasList;
