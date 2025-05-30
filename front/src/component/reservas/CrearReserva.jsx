import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL, PRECIOS, RESTRICCIONES, HORARIOS, SERVICIOS_ADICIONALES } from '../../utils/constants';
import TipoReservaSelector from './TipoReservaSelector';
import CalendarioReservas from './CalendarioReservas';
import ServiciosAdicionales from '../servicios/ServiciosAdicionales';

const CrearReserva = ({ onReservaCreada }) => {
  const { authenticatedRequest, user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    tipo: 1,
    fechaInicio: '',
    fechaFin: '',
    horario: 'diurno',
    jornada: 'completa',
    numeroPersonas: 10,
    serviciosAdicionales: [],
    observaciones: ''
  });

  const [calculo, setCalculo] = useState({
    precioBase: 0,
    serviciosTotal: 0,
    cargoMinimo: 0,
    total: 0,
    diasReserva: 1
  });

  useEffect(() => {
    calcularPrecios();
  }, [formData]);

  const calcularPrecios = () => {
    let precioBase = 0;
    let cargoMinimo = 0;

    const dias = formData.fechaFin && formData.fechaInicio
      ? Math.ceil((new Date(formData.fechaFin) - new Date(formData.fechaInicio)) / (1000 * 60 * 60 * 24)) + 1
      : 1;

    if (formData.tipo === 'privada') {
      const esFindeSemana = esFinDeSemana(formData.fechaInicio);
      const precioPersona = esFindeSemana ? PRECIOS.RESERVA_PRIVADA_FINDE : PRECIOS.RESERVA_PRIVADA_SEMANA;
      const minimoPersonas = esFindeSemana ? RESTRICCIONES.MIN_PERSONAS_PRIVADA_FINDE : RESTRICCIONES.MIN_PERSONAS_PRIVADA_SEMANA;

      precioBase = formData.numeroPersonas * precioPersona * dias;

      if (formData.numeroPersonas < minimoPersonas) {
        cargoMinimo = PRECIOS.CARGO_MINIMO_PERSONAS;
      }
    } else {
      const precioPersona = formData.horario === 'nocturno' ? PRECIOS.ENTRADA_NOCTURNA : PRECIOS.ENTRADA_DIURNA;
      precioBase = formData.numeroPersonas * precioPersona * dias;
    }

    const serviciosTotal = formData.serviciosAdicionales.reduce((total, servicio) => {
      const precio = SERVICIOS_ADICIONALES[servicio.toUpperCase()]?.precio || 0;
      return total + (precio * dias);
    }, 0);

    const total = precioBase + serviciosTotal + cargoMinimo;

    setCalculo({ precioBase, serviciosTotal, cargoMinimo, total, diasReserva: dias });
  };

  const esFinDeSemana = (fecha) => {
    if (!fecha) return false;
    const dia = new Date(fecha).getDay();
    return dia === 0 || dia === 6;
  };



  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const validarFormulario = () => {
    if (!formData.fechaInicio) {
      setError('Debe seleccionar una fecha de inicio');
      return false;
    }
    if (formData.numeroPersonas < 1) {
      setError('Debe especificar al menos 1 persona');
      return false;
    }
    if (formData.numeroPersonas > RESTRICCIONES.AFORO_MAXIMO) {
      setError(`El aforo máximo es de ${RESTRICCIONES.AFORO_MAXIMO} personas`);
      return false;
    }
    if (formData.tipo === 'privada') {
      const esFindeSemana = esFinDeSemana(formData.fechaInicio);
      const minimoPersonas = esFindeSemana ? RESTRICCIONES.MIN_PERSONAS_PRIVADA_FINDE : RESTRICCIONES.MIN_PERSONAS_PRIVADA_SEMANA;
      if (formData.numeroPersonas < minimoPersonas && calculo.cargoMinimo === 0) {
        setError(`Las reservas privadas requieren mínimo ${minimoPersonas} personas ${esFindeSemana ? 'en fin de semana' : 'entre semana'}`);
        return false;
      }
    }
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaSeleccionada = new Date(formData.fechaInicio);
    if (fechaSeleccionada < hoy) {
      setError('No se pueden hacer reservas para fechas pasadas');
      return false;
    }
    return true;
  };

  const esPersonal = user?.rol === 'personal';

  const handleSubmit = async () => {
    if (!validarFormulario()) return;
    try {
      setLoading(true);
      setError(null);

      const tipoReservaMap = {
        general: 1,
        privada: 2
      };

      const reservaData = {
        tipoReservaId: typeof formData.tipo === 'string'
          ? tipoReservaMap[formData.tipo]
          : formData.tipo,
        fechaInicio: formData.fechaInicio,
        fechaFin: formData.fechaFin || formData.fechaInicio,

        horarioInicio: formData.horario === 'nocturno' ? '18:00' : '09:00',
        horarioFin:    formData.horario === 'nocturno' ? '23:00' : '12:00', 

        personas: formData.numeroPersonas,
        servicios: formData.serviciosAdicionales || [],

        ...(user?.documento && { documento: user.documento }),
        ...(user?.nombre && { clienteNombre: user.nombre }),
        ...(user?.email && { clienteEmail: user.email }),

        precioBase: calculo.precioBase,
        cargoAdicional: calculo.cargoMinimo,
        precioTotal: calculo.total,

        estado: 'pendiente',
        clienteId: user?.id
      };




      console.log('Reserva enviada:', JSON.stringify(reservaData, null, 2));

      const response = await authenticatedRequest(`${API_BASE_URL}/api/reservas`, {
        method: 'POST',
        body: JSON.stringify(reservaData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear la reserva');
      }

      const nuevaReserva = await response.json();
      onReservaCreada(nuevaReserva);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && !validarStep1()) return;
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const validarStep1 = () => {
    if (!formData.tipo) {
      setError('Debe seleccionar un tipo de reserva');
      return false;
    }
    return true;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNumber 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {stepNumber}
              </div>
              {stepNumber < 4 && (
                <div className={`h-1 w-16 mx-2 ${
                  step > stepNumber ? 'bg-primary-500' : 'bg-gray-200'
                }`}></div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Tipo de Reserva</span>
          <span>Fecha y Horario</span>
          <span>Personas y Servicios</span>
          <span>Confirmación</span>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-error-50 border border-error-200 text-error-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Step 1: Tipo de Reserva */}
      {step === 1 && (
        <div className="bg-white p-6 rounded-lg shadow-card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Selecciona el tipo de reserva
          </h2>
          <TipoReservaSelector
            tipoSeleccionado={formData.tipo}
            onTipoChange={(tipo) => handleInputChange('tipo', tipo)}
          />
        </div>
      )}

      {/* Step 2: Fecha y Horario */}
      {step === 2 && (
        <div className="bg-white p-6 rounded-lg shadow-card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Selecciona fecha y horario
          </h2>
          <CalendarioReservas
            fechaInicio={formData.fechaInicio}
            fechaFin={formData.fechaFin}
            horario={formData.horario}
            jornada={formData.jornada}
            tipo={formData.tipo}
            onFechaInicioChange={(fecha) => handleInputChange('fechaInicio', fecha)}
            onFechaFinChange={(fecha) => handleInputChange('fechaFin', fecha)}
            onHorarioChange={(horario) => handleInputChange('horario', horario)}
            onJornadaChange={(jornada) => handleInputChange('jornada', jornada)}
          />
        </div>
      )}

      {/* Step 3: Personas y Servicios */}
      {step === 3 && (
        <div className="space-y-6">
          {/* Número de Personas */}
          <div className="bg-white p-6 rounded-lg shadow-card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Número de personas
            </h2>
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">
                Cantidad de personas:
              </label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleInputChange('numeroPersonas', Math.max(1, formData.numeroPersonas - 1))}
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                >
                  -
                </button>
                <input
                  type="number"
                  value={formData.numeroPersonas}
                  onChange={(e) => handleInputChange('numeroPersonas', parseInt(e.target.value) || 1)}
                  className="w-20 text-center border border-gray-300 rounded-md py-1"
                  min="1"
                  max={RESTRICCIONES.AFORO_MAXIMO}
                />
                <button
                  type="button"
                  onClick={() => handleInputChange('numeroPersonas', Math.min(RESTRICCIONES.AFORO_MAXIMO, formData.numeroPersonas + 1))}
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                >
                  +
                </button>
              </div>
              <span className="text-sm text-gray-500">
                (Máximo {RESTRICCIONES.AFORO_MAXIMO} personas)
              </span>
            </div>

            {/* Advertencia mínimo personas */}
            {formData.tipo === 'privada' && (
              <div className="mt-4 p-3 bg-warning-50 border border-warning-200 rounded-lg">
                <p className="text-sm text-warning-800">
                  <strong>Nota:</strong> Las reservas privadas requieren mínimo{' '}
                  {esFinDeSemana(formData.fechaInicio) ? RESTRICCIONES.MIN_PERSONAS_PRIVADA_FINDE : RESTRICCIONES.MIN_PERSONAS_PRIVADA_SEMANA}{' '}
                  personas. Si no alcanzas este mínimo, se aplicará un cargo adicional de ${PRECIOS.CARGO_MINIMO_PERSONAS.toLocaleString()}.
                </p>
              </div>
            )}
          </div>

          {/* Servicios Adicionales */}
          <div className="bg-white p-6 rounded-lg shadow-card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Servicios adicionales (opcional)
            </h2>
            <ServiciosAdicionales
              serviciosSeleccionados={formData.serviciosAdicionales}
              onServiciosChange={(servicios) => handleInputChange('serviciosAdicionales', servicios)}
              diasReserva={calculo.diasReserva}
            />
          </div>

          {/* Observaciones */}
          <div className="bg-white p-6 rounded-lg shadow-card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Observaciones (opcional)
            </h2>
            <textarea
              value={formData.observaciones}
              onChange={(e) => handleInputChange('observaciones', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              rows="3"
              placeholder="Añade cualquier observación o solicitud especial..."
            />
          </div>
        </div>
      )}

      {/* Step 4: Confirmación */}
      {step === 4 && (
        <div className="bg-white p-6 rounded-lg shadow-card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Confirmar reserva
          </h2>

          {/* Resumen de la reserva */}
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-900">Tipo de reserva</h3>
                <p className="text-gray-600 capitalize">{formData.tipo}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Número de personas</h3>
                <p className="text-gray-600">{formData.numeroPersonas} personas</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Fecha</h3>
                <p className="text-gray-600">
                  {new Date(formData.fechaInicio).toLocaleDateString()}
                  {formData.fechaFin && formData.fechaFin !== formData.fechaInicio && 
                    ` - ${new Date(formData.fechaFin).toLocaleDateString()}`
                  }
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Horario</h3>
                <p className="text-gray-600 capitalize">{formData.horario}</p>
              </div>
            </div>

            {formData.serviciosAdicionales.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-900">Servicios adicionales</h3>
                <ul className="text-gray-600">
                  {formData.serviciosAdicionales.map(servicio => (
                    <li key={servicio}>• {SERVICIOS_ADICIONALES[servicio.toUpperCase()]?.nombre}</li>
                  ))}
                </ul>
              </div>
            )}

            {formData.observaciones && (
              <div>
                <h3 className="font-medium text-gray-900">Observaciones</h3>
                <p className="text-gray-600">{formData.observaciones}</p>
              </div>
            )}
          </div>

          {/* Desglose de precios */}
          <div className="border-t pt-6">
            <h3 className="font-medium text-gray-900 mb-4">Desglose de precios</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Precio base ({calculo.diasReserva} día{calculo.diasReserva > 1 ? 's' : ''})</span>
                <span>${calculo.precioBase.toLocaleString()}</span>
              </div>
              
              {calculo.serviciosTotal > 0 && (
                <div className="flex justify-between">
                  <span>Servicios adicionales</span>
                  <span>${calculo.serviciosTotal.toLocaleString()}</span>
                </div>
              )}
              
              {calculo.cargoMinimo > 0 && (
                <div className="flex justify-between text-warning-600">
                  <span>Cargo por mínimo de personas</span>
                  <span>${calculo.cargoMinimo.toLocaleString()}</span>
                </div>
              )}
              
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Total</span>
                <span>${calculo.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={prevStep}
          disabled={step === 1}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anterior
        </button>

        {step < 4 ? (
          <button
            type="button"
            onClick={nextStep}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Siguiente
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-success-600 text-white rounded-lg hover:bg-success-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creando reserva...' : 'Confirmar Reserva'}
          </button>
        )}
      </div>
    </div>
  );
};

export default CrearReserva;