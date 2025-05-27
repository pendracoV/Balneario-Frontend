// src/components/reservas/TipoReservaSelector.jsx
import { PRECIOS, RESTRICCIONES } from '../../utils/constants';

const TipoReservaSelector = ({ tipoSeleccionado, onTipoChange }) => {
  const opciones = [
    {
      id: 'privada',
      titulo: 'Reserva Privada',
      descripcion: 'Exclusiva para tu grupo, con el balneario completo para ustedes',
      caracteristicas: [
        `Entre semana: $${PRECIOS.RESERVA_PRIVADA_SEMANA.toLocaleString()}/persona (mín. ${RESTRICCIONES.MIN_PERSONAS_PRIVADA_SEMANA} personas)`,
        `Fin de semana: $${PRECIOS.RESERVA_PRIVADA_FINDE.toLocaleString()}/persona (mín. ${RESTRICCIONES.MIN_PERSONAS_PRIVADA_FINDE} personas)`,
        'Acceso exclusivo a todas las instalaciones',
        'Privacidad total para tu evento',
        `Cargo adicional de $${PRECIOS.CARGO_MINIMO_PERSONAS.toLocaleString()} si no alcanzas el mínimo`
      ],
      icono: '🏠',
      color: 'primary'
    },
    {
      id: 'general',
      titulo: 'Entrada General',
      descripcion: 'Comparte el espacio con otros visitantes en un ambiente familiar',
      caracteristicas: [
        `Diurno: $${PRECIOS.ENTRADA_DIURNA.toLocaleString()}/persona (9AM-12PM, 2PM-6PM)`,
        `Nocturno: $${PRECIOS.ENTRADA_NOCTURNA.toLocaleString()}/persona (6PM-11PM)`,
        'Acceso a todas las piscinas y áreas comunes',
        'Ambiente social y familiar',
        'Sujeto a disponibilidad de aforo'
      ],
      icono: '👥',
      color: 'secondary'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {opciones.map((opcion) => (
        <div
          key={opcion.id}
          onClick={() => onTipoChange(opcion.id)}
          className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg ${
            tipoSeleccionado === opcion.id
              ? `border-${opcion.color}-500 bg-${opcion.color}-50 ring-2 ring-${opcion.color}-200`
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          {/* Radio button */}
          <div className="absolute top-4 right-4">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              tipoSeleccionado === opcion.id
                ? `border-${opcion.color}-500 bg-${opcion.color}-500`
                : 'border-gray-300'
            }`}>
              {tipoSeleccionado === opcion.id && (
                <div className="w-2 h-2 bg-white rounded-full"></div>
              )}
            </div>
          </div>

          {/* Contenido */}
          <div className="pr-8">
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-3">{opcion.icono}</span>
              <h3 className={`text-xl font-semibold ${
                tipoSeleccionado === opcion.id ? `text-${opcion.color}-700` : 'text-gray-900'
              }`}>
                {opcion.titulo}
              </h3>
            </div>

            <p className="text-gray-600 mb-4">
              {opcion.descripcion}
            </p>

            <div className="space-y-2">
              {opcion.caracteristicas.map((caracteristica, index) => (
                <div key={index} className="flex items-start">
                  <svg className={`w-4 h-4 mt-0.5 mr-2 flex-shrink-0 ${
                    tipoSeleccionado === opcion.id ? `text-${opcion.color}-500` : 'text-gray-400'
                  }`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-600">
                    {caracteristica}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Badge recomendado */}
          {opcion.id === 'privada' && (
            <div className="absolute top-0 left-6 transform -translate-y-2">
              <span className="bg-warning-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                Popular
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TipoReservaSelector;