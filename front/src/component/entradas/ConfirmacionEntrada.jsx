// src/components/entradas/ConfirmacionEntrada.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatearFecha, formatearPrecio } from '../../utils/dateHelpers';

const ConfirmacionEntrada = ({ entrada, onNuevaEntrada, onVolver }) => {
  const [mostrarDetalles, setMostrarDetalles] = useState(false);

  const obtenerEstadoColor = (estado) => {
    switch (estado) {
      case 'confirmada':
        return 'bg-success-100 text-success-800 border-success-200';
      case 'pendiente':
        return 'bg-warning-100 text-warning-800 border-warning-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const obtenerIconoEstado = (estado) => {
    switch (estado) {
      case 'confirmada':
        return '✅';
      case 'pendiente':
        return '⏳';
      default:
        return '📋';
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header de confirmación */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          ¡Entrada Creada Exitosamente!
        </h1>
        <p className="text-gray-600">
          {entrada.estado === 'confirmada' 
            ? 'Tu entrada ha sido confirmada y está lista para usar.'
            : 'Tu entrada ha sido registrada. Procede con el pago para confirmarla.'
          }
        </p>
      </div>

      {/* Card de resumen */}
      <div className="bg-white rounded-lg shadow-card p-6 mb-6">
        {/* Estado de la entrada */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <span className="text-2xl mr-2">{obtenerIconoEstado(entrada.estado)}</span>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Entrada #{entrada.id}
              </h2>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${obtenerEstadoColor(entrada.estado)}`}>
                {entrada.estado === 'confirmada' ? 'Confirmada' : 'Pendiente de Pago'}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-secondary-600">
              {formatearPrecio(entrada.precioTotal)}
            </div>
            <div className="text-sm text-gray-500">
              {entrada.numeroPersonas} persona{entrada.numeroPersonas > 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Información principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Detalles de la entrada</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Fecha:</span>
                <span className="font-medium">
                  {formatearFecha(entrada.fecha, { formato: 'largo', incluirDia: true })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Horario:</span>
                <span className="font-medium capitalize">
                  {entrada.horario === 'diurno' ? '☀️ Diurno' : '🌙 Nocturno'}
                  {entrada.jornada && entrada.jornada !== 'completa' && ` (${entrada.jornada})`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tipo:</span>
                <span className="font-medium">
                  {entrada.esPresencial ? 'Registro Presencial' : 'Entrada General'}
                </span>
              </div>
            </div>
          </div>

          {entrada.esPresencial && entrada.clientePresencial && (
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Datos del cliente</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nombre:</span>
                  <span className="font-medium">{entrada.clientePresencial.nombre}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Documento:</span>
                  <span className="font-medium">{entrada.clientePresencial.documento}</span>
                </div>
                {entrada.clientePresencial.telefono && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Teléfono:</span>
                    <span className="font-medium">{entrada.clientePresencial.telefono}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Desglose de precios (expandible) */}
        <div className="border-t pt-4">
          <button
            onClick={() => setMostrarDetalles(!mostrarDetalles)}
            className="flex items-center justify-between w-full text-left"
          >
            <span className="font-medium text-gray-900">Desglose de precios</span>
            <svg 
              className={`w-5 h-5 text-gray-500 transition-transform ${mostrarDetalles ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {mostrarDetalles && (
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Precio por persona ({entrada.horario}):</span>
                <span>{formatearPrecio(entrada.precioTotal / entrada.numeroPersonas)}</span>
              </div>
              <div className="flex justify-between">
                <span>Cantidad de personas:</span>
                <span>{entrada.numeroPersonas}</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Total:</span>
                <span>{formatearPrecio(entrada.precioTotal)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Información importante */}
      <div className={`rounded-lg border p-4 mb-6 ${
        entrada.estado === 'confirmada' 
          ? 'bg-success-50 border-success-200' 
          : 'bg-warning-50 border-warning-200'
      }`}>
        <div className="flex">
          <svg className={`w-5 h-5 mt-0.5 mr-3 flex-shrink-0 ${
            entrada.estado === 'confirmada' ? 'text-success-600' : 'text-warning-600'
          }`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className={`text-sm font-medium ${
              entrada.estado === 'confirmada' ? 'text-success-800' : 'text-warning-800'
            }`}>
              {entrada.estado === 'confirmada' ? 'Entrada Confirmada' : 'Pago Pendiente'}
            </h4>
            <div className={`mt-1 text-xs ${
              entrada.estado === 'confirmada' ? 'text-success-700' : 'text-warning-700'
            }`}>
              {entrada.estado === 'confirmada' ? (
                <ul className="list-disc list-inside space-y-1">
                  <li>Tu entrada está confirmada y lista para usar</li>
                  <li>Presenta tu documento de identidad al llegar</li>
                  <li>Llega en el horario seleccionado para disfrutar al máximo</li>
                  <li>Recuerda seguir las normas del balneario</li>
                </ul>
              ) : (
                <ul className="list-disc list-inside space-y-1">
                  <li>Debes completar el pago para confirmar tu entrada</li>
                  <li>Una vez pagado, recibirás la confirmación</li>
                  <li>El pago se puede realizar por transferencia o en sitio</li>
                  <li>Conserva este número de referencia: #{entrada.id}</li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex flex-col sm:flex-row gap-4">
        {entrada.estado === 'pendiente' && (
          <button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
            Proceder al Pago
          </button>
        )}
        
        <button
          onClick={onNuevaEntrada}
          className="flex-1 bg-secondary-600 hover:bg-secondary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Nueva Entrada
        </button>
        
        <button
          onClick={onVolver}
          className="flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Volver
        </button>
      </div>

      {/* Enlaces útiles */}
      <div className="mt-8 text-center space-y-2">
        <div className="flex justify-center space-x-6 text-sm">
          <Link to="/dashboard" className="text-primary-600 hover:text-primary-700">
            Ir al Dashboard
          </Link>
          <Link to="/reservas" className="text-primary-600 hover:text-primary-700">
            Ver Reservas
          </Link>
          <Link to="/" className="text-primary-600 hover:text-primary-700">
            Inicio
          </Link>
        </div>
        <p className="text-xs text-gray-500">
          ¿Tienes preguntas? Contáctanos al +57 300 123 4567
        </p>
      </div>

      {/* Código QR placeholder (opcional) */}
      {entrada.estado === 'confirmada' && (
        <div className="mt-6 text-center">
          <div className="inline-block p-4 bg-gray-100 rounded-lg">
            <div className="w-32 h-32 bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                <p className="text-xs text-gray-500">Código QR</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Muestra este código al ingresar al balneario
          </p>
        </div>
      )}
    </div>
  );
};

export default ConfirmacionEntrada;