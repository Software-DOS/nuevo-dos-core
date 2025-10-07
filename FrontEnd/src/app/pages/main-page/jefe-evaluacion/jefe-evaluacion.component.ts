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
  FechaLimite: string;
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

    this.cargarEvaluaciones();

    // this.cargarCompetenciasAdmin();

    // Inicializar los 5 objetivos Colaboradores
    this.objetivosIndividualesColab = [
      { titulo: '', valoracionEmpleado: null, fechaLimite: '' },
      { titulo: '', valoracionEmpleado: null, fechaLimite: '' },
      { titulo: '', valoracionEmpleado: null, fechaLimite: '' },
      { titulo: '', valoracionEmpleado: null, fechaLimite: '' },
      { titulo: '', valoracionEmpleado: null, fechaLimite: '' }
    ];


    this.cargarEvaluacionesColab(); //Borrar, esta parte debe usarse cuando se de click a un empleado de la lista enviando su id

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



    /* -------------------------------------------------------------
          Variables para la seccion de evaluacion de colboradores
    ----------------------------------------------------------------*/
    // Fase actual (esto vendrá del backend)
    currentPhaseColab: number = 3; 

    // Objetivos individuales
    objetivosIndividualesColab: IgthObjetivo[] = [];

    // declara la propiedad global del componente
    nivelesCompetenciasColab: NivelConCompetencia[] = [];

    // Fase actual de evaluacion para cargar
    faseEvaluacionColab: number | null = 3;   

    // Sub-secciones para "Evaluación de Colaboradores"
    activeTimelineStepColab: string = 'Revision-Inicial-colab';

    // Sub-secciones para "Evaluación de Colaboradores"
    // activeTimelineStepColab: string = 'Revision-Inicial-colab';
    // Variable para la fase del colaborador (se carga desde BD)
    // faseEvaluacionColab = 1; // 1 o 3

  
//=======================    Pasos para cambiar entre Secciones de la Evaluacion de Colaborador   ============================

  // Timeline Steps - Solo para jefe
  timelineStepsColab = [
    {
      number: 1,
      label: 'Revisión Inicial',
      completed: true,
      icon: 'fas fa-check',
      pngIcon:
        'assets/img/iconos/iconos mycollection/png/035-retroalimentacion-7.png',
      sectionId: 'Revision-Inicial-colab',
      fase: 1
    },
    {
      number: 2,
      label: 'Retroalimentación',
      completed: false,
      pngIcon: 'assets/img/iconos/iconos mycollection/png/028-grafico.png',
      sectionId: 'Retroalimentacion-colab',
      fase: 3
    },
  ];  

  // ✅ Nueva función para Evaluación Colaboradores
  onStepKeyDownColab(event: KeyboardEvent, step: any): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onStepClickColab(step);
    }
  }

  // ================ MÉTODO PARA CAMBIAR SUB-SECCIÓN EN EVALUACIÓN COLABORADORES ================
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

  // ✅ NUEVA FUNCIÓN: Establecer subsección según fase
  establecerSubseccionColabSegunFase(): void {
    // Buscar el step que corresponde a la fase actual
    const stepActual = this.timelineStepsColab.find(step => step.fase === this.faseEvaluacionColab);
    
    if (stepActual) {
      this.activeTimelineStepColab = stepActual.sectionId;
      
      // Marcar los steps anteriores como completados
      this.timelineStepsColab.forEach(step => {
        step.completed = step.fase < this.faseEvaluacionColab!;
      });
      
      console.log('✅ Subsección establecida:', this.activeTimelineStepColab, 'para fase:', this.faseEvaluacionColab);
    }
  }
//---------------------------------------------------------------------------------------------------------------------

//=======================    Pasos para cambiar entre Secciones de la Evaluacion   ============================

  // Timeline Steps
  timelineSteps = [
    { 
      number: 1, 
      label: 'Captura de Resultados', 
      completed: true, 
      icon: 'fas fa-check',
      pngIcon: 'assets/img/iconos/iconos mycollection/png/062-reloj-de-arena.png',
      sectionId: 'Captura-Resultados'
    },
    { 
      number: 2, 
      label: 'Revisión Inicial', 
      completed: false,
      pngIcon: 'assets/img/iconos/iconos mycollection/png/035-retroalimentacion-7.png',
      sectionId: 'Revision-Inicial'
    },
    { 
      number: 3, 
      label: 'Evaluación Intermedia', 
      completed: false,
      pngIcon: 'assets/img/iconos/iconos mycollection/png/051-lista-de-verificacion.png',
      sectionId: 'Evaluacion-Intermedia'
    },
    { 
      number: 4, 
      label: 'Retroalimentación', 
      completed: false,
      pngIcon: 'assets/img/iconos/iconos mycollection/png/028-grafico.png',
      sectionId: 'Retroalimentacion'
    },
    { 
      number: 5, 
      label: 'Cierre', 
      completed: false,
      pngIcon: 'assets/img/iconos/iconos mycollection/png/056-alcanzando-objetivos.png',
      sectionId: 'Cierre'
    }
  ];

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
  objectives = [
    {
      name: 'Entrega de Proyectos',
      weight: '40%',
      startDate: '01/01/2025',
      endDate: '30/06/2025',
      description: 'Completar entregables en tiempo y forma.',
    },
    {
      name: 'Reducción de Errores',
      weight: '30%',
      startDate: '01/01/2025',
      endDate: '30/06/2025',
      description: 'Reducir errores de software en un 20%.',
    },
  ];

  // Competencias dinámicas - Se cargarán desde el backend
  competencies: IGTHCompetenciaViewModel[] = [];
  loadingCompetencies: boolean = false;

  // Objetivos del empleado - Precargados desde el sistema
  // objetivosb = [
  //   {
  //     id: 1,
  //     texto: 'Implementar sistema de gestión de documentos',
  //     valor: 85,
  //     fecha: '2025-03-15',
  //     reconsiderar: null as number | null,
  //     valorAdmin: null as number | null, // Valor asignado por el administrador
  //     fechaAdmin: '' as string, // Fecha de retroalimentación del admin
  //   },
  //   {
  //     id: 2,
  //     texto: 'Optimizar rendimiento de aplicaciones existentes',
  //     valor: 75,
  //     fecha: '2025-04-20',
  //     reconsiderar: null as number | null,
  //     valorAdmin: null as number | null,
  //     fechaAdmin: '',
  //   },
  //   {
  //     id: 3,
  //     texto: 'Capacitar al equipo en nuevas tecnologías',
  //     valor: 90,
  //     fecha: '2025-05-10',
  //     reconsiderar: null as number | null,
  //     valorAdmin: null as number | null,
  //     fechaAdmin: '',
  //   },
  //   {
  //     id: 4,
  //     texto: 'Desarrollar módulo de reportes automatizados',
  //     valor: 60,
  //     fecha: '2025-06-30',
  //     reconsiderar: null as number | null,
  //     valorAdmin: null as number | null,
  //     fechaAdmin: '',
  //   },
  //   {
  //     id: 5,
  //     texto: 'Establecer protocolo de respaldo de datos',
  //     valor: 95,
  //     fecha: '2025-02-28',
  //     reconsiderar: null as number | null,
  //     valorAdmin: null as number | null,
  //     fechaAdmin: '',
  //   },
  // ];



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
                            fUNCIONES PARA CARGAR INFO DE COLABORADOR
=========================================================================================*/

  cargarDatosEmpleado(): void {
    // console.log('Iniciando proceso de carga de informacion');
    // Obtener ID del empleado del sessionStorage
    const idEmpleado =
      this.gthEmpleadoService.obtenerIdGthEmpleadoDesdeSession();

    if (idEmpleado) {
      this.idEmpleadoActual = idEmpleado;
      this.buscarEmpleadoPorId(2); //Probando
    } else {
      console.warn(
        'No se encontró ID de empleado en sessionStorage, usando cédula de prueba'
      );
    }
  }

  /**
   * Busca un empleado específico por ID
   * @param idEmpleado - ID del empleado a buscar
   */
  buscarEmpleadoPorId(idEmpleado: number): void {

    this.gthEmpleadoService.MostrarConParametros(1, idEmpleado).subscribe({
      next: (empleado: any) => {
        // console.log('Respuesta del backend ->', empleado); //importante

        const datosEmpleado = empleado?.$values?.[0];

        if (datosEmpleado) {
          this.empleado = datosEmpleado;
          this.mapearDatosParaMostrar();
        } else {
          console.warn('No se encontró empleado con el ID:');
        }
      },
      error: (error) => {
        console.error('Error al buscar empleado por ID:', error);
      },
    });
  }
 
  private async mapearDatosParaMostrar(): Promise<void> {
    if (this.empleado) {
      // Guardar ID del empleado para usar en subida de fotos
      this.idEmpleadoActual = this.empleado.idEmpleado;

      // ⭐ NUEVA LÍNEA: Guardar el ID de la célula
      this.idCelulaActual = this.empleado.idCelula || null;

      if (this.idCelulaActual) this.cargarObjetivoExistente(); //Hay que cambiar el lugar

      this.nombreCompletoDisplay = `${this.empleado.nombre} ${this.empleado.apellido}`;
      this.correoElectronicoDisplay =
        this.empleado.correo || this.empleado.correoCorporativo;
      this.posicionDisplay = this.empleado.cargoActual;
      // this.areaDisplay = this.empleado.area;
    }
  }

  construirUrlFoto(fotoPerfilUrl: string, sexo: string): string {
    // Normalizar sexo
    const sexoNormalizado = (sexo || '').toString().trim().toLowerCase();

    const defaultFemenino =
      'assets/img/iconos/iconos mycollection/png/010-mujer-2.png';
    const defaultMasculino =
      'assets/img/iconos/iconos mycollection/png/028-hombre-2.png';
    const defaultGenerico =
      'assets/img/iconos/iconos mycollection/png/026-hombre-de-traje-y-corbata.png';

    // Determinar fallback según sexo
    const fallback =
      sexoNormalizado === 'femenino' || sexoNormalizado === 'f'
        ? defaultFemenino
        : sexoNormalizado === 'masculino' || sexoNormalizado === 'm'
        ? defaultMasculino
        : defaultGenerico;

    // Si no hay URL, usar fallback directamente
    if (!fotoPerfilUrl) return fallback;

    // Si es una URL completa (http/https), devolverla tal cual
    if (
      fotoPerfilUrl.startsWith('http://') ||
      fotoPerfilUrl.startsWith('https://')
    ) {
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
   * Carga las primeras 5 competencias desde el backend para poblar las competencias fijas
   * Solo carga los nombres si las competencias están vacías
   */
  // cargarCompetenciasHojaRuta(): void {
  //   console.log('🔍 Verificando competencias fijas:', this.competencias);
    
  //   // Si ya hay nombres en las competencias fijas, no volver a cargar
  //   if (this.competencias[0].name !== '') {
  //     console.log('✅ Competencias fijas ya tienen nombres, preservando valores existentes');
  //     return;
  //   }

  //   console.log('🚀 Iniciando carga de nombres de competencias...');
  //   this.loadingCompetencies = true;
    
  //   this.gthCompetenciaService.obtenerPrimeras5Competencias()
  //     .subscribe({
  //       next: (competencias: IGTHCompetenciaViewModel[]) => {
  //         console.log('📊 Competencias obtenidas del servicio:', competencias);
          
  //         // Poblar solo los nombres en las competencias fijas
  //         competencias.forEach((comp, index) => {
  //           if (index < this.competencias.length) {
  //             this.competencias[index].name = comp.nombreCompetencia || `Competencia ${index + 1}`;
  //             // Mantener los valores existentes (valor, fecha, reconsiderar)
  //           }
  //         });
          
  //         this.loadingCompetencies = false;
  //         console.log('✅ Competencias fijas pobladas:', this.competencias);
  //       },
  //       error: (error) => {
  //         console.error('❌ Error al cargar competencias:', error);
  //         this.loadingCompetencies = false;
          
  //         // En caso de error, usar nombres por defecto
  //         this.competencias.forEach((comp, index) => {
  //           if (comp.name === '') {
  //             comp.name = `Competencia ${index + 1}`;
  //           }
  //         });
          
  //         console.log('🔄 Usando nombres por defecto por error');
  //       }
  //     });
  // }

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
    const idEmpleado =
      this.gthEmpleadoService.obtenerIdGthEmpleadoDesdeSession();

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


/*=======================================================================================
                  fUNCIONES PARA CARGAR INFO DE EVALUACION COLABORADOR
=========================================================================================*/

  cargarEvaluacionesColab(): void {
    const idEmpleado = 2; //Ingresamos el id del empleado desde la lista de Colaboradores

    if (idEmpleado) {
      this.idEmpleadoActual = 2; // pruebas
      const anio = 2025;

      // Obtenermos el id de la evaluacion
      this.gthEvaluacionServcie
        .MostrarEvaluacionesPorEmpleadoyAnio(this.idEmpleadoActual, anio)
        .subscribe({
          next: (response: any) => {
            let evaluacionesData = response;
            if (response && response.$values)
              evaluacionesData = response.$values;

            if (evaluacionesData && evaluacionesData.length > 0) {
              const idEvaluacionColab = evaluacionesData[0].idEvaluacion;

              this.faseEvaluacionColab = evaluacionesData[0].fase;
              console.log('fase que llega de la evaluacion colab', this.faseEvaluacionColab);

              // Usamos el id de la evaluacion para saber que objetivos tiene
              this.cargarObjetivosPorFaseColab(this.faseEvaluacionColab!, idEvaluacionColab);

              if (this.idCelulaActual){
                this.cargarObjetivoExistente();  //Traemos el Objetivo de AREA
              }

              // inicializamos la colección
              this.nivelesCompetenciasColab = [];

              // Obtenemos las competencias Asiganadas a esa evaluacion
              this.gthCompetenciaService
                .obtenerAsignacionCompetenciaPorIdEvaluacion(idEvaluacionColab)
                .subscribe({
                  next: (respAsigCompetencias: any) => {
                    // console.log('\n📦 COMPONENTE - Respuesta recibida:', respAsigCompetencias);
                    // console.log('📦 COMPONENTE - Tiene $values?:', !!respAsigCompetencias?.$values);

                    let asignacionesCompetenciasDataColab = respAsigCompetencias;
                    if (respAsigCompetencias && respAsigCompetencias.$values) {
                      asignacionesCompetenciasDataColab = respAsigCompetencias.$values;
                      // console.log('✅ Usando $values');
                    }
                    
                    // console.log('📊 Total asignaciones:', asignacionesCompetenciasDataColab?.length);
                    
                    // if (asignacionesCompetenciasDataColab && asignacionesCompetenciasDataColab.length > 0) {
                    //   console.log('📝 Primera competencia completa:', asignacionesCompetenciasDataColab[0]);
                    //   console.log('📅 fechaLimite de la primera:', asignacionesCompetenciasDataColab[0].fechaLimite);
                    // }         

                    asignacionesCompetenciasDataColab.forEach((competencia: any) => {
                      const idAsignacionCompetenciaColab = competencia.idAsignacion;
                      const idNivelCompetenciaColab = competencia.idNivelCompetencia;                      
                      const valoracionExistenteColab = competencia.valoracionEmpleado || null;
                      const fechaExistenteColab = competencia.fechaLimite ? new Date(competencia.fechaLimite).toISOString().split('T')[0]: '';
                      const valoracionJefeColab = competencia.valoracionJefe || null;

                      // console.log('✅ Valores capturados:', {
                      //   valoracion: valoracionExistenteColab,
                      //   fecha: fechaExistenteColab,
                      //   idAsignacion: idAsignacionCompetenciaColab
                      // });
                      
                      // console.log('✅ Valores capturados - Valoración:', valoracionExistenteColab, 'Fecha:', fechaExistenteColab);

                      // Buscamos los datos de esa competencia Asignada ya que solo sabemos el id 
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
                                        ValoracionEmpleado: valoracionExistenteColab,
                                        FechaLimite: fechaExistenteColab, // String en formato YYYY-MM-DD
                                        ValoracionJefe: valoracionJefeColab,
                                        CalificacionEmpleado: competenciaColab.calificacionEmpleado || null,
                                        CalificacionFinal: competenciaColab.calificacionFinal || null
                                      };
                                      
                                      this.nivelesCompetenciasColab.push(combinadoColab);
                                      // console.log('✅ Competencia de colaborador agregada:', combinadoColab);
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
      console.warn('No se encontró ID de empleado en sessionStorage');
    }
  }

  /**
   * Carga objetivos existentes según la fase
   */
  cargarObjetivosPorFaseColab(faseColab: number, idEvaluacionColab: number): void {
    console.log('=== CARGANDO OBJETIVOS - FASE:', faseColab, '===');
    
    this.gthObjetivoService.obtenerObjetivosPorIdEvaluacion(idEvaluacionColab)
    .subscribe({
      next: (objetivosResponse: any) => {
        const objetivosExistentes = objetivosResponse?.$values || objetivosResponse || [];        
        const objetivosIndividualesColab = Array.isArray(objetivosExistentes) 
            ? objetivosExistentes.filter((obj: any) => 
                (obj.tipoObjetivo || obj.tipo_objetivo) === 'INDIVIDUAL'
              )
            : [];
        
        // console.log('Objetivos INDIVIDUALES encontrados para colaborador:', objetivosIndividualesColab);
        
        if (objetivosIndividualesColab.length > 0) {
          this.mapearObjetivosSegunFaseColab(objetivosIndividualesColab, faseColab);
        } else {
          console.log('No hay objetivos existentes');
          // Inicializar vacíos si no hay objetivos
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
    // console.log('Mapeando objetivos para fase:', fase);
    
    for (let i = 0; i < 5; i++) {
      if (i < objetivos.length) {
        const objColab = objetivos[i];
        
        // Formatear fecha
        let fechaFormateada = '';
        if (objColab.fechaLimite || objColab.fecha_limite) {
          const fecha = new Date(objColab.fechaLimite || objColab.fecha_limite);
          fechaFormateada = fecha.toISOString().split('T')[0];
        }
        
        if (fase === 1) {
          // Fase 1: titulo, valoracionEmpleado, valoracionJefe, fechaLimite
          this.objetivosIndividualesColab[i] = {
            idObjetivo: objColab.idObjetivo || objColab.id_objetivo,
            titulo: objColab.titulo,
            valoracionEmpleado: objColab.valoracionEmpleado || objColab.valoracion_empleado || null,
            valoracionJefe: objColab.valoracionJefe || objColab.valoracion_jefe || null,
            fechaLimite: fechaFormateada
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
      { titulo: '', valoracionEmpleado: null, fechaLimite: '' },
      { titulo: '', valoracionEmpleado: null, fechaLimite: '' },
      { titulo: '', valoracionEmpleado: null, fechaLimite: '' },
      { titulo: '', valoracionEmpleado: null, fechaLimite: '' },
      { titulo: '', valoracionEmpleado: null, fechaLimite: '' }
    ];
  }



// Variable para almacenar la fase actual del colaborador
// faseEvaluacionColab: number = 1; // Se carga desde el backend

// Botón REVISAR - Guarda en fase 1 sin avanzar
guardarRevision(): void {
  this.guardarDatosEvaluacionColab(1, false);
}

// Botón ENVIAR - Guarda y avanza a fase 2
enviarAvance(): void {
  this.guardarDatosEvaluacionColab(2, true);
}

// Botón ENVIAR RETROALIMENTACIÓN - Guarda y avanza a fase 4
enviarRetroalimentacion(): void {
  this.guardarDatosEvaluacionColab(4, true);
}

guardarDatosEvaluacionColab(faseAGuardar: number, esAvance: boolean): void {
  console.log('=== GUARDANDO - Fase actual:', this.faseEvaluacionColab, 'Fase a guardar:', faseAGuardar, '===');
  let idColaborador = 2; // Usar el id real en producción

  // VALIDACIONES SEGÚN LA FASE ACTUAL
  if (this.faseEvaluacionColab === 1) {
    // FASE 1: Validar que valoracionJefe esté completo (valoracionEmpleado viene de BD)
    const objetivosIncompletos = this.objetivosIndividualesColab.filter(obj => 
      obj.valoracionJefe == null || obj.valoracionJefe === undefined
    );
    
    if (objetivosIncompletos.length > 0) {
      alert(`Complete la valoración del jefe en todos los objetivos. Faltan ${objetivosIncompletos.length} objetivo(s).`);
      return;
    }

    const competenciasIncompletas = this.nivelesCompetenciasColab.filter(comp => 
      comp.ValoracionJefe == null || comp.ValoracionJefe === undefined
    );
    
    if (competenciasIncompletas.length > 0) {
      alert(`Complete la valoración del jefe en todas las competencias. Faltan ${competenciasIncompletas.length} competencia(s).`);
      return;
    }
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
            
            if (this.faseEvaluacionColab === 1) {
              // Fase 1: Guardar valoracionJefe
              if (!objetivo.idObjetivo) {
                console.warn('⚠️ Objetivo sin ID:', objetivo);
                return null;
              }
              
              objetivoData = {
                tipo: 2,
                idObjetivo: objetivo.idObjetivo,
                titulo: objetivo.titulo,
                valoracionJefe: objetivo.valoracionJefe,
                fechaLimite: objetivo.fechaLimite
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
                    ValoracionJefe: competencia.ValoracionJefe,
                    FechaLimite: fechaFormateada
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
                  this.actualizarEvaluacionFinalColab(faseAGuardar, idEvaluacion, anio, idColaborador, esAvance);
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

// Función auxiliar para actualizar evaluación
private actualizarEvaluacionFinalColab(faseAGuardar: number, idEvaluacion: number, anio: number, idColaborador: number, esAvance: boolean): void {
  const evaluacionActualizada: Ievaluacion = {
    tipo: 2,
    idEmpleado: idColaborador,
    idEvaluacion: idEvaluacion,
    anio: anio,
    estado: 'EN PROCESO',
    fase: faseAGuardar // 1 (revisar), 2 (avanzar), o 4 (avanzar)
  };
  
  this.gthEvaluacionServcie.actualizarGthEvaluacion(evaluacionActualizada).subscribe({
    next: (resp) => {
      console.log('✅ Evaluación actualizada a fase:', faseAGuardar);
      
      if (esAvance) {
        alert('✅ Evaluación enviada y avanzada correctamente.');
        // Opcional: Recargar o navegar
        this.faseEvaluacionColab = faseAGuardar;
      } else {
        alert('✅ Revisión guardada correctamente.');
      }
    },
    error: (error) => {
      console.error('❌ Error al actualizar evaluación:', error);
      alert('Objetivos y competencias guardados, pero error al actualizar evaluación.');
    }
  });
}












  /**
   * Actualiza el valor numérico de una competencia específica (array fijo)
   * @param index - Índice de la competencia (0-4)
   * @param valor - Valor numérico (puede ser Event o number)
   */
  actualizarValorCompetenciaFija(index: number, valor: any): void {
    let nuevoValor: number;
    
    if (valor && typeof valor === 'object' && valor.target) {
      // Es un evento
      nuevoValor = Number((valor.target as HTMLInputElement).value);
    } else {
      // Es un número directo
      nuevoValor = Number(valor);
    }

    // if (index >= 0 && index < this.competencias.length) {
    //   // Validar que el valor esté entre 0 y 100
    //   if (!isNaN(nuevoValor) && nuevoValor >= 0 && nuevoValor <= 100) {
    //     this.competencias[index].valor = nuevoValor;
    //     console.log(`📊 Valor competencia ${index + 1}:`, nuevoValor, this.competencias[index]);
    //   }
    // }
  }



  /**
   * Actualiza la fecha de una competencia específica (array fijo)
   * @param index - Índice de la competencia (0-4)
   * @param fecha - Nueva fecha (puede ser Event o string)
   */
  actualizarFechaCompetenciaFija(index: number, fecha: any): void {
    let nuevaFecha: string;
    
    if (fecha && typeof fecha === 'object' && fecha.target) {
      // Es un evento
      nuevaFecha = (fecha.target as HTMLInputElement).value;
    } else {
      // Es una fecha directa
      nuevaFecha = String(fecha);
    }

    // if (index >= 0 && index < this.competencias.length) {
    //   this.competencias[index].fecha = nuevaFecha;
    //   console.log(`📅 Fecha competencia ${index + 1}:`, nuevaFecha, this.competencias[index]);
    // }
  }



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
  aprobarEvaluacion(): void {
    console.log('✅ Evaluación aprobada por el administrador');
    // Aquí se implementará la lógica para aprobar la evaluación
    // Por ejemplo, cambiar el estado de la evaluación, enviar notificaciones, etc.
    alert('Evaluación aprobada exitosamente');
  }

  /**
   * Rechaza la evaluación del empleado
   */
  rechazarEvaluacion(): void {
    console.log('❌ Evaluación rechazada por el administrador');
    // Aquí se implementará la lógica para rechazar la evaluación
    // Por ejemplo, solicitar comentarios del rechazo, cambiar estado, etc.
    const motivo = prompt('Ingrese el motivo del rechazo:');
    if (motivo) {
      console.log('Motivo del rechazo:', motivo);
      alert('Evaluación rechazada. Motivo: ' + motivo);
    }
  }
}
