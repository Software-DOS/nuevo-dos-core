import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GthEmpleadoService } from '../../../services/gthempleado.service';
import { iGTHEmpleado } from '../../../interface/igth-empleado';
import { environment } from '../../../../environments/environment';

interface Empleado {
  id: number;
  nombre: string;
  sexo: string; 
  departamento: string;
  fechaIncorporacion: string;
  calificado: string;
  photo: string;
  ubicacion?: string;
  idioma?: string;
}

interface Filtros {
  departamento: string;
  calificado: string;
  ubicacion: string;
  idioma: string;
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
  filtroArea: string = '';
  filtroEmpleado: string = '';

  // Aquí puedes cargar la lista real desde tu API
  empleados: any[] = [
    { id: 1, nombre: 'Juan Pérez', area: 'Finanzas', estado: 'PENDIENTE' },
    { id: 2, nombre: 'Ana Torres', area: 'Talento Humano', estado: 'COMPLETA' },
    { id: 3, nombre: 'Luis Gómez', area: 'Logística', estado: 'EN PROCESO' }
  ];

  //Variables para la pestaña Crear Evaluacion
  // ==================================
  // 📌 Selecciones del formulario
  // ==================================
  tipoCompetencia: string = '';
  competenciaSeleccionada: string = '';
  nivelSeleccionado: string = '';

  // ==========================
  // 📌 Competencias y niveles
  // ==========================
  tiposCompetencias: string[] = [
    'Técnica',
    'Conductual',
    'Liderazgo',
    'Trabajo en Equipo',
    'Innovación'
  ];

  competencias: string[] = [
    'Comunicación',
    'Planificación',
    'Resolución de Problemas',
    'Orientación a Resultados',
    'Adaptabilidad',
    'Gestión del Tiempo',
    'Trabajo bajo presión',
    'Creatividad',
    'Pensamiento Crítico',
    'Delegación',
    'Negociación',
    'Gestión de Conflictos',
    'Toma de Decisiones',
    'Aprendizaje Continuo',
    'Colaboración'
  ];

  niveles: string[] = [
    'Nivel 1 - Básico',
    'Nivel 2 - Intermedio',
    'Nivel 3 - Avanzado',
    'Nivel 4 - Experto',
    'Nivel 5 - Referente'
  ];


  //-----------------------------         ------------------------------------        ---------------------------------

  // NgModel properties for filters
  filtroDepartamento: string = '';
  filtroNombre: string = '';
  filtroCalificado: string = '';
  filtroUbicacion: string = '';
  filtroIdioma: string = '';

  filtros: Filtros = {
    departamento: '',
    calificado: '',
    ubicacion: '',
    idioma: ''
  };

  //empleados: Empleado[] = [];

  empleadosFiltrados: Empleado[] = [];

  constructor(private router: Router, private gthEmpleadoService: GthEmpleadoService) { }

  ngOnInit(): void {
    this.cargarEmpleados();
  }

  /**
   * Cargar empleados desde el backend
   */
  cargarEmpleados(): void {
    // Primero intentar con todos los empleados sin filtros
    this.gthEmpleadoService.Mostrar().subscribe({
      next: (response: any) => {
        // Manejar la estructura JSON.NET con $values
        let empleadosData = response;
        if (response && response.$values) {
          empleadosData = response.$values;
        }
        
        if (empleadosData && Array.isArray(empleadosData)) {
          this.empleados = this.mapearEmpleados(empleadosData);
          this.empleadosFiltrados = [...this.empleados];
        } else {
          // Intentar con parámetros
          this.cargarEmpleadosConParametros();
        }
      },
      error: (error) => {
        console.error('Error al cargar empleados:', error);
        this.cargarEmpleadosConParametros();
      }
    });
  }

  /**
   * Cargar empleados con parámetros específicos
   */
  private cargarEmpleadosConParametros(): void {
    // Obtener todos los empleados con parámetros (tipo = 0 para todos)
    this.gthEmpleadoService.MostrarConParametros(0).subscribe({
      next: (response: any) => {
        // Manejar la estructura JSON.NET con $values
        let empleadosData = response;
        if (response && response.$values) {
          empleadosData = response.$values;
        }
        
        if (empleadosData && Array.isArray(empleadosData)) {
          this.empleados = this.mapearEmpleados(empleadosData);
          this.empleadosFiltrados = [...this.empleados];
        } else {
          this.cargarDatosPorDefecto();
        }
      },
      error: (error) => {
        console.error('Error al cargar empleados con parámetros:', error);
        this.cargarDatosPorDefecto();
      }
    });
  }

