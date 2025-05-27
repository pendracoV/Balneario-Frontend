// src/components/entradas/SeleccionHorario.jsx
import { PRECIOS, RESTRICCIONES } from '../../utils/constants';
import { formatearFecha, esFechaPasada, esFinDeSemana } from '../../utils/dateHelpers';

const SeleccionHorario = ({
  fecha,
  horario,
  jornada,
  numeroPersonas,
  onFechaChange,
  onHorarioChange,
  onJornadaChange,
  onPersonasChange,
  precioUnitario,
  espaciosDisponibles
}) => {
  
  const fechaMinima = new Date().toISOString().split('T')[0];
  const fechaMaxima = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const horarios = [
    {
      id: 'diurno',
      titulo: '☀️ Horario Diurno',
      descripcion: '9:00 AM - 12:00 PM y 2:00 PM - 6:00 PM',
      precio: PRECIOS.ENTRADA_DIURNA,
      icono: '☀️',
      color: 'primary',
      recomendado: true
    },
    {
      id: 'nocturno',
      titulo: '🌙 Horario Nocturno',
      descripcion: '6:00 PM - 11:00 PM',
      precio: PRECIOS.ENTRADA_NOCTURNA,
      icono: '🌙',
      color: 'secondary',
      recomendado: false
    }
  ];

  const jornadas = [
    {
      id: 'completa',
      titulo: 'Jornada Completa',
      descripcion: '9AM-12PM + 2PM-6PM',
      icono: '🌅🌆'
    },
    {
      id: 'manana',
      titulo: 'Solo Mañana',
      descripcion: '9:00 AM - 12:00 PM',
      icono: '🌅'
    },
    {
      id: 'tarde',
      titulo: 'Solo Tarde', 
      descripcion: '2:00 PM - 6:00 PM',
      icono: '🌆'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Selección de fecha */}
      <div className="bg-white p-6 rounded-lg shadow-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          📅 Selecciona la fecha
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de visita
            </label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => onFechaChange(e.target.value)}
              min={fechaMinima}
              max={fechaMaxima}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <div className="text-sm text-gray-600">
            {fecha && (
              <div>
                <p><strong>Día:</strong> {formatearFecha(fecha, { weekday: 'long' })}</p>
                <p><strong>Fecha:</strong> {formatearFecha(fecha, { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                {esFinDeSemana(fecha) && (
                  <p className="text-primary-600 font-medium mt-1">
                    🎉 ¡Fin de semana! - Perfecto para disfrutar en familia
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selección de horario */}
      <div className="bg-white p-6 rounded-lg shadow-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          ⏰ Selecciona el horario
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {horarios.map((opcionHorario) => (
            <label
              key={opcionHorario.id}
              className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                horario === opcionHorario.id
                  ? `border-${opcionHorario.color}-500 bg-${opcionHorario.color}-50 ring-2 ring-${opcionHorario.color}-200`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="horario"
                value={opcionHorario.id}
                checked={horario === opcionHorario.id}
                onChange={(e) => onHorarioChange(e.target.value)}
                className="sr-only"
              />
              
              {/* Badge recomendado */}
              {opcionHorario.recomendado && (
                <div className="absolute -top-2 -right-2">
                  <span className="bg-warning-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                    Popular
                  </span>
                </div>
              )}

              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                  horario === opcionHorario.id 
                    ? `border-${opcionHorario.color}-500 bg-${opcionHorario.color}-500` 
                    : 'border-gray-300'
                }`}>
                  {horario === opcionHorario.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>
                
                <div className="flex-1">
                  <div className="font-medium text-gray-900 mb-1">
                    {opcionHorario.titulo}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {opcionHorario.descripcion}
                  </div>
                  <div className={`text-lg font-bold ${
                    horario === opcionHorario.id 
                      ? `text-${opcionHorario.color}-600` 
                      : 'text-gray-700'
                  }`}>
                    ${opcionHorario.precio.toLocaleString()}/persona
                  </div>
                </div>
              </div>
            </label>
          ))}
        </div>

        {/* Jornadas específicas para horario diurno */}
        {horario === 'diurno' && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-md font-medium text-gray-900 mb-3">
              Jornada específica (opcional)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {jornadas.map((opcionJornada) => (
                <label
                  key={opcionJornada.id}
                  className={`p-3 border rounded-lg cursor-pointer text-center transition-all hover:shadow-sm ${
                    jornada === opcionJornada.id
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="jornada"
                    value={opcionJornada.id}
                    checked={jornada === opcionJornada.id}
                    onChange={(e) => onJornadaChange(e.target.value)}
                    className="sr-only"
                  />
                  <div className="text-lg mb-1">{opcionJornada.icono}</div>
                  <div className="font-medium text-sm">{opcionJornada.titulo}</div>
                  <div className="text-xs text-gray-600 mt-1">{opcionJornada.descripcion}</div>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Selección número de personas */}
      <div className="bg-white p-6 rounded-lg shadow-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          👥 Número de personas
        </h3>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">
              Cantidad de personas:
            </label>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => onPersonasChange(Math.max(1, numeroPersonas - 1))}
                className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                disabled={numeroPersonas <= 1}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
              
              <input
                type="number"
                value={numeroPersonas}
                onChange={(e) => onPersonasChange(Math.max(1, Math.min(espaciosDisponibles, parseInt(e.target.value) || 1)))}
                className="w-20 text-center border border-gray-300 rounded-md py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                min="1"
                max={espaciosDisponibles}
              />
              
              <button
                type="button"
                onClick={() => onPersonasChange(Math.min(espaciosDisponibles, numeroPersonas + 1))}
                className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                disabled={numeroPersonas >= espaciosDisponibles}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-600">
              Espacios disponibles: {espaciosDisponibles}
            </div>
            <div className="text-lg font-semibold text-gray-900">
              Total: ${(precioUnitario * numeroPersonas).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Advertencias */}
        {numeroPersonas > espaciosDisponibles && (
          <div className="mt-4 p-3 bg-error-50 border border-error-200 rounded-lg">
            <p className="text-sm text-error-800">
              ⚠️ No hay suficiente espacio. Solo quedan {espaciosDisponibles} espacios disponibles.
            </p>
          </div>
        )}

        {espaciosDisponibles < 10 && espaciosDisponibles > 0 && (
          <div className="mt-4 p-3 bg-warning-50 border border-warning-200 rounded-lg">
            <p className="text-sm text-warning-800">
              ⚡ ¡Últimos espacios disponibles! Solo quedan {espaciosDisponibles} lugares.
            </p>
          </div>
        )}

        {espaciosDisponibles === 0 && (
          <div className="mt-4 p-3 bg-error-50 border border-error-200 rounded-lg">
            <p className="text-sm text-error-800">
              ❌ No hay espacios disponibles para esta fecha y horario. Intenta con otro horario o fecha.
            </p>
          </div>
        )}
      </div>

      {/* Resumen del precio */}
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-medium text-primary-800">Resumen de tu entrada</h4>
            <p className="text-sm text-primary-700">
              {numeroPersonas} persona{numeroPersonas > 1 ? 's' : ''} × ${precioUnitario.toLocaleString()} 
              {horario === 'diurno' && jornada !== 'completa' && ` (${jornada})`}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary-800">
              ${(precioUnitario * numeroPersonas).toLocaleString()}
            </div>
            <div className="text-sm text-primary-600">
              Total a pagar
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeleccionHorario;