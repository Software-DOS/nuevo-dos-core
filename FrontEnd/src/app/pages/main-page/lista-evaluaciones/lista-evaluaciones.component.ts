import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GthEmpleadoService } from '../../../services/gthempleado.service';
import { iGTHEmpleado } from '../../../interface/igth-empleado';
import { environment } from '../../../../environments/environment';

interface Empleado {
  id: number;
  nombre: string;
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

  empleados: Empleado[] = [];

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
    return empleadosBackend.map(emp => ({
      id: emp.idEmpleado || 0,
      nombre: `${emp.nombre || ''} ${emp.apellido || ''}`.trim() || 'N/A',
      departamento: emp.area || 'N/A',
      fechaIncorporacion: emp.fechaContratacion || 'N/A',
      calificado: 'N/A', // No existe en el backend
      photo: this.construirUrlFoto(emp.fotoPerfilUrl),
      ubicacion: emp.ubicacion || 'N/A',
      idioma: 'N/A' // No existe en el backend
    }));
  }

  /**
   * Construir la URL completa de la foto de perfil
   */
  private construirUrlFoto(fotoPerfilUrl: string): string {
    // Si no hay URL de foto, usar imagen por defecto
    if (!fotoPerfilUrl) {
      return 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
    }

    // Si ya es una URL completa (http/https), devolverla tal como está
    if (fotoPerfilUrl.startsWith('http://') || fotoPerfilUrl.startsWith('https://')) {
      return fotoPerfilUrl;
    }

    // Si es una ruta relativa, construir URL completa con el backend
    if (fotoPerfilUrl.startsWith('/')) {
      // Remover la barra final del backend URL si existe
      const baseUrl = environment.urlbackend.endsWith('/') 
        ? environment.urlbackend.slice(0, -1) 
        : environment.urlbackend;
      
      return `${baseUrl}${fotoPerfilUrl}`;
    }

    // Si no comienza con /, agregar la barra y el backend URL
    const baseUrl = environment.urlbackend.endsWith('/') 
      ? environment.urlbackend.slice(0, -1) 
      : environment.urlbackend;
    
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
        departamento: 'Desarrollo',
        fechaIncorporacion: '05/04/2025',
        calificado: 'Si',
        photo: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
        ubicacion: 'Quito',
        idioma: 'Inglés'
      },
      {
        id: 2,
        nombre: 'Juan Casas',
        departamento: 'Recursos Humanos',
        fechaIncorporacion: '01/04/2025',
        calificado: 'No',
        photo: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
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
}
