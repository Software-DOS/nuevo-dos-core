import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { GthEmpleadoService } from 'src/app/services/gthempleado.service';
import { GthEvaluacionService } from '../../../services/gth-evaluacion.service';
import { GthCompetenciaService } from 'src/app/services/gth-competencia.service';
import { GthAreaService } from 'src/app/services/gth-area.service';

import { iGTHEmpleado } from '../../../interface/igth-empleado';
import { IgthObjetivo } from '../../../interface/igth-objetivo';
import { Ievaluacion } from '../../../interface/ievaluacion';
import { IGTHNivelCompetenciaViewModel, 
  IGTHAsignacionCompetenciaViewModel } 
  from '../../../interface/ight-competencia';
import { IgthArea, } from '../../../interface/igth-area';

import { alerts } from '../../../helpers/alerts';

//Interfaz usada por el frontend para mapear los campos necesarios y mostrar
interface Empleado {
  id: number;
  nombre: string;
  sexo: string; 
  area: string;
  fechaInicio: string;
  calificado: string;
  photo: string;
  ubicacion?: string;
  idioma?: string;
  estado: string | undefined;
}

interface Filtros {
  area: string;
  calificado: string;
}

// Interface utilizada para almacenar todos los datos necesarios
interface NivelConCompetencia {
  idAsignacionCompetencia: number; 
  idCompetencia: number;
  nivel: number;
  descripcion: string;
  nombreCompetencia: string;
  tipoCompetencia: string;
  valor: number;
  fecha: string;
  reconsiderar: number;
  calificacion: number;  
  calificacionFinal: number; 
  FechaLimite?: Date;
}

@Component({
  selector: 'app-lista-evaluaciones',
  templateUrl: './lista-evaluaciones.component.html',
  styleUrls: ['./lista-evaluaciones.component.css']
})
export class ListaEvaluacionesComponent implements OnInit {

  activeSubcategory: string = 'curso'; // Sección de pestaña activa por defecto

  // =====================
  // 📌 Datos para filtros
  // =====================
  filtroEmpleado: string = '';

  
  empleados: any[] = [
  ];

  niveles: string[] = [
  ];


  // Variables usadas para el Modal    ----------------------------------------
  mostrarModalEvaluacion = false;
  fase: number = 2;
  // objetivos: IgthObjetivo[] = [];
  // tiempoPlan: string = '';

  // currentPhase: number = 2; // Fase inicial

  // Variable para almacenar la información del empleado
  empleadoModal: iGTHEmpleado | null = null;
  empleadoSeleccionadoId: number = 2;

  showModal: boolean = false;
  selectedEmpleadoId: number | null = null;

  objetivoAreaDisplay: string = 'El objetivo de un área de TI es gestionar la infraestructura tecnológica, mantener las operaciones de la empresa y, al mismo tiempo, apoyar los objetivos comerciales del negocio, ya sea mediante la mejora de la eficiencia, la innovación y la protección de los datos, adaptándose a las necesidades y nueva estrategia';

  // declara la propiedad global del componente
  // nivelesCompetencias: NivelConCompetencia[] = [];

    /* -------------  Campos para mostrar en el MODAL  ----------  */
  // Variables para mostrar la información (solo lectura)

  fotoPerfilUrlModal: string = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'; // Imagen por defecto
  fotoPerfilUrlDisplayModal: string = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

  nombreCompletoDisplayModal: string = ''; 
  correoElectronicoDisplayModal: string = ''; 
  posicionDisplayModal: string = ''; 

  // EJEMPLO DESPUES TOCA BORRAR  
  objetivosIndividuales = [
    { titulo: 'Reducir tiempos de entrega', descripcion: 'Optimizar el flujo de trabajo', peso: 20, valoracionEmpleado: 90, valoracionJefe: 4, calificacionFinal: 88, fechaLimite: '2025-12-15' },
    { titulo: 'Aumentar satisfacción del cliente', descripcion: 'Mejorar atención postventa', peso: 25, valoracionEmpleado: 95, valoracionJefe: 5, calificacionFinal: 92, fechaLimite: '2025-11-20' },
    { titulo: 'Capacitar al personal', descripcion: 'Implementar programa trimestral', peso: 15, valoracionEmpleado: 80, valoracionJefe: 3, calificacionFinal: 75, fechaLimite: '2025-10-30' },
    { titulo: 'Reducir costos operativos', descripcion: 'Control de inventarios', peso: 25, valoracionEmpleado: 85, valoracionJefe: 4, calificacionFinal: 82, fechaLimite: '2025-12-01' },
    { titulo: 'Implementar mejoras tecnológicas', descripcion: 'Adoptar herramientas digitales', peso: 15, valoracionEmpleado: 90, valoracionJefe: 5, calificacionFinal: 89, fechaLimite: '2025-11-10' },
  ];

  nivelesCompetencias = [
    { tipoCompetencia: 'Organizacional', nombreCompetencia: 'Comprensión Interpersonal', nivel: 2, descripcion: 'Conoce y maneja sus emociones.', valor: 85, fecha: '2025-11-15' },
    { tipoCompetencia: 'Comportamental', nombreCompetencia: 'Comunicación Asertiva', nivel: 3, descripcion: 'Escucha e implementa canales de comunicación efectiva.', valor: 90, fecha: '2025-12-10' },
    { tipoCompetencia: 'Técnica', nombreCompetencia: 'Gestión de Proyectos', nivel: 3, descripcion: 'Administra recursos y tareas efectivamente.', valor: 88, fecha: '2025-11-25' },
    { tipoCompetencia: 'Liderazgo', nombreCompetencia: 'Trabajo en Equipo', nivel: 2, descripcion: 'Colabora y motiva a su equipo.', valor: 92, fecha: '2025-12-20' },
    { tipoCompetencia: 'Innovación', nombreCompetencia: 'Pensamiento Creativo', nivel: 3, descripcion: 'Propone ideas y mejoras continuas.', valor: 87, fecha: '2025-10-30' },
  ];

  retroalimentacion = 'El desempeño del empleado fue sobresaliente en la mayoría de los objetivos.';
  planAccion = 'Reforzar habilidades de liderazgo mediante talleres trimestrales.';
  tiempoPlan = '3_meses';

    // Puedes usar: 'sm', 'lg', 'xl', o 'full'
  modalSize: 'sm' | 'lg' | 'xl' | 'full' = 'xl';

