import { Component, OnInit } from '@angular/core';
import { GthCapacitacionService } from 'src/app/services/gthcapacitacion.service';
import { GthSolicitudCapacitacionService, GTHSolicitudCapacitacionModel } from 'src/app/services/gth-solicitud-capacitacion.service';
import { GthAsignacionCapacitacionService, GTHAsignacionCapacitacionDetalladaModel, GTHAsignacionCapacitacionModel } from 'src/app/services/gth-asignacion-capacitacion.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { GthEmpleadoService } from 'src/app/services/gthempleado.service';
import { LoginService } from 'src/app/services/login.service';
import { iGTHCapacitacion } from 'src/app/interface/ight-capacitacion';
import { environment } from 'src/environments/environment';
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
  progreso?: number; // Nuevo campo para el porcentaje de progreso
  certificadoUrl?: string; // Nuevo campo para la URL del certificado
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

  // Propiedades para el modal de progreso
  showProgressModal: boolean = false;
  selectedTrainingForProgress: Training | null = null;
  progressHistory: any[] = [];
  isUpdatingProgress: boolean = false;

  // Propiedades para el modal de subir certificado
  showCertificateModal: boolean = false;
  selectedCertificateFile: File | null = null;
  isUploadingCertificate: boolean = false;
  certificateModalMode: 'upload' | 'complete' = 'upload'; // 'upload' para subir, 'complete' para completar al 100%

  // Propiedades para el manejo del acuerdo de capacitación
  selectedAgreementFile: File | null = null;
  isUploadingAgreement: boolean = false;
  agreementUploaded: boolean = false;

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

  // Cambiar estructura: ahora cada elemento tiene { training, solicitudCapacitacion }
  requestedTrainings: { training: Training, solicitudCapacitacion: any }[] = [];

  // Capacitaciones completadas - ahora se cargan desde el backend
  completedTrainings: Training[] = [];

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
    this.cargarCapacitacionesCompletadas(); // Nueva llamada para cargar completadas
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
    // Obtener el ID del empleado actual
    const idEmpleado = this.sessionStorageService.getIdGthEmpleado();
    
    if (!idEmpleado) {
      console.warn('[EmpleadoCapacitaciones] No se encontró ID de empleado para cargar capacitaciones solicitadas');
      return;
    }

    // Cargar solicitudes detalladas filtradas por empleado actual (tipo=2 para filtrar por idEmpleado)
    this.gthSolicitudCapacitacionService.mostrarSolicitudesCapacitacionDetallada(2, undefined, idEmpleado).subscribe({
      next: (solicitudes: any[]) => {
        console.log('[EmpleadoCapacitaciones] Solicitudes del empleado obtenidas:', solicitudes);
        
        // Obtener las asignaciones en curso para excluir capacitaciones ya iniciadas
        this.gthAsignacionCapacitacionService.mostrarAsignacionesEnCurso(2, undefined, idEmpleado).subscribe({
          next: (asignaciones: any[]) => {
            const idsCapacitacionesEnCurso = asignaciones.map(a => a.idCapacitacion);
            console.log('[EmpleadoCapacitaciones] IDs de capacitaciones ya iniciadas:', idsCapacitacionesEnCurso);
            
            // Filtrar solo las solicitudes que tengan una capacitación asociada 
            // Y que NO estén ya iniciadas (no tengan asignación activa)
            const trainingsWithSolicitud = solicitudes
              .filter(s => s.capacitacion && !idsCapacitacionesEnCurso.includes(s.capacitacion.idCapacitacion))
              .map(s => ({
                training: {
                  id: s.capacitacion.idCapacitacion || 0,
                  name: s.capacitacion.nombre || '',
                  duration: s.capacitacion.duracion || 0,
                  certification: s.capacitacion.titulo || s.capacitacion.nombre || '',
                  company: 'Por definir',
                  status: this.getEstadoSolicitud(s),
                  price: s.capacitacion.costo ? `$${s.capacitacion.costo}` : 'N/A',
                  justification: s.justificacion || '',
                  link: s.capacitacion.urlVerificacion || '',
                  completionDate: 'Pendiente'
                },
                solicitudCapacitacion: s
              }));
            
            this.requestedTrainings = trainingsWithSolicitud;
            console.log('[EmpleadoCapacitaciones] Capacitaciones solicitadas cargadas (excluyendo ya iniciadas):', this.requestedTrainings);
          },
          error: (error) => {
            console.warn('[EmpleadoCapacitaciones] Error al obtener asignaciones para filtrar:', error);
            
            // En caso de error, cargar solicitudes sin filtrar por asignaciones
            const trainingsWithSolicitud = solicitudes
              .filter(s => s.capacitacion)
              .map(s => ({
                training: {
                  id: s.capacitacion.idCapacitacion || 0,
                  name: s.capacitacion.nombre || '',
                  duration: s.capacitacion.duracion || 0,
                  certification: s.capacitacion.titulo || s.capacitacion.nombre || '',
                  company: 'Por definir',
                  status: this.getEstadoSolicitud(s),
                  price: s.capacitacion.costo ? `$${s.capacitacion.costo}` : 'N/A',
                  justification: s.justificacion || '',
                  link: s.capacitacion.urlVerificacion || '',
                  completionDate: 'Pendiente'
                },
                solicitudCapacitacion: s
              }));
            this.requestedTrainings = trainingsWithSolicitud;
          }
        });
      },
      error: (error) => {
        console.error('[EmpleadoCapacitaciones] Error al cargar solicitudes de capacitación:', error);
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

    // Cargar asignaciones de capacitación del empleado actual (tipo=2 para filtrar por idEmpleado)
    this.gthAsignacionCapacitacionService.mostrarAsignacionesEnCurso(2, undefined, idEmpleado).subscribe({
      next: (asignaciones: GTHAsignacionCapacitacionDetalladaModel[]) => {
        console.log('[EmpleadoCapacitaciones] Asignaciones en curso obtenidas para el empleado:', asignaciones);
        
        // Filtrar solo las que NO están completadas (progreso < 100 o null)
        const enCurso = asignaciones.filter(asignacion => 
          !asignacion.progreso || asignacion.progreso < 100
        );
        
        // Convertir las asignaciones a formato Training
        this.inProgressTrainings = enCurso.map((asignacion: GTHAsignacionCapacitacionDetalladaModel) => ({
          id: asignacion.idCapacitacion,
          name: asignacion.capacitacion?.nombre || 'Capacitación sin nombre',
          duration: asignacion.capacitacion?.duracion || 0,
          startDate: asignacion.fecha ? new Date(asignacion.fecha).toLocaleDateString('es-ES') : 'N/A',
          certification: asignacion.capacitacion?.titulo || asignacion.capacitacion?.nombre || 'Sin certificación',
          company: 'N/A', // Mantenemos N/A como se usa actualmente
          status: 'En Curso',
          progreso: asignacion.progreso || 0,
          certificadoUrl: asignacion.certificadoUrl || '' // Incluir URL del certificado si existe
        }));

        console.log('[EmpleadoCapacitaciones] Capacitaciones en curso cargadas para el empleado:', this.inProgressTrainings);
      },
      error: (error) => {
        console.error('[EmpleadoCapacitaciones] Error al cargar capacitaciones en curso:', error);
        // Mantener array vacío en caso de error
        this.inProgressTrainings = [];
        console.log('[EmpleadoCapacitaciones] Manteniendo array vacío por error en la carga');
      }
    });
  }

  /**
   * Carga las capacitaciones completadas (progreso >= 100%) desde la tabla de asignación-capacitación
   */
  private cargarCapacitacionesCompletadas(): void {
    // Obtener el ID del empleado actual
    const idEmpleado = this.sessionStorageService.getIdGthEmpleado();
    
    if (!idEmpleado) {
      console.warn('[EmpleadoCapacitaciones] No se encontró ID de empleado para cargar capacitaciones completadas');
      return;
    }

    // Cargar capacitaciones completadas del empleado actual (tipo=2 para filtrar por idEmpleado)
    this.gthAsignacionCapacitacionService.mostrarCapacitacionesCompletadas(idEmpleado).subscribe({
      next: (asignacionesCompletadas: GTHAsignacionCapacitacionDetalladaModel[]) => {
        console.log('[EmpleadoCapacitaciones] Asignaciones completadas obtenidas para el empleado:', asignacionesCompletadas);
        
        // Convertir las asignaciones completadas a formato Training
        this.completedTrainings = asignacionesCompletadas.map((asignacion: GTHAsignacionCapacitacionDetalladaModel) => ({
          id: asignacion.idCapacitacion,
          name: asignacion.capacitacion?.nombre || 'Capacitación sin nombre',
          duration: asignacion.capacitacion?.duracion || 0,
          completionDate: asignacion.fecha ? new Date(asignacion.fecha).toLocaleDateString('es-ES') : 'N/A',
          certification: asignacion.capacitacion?.titulo || asignacion.capacitacion?.nombre || 'Sin certificación',
          company: 'N/A', // Mantenemos N/A como se usa actualmente
          progreso: asignacion.progreso || 100, // Asegurar que sea al menos 100%
          certificadoUrl: asignacion.certificadoUrl || '' // Incluir URL del certificado
        }));

        console.log('[EmpleadoCapacitaciones] Capacitaciones completadas cargadas para el empleado:', this.completedTrainings);
      },
      error: (error) => {
        console.error('[EmpleadoCapacitaciones] Error al cargar capacitaciones completadas:', error);
        // En caso de error, mantener el array vacío
        this.completedTrainings = [];
        console.log('[EmpleadoCapacitaciones] Manteniendo array vacío por error en la carga');
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
            next: async (responseSolicitud: any) => {
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

              this.requestedTrainings.push({ training: newRequest, solicitudCapacitacion: responseSolicitud });
              this.saveRequestedTrainings();
              
              // Paso 3: Si hay acuerdo seleccionado, subirlo DESPUÉS de crear la solicitud
              if (this.selectedAgreementFile) {
                await this.subirAcuerdoCapacitacion(idEmpleadoLogueado, this.certificacionCapacitacion);
              }
              
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
    
    // Limpiar datos del acuerdo
    this.selectedAgreementFile = null;
    this.isUploadingAgreement = false;
    this.agreementUploaded = false;
    this.contractAccepted = false;
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
    const dynamicTrainings = this.requestedTrainings.filter(t => t.training.id > 1000);
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
    const mensajeCompleto = this.selectedAgreementFile ? 
      'Tu capacitación ha sido registrada en el sistema con estado "Solicitada" y el acuerdo firmado ha sido adjuntado exitosamente.' :
      'Tu capacitación ha sido registrada en el sistema con estado "Solicitada".';
      
    Swal.fire({
      title: '¡Solicitud enviada exitosamente!',
      text: mensajeCompleto,
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
   * Verifica si el empleado tiene una asignación pendiente para una capacitación específica
   */
  private tieneAsignacionPendiente(idCapacitacion: number): boolean {
    const idEmpleado = this.sessionStorageService.getIdGthEmpleado();
    if (!idEmpleado) return false;
    
    // Verificar si hay alguna solicitud aprobada para esta capacitación
    return this.requestedTrainings.some(item => 
      item.training.id === idCapacitacion && 
      this.getEstadoSolicitud(item.solicitudCapacitacion) === 'Aprobada'
    );
  }

  /**
   * Refresca las listas de capacitaciones después de cambios importantes
   */
  private refrescarCapacitaciones(): void {
    // Pequeño delay para permitir que el backend procese la nueva asignación
    setTimeout(() => {
      this.cargarCapacitacionesEnCurso();
      this.cargarCapacitacionesCompletadas(); // También recargar completadas
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
   * Muestra el modal para iniciar una capacitación aprobada
   */
  mostrarModalIniciarCapacitacion(item: { training: Training, solicitudCapacitacion: any }): void {
    const { training, solicitudCapacitacion } = item;
    
    // Verificar que el estado sea realmente "Aprobada"
    if (this.getEstadoSolicitud(solicitudCapacitacion) !== 'Aprobada') {
      return;
    }
    
    Swal.fire({
      title: '¡Capacitación Aprobada!',
      html: `
        <div style="text-align: left; margin: 1rem 0;">
          <p><strong>Nombre:</strong> ${training.name}</p>
          <p><strong>Duración:</strong> ${training.duration} horas</p>
          <p><strong>Certificación:</strong> ${training.certification}</p>
          <p><strong>Estado:</strong> <span style="color: #28a745; font-weight: bold;">Aprobada</span></p>
        </div>
        <div style="background-color: #e7f3ff; padding: 1rem; border-radius: 5px; margin: 1rem 0;">
          <p style="color: #0066cc; font-size: 0.9rem; margin: 0;">
            <i class="fas fa-info-circle"></i> Esta capacitación ha sido aprobada por el administrador. 
            Al hacer clic en "Iniciar Capacitación", se creará tu registro de progreso y la capacitación 
            se moverá a tu sección "En Curso".
          </p>
        </div>
      `,
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: '<i class="fas fa-play"></i> Iniciar Capacitación',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#6c757d',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.iniciarCapacitacionAprobada(item);
      }
    });
  }

  /**
   * Procesa el inicio de una capacitación aprobada
   */
  private iniciarCapacitacionAprobada(item: { training: Training, solicitudCapacitacion: any }): void {
    const { training, solicitudCapacitacion } = item;
    
    // Verificar que el empleado tiene ID
    let idEmpleadoLogueado = this.sessionStorageService.getIdGthEmpleado();
    
    if (!idEmpleadoLogueado) {
      idEmpleadoLogueado = this.gthEmpleadoService.obtenerIdGthEmpleadoDesdeSession();
    }
    
    if (!idEmpleadoLogueado) {
      console.error('[EmpleadoCapacitaciones] No se encontró ID de empleado para iniciar capacitación');
      this.mostrarErrorSesion();
      return;
    }

    // Verificar si ya tiene una asignación activa para esta capacitación
    if (this.yaEstaSuscrito(training.id)) {
      Swal.fire({
        title: 'Capacitación ya iniciada',
        text: `Ya tienes iniciada la capacitación "${training.name}". Puedes verla en tu pestaña "En Curso".`,
        icon: 'info',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#17a2b8'
      }).then(() => {
        this.switchTab('curso');
      });
      return;
    }

    // Verificar que realmente tenga una asignación pendiente (aprobada pero no iniciada)
    if (!this.tieneAsignacionPendiente(training.id)) {
      Swal.fire({
        title: 'Error de asignación',
        text: 'No tienes una asignación pendiente para esta capacitación. Por favor contacta al administrador.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    // Crear asignación de capacitación para iniciar el progreso
    const asignacionData: GTHAsignacionCapacitacionModel = {
      tipo: 1, // 1 = Editar (la asignación ya existe con progreso 0)
      idCapacitacion: training.id,
      idEmpleado: idEmpleadoLogueado,
      fecha: new Date(),
      progreso: 1 // Cambiar de 0 a 1% para indicar que fue iniciada por el empleado
    };

    console.log('[EmpleadoCapacitaciones] Iniciando capacitación aprobada - Creando asignación:', asignacionData);

    // Crear la asignación en la tabla asignacion-capacitación
    this.gthAsignacionCapacitacionService.crearAsignacionCapacitacion(asignacionData).subscribe({
      next: (response: any) => {
        console.log('[EmpleadoCapacitaciones] Asignación de capacitación creada exitosamente para capacitación aprobada:', response);
        
        // Remover de las capacitaciones solicitadas (ya que ahora está en curso)
        this.requestedTrainings = this.requestedTrainings.filter(
          req => req.training.id !== training.id
        );
        
        // Recargar las capacitaciones para mostrar los cambios
        this.refrescarCapacitaciones();
        
        // Mostrar mensaje de éxito
        Swal.fire({
          title: '¡Capacitación iniciada exitosamente!',
          text: `Has iniciado la capacitación "${training.name}". Ahora aparece en tu sección "En Curso" con progreso 0%.`,
          icon: 'success',
          confirmButtonText: 'Ver en "En Curso"',
          confirmButtonColor: '#28a745'
        }).then(() => {
          // Cambiar automáticamente a la pestaña "En Curso"
          this.switchTab('curso');
        });
      },
      error: (error) => {
        console.error('[EmpleadoCapacitaciones] Error al crear asignación para capacitación aprobada:', error);
        Swal.fire({
          title: 'Error al iniciar capacitación',
          text: 'Hubo un problema al iniciar la capacitación. Por favor, intenta nuevamente o contacta al administrador.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#dc3545'
        });
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

    // Crear la asignación en la tabla asignacion-capacitación
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

  // Devuelve el estado de la solicitud basado en el campo respuesta
  getEstadoSolicitud(solicitud: any): string {
    if (!solicitud.respuesta || solicitud.respuesta.trim() === '') {
      return 'Solicitada';
    }
    if (solicitud.respuesta.startsWith('Aceptada')) {
      return 'Aprobada';
    }
    if (solicitud.respuesta.startsWith('Rechazada')) {
      return 'Rechazada';
    }
    return 'Solicitada';
  }

  // Devuelve solo las capacitaciones con solicitud asociada
  getCapacitacionesSolicitadasConSolicitud(): any[] {
    return this.requestedTrainings;
  }

  // Devuelve la clase de color para el estado de la solicitud
  getEstadoColor(solicitud: any): string {
    const estado = this.getEstadoSolicitud(solicitud);
    if (estado === 'Aprobada') return 'badge-success'; // verde
    if (estado === 'Rechazada') return 'badge-danger'; // rojo
    return 'badge-warning'; // amarillo para solicitada
  }

  // ========== MÉTODOS PARA MODAL DE PROGRESO ==========

  /**
   * Muestra el modal de progreso para una capacitación
   */
  mostrarModalProgreso(training: Training): void {
    console.log('[EmpleadoCapacitaciones] Abriendo modal de progreso para:', training);
    this.selectedTrainingForProgress = training;
    this.showProgressModal = true;
    
    // Limpiar historial previo (podrías implementar un historial real desde el backend)
    this.progressHistory = [];
  }

  /**
   * Cierra el modal de progreso
   */
  cerrarModalProgreso(): void {
    this.showProgressModal = false;
    this.selectedTrainingForProgress = null;
    this.progressHistory = [];
    this.isUpdatingProgress = false;
  }

  /**
   * Abre el modal para subir certificado
   */
  abrirModalCertificado(training: Training, mode: 'upload' | 'complete' = 'upload'): void {
    this.selectedTrainingForProgress = training;
    this.certificateModalMode = mode;
    this.showCertificateModal = true;
    this.selectedCertificateFile = null;
  }

  /**
   * Maneja la selección de archivo de certificado
   */
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.selectedCertificateFile = file;
    } else {
      Swal.fire({
        title: 'Archivo inválido',
        text: 'Por favor, selecciona un archivo PDF válido.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#dc3545'
      });
      // Limpiar el input
      event.target.value = '';
    }
  }

  /**
   * Sube el certificado al servidor
   */
  async subirCertificado(): Promise<void> {
    if (!this.selectedTrainingForProgress || !this.selectedCertificateFile) {
      Swal.fire({
        title: 'Error',
        text: 'Selecciona un archivo PDF para subir.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#dc3545'
      });
      return;
    }

    this.isUploadingCertificate = true;

    try {
      const idEmpleado = this.sessionStorageService.getIdGthEmpleado();
      
      if (!idEmpleado) {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo obtener el ID del empleado.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#dc3545'
        });
        return;
      }

      const response = await this.gthAsignacionCapacitacionService.subirCertificado(
        idEmpleado,
        this.selectedTrainingForProgress.id,
        this.selectedCertificateFile
      ).toPromise();

      if (response?.success) {
        Swal.fire({
          title: '¡Éxito!',
          text: 'Certificado subido correctamente. Capacitación completada al 100%.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#28a745',
          timer: 2000,
          timerProgressBar: true
        });
        
        // Actualizar la capacitación con la URL del certificado y progreso 100%
        this.selectedTrainingForProgress.certificadoUrl = response.certificadoUrl;
        this.selectedTrainingForProgress.progreso = 100; // El backend ya lo actualiza a 100%
        
        this.cerrarModalCertificado();
        
        // Recargar las capacitaciones para reflejar los cambios
        this.cargarCapacitacionesEnCurso();
        this.cargarCapacitacionesCompletadas();
        
        // Cambiar a la pestaña completadas para mostrar el resultado
        setTimeout(() => {
          this.switchTab('completado');
        }, 500);
        
      } else {
        Swal.fire({
          title: 'Error',
          text: response?.mensaje || 'Error al subir el certificado. Por favor, intenta nuevamente.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#dc3545'
        });
      }
    } catch (error) {
      console.error('Error uploading certificate:', error);
      Swal.fire({
        title: 'Error',
        text: 'Error al subir el certificado. Por favor, intenta nuevamente.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#dc3545'
      });
    } finally {
      this.isUploadingCertificate = false;
    }
  }

  /**
   * Cierra el modal de certificado
   */
  cerrarModalCertificado(): void {
    this.showCertificateModal = false;
    this.selectedTrainingForProgress = null;
    this.selectedCertificateFile = null;
    this.certificateModalMode = 'upload';
    this.isUploadingCertificate = false;
  }

  /**
   * Ver/Descargar certificado existente
   */
  verCertificado(certificadoUrl: string): void {
    if (certificadoUrl) {
      // Construir la URL completa del certificado
      let urlCompleta = certificadoUrl;
      
      // Si la URL no incluye el dominio, agregarle la URL base del backend
      if (!certificadoUrl.startsWith('http')) {
        // Remover la barra inicial si existe para evitar doble barra
        const rutaCertificado = certificadoUrl.startsWith('/') ? certificadoUrl.substring(1) : certificadoUrl;
        urlCompleta = environment.urlbackend + rutaCertificado;
      }
      
      console.log('[EmpleadoCapacitaciones] Abriendo certificado:', urlCompleta);
      
      // Abrir en nueva ventana para ver o descargar
      window.open(urlCompleta, '_blank');
    } else {
      Swal.fire({
        title: 'Sin certificado',
        text: 'Esta capacitación no tiene certificado subido.',
        icon: 'info',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#17a2b8'
      });
    }
  }

  /**
   * Confirma si el usuario quiere completar la capacitación al 100%
   */
  confirmarCompletar100(training: Training): void {
    if (training.certificadoUrl) {
      // Si ya tiene certificado, completar directamente
      this.actualizarProgreso(100, 'Capacitación completada');
    } else {
      // Si no tiene certificado, solo mostrar opción de subir certificado
      Swal.fire({
        title: '¿Completar Capacitación?',
        html: `
          <p>Para completar la capacitación al 100% es necesario subir el certificado.</p>
          <p style="color: #28a745; font-size: 0.9rem;">
            ✓ Al subir el certificado, la capacitación se completará automáticamente al 100%
          </p>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Subir Certificado',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#6c757d'
      }).then((result) => {
        if (result.isConfirmed) {
          // Abrir modal para subir certificado (automáticamente completa al 100%)
          this.abrirModalCertificado(training, 'complete');
        }
      });
    }
  }

  /**
   * Actualiza el progreso de una capacitación
   */
  actualizarProgreso(nuevoProgreso: number, nota: string): void {
    if (this.isUpdatingProgress) {
      return; // Evitar múltiples clics
    }

    if (!this.selectedTrainingForProgress) {
      console.error('[EmpleadoCapacitaciones] No hay capacitación seleccionada para actualizar progreso');
      return;
    }

    // Verificar que el empleado tiene ID
    let idEmpleadoLogueado = this.sessionStorageService.getIdGthEmpleado();
    
    if (!idEmpleadoLogueado) {
      idEmpleadoLogueado = this.gthEmpleadoService.obtenerIdGthEmpleadoDesdeSession();
    }
    
    if (!idEmpleadoLogueado) {
      console.error('[EmpleadoCapacitaciones] No se encontró ID de empleado para actualizar progreso');
      this.mostrarErrorSesion();
      return;
    }

    this.isUpdatingProgress = true;

    // Crear el objeto para actualizar la asignación
    const asignacionData: GTHAsignacionCapacitacionModel = {
      tipo: 1, // 1 = Editar
      idCapacitacion: this.selectedTrainingForProgress.id,
      idEmpleado: idEmpleadoLogueado,
      fecha: nuevoProgreso === 100 ? new Date() : undefined, // Solo actualizar fecha si se completa
      progreso: nuevoProgreso
    };

    console.log('[EmpleadoCapacitaciones] Actualizando progreso con datos:', asignacionData);

    this.gthAsignacionCapacitacionService.actualizarProgresoCapacitacion(asignacionData).subscribe({
      next: (response) => {
        console.log('[EmpleadoCapacitaciones] Progreso actualizado exitosamente:', response);
        
        // Actualizar el progreso localmente
        this.selectedTrainingForProgress!.progreso = nuevoProgreso;
        
        // Agregar al historial
        this.progressHistory.unshift({
          fecha: new Date(),
          progreso: nuevoProgreso,
          nota: nota
        });

        // Mostrar mensaje de éxito
        let mensaje = `Progreso actualizado a ${nuevoProgreso}%`;
        if (nuevoProgreso === 100) {
          mensaje = '¡Capacitación completada exitosamente!';
        }

        Swal.fire({
          title: '¡Progreso Actualizado!',
          text: mensaje,
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#28a745',
          timer: 2000,
          timerProgressBar: true
        }).then(() => {
          // Si llegó al 100%, cerrar modal y refrescar listas
          if (nuevoProgreso === 100) {
            this.cerrarModalProgreso();
            this.cargarCapacitacionesEnCurso();
            this.cargarCapacitacionesCompletadas();
            
            // Cambiar a la pestaña completadas para mostrar el resultado
            setTimeout(() => {
              this.switchTab('completado');
            }, 500);
          }
        });

        this.isUpdatingProgress = false;
      },
      error: (error) => {
        console.error('[EmpleadoCapacitaciones] Error al actualizar progreso:', error);
        
        Swal.fire({
          title: 'Error al Actualizar Progreso',
          text: 'Hubo un problema al actualizar el progreso. Por favor, intenta nuevamente.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#dc3545'
        });

        this.isUpdatingProgress = false;
      }
    });
  }

  // Métodos para el manejo del acuerdo de capacitación

  /**
   * Descarga el acuerdo plantilla para capacitaciones
   */
  async descargarAcuerdo(): Promise<void> {
    try {
      const blob = await this.gthAsignacionCapacitacionService.descargarAcuerdo().toPromise();
      
      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'acuerdo_capacitacion.xls';
        link.click();
        window.URL.revokeObjectURL(url);

        Swal.fire({
          title: 'Descarga Completada',
          text: 'El acuerdo de capacitación se ha descargado exitosamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#28a745'
        });
      }
    } catch (error) {
      console.error('[EmpleadoCapacitaciones] Error al descargar acuerdo:', error);
      
      Swal.fire({
        title: 'Error al Descargar',
        text: 'Hubo un problema al descargar el acuerdo. Por favor, intenta nuevamente.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#dc3545'
      });
    }
  }

  /**
   * Maneja la selección del archivo de acuerdo (no lo sube inmediatamente)
   */
  onAgreementFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo de archivo
      const extension = file.name.toLowerCase().split('.').pop();
      if (extension !== 'xls' && extension !== 'xlsx') {
        Swal.fire({
          title: 'Tipo de archivo no válido',
          text: 'Solo se permiten archivos XLS o XLSX.',
          icon: 'warning',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#ffc107'
        });
        return;
      }

      // Validar tamaño (10MB máximo)
      if (file.size > 10 * 1024 * 1024) {
        Swal.fire({
          title: 'Archivo demasiado grande',
          text: 'El archivo no puede superar los 10MB.',
          icon: 'warning',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#ffc107'
        });
        return;
      }

      this.selectedAgreementFile = file;
      
      Swal.fire({
        title: 'Archivo Seleccionado',
        text: 'El acuerdo se subirá automáticamente después de crear la solicitud de capacitación.',
        icon: 'info',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#17a2b8'
      });
    }
  }

  /**
   * Sube el acuerdo firmado al servidor para una capacitación específica
   */
  async subirAcuerdoCapacitacion(idEmpleado: number, tituloCapacitacion: string): Promise<void> {
    if (!this.selectedAgreementFile) {
      console.log('No hay archivo de acuerdo seleccionado para subir');
      return;
    }

    this.isUploadingAgreement = true;

    try {
      // Usar el endpoint específico que incluye el título de la capacitación
      const response = await this.gthAsignacionCapacitacionService.subirAcuerdoCapacitacion(
        idEmpleado,
        tituloCapacitacion,
        this.selectedAgreementFile
      ).toPromise();

      if (response && response.success) {
        this.agreementUploaded = true;
        
        console.log('Acuerdo subido exitosamente:', response);
        
        // No mostrar modal aquí porque ya se mostrará el de éxito de la solicitud
        // Solo actualizar el estado interno
      }
    } catch (error) {
      console.error('[EmpleadoCapacitaciones] Error al subir acuerdo:', error);
      
      Swal.fire({
        title: 'Advertencia',
        text: 'La solicitud se creó exitosamente, pero hubo un problema al subir el acuerdo. Puedes subirlo más tarde.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#ffc107'
      });
    } finally {
      this.isUploadingAgreement = false;
    }
  }

}
