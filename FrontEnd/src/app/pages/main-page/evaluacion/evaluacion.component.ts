import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';

import { GthCompetenciaService } from 'src/app/services/gth-competencia.service';
import { IGTHCompetenciaViewModel,
  IGTHAsignacionCompetenciaViewModel
 } from 'src/app/interface/ight-competencia';

import { GthEmpleadoService } from 'src/app/services/gthempleado.service';
import { iGTHEmpleado } from '../../../interface/igth-empleado';
import { IgthObjetivo } from '../../../interface/igth-objetivo';
import { GthObjetivoService } from '../../../services/gth-objetivo.service';

import { GthEvaluacionService } from '../../../services/gth-evaluacion.service';
import { Ievaluacion } from '../../../interface/ievaluacion';

import { alerts } from '../../../helpers/alerts';


// Interface utilizada para almacenar todos los datos necesarios
interface NivelConCompetencia {
  idAsignacionCompetencia: number;
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
  selector: 'app-evaluacion',
  templateUrl: './evaluacion.component.html',
  styleUrls: ['./evaluacion.component.css']
})
export class EvaluacionComponent implements OnInit {

  constructor(
    private gthEmpleadoService:GthEmpleadoService,
    private gthEvaluacionServcie: GthEvaluacionService,
    private gthObjetivoService: GthObjetivoService,
    private gthCompetenciaService: GthCompetenciaService) {       
  }

  ngOnInit(): void {

    this.cargarDatosEmpleado();

    // Inicializar los 5 objetivos
    this.objetivosIndividuales = [
      { titulo: '', valoracionEmpleado: null, fechaLimite: '', calificacionPonderada: null },
      { titulo: '', valoracionEmpleado: null, fechaLimite: '', calificacionPonderada: null },
      { titulo: '', valoracionEmpleado: null, fechaLimite: '', calificacionPonderada: null },
      { titulo: '', valoracionEmpleado: null, fechaLimite: '', calificacionPonderada: null },
      { titulo: '', valoracionEmpleado: null, fechaLimite: '', calificacionPonderada: null }
    ];

    // Obtener fase actual de la evaluación
    this.obtenerFaseActual();

    this.cargarEvaluaciones();

  }

  

  // Variable para almacenar la información del empleado
  empleado: iGTHEmpleado | null = null;
  cedulaEmpleado: string = ''; // Cambia esto por la cédula real del empleado}

  archivoSeleccionado: File | null = null;
  idEmpleadoActual: number | null = null;
  subiendoFoto: boolean = false;

  // Agregar esta variable a tu componente
  idCelulaActual: number | null = null;   

  // Fase actual de evaluacion
  faseEvaluacion: number | null = null;   

  // Variable para controlar la fase actual
  // faseActual: number = 1; 

  /* -------------  Campos para mostrar en el HTML  ----------  */
  // Variables para mostrar la información (solo lectura)

  fotoPerfilUrl: string = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'; // Imagen por defecto
  fotoPerfilUrlDisplay: string = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

  nombreCompletoDisplay: string = ''; 
  correoElectronicoDisplay: string = ''; 
  posicionDisplay: string = ''; 


  //----------------------Codigo para mostrar las secciones segun a FASE --------------------------------

  // Variable para el menú principal
  activeSection: string = 'hoja-ruta'; 

  // Fase actual (esto vendrá del backend)
  // currentPhase: number = 1; 

  // Lista de pasos (sin isActive ni completed, se calculan dinámicamente)
//   steps = [
//   { label: 'Captura de Resultados', sectionId: 'Captura-Resultados', phase: 0 },
//   { label: 'Revisión Inicial', sectionId: 'Revision-Inicial', phase: 1 },
//   { label: 'Evaluación Intermedia', sectionId: 'Evaluacion-Intermedia', phase: 2 },
//   { label: 'Retroalimentación', sectionId: 'Retroalimentacion', phase: 4 },
//   { label: 'Cierre', sectionId: 'Cierre', phase: 5 }
// ];

//   // Solo para desarrollo (simular cambio de step)
//   onStepClick(step: any): void {
//     if (this.activeSection === 'hoja-ruta') {
//       // this.currentPhase = step.phase;  // ✅ Usa step.phase
//       // this.faseEvaluacion = step.phase; 

//       // Actualizar visualmente el timeline
//       // this.actualizarTimelinePorFase(this.currentPhase);
//       this.actualizarTimelinePorFase(this.faseEvaluacion!);
      
//       console.log('✅ Navegando a fase:', step.phase, '-', step.sectionId);
//     }
//   }  

