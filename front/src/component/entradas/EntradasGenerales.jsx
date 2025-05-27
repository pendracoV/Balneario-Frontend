// src/components/entradas/EntradasGenerales.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PRECIOS, RESTRICCIONES, HORARIOS, API_BASE_URL } from '../../utils/constants';
import { formatearFecha, esFinDeSemana, formatearPrecio, obtenerFechaMinima } from '../../utils/dateHelpers';
import LoadingSpinner from '../common/LoadingSpinner';

const EntradasGenerales = ({ onEntradaCreada }) => {
  const { authenticatedRequest, isPersonal, isAdmin } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [disponibilidad, setDisponibilidad] = useState(null);

  const [formData, setFormData] = useState({
    fecha: obtenerFechaMinima(),
    horario: 'diurno', // 'diurno' o 'nocturno'
    jornada: 'completa', // 'completa', 'manana', 'tarde' (solo para diurno)
    numeroPersonas: 1,
    esPresencial: false, // true si es registro presencial por personal
    clientePresencial: {
      nombre: '',
      documento: '',
      telefono: ''
    }
  });

  const [calculo, setCalculo] = useState({
    precioUnitario: 0,
    total: 0,
    ocupacionActual: 0,
    espacioDisponible: 0
  });

  // Calcular precios automáticamente
  useEffect(() => {
    calcularPreciosYDisponibilidad();
  }, [formData.fecha, formData.horario, formData.numeroPersonas]);

  const calcularPreciosYDisponibilidad = async () => {
    const precioUnitario = formData.horario === 'nocturno' 
      ? PRECIOS.ENTRADA_NOCTURNA 
      : PRECIOS.ENTRADA_DIURNA;
    
    const total = precioUnitario * formData.numeroPersonas;

    // Verificar disponibilidad
    await verificarDisponibilidad();

    setCalculo(prev => ({
      ...prev,
      precioUnitario,
      total
    }));
  };

  const verificarDisponibilidad = async () => {
    try {
      const response = await authenticatedRequest(
        `${API_BASE_URL}/api/ocupacion?fecha=${formData.fecha}&horario=${formData.horario}&tipo=general`
      );

      if (response.ok) {
        const data = await response.json();
        setDisponibilidad(data);
        setCalculo(prev => ({
          ...prev,
          ocupacionActual: data.ocupacion || 0,
          espacioDisponible: RESTRICCIONES.AFORO_MAXIMO - (data.ocupacion || 0)
        }));
      }
    } catch (error) {
      console.error('Error al verificar disponibilidad:', error);
      // Fallback: asumir disponibilidad completa
      setDisponibilidad({ disponible: true, ocupacion: 0, bloqueadoPorPrivada: false });
      setCalculo(prev => ({
        ...prev,
        ocupacionActual: 0,
        espacioDisponible: RESTRICCIONES.AFORO_MAXIMO
      }));
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    setError(null);
  };

  const validarFormulario = () => {
    // Verificar fecha
    if (!formData.fecha) {
      setError('Debe seleccionar una fecha');
      return false;
    }

    // Verificar disponibilidad
    if (!disponibilidad?.disponible) {
      if (disponibilidad?.bloqueadoPorPrivada) {
        setError('No se pueden vender entradas generales. Hay una reserva privada para esta fecha y horario.');
      } else {
        setError('Fecha y horario no disponibles');
      }
      return false;
    }

    // Verificar aforo
    if (formData.numeroPersonas > calculo.espacioDisponible) {
      setError(`Solo hay espacio para ${calculo.espacioDisponible} personas más. Ocupación actual: ${calculo.ocupacionActual}/${RESTRICCIONES.AFORO_MAXIMO}`);
      return false;
    }

    // Validaciones para entrada presencial
    if (formData.esPresencial) {
      if (!formData.clientePresencial.nombre.trim()) {
        setError('El nombre del cliente es requerido');
        return false;
      }
      if (!formData.clientePresencial.documento.trim()) {
        setError('El documento del cliente es requerido');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validarFormulario()) return;

    try {
      setLoading(true);
      setError(null);

      const entradaData = {
        ...formData,
        tipo: 'general',
        precioTotal: calculo.total,
        estado: formData.esPresencial ? 'confirmada' : 'pendiente' // Las presenciales se confirman inmediatamente
      };

      const response = await authenticatedRequest(`${API_BASE_URL}/api/entradas`, {
        method: 'POST',
        body: JSON.stringify(entradaData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear la entrada');
      }

      const nuevaEntrada = await response.json();
      onEntradaCreada && onEntradaCreada(nuevaEntrada);
      
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && !validarStep1()) return;
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const validarStep1 = () => {
    if (!formData.fecha || !formData.horario) {
      setError('Debe seleccionar fecha y horario');
      return false;
    }
    return true;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNumber 
                  ? 'bg-secondary-500 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div className={`h-1 w-16 mx-2 ${
                  step > stepNumber ? 'bg-secondary-500' : 'bg-gray-200'
                }`}></div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Fecha y Horario</span>
          <span>Personas</span>
          <span>Confirmación</span>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-error-50 border border-error-200 text-error-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Step 1: Fecha y Horario */}
      {step === 1 && (
        <div className="bg-white p-6 rounded-lg shadow-card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Selecciona fecha y horario
          </h2>

          {/* Selector de fecha */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de entrada
            </label>
            <input
              type="date"
              value={formData.fecha}
              onChange={(e) => handleInputChange('fecha', e.target.value)}
              min={obtenerFechaMinima()}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-secondary-500 focus:border-secondary-500"
            />
            {formData.fecha && esFinDeSemana(formData.fecha) && (
              <p className="mt-1 text-xs text-warning-600">
                ⚠️ Fin de semana - Puede haber más demanda
              </p>
            )}
          </div>

          {/* Selector de horario */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Horario de entrada
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.horario === 'diurno' 
                  ? 'border-secondary-500 bg-secondary-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="horario"
                  value="diurno"
                  checked={formData.horario === 'diurno'}
                  onChange={(e) => handleInputChange('horario', e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                    formData.horario === 'diurno' ? 'border-secondary-500 bg-secondary-500' : 'border-gray-300'
                  }`}>
                    {formData.horario === 'diurno' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">☀️ Horario Diurno</div>
                    <div className="text-sm text-gray-600">
                      9:00 AM - 12:00 PM y 2:00 PM - 6:00 PM
                    </div>
                    <div className="text-sm font-medium text-secondary-600">
                      {formatearPrecio(PRECIOS.ENTRADA_DIURNA)}/persona
                    </div>
                  </div>
                </div>
              </label>

              <label className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.horario === 'nocturno' 
                  ? 'border-secondary-500 bg-secondary-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="horario"
                  value="nocturno"
                  checked={formData.horario === 'nocturno'}
                  onChange={(e) => handleInputChange('horario', e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                    formData.horario === 'nocturno' ? 'border-secondary-500 bg-secondary-500' : 'border-gray-300'
                  }`}>
                    {formData.horario === 'nocturno' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">🌙 Horario Nocturno</div>
                    <div className="text-sm text-gray-600">
                      6:00 PM - 11:00 PM
                    </div>
                    <div className="text-sm font-medium text-secondary-600">
                      {formatearPrecio(PRECIOS.ENTRADA_NOCTURNA)}/persona
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Jornadas específicas para horario diurno */}
          {formData.horario === 'diurno' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Jornada específica (opcional)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className={`p-3 border rounded-lg cursor-pointer text-center transition-all ${
                  formData.jornada === 'completa'
                    ? 'border-secondary-500 bg-secondary-50 text-secondary-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="jornada"
                    value="completa"
                    checked={formData.jornada === 'completa'}
                    onChange={(e) => handleInputChange('jornada', e.target.value)}
                    className="sr-only"
                  />
                  <div className="font-medium">Jornada Completa</div>
                  <div className="text-xs text-gray-600">9AM-12PM + 2PM-6PM</div>
                </label>

                <label className={`p-3 border rounded-lg cursor-pointer text-center transition-all ${
                  formData.jornada === 'manana'
                    ? 'border-secondary-500 bg-secondary-50 text-secondary-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="jornada"
                    value="manana"
                    checked={formData.jornada === 'manana'}
                    onChange={(e) => handleInputChange('jornada', e.target.value)}
                    className="sr-only"
                  />
                  <div className="font-medium">Solo Mañana</div>
                  <div className="text-xs text-gray-600">9:00 AM - 12:00 PM</div>
                </label>

                <label className={`p-3 border rounded-lg cursor-pointer text-center transition-all ${
                  formData.jornada === 'tarde'
                    ? 'border-secondary-500 bg-secondary-50 text-secondary-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="jornada"
                    value="tarde"
                    checked={formData.jornada === 'tarde'}
                    onChange={(e) => handleInputChange('jornada', e.target.value)}
                    className="sr-only"
                  />
                  <div className="font-medium">Solo Tarde</div>
                  <div className="text-xs text-gray-600">2:00 PM - 6:00 PM</div>
                </label>
              </div>
            </div>
          )}

          {/* Información de disponibilidad */}
          {disponibilidad && (
            <div className={`p-4 rounded-lg border ${
              disponibilidad.disponible 
                ? 'bg-success-50 border-success-200' 
                : 'bg-error-50 border-error-200'
            }`}>
              <div className="flex items-center">
                <svg className={`w-5 h-5 mr-2 ${
                  disponibilidad.disponible ? 'text-success-600' : 'text-error-600'
                }`} fill="currentColor" viewBox="0 0 20 20">
                  {disponibilidad.disponible ? (
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  ) : (
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  )}
                </svg>
                <div>
                  <p className={`font-medium ${
                    disponibilidad.disponible ? 'text-success-800' : 'text-error-800'
                  }`}>
                    {disponibilidad.disponible ? 'Disponible' : 'No Disponible'}
                  </p>
                  <p className={`text-sm ${
                    disponibilidad.disponible ? 'text-success-600' : 'text-error-600'
                  }`}>
                    {disponibilidad.bloqueadoPorPrivada 
                      ? 'Bloqueado por reserva privada'
                      : `Ocupación: ${calculo.ocupacionActual}/${RESTRICCIONES.AFORO_MAXIMO} personas`
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Número de Personas */}
      {step === 2 && (
        <div className="bg-white p-6 rounded-lg shadow-card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Número de personas
          </h2>

          {/* Selector de personas */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Cantidad de personas
            </label>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => handleInputChange('numeroPersonas', Math.max(1, formData.numeroPersonas - 1))}
                className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-semibold"
              >
                -
              </button>
              <div className="flex-1 max-w-xs">
                <input
                  type="number"
                  value={formData.numeroPersonas}
                  onChange={(e) => handleInputChange('numeroPersonas', parseInt(e.target.value) || 1)}
                  className="w-full text-center border border-gray-300 rounded-md py-2 text-lg font-semibold"
                  min="1"
                  max={calculo.espacioDisponible}
                />
              </div>
              <button
                type="button"
                onClick={() => handleInputChange('numeroPersonas', Math.min(calculo.espacioDisponible, formData.numeroPersonas + 1))}
                className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-semibold"
              >
                +
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Espacios disponibles: {calculo.espacioDisponible} de {RESTRICCIONES.AFORO_MAXIMO}
            </p>
          </div>

          {/* Registro presencial (solo para personal y admin) */}
          {(isPersonal() || isAdmin()) && (
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.esPresencial}
                  onChange={(e) => handleInputChange('esPresencial', e.target.checked)}
                  className="form-checkbox h-4 w-4 text-secondary-600 transition duration-150 ease-in-out"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Registro presencial (cliente en sitio)
                </span>
              </label>
            </div>
          )}

          {/* Datos del cliente presencial */}
          {formData.esPresencial && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h3 className="font-medium text-gray-900">Datos del cliente</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    value={formData.clientePresencial.nombre}
                    onChange={(e) => handleInputChange('clientePresencial.nombre', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-secondary-500 focus:border-secondary-500"
                    placeholder="Nombre del cliente"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Documento
                  </label>
                  <input
                    type="text"
                    value={formData.clientePresencial.documento}
                    onChange={(e) => handleInputChange('clientePresencial.documento', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-secondary-500 focus:border-secondary-500"
                    placeholder="Cédula o documento"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={formData.clientePresencial.telefono}
                    onChange={(e) => handleInputChange('clientePresencial.telefono', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-secondary-500 focus:border-secondary-500"
                    placeholder="Teléfono de contacto"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Resumen de precios */}
          <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
            <h3 className="font-medium text-secondary-900 mb-2">Resumen de precios</h3>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Precio por persona</span>
                <span>{formatearPrecio(calculo.precioUnitario)}</span>
              </div>
              <div className="flex justify-between">
                <span>Cantidad de personas</span>
                <span>{formData.numeroPersonas}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Total a pagar</span>
                <span>{formatearPrecio(calculo.total)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Confirmación */}
      {step === 3 && (
        <div className="bg-white p-6 rounded-lg shadow-card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Confirmar entrada
          </h2>

          {/* Resumen completo */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Detalles de la entrada</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fecha:</span>
                    <span className="font-medium">{formatearFecha(formData.fecha, { formato: 'largo', incluirDia: true })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Horario:</span>
                    <span className="font-medium capitalize">
                      {formData.horario} {formData.horario === 'diurno' && formData.jornada !== 'completa' && `(${formData.jornada})`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Personas:</span>
                    <span className="font-medium">{formData.numeroPersonas}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tipo:</span>
                    <span className="font-medium">
                      {formData.esPresencial ? 'Registro Presencial' : 'Entrada General'}
                    </span>
                  </div>
                </div>
              </div>

              {formData.esPresencial && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Cliente</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nombre:</span>
                      <span className="font-medium">{formData.clientePresencial.nombre}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Documento:</span>
                      <span className="font-medium">{formData.clientePresencial.documento}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Teléfono:</span>
                      <span className="font-medium">{formData.clientePresencial.telefono}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Total final */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total a pagar:</span>
                <span className="text-secondary-600">{formatearPrecio(calculo.total)}</span>
              </div>
              {!formData.esPresencial && (
                <p className="text-sm text-gray-600 mt-2">
                  * El pago se realizará posteriormente para confirmar la entrada
                </p>
              )}
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

        {step < 3 ? (
          <button
            type="button"
            onClick={nextStep}
            className="px-6 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700"
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
            {loading ? 'Procesando...' : 'Confirmar Entrada'}
          </button>
        )}
      </div>
    </div>
  );
};

export default EntradasGenerales;