  // Cambiar tamaño desde un botón o lógica
  setModalSize(size: 'sm' | 'lg' | 'xl' | 'full') {
    this.modalSize = size;
  }


  
  // =================================================
  // 📌 Variables para competencias (ahora desde BD)
  // =================================================  
  competencias: { idCompetencia: number, tipo: string, NombreCompetencia: string }[] = [];  
  competenciasFiltradas: { idCompetencia: number, tipo: string, NombreCompetencia: string }[] = [];
  tiposCompetencia: string[] = [];

  tipoCompetencia: string | null = null;
  competenciaSeleccionada: string | null = null;
  nivelSeleccionado: string | null = null;

  // Agregar estas variables (mantén las existentes)
  nivelesCompetencia: IGTHNivelCompetenciaViewModel[] = []; // Niveles desde BD
  nivelesDisponibles: string[] = []; // Niveles filtrados para mostrar en el select
  

  //-----------------------------         ------------------------------------        ---------------------------------

  // NgModel properties for filters
  filtroArea: string = '';
  filtroNombre: string = '';
  filtroCalificado: string = '';
  // filtroUbicacion: string = '';
  filtroIdioma: string = '';

  filtros: Filtros = {
    area: '',
    calificado: ''
  };

  //empleados: Empleado[] = [];

  empleadosFiltrados: Empleado[] = [];

  constructor(
    private router: Router, 
    private gthEmpleadoService: GthEmpleadoService, 
    private gthCompetenciaService: GthCompetenciaService, 
    private gthEvaluacionServcie: GthEvaluacionService,
    private gthAreaService: GthAreaService) {      
  }
    
  

  ngOnInit(): void {
    this.cargarEvaluaciones(); //Cargar empleados con evaluaciones
    this.cargarEmpleadosParaEvaluacion(); // Carga todos los empleados
    this.cargarCompetencias();

    this.obtenerCelulas(); // Carga todas las celulas para seleccionar AREA-cambiar
  
    // Cargar todos los empleados al iniciar
    this.cargarEmpleadosParaJefeEvaluador();
  }



// 2. Método principal optimizado
cargarEvaluaciones(): void {
  
  this.gthEvaluacionServcie.MostrarEvaluaciones().subscribe({
    next: (response: any) => {

      let evaluacionesData = response;
      if (response && response.$values) {
        evaluacionesData = response.$values;
      }

      if (evaluacionesData && Array.isArray(evaluacionesData)) {
        this.procesarEvaluaciones(evaluacionesData);
      } else {
        this.cargarEmpleadosConParametros();
      }
    },
    error: (error) => {
      this.cargarEmpleadosConParametros();
    }
  });
}

/**
 * Procesar evaluaciones y obtener datos mínimos de empleados
 */
private procesarEvaluaciones(evaluaciones: Ievaluacion[]): void {
  
  // Extraer IDs únicos de empleados
  const idsEmpleados = [...new Set(evaluaciones.map(evaluacion => evaluacion.idEmpleado))];

  if (idsEmpleados.length === 0) {
    this.cargarEmpleadosConParametros();
    return;
  }

  // Almacenar empleados obtenidos
  const empleadosObtenidos: { [key: number]: iGTHEmpleado } = {};
  let empleadosProcessed = 0;

  // Obtener datos mínimos de cada empleado
  idsEmpleados.forEach(idEmpleado => {
    // Usar tipo=1 para buscar por ID específico
    this.gthEmpleadoService.MostrarConParametros(1, idEmpleado).subscribe({
      next: (response: any) => {
        
        let empleadoData = null;
        
        // Manejar diferentes estructuras de respuesta
        if (response && response.$values && Array.isArray(response.$values)) {
          // Buscar el empleado específico en el array $values
          empleadoData = response.$values.find((emp: any) => emp.idEmpleado === idEmpleado);
          
          // Si no se encuentra, tomar el primer elemento si solo hay uno
          if (!empleadoData && response.$values.length === 1) {
            empleadoData = response.$values[0];
          }
        } else if (Array.isArray(response)) {
          empleadoData = response.find((emp: any) => emp.idEmpleado === idEmpleado);
          
          // Si no se encuentra, tomar el primer elemento si solo hay uno
          if (!empleadoData && response.length === 1) {
            empleadoData = response[0];
          }
        } else if (response && response.idEmpleado) {
          empleadoData = response;
        }
        
        if (empleadoData) {
          empleadosObtenidos[idEmpleado] = empleadoData;
        } else {
          console.warn(`⚠️ No se encontraron datos para empleado ${idEmpleado}. Respuesta completa:`, response);
        }

        empleadosProcessed++;
        
        // Mapear cuando todos estén procesados
        if (empleadosProcessed === idsEmpleados.length) {
          this.mapearEvaluacionesConEmpleados(evaluaciones, empleadosObtenidos);
        }
      },
      error: (error) => {
        console.error(`❌ Error al obtener empleado ${idEmpleado}:`, error);
        empleadosProcessed++;
        
        // Continuar aunque falle uno
        if (empleadosProcessed === idsEmpleados.length) {
          this.mapearEvaluacionesConEmpleados(evaluaciones, empleadosObtenidos);
        }
      }
    });
  });
}

/**
 * Mapear evaluaciones con datos mínimos de empleados
 */
private mapearEvaluacionesConEmpleados(evaluaciones: Ievaluacion[], empleadosData: { [key: number]: iGTHEmpleado }): void {
  const empleadosMapeados: Empleado[] = evaluaciones.map(evaluacion => {
    const empleado = empleadosData[evaluacion.idEmpleado];
    
    if (!empleado) {
      const nombreFallback = (evaluacion as any).nombreCompleto || 
                           `${(evaluacion as any).nombreEmpleado || ''} ${(evaluacion as any).apellidoEmpleado || ''}`.trim() ||
                           `Empleado ${evaluacion.idEmpleado}`;
      
      return {
        id: evaluacion.idEmpleado,
        nombre: nombreFallback,
        sexo: 'N/A',
        area: 'N/A',
        fechaInicio: this.formatearFecha(evaluacion.fechaCreacion || ''),
        calificado: 'Pendiente',
        photo: this.construirUrlFoto('', ''),
        estado: evaluacion.estado || 'PENDIENTE'
      };
    }

    const nombreCompleto = `${empleado.nombre || ''} ${empleado.apellido || ''}`.trim();
    
    return {
      id: evaluacion.idEmpleado,
      nombre: nombreCompleto || `Empleado ${evaluacion.idEmpleado}`,
      sexo: empleado.sexo || 'N/A',
      area: empleado.area || 'Sin área',
      fechaInicio: this.formatearFecha(evaluacion.fechaCreacion || ''),
      calificado: evaluacion.calificacionFinal ? 
        `${evaluacion.calificacionFinal}/100` : 'Pendiente',
      photo: this.construirUrlFoto(empleado.fotoPerfilUrl || '', empleado.sexo || ''),
      estado: evaluacion.estado || 'PENDIENTE'
    };
  });

  if (empleadosMapeados.length > 0) {
    this.empleados = empleadosMapeados;
    this.empleadosFiltrados = [...this.empleados];
    // <!-- Console log BORRAR -->
    console.log(`${this.empleados.length} evaluaciones cargadas correctamente`);
  } else {
    console.error('No se pudieron mapear las evaluaciones');
    this.cargarDatosPorDefecto();
  }
}

/**
 * Método alternativo simplificado
 */
private cargarEmpleadosConParametros(): void {

  this.gthEmpleadoService.MostrarConParametros(0).subscribe({
    next: (response: any) => {
      let empleadosData = response;
      if (response && response.$values) {
        empleadosData = response.$values;
      }
      
      if (empleadosData && Array.isArray(empleadosData)) {
        // Mapear empleados sin evaluación
        this.empleados = empleadosData.map((emp: iGTHEmpleado) => ({
          id: emp.idEmpleado,
          nombre: `${emp.nombre || ''} ${emp.apellido || ''}`.trim(),
          sexo: emp.sexo || 'N/A',
          photo: this.construirUrlFoto(emp.fotoPerfilUrl || '', emp.sexo || ''),
          
          // Propiedades que espera el template
          area: emp.area || 'Sin área', // Cambiado de departamento a area
          fechaIncorporacion: emp.fechaContratacion || 'N/A',
          calificado: 'Sin evaluación',
          estado: 'Sin asignar',
          
          // Datos de evaluación por defecto
          idEvaluacion: 0,
          anioEvaluacion: new Date().getFullYear(),
          estadoEvaluacion: 'Sin asignar',
          fechaCreacion: 'N/A',
          fechaLimite: 'N/A',
          fechaFinalizacion: undefined,
          calificacionFinal: undefined,
          observaciones: 'Sin evaluación asignada'
        }));
        
        this.empleadosFiltrados = [...this.empleados];
        console.log("✅ Empleados sin evaluación cargados:", this.empleados.length);
      } else {
        this.cargarDatosPorDefecto();
      }
    },
    error: (error) => {
      console.error('❌ Error en método alternativo:', error);
      this.cargarDatosPorDefecto();
    }
  });
}

/**
 * Buscar evaluaciones específicas de un empleado
 */
buscarEvaluacionesPorEmpleado(idEmpleado: number, anio?: number): void {
  
  this.gthEvaluacionServcie.MostrarEvaluaciones().subscribe({
    next: (response: any) => {
      let evaluaciones = response;
      if (response && response.$values) {
        evaluaciones = response.$values;
      }
      
      // Filtrar por empleado y año si se especifica
      const evaluacionesFiltradas = evaluaciones.filter((evaluacion: Ievaluacion) => {
        const coincideEmpleado = evaluacion.idEmpleado === idEmpleado;
        const coincideAnio = !anio || evaluacion.anio === anio;
        return coincideEmpleado && coincideAnio;
      });
      
      console.log(`📋 Evaluaciones encontradas para empleado ${idEmpleado}:`, evaluacionesFiltradas);
      return evaluacionesFiltradas;
    },
    error: (error) => {
      console.error(`❌ Error al buscar evaluaciones del empleado ${idEmpleado}:`, error);
    }
  });
}

/**
 * Obtener resumen de evaluaciones por estado
 */
// obtenerResumenEvaluaciones(): void {
//   this.gthEvaluacionServcie.MostrarEvaluaciones().subscribe({
//     next: (response: any) => {
//       let evaluaciones = response;
//       if (response && response.$values) {
//         evaluaciones = response.$values;
//       }
      
//       // Agrupar por estado
//       const resumen = evaluaciones.reduce((acc: any, evaluacion: Ievaluacion) => {
//         acc[evaluacion.estado || ''] = (acc[evaluacion.estado || ''] || 0) + 1;
//         return acc;
//       }, {});
      
//       console.log("📊 Resumen de evaluaciones por estado:", resumen);
//     },
//     error: (error) => {
//       console.error("❌ Error al obtener resumen:", error);
//     }
//   });
// }


/**
 * Formatear fecha de ISO string a dd/mm/yyyy
 */
private formatearFecha(fechaISO: string): string {
  if (!fechaISO) return 'N/A';
  
  try {
    const fecha = new Date(fechaISO);
    if (isNaN(fecha.getTime())) return 'N/A';
    
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    
    return `${dia}/${mes}/${anio}`;
  } catch (error) {
    
     console.warn('Error al formatear fecha:', fechaISO, error); //<!-- Console log BORRAR -->
    return 'N/A';
  }
}

construirUrlFoto(fotoPerfilUrl: string, sexo: string): string {
  // Normalizar sexo
  const sexoNormalizado = (sexo || '').toString().trim().toLowerCase();

  const defaultFemenino = 'assets/img/iconos/iconos mycollection/png/010-mujer-2.png';
  const defaultMasculino = 'assets/img/iconos/iconos mycollection/png/028-hombre-2.png';
  const defaultGenerico = 'assets/img/iconos/iconos mycollection/png/026-hombre-de-traje-y-corbata.png';

  // Determinar fallback según sexo
  const fallback = sexoNormalizado === 'femenino' || sexoNormalizado === 'f'
    ? defaultFemenino
    : sexoNormalizado === 'masculino' || sexoNormalizado === 'm'
      ? defaultMasculino
      : defaultGenerico;

  // Si no hay URL, usar fallback directamente
  if (!fotoPerfilUrl) return fallback;

  // Si es una URL completa (http/https), devolverla tal cual
  if (fotoPerfilUrl.startsWith('http://') || fotoPerfilUrl.startsWith('https://')) {
    return fotoPerfilUrl;
  }

  // Si es una ruta relativa, construir con el backend
  const baseUrl = environment.urlbackend.endsWith('/')
    ? environment.urlbackend.slice(0, -1)
    : environment.urlbackend;

  if (fotoPerfilUrl.startsWith('/')) {
    return `${baseUrl}${fotoPerfilUrl}`;
  }

  return `${baseUrl}/${fotoPerfilUrl}`;
}


onImageError(event: Event, sexo: string) {
  const img = event.target as HTMLImageElement;
  img.src = this.construirUrlFoto('', sexo); // 👉 fuerza a usar fallback según sexo
}




  /**
   * Cargar datos por defecto en caso de error
   */
  private cargarDatosPorDefecto(): void {
    this.empleados = [
      {
      }
    ];
    this.empleadosFiltrados = [...this.empleados];
  }

  aplicarFiltros(): void {
    this.empleadosFiltrados = this.empleados.filter(empleado => {
      // Filtro de departamento como búsqueda de texto (case insensitive)
      const coincideDepto = !this.filtroArea || 
        empleado.area.toLowerCase().includes(this.filtroArea.toLowerCase());
      
      // Filtro de nombre como búsqueda de texto (case insensitive)
      const coincideNombre = !this.filtroNombre || 
        empleado.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase());
      
      // Filtro de calificado (exacto)
      const coincideCalif = !this.filtroCalificado || 
        empleado.calificado.toLowerCase() === this.filtroCalificado.toLowerCase();      
        
      return coincideDepto && coincideNombre && coincideCalif;
    });
  }

  navigateToEvaluacion(empleadoId: number): void {
    console.log('➡️ Entró en navigateToEvaluacion con empleadoId:', empleadoId);
    this.selectedEmpleadoId = empleadoId;
    this.fase = 2; // o 4, según la que quieras mostrar
    this.showModal = true;
  }

  cerrarModal(): void {
    this.showModal = false;
  }


  //Mostrar el contenido de las pestañas
  showSubcategoryEval(tab: string): void {
    this.activeSubcategory = tab;
    console.log('Pestaña activa:', this.activeSubcategory);
  }

  // Damos color a la etiqueta de AREA
  getAreaClass(area: string): string {
    const areaKey = area.toLowerCase();
    switch (areaKey) {
      case 'tecnología':
        return 'area-badge area-tecnologia';
      case 'recursos humanos':
        return 'area-badge area-talento';
      case 'marketing':
        return 'area-badge area-marketing';
      case 'finanzas':
        return 'area-badge area-finanzas';
      case 'ingeniería':
        return 'area-badge area-legal';
      case 'operaciones':
        return 'area-badge area-calidad';
      default:
        return 'area-badge';
    }
  }


//--------------------      ---------------------------------       ------------------------


/*===================================================================
            FUNCIONES PARA LA SECCION DE GESTION DE AREA
 ====================================================================*/

 // Variables del Paso 1
  nombreArea: string = '';
  nombreCelula: string = '';
  jefeSeleccionado: any = null; // Cambiar a null

  // Control del Paso 2
  paso2Habilitado: boolean = false;

  // Validar Paso 1
  validarPaso1(): void {
    this.paso2Habilitado = 
      // this.nombreArea?.trim().length > 0 && 
      this.nombreCelula?.trim().length > 0 && 
      this.jefeSeleccionado != null; // Usa != para capturar null y undefined
      
    console.log('Validación Paso 1:', {
      // nombreArea: this.nombreArea,
      nombreCelula: this.nombreCelula,
      jefeSeleccionado: this.jefeSeleccionado,
      paso2Habilitado: this.paso2Habilitado
    });
  }

  // Llamar en cada cambio
  onInputChange(): void {
    this.validarPaso1();
  }

  // Lista de empleados asignados
  empleadosAsignados: any[] = [];
  empleadoSeleccionado: any = null;
  mensajeEmpleado: string = '';
  tipoMensaje: 'error' | 'success' | '' = '';


  // Variables para células AREA-cambiar
  celulas: IgthArea[] = [];
  celulasFiltradas: IgthArea[] = [];
  mostrarSugerencias: boolean = false;


  // Validar formulario completo
formularioValido(): boolean {
  return this.nombreCelula.trim() !== '' && 
         this.jefeSeleccionado !== null &&
         this.empleadosAsignados.length > 0;
}

  /**
   * Obtener todas las células existentes
   */
  obtenerCelulas(): void {
  this.gthAreaService.MostrarCelulas().subscribe({
    next: (response: any) => {
      console.log('✅ Respuesta completa del backend ->', response);
      
      if (response?.$values) {
        this.celulas = response.$values;
      } else if (Array.isArray(response)) {
        this.celulas = response;
      }
      
      console.log('✅ Total células:', this.celulas.length);
      
      // 👇 VER ESTRUCTURA COMPLETA DE LA PRIMERA CÉLULA
      if (this.celulas.length > 0) {
        console.log('📋 Primera célula completa:', this.celulas[0]);
        console.log('📋 Propiedades:', Object.keys(this.celulas[0]));
      }
    },
    error: (error) => {
      console.error('❌ Error:', error);
    }
  });
}

  /**
   * Filtrar células mientras se escribe
   */
  // Variable para saber si es célula nueva
esCelulaNueva: boolean = false;

onCelulaInput(): void {
  this.onInputChange(); // Validar paso 1
  
  const busqueda = this.nombreCelula?.trim().toLowerCase() || '';
  
  if (busqueda.length >= 3) {
    this.celulasFiltradas = this.celulas.filter(celula => {
      const nombre = celula.nombre?.toLowerCase() || '';
      return nombre.includes(busqueda);
    });
    
    this.mostrarSugerencias = this.celulasFiltradas.length > 0;
    
    // 👇 VERIFICAR SI ES NUEVA
    const coincideExacta = this.celulas.some(celula => 
      celula.nombre?.toLowerCase() === busqueda
    );
    this.esCelulaNueva = !coincideExacta;
  } else {
    this.celulasFiltradas = [];
    this.mostrarSugerencias = false;
    this.esCelulaNueva = false;
  }
}

seleccionarCelula(celula: IgthArea): void {
  this.nombreCelula = celula.nombre;
  this.mostrarSugerencias = false;
  this.celulasFiltradas = [];
  this.esCelulaNueva = false; // 👈 No es nueva si la seleccionó
  this.onInputChange();
}

  /**
   * Cerrar sugerencias al hacer click fuera
   */
  cerrarSugerencias(): void {
    setTimeout(() => {
      this.mostrarSugerencias = false;
    }, 200);
  }


  // Guardar área completa
guardarArea(): void {
  if (!this.formularioValido()) {
    alert('Por favor complete todos los campos y asigne al menos un empleado');
    return;
  }

  // Paso 1: Crear o buscar célula
  this.crearOBuscarCelula().subscribe({
    next: (idCelula: number) => {
      console.log('✅ ID Célula obtenida:', idCelula);
      
      // Paso 2: Actualizar empleados con el idCelula
      this.actualizarEmpleadosConCelula(idCelula);
    },
    error: (error) => {
      console.error('❌ Error al crear/buscar célula:', error);
      alert('Error al guardar el área');
    }
  });
}

// Crear o buscar célula existente
crearOBuscarCelula(): Observable<number> {
  return new Observable<number>(observer => {
    // Si es célula existente
    if (!this.esCelulaNueva) {
      const celulaExistente = this.celulas.find(c => 
        c.nombre?.toLowerCase() === this.nombreCelula.toLowerCase()
      );
      
      if (celulaExistente?.idCelula) {
        // ✅ ACTUALIZAR el encargado de la célula existente
        const celulaActualizada: IgthArea = {
          tipo: 1, // 1 = Actualizar
          idCelula: celulaExistente.idCelula,
          nombre: celulaExistente.nombre,
          encargado: this.jefeSeleccionado?.nombre || '',
          descripcion: celulaExistente.descripcion,
          objetivo: celulaExistente.objetivo
        };
        
        this.gthAreaService.gestionarCelula(1, celulaActualizada).subscribe({
          next: (response: any) => {
            console.log('✅ Célula actualizada con nuevo encargado:', response);
            observer.next(celulaExistente.idCelula!);
            observer.complete();
          },
          error: (err: any) => {
            observer.error(err);
          }
        });
        return;
      }
    }
    
    // Si es nueva, crearla
    const nuevaCelula: IgthArea = {
      tipo: 0,
      nombre: this.nombreCelula,
      descripcion: `Célula ${this.nombreCelula}`,
      encargado: this.jefeSeleccionado?.nombre || '',
      objetivo: ''
    };
    
    this.gthAreaService.gestionarCelula(0, nuevaCelula).subscribe({
      next: (response: any) => {
        console.log('✅ Célula creada:', response);
        
        // Buscar el ID recién creado
        this.gthAreaService.MostrarCelulas().subscribe({
          next: (celulasResponse: any) => {
            const celulas = celulasResponse?.$values || celulasResponse || [];
            
            const celulaCreada = celulas.find((c: any) => 
              c.nombre?.toLowerCase() === this.nombreCelula.toLowerCase()
            );
            
            if (celulaCreada?.idCelula) {
              console.log('🆔 ID encontrado:', celulaCreada.idCelula);
              observer.next(celulaCreada.idCelula);
              observer.complete();
            } else {
              observer.error('No se pudo encontrar la célula creada');
            }
          },
          error: (err: any) => {
            observer.error(err);
          }
        });
      },
      error: (err: any) => {
        observer.error(err);
      }
    });
  });
}

// Actualizar empleados con el idCelula
actualizarEmpleadosConCelula(idCelula: number): void {
  const empleadosTotal = [...this.empleadosAsignados];
  
  const jefeYaIncluido = empleadosTotal.some(e => e.id === this.jefeSeleccionado.id);
  if (!jefeYaIncluido) {
    empleadosTotal.push(this.jefeSeleccionado);
  }
  
  console.log(`📝 Actualizando ${empleadosTotal.length} empleados con idCelula: ${idCelula}`);
  
  let completados = 0;
  let errores = 0;
  
  empleadosTotal.forEach((empleado) => {
    // ✅ SOLO ENVIAR LOS CAMPOS NECESARIOS
    const data = {
      tipo: 1,
      idEmpleado: empleado.id,
      idCelula: idCelula
    };
    
    console.log('📤 Payload simplificado:', data);
    
    this.gthEmpleadoService.gestionarEmpleado(data as any).subscribe({
      next: (response: any) => {
        completados++;
        console.log(`✅ ${empleado.nombre} actualizado`);
        
        if (completados + errores === empleadosTotal.length) {
          this.finalizarGuardado(completados, errores);
        }
      },
      error: (err: any) => {
        errores++;
        console.error(`❌ Error al actualizar ${empleado.nombre}:`, err);
        
        if (completados + errores === empleadosTotal.length) {
          this.finalizarGuardado(completados, errores);
        }
      }
    });
  });
}

// Finalizar guardado
finalizarGuardado(completados: number, errores: number): void {
  if (errores === 0) {
    alert(`✅ Área creada exitosamente!\n${completados} empleados asignados.`);
    this.limpiarFormulario();
  } else {
    alert(`⚠️ Área creada con advertencias:\n✅ ${completados} empleados asignados\n❌ ${errores} empleados con errores`);
  }
}

// Limpiar formulario
limpiarFormulario(): void {
  this.nombreCelula = '';
  this.jefeSeleccionado = null;
  this.empleadoSeleccionado = null;
  this.empleadosAsignados = [];
  this.paso2Habilitado = false;
  this.esCelulaNueva = false;
}



// Agregar empleado a la lista
agregarEmpleado(): void {
  if (this.empleadoSeleccionado) {
    // Validar si es el jefe
    if (this.jefeSeleccionado && this.empleadoSeleccionado.id === this.jefeSeleccionado.id) {
      this.mensajeEmpleado = 'El jefe del área ya está asignado automáticamente';
      this.tipoMensaje = 'error';
      this.ocultarMensaje();
      return;
    }
    
    // Validar si ya está agregado
    const yaExiste = this.empleadosAsignados.some(e => e.id === this.empleadoSeleccionado.id);
    
    if (yaExiste) {
      this.mensajeEmpleado = 'Este empleado ya está en la lista';
      this.tipoMensaje = 'error';
      this.ocultarMensaje();
      return;
    }
    
    // Agregar empleado
    this.empleadosAsignados.push(this.empleadoSeleccionado);
    this.mensajeEmpleado = `${this.empleadoSeleccionado.nombre} agregado correctamente`;
    this.tipoMensaje = 'success';
    this.empleadoSeleccionado = null;
    this.ocultarMensaje();
  }
}

// Remover empleado de la lista
removerEmpleado(empleado: any): void {
  this.empleadosAsignados = this.empleadosAsignados.filter(e => e.id !== empleado.id);
  this.mensajeEmpleado = `${empleado.nombre} removido de la lista`;
  this.tipoMensaje = 'success';
  this.ocultarMensaje();
}

