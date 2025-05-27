// src/utils/validators.js
import { RESTRICCIONES, MENSAJES_VALIDACION } from './constants';
import { validarFechaRango, esFechaPasada, esFinDeSemanaoFestivo } from './dateHelpers';

/**
 * Valida email
 */
export const validarEmail = (email) => {
  if (!email) return { valido: false, mensaje: MENSAJES_VALIDACION.CAMPO_REQUERIDO };
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valido: false, mensaje: MENSAJES_VALIDACION.EMAIL_INVALIDO };
  }
  
  return { valido: true };
};

/**
 * Valida contraseña
 */
export const validarPassword = (password) => {
  if (!password) return { valido: false, mensaje: MENSAJES_VALIDACION.CAMPO_REQUERIDO };
  
  if (password.length < 8) {
    return { valido: false, mensaje: MENSAJES_VALIDACION.PASSWORD_MIN_LENGTH };
  }
  
  // Verificar que tenga al menos una letra y un número
  const tieneLetra = /[a-zA-Z]/.test(password);
  const tieneNumero = /\d/.test(password);
  
  if (!tieneLetra || !tieneNumero) {
    return { 
      valido: false, 
      mensaje: 'La contraseña debe contener al menos una letra y un número' 
    };
  }
  
  return { valido: true };
};

/**
 * Valida confirmación de contraseña
 */
export const validarConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return { valido: false, mensaje: MENSAJES_VALIDACION.CAMPO_REQUERIDO };
  
  if (password !== confirmPassword) {
    return { valido: false, mensaje: MENSAJES_VALIDACION.PASSWORD_MISMATCH };
  }
  
  return { valido: true };
};

/**
 * Valida número de teléfono
 */
export const validarTelefono = (telefono) => {
  if (!telefono) return { valido: false, mensaje: MENSAJES_VALIDACION.CAMPO_REQUERIDO };
  
  // Permitir solo números, espacios, guiones y paréntesis
  const telefonoRegex = /^[\d\s\-\(\)\+]{7,15}$/;
  if (!telefonoRegex.test(telefono)) {
    return { valido: false, mensaje: MENSAJES_VALIDACION.TELEFONO_INVALIDO };
  }
  
  return { valido: true };
};

/**
 * Valida documento de identidad
 */
export const validarDocumento = (documento) => {
  if (!documento) return { valido: false, mensaje: MENSAJES_VALIDACION.CAMPO_REQUERIDO };
  
  // Permitir solo números y algunos caracteres especiales
  const documentoRegex = /^[\d\-\.]{5,20}$/;
  if (!documentoRegex.test(documento)) {
    return { 
      valido: false, 
      mensaje: 'El documento debe contener solo números y tener entre 5 y 20 caracteres' 
    };
  }
  
  return { valido: true };
};

/**
 * Valida nombre
 */
export const validarNombre = (nombre) => {
  if (!nombre || !nombre.trim()) {
    return { valido: false, mensaje: MENSAJES_VALIDACION.CAMPO_REQUERIDO };
  }
  
  if (nombre.trim().length < 2) {
    return { valido: false, mensaje: 'El nombre debe tener al menos 2 caracteres' };
  }
  
  if (nombre.trim().length > 50) {
    return { valido: false, mensaje: 'El nombre no puede tener más de 50 caracteres' };
  }
  
  // Solo letras, espacios y algunos caracteres especiales
  const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-\'\.]+$/;
  if (!nombreRegex.test(nombre.trim())) {
    return { valido: false, mensaje: 'El nombre solo puede contener letras y espacios' };
  }
  
  return { valido: true };
};

/**
 * Valida fecha de reserva
 */
export const validarFechaReserva = (fecha) => {
  if (!fecha) return { valido: false, mensaje: MENSAJES_VALIDACION.FECHA_INVALIDA };
  
  if (esFechaPasada(fecha)) {
    return { valido: false, mensaje: 'No se pueden hacer reservas para fechas pasadas' };
  }
  
  if (!validarFechaRango(fecha, RESTRICCIONES.MIN_DIAS_ANTICIPACION, RESTRICCIONES.MAX_DIAS_ANTICIPACION)) {
    return { 
      valido: false, 
      mensaje: `Las reservas deben hacerse entre ${RESTRICCIONES.MIN_DIAS_ANTICIPACION} y ${RESTRICCIONES.MAX_DIAS_ANTICIPACION} días de anticipación` 
    };
  }
  
  return { valido: true };
};

/**
 * Valida número de personas
 */
export const validarNumeroPersonas = (numeroPersonas, tipoReserva, fechaReserva) => {
  if (!numeroPersonas || numeroPersonas < 1) {
    return { valido: false, mensaje: 'Debe especificar al menos 1 persona' };
  }
  
  if (numeroPersonas > RESTRICCIONES.AFORO_MAXIMO) {
    return { valido: false, mensaje: MENSAJES_VALIDACION.MAX_AFORO };
  }
  
  if (tipoReserva === 'privada') {
    const esFinde = esFinDeSemanaoFestivo(fechaReserva);
    const minimoPersonas = esFinde 
      ? RESTRICCIONES.MIN_PERSONAS_PRIVADA_FINDE 
      : RESTRICCIONES.MIN_PERSONAS_PRIVADA_SEMANA;
    
    if (numeroPersonas < minimoPersonas) {
      return { 
        valido: false, 
        mensaje: `Las reservas privadas ${esFinde ? 'en fin de semana/festivos' : 'entre semana'} requieren mínimo ${minimoPersonas} personas`,
        advertencia: true // Puede proceder con cargo adicional
      };
    }
  }
  
  return { valido: true };
};

