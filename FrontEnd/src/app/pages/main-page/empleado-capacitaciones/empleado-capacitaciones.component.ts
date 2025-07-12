import { Component, OnInit } from '@angular/core';
import { GthCapacitacionService } from 'src/app/services/gthcapacitacion.service';
import { iGTHCapacitacion } from 'src/app/interface/ight-capacitacion';

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

  constructor(private gthCapacitacionService: GthCapacitacionService) { }

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
      // Crear objeto de capacitación compatible con el backend
      const capacitacionData: iGTHCapacitacion = {
        tipo: 0, // 0 = Insertar
        idCapacitacion: 0, // Se generará en el backend
        idEntidadCap: 1, // Valor por defecto, se puede hacer dinámico después
        nombre: this.nombreCapacitacion,
        titulo: this.nombreCapacitacion, // Usar el mismo nombre como título
        categoria: 'Solicitud de Empleado',
        descripcion: this.justificacionCapacitacion,
        estado: 'Solicitada',
        fechaInicio: undefined,
        fechaFin: undefined,
        fechaExpiracion: undefined,
        urlVerificacion: this.enlaceCapacitacion,
        archivosAdjuntos: '',
        observaciones: `Precio estimado: ${this.precioCapacitacion}`,
        duracion: this.duracionCapacitacion,
        costo: this.parsePrice(this.precioCapacitacion),
        modalidad: 'Por definir'
      };

      // Llamar al servicio para guardar en el backend
      this.gthCapacitacionService.GuardarGthCapacitacion(capacitacionData).subscribe({
        next: (response: any) => {
          console.log('Capacitación guardada exitosamente:', response);
          
          // También agregar a la lista local para mostrar inmediatamente
          const newRequest: Training = {
            id: Date.now(),
            name: this.nombreCapacitacion,
            duration: this.duracionCapacitacion,
            completionDate: 'Pendiente',
            certification: this.certificacionCapacitacion,
            company: 'Pendiente',
            status: 'Solicitada',
            price: this.precioCapacitacion,
            justification: this.justificacionCapacitacion,
            link: this.enlaceCapacitacion
          };

          this.requestedTrainings.push(newRequest);
          this.saveRequestedTrainings();
          
          alert('Solicitud enviada exitosamente. Tu capacitación ha sido registrada en el sistema.');
          
          this.resetForm();
          this.showForm = false;
          this.showRequestButton = true;
        },
        error: (error) => {
          console.error('Error al guardar la capacitación:', error);
          alert('Error al enviar la solicitud. Por favor, intenta nuevamente.');
        }
      });
    } else {
      alert('Por favor completa todos los campos antes de enviar la solicitud.');
    }
  }

  private parsePrice(priceString: string): number {
    // Extraer números del string de precio
    const numericValue = priceString.replace(/[^0-9.]/g, '');
    return parseFloat(numericValue) || 0;
  }

  private isFormValid(): boolean {
    return !!(this.nombreCapacitacion &&
             this.duracionCapacitacion &&
             this.certificacionCapacitacion &&
             this.precioCapacitacion &&
             this.justificacionCapacitacion &&
             this.enlaceCapacitacion);
  }

  private resetForm(): void {
    this.nombreCapacitacion = '';
    this.duracionCapacitacion = 0;
    this.certificacionCapacitacion = '';
    this.precioCapacitacion = '';
    this.justificacionCapacitacion = '';
    this.enlaceCapacitacion = '';
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
