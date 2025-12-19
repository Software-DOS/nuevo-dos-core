import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { GthEmpleadoService } from 'src/app/services/gthempleado.service';
import { GthEvaluacionService } from '../../../services/gth-evaluacion.service';
import { GthCompetenciaService } from 'src/app/services/gth-competencia.service';
import { GthAreaService } from 'src/app/services/gth-area.service';
import { GthObjetivoService } from '../../../services/gth-objetivo.service';

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
  
  empleados: any[] = [];

  niveles: string[] = [];


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

  faseColabNuevo:number = 2;

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
  ];

  nivelesCompetencias = [
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
    private gthObjetivoService: GthObjetivoService,
    private gthAreaService: GthAreaService) {      
  }
    
  

  ngOnInit(): void {
    // Iniciamos obteniendo el ID del empleado
    const valor = sessionStorage.getItem('token');

    if (typeof valor === 'string') {
      var session =JSON.parse(atob(valor.split('.')[1]));
      this.IdEmpleadoActalSession = session['IdEmpleado'];
      // console.log("Id de session de empleado actual: ",session['IdEmpleado']);

    }

    this.cargarEvaluaciones(); //Cargar empleados con evaluaciones  

    // this.obtenerCelulas(); // Carga todas las celulas para seleccionar AREA-cambiar
  
    // Cargar todos los empleados al iniciar
    // this.cargarEmpleadosParaJefeEvaluador();
  }

  IdEmpleadoActalSession: number | null = null;


  // 2. Método principal optimizado
  cargarEvaluaciones(): void {
    // console.log('🔍 INICIO: cargarEvaluaciones()');
    
    this.gthEvaluacionServcie.MostrarEvaluaciones().subscribe({
      next: (response: any) => {
        // console.log('📦 RESPONSE ORIGINAL:', response);
        // console.log('📦 RESPONSE TYPE:', typeof response);
        // console.log('📦 RESPONSE KEYS:', Object.keys(response || {}));

        let evaluacionesData = response;
        if (response && response.$values) {
          // console.log('✅ Tiene $values, extrayendo...');
          evaluacionesData = response.$values;
        }

        // console.log('📊 EVALUACIONES DATA:', evaluacionesData);
        // console.log('📊 ES ARRAY?:', Array.isArray(evaluacionesData));
        // console.log('📊 LONGITUD:', evaluacionesData?.length);
        
        if (evaluacionesData && evaluacionesData.length > 0) {
          // console.log('📋 PRIMER ELEMENTO:', evaluacionesData[0]);
          // console.log('📋 ESTRUCTURA PRIMER ELEMENTO:', Object.keys(evaluacionesData[0]));
        }

        if (evaluacionesData && Array.isArray(evaluacionesData)) {
          // console.log('✅ Procesando', evaluacionesData.length, 'evaluaciones');
          this.procesarEvaluaciones(evaluacionesData);
        } else {
          console.warn('⚠️ No es un array válido, ejecutando plan B');
          // this.cargarEmpleadosConParametros();
        }
      },
      error: (error) => {
        console.error('❌ ERROR en cargarEvaluaciones:', error);
        console.error('❌ ERROR STATUS:', error.status);
        console.error('❌ ERROR MESSAGE:', error.message);
        // this.cargarEmpleadosConParametros();
      }
    });
  }

  /**
   * Procesar evaluaciones obteniendo empleados en UNA sola petición
   */
  private procesarEvaluaciones(evaluaciones: Ievaluacion[]): void {
    // console.log('🔄 Procesando evaluaciones...');
    // console.log('📊 Total evaluaciones:', evaluaciones.length);
    
    // Extraer IDs únicos de empleados
    const idsEmpleados = [...new Set(evaluaciones.map(evaluacion => evaluacion.idEmpleado))];
    // console.log('👥 Empleados únicos necesarios:', idsEmpleados.length);

    // console.log("Finales - id de las evaluaciones: ", idsEmpleados);

    if (idsEmpleados.length === 0) {
      console.warn('⚠️ No hay empleados para procesar');
      this.empleados = [];
      this.empleadosFiltrados = [];
      return;
    }

    // ✅ OPTIMIZACIÓN: Obtener TODOS los empleados en UNA sola petición
    this.gthEmpleadoService.MostrarConParametros(0).subscribe({
      next: (response: any) => {
        let empleadosData = response;
        if (response && response.$values) {
          empleadosData = response.$values;
        }

        if (!empleadosData || !Array.isArray(empleadosData)) {
          console.error('❌ Respuesta de empleados inválida');
          this.empleados = [];
          this.empleadosFiltrados = [];
          return;
        }
        // console.log('✅ Empleados obtenidos del backend:', empleadosData.length);

        // Crear diccionario para búsqueda rápida
        const empleadosMap: { [key: number]: iGTHEmpleado } = {};
        empleadosData.forEach((emp: iGTHEmpleado) => {
          empleadosMap[emp.idEmpleado] = emp;
        });

        // console.log('📚 Diccionario de empleados creado:', Object.keys(empleadosMap).length);

        // Mapear evaluaciones con empleados
        this.mapearEvaluacionesConEmpleados(evaluaciones, empleadosMap);
      },
      error: (error) => {
        console.error('❌ Error al obtener empleados:', error);
        this.empleados = [];
        this.empleadosFiltrados = [];
      }
    });
  }

  /**
   * Mapear evaluaciones con datos mínimos de empleados
   */
  private mapearEvaluacionesConEmpleados(evaluaciones: Ievaluacion[], empleadosData: { [key: number]: iGTHEmpleado }): void {
    // console.log('🔄 Mapeando evaluaciones con empleados...');
    // console.log('📊 Total evaluaciones:', evaluaciones.length);
    // console.log('👥 Empleados disponibles:', Object.keys(empleadosData).length);
    
    const empleadosMapeados: Empleado[] = evaluaciones.map(evaluacion => {
      const empleado = empleadosData[evaluacion.idEmpleado];

      // console.log("finales - id cada evaluacion mapear: ", empleado);
      
      // Si no se encuentra el empleado en el diccionario
      if (!empleado) {
        // console.warn(`⚠️ Empleado ${evaluacion.idEmpleado} no encontrado en datos`);
        
        // Intentar obtener nombre de la evaluación misma (si el backend lo incluye)
        const nombreFallback = (evaluacion as any).nombreCompleto || 
                            `${(evaluacion as any).nombreEmpleado || ''} ${(evaluacion as any).apellidoEmpleado || ''}`.trim() ||
                            `Empleado ${evaluacion.idEmpleado}`;
        
        return {
          id: evaluacion.idEmpleado,
          nombre: nombreFallback,
          sexo: (evaluacion as any).sexo || 'N/A',
          area: (evaluacion as any).area || (evaluacion as any).nombreArea || 'N/A',
          fechaInicio: this.formatearFecha(evaluacion.fechaCreacion || ''),
          calificado: evaluacion.calificacionFinal ? 
            `${evaluacion.calificacionFinal.toFixed(2)} / 4.0` : '- / 4.0',
          photo: this.construirUrlFoto('', (evaluacion as any).sexo || ''),
          estado: evaluacion.estado || 'PENDIENTE'
        };
      }

      // Si SÍ se encuentra el empleado
      const nombreCompleto = `${empleado.nombre || ''} ${empleado.apellido || ''}`.trim();
      
      return {
        id: evaluacion.idEmpleado,
        nombre: nombreCompleto || `Empleado ${evaluacion.idEmpleado}`,
        sexo: empleado.sexo || 'N/A',
        area: empleado.area || 'Sin área',
        fechaInicio: this.formatearFecha(evaluacion.fechaCreacion || ''),
        calificado: evaluacion.calificacionFinal ? 
          `${evaluacion.calificacionFinal.toFixed(2)} / 4.0` : '- / 4.0',
        photo: this.construirUrlFoto(empleado.fotoPerfilUrl || '', empleado.sexo || ''),
        estado: evaluacion.estado || 'PENDIENTE'
      };
    });

    if (empleadosMapeados.length > 0) {
      this.empleados = empleadosMapeados;
      this.empleadosFiltrados = [...this.empleados];
      // console.log(`✅ ${this.empleados.length} evaluaciones cargadas correctamente`);
    } else {
      // console.error('❌ No se pudieron mapear las evaluaciones');
      this.empleados = [];
      this.empleadosFiltrados = [];
    }
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
        
        // console.log(`📋 Evaluaciones encontradas para empleado ${idEmpleado}:`, evaluacionesFiltradas);
        return evaluacionesFiltradas;
      },
      error: (error) => {
        console.error(`❌ Error al buscar evaluaciones del empleado:`, error);
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
    // console.log("datos de las imagenes de la lista: ", fotoPerfilUrl);
    
    const sexoNormalizado = (sexo || '').toString().trim().toLowerCase();

    const defaultFemenino = 'assets/img/iconos/iconos mycollection/png/010-mujer-2.png';
    const defaultMasculino = 'assets/img/iconos/iconos mycollection/png/028-hombre-2.png';
    const defaultGenerico = 'assets/img/iconos/iconos mycollection/png/026-hombre-de-traje-y-corbata.png';

    const fallback = sexoNormalizado === 'femenino' || sexoNormalizado === 'f'
      ? defaultFemenino
      : sexoNormalizado === 'masculino' || sexoNormalizado === 'm'
        ? defaultMasculino
        : defaultGenerico;

    if (!fotoPerfilUrl) return fallback;

    if (fotoPerfilUrl.startsWith('http://') || fotoPerfilUrl.startsWith('https://')) {
      return fotoPerfilUrl;
    }

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
    console.log("Error al cargar la imagen");
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

//=======================    Funciones para ver y cargar la lista de evaluaciones   ============================

// ========================================
// VARIABLES PARA EL MODAL DEL COLABORADOR
// ========================================
faseEvaluacionModal: number = 0;
retroalimentacionModal: string = '';
planAccionModal: string = '';
objetivosIndividualesModal: any[] = [];
nivelesCompetenciasModal: NivelConCompetencia[] = [];
objetivoAreaDisplayModal: string = '';
idEvaluacionModal: number = 0;

// Variables para promedios en fase 5
promedioObjetivosModal: number = 0;
promedioCompetenciasModal: number = 0;
calificacionFinalModal: number = 0;

// ========================================
// NAVEGACIÓN A EVALUACIÓN DEL EMPLEADO
// ========================================
navigateToEvaluacion(empleadoId: number): void {
  this.selectedEmpleadoId = empleadoId;
  
  // Buscar el empleado en el array filtrado
  const empleadoSeleccionado = this.empleadosFiltrados.find(emp => emp.id === empleadoId);
  
  if (empleadoSeleccionado) {
    // Cargar datos completos del empleado desde el servicio
    this.cargarDatosEmpleadoModal(empleadoId);
    
    // ✅ Cargar las evaluaciones del empleado
    this.cargarEvaluacionesModal(empleadoId);
  } else {
    console.warn('No se encontró el empleado seleccionado');
  }
  
  this.faseColabNuevo = 2;
  this.showModal = true;
}

// ========================================
// CARGAR DATOS PERSONALES DEL EMPLEADO EN EL MODAL
// ========================================
private cargarDatosEmpleadoModal(empleadoId: number): void {
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
        this.correoElectronicoDisplayModal = empleadoData.correoCorporativo || 
                                             empleadoData.correo || 
                                             'No disponible';
        this.posicionDisplayModal = empleadoData.area || 
                                    empleadoData.cargo || 
                                    'No disponible';
        
        // console.log('✅ Datos del empleado cargados para modal:', this.empleadoModal);
      } else {
        // console.warn('No se encontraron datos para el empleado:', empleadoId);
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
// DATOS POR DEFECTO DEL MODAL
// ========================================
private setDatosModalPorDefecto(): void {
  this.empleadoModal = null;
  this.nombreCompletoDisplayModal = 'Nombre no disponible';
  this.correoElectronicoDisplayModal = 'Correo no disponible';
  this.posicionDisplayModal = 'Posición no disponible';
}

// ========================================
// CARGAR EVALUACIONES DEL COLABORADOR SELECCIONADO
// ========================================
cargarEvaluacionesModal(empleadoId: number): void {
  // console.log('🔍 Cargando evaluaciones para empleado ID:', empleadoId);
  
  const anio = 2025;

  // Obtener evaluaciones del empleado seleccionado
  this.gthEvaluacionServcie
    .MostrarEvaluacionesPorEmpleadoyAnio(empleadoId, anio)
    .subscribe({
      next: (response: any) => {
        let evaluacionesData = response;
        if (response && response.$values) {
          evaluacionesData = response.$values;
        }

        if (evaluacionesData && evaluacionesData.length > 0) {
          const evaluacion = evaluacionesData[0];
          const idEvaluacion = evaluacion.idEvaluacion;
          
          // ✅ Asignar datos a variables del modal
          this.idEvaluacionModal = idEvaluacion;
          this.retroalimentacionModal = evaluacion.retroalimentacion || '';
          this.planAccionModal = evaluacion.planAccion || '';
          this.faseEvaluacionModal = evaluacion.fase || 0;
          
          // console.log('📊 Fase de evaluación del colaborador:', this.faseEvaluacionModal);
          // console.log('📋 ID Evaluación:', idEvaluacion);

          if(this.faseEvaluacionModal == 4){
            alerts.info('Revise las calificaciones ingresadas por el jefe a cargo de la evaluación. Puede modificar la retroalimentación o el plan de acción. Al finalizar, podrá ver las calificaciones finales del colaborador.');
          }

          // ✅ Cargar objetivos del colaborador
          this.cargarObjetivosPorFaseModal(this.faseEvaluacionModal, idEvaluacion);

          // ✅ Cargar objetivo de área si existe célula
          if (evaluacion.idCelula) {
            this.cargarObjetivoAreaModal(evaluacion.idCelula);
          }

          // ✅ Inicializar array de competencias del colaborador
          this.nivelesCompetenciasModal = [];

          // ✅ Cargar competencias asignadas a esta evaluación
          this.cargarCompetenciasModal(idEvaluacion);

        } else {
          console.warn('⚠️ No se encontró evaluación para el empleado ID:', empleadoId);
          this.inicializarDatosModalVacios();
        }
      },
      error: (error) => {
        console.error('Error al consultar evaluaciones del colaborador:', error);
        this.inicializarDatosModalVacios();
      }
    });
}

// ========================================
// CARGAR COMPETENCIAS DEL MODAL
// ========================================
cargarCompetenciasModal(idEvaluacion: number): void {
  this.gthCompetenciaService
    .obtenerAsignacionCompetenciaPorIdEvaluacion(idEvaluacion)
    .subscribe({
      next: (respAsigCompetencias: any) => {
        // console.log('📦 Competencias asignadas recibidas:', respAsigCompetencias);
        
        let asignacionesCompetenciasData = respAsigCompetencias;
        if (respAsigCompetencias && respAsigCompetencias.$values) {
          asignacionesCompetenciasData = respAsigCompetencias.$values;
        }

        // Usar Promise.all para esperar a que todas las competencias se carguen
        const promesasCompetencias = asignacionesCompetenciasData.map((competencia: any) => {
          return this.procesarCompetenciaModal(competencia);
        });

        Promise.all(promesasCompetencias).then(() => {
          // console.log('✅ Todas las competencias del modal cargadas');
          
          // Sif estamos en fase 5, calcular promedios
          if (this.faseEvaluacionModal === 5 || this.faseEvaluacionModal === 7) {
            this.calcularPromediosModal();
          }
        });
      },
      error: (error) => console.error('Error al consultar competencias asignadas:', error)
    });
}

// ========================================
// PROCESAR UNA COMPETENCIA DEL MODAL
// ========================================
procesarCompetenciaModal(competencia: any): Promise<void> {
  return new Promise((resolve) => {
    const idAsignacionCompetencia = competencia.idAsignacion;
    const idNivelCompetencia = competencia.idNivelCompetencia;
    const valoracionJefe = competencia.valoracionJefe || null;
    const califEmpleado = competencia.calificacionEmpleado || null;
    const califFinal = competencia.calificacionFinal || null;
    
    // ✅ CORRECCIÓN 1: Convertir a Date para FechaLimite y a string para fecha
    const fechaDate = competencia.fechaLimite 
      ? new Date(competencia.fechaLimite)
      : new Date();
    
    const fechaString = competencia.fechaLimite 
      ? new Date(competencia.fechaLimite).toISOString().split('T')[0]
      : '';

    // ✅ Obtener detalles del nivel de competencia
    this.gthCompetenciaService
      .mostrarNivelCompetencias(1, idNivelCompetencia)
      .subscribe({
        next: (respNivelCompetencias: any) => {
          let nivelesCompetenciasData = respNivelCompetencias;
          if (respNivelCompetencias && respNivelCompetencias.$values) {
            nivelesCompetenciasData = respNivelCompetencias.$values;
          }

          if (nivelesCompetenciasData && nivelesCompetenciasData.length > 0) {
            const nivel = nivelesCompetenciasData[0];
            
            // ✅ Obtener detalles de la competencia
            this.gthCompetenciaService
              .mostrarCompetencias(1, nivel.idCompetencia)
              .subscribe({
                next: (respCompetencia: any) => {
                  let competenciaData = respCompetencia;
                  if (respCompetencia && respCompetencia.$values) {
                    competenciaData = respCompetencia.$values;
                  }

                  if (competenciaData.length > 0) {
                    const comp = competenciaData[0];

                    // ✅ Usar los tipos correctos según la interfaz
                    const combinado: NivelConCompetencia = {
                      idAsignacionCompetencia: idAsignacionCompetencia,
                      idCompetencia: nivel.idCompetencia,
                      nivel: nivel.nivel,
                      descripcion: nivel.descripcion,
                      nombreCompetencia: comp.nombreCompetencia,
                      tipoCompetencia: comp.tipoCompetencia,
                      FechaLimite: fechaDate, // Date
                      valor: valoracionJefe,
                      fecha: fechaString, // string (formato YYYY-MM-DD)
                      reconsiderar: valoracionJefe,
                      calificacion: califEmpleado,
                      calificacionFinal: califFinal
                    };

                    this.nivelesCompetenciasModal.push(combinado);
                    // console.log('✅ Competencia del modal agregada:', combinado);
                    resolve();
                  } else {
                    resolve();
                  }
                },
                error: (error) => {
                  console.error('Error al cargar competencia:', error);
                  resolve();
                }
              });
          } else {
            resolve();
          }
        },
        error: (error) => {
          console.error('Error al cargar nivel de competencias:', error);
          resolve();
        }
      });
  });
}



// ========================================
// CARGAR OBJETIVO DE ÁREA PARA EL MODAL
// ========================================
cargarObjetivoAreaModal(idCelula: number): void {
  if (!idCelula) return;

  this.gthObjetivoService.obtenerObjetivosPorIdCelula(1, idCelula)
    .subscribe({
      next: (response: any) => {
        const datos = response?.$values?.[0] || response?.[0] || response;
        
        if (datos) {
          const objetivo = datos.celObjetivo || 
                          datos.cel_objetivo || 
                          datos.objetivo ||
                          datos.CEL_OBJETIVO || '';

          this.objetivoAreaDisplayModal = objetivo;
          // console.log('✅ Objetivo de área del modal cargado:', objetivo);
        } else {
          this.objetivoAreaDisplayModal = '';
        }
      },
      error: (error) => {
        console.error('Error al cargar objetivo de área del modal:', error);
        this.objetivoAreaDisplayModal = '';
      }
    });
}

// ========================================
// CARGAR OBJETIVOS POR FASE DEL MODAL
// ========================================
cargarObjetivosPorFaseModal(fase: number, idEvaluacion: number): void {
  // console.log('=== CARGANDO OBJETIVOS DEL MODAL - FASE:', fase, '===');
  
  this.gthObjetivoService.obtenerObjetivosPorIdEvaluacion(idEvaluacion)
    .subscribe({
      next: (objetivosResponse: any) => {
        const objetivosExistentes = objetivosResponse?.$values || objetivosResponse || [];
        
        const todosLosObjetivos = Array.isArray(objetivosExistentes) 
          ? objetivosExistentes 
          : [];
        
        // console.log('Todos los objetivos del modal encontrados:', todosLosObjetivos);
        
        if (todosLosObjetivos.length > 0) {
          this.mapearObjetivosSegunFaseModal(todosLosObjetivos, fase);
        } else {
          // console.log('No hay objetivos existentes para el modal');
          this.objetivosIndividualesModal = [];
        }
      },
      error: (error) => {
        console.error('Error al cargar objetivos del modal:', error);
        this.objetivosIndividualesModal = [];
      }
    });
}

// ========================================
// MAPEAR OBJETIVOS SEGÚN LA FASE DEL MODAL
// ========================================
mapearObjetivosSegunFaseModal(objetivos: any[], fase: number): void {
  // console.log('📝 Mapeando objetivos del modal para fase:', fase);
  // console.log('Objetivos recibidos:', objetivos);
  
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
      const idA = a.idObjetivo || a.id_objetivo || 0;
      const idB = b.idObjetivo || b.id_objetivo || 0;
      return idA - idB;
    });
  
  // Combinar: primero AREA, luego INDIVIDUAL
  const objetivosOrdenados = objetivoArea 
    ? [objetivoArea, ...objetivosIndividuales]
    : objetivosIndividuales;
  
  // console.log('Objetivos ordenados del modal:', objetivosOrdenados);
  
  // ✅ Mapear a objetivosIndividualesModal
  this.objetivosIndividualesModal = [];
  
  for (let i = 0; i < 5; i++) {
    if (i < objetivosOrdenados.length) {
      const obj = objetivosOrdenados[i];
      
      // Formatear fecha
      let fechaFormateada = '';
      if (obj.fechaLimite || obj.fecha_limite) {
        const fecha = new Date(obj.fechaLimite || obj.fecha_limite);
        fechaFormateada = fecha.toISOString().split('T')[0];
      }
      
      const tipoObjetivo = (obj.tipoObjetivo || obj.tipo_objetivo || 'INDIVIDUAL').toUpperCase();
      
      // Mapear según fase 4 o 5
      if (fase === 4 || fase === 5 || fase === 7) {
        this.objetivosIndividualesModal[i] = {
          idObjetivo: obj.idObjetivo || obj.id_objetivo,
          titulo: obj.titulo || '',
          fechaLimite: fechaFormateada,
          calificacionEmpleado: obj.calificacionEmpleado || obj.calificacion_empleado || null,
          calificacionFinal: obj.calificacionFinal || obj.calificacion_final || null
        };
      }
      
      // console.log(`Objetivo ${i + 1} del modal mapeado:`, this.objetivosIndividualesModal[i]);
    } else {
      this.objetivosIndividualesModal[i] = { 
        titulo: '', 
        fechaLimite: '',
        calificacionEmpleado: null,
        calificacionFinal: null
      };
    }
  }
  
  // Si estamos en fase 5, calcular promedios después de mapear objetivos
  if (fase === 5 || fase === 7) {
    this.calcularPromediosModal();
  }
}