/**
 * Valida rango de fechas
 */
export const validarRangoFechas = (fechaInicio, fechaFin) => {
  const validacionInicio = validarFechaReserva(fechaInicio);
  if (!validacionInicio.valido) return validacionInicio;
  
  if (fechaFin && fechaFin !== fechaInicio) {
    const validacionFin = validarFechaReserva(fechaFin);
    if (!validacionFin.valido) return validacionFin;
    
    if (new Date(fechaFin) < new Date(fechaInicio)) {
      return { valido: false, mensaje: 'La fecha de fin no puede ser anterior a la fecha de inicio' };
    }
    
    // Validar que no exceda el máximo de días
    const diferenciaDias = Math.ceil((new Date(fechaFin) - new Date(fechaInicio)) / (1000 * 60 * 60 * 24)) + 1;
    if (diferenciaDias > 30) {
      return { valido: false, mensaje: 'Las reservas no pueden exceder 30 días' };
    }
  }
  
  return { valido: true };
};

/**
 * Valida formulario de registro completo
 */
export const validarFormularioRegistro = (datos) => {
  const errores = {};
  
  const validacionNombre = validarNombre(datos.nombre);
  if (!validacionNombre.valido) errores.nombre = validacionNombre.mensaje;
  
  const validacionEmail = validarEmail(datos.email);
  if (!validacionEmail.valido) errores.email = validacionEmail.mensaje;
  
  const validacionTelefono = validarTelefono(datos.telefono);
  if (!validacionTelefono.valido) errores.telefono = validacionTelefono.mensaje;
  
  const validacionDocumento = validarDocumento(datos.documento);
  if (!validacionDocumento.valido) errores.documento = validacionDocumento.mensaje;
  
  const validacionPassword = validarPassword(datos.password);
  if (!validacionPassword.valido) errores.password = validacionPassword.mensaje;
  
  const validacionConfirm = validarConfirmPassword(datos.password, datos.confirmPassword);
  if (!validacionConfirm.valido) errores.confirmPassword = validacionConfirm.mensaje;
  
  return {
    valido: Object.keys(errores).length === 0,
    errores
  };
};

/**
 * Valida formulario de login
 */
export const validarFormularioLogin = (datos) => {
  const errores = {};
  
  const validacionEmail = validarEmail(datos.email);
  if (!validacionEmail.valido) errores.email = validacionEmail.mensaje;
  
  if (!datos.password) {
    errores.password = MENSAJES_VALIDACION.CAMPO_REQUERIDO;
  }
  
  return {
    valido: Object.keys(errores).length === 0,
    errores
  };
};

/**
 * Valida formulario de reserva completo
 */
export const validarFormularioReserva = (datos) => {
  const errores = {};
  const advertencias = {};
  
  // Validar tipo de reserva
  if (!datos.tipo) {
    errores.tipo = 'Debe seleccionar un tipo de reserva';
  }
  
  // Validar fechas
  const validacionFechas = validarRangoFechas(datos.fechaInicio, datos.fechaFin);
  if (!validacionFechas.valido) errores.fechas = validacionFechas.mensaje;
  
  // Validar número de personas
  const validacionPersonas = validarNumeroPersonas(datos.numeroPersonas, datos.tipo, datos.fechaInicio);
  if (!validacionPersonas.valido) {
    if (validacionPersonas.advertencia) {
      advertencias.personas = validacionPersonas.mensaje;
    } else {
      errores.personas = validacionPersonas.mensaje;
    }
  }
  
  // Validar horario
  if (!datos.horario) {
    errores.horario = 'Debe seleccionar un horario';
  }
  
  return {
    valido: Object.keys(errores).length === 0,
    errores,
    advertencias
  };
};

/**
 * Valida observaciones
 */
export const validarObservaciones = (observaciones) => {
  if (!observaciones) return { valido: true };
  
  if (observaciones.length > 500) {
    return { valido: false, mensaje: 'Las observaciones no pueden exceder 500 caracteres' };
  }
  
  return { valido: true };
};

/**
 * Sanitiza texto de entrada
 */
export const sanitizarTexto = (texto) => {
  if (!texto) return '';
  
  return texto
    .trim()
    .replace(/\s+/g, ' ') // Múltiples espacios a uno solo
    .replace(/[<>]/g, ''); // Remover caracteres HTML básicos
};

/**
 * Valida campo requerido genérico
 */
export const validarCampoRequerido = (valor, nombreCampo = 'Campo') => {
  if (!valor || (typeof valor === 'string' && !valor.trim())) {
    return { valido: false, mensaje: `${nombreCampo} es requerido` };
  }
  
  return { valido: true };
};

export default {
  validarEmail,
  validarPassword,
  validarConfirmPassword,
  validarTelefono,
  validarDocumento,
  validarNombre,
  validarFechaReserva,
  validarNumeroPersonas,
  validarRangoFechas,
  validarFormularioRegistro,
  validarFormularioLogin,
  validarFormularioReserva,
  validarObservaciones,
  sanitizarTexto,
  validarCampoRequerido
};