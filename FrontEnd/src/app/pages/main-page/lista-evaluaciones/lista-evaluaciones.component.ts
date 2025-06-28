import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
  filtroCalificado: string = '';
  filtroUbicacion: string = '';
  filtroIdioma: string = '';

  filtros: Filtros = {
    departamento: '',
    calificado: '',
    ubicacion: '',
    idioma: ''
  };

  empleados: Empleado[] = [
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

  empleadosFiltrados: Empleado[] = [];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.empleadosFiltrados = [...this.empleados];
  }

  aplicarFiltros(): void {
    this.empleadosFiltrados = this.empleados.filter(empleado => {
      const coincideDepto = !this.filtros.departamento || 
        empleado.departamento.toLowerCase() === this.filtros.departamento.toLowerCase();
      
      const coincideCalif = !this.filtros.calificado || 
        empleado.calificado.toLowerCase() === this.filtros.calificado.toLowerCase();
      
      const coincideUbicacion = !this.filtros.ubicacion || 
        empleado.ubicacion?.toLowerCase() === this.filtros.ubicacion.toLowerCase();
      
      const coincideIdioma = !this.filtros.idioma || 
        empleado.idioma?.toLowerCase() === this.filtros.idioma.toLowerCase();

      return coincideDepto && coincideCalif && coincideUbicacion && coincideIdioma;
    });
  }

  navigateToEvaluacion(empleadoId: number): void {
    // Navigate to evaluation page
    // Adjust the route path according to your routing configuration
    this.router.navigate(['/evaluacion', empleadoId]);
  }
}