// ========================================
// CALCULAR PROMEDIOS PARA FASE 5
// ========================================
calcularPromediosModal(): void {
  // console.log('🔍 Iniciando cálculo de promedios...');
  // console.log('📋 Objetivos disponibles:', this.objetivosIndividualesModal);
  // console.log('📋 Competencias disponibles:', this.nivelesCompetenciasModal);

  // ========================================
  // CÁLCULO DE OBJETIVOS (70% del total)
  // ========================================
  const objetivosConCalificacion = this.objetivosIndividualesModal.filter(
    obj => obj.calificacionFinal && obj.calificacionFinal > 0
  );
  
  // console.log('✅ Objetivos con calificación:', objetivosConCalificacion);
  
  if (objetivosConCalificacion.length > 0) {
    let sumaObjetivosPonderada = 0;
    
    objetivosConCalificacion.forEach((obj, index) => {
      // El primer objetivo (relacionado al área) tiene peso del 22%
      // Los otros 4 objetivos tienen peso del 12% cada uno
      const peso = index === 0 ? 0.22 : 0.12;
      const valorPonderado = obj.calificacionFinal * peso;
      
      // console.log(`  📌 Objetivo ${index + 1}:`);
      // console.log(`     - Calificación: ${obj.calificacionFinal}`);
      // console.log(`     - Peso: ${peso * 100}%`);
      // console.log(`     - Valor ponderado: ${valorPonderado.toFixed(4)}`);
      
      sumaObjetivosPonderada += valorPonderado;
    });
    
    // Normalizar a escala de 4.0 dividiendo entre 0.70
    this.promedioObjetivosModal = sumaObjetivosPonderada / 0.70;
    // console.log(`  ✅ Suma ponderada: ${sumaObjetivosPonderada.toFixed(4)}`);
    // console.log(`  ✅ Promedio Objetivos (normalizado): ${this.promedioObjetivosModal.toFixed(2)}`);
  } else {
    this.promedioObjetivosModal = 0;
    console.log('  ⚠️ No hay objetivos con calificación');
  }

  // ========================================
  // CÁLCULO DE COMPETENCIAS (30% del total)
  // ========================================
  const competenciasConCalificacion = this.nivelesCompetenciasModal.filter(
    comp => comp.calificacionFinal && comp.calificacionFinal > 0
  );
  
  // console.log('✅ Competencias con calificación:', competenciasConCalificacion);
  
  if (competenciasConCalificacion.length > 0) {
    let sumaCompetenciasPonderada = 0;
    
    competenciasConCalificacion.forEach((comp, index) => {
      // Cada competencia tiene un peso del 7.5%
      const peso = 0.075;
      const valorPonderado = comp.calificacionFinal! * peso;
      
      // console.log(`  📌 Competencia ${index + 1}:`);
      // console.log(`     - Calificación: ${comp.calificacionFinal}`);
      // console.log(`     - Peso: ${peso * 100}%`);
      // console.log(`     - Valor ponderado: ${valorPonderado.toFixed(4)}`);
      
      sumaCompetenciasPonderada += valorPonderado;
    });
    
    // Normalizar a escala de 4.0 dividiendo entre 0.30
    this.promedioCompetenciasModal = sumaCompetenciasPonderada / 0.30;
    // console.log(`  ✅ Suma ponderada: ${sumaCompetenciasPonderada.toFixed(4)}`);
    // console.log(`  ✅ Promedio Competencias (normalizado): ${this.promedioCompetenciasModal.toFixed(2)}`);
  } else {
    this.promedioCompetenciasModal = 0;
    console.log('  ⚠️ No hay competencias con calificación');
  }

  // ========================================
  // CALIFICACIÓN FINAL
  // ========================================
  // Ahora aplicamos los pesos a los promedios normalizados
  this.calificacionFinalModal = (this.promedioObjetivosModal * 0.70) + (this.promedioCompetenciasModal * 0.30);

  // ========================================
  // REDONDEAR A 2 DECIMALES (AGREGADO)
  // ========================================
  this.promedioObjetivosModal = Math.round(this.promedioObjetivosModal * 100) / 100;
  this.promedioCompetenciasModal = Math.round(this.promedioCompetenciasModal * 100) / 100;
  this.calificacionFinalModal = Math.round(this.calificacionFinalModal * 100) / 100;

  console.log('📊 ============ RESUMEN FINAL ============');
  // console.log(`  - Promedio Objetivos: ${this.promedioObjetivosModal.toFixed(2)} / 4.0`);
  // console.log(`  - Promedio Competencias: ${this.promedioCompetenciasModal.toFixed(2)} / 4.0`);
  // console.log(`  - Contribución Objetivos (70%): ${(this.promedioObjetivosModal * 0.70).toFixed(2)}`);
  // console.log(`  - Contribución Competencias (30%): ${(this.promedioCompetenciasModal * 0.30).toFixed(2)}`);
  console.log(`  - Calificación Final: ${this.calificacionFinalModal.toFixed(2)} / 4.0`);
  console.log('=========================================');
}

