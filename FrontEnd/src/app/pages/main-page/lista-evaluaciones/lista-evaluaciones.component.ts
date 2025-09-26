import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

import { GthEmpleadoService } from 'src/app/services/gthempleado.service';
import { GthEvaluacionService } from '../../../services/gth-evaluacion.service';
import { GthCompetenciaService } from 'src/app/services/gth-competencia.service';

import { iGTHEmpleado } from '../../../interface/igth-empleado';
import { Ievaluacion } from '../../../interface/ievaluacion';
import { IGTHNivelCompetenciaViewModel, 
  IGTHAsignacionCompetenciaViewModel } 
  from '../../../interface/ight-competencia';

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
    private gthEvaluacionServcie: GthEvaluacionService) {      
  }
    
  

  ngOnInit(): void {
    this.cargarEvaluaciones(); //Cargar empleados con evaluaciones
    this.cargarEmpleadosParaEvaluacion(); // Carga todos los empleados
    this.cargarCompetencias();
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
obtenerResumenEvaluaciones(): void {
  this.gthEvaluacionServcie.MostrarEvaluaciones().subscribe({
    next: (response: any) => {
      let evaluaciones = response;
      if (response && response.$values) {
        evaluaciones = response.$values;
      }
      
      // Agrupar por estado
      const resumen = evaluaciones.reduce((acc: any, evaluacion: Ievaluacion) => {
        acc[evaluacion.estado || ''] = (acc[evaluacion.estado || ''] || 0) + 1;
        return acc;
      }, {});
      
      console.log("📊 Resumen de evaluaciones por estado:", resumen);
    },
    error: (error) => {
      console.error("❌ Error al obtener resumen:", error);
    }
  });
}


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



// /**
//  * Construir la URL completa de la foto de perfil
//  */
//   private construirUrlFoto(fotoPerfilUrl: string, sexo: string): string {
//     // Normalizar sexo (maneja nulos, undefined y mayúsculas)
//     const sexoNormalizado = (sexo || '').toString().trim().toLowerCase();

//     // Si no hay URL de foto, usar imagen por defecto según sexo
//     if (!fotoPerfilUrl) {
//       if (sexoNormalizado === 'femenino' || sexoNormalizado === 'f') {
//         // return 'https://cdn-icons-png.flaticon.com/512/2922/2922561.png'; // niña
//         return 'assets/img/iconos/iconos mycollection/png/001-buena-retroalimentacion.png'; // niña 
//       } else if (sexoNormalizado === 'masculino' || sexoNormalizado === 'm') {
//         // return 'https://cdn-icons-png.flaticon.com/512/2922/2922510.png'; // niño 
//         return 'assets/img/iconos/iconos mycollection/png/008-subiendo-escaleras.png'; // niño
//       } else {
//         // Imagen genérica si no se reconoce el valor
//         return 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
//       }
//     }

//     // Si ya es una URL completa (http/https), devolverla tal como está
//     if (fotoPerfilUrl.startsWith('http://') || fotoPerfilUrl.startsWith('https://')) {
//       return fotoPerfilUrl;
//     }

//     // Si es una ruta relativa, construir URL completa con el backend
//     const baseUrl = environment.urlbackend.endsWith('/') 
//       ? environment.urlbackend.slice(0, -1) 
//       : environment.urlbackend;

//     if (fotoPerfilUrl.startsWith('/')) {
//       return `${baseUrl}${fotoPerfilUrl}`;
//     }

//     return `${baseUrl}/${fotoPerfilUrl}`;
//   }

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
    // Navigate to evaluation page
    // Adjust the route path according to your routing configuration
    this.router.navigate(['/evaluacion', empleadoId]);
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
  
  // ===============================
  // 📌 FUNCION PARA CREAR UNA NUEVA EVALUACION
  // ===============================

  empleadosTodos: any[] = [];
  empleadosFiltrados2: any[] = []; //filtro para buscar empleado por area y crear evaluacion
  empleadoBuscado: any = null; //Buscar empleado para crear evaluacion

  // Filtros para buscar empleado y Crear evaluacion
  filtroAreaBuscarEmp: string = '';

  // empleadoSeleccionado: any = null;

  

  evaluacionCreada: any = null; // Para almacenar la evaluación creada
  cargandoEvaluacion: boolean = false;
  cargandoEmpleados: boolean = false;




  // Control de visibilidad
  mostrarCompetencias: boolean = false;
  evaluacionGuardada: boolean = false;
  
  competenciasAgregadas: any[] = [];

  
  /*=====================   Buscar empleado para crear su esapcio de competencias ======================*/

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

  // Método que se ejecuta cuando se selecciona un empleado
  onEmpleadoBuscadoSeleccionado(): void {
    if (this.empleadoBuscado?.id) {
      console.log('Empleado buscado seleccionado:', this.empleadoBuscado);
      this.evaluacionCreada = null; // Limpiar evaluación previa
    } else {
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

    this.cargandoEvaluacion = true;

    try {
      // Crear evaluación primero
      const nuevaEvaluacion: Ievaluacion = {
        idEmpleado: this.empleadoBuscado.id,
        idJefe: this.empleadoBuscado.idJefe || null,
        anio: new Date().getFullYear(),
        estado: 'PENDIENTE',
        usuarioCreacion: 'SISTEMA',
        fase: 0
      };

      const response = await this.gthEvaluacionServcie
        .crearGthEvaluacion(nuevaEvaluacion)
        .toPromise();

      // Si todo sale bien (nuevo o existente), mostrar la sección
      if (response?.codigo > 0) {
        // Evaluación creada
        this.evaluacionCreada = {
          idEvaluacion: response.idEvaluacion || response.codigo,
          idEmpleado: this.empleadoBuscado.id,
          estado: 'PENDIENTE',
          fase: 0,
          anio: new Date().getFullYear()
        };
        console.log('✅ Nueva evaluación creada:', this.evaluacionCreada);
        //alerts.exito('Nueva evaluación creada:');
        this.mostrarCompetencias = true;

      } else if (response?.codigo === -3) {
        // Evaluación existente
        this.evaluacionCreada = {
          idEvaluacion: 999, // ⚠️ Valor fijo (placeholder)
          idEmpleado: this.empleadoBuscado.id,
          estado: 'EN_PROCESO',
          fase: 1,
          anio: new Date().getFullYear()
        };
        alerts.info('Este colaborador ya cuenta con una evaluacion para este año');        

      } else {
        alert(`Error: ${response?.mensaje || 'Error desconocido'}`);
        console.error('❌ Error en respuesta de crearGthEvaluacion:', response);
        return;
      }

      // Usar tu lógica original      
      this.evaluacionGuardada = false;

      // Limpiar formulario de competencias
      this.limpiarFormularioCompetencia();
      this.competenciasAgregadas = [];

    } catch (error) {
      alerts.error('Error al comunicarse con el servidor');
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
