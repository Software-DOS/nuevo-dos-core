import { Component, OnInit } from '@angular/core';

interface Training {
  id: number;
  name: string;
  duration: number;
  startDate?: string;
  completionDate?: string;
  certification: string;
  company: string;
  status?: string;
  price?: string;
  justification?: string;
  link?: string;
}

@Component({
  selector: 'app-empleado-capacitaciones',
  templateUrl: './empleado-capacitaciones.component.html',
  styleUrls: ['./empleado-capacitaciones.component.css']
})
export class EmpleadoCapacitacionesComponent implements OnInit {

  activeTab: string = 'curso';
  showContract: boolean = false;
  showForm: boolean = false;
  showRequestButton: boolean = true;
  contractAccepted: boolean = false;

  // NgModel properties for filters
  filtroEmpresa: string = '';
  filtroRoadmap: string = '';
  
  // NgModel properties for contract
  aceptarContrato: boolean = false;
  
  // NgModel properties for training request form
  nombreCapacitacion: string = '';
  duracionCapacitacion: number = 0;
  certificacionCapacitacion: string = '';
  precioCapacitacion: string = '';
  justificacionCapacitacion: string = '';
  enlaceCapacitacion: string = '';

  // Employee Information for navbar
  employee = {
    name: 'Juan Carlos Rodríguez',
    email: 'juan.rodriguez@empresa.com',
    avatar: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
  };

  // Filters
  filters = {
    company: '',
    roadmap: ''
  };

  // Filter options
  companyOptions = ['Todas', 'HP', 'Cisco', 'Microsoft', 'Oracle'];
  roadmapOptions = ['Todos', 'Scrum', 'Azure', 'AWS', 'CCNA'];

  // Training data
  inProgressTrainings: Training[] = [
    {
      id: 1,
      name: 'Curso de Liderazgo Ágil',
      duration: 20,
      startDate: '05/04/2025',
      certification: 'Scrum Foundation',
      company: 'N/A'
    },
    {
      id: 2,
      name: 'Gestión del Tiempo',
      duration: 10,
      startDate: '01/04/2025',
      certification: 'Productividad Personal',
      company: 'N/A'
    }
  ];

  availableTrainings: Training[] = [
    {
      id: 3,
      name: 'Comunicación Efectiva',
      duration: 15,
      certification: 'Soft Skills Essentials',
      company: 'Oracle'
    },
    {
      id: 4,
      name: 'Excel para Análisis',
      duration: 25,
      certification: 'Certificación Excel Avanzado',
      company: 'Microsoft'
    }
  ];

  completedTrainings: Training[] = [
    {
      id: 5,
      name: 'Gestión de Proyectos',
      duration: 30,
      completionDate: '01/03/2025',
      certification: 'PMI Fundamentals',
      company: 'Cisco'
    },
    {
      id: 6,
      name: 'Introducción a Python',
      duration: 25,
      completionDate: '15/01/2025',
      certification: 'Python Básico',
      company: 'Cisco'
    }
  ];
  requestedTrainings: Training[] = [
    {
      id: 7,
      name: 'Gestión de Proyectos',
      duration: 30,
      completionDate: '01/03/2025',
      certification: 'PMI Fundamentals',
      company: 'N/A',
      status: 'Aprobada'
    }
  ];

  // New training request form
  newTrainingRequest: Training = {
    id: 0,
    name: '',
    duration: 0,
    certification: '',
    company: '',
    price: '',
    justification: '',
    link: ''
  };

  constructor() { }

  ngOnInit(): void {
    this.loadRequestedTrainings();
  }

  switchTab(tabName: string): void {
    this.activeTab = tabName;
  }

  applyFilters(): void {
    // Filter logic would be implemented here
    // For now, just log the filters
    console.log('Applying filters:', this.filters);
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  showRequestForm(): void {
    this.showContract = true;
    this.showRequestButton = false;
  }

  onContractAcceptedChange(): void {
    // contractAccepted is already bound via [(ngModel)]
  }

  signContract(): void {
    if (this.contractAccepted) {
      this.showContract = false;
      this.showForm = true;
    }
  }

  cancelContract(): void {
    // Here you would normally use a proper Angular dialog/alert service
    if (confirm('¿Cancelar solicitud? Se cancelará el proceso de solicitud de capacitación.')) {
      this.showContract = false;
      this.showRequestButton = true;
      this.contractAccepted = false;
      console.log('Solicitud cancelada');
    }
  }

  cancelForm(): void {
    if (confirm('¿Cancelar solicitud? Se cancelará el proceso de solicitud de capacitación.')) {
      this.showForm = false;
      this.showRequestButton = true;
      this.resetForm();
      console.log('Formulario cancelado');
    }
  }

  submitTrainingRequest(): void {
    if (this.isFormValid()) {
      const newRequest: Training = {
        id: Date.now(),
        name: this.newTrainingRequest.name,
        duration: this.newTrainingRequest.duration,
        completionDate: 'Pendiente',
        certification: this.newTrainingRequest.certification,
        company: 'Pendiente',
        status: 'Pendiente',
        price: this.newTrainingRequest.price,
        justification: this.newTrainingRequest.justification,
        link: this.newTrainingRequest.link
      };

      this.requestedTrainings.push(newRequest);
      this.saveRequestedTrainings();
      
      alert('Solicitud enviada. Tu capacitación ha sido registrada correctamente.');
      
      this.resetForm();
      this.showForm = false;
      this.showRequestButton = true;
    } else {
      alert('Por favor completa todos los campos antes de enviar la solicitud.');
    }
  }

  private isFormValid(): boolean {
    return !!(this.newTrainingRequest.name &&
             this.newTrainingRequest.duration &&
             this.newTrainingRequest.certification &&
             this.newTrainingRequest.price &&
             this.newTrainingRequest.justification &&
             this.newTrainingRequest.link);
  }

  private resetForm(): void {
    this.newTrainingRequest = {
      id: 0,
      name: '',
      duration: 0,
      certification: '',
      company: '',
      price: '',
      justification: '',
      link: ''
    };
  }

  private loadRequestedTrainings(): void {
    const stored = localStorage.getItem('capacitacionesSolicitadasEmpleado');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Add to existing requested trainings instead of replacing
        this.requestedTrainings = [...this.requestedTrainings, ...parsed];
      } catch (error) {
        console.error('Error loading requested trainings:', error);
      }
    }
  }

  private saveRequestedTrainings(): void {
    // Save only the dynamically added ones (those with higher IDs)
    const dynamicTrainings = this.requestedTrainings.filter(t => t.id > 1000);
    localStorage.setItem('capacitacionesSolicitadasEmpleado', JSON.stringify(dynamicTrainings));
  }

  toggleDropdown(): void {
    const dropdown = document.getElementById('profileMenu');
    if (dropdown) {
      dropdown.classList.toggle('show');
    }
  }

  logout(): void {
    console.log('Logout clicked');
  }

}
