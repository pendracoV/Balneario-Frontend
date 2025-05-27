// src/components/servicios/ServiciosAdicionales.jsx
import { SERVICIOS_ADICIONALES } from '../../utils/constants';

const ServiciosAdicionales = ({ serviciosSeleccionados, onServiciosChange, diasReserva = 1 }) => {
  const servicios = [
    {
      id: 'cocina',
      ...SERVICIOS_ADICIONALES.COCINA,
      icono: '🍳',
      detalles: [
        'Cocina completa equipada',
        'Refrigerador y congelador',
        'Utensilios de cocina incluidos',
        'Espacio para preparar comidas familiares',
        'Área de lavado de platos'
      ],
      color: 'success'
    },
    {
      id: 'cuarto',
      ...SERVICIOS_ADICIONALES.CUARTO,
      icono: '🛏️',
      detalles: [
        'Habitación privada con baño',
        'Camas cómodas para descanso',
        'Aire acondicionado',
        'Ropa de cama incluida',
        'Perfecto para estadías nocturnas'
      ],
      color: 'secondary'
    }
  ];

  const handleServicioToggle = (servicioId) => {
    const nuevosServicios = serviciosSeleccionados.includes(servicioId)
      ? serviciosSeleccionados.filter(id => id !== servicioId)
      : [...serviciosSeleccionados, servicioId];
    
    onServiciosChange(nuevosServicios);
  };

  const calcularPrecioTotal = (precio) => {
    return precio * diasReserva;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {servicios.map((servicio) => {
          const isSelected = serviciosSeleccionados.includes(servicio.id);
          const precioTotal = calcularPrecioTotal(servicio.precio);

          return (
            <div
              key={servicio.id}
              className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all hover:shadow-lg ${
                isSelected
                  ? `border-${servicio.color}-500 bg-${servicio.color}-50 ring-2 ring-${servicio.color}-200`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleServicioToggle(servicio.id)}
            >
              {/* Checkbox */}
              <div className="absolute top-4 right-4">
                <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                  isSelected
                    ? `border-${servicio.color}-500 bg-${servicio.color}-500`
                    : 'border-gray-300'
                }`}>
                  {isSelected && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Contenido */}
              <div className="pr-8">
                <div className="flex items-center mb-3">
                  <span className="text-3xl mr-3">{servicio.icono}</span>
                  <div>
                    <h3 className={`text-xl font-semibold ${
                      isSelected ? `text-${servicio.color}-700` : 'text-gray-900'
                    }`}>
                      {servicio.nombre}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {servicio.descripcion}
                    </p>
                  </div>
                </div>

                {/* Precio */}
                <div className="mb-4">
                  <div className={`text-2xl font-bold ${
                    isSelected ? `text-${servicio.color}-600` : 'text-gray-900'
                  }`}>
                    ${precioTotal.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    ${servicio.precio.toLocaleString()}/día
                    {diasReserva > 1 && ` × ${diasReserva} días`}
                  </div>
                </div>

                {/* Detalles del servicio */}
                <div className="space-y-2">
                  {servicio.detalles.map((detalle, index) => (
                    <div key={index} className="flex items-start">
                      <svg className={`w-4 h-4 mt-0.5 mr-2 flex-shrink-0 ${
                        isSelected ? `text-${servicio.color}-500` : 'text-gray-400'
                      }`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-600">
                        {detalle}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Badge disponible */}
              <div className="absolute top-0 left-6 transform -translate-y-2">
                <span className={`bg-${servicio.color}-500 text-white text-xs font-medium px-2 py-1 rounded-full`}>
                  Disponible
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Resumen de servicios seleccionados */}
      {serviciosSeleccionados.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">
            Servicios seleccionados
          </h4>
          <div className="space-y-2">
            {serviciosSeleccionados.map(servicioId => {
              const servicio = servicios.find(s => s.id === servicioId);
              const precioTotal = calcularPrecioTotal(servicio.precio);
              
              return (
                <div key={servicioId} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">{servicio.icono}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {servicio.nombre}
                    </span>
                    {diasReserva > 1 && (
                      <span className="text-xs text-gray-500 ml-2">
                        ({diasReserva} días)
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    ${precioTotal.toLocaleString()}
                  </span>
                </div>
              );
            })}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between items-center font-semibold">
                <span>Total servicios adicionales:</span>
                <span>
                  ${serviciosSeleccionados.reduce((total, servicioId) => {
                    const servicio = servicios.find(s => s.id === servicioId);
                    return total + calcularPrecioTotal(servicio.precio);
                  }, 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Información adicional */}
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
        <div className="flex">
          <svg className="w-5 h-5 text-primary-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-primary-800">Sobre los servicios adicionales</h4>
            <div className="mt-1 text-xs text-primary-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Los servicios se pueden contratar incluso después de hacer la reserva</li>
                <li>La disponibilidad se verifica automáticamente para las fechas seleccionadas</li>
                <li>Los precios mostrados incluyen todo lo necesario para el servicio</li>
                <li>Solo las personas registradas en la reserva pueden acceder a los servicios</li>
                <li>Los servicios se facturan por día de uso</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiciosAdicionales;