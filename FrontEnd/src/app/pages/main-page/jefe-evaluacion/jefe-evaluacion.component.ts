import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { GthEmpleadoService } from 'src/app/services/gthempleado.service';
import { iGTHEmpleado } from '../../../interface/igth-empleado';
import { Ievaluacion } from '../../../interface/ievaluacion';
import { GthEvaluacionService } from '../../../services/gth-evaluacion.service';
import { GthObjetivoService } from '../../../services/gth-objetivo.service';
import { IgthObjetivo } from '../../../interface/igth-objetivo';
import { GthCompetenciaService } from '../../../services/gth-competencia.service';
import { IGTHCompetenciaViewModel,
  IGTHAsignacionCompetenciaViewModel
 } from '../../../interface/ight-competencia';

import { alerts } from '../../../helpers/alerts';

import { AngularEditorModule } from '@kolkov/angular-editor';
import { AngularEditorConfig } from '@kolkov/angular-editor';

// Interface utilizada para almacenar todos los datos necesarios para las competencias
interface NivelConCompetencia {
  idAsignacionCompetencia: number; // ✅ AGREGAR ESTO
  idCompetencia: number;
  nivel: number;
  descripcion: string;
  nombreCompetencia: string;
  tipoCompetencia: string;
  ValoracionEmpleado?: number;
  ValoracionJefe?: number;
  CalificacionEmpleado?: number;
  CalificacionFinal?: number;
  FechaLimite?: string;
  fechaRegObj?: string;
  fechaRegJefe?: string;
  fechaAutoevaluacion?: string;
  fechaEvaluacionJefe?: string;    
}

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

@Component({
  selector: 'app-jefe-evaluacion',
  templateUrl: './jefe-evaluacion.component.html',
  styleUrls: ['./jefe-evaluacion.component.css'],
})
export class JefeEvaluacionComponent implements OnInit {


  constructor(
    private gthEmpleadoService: GthEmpleadoService,
    private gthEvaluacionServcie: GthEvaluacionService,
    private gthObjetivoService: GthObjetivoService,
    private gthCompetenciaService: GthCompetenciaService
  ) {}

  ngOnInit(): void {
    this.cargarDatosEmpleado();

    // Inicializar los 5 objetivos Empleado
    this.objetivosIndividuales = [
      { titulo: '', valoracionEmpleado: null, fechaLimite: '' },
      { titulo: '', valoracionEmpleado: null, fechaLimite: '' },
      { titulo: '', valoracionEmpleado: null, fechaLimite: '' },
      { titulo: '', valoracionEmpleado: null, fechaLimite: '' },
      { titulo: '', valoracionEmpleado: null, fechaLimite: '' }
    ];    

    // Obtener fase actual de la evaluación
    this.obtenerFaseActual();

    // this.cargarEvaluaciones();

    // this.cargarListaEvaluaciones(idEmpleado);
    this.cargarListaEvaluaciones(3); //probando


    // Inicializar los 5 objetivos Colaboradores
    this.objetivosIndividualesColab = [
      { titulo: '', valoracionJefe: 10, fechaLimite: '' },
      { titulo: '', valoracionJefe: 10, fechaLimite: '' },
      { titulo: '', valoracionJefe: 10, fechaLimite: '' },
      { titulo: '', valoracionJefe: 10, fechaLimite: '' },
      { titulo: '', valoracionJefe: 10, fechaLimite: '' }
    ];

  }


  // Pestaña principal activa
  activeSection: string = 'objetivo';

  // Sub-secciones para "Hoja de Ruta"
  activeTimelineStep: string = 'Captura-Resultados';  

  // Sub-secciones para "Evaluación de Colaboradores"
  // activeTimelineStepColab: string = '';


    // Variable para almacenar la información del empleado
    empleado: iGTHEmpleado | null = null;
  
    archivoSeleccionado: File | null = null;
    idEmpleadoActual: number | null = null;
    subiendoFoto: boolean = false;

    // Agregar esta variable a tu componente
    idCelulaActual: number | null = null;   




    // Fase actual de evaluacion
    faseEvaluacion: number | null = null; 
    fechaRegObj: string = '';
    retroalimentacion: string = '';
    planAccion: string = '';  

    timelineSteps = [
  { 
    number: 1, 
    label: 'Captura de Resultados', 
    completed: false, 
    icon: 'fas fa-check',
    pngIcon: 'assets/img/iconos/iconos mycollection/png/062-reloj-de-arena.png',
    sectionId: 'Captura-Resultados',
    isActive: false,
    phase: 0  
  },
  { 
    number: 2, 
    label: 'Revisión Inicial', 
    completed: false,
    icon: 'fas fa-check', 
    pngIcon: 'assets/img/iconos/iconos mycollection/png/035-retroalimentacion-7.png',
    sectionId: 'Revision-Inicial',
    isActive: false,
    phase: 6 
  },
  { 
    number: 3, 
    label: 'Evaluación Intermedia', 
    completed: false,
    icon: 'fas fa-check', 
    pngIcon: 'assets/img/iconos/iconos mycollection/png/051-lista-de-verificacion.png',
    sectionId: 'Evaluacion-Intermedia',
    isActive: false,
    phase: 2  
  },
  { 
    number: 4, 
    label: 'Retroalimentación', 
    completed: false,
    icon: 'fas fa-check', 
    pngIcon: 'assets/img/iconos/iconos mycollection/png/028-grafico.png',
    sectionId: 'Retroalimentacion',
    isActive: false,
    phase: 5  
  },
  { 
    number: 5, 
    label: 'Cierre', 
    completed: false,
    icon: 'fas fa-check', 
    pngIcon: 'assets/img/iconos/iconos mycollection/png/056-alcanzando-objetivos.png',
    sectionId: 'Cierre',
    isActive: false,
    phase: 7
  }
];
  



    /* -------------  Campos para mostrar en el HTML  ----------  */
  
    fotoPerfilUrl: string = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'; // Imagen por defecto
    fotoPerfilUrlDisplay: string = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  
    nombreCompletoDisplay: string = ''; 
    correoElectronicoDisplay: string = ''; 
    posicionDisplay: string = ''; 


    // En tu componente, agregar estas propiedades
    objetivos: IgthObjetivo[] = [];
    // Variable para el textarea del objetivo
    objetivoTexto: string = '';    
     // Variable para almacenar si existe un objetivo de Area
    objetivoExistente: boolean = false;

    idEvaluacionActual: number | null = null;

    // Objetivo de area para todos los formularios de Empleado
    objetivoAreaDisplay: string = '';

    // Objetivos individuales
    objetivosIndividuales: IgthObjetivo[] = [];

    // declara la propiedad global del componente
    nivelesCompetencias: NivelConCompetencia[] = [];


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

    /* -------------------------------------------------------------
          Variables para la seccion de evaluacion de colboradores
    ----------------------------------------------------------------*/
    // Fase actual (esto vendrá del backend)
    // currentPhaseColab: number = 3; 

    empleadosFiltrados: Empleado[] = [];
    empleadoModal: iGTHEmpleado | null = null;
    // idJefeActual: number | null = null;
    selectedEmpleadoId: number | null = null;
    empleados: any[] = [];
    showModal: boolean = false;

    nombreCompletoDisplayModal: string = ''; 
    correoElectronicoDisplayModal: string = ''; 
    posicionDisplayModal: string = ''; 
    // faseColabNuevo:number = 2;

    faseColabNuevo:number | null = null;

    // Objetivos individuales
    objetivosIndividualesColab: IgthObjetivo[] = [];

    // declara la propiedad global del componente
    nivelesCompetenciasColab: NivelConCompetencia[] = [];

    // Fase actual de evaluacion para cargar
    faseEvaluacionColab: number | null = null;     

    // Sub-secciones para "Evaluación de Colaboradores"
    activeTimelineStepColab: string = '';

    // En la clase del componente, agrega estas propiedades
    retroalimentacionColab: string = '';
    planAccionColab: string = '';
    fechaRegJefeColab: string = '';
  
  
//------------------------------    --------------------------------    ---------------------------   ----------------------------


  // 2. Método principal optimizado
  cargarListaEvaluaciones(idJefe: number): void {
    if (!idJefe || idJefe === 0) {
      this.cargarDatosPorDefecto();
      return;
    }

    this.gthEvaluacionServcie.MostrarEvaluaciones().subscribe({
      next: (response: any) => {
        let evaluacionesData = response;
        if (response && response.$values) {
          evaluacionesData = response.$values;
        }

        if (evaluacionesData && Array.isArray(evaluacionesData)) {
          // Filtrar evaluaciones por jefe asignado
          const evaluacionesFiltradas = evaluacionesData.filter(
            (evaluacion: Ievaluacion) => 
              evaluacion.idJefe !== null && 
              evaluacion.idJefe !== undefined && 
              evaluacion.idJefe === idJefe
          );

          if (evaluacionesFiltradas.length > 0) {
            this.procesarEvaluaciones(evaluacionesFiltradas);
          } else {
            this.cargarDatosPorDefecto();
          }
        } else {
          this.cargarEmpleadosConParametros();
        }
      },
      error: (error) => {
        console.error('Error al cargar evaluaciones:', error);
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
   * Cargar datos por defecto en caso de error
   */
  private cargarDatosPorDefecto(): void {
    this.empleados = [
      {
      }
    ];
    this.empleadosFiltrados = [...this.empleados];
  }




  //=======================    Pasos para cambiar entre Secciones de la Evaluacion de Colaborador   ============================

  // Timeline Steps - Solo para jefe
  // Inicializar con active: false
  timelineStepsColab = [
    {
      number: 1,
      label: 'Revisión Inicial',
      completed: false,
      icon: 'fas fa-check',
      pngIcon: 'assets/img/iconos/iconos mycollection/png/035-retroalimentacion-7.png',
      sectionId: 'Revision-Inicial-colab',
      fase: 1
    },
    {
      number: 2,
      label: 'Retroalimentación',
      completed: false,
      icon: 'fas fa-check',
      pngIcon: 'assets/img/iconos/iconos mycollection/png/028-grafico.png',
      sectionId: 'Retroalimentacion-colab',
      fase: 3
    },
    {
      number: 3,  // ← Cambié a 3 para que sea consecutivo
      label: 'Cierre',
      completed: false,
      icon: 'fas fa-check',  // ← AGREGAR esto para que muestre el visto
      pngIcon: 'assets/img/iconos/iconos mycollection/png/056-alcanzando-objetivos.png',
      sectionId: 'Cierre',
      fase: 5  // ← AGREGAR la fase correspondiente
    }
  ];
  
  // ================ MÉTODO PARA CAMBIAR SUB-SECCIÓN EN EVALUACIÓN COLABORADORES ================
  onStepKeyDownColab(event: KeyboardEvent, step: any): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onStepClickColab(step);
    }
  }
  onStepClickColab(step: any): void {
    if (this.activeSection === 'EvaluacionColab') {
      this.activeTimelineStepColab = step.sectionId;
      console.log('Timeline step seleccionado (Evaluación Colab):', this.activeTimelineStepColab);
    }
  }
  // ================ VERIFICAR SI SUB-SECCIÓN DE EVALUACIÓN COLABORADORES ESTÁ ACTIVA ================
  isTimelineStepActiveColab(sectionId: string): boolean {
    return this.activeSection === 'EvaluacionColab' && this.activeTimelineStepColab === sectionId;
  }
  
  establecerSubseccionColabSegunFase(): void {
    console.log('🔍 Estableciendo subsección según fase...');
    console.log('📊 Fase actual:', this.faseEvaluacionColab);
    
    if (!this.faseEvaluacionColab) {
      console.warn('⚠️ No hay fase definida');
      return;
    }
    
    const fase = this.faseEvaluacionColab;
    
    // Mapear fase a step
    let stepActual;
    
    if (fase === 1 || fase === 2) {
      // Fase 1-2 → Revisión Inicial
      stepActual = this.timelineStepsColab[0];
      console.log('✅ Mostrando: Revisión Inicial (Fase 1-2)');
    } else if (fase === 3 || fase === 4) {
      // Fase 3-4 → Retroalimentación
      stepActual = this.timelineStepsColab[1];
      console.log('✅ Mostrando: Retroalimentación (Fase 3-4)');
    } else if (fase === 5) {
      // Fase 5 → Cierre
      stepActual = this.timelineStepsColab[2];
      console.log('✅ Mostrando: Cierre (Fase 5)');
    } else {
      // Fallback: Revisión Inicial
      stepActual = this.timelineStepsColab[0];
      console.warn('⚠️ Fase no reconocida, mostrando Revisión Inicial');
    }
    
    this.activeTimelineStepColab = stepActual.sectionId;
    console.log('📍 Timeline step activo:', this.activeTimelineStepColab);
    
    // Actualizar estados completados
    this.timelineStepsColab[0].completed = fase > 2;   // Step 1 completado si fase > 2
    this.timelineStepsColab[1].completed = fase > 4;   // Step 2 completado si fase > 4
    this.timelineStepsColab[2].completed = fase === 5; // Step 3 completado si fase === 5
    
    console.log('✅ Estados actualizados:', {
      step1: this.timelineStepsColab[0].completed,
      step2: this.timelineStepsColab[1].completed,
      step3: this.timelineStepsColab[2].completed
    });
  }
//---------------------------------------------------------------------------------------------------------------------

//=======================    Pasos para cambiar entre Secciones de la Evaluacion   ============================

  // Timeline Steps
  // timelineSteps = [
  //   { 
  //     number: 1, 
  //     label: 'Captura de Resultados', 
  //     completed: true, 
  //     icon: 'fas fa-check',
  //     pngIcon: 'assets/img/iconos/iconos mycollection/png/062-reloj-de-arena.png',
  //     sectionId: 'Captura-Resultados'
  //   },
  //   { 
  //     number: 2, 
  //     label: 'Revisión Inicial', 
  //     completed: false,
  //     pngIcon: 'assets/img/iconos/iconos mycollection/png/035-retroalimentacion-7.png',
  //     sectionId: 'Revision-Inicial'
  //   },
  //   { 
  //     number: 3, 
  //     label: 'Evaluación Intermedia', 
  //     completed: false,
  //     pngIcon: 'assets/img/iconos/iconos mycollection/png/051-lista-de-verificacion.png',
  //     sectionId: 'Evaluacion-Intermedia'
  //   },
  //   { 
  //     number: 4, 
  //     label: 'Retroalimentación', 
  //     completed: false,
  //     pngIcon: 'assets/img/iconos/iconos mycollection/png/028-grafico.png',
  //     sectionId: 'Retroalimentacion'
  //   },
  //   { 
  //     number: 5, 
  //     label: 'Cierre', 
  //     completed: false,
  //     pngIcon: 'assets/img/iconos/iconos mycollection/png/056-alcanzando-objetivos.png',
  //     sectionId: 'Cierre'
  //   }
  // ];

  // Método para cambiar la sección activa
  onStepKeyDown(event: KeyboardEvent, step: any): void {
    // Activar con Enter o Espacio
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); // Prevenir scroll con espacio
      this.onStepClick(step);
    }
  }  

  // ================ MÉTODO PARA CAMBIAR SUB-SECCIÓN EN HOJA DE RUTA ================
  onStepClick(step: any): void {
    if (this.activeSection === 'hoja-ruta') {
      this.activeTimelineStep = step.sectionId;
      console.log('Timeline step seleccionado (Hoja Ruta):', this.activeTimelineStep);
    }
  }
  // ================ VERIFICAR SI SUB-SECCIÓN DE HOJA DE RUTA ESTÁ ACTIVA ================
  isTimelineStepActive(sectionId: string): boolean {
    return this.activeSection === 'hoja-ruta' && this.activeTimelineStep === sectionId;
  }


  // ================ VERIFICAR SI ESTAMOS EN HOJA DE RUTA ================
  isInHojaRuta(): boolean {
    return this.activeSection === 'hoja-ruta';
  }
  // ================ VERIFICAR SI ESTAMOS EN EVALUACIÓN COLABORADORES ================
  isInEvaluacionColab(): boolean {
    return this.activeSection === 'EvaluacionColab';
  }
//---------------------------------------------------------------------------------------------------------------------


  // Objectives (KPIs) - Objetivos precargados del empleado
  // objectives = [
  //   {
  //     name: 'Entrega de Proyectos',
  //     weight: '40%',
  //     startDate: '01/01/2025',
  //     endDate: '30/06/2025',
  //     description: 'Completar entregables en tiempo y forma.',
  //   },
  //   {
  //     name: 'Reducción de Errores',
  //     weight: '30%',
  //     startDate: '01/01/2025',
  //     endDate: '30/06/2025',
  //     description: 'Reducir errores de software en un 20%.',
  //   },
  // ];

  // Competencias dinámicas - Se cargarán desde el backend
  competencies: IGTHCompetenciaViewModel[] = [];
  loadingCompetencies: boolean = false;


  // Competencias del empleado - se mantienen en memoria durante la sesión (similar a objetivos)
  competencias = [
    {
      id: 1,
      name: '',
      valor: null as number | null,
      fecha: '',
      reconsiderar: null as number | null,
      calificacionFinal: null as number | null,
      isEditing: false
    },
    {
      id: 2,
      name: '',
      valor: null as number | null,
      fecha: '',
      reconsiderar: null as number | null,
      calificacionFinal: null as number | null,
      isEditing: false
    },
    {
      id: 3,
      name: '',
      valor: null as number | null,
      fecha: '',
      reconsiderar: null as number | null,
      calificacionFinal: null as number | null,
      isEditing: false
    },
    {
      id: 4,
      name: '',
      valor: null as number | null,
      fecha: '',
      reconsiderar: null as number | null,
      calificacionFinal: null as number | null,
      isEditing: false
    },
    {
      id: 5,
      name: '',
      valor: null as number | null,
      fecha: '',
      reconsiderar: null as number | null,
      calificacionFinal: null as number | null,
      isEditing: false
    }
  ];





  /*=======================================================================================
                            fUNCIONES PARA CARGAR INFO DE JEFE
=========================================================================================*/

  cargarDatosEmpleado(): void {

  // console.log('Iniciando proceso de carga de informacion');
    // Obtener ID del empleado del sessionStorage
    const idEmpleado = this.gthEmpleadoService.obtenerIdGthEmpleadoDesdeSession();
    
    if (idEmpleado) {
      this.idEmpleadoActual = idEmpleado;
      this.buscarEmpleadoPorId(3); //Probando
    } else {
      console.warn('No se encontró ID de empleado en sessionStorage, usando cédula de prueba');      
    }
  }

/**
   * Busca un empleado específico por ID
   * @param idEmpleado - ID del empleado a buscar
   */
  buscarEmpleadoPorId(idEmpleado: number): void {

    this.gthEmpleadoService.MostrarConParametros(1, idEmpleado).subscribe({
      next: (empleado: any) => {
        // console.log('Respuesta del backend ->', empleado);

        const datosEmpleado = empleado?.$values?.[0];

        if (datosEmpleado) {
          this.empleado = datosEmpleado;
          this.mapearDatosParaMostrar();
        } else {
          console.warn('No se encontró empleado con el ID:', idEmpleado);
        }
      },
      error: (error) => {
        console.error('Error al buscar empleado por ID:', error);
      }
    });
  }

/**
   * Busca un empleado específico por cédula
   * @param cedula - Cédula del empleado a buscar
   */
  buscarEmpleadoPorCedula(cedula: string): void {
    this.gthEmpleadoService.BuscarPorCedula(cedula).subscribe({
      next: (empleado: any) => {
        // console.log('Respuesta del backend ->', empleado);

        const datosEmpleado = empleado?.$values?.[0];

        if (datosEmpleado) {
          this.empleado = datosEmpleado;
          this.mapearDatosParaMostrar();
        } else {
          console.warn('No se encontró empleado con la cédula:', cedula);
        }
      },
      error: (error) => {
        console.error('Error al buscar empleado por cédula:', error);
      }
    });
  }

  private async mapearDatosParaMostrar(): Promise<void>  {
    if (this.empleado) {
      // Guardar ID del empleado para usar en subida de fotos
      this.idEmpleadoActual = this.empleado.idEmpleado;

      // Guardar el ID de la célula para buscar el objetivo de Area
      this.idCelulaActual = this.empleado.idCelula || null;

      this.nombreCompletoDisplay = `${this.empleado.nombre} ${this.empleado.apellido}`;
      this.correoElectronicoDisplay = this.empleado.correo || this.empleado.correoCorporativo;
      this.posicionDisplay = this.empleado.cargoActual;
      // this.areaDisplay = this.empleado.area;

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
  


/*-------------  Buscamos si tenemos un Objetivo de Area  ----------------------------*/
cargarObjetivoExistente(): void {
  if (!this.idCelulaActual) return;

  this.gthObjetivoService.obtenerObjetivosPorIdCelula(1, this.idCelulaActual)
    .subscribe({
      next: (response: any) => {
        // Obtener datos de la célula
        const datos = response?.$values?.[0] || response?.[0] || response;
        
        if (datos) {
          // Buscar el objetivo en diferentes campos posibles
          const objetivo = datos.celObjetivo || 
                          datos.cel_objetivo || 
                          datos.objetivo ||
                          datos.CEL_OBJETIVO || '';

          // Asignar valores
          this.objetivoTexto = objetivo;
          this.objetivoAreaDisplay = objetivo;
          this.objetivoExistente = objetivo.trim() !== '';          
          
        } else {
          // No se encontraron datos
          this.objetivoTexto = '';
          this.objetivoExistente = false;
        }
      },
      error: () => {
        // Error al cargar
        this.objetivoTexto = '';
        this.objetivoExistente = false;
      }
    });
}



/*=======================================================================================
                  fUNCIONES PARA CARGAR INFO DE EVALUACION PERSONAL
=========================================================================================*/

/**
 * Inicializa objetivos vacíos
 */
inicializarObjetivosVacios(): void {
  this.objetivosIndividuales = [
    { titulo: '', valoracionEmpleado: null, fechaLimite: '' },
    { titulo: '', valoracionEmpleado: null, fechaLimite: '' },
    { titulo: '', valoracionEmpleado: null, fechaLimite: '' },
    { titulo: '', valoracionEmpleado: null, fechaLimite: '' },
    { titulo: '', valoracionEmpleado: null, fechaLimite: '' }
  ];
}

avanzarCierreEvaluacion(){
    // console.log('⚠️ FASE 4 EN PROCESO, SOLO LECTURA');
  this.actualizarTimelinePorFase(7);
  this.faseEvaluacion = 7;
  this. cargarEvaluaciones();
}

/*============================================================
  Funcion para actualizar el timeline segun la fase
=============================================================*/
actualizarTimelinePorFase(fase: number): void {
  // Reiniciar todos los pasos
  this.timelineSteps.forEach(step => {
    step.completed = false;
    step.isActive = false;
  });
  
  // Mapeo de fases a qué pasos deben estar completados
  let maxPaso = 0;
  switch (fase) {
    case 0:
      maxPaso = 1; // solo Captura de Resultados
      break;
    case 6:
      maxPaso = 2; // Captura + Revisión Inicial
      break;
    case 2:
      maxPaso = 3; // hasta Evaluación Intermedia
      break;
    case 5:
      maxPaso = 4; // hasta Retroalimentación
      break;
    case 7:
      maxPaso = 5; // todos
      break;
    default:
      maxPaso = 0;
      break;
  }
  
  // ✅ CORRECCIÓN: Marca todos incluyendo el activo como completados
  this.timelineSteps.forEach(step => {
    // Completados: todos hasta el paso activo (inclusive)
    if (step.number <= maxPaso) {
      step.completed = true;
    }
    // Activo: solo el paso actual
    if (step.number === maxPaso) {
      step.isActive = true;
    }
  });
}

obtenerFaseActual(): void {
  // console.log('=== OBTENIENDO FASE ACTUAL ===');
  const idEmpleado = this.gthEmpleadoService.obtenerIdGthEmpleadoDesdeSession();
  
  if (!idEmpleado) {
    console.error('No se pudo obtener ID del empleado');
    // this.currentPhase = 1;
    return;
  }

  this.idEmpleadoActual = 2; // pruebas
  const anio = 2025;

  this.gthEvaluacionServcie
    .MostrarEvaluacionesPorEmpleadoyAnio(this.idEmpleadoActual, anio)
    .subscribe({
      next: (response: any) => {
        const evaluacionesData = response?.$values || response;
        
        if (evaluacionesData && evaluacionesData.length > 0) {
          const evaluacion = evaluacionesData[0];
          this.faseEvaluacion = evaluacion.fase || 0;
          
          // Actualizar el timeline con la fase real
          this.actualizarTimelinePorFase(this.faseEvaluacion!);
          // console.log('fase de evaluación: ', this.faseEvaluacion!);
        } else {
          this.faseEvaluacion = 7;
        }
      },
      error: (error) => {
        // console.error('❌ Error al obtener fase de evaluación:');
        this.faseEvaluacion = 0;
      }
    });
}


  /**
   * Actualiza el texto de un objetivo específico
   * @param index - Índice del objetivo (0-4)
   * @param valor - Nuevo texto del objetivo (puede ser Event o string)
   */
  actualizarTextoObjetivo(index: number, valor: any): void {
    let nuevoTexto: string;
    
    if (valor && typeof valor === 'object' && valor.target) {
      // Es un evento
      nuevoTexto = (valor.target as HTMLInputElement).value;
    } else {
      // Es un valor directo (ngModelChange)
      nuevoTexto = valor;
    }
    
    if (index >= 0 && index < this.objetivos.length) {
      this.objetivos[index].titulo = nuevoTexto;
      console.log(`📝 Objetivo ${index + 1} actualizado:`, this.objetivos[index]);
    }
  }


  /**
   * Actualiza el valor numérico de un objetivo específico
   * @param index - Índice del objetivo (0-4)
   * @param valor - Nuevo valor numérico (puede ser Event o number)
   */
  actualizarValorObjetivo(index: number, valor: any): void {
    let nuevoValor: number;
    
    if (valor && typeof valor === 'object' && valor.target) {
      // Es un evento
      nuevoValor = parseInt((valor.target as HTMLInputElement).value, 10);
    } else {
      // Es un valor directo (ngModelChange)
      nuevoValor = parseInt(valor, 10);
    }
    
    if (index >= 0 && index < this.objetivos.length) {
      // Validar que el valor esté entre 0 y 100
      if (!isNaN(nuevoValor) && nuevoValor >= 0 && nuevoValor <= 100) {
        this.objetivos[index].valoracionEmpleado = nuevoValor;
        console.log(`📊 Valor del objetivo ${index + 1} actualizado:`, this.objetivos[index]);
      }
    }
  }

  /**
   * Actualiza la fecha de un objetivo específico
   * @param index - Índice del objetivo (0-4)
   * @param valor - Nueva fecha (puede ser Event o string)
   */
  actualizarFechaObjetivo(index: number, valor: any): void {
    let nuevaFecha: string;
    
    if (valor && typeof valor === 'object' && valor.target) {
      // Es un evento
      nuevaFecha = (valor.target as HTMLInputElement).value;
    } else {
      // Es un valor directo (ngModelChange)
      nuevaFecha = valor;
    }
    
    if (index >= 0 && index < this.objetivos.length) {
      this.objetivos[index].fechaLimite = nuevaFecha;
      console.log(`📅 Fecha del objetivo ${index + 1} actualizada:`, this.objetivos[index]);
    }
  }







  /*=======================================================================================
                    fUNCIONES PARA CARGAR INFO DE EVALUACION DE COLABORADORES
  =========================================================================================*/

    cargarEvaluaciones(): void {
      const idEmpleado = this.gthEmpleadoService.obtenerIdGthEmpleadoDesdeSession();

      if (idEmpleado) {
        this.idEmpleadoActual = 2; // pruebas
        const anio = 2026;

        this.gthEvaluacionServcie
          .MostrarEvaluacionesPorEmpleadoyAnio(this.idEmpleadoActual, anio)
          .subscribe({
            next: (response: any) => {
              let evaluacionesData = response;
              if (response && response.$values)
                evaluacionesData = response.$values;

              if (evaluacionesData && evaluacionesData.length > 0) {
                const idEvaluacion = evaluacionesData[0].idEvaluacion;

                // inicializamos la colección
                this.nivelesCompetencias = [];

                this.gthCompetenciaService
                  .obtenerAsignacionCompetenciaPorIdEvaluacion(idEvaluacion)
                  .subscribe({
                    next: (respAsigCompetencias: any) => {
                      let asignacionesCompetenciasData = respAsigCompetencias;
                      if (respAsigCompetencias && respAsigCompetencias.$values) {
                        asignacionesCompetenciasData =
                          respAsigCompetencias.$values;
                      }

                      asignacionesCompetenciasData.forEach((comp: any) => {
                        const idNivelCompetencia = comp.idNivelCompetencia;

                        this.gthCompetenciaService
                          .mostrarNivelCompetencias(1, idNivelCompetencia)
                          .subscribe({
                            next: (respNivelCompetencias: any) => {
                              let nivelesCompetenciasData = respNivelCompetencias;
                              if (
                                respNivelCompetencias &&
                                respNivelCompetencias.$values
                              ) {
                                nivelesCompetenciasData =
                                  respNivelCompetencias.$values;
                              }

                              nivelesCompetenciasData.forEach((nivel: any) => {
                                this.gthCompetenciaService
                                  .mostrarCompetencias(1, nivel.idCompetencia)
                                  .subscribe({
                                    next: (respCompetencia: any) => {
                                      let competenciaData = respCompetencia;
                                      if (
                                        respCompetencia &&
                                        respCompetencia.$values
                                      ) {
                                        competenciaData = respCompetencia.$values;
                                      }

                                      if (competenciaData.length > 0) {
                                        const competencia = competenciaData[0];

                                        const combinado: NivelConCompetencia = {
                                          idAsignacionCompetencia: competencia.idAsignacionCompetencia,
                                          idCompetencia: nivel.idCompetencia,
                                          nivel: nivel.nivel,
                                          descripcion: nivel.descripcion,
                                          nombreCompetencia:
                                            competencia.nombreCompetencia,
                                          tipoCompetencia:
                                            competencia.tipoCompetencia,
                                          ValoracionEmpleado: 0,
                                          FechaLimite: '',
                                          ValoracionJefe: 0,
                                          CalificacionEmpleado: 0,
                                          CalificacionFinal: 0,
                                        };

                                        this.nivelesCompetencias.push(combinado);

                                      }
                                    },
                                    error: (error) =>
                                      console.error('Error al consultar competencia:', error),
                                  });
                              });
                            },
                            error: (error) =>
                              console.error('Error al consultar niveles de competencias:', error),
                          });
                      });
                    },
                    error: (error) =>
                      console.error('Error al consultar competencias asignadas:', error),
                  });
              } else {
                console.warn('⚠️ No se encontró ninguna evaluación para este empleado y año.');
              }
            },
            error: (error) =>
              console.error('Error al consultar evaluaciones:', error),
          });
      } else {
        console.warn('No se encontró ID de empleado en sessionStorage');
      }
    }


  /*--------------------------------------------------------------------------
              Funciones específicas que llaman a la función genérica
  ---------------------------------------------------------------------------*/
  guardarObjetivoArea(): void {

    // Validar que tengamos el ID de la célula
    if (!this.idCelulaActual) {
      console.error('No se ha obtenido el ID de la célula. Por favor,');
      return;
    }

    // Actualizar el objetivo en la célula
    this.gthObjetivoService.actualizarObjetivoCelula(this.idCelulaActual, this.objetivoTexto.trim())
      .subscribe({
        next: (response: any) => {
          
          if (response && response.length > 0) {
            const resultado = response[0]; 
            
            if (resultado.valor1 && resultado.valor1 > 0) {
              // console.log('✅ Objetivo de área actualizado exitosamente');
              alerts.exito('Objetivo de área guardado exitosamente.');
              
              // Limpiar el textarea después de guardar
              // this.objetivoTexto = '';
            } else {
              console.error('❌ ERROR del Stored Procedure:', resultado.valor2);
              alerts.error(`Error al guardar objetivo, revise su Store Procedure`);
            }
          } else {
            alerts.exito('Objetivo de área guardado correctamente.');
          }
        },
        error: (error) => {
          console.error('ERROR revise la consola para más detalles. en el servicio:', error);
        }
      });
  }


  obtenerFechaActual(): string {
    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = String(hoy.getMonth() + 1).padStart(2, '0');
    const day = String(hoy.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }



  
  /*=======================================================================================
                    fUNCIONES PARA CARGAR INFO DE EVALUACION SUB-EMPLEADO
  =========================================================================================*/

  //=======================    Funciones para ver la lista de evaluaciones   ============================

  navigateToEvaluacion(empleadoId: number): void {
    console.log('🔍 Abriendo evaluación para empleado:', empleadoId);
    
    this.selectedEmpleadoId = empleadoId;
    
    // Buscar el empleado en el array filtrado
    const empleadoSeleccionado = this.empleadosFiltrados.find(emp => emp.id === empleadoId);
    
    if (empleadoSeleccionado) {
      // Cargar datos completos del empleado desde el servicio
      this.cargarDatosEmpleadoModal(empleadoId);
      
      // ✅ Cargar las evaluaciones del empleado
      this.cargarEvaluacionesColab(empleadoId);
    } else {
      console.warn('No se encontró el empleado seleccionado');
    }
    
    // Mostrar el modal
    this.showModal = true;
    
    // ✅ IMPORTANTE: Establecer la sección activa
    this.activeSection = 'EvaluacionColab';
  }

  // ======================================================================================
  // Nueva función para cargar datos del sub empleado en el modal (datos personales)
  // ======================================================================================
  private cargarDatosEmpleadoModal(empleadoId: number): void {
    // Usar tipo=1 para buscar por ID específico
    this.gthEmpleadoService.MostrarConParametros(1, empleadoId).subscribe({
      next: (response: any) => {
        let empleadoData = null;
        
        // Manejar diferentes estructuras de respuesta
        if (response && response.$values && Array.isArray(response.$values)) {
          empleadoData = response.$values.find((emp: any) => emp.idEmpleado === empleadoId);
          if (!empleadoData && response.$values.length === 1) {
            empleadoData = response.$values[0];
          }
        } else if (Array.isArray(response)) {
          empleadoData = response.find((emp: any) => emp.idEmpleado === empleadoId);
          if (!empleadoData && response.length === 1) {
            empleadoData = response[0];
          }
        } else if (response && response.idEmpleado) {
          empleadoData = response;
        }
        
        if (empleadoData) {
          // Asignar datos al modal
          this.empleadoModal = empleadoData;
          this.nombreCompletoDisplayModal = `${empleadoData.nombre || ''} ${empleadoData.apellido || ''}`.trim();
          this.correoElectronicoDisplayModal = empleadoData.correoElectronico || empleadoData.email || 'No disponible';
          this.posicionDisplayModal = empleadoData.posicion || empleadoData.cargo || empleadoData.area || 'No disponible';
        } else {
          console.warn('No se encontraron datos para el empleado:', empleadoId);
          this.setDatosModalPorDefecto();
        }
      },
      error: (error) => {
        console.error('Error al cargar datos del empleado para modal:', error);
        this.setDatosModalPorDefecto();
      }
    });
  }
  // ========================================
  // 4. Función auxiliar para datos por defecto del modal
  // ========================================
  private setDatosModalPorDefecto(): void {
    this.empleadoModal = null;
    this.nombreCompletoDisplayModal = 'Nombre no disponible';
    this.correoElectronicoDisplayModal = 'Correo no disponible';
    this.posicionDisplayModal = 'Posición no disponible';
  }


  cerrarModal(): void {
    this.showModal = false;
    this.empleadoModal = null;
    this.selectedEmpleadoId = 0;
  }


  cargarEvaluacionesColab(idEmpleado: number): void {
  if (idEmpleado) {
    this.idEmpleadoActual = idEmpleado;
    const anio = 2025;

    // Obtener el id de la evaluacion
    this.gthEvaluacionServcie
      .MostrarEvaluacionesPorEmpleadoyAnio(this.idEmpleadoActual, anio)
      .subscribe({
        next: (response: any) => {
          let evaluacionesData = response;
          if (response && response.$values)
            evaluacionesData = response.$values;

          if (evaluacionesData && evaluacionesData.length > 0) {
            const idEvaluacionColab = evaluacionesData[0].idEvaluacion;
            const retroalimentacionColab = evaluacionesData[0].retroalimentacion;
            const planAccionColab = evaluacionesData[0].planAccion || null;
            const fechaRegObjetivosJefe = evaluacionesData[0].fechaRegJefe || null;

            this.retroalimentacionColab = retroalimentacionColab;
            this.planAccionColab = planAccionColab;

            // ✅ CRÍTICO: Guardar la fase
            this.faseEvaluacionColab = evaluacionesData[0].fase;
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('📊 Fase cargada:', this.faseEvaluacionColab);
            console.log('📋 ID Evaluación:', idEvaluacionColab);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

            // ✅ NUEVO: Establecer subsección según fase
            this.establecerSubseccionColabSegunFase();

            // Usamos el id de la evaluacion para saber que objetivos tiene
            this.cargarObjetivosPorFaseColab(this.faseEvaluacionColab!, idEvaluacionColab);

            if (this.idCelulaActual){
              this.cargarObjetivoExistente();
            }

            // inicializamos la colección
            this.nivelesCompetenciasColab = [];

            if(this.faseEvaluacionColab == 1){
              this.fechaRegJefeColab = this.obtenerFechaActual();
            } else {
              this.fechaRegJefeColab = fechaRegObjetivosJefe;
            }

            // Obtenemos las competencias Asignadas a esa evaluacion
            this.gthCompetenciaService
              .obtenerAsignacionCompetenciaPorIdEvaluacion(idEvaluacionColab)
              .subscribe({
                next: (respAsigCompetencias: any) => {
                  let asignacionesCompetenciasDataColab = respAsigCompetencias;
                  if (respAsigCompetencias && respAsigCompetencias.$values) {
                    asignacionesCompetenciasDataColab = respAsigCompetencias.$values;
                  }                    

                  asignacionesCompetenciasDataColab.forEach((competencia: any) => {
                    const idAsignacionCompetenciaColab = competencia.idAsignacion;
                    const idNivelCompetenciaColab = competencia.idNivelCompetencia;          
                    const fechaExistenteColab = competencia.fechaLimite ? new Date(competencia.fechaLimite).toISOString().split('T')[0]: '';
                    const calificacionEmpleado = competencia.calificacionEmpleado || null;
                    const calificacionFinal = competencia.calificacionFinal || null;

                    this.gthCompetenciaService
                      .mostrarNivelCompetencias(1, idNivelCompetenciaColab)
                      .subscribe({
                        next: (respNivelCompetencias: any) => {
                          let nivelesCompetenciasData = respNivelCompetencias;
                          if (respNivelCompetencias && respNivelCompetencias.$values) {
                            nivelesCompetenciasData = respNivelCompetencias.$values;
                          }
                          
                          nivelesCompetenciasData.forEach((nivel: any) => {
                            this.gthCompetenciaService
                              .mostrarCompetencias(1, nivel.idCompetencia)
                              .subscribe({
                                next: (respCompetencia: any) => {
                                  let competenciaData = respCompetencia;
                                  if (respCompetencia && respCompetencia.$values) {
                                    competenciaData = respCompetencia.$values;
                                  }
                                  
                                  if (competenciaData.length > 0) {
                                    const competenciaColab = competenciaData[0];
                                    
                                    const combinadoColab: NivelConCompetencia = {
                                      idAsignacionCompetencia: idAsignacionCompetenciaColab,
                                      idCompetencia: nivel.idCompetencia,
                                      nivel: nivel.nivel,
                                      descripcion: nivel.descripcion,
                                      nombreCompetencia: competenciaColab.nombreCompetencia,
                                      tipoCompetencia: competenciaColab.tipoCompetencia,
                                      fechaRegJefe: this.obtenerFechaActual(),
                                      CalificacionEmpleado: calificacionEmpleado,
                                      CalificacionFinal: calificacionFinal
                                    };
                                    
                                    this.nivelesCompetenciasColab.push(combinadoColab);
                                  }
                                }
                              });
                          });
                        }
                      });
                  });
                },
                error: (error) =>
                  console.error('Error al consultar competencias asignadas:', error),
              });
          } else {
            console.warn('⚠️ No se encontró ninguna evaluación para este empleado y año.');
          }
        },
        error: (error) =>
          console.error('Error al consultar evaluaciones:', error),
      });
  } else {
    console.warn('No se proporcionó ID de empleado');
  }
}  
   

  /**
   * Carga objetivos existentes según la fase
   */
  cargarObjetivosPorFaseColab(faseColab: number, idEvaluacionColab: number): void {
  console.log('=== CARGA de OBJETIVOS de sub empleado - FASE:', faseColab, '===');
  console.log('=== CARGA de IdEvaluacion de sub empleado - FASE:', idEvaluacionColab, '===');
  
  this.gthObjetivoService.obtenerObjetivosPorIdEvaluacion(idEvaluacionColab)
  .subscribe({
    next: (objetivosResponse: any) => {
      const objetivosExistentes = objetivosResponse?.$values || objetivosResponse || [];
      
      // QUITAR EL FILTRO - Traer todos los objetivos (AREA e INDIVIDUAL)
      const todosLosObjetivos = Array.isArray(objetivosExistentes) 
          ? objetivosExistentes 
          : [];
      
      console.log('Todos los objetivos encontrados:', todosLosObjetivos);
      
      if (todosLosObjetivos.length > 0) {
        this.mapearObjetivosSegunFaseColab(todosLosObjetivos, faseColab);
      } else {
        console.log('No hay objetivos existentes');
        this.inicializarObjetivosVaciosColab();
      }
    },
    error: (error) => {
      console.error('Error al cargar objetivos:', error);
      this.inicializarObjetivosVaciosColab();
    }
  });
}
  /**
   * Mapea objetivos según la fase
   */
  mapearObjetivosSegunFaseColab(objetivos: any[], fase: number): void {
  
    // Separar objetivos por tipo
    const objetivoArea = objetivos.find(obj => {
      const tipo = (obj.tipoObjetivo || obj.tipo_objetivo || '').toUpperCase();
      return tipo === 'AREA';
    });
    
    const objetivosIndividuales = objetivos
      .filter(obj => {
        const tipo = (obj.tipoObjetivo || obj.tipo_objetivo || '').toUpperCase();
        return tipo === 'INDIVIDUAL';
      })
      .sort((a, b) => {
        // Ordenar por ID ascendente
        const idA = a.idObjetivo || a.id_objetivo || 0;
        const idB = b.idObjetivo || b.id_objetivo || 0;
        return idA - idB;
      });
    
    // Combinar: primero AREA, luego INDIVIDUAL
    const objetivosOrdenados = objetivoArea 
      ? [objetivoArea, ...objetivosIndividuales]
      : objetivosIndividuales;
    
    console.log('Objetivos ORDENADOS:', objetivosOrdenados);
    
    for (let i = 0; i < 5; i++) {
      if (i < objetivosOrdenados.length) {
        const objColab = objetivosOrdenados[i];
        
        // Formatear fecha
        let fechaFormateada = '';
        if (objColab.fechaLimite || objColab.fecha_limite) {
          const fecha = new Date(objColab.fechaLimite || objColab.fecha_limite);
          fechaFormateada = fecha.toISOString().split('T')[0];
        }
        
        // Obtener tipo
        const tipoObjetivo = (objColab.tipoObjetivo || objColab.tipo_objetivo || 'INDIVIDUAL').toUpperCase();
        
        console.log(`Mapeando posición ${i}: ID=${objColab.idObjetivo}, Tipo=${tipoObjetivo}, Título=${objColab.titulo}`);
        
        // Mapear según fase
        if (fase === 1) {
          // Fase 1: titulo, valoracionEmpleado, valoracionJefe, fechaLimite
          this.objetivosIndividualesColab[i] = {
            idObjetivo: objColab.idObjetivo || objColab.id_objetivo,
            titulo: objColab.titulo,
            tipoObjetivo: tipoObjetivo
          };
        } else if (fase === 3) {
          // Fase 3: titulo, fechaLimite, calificacionEmpleado, calificacionFinal
          this.objetivosIndividualesColab[i] = {
            idObjetivo: objColab.idObjetivo || objColab.id_objetivo,
            titulo: objColab.titulo,
            fechaLimite: fechaFormateada,
            calificacionEmpleado: objColab.calificacionEmpleado || objColab.calificacion_empleado || null,
            calificacionFinal: objColab.calificacionFinal || objColab.calificacion_final || null
          };
        }
        
        // console.log(`Objetivo ${i + 1} mapeado:`, this.objetivosIndividualesColab[i]);
      } else {
        this.objetivosIndividualesColab[i] = { titulo: '', fechaLimite: '' };
      }
    }
  }
  

  /**
   * Inicializa objetivos vacíos
   */
  inicializarObjetivosVaciosColab(): void {
    this.objetivosIndividualesColab = [
      { titulo: '', valoracionJefe: 10, fechaLimite: '' },
      { titulo: '', valoracionJefe: 10, fechaLimite: '' },
      { titulo: '', valoracionJefe: 10, fechaLimite: '' },
      { titulo: '', valoracionJefe: 10, fechaLimite: '' },
      { titulo: '', valoracionJefe: 10, fechaLimite: '' }
    ];
  }



  // Variable para almacenar la fase actual del colaborador
  // faseEvaluacionColab: number = 1; // Se carga desde el backend

  
  // Botón ENVIAR AVANCE - Guarda y avanza a fase 2
  enviarAvance(): void {
    this.guardarDatosEvaluacionColab(2, true);
    
    // ✅ Recargar evaluaciones después de guardar
    setTimeout(() => {
      if (this.selectedEmpleadoId) {
        // this.cargarEvaluaciones(); // Recarga la lista principal
        this.cargarEvaluacionesColab(this.selectedEmpleadoId); // Recarga datos del modal
      }
    }, 500);
    this.cerrarModal();
  }

  // Botón ENVIAR RETROALIMENTACIÓN - Guarda y avanza a fase 4
  enviarRetroalimentacion(): void {
    this.guardarDatosEvaluacionColab(4, true);
    
    // ✅ Recargar evaluaciones después de guardar
    setTimeout(() => {
      if (this.selectedEmpleadoId) {
        // this.cargarEvaluaciones(); // Recarga la lista principal
        this.cargarEvaluacionesColab(this.selectedEmpleadoId); // Recarga datos del modal
      }
    }, 500);
    this.cerrarModal();
  }

  guardarDatosEvaluacionColab(faseAGuardar: number, esAvance: boolean): void {
    console.log('=== GUARDANDO - Fase actual:', this.faseEvaluacionColab, 'Fase a guardar:', faseAGuardar, '===');
    
    let idColaborador = 2;
    
    // Usa el operador ?? para manejar null
    const faseActual: number = this.faseEvaluacionColab ?? 0;
    
    // Ahora puedes usar faseActual
    console.log('Transición:', faseActual, '→', faseAGuardar);

    // VALIDACIONES SEGÚN LA FASE ACTUAL
    if (this.faseEvaluacionColab === 1) {
      // FASE 1: Validar que valoracionJefe esté completo (valoracionEmpleado viene de BD)
      const objetivosIncompletos = this.objetivosIndividualesColab.filter(obj => 
        obj.valoracionJefe == null || obj.valoracionJefe === undefined
      );     

    } 
    else if (this.faseEvaluacionColab === 3) {
      // FASE 3: Validar que calificacionFinal esté completo
      const objetivosIncompletos = this.objetivosIndividualesColab.filter(obj => 
        obj.calificacionFinal == null || obj.calificacionFinal === undefined
      );
      
      if (objetivosIncompletos.length > 0) {
        alert(`Complete la calificación final en todos los objetivos. Faltan ${objetivosIncompletos.length} objetivo(s).`);
        return;
      }

      const competenciasIncompletas = this.nivelesCompetenciasColab.filter(comp => 
        comp.CalificacionFinal == null || comp.CalificacionFinal === undefined
      );
      
      if (competenciasIncompletas.length > 0) {
        alert(`Complete la calificación final en todas las competencias. Faltan ${competenciasIncompletas.length} competencia(s).`);
        return;
      }
    }

    const anio = 2025;

    this.gthEvaluacionServcie
      .MostrarEvaluacionesPorEmpleadoyAnio(idColaborador, anio)
      .subscribe({
        next: (response: any) => {
          let evaluacionesData = response?.$values || response;
          
          if (evaluacionesData && evaluacionesData.length > 0) {
            const idEvaluacion = evaluacionesData[0].idEvaluacion;
            console.log('ID Evaluación:', idEvaluacion);
            
            // PASO 1: Guardar objetivos
            const promesasObjetivos = this.objetivosIndividualesColab.map((objetivo, index) => {
            let objetivoData: IgthObjetivo | null = null;
            const tipoObjetivo = index === 0 ? 'AREA' : 'INDIVIDUAL';

              
              if (this.faseEvaluacionColab === 1) {
                // Fase 1: Guardar valoracionJefe                
                objetivoData = {
                  tipo: 2,
                  idObjetivo: objetivo.idObjetivo,
                  tipoObjetivo: tipoObjetivo, 
                  peso: index === 0 ? 22 : 12  
                };
              } 
              else if (this.faseEvaluacionColab === 3) {
                // Fase 3: Guardar calificacionFinal
                if (!objetivo.idObjetivo) {
                  console.warn('⚠️ Objetivo sin ID:', objetivo);
                  return null;
                }
                
                objetivoData = {
                  tipo: 2,
                  idObjetivo: objetivo.idObjetivo,
                  calificacionFinal: objetivo.calificacionFinal
                };
              }
              
              if (!objetivoData) return null;
              
              console.log(`Actualizando objetivo ${index + 1}:`, objetivoData);
              return this.gthObjetivoService.gestionarObjetivo(objetivoData).toPromise();
            }).filter(promesa => promesa !== null);
            
            if (promesasObjetivos.length === 0) {
              alert('No hay objetivos válidos para guardar.');
              return;
            }
          
            // EJECUTAR: Objetivos → Competencias → Evaluación
            Promise.all(promesasObjetivos)
              .then((responsesObjetivos) => {
                console.log('✅ Objetivos guardados');
                
                const hayErroresObjetivos = responsesObjetivos.some((resp: any) => {
                  const resultado = resp?.$values?.[0] || resp?.[0] || resp;
                  return resultado?.valor1 < 0;
                });
                
                if (hayErroresObjetivos) {
                  alert('Error al guardar objetivos. Revise la consola.');
                  return;
                }
                
                // PASO 2: Guardar competencias
                const promesasCompetencias = this.nivelesCompetenciasColab.map((competencia, index) => {
                  let competenciaData: IGTHAsignacionCompetenciaViewModel | null = null;
                  
                  if (this.faseEvaluacionColab === 1) {
                    // Fase 1: Guardar ValoracionJefe
                    if (!competencia.idAsignacionCompetencia) {
                      console.warn('⚠️ Competencia sin ID:', competencia);
                      return null;
                    }
                    // Convertir fecha de string a Date
                    let fechaFormateada: Date | undefined;
                    if (competencia.FechaLimite) {
                      fechaFormateada = new Date(competencia.FechaLimite);
                    }
                    
                    competenciaData = {
                      Tipo: 2,
                      IdAsignacion: competencia.idAsignacionCompetencia,
                      // ValoracionJefe: 7.5,
                      // fechaRegJefe: fechaFormateada   //La guardamos solamente en la evaluacion
                    };
                  } 
                  else if (this.faseEvaluacionColab === 3) {
                    // Fase 3: Guardar CalificacionFinal
                    if (!competencia.idAsignacionCompetencia) {
                      console.warn('⚠️ Competencia sin ID:', competencia);
                      return null;
                    }
                    
                    competenciaData = {
                      Tipo: 2,
                      IdAsignacion: competencia.idAsignacionCompetencia,
                      CalificacionFinal: competencia.CalificacionFinal
                    };
                  }
                  
                  if (!competenciaData) return null;
                  
                  return this.gthCompetenciaService.gestionarAsignacionCompetencia(competenciaData).toPromise();
                }).filter(promesa => promesa !== null);

                if (promesasCompetencias.length === 0) {
                  console.warn('⚠️ No hay competencias para actualizar');
                  this.actualizarEvaluacionFinalColab(faseAGuardar, idEvaluacion, anio, idColaborador, esAvance);
                  return;
                }

                Promise.all(promesasCompetencias)
                  .then((responsesCompetencias) => {
                    console.log('✅ Competencias guardadas');
                    
                    const hayErroresCompetencias = responsesCompetencias.some((resp: any) => {
                      const resultado = resp?.$values?.[0] || resp?.[0] || resp;
                      return resultado?.valor1 < 0;
                    });
                    
                    if (hayErroresCompetencias) {
                      alert('Error al guardar competencias. Revise la consola.');
                      return;
                    }
                    
                    // PASO 3: Actualizar evaluación
                    this.actualizarEvaluacionFinalColab(faseActual, idEvaluacion, anio, idColaborador, esAvance);
                  })
                  .catch((error) => {
                    console.error('❌ Error al guardar competencias:', error);
                    alert('Objetivos guardados, pero error al guardar competencias.');
                  });
              })
              .catch((error) => {
                console.error('❌ Error al guardar objetivos:', error);
                alert('Error al guardar objetivos.');
              });
          }
        },
        error: (error) => {
          console.error('❌ Error al obtener evaluación:', error);
          alert('Error al obtener la evaluación.');
        }
      });
  }

  private actualizarEvaluacionFinalColab(faseAGuardar: number, idEvaluacion: number, anio: number, idColaborador: number, esAvance: boolean): void {
    let evaluacionActualizada: Ievaluacion | null = null;

    console.log('✅ Consulta de la fase:', faseAGuardar);
    // console.log('📝 Retroalimentación:', this.retroalimentacion);
    // console.log('📋 Plan de Acción:', this.planAccion);
    
    if (faseAGuardar === 1) {
      evaluacionActualizada = {
        tipo: 2,
        idEmpleado: this.idEmpleadoActual!,
        idEvaluacion: idEvaluacion,
        // anio: anio,
        estado: 'EN PROCESO',
        fechaRegJefe: this.fechaRegJefeColab,
        fase: 6
        
      };
    } else if (faseAGuardar === 3) {
      evaluacionActualizada = {
        tipo: 2,
        idEmpleado: this.idEmpleadoActual!,
        idEvaluacion: idEvaluacion,
        estado: 'EN PROCESO',
        retroalimentacion: this.retroalimentacionColab, 
        planAccion: this.planAccionColab,
        fechaEvaluacionJefe: this.obtenerFechaActual(),
        fase: 4
      };
    }
    
    if (evaluacionActualizada) {
      this.gthEvaluacionServcie.actualizarGthEvaluacion(evaluacionActualizada).subscribe({
        next: (resp) => {
          console.log('✅ Evaluación actualizada :', evaluacionActualizada!);
          alert('✅ Datos guardados correctamente.');
        },
        error: (error) => {
          console.error('❌ Error al actualizar evaluación:', error);
          alert('Objetivos y competencias guardados, pero error al actualizar evaluación.');
        }
      });
    } else {
      alert('✅ Datos guardados correctamente.');
    }
  }


  getNombreCalificacion(valor: number | null | undefined): string {
    if (!valor) return 'Sin calificar';
    
    switch (valor) {
      case 1: return 'Insatisfactorio';
      case 2: return 'Necesita Mejorar';
      case 3: return 'Satisfactorio';
      case 4: return 'Sobresaliente';
      default: return 'N/A';
    }
  }








  /**
   * Actualiza el valor numérico de una competencia específica (array fijo)
   * @param index - Índice de la competencia (0-4)
   * @param valor - Valor numérico (puede ser Event o number)
   */
  // actualizarValorCompetenciaFija(index: number, valor: any): void {
  //   let nuevoValor: number;
    
  //   if (valor && typeof valor === 'object' && valor.target) {
  //     // Es un evento
  //     nuevoValor = Number((valor.target as HTMLInputElement).value);
  //   } else {
  //     // Es un número directo
  //     nuevoValor = Number(valor);
  //   }

  //   // if (index >= 0 && index < this.competencias.length) {
  //   //   // Validar que el valor esté entre 0 y 100
  //   //   if (!isNaN(nuevoValor) && nuevoValor >= 0 && nuevoValor <= 100) {
  //   //     this.competencias[index].valor = nuevoValor;
  //   //     console.log(`📊 Valor competencia ${index + 1}:`, nuevoValor, this.competencias[index]);
  //   //   }
  //   // }
  // }



  /**
   * Actualiza la fecha de una competencia específica (array fijo)
   * @param index - Índice de la competencia (0-4)
   * @param fecha - Nueva fecha (puede ser Event o string)
   */
  // actualizarFechaCompetenciaFija(index: number, fecha: any): void {
  //   let nuevaFecha: string;
    
  //   if (fecha && typeof fecha === 'object' && fecha.target) {
  //     // Es un evento
  //     nuevaFecha = (fecha.target as HTMLInputElement).value;
  //   } else {
  //     // Es una fecha directa
  //     nuevaFecha = String(fecha);
  //   }

  //   // if (index >= 0 && index < this.competencias.length) {
  //   //   this.competencias[index].fecha = nuevaFecha;
  //   //   console.log(`📅 Fecha competencia ${index + 1}:`, nuevaFecha, this.competencias[index]);
  //   // }
  // }



  /**
   * Calcula el porcentaje promedio basado en las evaluaciones del empleado
   * @returns Porcentaje promedio de los objetivos del empleado
   */
  // calcularPorcentajeEmpleado(): number {
  //   const objetivosConValor = this.objetivosb.filter(
  //     (obj) => obj.valor !== null && obj.valor > 0
  //   );
  //   if (objetivosConValor.length === 0) return 0;

  //   const suma = objetivosConValor.reduce((acc, obj) => acc + obj.valor, 0);
  //   const promedio = suma / objetivosConValor.length;

  //   return Math.round(promedio);
  // }

  /**
   * Calcula el porcentaje promedio basado en las evaluaciones del administrador
   * @returns Porcentaje promedio de la evaluación administrativa
   */
  // calcularPorcentajeAdmin(): number {
  //   const objetivosConValorAdmin = this.objetivosb.filter(
  //     (obj) => obj.valorAdmin !== null && obj.valorAdmin > 0
  //   );
  //   if (objetivosConValorAdmin.length === 0) return 0;

  //   const suma = objetivosConValorAdmin.reduce(
  //     (acc, obj) => acc + (obj.valorAdmin || 0),
  //     0
  //   );
  //   const promedio = suma / objetivosConValorAdmin.length;

  //   return Math.round(promedio);
  // }

  // showSection(targetId: string): void {
  //   this.activeSection = targetId;
  // }
  // Método para el menú principal
  showSection(section: string): void {
    this.activeSection = section;
    console.log('Sección activa:', section);
    
    // Resetear sub-secciones al cambiar de pestaña
    if (section === 'hoja-ruta') {
      this.activeTimelineStep = 'Revision-Inicial';
    } else if (section === 'EvaluacionColab') {
      // this.activeTimelineStepColab = 'Revision-Inicial-colab';
      // Establecer la subsección según la fase del colaborador
      console.log('seccion actual: ', section);
      this.establecerSubseccionColabSegunFase();
    }
  }

  toggleDropdown(): void {
    const dropdown = document.getElementById('profileMenu');
    if (dropdown) {
      dropdown.classList.toggle('show');
    }
  }

  logout(): void {
    // Logout logic will be implemented later
    console.log('Logout clicked');
  }

  /**
   * Aprueba la evaluación del empleado
   */
  // aprobarEvaluacion(): void {
  //   console.log('✅ Evaluación aprobada por el administrador');
  //   // Aquí se implementará la lógica para aprobar la evaluación
  //   // Por ejemplo, cambiar el estado de la evaluación, enviar notificaciones, etc.
  //   alert('Evaluación aprobada exitosamente');
  // }

  /**
   * Rechaza la evaluación del empleado
   */
  // rechazarEvaluacion(): void {
  //   console.log('❌ Evaluación rechazada por el administrador');
  //   // Aquí se implementará la lógica para rechazar la evaluación
  //   // Por ejemplo, solicitar comentarios del rechazo, cambiar estado, etc.
  //   const motivo = prompt('Ingrese el motivo del rechazo:');
  //   if (motivo) {
  //     console.log('Motivo del rechazo:', motivo);
  //     alert('Evaluación rechazada. Motivo: ' + motivo);
  //   }
  // }

  
}
