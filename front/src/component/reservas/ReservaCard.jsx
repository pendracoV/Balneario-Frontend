import React, { useState, useMemo, useCallback } from 'react';
import { SERVICIOS_ADICIONALES } from '../../utils/constants';

const ESTADO_COLOR = {
  pendiente:           'bg-warning-100 text-warning-800 border-warning-200',
  confirmada:          'bg-success-100 text-success-800 border-success-200',
  cancelacion_pendiente:'bg-error-100 text-error-800 border-error-200',
  cancelada:           'bg-gray-100 text-gray-800 border-gray-200',
  completada:          'bg-primary-100 text-primary-800 border-primary-200',
};
const ESTADO_TEXTO = {
  pendiente:           'Pendiente de Pago',
  confirmada:          'Confirmada',
  cancelacion_pendiente:'Cancelación Pendiente',
  cancelada:           'Cancelada',
  completada:          'Completada',
};

const formatDate = iso =>
  (!iso || isNaN(Date.parse(iso)))
    ? '–'
    : new Date(iso).toLocaleDateString('es-ES', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });

const daysUntil = iso => {
  if (!iso || isNaN(Date.parse(iso))) return null;
  const diffMs = new Date(iso) - new Date();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
};

const calcDuration = (startIso, endIso) => {
  if (!startIso || isNaN(Date.parse(startIso))) return '–';
  if (!endIso || endIso === startIso) return 1;
  const diffMs = new Date(endIso) - new Date(startIso);
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1;
};