calcularDashOffset(promedio: number, maximo: number): number {
  const radio = 50; // ✅ Debe coincidir con r="50" en el HTML
  const circunferencia = 2 * Math.PI * radio; // 314.16
  const porcentaje = (promedio / maximo) * 100;
  const offset = circunferencia - (circunferencia * porcentaje) / 100;
  
  return offset;
}

obtenerClaseBadge(calificacion: number): string {
  if (calificacion >= 3.5) return 'badge-excepcional';
  if (calificacion >= 3.0) return 'badge-sobresaliente';
  if (calificacion >= 2.0) return 'badge-necesita-mejorar';
  return 'badge-insatisfactorio';
}

obtenerNivelDesempeno(calificacion: number): string {
  if (calificacion >= 3.5) return 'Excepcional';
  if (calificacion >= 3.0) return 'Sobresaliente';
  if (calificacion >= 2.0) return 'Necesita Mejorar';
  return 'Insatisfactorio';
}

obtenerDescripcionDesempeno(calificacion: number): string {
  if (calificacion >= 3.5) return 'Supera ampliamente las expectativas';
  if (calificacion >= 3.0) return 'Cumple con las expectativas';
  if (calificacion >= 2.0) return 'Requiere mejora en algunas áreas';
  return 'No cumple con las expectativas';
}

// ========================================
// INICIALIZAR DATOS VACÍOS DEL MODAL
// ========================================
inicializarDatosModalVacios(): void {
  this.retroalimentacionModal = '';
  this.planAccionModal = '';
  this.faseEvaluacionModal = 0;
  this.objetivosIndividualesModal = [];
  this.nivelesCompetenciasModal = [];
  this.objetivoAreaDisplayModal = '';
  this.idEvaluacionModal = 0;
  this.promedioObjetivosModal = 0;
  this.promedioCompetenciasModal = 0;
  this.calificacionFinalModal = 0;
  
  console.log('⚠️ Datos del modal inicializados vacíos');
}

// ========================================
// CERRAR MODAL
// ========================================
cerrarModal(): void {
  this.showModal = false;
  this.empleadoModal = null;
  this.selectedEmpleadoId = 0;
  this.inicializarDatosModalVacios();
}

// ========================================
// FUNCIÓN PARA OBTENER NOMBRE DE CALIFICACIÓN
// ========================================
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

// ========================================
// ENVIAR RETROALIMENTACIÓN DEL MODAL (FASE 4)
// ========================================
enviarRetroalimentacionModal(): void {
  // console.log('📤 Enviando retroalimentación del modal...');
  
  // Validar que todos los objetivos tengan calificación final
  const objetivosSinCalificar = this.objetivosIndividualesModal.filter(
    obj => obj.titulo && obj.titulo.trim() !== '' && (!obj.calificacionFinal || obj.calificacionFinal === 0)
  );
  
  if (objetivosSinCalificar.length > 0) {
    alert('Por favor, califica todos los objetivos antes de finalizar.');
    return;
  }
  
  // Validar que todas las competencias tengan calificación final
  const competenciasSinCalificar = this.nivelesCompetenciasModal.filter(
    comp => !comp.calificacionFinal || comp.calificacionFinal === 0
  );
  
  if (competenciasSinCalificar.length > 0) {
    alert('Por favor, califica todas las competencias antes de finalizar.');
    return;
  }
  
  // Validar retroalimentación y plan de acción
  if (!this.retroalimentacionModal || this.retroalimentacionModal.trim() === '') {
    alert('Por favor, ingresa una retroalimentación antes de finalizar.');
    return;
  }
  
  if (!this.planAccionModal || this.planAccionModal.trim() === '') {
    alert('Por favor, ingresa un plan de acción antes de finalizar.');
    return;
  }
  
  // Llamar a la función de guardado
  this.guardarDatosEvaluacionModal();
}

