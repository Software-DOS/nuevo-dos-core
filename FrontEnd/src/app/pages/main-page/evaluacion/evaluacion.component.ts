import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-evaluacion',
  templateUrl: './evaluacion.component.html',
  styleUrls: ['./evaluacion.component.css']
})
export class EvaluacionComponent implements OnInit {

  activeSection: string = 'hoja-ruta';

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

  // Timeline Steps
  timelineSteps = [
    { number: 1, label: 'Inicio', completed: true, icon: 'fas fa-check' },
    { number: 2, label: 'Revisión Inicial', completed: false },
    { number: 3, label: 'Evaluación Intermedia', completed: false },
    { number: 4, label: 'Retroalimentación', completed: false },
    { number: 5, label: 'Cierre', completed: false }
  ];

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

  showSection(targetId: string): void {
    this.activeSection = targetId;
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
