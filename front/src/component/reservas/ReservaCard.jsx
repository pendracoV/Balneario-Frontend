import React, { useState } from 'react';
import { SERVICIOS_ADICIONALES } from '../../utils/constants';

const ReservaCard = ({ reserva, onCancelar, onModificar, loading }) => {
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [editandoPersonas, setEditandoPersonas] = useState(false);
  const [nuevasPersonas, setNuevasPersonas] = useState(reserva.numeroPersonas);

  // Colores según estado
  const obtenerEstadoColor = (estado) => {
    const colores = {
      pendiente: 'bg-warning-100 text-warning-800 border-warning-200',
      confirmada: 'bg-success-100 text-success-800 border-success-200',
      cancelacion_pendiente: 'bg-error-100 text-error-800 border-error-200',
      cancelada: 'bg-gray-100 text-gray-800 border-gray-200',
      completada: 'bg-primary-100 text-primary-800 border-primary-200',
    };
    return colores[estado] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Texto legible según estado
  const obtenerEstadoTexto = (estado) => {
    const textos = {
      pendiente: 'Pendiente de Pago',
      confirmada: 'Confirmada',
      cancelacion_pendiente: 'Cancelación Pendiente',
      cancelada: 'Cancelada',
      completada: 'Completada',
    };
    return textos[estado] || estado;
  };

  // Permisos de modificar/cancelar
  const puedeModificar = () => ['pendiente', 'confirmada'].includes(reserva.estado);
  const puedeCancelar = () => ['pendiente', 'confirmada'].includes(reserva.estado);

  // Comprueba si la fecha de inicio ya pasó
  const fechaEsPasada = () => {
    if (!reserva.fechaInicio || isNaN(Date.parse(reserva.fechaInicio))) return false;
    return new Date(reserva.fechaInicio) < new Date();
  };

  // Calcula días hasta la reserva
  const diasHastaReserva = () => {
    if (!reserva.fechaInicio || isNaN(Date.parse(reserva.fechaInicio))) return null;
    const hoy = new Date();
    const fechaR = new Date(reserva.fechaInicio);
    const diff = fechaR.getTime() - hoy.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  // Guarda el nuevo número de personas
  const handleGuardarPersonas = () => {
    if (nuevasPersonas !== reserva.numeroPersonas) {
      onModificar(reserva.id, { numeroPersonas: nuevasPersonas });
    }
    setEditandoPersonas(false);
  };

  // Formatea fechas de forma segura
  const formatearFecha = (fecha) => {
    if (!fecha || isNaN(Date.parse(fecha))) return '–';
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  // Calcula duración de la reserva en días
  const calcularDias = () => {
    const inicio = reserva.fechaInicio;
    const fin    = reserva.fechaFin;
    if (!inicio || isNaN(Date.parse(inicio))) return '–';
    if (!fin || fin === inicio) return 1;
    const diff = new Date(fin) - new Date(inicio);
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-card hover:shadow-card-hover transition-shadow">
      {/* Contenido principal */}
      <div className="p-6">
        {/* Header: tipo y ID */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3 font-bold text-primary-600">
                {reserva.tipo?.nombre || '–'}
              </span>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 capitalize">
                  Reserva {reserva.tipo?.nombre || '–'}
                </h3>
                <p className="text-sm text-gray-600">ID: #{reserva.id}</p>
              </div>
            </div>

            {/* Grid de datos principales */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {/* Fecha */}
              <div>
                <span className="font-medium text-gray-500">Fecha:</span>
                <p className="text-gray-900">
                  {formatearFecha(reserva.fechaInicio)}
                </p>
                {reserva.fechaFin && reserva.fechaFin !== reserva.fechaInicio && (
                  <p className="text-xs text-gray-500">
                    hasta {formatearFecha(reserva.fechaFin)}
                  </p>
                )}
              </div>

              {/* Personas */}
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
                        onClick={() => { setEditandoPersonas(false); setNuevasPersonas(reserva.numeroPersonas); }}
                        className="text-error-600 hover:text-error-700"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span className="text-gray-900">
                        {typeof reserva.numeroPersonas === 'number'
                          ? reserva.numeroPersonas
                          : '–'}
                      </span>
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

              {/* Horario */}
              <div>
                <span className="font-medium text-gray-500">Horario:</span>
                <p className="text-gray-900 capitalize">
                  {reserva.horario || '–'}
                  {reserva.jornada && reserva.jornada !== 'completa' && (
                    <span className="text-xs text-gray-500 block">
                      ({reserva.jornada})
                    </span>
                  )}
                </p>
              </div>

              {/* Total */}
              <div>
                <span className="font-medium text-gray-500">Total:</span>
                <p className="text-lg font-semibold text-gray-900">
                  {typeof reserva.precioTotal === 'number'
                    ? `$${reserva.precioTotal.toLocaleString()}`
                    : '–'}
                </p>
              </div>
            </div>

            {/* Servicios adicionales */}
            {reserva.serviciosAdicionales?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <span className="text-sm font-medium text-gray-500">Servicios adicionales:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {reserva.serviciosAdicionales.map((servicio) => {
                    const info = SERVICIOS_ADICIONALES[servicio.toUpperCase()];
                    const icono = servicio === 'cocina' ? '🍳' : '🛏️';
                    return (
                      <span
                        key={servicio}
                        className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full"
                      >
                        {icono} {info?.nombre || servicio}
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

          {/* Footer acciones */}
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
                  <span className="text-xs text-success-600 font-medium">✓ Pagado</span>
                )}
                {reserva.estado === 'pendiente' && (
                  <span className="text-xs text-warning-600 font-medium">⏳ Pendiente de pago</span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {puedeModificar() && !fechaEsPasada() && (
                  <button
                    onClick={() => onCancelar(reserva.id)}
                    disabled={loading}
                    className="px-3 py-1 text-sm text-error-600 hover:text-error-700 border border-error-300 hover:border-error-400 rounded transition-colors"
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
                      <p><strong>Horario:</strong> {reserva.horario || '–'} {reserva.jornada && `(${reserva.jornada})`}</p>
                      <p><strong>Creada:</strong> {formatearFecha(reserva.createdAt)}</p>
                    </div>
                  </div>

                  {typeof reserva.precioTotal === 'number' && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Desglose de precios</h4>
                      <div className="space-y-1 text-gray-600">
                        <p><strong>Precio base:</strong> ${((reserva.precioTotal || 0) - (reserva.serviciosTotal || 0) - (reserva.cargoMinimo || 0)).toLocaleString()}</p>
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
        </div>
      </div>
    
  )
};
export default ReservaCard;
