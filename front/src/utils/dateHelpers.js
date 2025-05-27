
export const esFinDeSemana = (fecha) => {
    if (!fecha) return false;
    const dia = new Date(fecha).getDay();
    return dia === 0 || dia === 6; // Domingo (0) o Sábado (6)
  };
  
  /**
   * Verifica si una fecha es día festivo
   */
  export const esFestivo = (fecha) => {
    if (!fecha) return false;
    
    const fechaObj = new Date(fecha);
    const mes = fechaObj.getMonth() + 1; // getMonth() devuelve 0-11
    const dia = fechaObj.getDate();
    
    // Festivos fijos en Colombia
    const festivosFijos = [
      '01-01', // Año Nuevo
      '05-01', // Día del Trabajo
      '07-20', // Día de la Independencia
      '08-07', // Batalla de Boyacá
      '12-08', // Inmaculada Concepción
      '12-25', // Navidad
    ];
    
    const fechaStr = `${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
    return festivosFijos.includes(fechaStr);
  };
  
  /**
   * Verifica si una fecha es fin de semana o festivo
   */
  export const esFinDeSemanaoFestivo = (fecha) => {
    return esFinDeSemana(fecha) || esFestivo(fecha);
  };
  
  /**
   * Calcula la diferencia en días entre dos fechas
   */
  export const calcularDiferenciaDias = (fechaInicio, fechaFin) => {
    if (!fechaInicio || !fechaFin) return 1;
    
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    
    const diffTime = fin.getTime() - inicio.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(1, diffDays + 1); // Incluir ambos días
  };
  
  /**
   * Formatea una fecha para mostrar
   */
  export const formatearFecha = (fecha, opciones = {}) => {
    if (!fecha) return '';
    
    const defaultOpciones = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    
    return new Date(fecha).toLocaleDateString('es-ES', {
      ...defaultOpciones,
      ...opciones
    });
  };
  
  /**
   * Formatea una fecha de forma corta
   */
  export const formatearFechaCorta = (fecha) => {
    if (!fecha) return '';
    
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  /**
   * Obtiene el nombre del día de la semana
   */
  export const obtenerNombreDia = (fecha) => {
    if (!fecha) return '';
    
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long'
    });
  };
  
  /**
   * Verifica si una fecha está en el pasado
   */
  export const esFechaPasada = (fecha) => {
    if (!fecha) return false;
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const fechaObj = new Date(fecha);
    fechaObj.setHours(0, 0, 0, 0);
    
    return fechaObj < hoy;
  };
  
  /**
   * Verifica si una fecha es hoy
   */
  export const esFechaHoy = (fecha) => {
    if (!fecha) return false;
    
    const hoy = new Date();
    const fechaObj = new Date(fecha);
    
    return hoy.toDateString() === fechaObj.toDateString();
  };
  
  /**
   * Verifica si una fecha es mañana
   */
  export const esFechaManana = (fecha) => {
    if (!fecha) return false;
    
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    
    const fechaObj = new Date(fecha);
    
    return manana.toDateString() === fechaObj.toDateString();
  };
  
  /**
   * Calcula días hasta una fecha
   */
  export const diasHastaFecha = (fecha) => {
    if (!fecha) return 0;
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const fechaObj = new Date(fecha);
    fechaObj.setHours(0, 0, 0, 0);
    
    const diffTime = fechaObj.getTime() - hoy.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  /**
   * Obtiene la fecha mínima para reservas (hoy)
   */
  export const obtenerFechaMinima = () => {
    return new Date().toISOString().split('T')[0];
  };
  
  /**
   * Obtiene la fecha máxima para reservas (90 días en el futuro)
   */
  export const obtenerFechaMaxima = (diasAdelante = 90) => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + diasAdelante);
    return fecha.toISOString().split('T')[0];
  };
  
  /**
   * Convierte fecha a formato ISO para inputs
   */
  export const fechaAInputDate = (fecha) => {
    if (!fecha) return '';
    return new Date(fecha).toISOString().split('T')[0];
  };
  
  /**
   * Valida si una fecha está en el rango permitido
   */
  export const validarFechaRango = (fecha, minDias = 1, maxDias = 90) => {
    if (!fecha) return false;
    
    const fechaObj = new Date(fecha);
    const hoy = new Date();
    
    const fechaMinima = new Date();
    fechaMinima.setDate(hoy.getDate() + minDias - 1);
    
    const fechaMaxima = new Date();
    fechaMaxima.setDate(hoy.getDate() + maxDias);
    
    return fechaObj >= fechaMinima && fechaObj <= fechaMaxima;
  };
  
  /**
   * Obtiene las fechas de una semana
   */
  export const obtenerFechasSemana = (fecha) => {
    const fechaObj = new Date(fecha);
    const dia = fechaObj.getDay();
    
    const lunes = new Date(fechaObj);
    lunes.setDate(fechaObj.getDate() - dia + (dia === 0 ? -6 : 1));
    
    const fechas = [];
    for (let i = 0; i < 7; i++) {
      const fechaDia = new Date(lunes);
      fechaDia.setDate(lunes.getDate() + i);
      fechas.push(fechaDia);
    }
    
    return fechas;
  };
  
  /**
   * Formatea un rango de fechas
   */
  export const formatearRangoFechas = (fechaInicio, fechaFin) => {
    if (!fechaInicio) return '';
    
    if (!fechaFin || fechaInicio === fechaFin) {
      return formatearFecha(fechaInicio);
    }
    
    const inicio = formatearFechaCorta(fechaInicio);
    const fin = formatearFechaCorta(fechaFin);
    
    return `${inicio} - ${fin}`;
  };
  
  /**
   * Obtiene texto descriptivo para una fecha
   */
  export const obtenerTextoDescriptivoFecha = (fecha) => {
    if (!fecha) return '';
    
    if (esFechaHoy(fecha)) return 'Hoy';
    if (esFechaManana(fecha)) return 'Mañana';
    
    const dias = diasHastaFecha(fecha);
    
    if (dias < 0) return 'Pasado';
    if (dias <= 7) return `En ${dias} días`;
    if (dias <= 30) return `En ${Math.ceil(dias / 7)} semanas`;
    
    return formatearFechaCorta(fecha);
  };
  
  /**
   * Agrupa fechas por mes
   */
  export const agruparPorMes = (fechas) => {
    const grupos = {};
    
    fechas.forEach(fecha => {
      const fechaObj = new Date(fecha);
      const clave = `${fechaObj.getFullYear()}-${fechaObj.getMonth()}`;
      const nombreMes = fechaObj.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long' 
      });
      
      if (!grupos[clave]) {
        grupos[clave] = {
          nombre: nombreMes,
          fechas: []
        };
      }
      
      grupos[clave].fechas.push(fecha);
    });
    
    return grupos;
  };
  
  /**
   * Verifica si dos fechas están en el mismo día
   */
  export const esMismoDia = (fecha1, fecha2) => {
    if (!fecha1 || !fecha2) return false;
    
    const f1 = new Date(fecha1);
    const f2 = new Date(fecha2);
    
    return f1.toDateString() === f2.toDateString();
  };
  
  export default {
    esFinDeSemana,
    esFestivo,
    esFinDeSemanaoFestivo,
    calcularDiferenciaDias,
    formatearFecha,
    formatearFechaCorta,
    obtenerNombreDia,
    esFechaPasada,
    esFechaHoy,
    esFechaManana,
    diasHastaFecha,
    obtenerFechaMinima,
    obtenerFechaMaxima,
    fechaAInputDate,
    validarFechaRango,
    obtenerFechasSemana,
    formatearRangoFechas,
    obtenerTextoDescriptivoFecha,
    agruparPorMes,
    esMismoDia
  };