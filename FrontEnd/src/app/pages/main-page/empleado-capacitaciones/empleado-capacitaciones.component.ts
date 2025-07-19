import { Component, OnInit } from '@angular/core';
import { GthCapacitacionService } from 'src/app/services/gthcapacitacion.service';
import { GthSolicitudCapacitacionService, GTHSolicitudCapacitacionModel } from 'src/app/services/gth-solicitud-capacitacion.service';
import { iGTHCapacitacion } from 'src/app/interface/ight-capacitacion';
import Swal from 'sweetalert2';

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

  availableTrainings: Training[] = [];

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

  constructor(
    private gthCapacitacionService: GthCapacitacionService,
    private gthSolicitudCapacitacionService: GthSolicitudCapacitacionService
  ) { }

  ngOnInit(): void {
    this.loadRequestedTrainings();
    this.cargarCapacitacionesDesdeBackend();
    this.cargarCapacitacionesSolicitadas();
  }

  private cargarCapacitacionesDesdeBackend(): void {
    // Cargar capacitaciones disponibles del backend (solo las que tienen estado "Disponible")
    this.gthCapacitacionService.MostrarCapacitaciones(0, undefined, undefined, 'Disponible').subscribe({
      next: (response: any) => {
        // El backend devuelve un objeto con $values que contiene el array real
        const capacitaciones = response.$values || response;
        
        if (capacitaciones && Array.isArray(capacitaciones)) {
          // Convertir las capacitaciones del backend al formato local
          // Solo incluir las que tienen estado "Disponible"
          this.availableTrainings = capacitaciones
            .filter((cap: any) => cap.estado === 'Disponible')
            .map((cap: any) => ({
              id: cap.idCapacitacion || 0,
              name: cap.nombre || '',
              duration: cap.duracion || 0,
              certification: cap.titulo || cap.nombre || '', // Usar título o nombre como respaldo
              company: 'N/A' // Removemos el campo empresa como solicitado
            }));
        }
      },
      error: (error) => {
        console.error('Error al cargar capacitaciones del backend:', error);
      }
    });
  }

  private cargarCapacitacionesSolicitadas(): void {
    // Cargar capacitaciones solicitadas desde el backend (solo las que tienen estado "Solicitada")
    this.gthCapacitacionService.MostrarCapacitaciones(0, undefined, undefined, 'Solicitada').subscribe({
      next: (response: any) => {
        const capacitaciones = response.$values || response;
        
        if (capacitaciones && Array.isArray(capacitaciones)) {
          // Convertir las capacitaciones solicitadas del backend al formato local
          // Solo incluir las que tienen estado "Solicitada"
          const capacitacionesBackend: Training[] = capacitaciones
            .filter((cap: any) => cap.estado === 'Solicitada')
            .map((cap: any) => ({
              id: cap.idCapacitacion || 0,
              name: cap.nombre || '',
              duration: cap.duracion || 0,
              certification: cap.titulo || cap.nombre || '',
              company: 'Por definir',
              status: cap.estado || 'Solicitada',
              price: cap.costo ? `$${cap.costo}` : 'N/A',
              justification: cap.descripcion || '',
              link: cap.urlVerificacion || '',
              completionDate: 'Pendiente'
            }));
          
          // Mantener también las capacitaciones locales (las que se acaban de agregar)
          const localRequested = this.requestedTrainings.filter(t => t.id > 1000);
          
          // Combinar ambas listas evitando duplicados
          this.requestedTrainings = [
            ...capacitacionesBackend,
            ...localRequested.filter(local => 
              !capacitacionesBackend.some(backend => backend.name === local.name)
            )
          ];
        }
      },
      error: (error) => {
        console.error('Error al cargar capacitaciones solicitadas:', error);
      }
    });
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
    Swal.fire({
      title: '¿Cancelar solicitud?',
      text: 'Se cancelará el proceso de solicitud de capacitación.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, continuar',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d'
    }).then((result) => {
      if (result.isConfirmed) {
        this.showContract = false;
        this.showRequestButton = true;
        this.contractAccepted = false;
        
        Swal.fire({
          title: 'Solicitud cancelada',
          text: 'El proceso de solicitud ha sido cancelado.',
          icon: 'info',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#17a2b8'
        });
      }
    });
  }

  cancelForm(): void {
    Swal.fire({
      title: '¿Cancelar formulario?',
      text: 'Se perderán todos los datos ingresados en el formulario.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, continuar',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d'
    }).then((result) => {
      if (result.isConfirmed) {
        this.showForm = false;
        this.showRequestButton = true;
        this.resetForm();
        
        Swal.fire({
          title: 'Formulario cancelado',
          text: 'El formulario ha sido cancelado y los datos se han limpiado.',
          icon: 'info',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#17a2b8'
        });
      }
    });
  }

  submitTrainingRequest(): void {
    if (this.isFormValid()) {
      // Crear objeto de capacitación compatible con el backend
      const capacitacionData: iGTHCapacitacion = {
        tipo: 0, // 0 = Insertar
        idCapacitacion: 0, // Se generará en el backend
        idEntidadCap: 1, // Valor por defecto, se puede hacer dinámico después
        nombre: this.nombreCapacitacion,
        titulo: this.certificacionCapacitacion, // Usar la certificación como título
        categoria: 'Solicitadas',
        descripcion: this.justificacionCapacitacion,
        estado: 'Solicitada', // SIEMPRE será "Solicitada" desde el formulario del empleado
        fechaInicio: undefined,
        fechaFin: undefined,
        fechaExpiracion: undefined,
        urlVerificacion: this.enlaceCapacitacion,
        archivosAdjuntos: '',
        observaciones: `Precio estimado: ${this.precioCapacitacion}`,
        duracion: this.duracionCapacitacion,
        costo: this.parsePrice(this.precioCapacitacion),
        modalidad: 'Virtual' // Valor por defecto más específico
      };

      // Paso 1: Crear la capacitación y obtener el ID generado
      this.gthCapacitacionService.crearCapacitacion(capacitacionData).subscribe({
        next: (idCapacitacionGenerado: number) => {
          console.log('ID de capacitación generado:', idCapacitacionGenerado);
          
          // Paso 2: Crear la solicitud de capacitación usando el ID generado
          const solicitudData: GTHSolicitudCapacitacionModel = {
            tipo: 0, // 0 = Insertar
            idCapacitacion: idCapacitacionGenerado,
            idEmpleado: 0, // Se resolverá por cédula
            cedulaEmpleado: '1234567890', // TODO: Obtener la cédula del usuario logueado
            justificacion: this.justificacionCapacitacion,
            fechaSolicitud: new Date()
          };

          // Crear la solicitud
          this.gthSolicitudCapacitacionService.crearSolicitudCapacitacion(solicitudData).subscribe({
            next: (responseSolicitud: any) => {
              console.log('Solicitud de capacitación creada:', responseSolicitud);
              
              // Agregar a la lista local para mostrar inmediatamente
              const newRequest: Training = {
                id: idCapacitacionGenerado,
                name: this.nombreCapacitacion,
                duration: this.duracionCapacitacion,
                completionDate: 'Pendiente',
                certification: this.certificacionCapacitacion,
                company: 'Por definir',
                status: 'Solicitada',
                price: this.precioCapacitacion,
                justification: this.justificacionCapacitacion,
                link: this.enlaceCapacitacion
              };

              this.requestedTrainings.push(newRequest);
              this.saveRequestedTrainings();
              
              // Mostrar mensaje de éxito
              this.showSuccessMessage();
              
              this.resetForm();
              this.showForm = false;
              this.showRequestButton = true;
              
              // Recargar capacitaciones solicitadas
              this.cargarCapacitacionesSolicitadas();
            },
            error: (error) => {
              console.error('Error al crear la solicitud de capacitación:', error);
              this.showErrorMessage();
            }
          });
        },
        error: (error) => {
          console.error('Error al crear la capacitación:', error);
          this.showErrorMessage();
        }
      });
    } else {
      this.showValidationMessage();
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

  // Métodos para mostrar mensajes con SweetAlert2
  private showSuccessMessage(): void {
    Swal.fire({
      title: '¡Solicitud enviada exitosamente!',
      text: 'Tu capacitación ha sido registrada en el sistema con estado "Solicitada".',
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#28a745'
    });
  }

  private showErrorMessage(): void {
    Swal.fire({
      title: 'Error al enviar la solicitud',
      text: 'Hubo un problema al guardar la capacitación. Por favor, intenta nuevamente.',
      icon: 'error',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#dc3545'
    });
  }

  private showValidationMessage(): void {
    Swal.fire({
      title: 'Campos incompletos',
      text: 'Por favor completa todos los campos obligatorios antes de enviar la solicitud.',
      icon: 'warning',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#ffc107'
    });
  }

}
