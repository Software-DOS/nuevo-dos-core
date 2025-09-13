import { Component, OnInit } from '@angular/core';
import { GthCompetenciaService } from '../../../services/gth-competencia.service';
import { IGTHCompetenciaViewModel } from '../../../interface/ight-competencia';

@Component({
  selector: 'app-jefe-evaluacion',
  templateUrl: './jefe-evaluacion.component.html',
  styleUrls: ['./jefe-evaluacion.component.css']
})
export class JefeEvaluacionComponent implements OnInit {

  // Variable para el menú principal (superior)
  activeSection: string = 'hoja-ruta'; // Siempre inicia en hoja de ruta
  
  // Variable para el timeline (sub-menú cuando está en hoja-ruta)
  activeTimelineStep: string = 'Revision-Inicial'; // Por defecto la primera sección para admin


  // Employee Information
  employee = {
    name: 'Juan Carlos Rodríguez Martínez',
    email: 'juan.rodriguez@empresa.com',
    position: 'Analista de Sistemas',
    area: 'Tecnología de la Información',
    subarea: 'Desarrollo de Aplicaciones',
    avatar: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
  };

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

  // Timeline Steps - Solo para administrador
  timelineSteps = [
    { 
      number: 1, 
      label: 'Revisión Inicial', 
      completed: true,
      icon: 'fas fa-check',
      pngIcon: 'assets/img/iconos/iconos mycollection/png/035-retroalimentacion-7.png',
      sectionId: 'Revision-Inicial'
    },
    { 
      number: 2, 
      label: 'Retroalimentación', 
      completed: false,
      pngIcon: 'assets/img/iconos/iconos mycollection/png/028-grafico.png',
      sectionId: 'Retroalimentacion'
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
  // Método para el timeline (solo funciona cuando está en hoja-ruta)
  onStepClick(step: any): void {
    // Solo cambiar el step si estamos en la sección hoja-ruta
    if (this.activeSection === 'hoja-ruta') {
      this.activeTimelineStep = step.sectionId;
      console.log('Timeline step seleccionado:', this.activeTimelineStep);
    }
  }
  // Método para verificar si un step del timeline está activo
  isTimelineStepActive(sectionId: string): boolean {
    return this.activeSection === 'hoja-ruta' && this.activeTimelineStep === sectionId;
  }

  // Método para verificar si estamos en la sección hoja-ruta
  isInHojaRuta(): boolean {
    return this.activeSection === 'hoja-ruta';
  }





  // Objectives (KPIs) - Objetivos precargados del empleado
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

  // Competencias dinámicas - Se cargarán desde el backend
  competencies: IGTHCompetenciaViewModel[] = [];
  loadingCompetencies: boolean = false;

  // Objetivos del empleado - Precargados desde el sistema
  objetivos = [
    {
      id: 1,
      texto: 'Implementar sistema de gestión de documentos',
      valor: 85,
      fecha: '2025-03-15',
      reconsiderar: null as number | null,
      valorAdmin: null as number | null, // Valor asignado por el administrador
      fechaAdmin: '' as string // Fecha de retroalimentación del admin
    },
    {
      id: 2,
      texto: 'Optimizar rendimiento de aplicaciones existentes',
      valor: 75,
      fecha: '2025-04-20',
      reconsiderar: null as number | null,
      valorAdmin: null as number | null,
      fechaAdmin: ''
    },
    {
      id: 3,
      texto: 'Capacitar al equipo en nuevas tecnologías',
      valor: 90,
      fecha: '2025-05-10',
      reconsiderar: null as number | null,
      valorAdmin: null as number | null,
      fechaAdmin: ''
    },
    {
      id: 4,
      texto: 'Desarrollar módulo de reportes automatizados',
      valor: 60,
      fecha: '2025-06-30',
      reconsiderar: null as number | null,
      valorAdmin: null as number | null,
      fechaAdmin: ''
    },
    {
      id: 5,
      texto: 'Establecer protocolo de respaldo de datos',
      valor: 95,
      fecha: '2025-02-28',
      reconsiderar: null as number | null,
      valorAdmin: null as number | null,
      fechaAdmin: ''
    }
  ];




  constructor(private gthCompetenciaService: GthCompetenciaService) { }

  ngOnInit(): void {
    // Cargar las primeras 5 competencias al inicializar el componente
    this.cargarCompetenciasAdmin();
  }

  /**
   * Carga las primeras 5 competencias desde el backend para la vista administrativa
   */
  cargarCompetenciasAdmin(): void {
    console.log('🚀 Iniciando carga de competencias para administrador...');
    this.loadingCompetencies = true;
    
    this.gthCompetenciaService.obtenerPrimeras5Competencias()
      .subscribe({
        next: (competencias: IGTHCompetenciaViewModel[]) => {
          console.log('📊 Competencias obtenidas para admin:', competencias);
          
          this.competencies = competencias;
          this.loadingCompetencies = false;
          
          console.log('✅ Competencias cargadas exitosamente para administrador');
        },
        error: (error) => {
          console.error('❌ Error al cargar competencias para administrador:', error);
          this.loadingCompetencies = false;
          this.competencies = [];
        }
      });
  }

  /**
   * Actualiza el valor de "reconsiderar" asignado por el administrador
   * @param index - Índice del objetivo (0-4)
   * @param valor - Valor de reconsideración asignado por el admin
   */
  actualizarReconsiderarAdmin(index: number, valor: number): void {
    if (index >= 0 && index < this.objetivos.length) {
      if (!isNaN(valor) && valor >= 0 && valor <= 100) {
        this.objetivos[index].reconsiderar = valor;
        console.log(`🔄 Admin - Reconsiderar objetivo ${index + 1}:`, valor, this.objetivos[index]);
      }
    }
  }

  /**
   * Actualiza el valor asignado por el administrador
   * @param index - Índice del objetivo (0-4)
   * @param valor - Valor asignado por el admin
   */
  actualizarValorAdmin(index: number, valor: number): void {
    if (index >= 0 && index < this.objetivos.length) {
      if (!isNaN(valor) && valor >= 0 && valor <= 100) {
        this.objetivos[index].valorAdmin = valor;
        console.log(`📊 Admin - Valor objetivo ${index + 1}:`, valor, this.objetivos[index]);
      }
    }
  }

  /**
   * Actualiza la fecha de retroalimentación asignada por el administrador
   * @param index - Índice del objetivo (0-4)
   * @param fecha - Fecha de retroalimentación
   */
  actualizarFechaAdmin(index: number, fecha: string): void {
    if (index >= 0 && index < this.objetivos.length) {
      this.objetivos[index].fechaAdmin = fecha;
      console.log(`📅 Admin - Fecha objetivo ${index + 1}:`, fecha, this.objetivos[index]);
    }
  }

  /**
   * Calcula el porcentaje promedio basado en las evaluaciones del empleado
   * @returns Porcentaje promedio de los objetivos del empleado
   */
  calcularPorcentajeEmpleado(): number {
    const objetivosConValor = this.objetivos.filter(obj => obj.valor !== null && obj.valor > 0);
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
    const objetivosConValorAdmin = this.objetivos.filter(obj => obj.valorAdmin !== null && obj.valorAdmin > 0);
    if (objetivosConValorAdmin.length === 0) return 0;
    
    const suma = objetivosConValorAdmin.reduce((acc, obj) => acc + (obj.valorAdmin || 0), 0);
    const promedio = suma / objetivosConValorAdmin.length;
    
    return Math.round(promedio);
  }

  // showSection(targetId: string): void {
  //   this.activeSection = targetId;
  // }
  // Método para el menú principal
  showSection(targetId: string): void {
    this.activeSection = targetId;
    
    // Si selecciona "hoja-ruta", resetea al primer paso del timeline
    if (targetId === 'hoja-ruta') {
      this.activeTimelineStep = 'Revision-Inicial';
    }
    
    console.log('Sección principal activa:', this.activeSection);
    console.log('Step del timeline activo:', this.activeTimelineStep);
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