  /**
   * Mapear datos del backend al formato requerido por el frontend
   */
  private mapearEmpleados(empleadosBackend: any[]): Empleado[] {
  return empleadosBackend.map(emp => {
    // Validamos si viene sexo y lo mostramos en consola para debug
    if (!emp.sexo) {
      console.warn(`Empleado ${emp.idEmpleado || 'sin ID'} no tiene valor en 'sexo'`);
    } else {
      console.log(`Empleado ${emp.idEmpleado || 'sin ID'} - Sexo recibido: ${emp.sexo}`);
    }

    return {
      id: emp.idEmpleado || 0,
      nombre: `${emp.nombre || ''} ${emp.apellido || ''}`.trim() || 'N/A',
      departamento: emp.area || 'N/A',
      fechaIncorporacion: emp.fechaContratacion || 'N/A',
      calificado: 'N/A', // No existe en el backend
      sexo: emp.sexo || 'N/A', // fallback si no viene
      // photo: this.construirUrlFoto(emp.fotoPerfilUrl, emp.sexo), 
      photo: this.construirUrlFoto('', emp.sexo), // 👈 pasamos el valor real
      ubicacion: emp.ubicacion || 'N/A',
      idioma: 'N/A', // No existe en el backend
      estado: 'Pendiente'
    };
  });
}


/**
 * Construir la URL completa de la foto de perfil
 */
  private construirUrlFoto(fotoPerfilUrl: string, sexo: string): string {
    // Normalizar sexo (maneja nulos, undefined y mayúsculas)
    const sexoNormalizado = (sexo || '').toString().trim().toLowerCase();

    // Si no hay URL de foto, usar imagen por defecto según sexo
    if (!fotoPerfilUrl) {
      if (sexoNormalizado === 'femenino' || sexoNormalizado === 'f') {
        return 'https://cdn-icons-png.flaticon.com/512/2922/2922561.png'; // 👩
      } else if (sexoNormalizado === 'masculino' || sexoNormalizado === 'm') {
        return 'https://cdn-icons-png.flaticon.com/512/2922/2922510.png'; // 👨
      } else {
        // Imagen genérica si no se reconoce el valor
        return 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
      }
    }

    // Si ya es una URL completa (http/https), devolverla tal como está
    if (fotoPerfilUrl.startsWith('http://') || fotoPerfilUrl.startsWith('https://')) {
      return fotoPerfilUrl;
    }

    // Si es una ruta relativa, construir URL completa con el backend
    const baseUrl = environment.urlbackend.endsWith('/') 
      ? environment.urlbackend.slice(0, -1) 
      : environment.urlbackend;

    if (fotoPerfilUrl.startsWith('/')) {
      return `${baseUrl}${fotoPerfilUrl}`;
    }

    return `${baseUrl}/${fotoPerfilUrl}`;
  }



  /**
   * Cargar datos por defecto en caso de error
   */
  private cargarDatosPorDefecto(): void {
    this.empleados = [
      {
        id: 1,
        nombre: 'José Casas',
        area: 'Desarrollo',
        fechaIncorporacion: '05/04/2025',
        calificado: 'Si',
        photo: '',
        ubicacion: 'Quito',
        idioma: 'Inglés'
      },
      {
        id: 2,
        nombre: 'Juan Casas',
        area: 'Recursos Humanos',
        fechaIncorporacion: '01/04/2025',
        calificado: 'No',
        photo: '',
        ubicacion: 'Guayaquil',
        idioma: 'Español'
      }
    ];
    this.empleadosFiltrados = [...this.empleados];
  }

  aplicarFiltros(): void {
    this.empleadosFiltrados = this.empleados.filter(empleado => {
      // Filtro de departamento como búsqueda de texto (case insensitive)
      const coincideDepto = !this.filtroDepartamento || 
        empleado.departamento.toLowerCase().includes(this.filtroDepartamento.toLowerCase());
      
      // Filtro de nombre como búsqueda de texto (case insensitive)
      const coincideNombre = !this.filtroNombre || 
        empleado.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase());
      
      // Filtro de calificado (exacto)
      const coincideCalif = !this.filtroCalificado || 
        empleado.calificado.toLowerCase() === this.filtroCalificado.toLowerCase();
      
      // Filtro de ubicación (exacto)
      const coincideUbicacion = !this.filtroUbicacion || 
        empleado.ubicacion?.toLowerCase() === this.filtroUbicacion.toLowerCase();
      
      // Filtro de idioma (exacto)
      const coincideIdioma = !this.filtroIdioma || 
        empleado.idioma?.toLowerCase() === this.filtroIdioma.toLowerCase();

      return coincideDepto && coincideNombre && coincideCalif && coincideUbicacion && coincideIdioma;
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
  // FUNCION PARA CREAR UNA NUEVA EVALUACION
  // ===============================
  // 📌 Función para guardar
  // ===============================
  guardarEvaluacion(): void {
    const evaluacion = {
      empleado: this.filtroEmpleado,
      area: this.filtroArea,
      tipoCompetencia: this.tipoCompetencia,
      competencia: this.competenciaSeleccionada,
      nivel: this.nivelSeleccionado
    };

    console.log('📌 Evaluación creada:', evaluacion);

    // Aquí deberías llamar al servicio que guarde en tu backend
    // this.evaluacionService.crearEvaluacion(evaluacion).subscribe(...)
  }
}