const ReservaCard = ({
  reserva,
  onCancelar,
  onModificar,
  onPagar,
  isPaid,
  loading
}) => {
  const {
    id,
    tipo = {},
    fecha_inicio,
    fecha_fin,
    personas,
    precio_total,
    servicios = [],
    servicios_total,
    cargo_minimo,
    observaciones,
    created_at,
    estado: estadoRaw,
    horario_inicio,
    horario_fin
  } = reserva;

  // Parseo todos los valores monetarios a números:
  const precioTotal    = parseFloat(precio_total)    || 0;
  const serviciosTotal = parseFloat(servicios_total) || 0;
  const cargoMinimoNum = parseFloat(cargo_minimo)    || 0;

  const fechaInicio    = fecha_inicio;
  const fechaFin       = fecha_fin;
  const origPeople     = personas;
  const serviciosAdicionales = servicios.map(s => s.nombre);
  const createdAt      = created_at;
  const estado         = isPaid ? 'confirmada' : estadoRaw.toLowerCase();
  const horario        = `${horario_inicio.slice(0,5)} - ${horario_fin.slice(0,5)}`;

  const [showDetails, setShowDetails]     = useState(false);
  const [editingPeople, setEditingPeople] = useState(false);
  const [people, setPeople]               = useState(origPeople);

  const canModify    = useMemo(() => ['pendiente','confirmada'].includes(estado), [estado]);
  const isPastStart  = useMemo(() => fechaInicio && daysUntil(fechaInicio) < 0, [fechaInicio]);
  const durationDays = useMemo(() => calcDuration(fechaInicio, fechaFin), [fechaInicio, fechaFin]);

  const savePeople = useCallback(() => {
    if (people !== origPeople) {
      onModificar(id, { personas: people });
    }
    setEditingPeople(false);
  }, [people, origPeople, id, onModificar]);

  const handleCancel = useCallback(() => onCancelar(id), [id, onCancelar]);
  const handlePay    = useCallback(() => onPagar(id), [id, onPagar]);

  return (
    <div className="bg-white border rounded-lg shadow-card hover:shadow-card-hover transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-primary-600 capitalize">
              {tipo.nombre || '–'}
            </h3>
            <p className="text-sm text-gray-600">ID: #{id}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${ESTADO_COLOR[estado]}`}>
            {ESTADO_TEXTO[estado] || estadoRaw}
          </span>
        </div>

        {/* Grid principal */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <strong className="text-gray-500">Fecha:</strong>
            <p>{formatDate(fechaInicio)}</p>
            {fechaFin && fechaFin !== fechaInicio && (
              <p className="text-xs text-gray-500">hasta {formatDate(fechaFin)}</p>
            )}
          </div>
          <div>
            <strong className="text-gray-500">Personas:</strong>
            {editingPeople ? (
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={people}
                  onChange={e => setPeople(+e.target.value || 1)}
                  className="w-16 px-2 py-1 border rounded"
                  min="1" max="120"
                />
                <button onClick={savePeople} disabled={loading}>✓</button>
                <button onClick={() => { setEditingPeople(false); setPeople(origPeople); }}>✕</button>
              </div>
            ) : (
              <div className="flex items-center">
                <span>{people ?? '–'}</span>
                {canModify && !isPastStart && (
                  <button onClick={() => setEditingPeople(true)} className="ml-2">✏️</button>
                )}
              </div>
            )}
          </div>
          <div>
            <strong className="text-gray-500">Horario:</strong>
            <p>{horario || '–'}</p>
          </div>
          <div>
            <strong className="text-gray-500">Total:</strong>
            <p className="font-semibold">${precioTotal.toLocaleString()}</p>
          </div>
        </div>

        {/* Servicios adicionales */}
        {serviciosAdicionales.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <strong className="text-sm text-gray-500">Servicios adicionales:</strong>
            <div className="flex flex-wrap gap-2 mt-1">
              {serviciosAdicionales.map(s => {
                const info = SERVICIOS_ADICIONALES[s.toUpperCase()] || {};
                return (
                  <span key={s} className="px-2 py-1 bg-primary-100 rounded-full text-xs">
                    {info.emoji || '🔧'} {info.nombre || s}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Observaciones */}
        {observaciones && (
          <div className="mt-4 pt-4 border-t">
            <strong className="text-sm text-gray-500">Observaciones:</strong>
            <p className="mt-1">{observaciones}</p>
          </div>
        )}

        {/* Footer acciones */}
        <div className="mt-6 bg-gray-50 px-6 py-4 border-t flex justify-between items-center">
          <div className="flex space-x-4">
            <button onClick={() => setShowDetails(d => !d)} className="text-sm text-primary-600">
              {showDetails ? 'Ocultar detalles' : 'Ver detalles'}
            </button>
            {estado === 'confirmada' && <span className="text-success-600">✓ Pagado</span>}
            {estado === 'pendiente'  && <span className="text-warning-600">⏳ Pendiente</span>}
          </div>
          <div className="flex space-x-2">
            {canModify && !isPastStart && (
              <button
                onClick={handleCancel}
                disabled={loading}
                className="px-3 py-1 text-error-600 border rounded"
              >
                {loading ? 'Cancelando...' : 'Cancelar'}
              </button>
            )}
            {estado === 'pendiente' && !isPaid && (
              <button
                onClick={handlePay}
                disabled={loading}
                className="px-3 py-1 bg-success-600 text-white rounded"
              >
                {loading ? 'Procesando...' : 'Pagar'}
              </button>
            )}
          </div>
        </div>

        {/* Detalles expandidos */}
        {showDetails && (
          <div className="mt-4 px-6 py-4 border-t bg-gray-50 text-sm grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Información detallada</h4>
              <p><strong>Tipo:</strong> {tipo.nombre === 'privada' ? 'Privada' : 'General'}</p>
              <p><strong>Duración:</strong> {durationDays} día{durationDays > 1 ? 's' : ''}</p>
              <p><strong>Creada:</strong> {formatDate(createdAt)}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Desglose de precios</h4>
              {serviciosTotal > 0 && (
                <p>
                  <strong>Servicios:</strong>{' '}
                  ${serviciosTotal.toLocaleString()}
                </p>
              )}
              {cargoMinimoNum > 0 && (
                <p>
                  <strong>Cargo mínimo:</strong>{' '}
                  ${cargoMinimoNum.toLocaleString()}
                </p>
              )}
              <p className="mt-2 font-semibold">
                <strong>Total:</strong> ${precioTotal.toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservaCard;
