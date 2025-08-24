import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-evaluacion-admin',
  templateUrl: './evaluacion-admin.component.html',
  styleUrls: ['./evaluacion-admin.component.css']
})
export class EvaluacionAdminComponent implements OnInit {

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

  // Competencies
  competencies = [
    {
      name: 'Trabajo en Equipo',
      description: 'Colabora de manera efectiva con su equipo de trabajo.',
      rating: '⭐⭐⭐⭐'
    },
    {
      name: 'Resolución de Problemas',
      description: 'Capacidad para resolver incidencias técnicas.',
      rating: '⭐⭐⭐'
    }
  ];




  constructor() { }

  ngOnInit(): void {
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
