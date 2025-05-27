// src/components/reservas/CalendarioReservas.jsx
import { useState, useEffect } from 'react';
import { HORARIOS } from '../../utils/constants';

const CalendarioReservas = ({
  fechaInicio,
  fechaFin,
  horario,
  jornada,
  tipo,
  onFechaInicioChange,
  onFechaFinChange,
  onHorarioChange,
  onJornadaChange
}) => {
  const [fechasOcupadas, setFechasOcupadas] = useState([]);
  const [permitirMultiplesDias, setPermitirMultiplesDias] = useState(false);

  // Obtener fecha mínima (hoy)
  const fechaMinima = new Date().toISOString().split('T')[0];
  
  // Obtener fecha máxima (90 días en el futuro)
  const fechaMaxima = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  useEffect(() => {
    // Aquí podrías cargar las fechas ocupadas desde la API
    // Por ahora simulamos algunas fechas ocupadas
    const fechasEjemplo = [
      '2024-12-25', // Navidad
      '2024-12-31', // Año nuevo
      '2024-01-01',
    ];
    setFechasOcupadas(fechasEjemplo);
  }, []);

  const esFechaOcupada = (fecha) => {
    return fechasOcupadas.includes(fecha);
  };

  const esFinDeSemana = (fecha) => {
    const dia = new Date(fecha).getDay();
    return dia === 0 || dia === 6; // Domingo o Sábado
  };

  const handleFechaInicioChange = (fecha) => {
    onFechaInicioChange(fecha);
    
    // Si no permite múltiples días, setear fecha fin igual a fecha inicio
    if (!permitirMultiplesDias) {
      onFechaFinChange(fecha);
    }
    
    // Si la fecha fin es menor que la fecha inicio, actualizarla
    if (fechaFin && fecha > fechaFin) {
      onFechaFinChange(fecha);
    }
  };

  const handleFechaFinChange = (fecha) => {
    // La fecha fin no puede ser menor que la fecha inicio
    if (fechaInicio && fecha < fechaInicio) {
      return;
    }
    onFechaFinChange(fecha);
  };

  const toggleMultiplesDias = () => {
    const nuevoValor = !permitirMultiplesDias;
    setPermitirMultiplesDias(nuevoValor);
    
    // Si se desactiva múltiples días, igualar fecha fin a fecha inicio
    if (!nuevoValor && fechaInicio) {
      onFechaFinChange(fechaInicio);
    }
  };

  return (
    <div className="space-y-6">
      {/* Selección de fechas */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Selecciona las fechas
        </h3>
        
        {/* Toggle para múltiples días */}
        <div className="flex items-center mb-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={permitirMultiplesDias}
              onChange={toggleMultiplesDias}
              className="form-checkbox h-4 w-4 text-primary-600 transition duration-150 ease-in-out"
            />
            <span className="ml-2 text-sm text-gray-700">
              Reserva para múltiples días
            </span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Fecha de inicio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {permitirMultiplesDias ? 'Fecha de inicio' : 'Fecha de la reserva'}
            </label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => handleFechaInicioChange(e.target.value)}
              min={fechaMinima}
              max={fechaMaxima}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
            {fechaInicio && esFinDeSemana(fechaInicio) && (
              <p className="mt-1 text-xs text-warning-600">
                ⚠️ Fin de semana - Precios y mínimos diferentes
              </p>
            )}
          </div>

          {/* Fecha de fin (solo si permite múltiples días) */}
          {permitirMultiplesDias && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de fin
              </label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => handleFechaFinChange(e.target.value)}
                min={fechaInicio || fechaMinima}
                max={fechaMaxima}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
              {fechaFin && fechaInicio && fechaFin !== fechaInicio && (
                <p className="mt-1 text-xs text-gray-600">
                  📅 Reserva por {Math.ceil((new Date(fechaFin) - new Date(fechaInicio)) / (1000 * 60 * 60 * 24)) + 1} días
                </p>
              )}
            </div>
          )}
        </div>

        {/* Información adicional sobre fechas ocupadas */}
        {fechasOcupadas.length > 0 && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Fechas no disponibles:</strong>
            </p>
            <div className="flex flex-wrap gap-2">
              {fechasOcupadas.map(fecha => (
                <span key={fecha} className="text-xs bg-error-100 text-error-800 px-2 py-1 rounded">
                  {new Date(fecha).toLocaleDateString()}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Selección de horario */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Selecciona el horario
        </h3>

        {/* Selector de horario general */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <label className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
            horario === 'diurno' 
              ? 'border-primary-500 bg-primary-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}>
            <input
              type="radio"
              name="horario"
              value="diurno"
              checked={horario === 'diurno'}
              onChange={(e) => onHorarioChange(e.target.value)}
              className="sr-only"
            />
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                horario === 'diurno' ? 'border-primary-500 bg-primary-500' : 'border-gray-300'
              }`}>
                {horario === 'diurno' && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </div>
              <div>
                <div className="font-medium text-gray-900">☀️ Horario Diurno</div>
                <div className="text-sm text-gray-600">
                  9:00 AM - 12:00 PM y 2:00 PM - 6:00 PM
                </div>
                <div className="text-sm font-medium text-primary-600">
                  {tipo === 'general' ? `${5000}/persona` : 'Ver precio por tipo'}
                </div>
              </div>
            </div>
          </label>

          <label className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
            horario === 'nocturno' 
              ? 'border-secondary-500 bg-secondary-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}>
            <input
              type="radio"
              name="horario"
              value="nocturno"
              checked={horario === 'nocturno'}
              onChange={(e) => onHorarioChange(e.target.value)}
              className="sr-only"
            />
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                horario === 'nocturno' ? 'border-secondary-500 bg-secondary-500' : 'border-gray-300'
              }`}>
                {horario === 'nocturno' && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </div>
              <div>
                <div className="font-medium text-gray-900">🌙 Horario Nocturno</div>
                <div className="text-sm text-gray-600">
                  6:00 PM - 11:00 PM
                </div>
                <div className="text-sm font-medium text-secondary-600">
                  {tipo === 'general' ? `${10000}/persona` : 'Ver precio por tipo'}
                </div>
              </div>
            </div>
          </label>
        </div>

        {/* Jornadas específicas (solo para horario diurno) */}
        {horario === 'diurno' && (
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">
              Jornada específica (opcional)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <label className={`p-3 border rounded-lg cursor-pointer text-center transition-all ${
                jornada === 'completa'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="jornada"
                  value="completa"
                  checked={jornada === 'completa'}
                  onChange={(e) => onJornadaChange(e.target.value)}
                  className="sr-only"
                />
                <div className="font-medium">Jornada Completa</div>
                <div className="text-xs text-gray-600">9AM-12PM + 2PM-6PM</div>
              </label>

              <label className={`p-3 border rounded-lg cursor-pointer text-center transition-all ${
                jornada === 'manana'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="jornada"
                  value="manana"
                  checked={jornada === 'manana'}
                  onChange={(e) => onJornadaChange(e.target.value)}
                  className="sr-only"
                />
                <div className="font-medium">Solo Mañana</div>
                <div className="text-xs text-gray-600">9:00 AM - 12:00 PM</div>
              </label>

              <label className={`p-3 border rounded-lg cursor-pointer text-center transition-all ${
                jornada === 'tarde'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="jornada"
                  value="tarde"
                  checked={jornada === 'tarde'}
                  onChange={(e) => onJornadaChange(e.target.value)}
                  className="sr-only"
                />
                <div className="font-medium">Solo Tarde</div>
                <div className="text-xs text-gray-600">2:00 PM - 6:00 PM</div>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Información importante */}
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
        <div className="flex">
          <svg className="w-5 h-5 text-primary-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-primary-800">Información importante</h4>
            <div className="mt-1 text-xs text-primary-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Las reservas se confirman solo después del pago correspondiente</li>
                <li>Puedes cancelar hasta 12 horas antes sin costo adicional</li>
                <li>Los fines de semana tienen precios y requisitos diferentes</li>
                {tipo === 'privada' && (
                  <li>Las reservas privadas bloquean las entradas generales para la fecha seleccionada</li>
                )}
                <li>Revisa la disponibilidad antes de proceder al pago</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarioReservas;