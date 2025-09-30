import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { GthEmpleadoService } from 'src/app/services/gthempleado.service';
import { iGTHEmpleado } from '../../../interface/igth-empleado';
import { GthEvaluacionService } from '../../../services/gth-evaluacion.service';
import { GthObjetivoService } from '../../../services/gth-objetivo.service';
import { IgthObjetivo } from '../../../interface/igth-objetivo';
import { GthCompetenciaService } from '../../../services/gth-competencia.service';
import { IGTHCompetenciaViewModel } from '../../../interface/ight-competencia';

import { alerts } from '../../../helpers/alerts';

// Interface utilizada para almacenar todos los datos necesarios para las competencias
interface NivelConCompetencia {
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
}


@Component({
  selector: 'app-jefe-evaluacion',
  templateUrl: './jefe-evaluacion.component.html',
  styleUrls: ['./jefe-evaluacion.component.css'],
})
export class JefeEvaluacionComponent implements OnInit {

  // Pestaña principal activa
  activeSection: string = 'objetivo';

  // Sub-secciones para "Hoja de Ruta"
  activeTimelineStep: string = 'Captura-Resultados';

  // Sub-secciones para "Evaluación de Colaboradores"
  activeTimelineStepColab: string = 'Revision-Inicial-colab';


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
    },
    {
      number: 2,
      label: 'Retroalimentación',
      completed: false,
      pngIcon: 'assets/img/iconos/iconos mycollection/png/028-grafico.png',
      sectionId: 'Retroalimentacion-colab',
    },
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


  // ================ VERIFICAR SI ESTAMOS EN HOJA DE RUTA ================
  isInHojaRuta(): boolean {
    return this.activeSection === 'hoja-ruta';
  }
  // ================ VERIFICAR SI ESTAMOS EN EVALUACIÓN COLABORADORES ================
  isInEvaluacionColab(): boolean {
    return this.activeSection === 'EvaluacionColab';
  }


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
  objetivosb = [
    {
      id: 1,
      texto: 'Implementar sistema de gestión de documentos',
      valor: 85,
      fecha: '2025-03-15',
      reconsiderar: null as number | null,
      valorAdmin: null as number | null, // Valor asignado por el administrador
      fechaAdmin: '' as string, // Fecha de retroalimentación del admin
    },
    {
      id: 2,
      texto: 'Optimizar rendimiento de aplicaciones existentes',
      valor: 75,
      fecha: '2025-04-20',
      reconsiderar: null as number | null,
      valorAdmin: null as number | null,
      fechaAdmin: '',
    },
    {
      id: 3,
      texto: 'Capacitar al equipo en nuevas tecnologías',
      valor: 90,
      fecha: '2025-05-10',
      reconsiderar: null as number | null,
      valorAdmin: null as number | null,
      fechaAdmin: '',
    },
    {
      id: 4,
      texto: 'Desarrollar módulo de reportes automatizados',
      valor: 60,
      fecha: '2025-06-30',
      reconsiderar: null as number | null,
      valorAdmin: null as number | null,
      fechaAdmin: '',
    },
    {
      id: 5,
      texto: 'Establecer protocolo de respaldo de datos',
      valor: 95,
      fecha: '2025-02-28',
      reconsiderar: null as number | null,
      valorAdmin: null as number | null,
      fechaAdmin: '',
    },
  ];



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







  constructor(
    private gthEmpleadoService: GthEmpleadoService,
    private gthEvaluacionServcie: GthEvaluacionService,
    private gthObjetivoService: GthObjetivoService,
    private gthCompetenciaService: GthCompetenciaService
  ) {}

  ngOnInit(): void {
    this.cargarDatosEmpleado();

    // Inicializar los 5 objetivos
    this.objetivosIndividuales = [
      { titulo: '', valoracionEmpleado: null, fechaLimite: '' },
      { titulo: '', valoracionEmpleado: null, fechaLimite: '' },
      { titulo: '', valoracionEmpleado: null, fechaLimite: '' },
      { titulo: '', valoracionEmpleado: null, fechaLimite: '' },
      { titulo: '', valoracionEmpleado: null, fechaLimite: '' }
    ];

    this.cargarEvaluaciones();

    this.cargarCompetenciasAdmin();
  }


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
                                        idCompetencia: nivel.idCompetencia,
                                        nivel: nivel.nivel,
                                        descripcion: nivel.descripcion,
                                        nombreCompetencia:
                                          competencia.nombreCompetencia,
                                        tipoCompetencia:
                                          competencia.tipoCompetencia,
                                        valor: 0,
                                        fecha: '',
                                        reconsiderar: 0,
                                        calificacion: 0,
                                        calificacionFinal: 0,
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

// guardarObjetivosIndividuales(): void {
//   const objetivosVacios = this.objetivosIndividuales.filter(obj => !obj.titulo?.trim());
  
//   if (objetivosVacios.length > 0) {
//     alert(`Por favor complete todos los objetivos. Faltan ${objetivosVacios.length} objetivo(s).`);
//     return;
//   }

//   if (!this.idCelulaActual) {
//     alert('No se encontró el ID de la célula.');
//     return;
//   }

//   const idEmpleado = this.gthEmpleadoService.obtenerIdGthEmpleadoDesdeSession();
  
//   if (idEmpleado) {
//     this.idEmpleadoActual = 2;
//     const anio = 2026;
    
//     this.gthEvaluacionServcie
//       .MostrarEvaluacionesPorEmpleadoyAnio(this.idEmpleadoActual, anio)
//       .subscribe({
//         next: (response: any) => {
//           let evaluacionesData = response;
//           if (response && response.$values) {
//             evaluacionesData = response.$values;
//           }
          
//           if (evaluacionesData && evaluacionesData.length > 0) {
//             const idEvaluacion = evaluacionesData[0].idEvaluacion;
            
//             const promesasGuardado = this.objetivosIndividuales.map(objetivo => {
//               const nuevoObjetivo: IgthObjetivo = {
//                 tipo: 1,
//                 idEvaluacion: idEvaluacion,
//                 titulo: objetivo.titulo!.trim(), // ⭐ Agregar ! para aserción no-nula
//                 descripcion: objetivo.descripcion?.trim() || objetivo.titulo!.trim(), // ⭐ Agregar !
//                 tipoObjetivo: 'INDIVIDUAL',
//                 peso: 1.00,
//                 estado: 'ACTIVO',
//                 valoracionEmpleado: objetivo.valoracionEmpleado || null,
//                 valoracionJefe: null,
//                 calificacionFinal: null,
//                 fechaLimite: objetivo.fechaLimite || undefined
//               };
              
//               return this.gthObjetivoService.gestionarObjetivo(nuevoObjetivo).toPromise();
//             });

//             Promise.all(promesasGuardado)
//               .then((responses) => {
//                 console.log('Todos los objetivos guardados:', responses);
//                 alert('Los 5 objetivos individuales se guardaron correctamente.');
//               })
//               .catch((error) => {
//                 console.error('Error al guardar objetivos:', error);
//                 alert('Error al guardar algunos objetivos. Revise la consola.');
//               });
//           }
//         }
//       });
//   }
// }


/*--------------------------------------------------------------------------
            Función GENÉRICA para guardar Objetivos (AREA o INDIVIDUAL)
---------------------------------------------------------------------------*/
// guardarObjetivo(tipoObjetivo: string): void {
//   // Validar que el texto no esté vacío
//   if (!this.objetivoTexto || this.objetivoTexto.trim() === '') {
//     console.log('❌ VALIDACIÓN FALLIDA: Texto vacío');
//     alerts.info(`Por favor ingrese el objetivo antes de guardar.`);
//     return;
//   }

//   const idEmpleado = this.gthEmpleadoService.obtenerIdGthEmpleadoDesdeSession();
  
//   if (idEmpleado) {
//     this.idEmpleadoActual = 2; // pruebas
//     const anio = 2026; //modificar
    
//     this.gthEvaluacionServcie
//       .MostrarEvaluacionesPorEmpleadoyAnio(this.idEmpleadoActual, anio)
//       .subscribe({
//         next: (response: any) => {
          
//           let evaluacionesData = response;
//           if (response && response.$values) {
//             evaluacionesData = response.$values;
//           }
          
//           if (evaluacionesData && evaluacionesData.length > 0) {
//             const idEvaluacion = evaluacionesData[0].idEvaluacion;
//             console.log('✅ ID Evaluación encontrado:', idEvaluacion);
            
//             // Crear el objetivo (genérico) - CORREGIDO CON NULL
//             const nuevoObjetivo: IgthObjetivo = {
//               tipo: 1,                              // 1 = Insertar
//               idEvaluacion: idEvaluacion,           // ID de la evaluación
//               titulo: this.objetivoTexto.trim(),    // Título del objetivo
//               descripcion: this.objetivoTexto.trim(), // Descripción (mismo texto)
//               tipoObjetivo: tipoObjetivo,           // AREA o INDIVIDUAL (parámetro)
//               peso: 1.00,                           // Peso por defecto
//               estado: 'ACTIVO',                     // Estado activo
//               valoracionEmpleado: null,             // CAMBIADO: NULL en lugar de 0
//               valoracionJefe: null,                 // CAMBIADO: NULL en lugar de 0
//               calificacionFinal: null               // CAMBIADO: NULL en lugar de 0
//             };
            
//             // Enviar al servicio
//             this.gthObjetivoService.gestionarObjetivo(nuevoObjetivo)
//               .subscribe({
//                 next: (response: any) => {
                  
//                   // Verificar si hay errores en la respuesta
//                   if (response && response.$values && response.$values.length > 0) {
//                     const resultado = response.$values[0];
                    
//                     if (resultado.valor1 && resultado.valor1 > 0) {
//                       alerts.exito(`Objetivo guardado correctamente.`);
//                       // this.objetivoTexto = '';
//                     } else {
//                       console.error(`❌ ERROR del Stored Procedure:`, resultado.valor2);
//                     }
//                   } else {
//                     alerts.exito(`Objetivo guardado correctamente.`);
//                     // this.objetivoTexto = '';
//                   }
//                 },
//                 error: (error) => {
//                   console.error(`❌ ERROR HTTP del servicio:`, error);
//                 }
//               });
              
//           } else {
//             console.log('❌ NO se encontraron evaluaciones');
//           }
//         },
//         error: (error) => {
//           alerts.error('Error al obtener la evaluación.');
//         }
//       });
//   } else {
//     alerts.error('No se pudo obtener la información del empleado.');
//   }
// }


  actualizarValorCompetenciaFija(index: number, valor: any): void {}

  actualizarFechaCompetenciaFija(index: number, valor: any): void {}







  /**
   * Carga las primeras 5 competencias desde el backend para la vista administrativa
   */
  cargarCompetenciasAdmin(): void {
    console.log('🚀 Iniciando carga de competencias para administrador...');
    this.loadingCompetencies = true;

    this.gthCompetenciaService.obtenerPrimeras5Competencias().subscribe({
      next: (competencias: IGTHCompetenciaViewModel[]) => {

        this.competencies = competencias;
        this.loadingCompetencies = false;

      },
      error: (error) => {
        this.loadingCompetencies = false;
        this.competencies = [];
      },
    });
  }

  /**
   * Actualiza el texto del objetivo por parte del administrador
   * @param index - Índice del objetivo (0-4)
   * @param texto - Nuevo texto del objetivo
   */
  actualizarTextoObjetivoAdmin(index: number, texto: string): void {
    if (index >= 0 && index < this.objetivosb.length) {
      this.objetivosb[index].texto = texto;
    }
  }

  /**
   * Actualiza el valor de "reconsiderar" asignado por el administrador
   * @param index - Índice del objetivo (0-4)
   * @param valor - Valor de reconsideración asignado por el admin
   */
  actualizarReconsiderarAdmin(index: number, valor: number): void {
    if (index >= 0 && index < this.objetivosb.length) {
      if (!isNaN(valor) && valor >= 0 && valor <= 100) {
        this.objetivosb[index].reconsiderar = valor;
      }
    }
  }

  /**
   * Actualiza el valor asignado por el administrador
   * @param index - Índice del objetivo (0-4)
   * @param valor - Valor asignado por el admin
   */
  actualizarValorAdmin(index: number, valor: number): void {
    if (index >= 0 && index < this.objetivosb.length) {
      if (!isNaN(valor) && valor >= 0 && valor <= 100) {
        this.objetivosb[index].valorAdmin = valor;
      }
    }
  }

  /**
   * Actualiza la fecha de retroalimentación asignada por el administrador
   * @param index - Índice del objetivo (0-4)
   * @param fecha - Fecha de retroalimentación
   */
  actualizarFechaAdmin(index: number, fecha: string): void {
    if (index >= 0 && index < this.objetivosb.length) {
      this.objetivosb[index].fechaAdmin = fecha;
    }
  }

  /**
   * Calcula el porcentaje promedio basado en las evaluaciones del empleado
   * @returns Porcentaje promedio de los objetivos del empleado
   */
  calcularPorcentajeEmpleado(): number {
    const objetivosConValor = this.objetivosb.filter(
      (obj) => obj.valor !== null && obj.valor > 0
    );
    if (objetivosConValor.length === 0) return 0;

    const suma = objetivosConValor.reduce((acc, obj) => acc + obj.valor, 0);
    const promedio = suma / objetivosConValor.length;

    return Math.round(promedio);
  }

  /**
   * Calcula el porcentaje promedio basado en las evaluaciones del administrador
   * @returns Porcentaje promedio de la evaluación administrativa
   */
  calcularPorcentajeAdmin(): number {
    const objetivosConValorAdmin = this.objetivosb.filter(
      (obj) => obj.valorAdmin !== null && obj.valorAdmin > 0
    );
    if (objetivosConValorAdmin.length === 0) return 0;

    const suma = objetivosConValorAdmin.reduce(
      (acc, obj) => acc + (obj.valorAdmin || 0),
      0
    );
    const promedio = suma / objetivosConValorAdmin.length;

    return Math.round(promedio);
  }

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
      this.activeTimelineStepColab = 'Revision-Inicial-colab';
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