// ========================================
// GUARDAR DATOS DE EVALUACIÓN DEL MODAL
// ========================================
guardarDatosEvaluacionModal(): void {
  // console.log('=== GUARDANDO DATOS DEL MODAL - Fase 4 → Fase 5 ===');
  
  const anio = 2025;
  
  // Obtener la evaluación actual
  this.gthEvaluacionServcie
    .MostrarEvaluacionesPorEmpleadoyAnio(this.selectedEmpleadoId!, anio)
    .subscribe({
      next: (response: any) => {
        let evaluacionesData = response?.$values || response;
        
        if (evaluacionesData && evaluacionesData.length > 0) {
          const idEvaluacion = evaluacionesData[0].idEvaluacion;
          // console.log('ID Evaluación:', idEvaluacion);
          
          // PASO 1: Guardar objetivos
          const promesasObjetivos = this.objetivosIndividualesModal
            .filter(obj => obj.idObjetivo && obj.titulo && obj.titulo.trim() !== '')
            .map((objetivo, index) => {
              const objetivoData: IgthObjetivo = {
                tipo: 2,
                idObjetivo: objetivo.idObjetivo,
                calificacionFinal: objetivo.calificacionFinal
              };
              
              // console.log(`Actualizando objetivo ${index + 1}:`, objetivoData);
              return this.gthObjetivoService.gestionarObjetivo(objetivoData).toPromise();
            });
          
          if (promesasObjetivos.length === 0) {
            alert('No hay objetivos válidos para guardar.');
            return;
          }
        
          // EJECUTAR: Objetivos → Competencias → Evaluación
          Promise.all(promesasObjetivos)
            .then((responsesObjetivos) => {
              // console.log('✅ Objetivos guardados');
              
              const hayErroresObjetivos = responsesObjetivos.some((resp: any) => {
                const resultado = resp?.$values?.[0] || resp?.[0] || resp;
                return resultado?.valor1 < 0;
              });
              
              if (hayErroresObjetivos) {
                alert('Error al guardar objetivos. Revise la consola.');
                return;
              }
              
              // PASO 2: Guardar competencias
              const promesasCompetencias = this.nivelesCompetenciasModal
                .filter(comp => comp.idAsignacionCompetencia)
                .map((competencia, index) => {
                  const competenciaData: IGTHAsignacionCompetenciaViewModel = {
                    Tipo: 2,
                    IdAsignacion: competencia.idAsignacionCompetencia,
                    CalificacionFinal: competencia.calificacionFinal
                  };
                  
                  // console.log(`Actualizando competencia ${index + 1}:`, competenciaData);
                  return this.gthCompetenciaService.gestionarAsignacionCompetencia(competenciaData).toPromise();
                });

              if (promesasCompetencias.length === 0) {
                // console.warn('⚠️ No hay competencias para actualizar');
                this.actualizarEvaluacionFinalModal(idEvaluacion);
                return;
              }

              Promise.all(promesasCompetencias)
                .then((responsesCompetencias) => {
                  // console.log('✅ Competencias guardadas');
                  
                  const hayErroresCompetencias = responsesCompetencias.some((resp: any) => {
                    const resultado = resp?.$values?.[0] || resp?.[0] || resp;
                    return resultado?.valor1 < 0;
                  });
                  
                  if (hayErroresCompetencias) {
                    alert('Error al guardar competencias. Revise la consola.');
                    return;
                  }
                  
                  // PASO 3: Actualizar evaluación con retroalimentación
                  this.actualizarEvaluacionFinalModal(idEvaluacion);
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
        } else {
          alert('No se encontró la evaluación.');
        }
      },
      error: (error) => {
        console.error('❌ Error al obtener evaluación:', error);
        alert('Error al obtener la evaluación.');
      }
    });
}

// ========================================
// ACTUALIZAR EVALUACIÓN FINAL DEL MODAL
// ========================================
// private actualizarEvaluacionFinalModal(idEvaluacion: number): void {
//   console.log('✅ Actualizando evaluación a Fase 5');
//   console.log('📝 Retroalimentación:', this.retroalimentacionModal);
//   console.log('📋 Plan de Acción:', this.planAccionModal);
//   console.log('📊 Calificación Final:', this.calificacionFinalModal);
  
//   const evaluacionActualizada: Ievaluacion = {
//     tipo: 2,
//     idEmpleado: this.selectedEmpleadoId!,
//     idEvaluacion: idEvaluacion,
//     estado: 'COMPLETADA',
//     retroalimentacion: this.retroalimentacionModal, 
//     planAccion: this.planAccionModal,
//     calificacionFinal: this.calificacionFinalModal, 
//     fechaEvaluacionJefe: this.obtenerFechaActual(),
//     fechaFinalizacion: this.obtenerFechaActual(),  
//     fase: 5 
//   };
  
//   this.gthEvaluacionServcie.actualizarGthEvaluacion(evaluacionActualizada).subscribe({
//     next: (resp) => {
//       console.log('✅ Evaluación actualizada:', evaluacionActualizada);
//       alert('✅ Evaluación finalizada y guardada correctamente.');
      
//       // ✅ Cerrar el modal
//       // this.cerrarModal();
      
//       // ✅ Recargar la lista de evaluaciones
//       // this.cargarEvaluaciones();
      
//       // ✅ Opcional: Reabrir el modal con la nueva fase
//       setTimeout(() => {
//         if (this.selectedEmpleadoId) {
//           this.navigateToEvaluacion(this.selectedEmpleadoId);
//         }
//       }, 300);
//     },
//     error: (error) => {
//       console.error('❌ Error al actualizar evaluación:', error);
//       alert('Objetivos y competencias guardados, pero error al actualizar evaluación.');
//     }
//   });
// }
private actualizarEvaluacionFinalModal(idEvaluacion: number): void {
  
  // ✅ CRÍTICO: Calcular promedios ANTES de guardar
  this.calcularPromediosModal();
  
  // Esperar un momento para que el cálculo termine
  setTimeout(() => {
        
    const evaluacionActualizada: Ievaluacion = {
      tipo: 2,
      idEmpleado: this.selectedEmpleadoId!,
      idEvaluacion: idEvaluacion,
      estado: 'COMPLETADA',
      retroalimentacion: this.retroalimentacionModal, 
      planAccion: this.planAccionModal,
      calificacionFinal: this.calificacionFinalModal,
      fechaEvaluacionJefe: this.obtenerFechaActual(),
      fechaFinalizacion: this.obtenerFechaActual(),
      fase: 5
    };
    
    // console.log('📦 Objeto a enviar al backend:');
    // console.log(JSON.stringify(evaluacionActualizada, null, 2));
    // console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    this.gthEvaluacionServcie.actualizarGthEvaluacion(evaluacionActualizada).subscribe({
      next: (resp) => {
        // console.log('✅ Respuesta del servidor:', resp);
        // console.log('✅ Evaluación actualizada con calificación:', this.calificacionFinalModal);
        alerts.exito('✅ Evaluación finalizada y guardada correctamente.');
        
        // Recargar la lista de evaluaciones
        this.cargarEvaluaciones();
        
        // Reabrir el modal con la nueva fase
        setTimeout(() => {
          if (this.selectedEmpleadoId) {
            this.navigateToEvaluacion(this.selectedEmpleadoId);
          }
        }, 300);
      },
      error: (error) => {
        console.error('❌ Error completo:', error);
        console.error('❌ Detalles del error:', error.error);
        alert('❌ Error al actualizar evaluación: ' + (error.error?.message || error.message));
      }
    });
  }, 300); // Esperar 300ms para que termine el cálculo
}


  // ========================================
  // FUNCIÓN HELPER PARA OBTENER FECHA ACTUAL
  // ========================================
  private obtenerFechaActual(): string {
    const fecha = new Date();
    return fecha.toISOString().split('T')[0]; // Formato: YYYY-MM-DD
  }

  //Mostrar el contenido de las pestañas
  showSubcategoryEval(tab: string): void {
    this.activeSubcategory = tab;
    // console.log('Pestaña activa:', this.activeSubcategory);
    
    // ✅ Ejecutar función solo cuando se selecciona 'gestAreas'
    if (tab === 'gestAreas') {
      this.obtenerCelulas();
    }
    
    if (tab === 'crearEvaluacion') {
      this.cargarEmpleadosParaEvaluacion(); // Carga todos los empleados
      this.cargarCompetencias();
    }
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
      
    // console.log('Validación Paso 1:', {
    //   // nombreArea: this.nombreArea,
    //   nombreCelula: this.nombreCelula,
    //   jefeSeleccionado: this.jefeSeleccionado,
    //   paso2Habilitado: this.paso2Habilitado
    // });
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
      // console.log('✅ Respuesta completa del backend ->', response);
      
      if (response?.$values) {
        this.celulas = response.$values;
      } else if (Array.isArray(response)) {
        this.celulas = response;
      }
      
      // console.log('✅ Total células:', this.celulas.length);
      
      // 👇 VER ESTRUCTURA COMPLETA DE LA PRIMERA CÉLULA
      // if (this.celulas.length > 0) {
      //   console.log('📋 Primera célula completa:', this.celulas[0]);
      //   console.log('📋 Propiedades:', Object.keys(this.celulas[0]));
      // }
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
      // console.log('✅ ID Célula obtenida:', idCelula);
      
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
            // console.log('✅ Célula actualizada con nuevo encargado:', response);
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
        // console.log('✅ Célula creada:', response);
        
        // Buscar el ID recién creado
        this.gthAreaService.MostrarCelulas().subscribe({
          next: (celulasResponse: any) => {
            const celulas = celulasResponse?.$values || celulasResponse || [];
            
            const celulaCreada = celulas.find((c: any) => 
              c.nombre?.toLowerCase() === this.nombreCelula.toLowerCase()
            );
            
            if (celulaCreada?.idCelula) {
              // console.log('🆔 ID encontrado:', celulaCreada.idCelula);
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
  
  // console.log(`📝 Actualizando ${empleadosTotal.length} empleados con idCelula: ${idCelula}`);
  
  let completados = 0;
  let errores = 0;
  
  empleadosTotal.forEach((empleado) => {
    // ✅ SOLO ENVIAR LOS CAMPOS NECESARIOS
    const data = {
      tipo: 1,
      idEmpleado: empleado.id,
      idCelula: idCelula
    };
    
    // console.log('📤 Payload simplificado:', data);
    
    this.gthEmpleadoService.gestionarEmpleado(data as any).subscribe({
      next: (response: any) => {
        completados++;
        // console.log(`✅ ${empleado.nombre} actualizado`);
        
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
   * Cargar todos los empleados disponibles
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
          // console.log(`Empleados cargados: ${this.empleadosTodos.length}`);
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
    
    this.gthEmpleadoService.Mostrar().subscribe({
      next: (response: any) => {
        // console.log('✅ Respuesta recibida:', response);
        
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

          // console.log('✅ Total empleados para jefe cargados:', this.todosLosEmpleadosParaJefe.length);
          
          if (this.todosLosEmpleadosParaJefe.length > 0) {
            // console.log('📋 Primeros 3 empleados:', this.todosLosEmpleadosParaJefe.slice(0, 3));
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
    // console.log('🔍 Filtrando jefes. Texto:', this.filtroJefeEvaluacion);
    // console.log('📦 Total empleados disponibles:', this.todosLosEmpleadosParaJefe.length);
    
    if (!this.filtroJefeEvaluacion || this.filtroJefeEvaluacion.trim().length < 3) {
      // console.log('⚠️ Filtro muy corto (menos de 3 letras)');
      this.jefesFiltradosEvaluacion = [];
      return;
    }

    const filtro = this.filtroJefeEvaluacion.toLowerCase().trim();
    // console.log('🔍 Buscando con filtro:', filtro);
    
    this.jefesFiltradosEvaluacion = this.todosLosEmpleadosParaJefe.filter(emp => {
      // Usar 'nombre' y 'area' que son los campos mapeados
      const nombre = (emp.nombre || '').toLowerCase();
      const area = (emp.area || '').toLowerCase();
      
      const coincide = nombre.includes(filtro) || area.includes(filtro);
      
      if (coincide) {
        // console.log('✅ Coincidencia:', emp.nombre, '-', emp.area);
      }
      
      return coincide;
    });

    // console.log('✅ Total jefes filtrados:', this.jefesFiltradosEvaluacion.length);
    // console.log('📋 Jefes encontrados:', this.jefesFiltradosEvaluacion);
  }

  // Método que se ejecuta cuando se selecciona un empleado
  onEmpleadoBuscadoSeleccionado(): void {
    // console.log('════════════════════════════════════════');
    // console.log('👤 EMPLEADO SELECCIONADO');
    // console.log('════════════════════════════════════════');
    
    // Limpiar selección de jefe evaluador
    this.jefeSeleccionadoEvaluacion = null;
    this.filtroJefeEvaluacion = '';
    this.jefesFiltradosEvaluacion = [];

    if (this.empleadoBuscado?.id) {
      // console.log('✅ Empleado válido:', this.empleadoBuscado);
      // console.log('📋 ID Empleado:', this.empleadoBuscado.id);
      // console.log('📋 Nombre:', this.empleadoBuscado.nombre);
      this.evaluacionCreada = null;
      
      // console.log('🔍 Verificando empleados para jefe...');
      // console.log('📦 Empleados actuales en memoria:', this.todosLosEmpleadosParaJefe.length);
      
      // Cargar empleados si no están cargados
      if (this.todosLosEmpleadosParaJefe.length === 0) {
        // console.log('🔵 NO HAY EMPLEADOS - Iniciando carga...');
        this.cargarEmpleadosParaJefeEvaluador();
      } else {
        // console.log('✅ Empleados ya cargados:', this.todosLosEmpleadosParaJefe.length);
      }
    } else {
      console.warn('⚠️ Colaborador no válido o deseleccionado');
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
    // console.log('onCompetenciaSeleccionada() ejecutado');
    
    if (this.competenciaSeleccionada) {
      const competenciaEncontrada = this.competenciasFiltradas.find(c => 
        c.NombreCompetencia === this.competenciaSeleccionada
      );
      
      if (competenciaEncontrada && competenciaEncontrada.idCompetencia) {
        // console.log('ID encontrado:', competenciaEncontrada.idCompetencia);
        
        // Agregar esta línea para debuggear
        // this.debugearAPI(competenciaEncontrada.idCompetencia);
        
        this.cargarNivelesCompetencia(competenciaEncontrada.idCompetencia);
      }
    }
  }

  // Método para cargar niveles específicos de una competencia
  private cargarNivelesCompetencia(idCompetencia: number): void {
    // console.log('Cargando niveles para idCompetencia:', idCompetencia);
    
    // USAR TIPO = 3 para filtrar por ID_COMPETENCIA
    this.gthCompetenciaService.mostrarNivelCompetencias(3, undefined, idCompetencia).subscribe({
      next: (response: any) => {
        // console.log('Respuesta con niveles filtrados:', response);
        
        if (response?.$values && response.$values.length > 0) {
          // console.log(`Encontrados ${response.$values.length} niveles para competencia ${idCompetencia}`);
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
    // console.log('Procesando niveles recibidos:', niveles);
    
    this.nivelesCompetencia = niveles;
    
    // Procesar y ordenar los niveles
    this.nivelesDisponibles = niveles
      .filter(n => n.nivel) // Solo los que tienen nivel
      .sort((a, b) => a.nivel - b.nivel) // Ordenar por número de nivel
      .map(n => {
        const nivelFormateado = `Nivel ${n.nivel} - ${n.descripcion} - ${n.idNivelCompetencia}`;
        return nivelFormateado;
      });
    
    // console.log(`Total niveles disponibles: ${this.nivelesDisponibles.length}`, this.nivelesDisponibles);
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
    // console.log('🔄 Tipo de competencia cambiado a:', this.tipoCompetencia);
    
    this.competenciasFiltradas = this.competencias.filter(c => c.tipo === this.tipoCompetencia);
    // console.log('Competencias filtradas:', this.competenciasFiltradas);
    
    this.competenciaSeleccionada = null;
    
    // Limpiar niveles cuando cambia el tipo
    this.nivelesDisponibles = [];
    this.nivelSeleccionado = null;
    // console.log('Niveles limpiados por cambio de tipo');
  }
  
  // Método para mostrar la sección de competencias  
  async mostrarSeccionCompetencias(): Promise<void> {
    // console.log('🎬 ========================================');
    // console.log('🎬 INICIO mostrarSeccionCompetencias');
    // console.log('🎬 ========================================');

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
        idJefe: this.jefeSeleccionadoEvaluacion.id,
        anio: new Date().getFullYear(),
        estado: 'PENDIENTE',
        usuarioCreacion: 'SISTEMA',
        fase: 0
      };

      // console.log('📤 Datos a enviar:', nuevaEvaluacion);
      // console.log('👤 Empleado ID:', this.empleadoBuscado.id);
      // console.log('👔 Jefe ID:', this.jefeSeleccionadoEvaluacion.id);
      // console.log('👔 Jefe nombre:', this.jefeSeleccionadoEvaluacion.nombre);

      const response = await this.gthEvaluacionServcie
        .crearGthEvaluacion(nuevaEvaluacion)
        .toPromise();

      // console.log('📥 ========================================');
      // console.log('📥 RESPONSE COMPLETA:', response);
      // console.log('📥 RESPONSE TIPO:', typeof response);
      // console.log('📥 RESPONSE KEYS:', response ? Object.keys(response) : 'null');
      // console.log('📥 ========================================');

      // console.log('🔍 Análisis de response:');
      // console.log('  - response?.codigo:', response?.codigo);
      // console.log('  - Tipo codigo:', typeof response?.codigo);
      // console.log('  - response?.mensaje:', response?.mensaje);
      // console.log('  - response?.idEvaluacion:', response?.idEvaluacion);
      // console.log('  - Condición (codigo > 0):', response?.codigo > 0);
      // console.log('  - Condición (codigo === -3):', response?.codigo === -3);

      if (response?.codigo > 0) {
        // console.log('✅ Entrando a bloque SUCCESS (codigo > 0)');
        
        this.evaluacionCreada = {
          idEvaluacion: response.idEvaluacion || response.codigo,
          idEmpleado: this.empleadoBuscado.id,
          idJefe: this.jefeSeleccionadoEvaluacion.id,
          estado: 'PENDIENTE',
          fase: 0,
          anio: new Date().getFullYear()
        };
        
        // console.log('✅ Evaluación creada:', this.evaluacionCreada);
        // console.log('✅ Mostrando sección de competencias...');
        
        this.mostrarCompetencias = true;
        this.evaluacionGuardada = false;
        this.limpiarFormularioCompetencia();
        this.competenciasAgregadas = [];
        
        // console.log('✅ mostrarCompetencias =', this.mostrarCompetencias);

      } else if (response?.codigo === -3) {
        // console.log('⚠️ Entrando a bloque DUPLICADO (codigo === -3)');
        
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
        console.error('❌ Entrando a bloque ERROR');
        console.error('❌ Codigo recibido:', response?.codigo);
        console.error('❌ Mensaje:', response?.mensaje);
        console.error('❌ Response completa:', response);
        
        alert(`Error: ${response?.mensaje || 'Error desconocido'}`);
        return;
      }

    } catch (error: any) {
      // console.error('💥 ========================================');
      // console.error('💥 CAPTURADO EN CATCH');
      // console.error('💥 Error completo:', error);
      // console.error('💥 Error message:', error?.message);
      // console.error('💥 Error status:', error?.status);
      // console.error('💥 Error statusText:', error?.statusText);
      // console.error('💥 Error error:', error?.error);
      // console.error('💥 ========================================');
      
      alerts.error('Error al comunicarse con el servidor');
      
    } finally {
      this.cargandoEvaluacion = false;
      // console.log('🔚 Finally ejecutado, cargandoEvaluacion =', this.cargandoEvaluacion);
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
            // console.error('❌ No se pudo determinar IdNivelCompetencia para:', comp);
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
