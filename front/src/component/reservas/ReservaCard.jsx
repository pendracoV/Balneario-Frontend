// src/components/reservas/ReservaCard.jsx
import { useState } from 'react';
import { SERVICIOS_ADICIONALES } from '../../utils/constants';

const ReservaCard = ({ reserva, onCancelar, onModificar, loading }) => {
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [editandoPersonas, setEditandoPersonas] = useState(false);
  const [nuevasPersonas, setNuevasPersonas] = useState(reserva.numeroPersonas);

  const obtenerEstadoColor = (estado) => {
    const colores = {
      'pendiente': 'bg-warning-100 text-warning-800 border-warning-200',
      'confirmada': 'bg-success-100 text-success-800 border-success-200',
      'cancelacion_pendiente': 'bg-error-100 text-error-800 border-error-200',
      'cancelada': 'bg-gray-100 text-gray-800 border-gray-200',
      'completada': 'bg-primary-100 text-primary-800 border-primary-200'
    };
    return colores[estado] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const obtenerEstadoTexto = (estado) => {
    const textos = {
      'pendiente': 'Pendiente de Pago',
      'confirmada': 'Confirmada',
      'cancelacion_pendiente': 'Cancelación Pendiente',
      'cancelada': 'Cancelada',
      'completada': 'Completada'
    };
    return textos[estado] || estado;
  };

  const puedeModificar = () => {
    return reserva.estado === 'pendiente' || reserva.estado === 'confirmada';
  };

  const puedeCancelar = () => {
    return reserva.estado === 'pendiente' || reserva.estado === 'confirmada';
  };

  const fechaEsPasada = () => {
    return new Date(reserva.fechaInicio) < new Date();
  };

  const diasHastaReserva = () => {
    const hoy = new Date();
    const fechaReserva = new Date(reserva.fechaInicio);
    const diffTime = fechaReserva.getTime() - hoy.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleGuardarPersonas = () => {
    if (nuevasPersonas !== reserva.numeroPersonas) {
      onModificar(reserva.id, { numeroPersonas: nuevasPersonas });
    }
    setEditandoPersonas(false);
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calcularDias = () => {
    if (!reserva.fechaFin || reserva.fechaFin === reserva.fechaInicio) return 1;
    return Math.ceil((new Date(reserva.fechaFin) - new Date(reserva.fechaInicio)) / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-card hover:shadow-card-hover transition-shadow">
      {/* Header de la card */}
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-3">
                {reserva.tipo === 'privada' ? '🏠' : '👥'}
              </span>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 capitalize">
                  Reserva {reserva.tipo}
                </h3>
                <p className="text-sm text-gray-600">
                  ID: #{reserva.id}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-500">Fecha:</span>
                <p className="text-gray-900">
                  {formatearFecha(reserva.fechaInicio)}
                </p>
                {reserva.fechaFin && reserva.fechaFin !== reserva.fechaInicio && (
                  <p className="text-xs text-gray-500">
                    hasta {new Date(reserva.fechaFin).toLocaleDateString()}
                  </p>
                )}
              </div>

              <div>
                <span className="font-medium text-gray-500">Personas:</span>
                <div className="flex items-center">
                  {editandoPersonas ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={nuevasPersonas}
                        onChange={(e) => setNuevasPersonas(parseInt(e.target.value) || 1)}
                        className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
                        min="1"
                        max="120"
                      />
                      <button
                        onClick={handleGuardarPersonas}
                        className="text-success-600 hover:text-success-700"
                        disabled={loading}
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => {
                          setEditandoPersonas(false);
                          setNuevasPersonas(reserva.numeroPersonas);
                        }}
                        className="text-error-600 hover:text-error-700"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span className="text-gray-900">{reserva.numeroPersonas}</span>
                      {puedeModificar() && !fechaEsPasada() && (
                        <button
                          onClick={() => setEditandoPersonas(true)}
                          className="ml-2 text-primary-600 hover:text-primary-700"
                          title="Editar número de personas"
                        >
                          ✏️
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <span className="font-medium text-gray-500">Horario:</span>
                <p className="text-gray-900 capitalize">
                  {reserva.horario}
                  {reserva.jornada && reserva.jornada !== 'completa' && (
                    <span className="text-xs text-gray-500 block">
                      ({reserva.jornada})
                    </span>
                  )}
                </p>
              </div>

              <div>
                <span className="font-medium text-gray-500">Total:</span>
                <p className="text-lg font-semibold text-gray-900">
                  ${reserva.precioTotal?.toLocaleString() || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Estado y acciones */}
          <div className="flex flex-col items-end space-y-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${obtenerEstadoColor(reserva.estado)}`}>
              {obtenerEstadoTexto(reserva.estado)}
            </span>

            {/* Días hasta la reserva */}
            {!fechaEsPasada() && reserva.estado === 'confirmada' && (
              <span className="text-xs text-gray-500">
                {diasHastaReserva() === 0 ? '¡Hoy!' : 
                 diasHastaReserva() === 1 ? 'Mañana' : 
                 `En ${diasHastaReserva()} días`}
              </span>
            )}
          </div>
        </div>

        {/* Servicios adicionales */}
        {reserva.serviciosAdicionales && reserva.serviciosAdicionales.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <span className="text-sm font-medium text-gray-500">Servicios adicionales:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {reserva.serviciosAdicionales.map(servicio => {
                const servicioInfo = SERVICIOS_ADICIONALES[servicio.toUpperCase()];
                return (
                  <span key={servicio} className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                    {servicio === 'cocina' ? '🍳' : '🛏️'} {servicioInfo?.nombre || servicio}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Observaciones */}
        {reserva.observaciones && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <span className="text-sm font-medium text-gray-500">Observaciones:</span>
            <p className="text-sm text-gray-700 mt-1">{reserva.observaciones}</p>
          </div>
        )}
      </div>

      {/* Footer con acciones */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMostrarDetalles(!mostrarDetalles)}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              {mostrarDetalles ? 'Ocultar detalles' : 'Ver detalles'}
            </button>

            {reserva.estado === 'confirmada' && (
              <span className="text-xs text-success-600 font-medium">
                ✓ Pagado
              </span>
            )}

            {reserva.estado === 'pendiente' && (
              <span className="text-xs text-warning-600 font-medium">
                ⏳ Pendiente de pago
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {puedeModificar() && !fechaEsPasada() && (
              <button
                onClick={() => alert('Función de modificar en desarrollo')}
                className="px-3 py-1 text-sm text-primary-600 hover:text-primary-700 border border-primary-300 hover:border-primary-400 rounded transition-colors"
                disabled={loading}
              >
                Modificar
              </button>
            )}

            {puedeCancelar() && !fechaEsPasada() && (
              <button
                onClick={() => onCancelar(reserva.id)}
                className="px-3 py-1 text-sm text-error-600 hover:text-error-700 border border-error-300 hover:border-error-400 rounded transition-colors"
                disabled={loading}
              >
                {loading ? 'Cancelando...' : 'Cancelar'}
              </button>
            )}

            {reserva.estado === 'pendiente' && (
              <button
                onClick={() => alert('Redirigir a pago')}
                className="px-3 py-1 text-sm bg-success-600 hover:bg-success-700 text-white rounded transition-colors"
              >
                Pagar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Detalles expandidos */}
      {mostrarDetalles && (
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Información detallada</h4>
              <div className="space-y-1 text-gray-600">
                <p><strong>Tipo:</strong> {reserva.tipo === 'privada' ? 'Reserva Privada' : 'Entrada General'}</p>
                <p><strong>Duración:</strong> {calcularDias()} día{calcularDias() > 1 ? 's' : ''}</p>
                <p><strong>Horario:</strong> {reserva.horario} {reserva.jornada && `(${reserva.jornada})`}</p>
                <p><strong>Creada:</strong> {new Date(reserva.createdAt || Date.now()).toLocaleDateString()}</p>
              </div>
            </div>

            {reserva.precioTotal && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Desglose de precios</h4>
                <div className="space-y-1 text-gray-600">
                  <p><strong>Precio base:</strong> ${(reserva.precioTotal - (reserva.serviciosTotal || 0) - (reserva.cargoMinimo || 0)).toLocaleString()}</p>
                  {reserva.serviciosTotal > 0 && (
                    <p><strong>Servicios adicionales:</strong> ${reserva.serviciosTotal.toLocaleString()}</p>
                  )}
                  {reserva.cargoMinimo > 0 && (
                    <p><strong>Cargo mínimo personas:</strong> ${reserva.cargoMinimo.toLocaleString()}</p>
                  )}
                  <div className="border-t pt-1 mt-2">
                    <p className="font-semibold"><strong>Total:</strong> ${reserva.precioTotal.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservaCard;