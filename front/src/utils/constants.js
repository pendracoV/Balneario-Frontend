// src/utils/constants.js

// URLs y configuración de API
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://balneario-backend.onrender.com';

// Roles de usuario
export const USER_ROLES = {
  ADMIN: 'administrador',
  PERSONAL: 'personal', 
  CLIENTE: 'cliente'
};

// Tipos de reserva
export const TIPOS_RESERVA = {
  PRIVADA: 'privada',
  GENERAL: 'general'
};

// Estados de reserva
export const ESTADOS_RESERVA = {
  PENDIENTE: 'pendiente',
  CONFIRMADA: 'confirmada',
  CANCELACION_PENDIENTE: 'cancelacion_pendiente',
  CANCELADA: 'cancelada',
  COMPLETADA: 'completada'
};

// Horarios
export const HORARIOS = {
  DIURNO: {
    MANANA: { inicio: '09:00', fin: '12:00', label: '9:00 AM - 12:00 PM' },
    TARDE: { inicio: '14:00', fin: '18:00', label: '2:00 PM - 6:00 PM' }
  },
  NOCTURNO: {
    NOCHE: { inicio: '18:00', fin: '23:00', label: '6:00 PM - 11:00 PM' }
  }
};

// Precios
export const PRECIOS = {
  ENTRADA_DIURNA: parseInt(import.meta.env.VITE_PRECIO_ENTRADA_DIURNA) || 5000,
  ENTRADA_NOCTURNA: parseInt(import.meta.env.VITE_PRECIO_ENTRADA_NOCTURNA) || 10000,
  RESERVA_PRIVADA_SEMANA: parseInt(import.meta.env.VITE_PRECIO_RESERVA_SEMANA) || 20000,
  RESERVA_PRIVADA_FINDE: parseInt(import.meta.env.VITE_PRECIO_RESERVA_FINDE) || 25000,
  SERVICIO_COCINA: parseInt(import.meta.env.VITE_PRECIO_SERVICIO_COCINA) || 25000,
  SERVICIO_CUARTO: parseInt(import.meta.env.VITE_PRECIO_SERVICIO_CUARTO) || 50000,
  CARGO_MINIMO_PERSONAS: 100000
};

// Restricciones
export const RESTRICCIONES = {
  AFORO_MAXIMO: parseInt(import.meta.env.VITE_AFORO_MAXIMO) || 120,
  MIN_PERSONAS_PRIVADA_SEMANA: 10,
  MIN_PERSONAS_PRIVADA_FINDE: 15,
  MAX_DIAS_ANTICIPACION: 90,
  MIN_DIAS_ANTICIPACION: 1
};

// Servicios adicionales
export const SERVICIOS_ADICIONALES = {
  COCINA: {
    id: 'cocina',
    nombre: 'Servicio de Cocina',
    precio: PRECIOS.SERVICIO_COCINA,
    descripcion: 'Acceso completo a la cocina del balneario'
  },
  CUARTO: {
    id: 'cuarto', 
    nombre: 'Servicio de Cuarto',
    precio: PRECIOS.SERVICIO_CUARTO,
    descripcion: 'Habitación privada por noche'
  }
};

// Días de la semana
export const DIAS_SEMANA = {
  0: 'Domingo',
  1: 'Lunes', 
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado'
};

// Meses
export const MESES = {
  0: 'Enero',
  1: 'Febrero',
  2: 'Marzo', 
  3: 'Abril',
  4: 'Mayo',
  5: 'Junio',
  6: 'Julio',
  7: 'Agosto',
  8: 'Septiembre',
  9: 'Octubre',
  10: 'Noviembre',
  11: 'Diciembre'
};

// Mensajes de validación
export const MENSAJES_VALIDACION = {
  CAMPO_REQUERIDO: 'Este campo es requerido',
  EMAIL_INVALIDO: 'Ingrese un email válido',
  PASSWORD_MIN_LENGTH: 'La contraseña debe tener al menos 8 caracteres',
  PASSWORD_MISMATCH: 'Las contraseñas no coinciden',
  TELEFONO_INVALIDO: 'Ingrese un número de teléfono válido',
  FECHA_INVALIDA: 'Seleccione una fecha válida',
  MIN_PERSONAS: 'Número mínimo de personas no alcanzado',
  MAX_AFORO: 'Excede el aforo máximo permitido'
};

// Rutas de navegación
export const RUTAS = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  RESERVAS: '/reservas',
  PERFIL: '/perfil',
  ADMIN: '/admin',
  PERSONAL: '/personal',
  ENTRADAS: '/entradas'
};

// Configuración de paginación
export const PAGINACION = {
  ITEMS_POR_PAGINA: 10,
  MAX_PAGINAS_VISIBLES: 5
};

export default {
  API_BASE_URL,
  USER_ROLES,
  TIPOS_RESERVA,
  ESTADOS_RESERVA,
  HORARIOS,
  PRECIOS,
  RESTRICCIONES,
  SERVICIOS_ADICIONALES,
  DIAS_SEMANA,
  MESES,
  MENSAJES_VALIDACION,
  RUTAS,
  PAGINACION
};