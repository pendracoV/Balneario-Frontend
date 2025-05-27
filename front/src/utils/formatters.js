// src/utils/formatters.js

/**
 * Formatea números como moneda colombiana
 */
export const formatearMoneda = (valor) => {
    if (valor === null || valor === undefined) return '$0';
    
    const numero = typeof valor === 'string' ? parseFloat(valor) : valor;
    
    if (isNaN(numero)) return '$0';
    
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numero);
  };
  
  /**
   * Formatea números con separadores de miles
   */
  export const formatearNumero = (valor) => {
    if (valor === null || valor === undefined) return '0';
    
    const numero = typeof valor === 'string' ? parseFloat(valor) : valor;
    
    if (isNaN(numero)) return '0';
    
    return new Intl.NumberFormat('es-CO').format(numero);
  };
  
  /**
   * Formatea porcentajes
   */
  export const formatearPorcentaje = (valor, decimales = 1) => {
    if (valor === null || valor === undefined) return '0%';
    
    const numero = typeof valor === 'string' ? parseFloat(valor) : valor;
    
    if (isNaN(numero)) return '0%';
    
    return new Intl.NumberFormat('es-CO', {
      style: 'percent',
      minimumFractionDigits: decimales,
      maximumFractionDigits: decimales
    }).format(numero / 100);
  };
  
  /**
   * Formatea teléfonos colombianos
   */
  export const formatearTelefono = (telefono) => {
    if (!telefono) return '';
    
    // Remover todo lo que no sean números
    const numeros = telefono.replace(/\D/g, '');
    
    // Formato para celular colombiano (10 dígitos)
    if (numeros.length === 10) {
      return `${numeros.slice(0, 3)} ${numeros.slice(3, 6)} ${numeros.slice(6)}`;
    }
    
    // Formato para teléfono fijo (7 dígitos)
    if (numeros.length === 7) {
      return `${numeros.slice(0, 3)} ${numeros.slice(3)}`;
    }
    
    // Si tiene código de país (+57)
    if (numeros.length === 12 && numeros.startsWith('57')) {
      const numero = numeros.slice(2);
      return `+57 ${numero.slice(0, 3)} ${numero.slice(3, 6)} ${numero.slice(6)}`;
    }
    
    return telefono; // Devolver original si no coincide con formatos conocidos
  };
  
  /**
   * Formatea documentos de identidad
   */
  export const formatearDocumento = (documento) => {
    if (!documento) return '';
    
    // Remover todo lo que no sean números
    const numeros = documento.replace(/\D/g, '');
    
    // Agregar puntos como separadores de miles para documentos largos
    if (numeros.length > 6) {
      return new Intl.NumberFormat('es-CO').format(parseInt(numeros));
    }
    
    return numeros;
  };
  
  /**
   * Capitaliza la primera letra de cada palabra
   */
  export const capitalizarPalabras = (texto) => {
    if (!texto) return '';
    
    return texto
      .toLowerCase()
      .split(' ')
      .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
      .join(' ');
  };
  
  /**
   * Capitaliza solo la primera letra
   */
  export const capitalizarPrimeraLetra = (texto) => {
    if (!texto) return '';
    
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
  };
  
  /**
   * Trunca texto con puntos suspensivos
   */
  export const truncarTexto = (texto, longitud = 100, sufijo = '...') => {
    if (!texto) return '';
    
    if (texto.length <= longitud) return texto;
    
    return texto.slice(0, longitud).trim() + sufijo;
  };
  
  /**
   * Formatea tiempo de duración
   */
  export const formatearDuracion = (minutos) => {
    if (!minutos || minutos < 0) return '0 min';
    
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    
    if (horas === 0) return `${mins} min`;
    if (mins === 0) return `${horas} h`;
    
    return `${horas} h ${mins} min`;
  };
  
  /**
   * Formatea estados de reserva para mostrar
   */
  export const formatearEstadoReserva = (estado) => {
    const estados = {
      'pendiente': 'Pendiente de Pago',
      'confirmada': 'Confirmada',
      'cancelacion_pendiente': 'Cancelación Pendiente',
      'cancelada': 'Cancelada',
      'completada': 'Completada'
    };
    
    return estados[estado] || capitalizarPrimeraLetra(estado);
  };
  
  /**
   * Formatea tipos de reserva
   */
  export const formatearTipoReserva = (tipo) => {
    const tipos = {
      'privada': 'Reserva Privada',
      'general': 'Entrada General'
    };
    
    return tipos[tipo] || capitalizarPrimeraLetra(tipo);
  };
  
  /**
   * Formatea horarios
   */
  export const formatearHorario = (horario, jornada = null) => {
    const horarios = {
      'diurno': 'Diurno (9AM-12PM, 2PM-6PM)',
      'nocturno': 'Nocturno (6PM-11PM)'
    };
    
    let texto = horarios[horario] || capitalizarPrimeraLetra(horario);
    
    if (jornada && jornada !== 'completa') {
      const jornadas = {
        'manana': 'Solo Mañana (9AM-12PM)',
        'tarde': 'Solo Tarde (2PM-6PM)'
      };
      texto = jornadas[jornada] || texto;
    }
    
    return texto;
  };
  
  /**
   * Formatea listas con "y" al final
   */
  export const formatearLista = (items, separador = ', ', ultimoSeparador = ' y ') => {
    if (!items || items.length === 0) return '';
    
    if (items.length === 1) return items[0];
    if (items.length === 2) return items.join(ultimoSeparador);
    
    const todosExceptoUltimo = items.slice(0, -1).join(separador);
    const ultimo = items[items.length - 1];
    
    return todosExceptoUltimo + ultimoSeparador + ultimo;
  };
  
  /**
   * Genera iniciales de un nombre
   */
  export const generarIniciales = (nombre, maxIniciales = 2) => {
    if (!nombre) return '';
    
    const palabras = nombre.trim().split(' ');
    const iniciales = palabras
      .slice(0, maxIniciales)
      .map(palabra => palabra.charAt(0).toUpperCase())
      .join('');
    
    return iniciales;
  };
  
  /**
   * Formatea rangos numéricos
   */
  export const formatearRangoNumeros = (min, max, unidad = '') => {
    if (min === max) return `${formatearNumero(min)}${unidad}`;
    
    return `${formatearNumero(min)} - ${formatearNumero(max)}${unidad}`;
  };
  
  /**
   * Limpia y formatea texto para URLs
   */
  export const formatearParaURL = (texto) => {
    if (!texto) return '';
    
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .replace(/[^\w\s-]/g, '') // Remover caracteres especiales
      .replace(/\s+/g, '-') // Espacios a guiones
      .replace(/-+/g, '-') // Múltiples guiones a uno
      .trim('-'); // Remover guiones del inicio y fin
  };
  
  /**
   * Formatea máscaras de entrada para inputs
   */
  export const aplicarMascara = (valor, mascara) => {
    if (!valor || !mascara) return valor;
    
    const soloNumeros = valor.replace(/\D/g, '');
    let resultado = '';
    let j = 0;
    
    for (let i = 0; i < mascara.length && j < soloNumeros.length; i++) {
      if (mascara[i] === '#') {
        resultado += soloNumeros[j];
        j++;
      } else {
        resultado += mascara[i];
      }
    }
    
    return resultado;
  };
  
  /**
   * Formatea números de personas con texto descriptivo
   */
  export const formatearPersonasTexto = (numero) => {
    if (!numero || numero < 1) return '0 personas';
    if (numero === 1) return '1 persona';
    
    return `${formatearNumero(numero)} personas`;
  };
  
  /**
   * Convierte texto a formato de búsqueda
   */
  export const formatearParaBusqueda = (texto) => {
    if (!texto) return '';
    
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .trim();
  };
  
  export default {
    formatearMoneda,
    formatearNumero,
    formatearPorcentaje,
    formatearTelefono,
    formatearDocumento,
    capitalizarPalabras,
    capitalizarPrimeraLetra,
    truncarTexto,
    formatearDuracion,
    formatearEstadoReserva,
    formatearTipoReserva,
    formatearHorario,
    formatearLista,
    generarIniciales,
    formatearRangoNumeros,
    formatearParaURL,
    aplicarMascara,
    formatearPersonasTexto,
    formatearParaBusqueda
  };