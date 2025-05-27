// src/context/ReservasContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { API_BASE_URL } from '../utils/constants';

const ReservasContext = createContext();

export const useReservas = () => {
  const context = useContext(ReservasContext);
  if (!context) {
    throw new Error('useReservas debe ser usado dentro de ReservasProvider');
  }
  return context;
};

export const ReservasProvider = ({ children }) => {
  const { authenticatedRequest, isAuthenticated } = useAuth();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar reservas del usuario
  const fetchReservas = async () => {
    if (!isAuthenticated()) return;

    try {
      setLoading(true);
      setError(null);

      const response = await authenticatedRequest(`${API_BASE_URL}/api/reservas`);
      const data = await response.json();
      
      // Filtrar solo las reservas del usuario actual si no es admin
      setReservas(data);
    } catch (error) {
      setError(error.message);
      console.error('Error al cargar reservas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Crear nueva reserva
  const crearReserva = async (reservaData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authenticatedRequest(`${API_BASE_URL}/api/reservas`, {
        method: 'POST',
        body: JSON.stringify(reservaData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear la reserva');
      }

      const nuevaReserva = await response.json();
      setReservas(prev => [nuevaReserva, ...prev]);
      
      return { success: true, reserva: nuevaReserva };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Actualizar reserva
  const actualizarReserva = async (reservaId, cambios) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authenticatedRequest(`${API_BASE_URL}/api/reservas/${reservaId}`, {
        method: 'PUT',
        body: JSON.stringify(cambios)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar la reserva');
      }

      const reservaActualizada = await response.json();
      setReservas(prev => prev.map(r => r.id === reservaId ? reservaActualizada : r));
      
      return { success: true, reserva: reservaActualizada };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Cancelar reserva
  const cancelarReserva = async (reservaId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authenticatedRequest(`${API_BASE_URL}/api/reservas/${reservaId}`, {
        method: 'PATCH',
        body: JSON.stringify({ estado: 'cancelacion_pendiente' })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al cancelar la reserva');
      }

      const reservaActualizada = await response.json();
      setReservas(prev => prev.map(r => r.id === reservaId ? reservaActualizada : r));
      
      return { success: true, reserva: reservaActualizada };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Actualizar personas en reserva
  const actualizarPersonas = async (reservaId, numeroPersonas) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authenticatedRequest(`${API_BASE_URL}/api/reservas/${reservaId}/personas`, {
        method: 'PATCH',
        body: JSON.stringify({ numeroPersonas })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar personas');
      }

      const reservaActualizada = await response.json();
      setReservas(prev => prev.map(r => r.id === reservaId ? reservaActualizada : r));
      
      return { success: true, reserva: reservaActualizada };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Actualizar servicios en reserva
  const actualizarServicios = async (reservaId, servicios) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authenticatedRequest(`${API_BASE_URL}/api/reservas/${reservaId}/servicios`, {
        method: 'PATCH',
        body: JSON.stringify({ servicios })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar servicios');
      }

      const reservaActualizada = await response.json();
      setReservas(prev => prev.map(r => r.id === reservaId ? reservaActualizada : r));
      
      return { success: true, reserva: reservaActualizada };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Verificar disponibilidad
  const verificarDisponibilidad = async (fecha, horario, tipo) => {
    try {
      const response = await authenticatedRequest(
        `${API_BASE_URL}/api/ocupacion?fecha=${fecha}&horario=${horario}&tipo=${tipo}`
      );

      if (!response.ok) {
        throw new Error('Error al verificar disponibilidad');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al verificar disponibilidad:', error);
      return { disponible: true, ocupacion: 0 }; // Fallback
    }
  };

  // Obtener estadísticas de reservas
  const obtenerEstadisticas = () => {
    const total = reservas.length;
    const pendientes = reservas.filter(r => r.estado === 'pendiente').length;
    const confirmadas = reservas.filter(r => r.estado === 'confirmada').length;
    const canceladas = reservas.filter(r => r.estado === 'cancelada').length;
    const completadas = reservas.filter(r => r.estado === 'completada').length;

    const proximasReservas = reservas
      .filter(r => new Date(r.fechaInicio) > new Date() && r.estado === 'confirmada')
      .sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio))
      .slice(0, 5);

    return {
      total,
      pendientes,
      confirmadas,
      canceladas,
      completadas,
      proximasReservas
    };
  };

  // Cargar reservas al autenticarse
  useEffect(() => {
    if (isAuthenticated()) {
      fetchReservas();
    } else {
      setReservas([]);
    }
  }, [isAuthenticated]);

  const value = {
    reservas,
    loading,
    error,
    fetchReservas,
    crearReserva,
    actualizarReserva,
    cancelarReserva,
    actualizarPersonas,
    actualizarServicios,
    verificarDisponibilidad,
    obtenerEstadisticas,
    setError
  };

  return (
    <ReservasContext.Provider value={value}>
      {children}
    </ReservasContext.Provider>
  );
};