// Ocultar mensaje después de 3 segundos
ocultarMensaje(): void {
  setTimeout(() => {
    this.mensajeEmpleado = '';
    this.tipoMensaje = '';
  }, 3500);
}




  //--------------------      ---------------------------------       ------------------------
  
  // ===============================================
  //     FUNCION PARA CREAR UNA NUEVA EVALUACION
  // ===============================================

  empleadosTodos: any[] = [];
  empleadosFiltrados2: any[] = []; //filtro para buscar empleado por area y crear evaluacion
  empleadoBuscado: any = null; //Buscar empleado para crear evaluacion

  // Filtros para buscar empleado y Crear evaluacion
  filtroAreaBuscarEmp: string = '';

  // NUEVAS variables exclusivas para jefe evaluador
  jefeSeleccionadoEvaluacion: any = null;
  filtroJefeEvaluacion: string = '';
  jefesFiltradosEvaluacion: any[] = [];
  todosLosEmpleadosParaJefe: any[] = []; 

  evaluacionCreada: any = null; // Para almacenar la evaluación creada
  cargandoEvaluacion: boolean = false;
  cargandoEmpleados: boolean = false;


  // Control de visibilidad
  mostrarCompetencias: boolean = false;
  evaluacionGuardada: boolean = false;
  
  competenciasAgregadas: any[] = [];

  


  /*=====================   Buscar empleado para crear su espacio de competencias ======================*/

  /**
   * Cargar todos los empleados disponibles (sin evaluación)
   */
  cargarEmpleadosParaEvaluacion(): void {
    this.cargandoEmpleados = true;
    
    this.gthEmpleadoService.Mostrar().subscribe({
      next: (response: any) => {
        let empleadosBD = response;
        if (response && response.$values) {
          empleadosBD = response.$values;
        }

        if (empleadosBD && Array.isArray(empleadosBD)) {
          this.empleadosTodos = empleadosBD.map((emp: iGTHEmpleado) => ({
            id: emp.idEmpleado,
            nombre: `${emp.nombre || ''} ${emp.apellido || ''}`.trim() || `Empleado ${emp.idEmpleado}`,
            area: emp.area || 'Sin área'
            // idJefe: emp.idJefe || null
          }));

          this.empleadosFiltrados2 = [...this.empleadosTodos];
          console.log(`Empleados cargados: ${this.empleadosTodos.length}`);
        } else {
          this.empleadosTodos = [];
          this.empleadosFiltrados2 = [];
        }
      },
      error: (error) => {
        console.error('Error al cargar empleados:', error);
        this.empleadosTodos = [];
        this.empleadosFiltrados2 = [];
      },
      complete: () => {
        this.cargandoEmpleados = false;
      }
    });
  }

  /**
   * Filtrar empleados por área
   */
  filtrarEmpleadosParaEvaluacion(): void {
    if (!this.filtroAreaBuscarEmp || !this.filtroAreaBuscarEmp.trim()) {
      this.empleadosFiltrados2 = [...this.empleadosTodos];
    } else {
      const filtroLower = this.filtroAreaBuscarEmp.toLowerCase().trim();
      this.empleadosFiltrados2 = this.empleadosTodos.filter(empleado =>
        empleado.area && empleado.area.toLowerCase().includes(filtroLower)
      );
    }

    // Verificar si el empleado buscado sigue disponible
    if (this.empleadoBuscado) {
      const empleadoAunDisponible = this.empleadosFiltrados2.find(emp =>
        emp.id === this.empleadoBuscado.id
      );
      if (!empleadoAunDisponible) {
        this.empleadoBuscado = null;
        this.evaluacionCreada = null;
      }
    }
  }
  
  /**
   * Cargar todos los empleados para selector de jefe evaluador
   * (Usando la misma lógica que cargarEmpleadosParaEvaluacion que ya funciona)
   */
  cargarEmpleadosParaJefeEvaluador(): void {
    console.log('🔵 Cargando empleados para jefe evaluador...');
    
    this.gthEmpleadoService.Mostrar().subscribe({
      next: (response: any) => {
        console.log('✅ Respuesta recibida:', response);
        
        let empleadosBD = response;
        if (response && response.$values) {
          empleadosBD = response.$values;
        }

        if (empleadosBD && Array.isArray(empleadosBD)) {
          // Mapear igual que en cargarEmpleadosParaEvaluacion
          this.todosLosEmpleadosParaJefe = empleadosBD.map((emp: iGTHEmpleado) => ({
            id: emp.idEmpleado,
            nombre: `${emp.nombre || ''} ${emp.apellido || ''}`.trim() || `Empleado ${emp.idEmpleado}`,
            area: emp.area || 'Sin área',
            // estado: emp.estado || 'A' // Agregar estado si lo necesitas
          }));

          console.log('✅ Total empleados para jefe cargados:', this.todosLosEmpleadosParaJefe.length);
          
          if (this.todosLosEmpleadosParaJefe.length > 0) {
            console.log('📋 Primeros 3 empleados:', this.todosLosEmpleadosParaJefe.slice(0, 3));
          }
        } else {
          console.warn('⚠️ No se recibieron empleados');
          this.todosLosEmpleadosParaJefe = [];
        }
      },
      error: (error) => {
        console.error('❌ Error al cargar empleados para jefe:', error);
        this.todosLosEmpleadosParaJefe = [];
      }
    });
  }

  /**
   * Filtrar jefes evaluadores según el texto ingresado (mínimo 3 letras)
   */
  filtrarJefesEvaluacion(): void {
    console.log('🔍 Filtrando jefes. Texto:', this.filtroJefeEvaluacion);
    console.log('📦 Total empleados disponibles:', this.todosLosEmpleadosParaJefe.length);
    
    if (!this.filtroJefeEvaluacion || this.filtroJefeEvaluacion.trim().length < 3) {
      console.log('⚠️ Filtro muy corto (menos de 3 letras)');
      this.jefesFiltradosEvaluacion = [];
      return;
    }

    const filtro = this.filtroJefeEvaluacion.toLowerCase().trim();
    console.log('🔍 Buscando con filtro:', filtro);
    
    this.jefesFiltradosEvaluacion = this.todosLosEmpleadosParaJefe.filter(emp => {
      // Usar 'nombre' y 'area' que son los campos mapeados
      const nombre = (emp.nombre || '').toLowerCase();
      const area = (emp.area || '').toLowerCase();
      
      const coincide = nombre.includes(filtro) || area.includes(filtro);
      
      if (coincide) {
        console.log('✅ Coincidencia:', emp.nombre, '-', emp.area);
      }
      
      return coincide;
    });

    console.log('✅ Total jefes filtrados:', this.jefesFiltradosEvaluacion.length);
    console.log('📋 Jefes encontrados:', this.jefesFiltradosEvaluacion);
  }

  // Método que se ejecuta cuando se selecciona un empleado
  onEmpleadoBuscadoSeleccionado(): void {
    console.log('════════════════════════════════════════');
    console.log('👤 EMPLEADO SELECCIONADO');
    console.log('════════════════════════════════════════');
    
    // Limpiar selección de jefe evaluador
    this.jefeSeleccionadoEvaluacion = null;
    this.filtroJefeEvaluacion = '';
    this.jefesFiltradosEvaluacion = [];

    if (this.empleadoBuscado?.id) {
      console.log('✅ Empleado válido:', this.empleadoBuscado);
      console.log('📋 ID Empleado:', this.empleadoBuscado.id);
      console.log('📋 Nombre:', this.empleadoBuscado.nombre);
      this.evaluacionCreada = null;
      
      console.log('🔍 Verificando empleados para jefe...');
      console.log('📦 Empleados actuales en memoria:', this.todosLosEmpleadosParaJefe.length);
      
      // Cargar empleados si no están cargados
      if (this.todosLosEmpleadosParaJefe.length === 0) {
        console.log('🔵 NO HAY EMPLEADOS - Iniciando carga...');
        this.cargarEmpleadosParaJefeEvaluador();
      } else {
        console.log('✅ Empleados ya cargados:', this.todosLosEmpleadosParaJefe.length);
      }
    } else {
      console.warn('⚠️ Empleado no válido o deseleccionado');
      this.empleadoBuscado = null;
      this.evaluacionCreada = null;
    }
  }

  // Método auxiliar para el trackBy (mejora el rendimiento)
  trackByEmpleadoId(index: number, empleado: any): any {
    return empleado.id;
  }
  // Función para comparar empleados (soluciona problemas de referencia)
  compareEmpleados(emp1: any, emp2: any): boolean {
    return emp1 && emp2 ? emp1.id === emp2.id : emp1 === emp2;
  }


  //----------------------------------     ----------------------------------     ---------------------------------------

  onCompetenciaSeleccionada(): void {
    console.log('onCompetenciaSeleccionada() ejecutado');
    
    if (this.competenciaSeleccionada) {
      const competenciaEncontrada = this.competenciasFiltradas.find(c => 
        c.NombreCompetencia === this.competenciaSeleccionada
      );
      
      if (competenciaEncontrada && competenciaEncontrada.idCompetencia) {
        console.log('ID encontrado:', competenciaEncontrada.idCompetencia);
        
        // Agregar esta línea para debuggear
        // this.debugearAPI(competenciaEncontrada.idCompetencia);
        
        this.cargarNivelesCompetencia(competenciaEncontrada.idCompetencia);
      }
    }
  }

  // Método para cargar niveles específicos de una competencia
  private cargarNivelesCompetencia(idCompetencia: number): void {
    console.log('Cargando niveles para idCompetencia:', idCompetencia);
    
    // USAR TIPO = 3 para filtrar por ID_COMPETENCIA
    this.gthCompetenciaService.mostrarNivelCompetencias(3, undefined, idCompetencia).subscribe({
      next: (response: any) => {
        console.log('Respuesta con niveles filtrados:', response);
        
        if (response?.$values && response.$values.length > 0) {
          console.log(`Encontrados ${response.$values.length} niveles para competencia ${idCompetencia}`);
          this.procesarNiveles(response.$values);
        } else {
          console.warn('No se encontraron niveles para esta competencia');
        }
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  // Método para procesar niveles
  private procesarNiveles(niveles: any[]): void {
    console.log('Procesando niveles recibidos:', niveles);
    
    this.nivelesCompetencia = niveles;
    
    // Procesar y ordenar los niveles
    this.nivelesDisponibles = niveles
      .filter(n => n.nivel) // Solo los que tienen nivel
      .sort((a, b) => a.nivel - b.nivel) // Ordenar por número de nivel
      .map(n => {
        const nivelFormateado = `Nivel ${n.nivel} - ${n.descripcion} - ${n.idNivelCompetencia}`;
        return nivelFormateado;
      });
    
    console.log(`Total niveles disponibles: ${this.nivelesDisponibles.length}`, this.nivelesDisponibles);
  }            

  private cargarCompetencias(): void {
    
    this.gthCompetenciaService.obtenerCompetenciasActivas().subscribe((response: any) => {
      
      if (response?.$values) {
        const data = response.$values;

        this.competencias = data.map((c: any, index: number) => {
          
          const competenciaMapeada = {
            idCompetencia: c.idCompetencia, // Verificar que esto exista
            tipo: c.tipoCompetencia,
            NombreCompetencia: c.nombreCompetencia
          };
          
          return competenciaMapeada;
        });

        // Tipos únicos
        this.tiposCompetencia = [...new Set(this.competencias.map(c => c.tipo))];
      } else {
        console.warn('❌ No se encontró $values en la respuesta de competencias');
      }
    });
  }
  
  onTipoCompetenciaChange(): void {
    console.log('🔄 Tipo de competencia cambiado a:', this.tipoCompetencia);
    
    this.competenciasFiltradas = this.competencias.filter(c => c.tipo === this.tipoCompetencia);
    console.log('Competencias filtradas:', this.competenciasFiltradas);
    
    this.competenciaSeleccionada = null;
    
    // Limpiar niveles cuando cambia el tipo
    this.nivelesDisponibles = [];
    this.nivelSeleccionado = null;
    console.log('Niveles limpiados por cambio de tipo');
  }
  
  // Método para mostrar la sección de competencias  
  async mostrarSeccionCompetencias(): Promise<void> {
    if (!this.empleadoBuscado?.id) {
      alert('Seleccione un empleado');
      return;
    }

    // Validar que se haya seleccionado un jefe evaluador
    if (!this.jefeSeleccionadoEvaluacion?.id) {
      alert('Debe seleccionar un jefe evaluador');
      return;
    }

    this.cargandoEvaluacion = true;

    try {
      // Crear evaluación con el ID del jefe evaluador seleccionado
      const nuevaEvaluacion: Ievaluacion = {
        idEmpleado: this.empleadoBuscado.id,
        idJefe: this.jefeSeleccionadoEvaluacion.id, // ← ID del jefe evaluador
        anio: new Date().getFullYear(),
        estado: 'PENDIENTE',
        usuarioCreacion: 'SISTEMA',
        fase: 0
      };

      console.log('Datos de evaluación a crear:', nuevaEvaluacion);
      console.log('Jefe evaluador asignado:', this.jefeSeleccionadoEvaluacion.nombre);

      const response = await this.gthEvaluacionServcie
        .crearGthEvaluacion(nuevaEvaluacion)
        .toPromise();

      if (response?.codigo > 0) {
        this.evaluacionCreada = {
          idEvaluacion: response.idEvaluacion || response.codigo,
          idEmpleado: this.empleadoBuscado.id,
          idJefe: this.jefeSeleccionadoEvaluacion.id,
          estado: 'PENDIENTE',
          fase: 0,
          anio: new Date().getFullYear()
        };
        console.log('✅ Nueva evaluación creada con jefe evaluador:', this.evaluacionCreada);
        this.mostrarCompetencias = true;

      } else if (response?.codigo === -3) {
        this.evaluacionCreada = {
          idEvaluacion: 999,
          idEmpleado: this.empleadoBuscado.id,
          idJefe: this.jefeSeleccionadoEvaluacion.id,
          estado: 'EN_PROCESO',
          fase: 1,
          anio: new Date().getFullYear()
        };
        alerts.info('Este colaborador ya cuenta con una evaluación para este año');        
      } else {
        alert(`Error: ${response?.mensaje || 'Error desconocido'}`);
        console.error('❌ Error en respuesta:', response);
        return;
      }

      this.evaluacionGuardada = false;
      this.limpiarFormularioCompetencia();
      this.competenciasAgregadas = [];

    } catch (error) {
      alerts.error('Error al comunicarse con el servidor');
      console.error('Error:', error);
    } finally {
      this.cargandoEvaluacion = false;
    }
  }

  // Método para agregar competencia
  agregarCompetencia(): void {
    if (
      this.tipoCompetencia &&
      this.competenciaSeleccionada &&
      this.nivelSeleccionado &&
      this.competenciasAgregadas.length < 4
    ) {
      // Verificar que no se repita la misma competencia
      const competenciaExiste = this.competenciasAgregadas.some(
        comp => comp.competencia === this.competenciaSeleccionada
      );

      if (competenciaExiste) {
        alerts.info('Esta competencia ya ha sido agregada.');
        return;
      }

      const nuevaCompetencia = {
        tipo: this.tipoCompetencia,
        competencia: this.competenciaSeleccionada,
        nivel: this.nivelSeleccionado
      };

      this.competenciasAgregadas.push(nuevaCompetencia);

      // Limpiar el formulario
      this.limpiarFormularioCompetencia();
    }
  }
  get maximoAlcanzado(): boolean {
    return this.competenciasAgregadas.length >= 4;
  }
  // Método para eliminar competencia
  eliminarCompetencia(index: number): void {
    if (index >= 0 && index < this.competenciasAgregadas.length) {
      const competenciaEliminada = this.competenciasAgregadas.splice(index, 1)[0];
    }
  }

  private limpiarFormularioCompetencia(): void {
    this.tipoCompetencia = '';
    this.competenciaSeleccionada = '';
    this.nivelSeleccionado = '';
    this.nivelesDisponibles = []; // Agregar esta línea
  }


  /**
   * Intenta extraer un idNum (number) del valor del nivel.
   * Acepta:
   *  - número (return number)
   *  - objeto con idNivelCompetencia (return number)
   *  - string como "Nivel 1 - Descripción - 42" -> devuelve 42
   *  - string como "Nivel 1 - Descripción (42)" -> devuelve 42
   *  - si no puede extraer, devuelve null
   */
  private parseIdFromNivelValue(nivelVal: any): number | null {
    if (nivelVal === null || nivelVal === undefined) return null;

    // Si ya es número válido
    if (typeof nivelVal === 'number' && !isNaN(nivelVal)) {
      return nivelVal;
    }

    // Si es objeto y tiene la propiedad idNivelCompetencia (o IdNivelCompetencia)
    if (typeof nivelVal === 'object') {
      const maybeId = nivelVal.idNivelCompetencia ?? nivelVal.IdNivelCompetencia ?? nivelVal.id ?? nivelVal.Id;
      if (maybeId !== undefined && maybeId !== null) {
        const n = Number(maybeId);
        return !isNaN(n) ? n : null;
      }
    }

    // Convertir a string y limpiar
    const s = String(nivelVal).trim();
    if (!s) return null;

    // 1) Preferir captura de dígitos al final del string (ej: "... - 42" o "... (42)")
    let m = s.match(/(\d+)\s*$/);
    if (m && m[1]) {
      const num = Number(m[1]);
      if (!isNaN(num)) return num;
    }

    // 2) Si no, intentar tomar la última parte separada por '-' y extraer dígitos
    const parts = s.split('-').map(p => p.trim()).filter(Boolean);
    if (parts.length) {
      const last = parts[parts.length - 1];
      const mm = last.match(/(\d+)/);
      if (mm && mm[1]) {
        const num = Number(mm[1]);
        if (!isNaN(num)) return num;
      }
    }

    // 3) fallback: buscar cualquier número en el string (first occurrence)
    m = s.match(/(\d+)/);
    if (m && m[1]) {
      const num = Number(m[1]);
      if (!isNaN(num)) return num;
    }

    // No se pudo extraer
    return null;
  }
  async terminarEvaluacion(): Promise<void> {
    if (this.competenciasAgregadas.length === 4 && this.empleadoBuscado && this.evaluacionCreada) {
      try {        
        for (const comp of this.competenciasAgregadas) {
          // Intentar obtener idNivel de varias fuentes:
          // 1) si ya existe comp.idNivelCompetencia, usarlo
          // 2) si no, intentar parsearlo desde comp.nivel (string)
          const idDesdeObjeto = comp.idNivelCompetencia ?? comp.IdNivelCompetencia ?? null;
          let idNivel = (typeof idDesdeObjeto === 'number' && !isNaN(idDesdeObjeto)) ? idDesdeObjeto : null;

          if (!idNivel) {
            idNivel = this.parseIdFromNivelValue(comp.nivel ?? comp);
          }

          if (!idNivel) {
            // Abortamos para no enviar datos inválidos (evita FK violation).
            console.error('❌ No se pudo determinar IdNivelCompetencia para:', comp);
            alerts.error('No se pudo determinar el Id del nivel para una de las competencias.');

            return; // o throw new Error(...) si prefieres lanzar
          }

          const asignacionCompetencia: IGTHAsignacionCompetenciaViewModel = {
            Tipo: 1, // Insertar
            IdEvaluacion: this.evaluacionCreada.idEvaluacion,
            IdNivelCompetencia: idNivel,
            Estado: 'PENDIENTE'
          };

          // Enviar al backend
          await this.gthCompetenciaService
            .gestionarAsignacionCompetencia(asignacionCompetencia)
            .toPromise();
        }

        this.evaluacionGuardada = true;
        setTimeout(() => this.resetearFormulario(), 3000);
        alerts.exito('Evaluación terminada y guardada exitosamente');

      } catch (error) {
        alerts.error('Error al guardar las competencias');
      }
    } else {
      console.warn('⚠️ No se cumplen las condiciones para terminar la evaluación');
    }
  }


  // Método para resetear todo el formulario
  private resetearFormulario(): void {
    this.filtroArea = '';
    this.filtroEmpleado = '';
    this.empleadoBuscado = null;
    this.mostrarCompetencias = false;
    this.evaluacionGuardada = false;
    this.competenciasAgregadas = [];
    this.limpiarFormularioCompetencia();
    this.empleadosFiltrados2 = this.empleados;
  }



}