  //------------------------------------------------------------------------------------------------------



  // Objetivo de area para todos los formularios de Empleado
  objetivoAreaDisplay: string = '';

  // Objetivos individuales
  objetivosIndividuales: IgthObjetivo[] = [];

  // declara la propiedad global del componente
  nivelesCompetencias: NivelConCompetencia[] = [];

  // En la clase del componente, agrega estas propiedades
    fechaRegObj: string = '';
    retroalimentacion: string = '';
    planAccion: string = '';
  

  // Employee Information
  employee = {
  };

  //---------------------------   --------  BORRAR  ---- -----------------------  
  // Collaborator Information
  collaboratorInfo = {
    firstName: 'Juan Carlos',
    lastName: 'Rodríguez Martínez',
    position: 'Analista de Sistemas',
    supervisor: 'María Sánchez',
    startDate: '01/01/2020',
    department: 'Tecnología de la Información'
  };

  // Review Dates
  reviewDates = {
    evaluator: 'María Sánchez',
    period: 'Enero - Junio 2025',
    deadline: '30/06/2025'
  };

  //---------------------------------------------------------------------------------



timelineSteps = [
  { 
    number: 1, 
    label: 'Captura de Resultados', 
    completed: false, 
    icon: 'fas fa-check',  // ✅ Ya lo tiene
    pngIcon: 'assets/img/iconos/iconos mycollection/png/062-reloj-de-arena.png',
    sectionId: 'Captura-Resultados',
    isActive: false,
    phase: 0  
  },
  { 
    number: 2, 
    label: 'Revisión Inicial', 
    completed: false,
    icon: 'fas fa-check',  // ✅ AGREGAR ESTO
    pngIcon: 'assets/img/iconos/iconos mycollection/png/035-retroalimentacion-7.png',
    sectionId: 'Revision-Inicial',
    isActive: false,
    phase: 6 
  },
  { 
    number: 3, 
    label: 'Evaluación Intermedia', 
    completed: false,
    icon: 'fas fa-check',  // ✅ AGREGAR ESTO
    pngIcon: 'assets/img/iconos/iconos mycollection/png/051-lista-de-verificacion.png',
    sectionId: 'Evaluacion-Intermedia',
    isActive: false,
    phase: 2  
  },
  { 
    number: 4, 
    label: 'Retroalimentación', 
    completed: false,
    icon: 'fas fa-check',  // ✅ AGREGAR ESTO
    pngIcon: 'assets/img/iconos/iconos mycollection/png/028-grafico.png',
    sectionId: 'Retroalimentacion',
    isActive: false,
    phase: 4  
  },
  { 
    number: 5, 
    label: 'Cierre', 
    completed: false,
    icon: 'fas fa-check',  // ✅ AGREGAR ESTO
    pngIcon: 'assets/img/iconos/iconos mycollection/png/056-alcanzando-objetivos.png',
    sectionId: 'Cierre',
    isActive: false,
    phase: 5  
  }
];


  // Método para cambiar la sección activa
  onStepKeyDown(event: KeyboardEvent, step: any): void {
  // Activar con Enter o Espacio
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault(); // Prevenir scroll con espacio
    // this.onStepClick(step);
  }
}




/*=======================================================================================
                            fUNCIONES PARA CARGAR INFO DE COLABORADOR
=========================================================================================*/

cargarDatosEmpleado(): void {

  // console.log('Iniciando proceso de carga de informacion');
    // Obtener ID del empleado del sessionStorage
    const idEmpleado = this.gthEmpleadoService.obtenerIdGthEmpleadoDesdeSession();
    
    if (idEmpleado) {
      this.idEmpleadoActual = idEmpleado;
      this.buscarEmpleadoPorId(2); //Probando
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
    case 4:
      maxPaso = 4; // hasta Retroalimentación
      break;
    case 5:
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

  obtenerFechaActual(): string {
    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = String(hoy.getMonth() + 1).padStart(2, '0');
    const day = String(hoy.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


/*=======================================================================================
                            fUNCIONES PARA CARGAR INFO DE EVALUACION
=========================================================================================*/

  cargarEvaluaciones(): void {
    const idEmpleado = this.gthEmpleadoService.obtenerIdGthEmpleadoDesdeSession();

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
              const idEvaluacion = evaluacionesData[0].idEvaluacion;
              const retro = evaluacionesData[0].retroalimentacion || null;
              const plan = evaluacionesData[0].planAccion || null;
              const fechaRegObjetivos = evaluacionesData[0].fechaRegObj || null;

              
              this.retroalimentacion = retro;
              this.planAccion = plan;

              if(this.faseEvaluacion! == 0){
                this.fechaRegObj = this.obtenerFechaActual();
              } else {
                this.fechaRegObj = fechaRegObjetivos;
              }
              // this.faseEvaluacion = evaluacionesData[0].fase;
              // console.log('fase que llega de la evaluacion', this.faseEvaluacion);

              // Usamos el id de la evaluacion para saber que objetivos tiene
              this.cargarObjetivosPorFase(this.faseEvaluacion!, idEvaluacion);

              if (this.idCelulaActual){
                this.cargarObjetivoExistente();  //Traemos el Objetivo de AREA
              }

              // inicializamos la colección
              this.nivelesCompetencias = [];

              // Obtenemos las competencias Asiganadas a esa evaluacion
              this.gthCompetenciaService
                .obtenerAsignacionCompetenciaPorIdEvaluacion(idEvaluacion)
                .subscribe({
                  next: (respAsigCompetencias: any) => {
                    // console.log('\n📦 COMPONENTE - Respuesta recibida:', respAsigCompetencias);
                    // console.log('📦 COMPONENTE - Tiene $values?:', !!respAsigCompetencias?.$values);

                    let asignacionesCompetenciasData = respAsigCompetencias;
                    if (respAsigCompetencias && respAsigCompetencias.$values) {
                      asignacionesCompetenciasData = respAsigCompetencias.$values;
                      // console.log('✅ Usando $values');
                    }                           

                    asignacionesCompetenciasData.forEach((competencia: any) => {
                      const idAsignacionCompetencia = competencia.idAsignacion;
                      const idNivelCompetencia = competencia.idNivelCompetencia;
                      
                      // ✅ Usar camelCase y manejar null
                      // const valoracionExistente = competencia.valoracionEmpleado || null;                      
                      const valoracionJefe = competencia.valoracionJefe || null;
                      const califEmpleado = competencia.calificacionEmpleado || null;
                      const califFinal = competencia.calificacionFinal || null;
                      const fechaExistente = competencia.fechaLimite 
                        ? new Date(competencia.fechaLimite).toISOString().split('T')[0] 
                        : '';

                      // Buscamos los datos de esa competencia Asignada ya que solo sabemos el id 
                      this.gthCompetenciaService
                        .mostrarNivelCompetencias(1, idNivelCompetencia)
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
                                      const competencia = competenciaData[0];
                                      
                                      const combinado: NivelConCompetencia = {
                                        idAsignacionCompetencia: idAsignacionCompetencia,
                                        idCompetencia: nivel.idCompetencia,
                                        nivel: nivel.nivel,
                                        descripcion: nivel.descripcion,
                                        nombreCompetencia: competencia.nombreCompetencia,
                                        tipoCompetencia: competencia.tipoCompetencia,
                                        // ValoracionEmpleado: valoracionExistente,
                                        FechaLimite: fechaExistente, // String en formato YYYY-MM-DD
                                        ValoracionJefe: valoracionJefe,
                                        CalificacionEmpleado: califEmpleado,
                                        CalificacionFinal: califFinal                                        
                                      };
                                      
                                      this.nivelesCompetencias.push(combinado);
                                      console.log('✅ Competencia agregada:', combinado);
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

/*--Ojo-----Buscamos si tenemos un Objetivo de AREA  ----------------------------*/
  cargarObjetivoExistente(): void {
    if (!this.idCelulaActual) return;

    // Si se elimina esta impresion no funciona el objetivo de area(REVISAR)
    // console.log('Id de la celula:------->', this.idCelulaActual );


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
            this.objetivoAreaDisplay = objetivo;
            // this.objetivoExistente = objetivo.trim() !== '';          
            
          } else {
            // No se encontraron datos
            // this.objetivoExistente = false;
          }
        },
        error: () => {
          // Error al cargar
          // this.objetivoExistente = false;
        }
      });
  }




  // Objectives (KPIs)
  objectives = [
    {
      name: 'Entrega de Proyectos',
      weight: '40%',
      startDate: '01/01/2025',
      endDate: '30/06/2025',
      description: 'Completar entregables en tiempo y forma.'
    },
    {
      name: 'Reducción de Errores',
      weight: '30%',
      startDate: '01/01/2025',
      endDate: '30/06/2025',
      description: 'Reducir errores de software en un 20%.'
    }
  ];

  // Variable para controlar el estado de carga
  loadingCompetencies: boolean = false;

  // Inicializamos los espacios para los Objetivos del empleado - se mantienen en memoria durante la sesión
  objetivos = [
    {
      id: 1,
      texto: '',
      valor: null as number | null,
      fecha: '',
      reconsiderar: null as number | null,
      calificacionFinal: null as number | null,
      isEditing: false
    },
    {
      id: 2,
      texto: '',
      valor: null as number | null,
      fecha: '',
      reconsiderar: null as number | null,
      calificacionFinal: null as number | null,
      isEditing: false
    },
    {
      id: 3,
      texto: '',
      valor: null as number | null,
      fecha: '',
      reconsiderar: null as number | null,
      calificacionFinal: null as number | null,
      isEditing: false
    },
    {
      id: 4,
      texto: '',
      valor: null as number | null,
      fecha: '',
      reconsiderar: null as number | null,
      calificacionFinal: null as number | null,
      isEditing: false
    },
    {
      id: 5,
      texto: '',
      valor: null as number | null,
      fecha: '',
      reconsiderar: null as number | null,
      calificacionFinal: null as number | null,
      isEditing: false
    }
  ];

  guardarDatosEvaluacion(): void {
    let fase = this.faseEvaluacion!;
    console.log('fase de guardado', fase);

    // CASO ESPECIAL: FASE 6 - Solo actualizar evaluación
    if (fase === 6) {
      console.log('⏭️ Fase 6 detectada - Solo actualizando evaluación a fase 2');
      
      const anio = 2025;
      
      this.gthEvaluacionServcie
        .MostrarEvaluacionesPorEmpleadoyAnio(this.idEmpleadoActual!, anio)
        .subscribe({
          next: (response: any) => {
            let evaluacionesData = response?.$values || response;
            
            if (evaluacionesData && evaluacionesData.length > 0) {
              const idEvaluacion = evaluacionesData[0].idEvaluacion;
              console.log('ID Evaluación:', idEvaluacion);
              
              // Ir directo a actualizar evaluación
              this.actualizarEvaluacionFinal(fase, idEvaluacion, anio);
            } else {
              alerts.error('No se encontró la evaluación.');
            }
          },
          error: (error) => {
            console.error('❌ Error al obtener evaluación:', error);
            alerts.error('Error al obtener la evaluación.');
          }
        });
      
      return; // Salir aquí, ya se actualizó la evaluación
    }

    // VALIDACIÓN 1: Objetivos completos (según la fase)
    let objetivosVacios;
    
    if (fase === 0) {
      objetivosVacios = this.objetivosIndividuales.filter(obj => 
        !obj.titulo?.trim()
      );
    } else if (fase === 1) {
      objetivosVacios = this.objetivosIndividuales.filter(obj => 
        !obj.titulo?.trim() || obj.valoracionEmpleado == null || !obj.fechaLimite
      );
    } else if (fase === 2) {
      objetivosVacios = this.objetivosIndividuales.filter(obj => 
        obj.calificacionEmpleado == null
      );
    }
    // } else if (fase === 4) {
    //   objetivosVacios = this.objetivosIndividuales.filter(obj => 
    //     obj.calificacionFinal == null
    //   );
    // }

    if (objetivosVacios && objetivosVacios.length > 0) {
      alert(`Complete todos los objetivos. Faltan ${objetivosVacios.length} objetivo(s).`);
      return;
    }

    // VALIDACIÓN 2: Competencias completas (según la fase)
    let competenciasIncompletas;
    
    if (fase === 1) {
      competenciasIncompletas = this.nivelesCompetencias.filter(comp => 
        comp.ValoracionEmpleado == null || !comp.FechaLimite
      );
    } else if (fase === 2) {
      competenciasIncompletas = this.nivelesCompetencias.filter(comp => 
        comp.CalificacionEmpleado == null
      );
    }
    // } else if (fase === 4) {
    //   competenciasIncompletas = this.nivelesCompetencias.filter(comp => 
    //     comp.CalificacionFinal == null
    //   );
    // }

    if (competenciasIncompletas && competenciasIncompletas.length > 0) {
      console.warn('❌ Competencias incompletas:', competenciasIncompletas);
      alert(`Complete todas las competencias. Faltan ${competenciasIncompletas.length} competencia(s).`);
      return;
    }

    // VALIDACIÓN 3: Empleado existe
    if (!this.idEmpleadoActual) {
      alert('No se encontró el ID del empleado.');
      return;
    }

    // Si todas las validaciones pasan, continuar con el guardado...
    const anio = 2025;

    this.gthEvaluacionServcie
    .MostrarEvaluacionesPorEmpleadoyAnio(this.idEmpleadoActual, anio)
    .subscribe({
      next: (response: any) => {
        let evaluacionesData = response?.$values || response;
        
        if (evaluacionesData && evaluacionesData.length > 0) {
          const idEvaluacion = evaluacionesData[0].idEvaluacion;
          console.log('ID Evaluación:', idEvaluacion);
          
          // ✅ SI ES FASE 6, SALTAR GUARDADO DE OBJETIVOS
          if (fase === 6) {
            console.log('⏭️ Fase 6 detectada - Saltando guardado de objetivos');
            // Aquí puedes continuar con el guardado de la evaluación directamente
            // O simplemente retornar si no hay nada más que hacer
            return; // O continuar al siguiente paso
          }
          
          // PASO 1: Guardar objetivos (solo si NO es fase 6)
          const promesasObjetivos = this.objetivosIndividuales.map((objetivo, index) => {
            const tipoOperacion = objetivo.idObjetivo ? 2 : 1;
            let objetivoData: IgthObjetivo | null = null;
            
            const tipoObjetivo = index === 0 ? 'AREA' : 'INDIVIDUAL';

            switch (fase) {              
              case 0:                    
                objetivoData = {
                  tipo: tipoOperacion,
                  idObjetivo: objetivo.idObjetivo,
                  idEvaluacion: idEvaluacion,
                  titulo: objetivo.titulo!.trim(),
                  tipoObjetivo: tipoObjetivo,
                  estado: 'ACTIVO'
                };
                break;
              
              case 2: // Calificación empleado
                if (!objetivo.idObjetivo || objetivo.calificacionEmpleado == null) {
                  console.warn('⚠️ Objetivo sin ID o sin calificación empleado:', objetivo);
                  return null;
                }
                objetivoData = {
                  tipo: 2,
                  idObjetivo: objetivo.idObjetivo,
                  calificacionEmpleado: objetivo.calificacionEmpleado,
                  tipoObjetivo: tipoObjetivo,
                  peso: index === 0 ? 22 : 12   
                };
                break;
                
              default:
                console.error('❌ Fase no reconocida:', fase);
                return null;
            }
            
            if (!objetivoData) return null;
            
            console.log(`${tipoOperacion === 1 ? 'Creando' : 'Actualizando'} objetivo ${index + 1}:`, objetivoData);
            return this.gthObjetivoService.gestionarObjetivo(objetivoData).toPromise();
          }).filter(promesa => promesa !== null);
          
          if (promesasObjetivos.length === 0) {
            alert('No hay objetivos válidos para guardar.');
            return;
          }       
        
          
          // EJECUTAR: Objetivos → Competencias → Evaluación
          Promise.all(promesasObjetivos)
            .then((responsesObjetivos) => {
              console.log('✅ Objetivos guardados:', responsesObjetivos);
              
              const hayErroresObjetivos = responsesObjetivos.some((resp: any) => {
                const resultado = resp?.$values?.[0] || resp?.[0] || resp;
                return resultado?.valor1 < 0;
              });
              
              if (hayErroresObjetivos) {
                alert('Error al guardar objetivos. Revise la consola.');
                return;              }
              

              const promesasCompetencias = this.nivelesCompetencias.map((competencia, index) => {
                console.log(`\n--- Procesando competencia ${index + 1} ---`);
                console.log('Datos originales:', competencia);
                
                let competenciaData: IGTHAsignacionCompetenciaViewModel | null = null;
                
                switch (fase) {
                  case 0: // Captura inicial                    
                    competenciaData = {
                      Tipo: 2,
                      IdAsignacion: competencia.idAsignacionCompetencia                      
                    };
                    break;
                  
                  case 2: // Calificación empleado
                    if (!competencia.idAsignacionCompetencia || competencia.CalificacionEmpleado == null) {
                      console.warn('⚠️ Competencia sin ID o sin calificación empleado:', competencia);
                      return null;
                    }
                    
                    competenciaData = {
                      Tipo: 2,
                      IdAsignacion: competencia.idAsignacionCompetencia,
                      CalificacionEmpleado: competencia.CalificacionEmpleado
                    };
                    break;
                  
                  // case 4: // Calificación final
                  //   if (!competencia.idAsignacionCompetencia || competencia.CalificacionFinal == null) {
                  //     console.warn('⚠️ Competencia sin ID o sin calificación final:', competencia);
                  //     return null;
                  //   }
                    
                  //   competenciaData = {
                  //     Tipo: 2,
                  //     IdAsignacion: competencia.idAsignacionCompetencia,
                  //     CalificacionFinal: competencia.CalificacionFinal
                  //   };
                  //   break;
                  
                  default:
                    console.error('❌ Fase no reconocida para competencias:', fase);
                    return null;
                }
                
                if (!competenciaData) {
                  console.warn(`❌ Competencia ${index + 1} omitida (sin datos)`);
                  return null;
                }
                
                return this.gthCompetenciaService.gestionarAsignacionCompetencia(competenciaData).toPromise();
              }).filter(promesa => promesa !== null);

              console.log('\n📊 Total de competencias a guardar:', promesasCompetencias.length);

              if (promesasCompetencias.length === 0) {
                console.warn('⚠️ No hay competencias para actualizar, saltando a evaluación');
                this.actualizarEvaluacionFinal(fase, idEvaluacion, anio);
                return;
              }

              Promise.all(promesasCompetencias)
                .then((responsesCompetencias) => {
                  console.log('\n=== RESPUESTAS DE COMPETENCIAS ===');
                  console.log('Todas las respuestas:', responsesCompetencias);
                  
                  responsesCompetencias.forEach((resp, idx) => {
                    const resultado = resp?.$values?.[0] || resp?.[0] || resp;
                    console.log(`Competencia ${idx + 1} - Código: ${resultado?.valor1}, Mensaje: ${resultado?.valor2}`);
                    
                    if (resultado?.valor1 < 0) {
                      console.error(`❌ ERROR en competencia ${idx + 1}:`, resultado.valor2);
                    }
                  });
                  
                  const hayErroresCompetencias = responsesCompetencias.some((resp: any) => {
                    const resultado = resp?.$values?.[0] || resp?.[0] || resp;
                    return resultado?.valor1 < 0;
                  });
                  
                  if (hayErroresCompetencias) {
                    alert('Error al guardar competencias. Revise la consola.');
                    return;
                  }
                  
                  console.log('✅ Todas las competencias guardadas correctamente');
                  
                  // PASO 3: Actualizar evaluación
                  this.actualizarEvaluacionFinal(fase, idEvaluacion, anio);
                })
                .catch((error) => {
                  console.error('❌ ERROR CRÍTICO al guardar competencias:', error);
                  console.error('Detalles del error:', JSON.stringify(error, null, 2));
                  alert('Objetivos guardados, pero error al guardar competencias. Revise la consola.');
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
  private actualizarEvaluacionFinal(fase: number, idEvaluacion: number, anio: number): void {
    let evaluacionActualizada: Ievaluacion | null = null;
    
    if (fase === 0) {
      evaluacionActualizada = {
        tipo: 2,
        idEmpleado: this.idEmpleadoActual!,
        idEvaluacion: idEvaluacion,
        anio: anio,
        estado: 'EN PROCESO',
        fase: 1,
        fechaRegObj: this.fechaRegObj, // ← Agregar la fecha actual
        fechaInicio: this.fechaRegObj // ← Agregar la fecha actual
      };
    } else if (fase === 6) {
      evaluacionActualizada = {
        tipo: 2,
        idEmpleado: this.idEmpleadoActual!,
        idEvaluacion: idEvaluacion,
        estado: 'EN PROCESO',
        fase: 2
      };
    } else if (fase === 2) {
      evaluacionActualizada = {
        tipo: 2,
        idEmpleado: this.idEmpleadoActual!,
        idEvaluacion: idEvaluacion,
        estado: 'EN PROCESO',
        fase: 3,
        fechaAutoevaluacion: this.obtenerFechaActual()        
      };
      console.log('❌ EffeeechAA:', this.obtenerFechaActual());
    }
    
    if (evaluacionActualizada) {
      this.gthEvaluacionServcie.actualizarGthEvaluacion(evaluacionActualizada).subscribe({
        next: (resp) => {
          console.log('✅ Evaluación actualizada a fase:', evaluacionActualizada!.fase);
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
      case 1: return '⭐';
      case 2: return '⭐⭐';
      case 3: return '⭐⭐⭐';
      case 4: return '⭐⭐⭐⭐';
      default: return 'N/A';
    }
  }



/**
 * Carga objetivos existentes según la fase
 */
cargarObjetivosPorFase(fase: number, idEvaluacion: number): void {
  console.log('=== CARGANDO OBJETIVOS - FASE:', fase, '===');
  
  this.gthObjetivoService.obtenerObjetivosPorIdEvaluacion(idEvaluacion)
  .subscribe({
    next: (objetivosResponse: any) => {
      const objetivosExistentes = objetivosResponse?.$values || objetivosResponse || [];
      
      // QUITAR EL FILTRO - Traer todos los objetivos (AREA e INDIVIDUAL)
      const todosLosObjetivos = Array.isArray(objetivosExistentes) 
          ? objetivosExistentes 
          : [];
      
      console.log('Todos los objetivos encontrados:', todosLosObjetivos);
      
      if (todosLosObjetivos.length > 0) {
        this.mapearObjetivosSegunFase(todosLosObjetivos, fase);
      } else {
        console.log('No hay objetivos existentes');
        this.inicializarObjetivosVacios();
      }
    },
    error: (error) => {
      console.error('Error al cargar objetivos:', error);
      this.inicializarObjetivosVacios();
    }
  });
}

/**
 * Mapea objetivos según la fase
 */
mapearObjetivosSegunFase(objetivos: any[], fase: number): void {
  console.log('Mapeando objetivos para fase:', fase);
  console.log('Objetivos recibidos de BD:', objetivos);
  
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
      const obj = objetivosOrdenados[i];
      
      // Formatear fecha
      let fechaFormateada = '';
      if (obj.fechaLimite || obj.fecha_limite) {
        const fecha = new Date(obj.fechaLimite || obj.fecha_limite);
        fechaFormateada = fecha.toISOString().split('T')[0];
      }
      
      // Obtener tipo
      const tipoObjetivo = (obj.tipoObjetivo || obj.tipo_objetivo || 'INDIVIDUAL').toUpperCase();
      
      console.log(`Mapeando posición ${i}: ID=${obj.idObjetivo}, Tipo=${tipoObjetivo}, Título=${obj.titulo}`);
      
      // Mapear según fase
      if (fase === 0) {
        this.objetivosIndividuales[i] = {
          idObjetivo: obj.idObjetivo || obj.id_objetivo,
          titulo: obj.titulo,
          tipoObjetivo: tipoObjetivo
        };
      }    else if (fase === 6) {
        // Fase 1: titulo, valoracionEmpleado, valoracionJefe, fechaLimite
        this.objetivosIndividuales[i] = {
          idObjetivo: obj.idObjetivo || obj.id_objetivo,
          titulo: obj.titulo,
          // valoracionEmpleado: obj.valoracionEmpleado || obj.valoracion_empleado || null,
          valoracionJefe: obj.valoracionJefe || obj.valoracion_jefe || null,
          // fechaLimite: fechaFormateada
        };
      } else if (fase === 2) {
        // Fase 2: titulo, fechaLimite (para luego agregar calificacionEmpleado)
        this.objetivosIndividuales[i] = {
          idObjetivo: obj.idObjetivo || obj.id_objetivo,
          titulo: obj.titulo,
          fechaLimite: fechaFormateada,
          calificacionEmpleado: null
        };
      } else if (fase === 4) {
        // Fase 3: titulo, fechaLimite, calificacionEmpleado, calificacionFinal
        this.objetivosIndividuales[i] = {
          idObjetivo: obj.idObjetivo || obj.id_objetivo,
          titulo: obj.titulo,
          fechaLimite: fechaFormateada,
          calificacionEmpleado: obj.calificacionEmpleado || obj.calificacion_empleado || null,
          calificacionFinal: obj.calificacionFinal || obj.calificacion_final || null
        };
      } else if (fase === 5) {
        // Fase 3: titulo, fechaLimite, calificacionEmpleado, calificacionFinal
        this.objetivosIndividuales[i] = {
          idObjetivo: obj.idObjetivo || obj.id_objetivo,
          titulo: obj.titulo,
          fechaLimite: fechaFormateada,
          calificacionEmpleado: obj.calificacionEmpleado || obj.calificacion_empleado || null,
          calificacionFinal: obj.calificacionFinal || obj.calificacion_final || null
        };
      }
      
      console.log(`Objetivo ${i + 1} mapeado:`, this.objetivosIndividuales[i]);
    } else {
      this.objetivosIndividuales[i] = { titulo: '', fechaLimite: '' };
    }
  }
}


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
    console.log('⚠️ FASE 4 EN PROCESO, SOLO LECTURA');
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
      this.objetivos[index].texto = nuevoTexto;
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
        this.objetivos[index].valor = nuevoValor;
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
      this.objetivos[index].fecha = nuevaFecha;
      console.log(`📅 Fecha del objetivo ${index + 1} actualizada:`, this.objetivos[index]);
    }
  }

  /**
   * Actualiza el nombre de una competencia específica (array fijo)
   * @param index - Índice de la competencia (0-4)
   * @param valor - Nuevo nombre (puede ser Event o string)
   */
  actualizarNombreCompetenciaFija(index: number, valor: any): void {
    let nuevoNombre: string;
    
    if (valor && typeof valor === 'object' && valor.target) {
      // Es un evento
      nuevoNombre = (valor.target as HTMLInputElement).value;
    } else {
      // Es un string directo
      nuevoNombre = String(valor);
    }

    // if (index >= 0 && index < this.competencias.length) {
    //   this.competencias[index].name = nuevoNombre;
    //   console.log(`📝 Nombre competencia ${index + 1}:`, nuevoNombre, this.competencias[index]);
    // }
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
   * Calcula el porcentaje total basado en los valores de los objetivos
   * @returns Porcentaje total promedio
   */
  calcularPorcentajeTotal(): number {
    const objetivosConValor = this.objetivos.filter(obj => obj.valor !== null && obj.valor > 0);
    if (objetivosConValor.length === 0) return 0;
    
    const suma = objetivosConValor.reduce((acc, obj) => acc + (obj.valor || 0), 0);
    const promedio = suma / objetivosConValor.length;
    
    return Math.round(promedio);
  }

  /**
   * Obtiene todos los objetivos como un objeto para debugging
   * @returns Array con todos los objetivos actuales
   */
  // obtenerEstadoObjetivos(): any[] {
  //   return this.objetivos.map(obj => ({
  //     id: obj.id,
  //     texto: obj.texto,
  //     valor: obj.valor,
  //     fecha: obj.fecha,
  //     reconsiderar: obj.reconsiderar,
  //     completado: obj.texto && obj.valor && obj.fecha
  //   }));
  // }

  /**
   * Determina si los campos de objetivos deben estar deshabilitados
   * Solo son editables en la etapa "Captura-Resultados"
   * @returns true si los campos deben estar deshabilitados
   */
  // sonCamposObjetivosDeshabilitados(): boolean {
  //   return this.activeTimelineStep !== 'Captura-Resultados';
  // }

  /**
   * Actualiza el estado de "reconsiderar" para un objetivo específico
   * @param index - Índice del objetivo (0-4)
   * @param valor - Valor numérico para reconsiderar
   */
  // actualizarReconsiderarObjetivo(index: number, valor: number): void {
  //   if (index >= 0 && index < this.objetivos.length) {
  //     // Validar que el valor esté entre 0 y 100
  //     if (!isNaN(valor) && valor >= 0 && valor <= 100) {
  //       this.objetivos[index].reconsiderar = valor;
  //       console.log(`🔄 Reconsiderar objetivo ${index + 1}:`, valor, this.objetivos[index]);
  //     }
  //   }
  // }   


  // showSection(targetId: string): void {
  //   this.activeSection = targetId;
  // }
  // Método para el menú principal
  showSection(targetId: string): void {
    this.activeSection = targetId;
    
    // Si selecciona "hoja-ruta", resetea al primer paso del timeline
    // if (targetId === 'hoja-ruta') {
    //   this.activeTimelineStep = 'Captura-Resultados';
    // }
    
    console.log('Sección principal activa:', this.activeSection);
    // console.log('Step del timeline activo:', this.activeTimelineStep);
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

}
