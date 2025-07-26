import { Component, OnInit } from '@angular/core';
import { GthCapacitacionService } from 'src/app/services/gthcapacitacion.service';
import { GthSolicitudCapacitacionService, GTHSolicitudCapacitacionModel } from 'src/app/services/gth-solicitud-capacitacion.service';
import { GthAsignacionCapacitacionService, GTHAsignacionCapacitacionDetalladaModel, GTHAsignacionCapacitacionModel } from 'src/app/services/gth-asignacion-capacitacion.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { GthEmpleadoService } from 'src/app/services/gthempleado.service';
import { LoginService } from 'src/app/services/login.service';
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

  // Propiedades para el modal de suscripción
  showSubscriptionModal: boolean = false;
  selectedTraining: Training | null = null;

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
  inProgressTrainings: Training[] = [];

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
    private gthSolicitudCapacitacionService: GthSolicitudCapacitacionService,
    private gthAsignacionCapacitacionService: GthAsignacionCapacitacionService,
    private sessionStorageService: SessionStorageService,
    private gthEmpleadoService: GthEmpleadoService,
    private loginService: LoginService
  ) { }

  ngOnInit(): void {
    this.verificarIdEmpleado();
    this.loadRequestedTrainings();
    this.cargarCapacitacionesDesdeBackend();
    this.cargarCapacitacionesSolicitadas();
    this.cargarCapacitacionesEnCurso();
  }

  /**
   * Verifica y recupera el ID del empleado GTH si es necesario
   */
  private verificarIdEmpleado(): void {
    const idEmpleado = this.sessionStorageService.getIdGthEmpleado();
    console.log('[EmpleadoCapacitaciones] Verificando ID de empleado:', idEmpleado);
    
    if (!idEmpleado) {
      console.warn('[EmpleadoCapacitaciones] ID de empleado no encontrado, intentando recuperar...');
      const email = this.loginService.obtenerEmailUsuarioActual();
      
      if (email) {
        this.gthEmpleadoService.procesarYGuardarIdGthEmpleadoPorEmail(email).subscribe({
          next: (response) => {
            console.log('[EmpleadoCapacitaciones] ID recuperado exitosamente:', response.idEmpleado);
            // Asegurar que esté en ambos servicios
            this.sessionStorageService.setIdGthEmpleado(response.idEmpleado);
          },
          error: (error) => {
            console.error('[EmpleadoCapacitaciones] Error recuperando ID:', error);
          }
        });
      }
    }
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

  /**
   * Carga las capacitaciones en curso desde la tabla de asignación-capacitación
   */
  private cargarCapacitacionesEnCurso(): void {
    // Obtener el ID del empleado actual
    const idEmpleado = this.sessionStorageService.getIdGthEmpleado();
    
    if (!idEmpleado) {
      console.warn('[EmpleadoCapacitaciones] No se encontró ID de empleado para cargar capacitaciones en curso');
      return;
    }

    // Cargar asignaciones de capacitación del empleado actual
    this.gthAsignacionCapacitacionService.mostrarAsignacionesEnCurso(0, undefined, idEmpleado).subscribe({
      next: (asignaciones: GTHAsignacionCapacitacionDetalladaModel[]) => {
        console.log('[EmpleadoCapacitaciones] Asignaciones en curso obtenidas:', asignaciones);
        
        // Convertir las asignaciones a formato Training
        this.inProgressTrainings = asignaciones.map((asignacion: GTHAsignacionCapacitacionDetalladaModel) => ({
          id: asignacion.idCapacitacion,
          name: asignacion.capacitacion?.nombre || 'Capacitación sin nombre',
          duration: asignacion.capacitacion?.duracion || 0,
          startDate: asignacion.fecha ? new Date(asignacion.fecha).toLocaleDateString('es-ES') : 'N/A',
          certification: asignacion.capacitacion?.titulo || asignacion.capacitacion?.nombre || 'Sin certificación',
          company: 'N/A', // Mantenemos N/A como se usa actualmente
          status: 'En Curso'
        }));

        console.log('[EmpleadoCapacitaciones] Capacitaciones en curso cargadas:', this.inProgressTrainings);
      },
      error: (error) => {
        console.error('[EmpleadoCapacitaciones] Error al cargar capacitaciones en curso:', error);
        // Mantener los datos estáticos en caso de error
        console.log('[EmpleadoCapacitaciones] Manteniendo datos estáticos por error en la carga');
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
      // Intentar obtener el ID del empleado
      let idEmpleadoLogueado = this.sessionStorageService.getIdGthEmpleado();
      console.log('[EmpleadoCapacitaciones] ID obtenido del sessionStorage:', idEmpleadoLogueado);
      
      // Si no está disponible, intentar obtenerlo directamente
      if (!idEmpleadoLogueado) {
        idEmpleadoLogueado = this.gthEmpleadoService.obtenerIdGthEmpleadoDesdeSession();
        console.log('[EmpleadoCapacitaciones] ID obtenido del gthEmpleadoService:', idEmpleadoLogueado);
      }
      
      if (!idEmpleadoLogueado) {
        console.error('[EmpleadoCapacitaciones] No se encontró ID de empleado, intentando recuperar...');
        
        const email = this.loginService.obtenerEmailUsuarioActual();
        if (email) {
          this.gthEmpleadoService.procesarYGuardarIdGthEmpleadoPorEmail(email).subscribe({
            next: (response) => {
              console.log('[EmpleadoCapacitaciones] ID recuperado, procesando solicitud...');
              this.sessionStorageService.setIdGthEmpleado(response.idEmpleado);
              this.procesarSolicitud(response.idEmpleado);
            },
            error: (error) => {
              console.error('[EmpleadoCapacitaciones] Error recuperando ID:', error);
              this.mostrarErrorSesion();
            }
          });
        } else {
          this.mostrarErrorSesion();
        }
        return;
      }

      this.procesarSolicitud(idEmpleadoLogueado);
    } else {
      this.showValidationMessage();
    }
  }

  private procesarSolicitud(idEmpleadoLogueado: number): void {
    console.log('[EmpleadoCapacitaciones] Procesando solicitud con ID:', idEmpleadoLogueado);

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
          
          // Paso 2: Crear la solicitud de capacitación usando el ID generado y el ID del empleado del sessionStorage
          const solicitudData: GTHSolicitudCapacitacionModel = {
            tipo: 0, // 0 = Insertar
            idCapacitacion: idCapacitacionGenerado,
            idEmpleado: idEmpleadoLogueado, // ID del empleado obtenido del sessionStorage
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
  }

  private mostrarErrorSesion(): void {
    Swal.fire({
      title: 'Error de sesión',
      text: 'No se pudo obtener la información del empleado. Por favor, vuelve a iniciar sesión.',
      icon: 'error',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#dc3545'
    });
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

  /**
   * Verifica si el empleado ya está suscrito a una capacitación específica
   */
  private yaEstaSuscrito(idCapacitacion: number): boolean {
    return this.inProgressTrainings.some(training => training.id === idCapacitacion);
  }

  /**
   * Refresca las listas de capacitaciones después de cambios importantes
   */
  private refrescarCapacitaciones(): void {
    // Pequeño delay para permitir que el backend procese la nueva asignación
    setTimeout(() => {
      this.cargarCapacitacionesEnCurso();
      this.cargarCapacitacionesDesdeBackend(); // Recargar disponibles por si hay cambios
    }, 500);
  }

  /**
   * Muestra el modal de confirmación para suscribirse a una capacitación
   */
  mostrarModalSuscripcion(training: Training): void {
    this.selectedTraining = training;
    
    Swal.fire({
      title: '¿Suscribirse a esta capacitación?',
      html: `
        <div style="text-align: left; margin: 1rem 0;">
          <p><strong>Nombre:</strong> ${training.name}</p>
          <p><strong>Duración:</strong> ${training.duration} horas</p>
          <p><strong>Certificación:</strong> ${training.certification}</p>
        </div>
        <p style="color: #666; font-size: 0.9rem; margin-top: 1rem;">
          Al confirmar, serás inscrito automáticamente en esta capacitación y aparecerá inmediatamente en tu pestaña "En Curso".
        </p>
        <p style="color: #28a745; font-size: 0.85rem; font-weight: 500;">
          ✓ Tu progreso iniciará en 0% y podrás trackear tu avance.
        </p>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, suscribirme',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#6c757d',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.suscribirseACapacitacion(training);
      }
    });
  }

  /**
   * Procesa la suscripción del empleado a una capacitación
   */
  private suscribirseACapacitacion(training: Training): void {
    // Verificar que el empleado tiene ID
    let idEmpleadoLogueado = this.sessionStorageService.getIdGthEmpleado();
    
    if (!idEmpleadoLogueado) {
      idEmpleadoLogueado = this.gthEmpleadoService.obtenerIdGthEmpleadoDesdeSession();
    }
    
    if (!idEmpleadoLogueado) {
      console.error('[EmpleadoCapacitaciones] No se encontró ID de empleado para suscripción');
      this.mostrarErrorSesion();
      return;
    }

    // Verificar si ya está suscrito a esta capacitación
    if (this.yaEstaSuscrito(training.id)) {
      Swal.fire({
        title: 'Ya estás suscrito',
        text: `Ya estás suscrito a la capacitación "${training.name}". Puedes verla en tu pestaña "En Curso".`,
        icon: 'info',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#17a2b8'
      }).then(() => {
        this.switchTab('curso');
      });
      return;
    }

    // Crear asignación de capacitación directamente (en lugar de solicitud)
    const asignacionData: GTHAsignacionCapacitacionModel = {
      tipo: 0, // 0 = Insertar
      idCapacitacion: training.id,
      idEmpleado: idEmpleadoLogueado,
      fecha: new Date(),
      progreso: 0 // Iniciar con progreso 0%
    };

    console.log('[EmpleadoCapacitaciones] Creando asignación de capacitación:', asignacionData);

    // Crear la asignación en la tabla asignacion-capacitacion
    this.gthAsignacionCapacitacionService.crearAsignacionCapacitacion(asignacionData).subscribe({
      next: (response: any) => {
        console.log('[EmpleadoCapacitaciones] Asignación de capacitación creada exitosamente:', response);
        
        // Remover de disponibles inmediatamente
        this.availableTrainings = this.availableTrainings.filter(t => t.id !== training.id);
        
        // Recargar las capacitaciones para mostrar los cambios
        this.refrescarCapacitaciones();
        
        // Mostrar mensaje de éxito
        Swal.fire({
          title: '¡Suscripción exitosa!',
          text: `Te has suscrito exitosamente a "${training.name}". La capacitación ahora aparece en tu pestaña "En Curso".`,
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#28a745'
        }).then(() => {
          // Cambiar automáticamente a la pestaña "En Curso"
          this.switchTab('curso');
        });
      },
      error: (error) => {
        console.error('[EmpleadoCapacitaciones] Error al crear asignación de capacitación:', error);
        Swal.fire({
          title: 'Error en la suscripción',
          text: 'Hubo un problema al suscribirte a la capacitación. Por favor, intenta nuevamente.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#dc3545'
        });
      }
    });
  }

}
