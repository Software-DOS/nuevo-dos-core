import { Component, OnInit } from '@angular/core';
import { GthCapacitacionService } from 'src/app/services/gthcapacitacion.service';
import { GthSolicitudCapacitacionService, GTHSolicitudCapacitacionDetalladaModel } from 'src/app/services/gth-solicitud-capacitacion.service';
import { GthAsignacionCapacitacionService, GTHAsignacionCapacitacionDetalladaModel } from 'src/app/services/gth-asignacion-capacitacion.service';
import { GthEmpleadoService } from 'src/app/services/gthempleado.service';
import { iGTHCapacitacion } from 'src/app/interface/ight-capacitacion';
import { iGTHEmpleado } from 'src/app/interface/igth-empleado';
import Swal from 'sweetalert2';

interface Empleado {
  nombre: string;
  photo: string;
}

interface CapacitacionEnCurso {
  empleado: Empleado;
  nombre: string;
  duracion: number;
  fechaInicio: string;
  certificacion: string;
  progreso: number;
}

interface CapacitacionDisponible {
  id?: string;
  nombre: string;
  duracion: number;
  certificacion: string;
  isStatic?: boolean;
}

interface CapacitacionSolicitada {
  empleado: Empleado;
  departamento: string;
  nombre: string;
  duracion: number;
  certificacion: string;
}

interface NuevaCapacitacion {
  nombre: string;
  duracion: number;
  certificacion: string;
  justificacion: string;
  enlace: string;
}

interface EmpleadoCapacitaciones {
  empleado: Empleado;
  capacitaciones: {
    nombre: string;
    duracion: number;
    certificacion: string;
    estado: 'En Curso' | 'Completada' | 'Solicitada';
    progreso?: number;
    fechaInicio?: string;
    fechaCompletado?: string;
  }[];
}

@Component({
  selector: 'app-lista-capacitaciones',
  templateUrl: './lista-capacitaciones.component.html',
  styleUrls: ['./lista-capacitaciones.component.css']
})
export class ListaCapacitacionesComponent implements OnInit {
  activeTab: string = 'curso';
  showForm: boolean = false;
  showFormButton: boolean = true;
  showModal: boolean = false;
  showEditModal: boolean = false;
  showAssignModal: boolean = false;
  showSolicitudModal: boolean = false;
  selectedEmployeeTrainings: EmpleadoCapacitaciones | null = null;
  capacitacionEditandoId: string | null = null;
  capacitacionEditando: CapacitacionDisponible | null = null;
  capacitacionParaAsignar: CapacitacionDisponible | null = null;
  solicitudSeleccionada: GTHSolicitudCapacitacionDetalladaModel | null = null;
  respuestaJustificacion: string = '';

  nuevaCapacitacion: NuevaCapacitacion = {
    nombre: '',
    duracion: 0,
    certificacion: '',
    justificacion: '',
    enlace: ''
  };

  capacitacionesEnCurso: CapacitacionEnCurso[] = [
    {
      empleado: { nombre: 'José Casas', photo: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' },
      nombre: 'Curso de Liderazgo Ágil',
      duracion: 20,
      fechaInicio: '05/04/2025',
      certificacion: 'Scrum Foundation',
      progreso: 70
    },
    {
      empleado: { nombre: 'José Casas', photo: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' },
      nombre: 'Gestión del Tiempo',
      duracion: 10,
      fechaInicio: '01/04/2025',
      certificacion: 'Productividad Personal',
      progreso: 70
    }
  ];

  capacitacionesDisponibles: CapacitacionDisponible[] = [];

  capacitacionesSolicitadas: CapacitacionSolicitada[] = [
    {
      empleado: { nombre: 'José Casas', photo: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' },
      departamento: 'Desarrollo',
      nombre: 'Gestión de Proyectos',
      duracion: 30,
      certificacion: 'PMI Fundamentals'
    },
    {
      empleado: { nombre: 'José Casas', photo: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' },
      departamento: 'Desarrollo',
      nombre: 'Introducción a Python',
      duracion: 25,
      certificacion: 'Python Básico'
    }
  ];

  // Nuevas propiedades para datos reales del backend
  solicitudesDetalladas: GTHSolicitudCapacitacionDetalladaModel[] = [];
  cargandoSolicitudes: boolean = false;

  // Datos para el modal - Detalles de capacitaciones del empleado
  employeeTrainingsData: EmpleadoCapacitaciones[] = [
    {
      empleado: { nombre: 'José Casas', photo: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' },
      capacitaciones: [
        {
          nombre: 'Curso de Liderazgo Ágil',
          duracion: 20,
          certificacion: 'Scrum Foundation',
          estado: 'En Curso',
          progreso: 70,
          fechaInicio: '05/04/2025'
        },
        {
          nombre: 'Gestión del Tiempo',
          duracion: 10,
          certificacion: 'Productividad Personal',
          estado: 'En Curso',
          progreso: 70,
          fechaInicio: '01/04/2025'
        },
        {
          nombre: 'Excel Avanzado',
          duracion: 15,
          certificacion: 'Microsoft Excel Expert',
          estado: 'Completada',
          fechaCompletado: '15/03/2025'
        }
      ]
    },
    {
      empleado: { nombre: 'María González', photo: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' },
      capacitaciones: [
        {
          nombre: 'Introducción a Python',
          duracion: 25,
          certificacion: 'Python Básico',
          estado: 'En Curso',
          progreso: 45,
          fechaInicio: '10/04/2025'
        },
        {
          nombre: 'Gestión de Proyectos',
          duracion: 30,
          certificacion: 'PMI Fundamentals',
          estado: 'Solicitada'
        }
      ]
    }
  ];

  // Datos reales de asignaciones en curso
  asignacionesEnCurso: GTHAsignacionCapacitacionDetalladaModel[] = [];
  cargandoAsignaciones: boolean = false;

  // Nuevas propiedades para cargar empleados GTH
  empleadosGTH: iGTHEmpleado[] = [];
  cargandoEmpleadosGTH: boolean = false;
  empleadoSeleccionado: iGTHEmpleado | null = null;

  constructor(
    private gthCapacitacionService: GthCapacitacionService,
    private gthSolicitudCapacitacionService: GthSolicitudCapacitacionService,
    private gthAsignacionCapacitacionService: GthAsignacionCapacitacionService,
    private gthEmpleadoService: GthEmpleadoService
  ) { }

  ngOnInit(): void {
    this.cargarCapacitacionesDesdeBackend();
    this.cargarSolicitudesCapacitacion();
    this.cargarAsignacionesEnCurso();
  }

  private cargarSolicitudesCapacitacion(): void {
    this.cargandoSolicitudes = true;
    
    // Cargar todas las solicitudes (tipo 0 = todas)
    this.gthSolicitudCapacitacionService.mostrarSolicitudesCapacitacionDetallada(0).subscribe({
      next: (response: GTHSolicitudCapacitacionDetalladaModel[]) => {
        this.solicitudesDetalladas = response || [];
        console.log('Solicitudes detalladas cargadas:', this.solicitudesDetalladas);
        this.cargandoSolicitudes = false;
      },
      error: (error) => {
        console.error('Error al cargar solicitudes de capacitación:', error);
        this.cargandoSolicitudes = false;
        // No mostrar SweetAlert por ahora para debug, solo console.error
        // Swal.fire({
        //   title: 'Error',
        //   text: 'No se pudieron cargar las solicitudes de capacitación.',
        //   icon: 'error',
        //   confirmButtonText: 'OK'
        // });
      }
    });
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
          this.capacitacionesDisponibles = capacitaciones
            .filter((cap: any) => cap.estado === 'Disponible')
            .map((cap: any) => ({
              id: cap.idCapacitacion?.toString() || '',
              nombre: cap.nombre || '',
              duracion: cap.duracion || 0,
              certificacion: cap.CAP_TITULO || cap.titulo || cap.nombre || '', // Usar CAP_TITULO como principal
              isStatic: false // Permitir edición y eliminación de capacitaciones del backend
            }));
        }
      },
      error: (error) => {
        console.error('Error al cargar capacitaciones del backend:', error);
      }
    });
  }

  private cargarAsignacionesEnCurso(): void {
    this.cargandoAsignaciones = true;
    console.log('[ListaCapacitaciones] Cargando asignaciones en curso...');
    
    this.gthAsignacionCapacitacionService.mostrarAsignacionesEnCurso(0).subscribe({
      next: (response: GTHAsignacionCapacitacionDetalladaModel[]) => {
        this.asignacionesEnCurso = response || [];
        console.log('[ListaCapacitaciones] Asignaciones en curso cargadas:', this.asignacionesEnCurso.length, 'registros');
        this.cargandoAsignaciones = false;
      },
      error: (error) => {
        console.error('[ListaCapacitaciones] Error al cargar asignaciones en curso:', error);
        this.asignacionesEnCurso = []; // Limpiar en caso de error
        this.cargandoAsignaciones = false;
      }
    });
  }

  /**
   * Refresca la lista de asignaciones en curso
   */
  public refrescarAsignacionesEnCurso(): void {
    console.log('[ListaCapacitaciones] Refrescando asignaciones en curso...');
    this.cargarAsignacionesEnCurso();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  mostrarFormulario(): void {
    this.showForm = true;
    this.showFormButton = false;
  }

  cancelarFormulario(): void {
    Swal.fire({
      title: '¿Cancelar solicitud?',
      text: 'Se cancelará el proceso de solicitud de capacitación.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, continuar'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.showForm = false;
        this.showFormButton = true;
        this.capacitacionEditandoId = null;
        // Resetear formulario
        this.nuevaCapacitacion = {
          nombre: '',
          duracion: 0,
          certificacion: '',
          justificacion: '',
          enlace: ''
        };
        Swal.fire('Cancelado', 'La solicitud ha sido cancelada.', 'info');
      }
    });
  }

  onSubmitForm(event: Event): void {
    event.preventDefault();

    if (!this.nuevaCapacitacion.nombre || !this.nuevaCapacitacion.duracion) {
      Swal.fire({
        title: 'Campos incompletos',
        text: 'Por favor completa los campos obligatorios.',
        icon: 'warning',
        confirmButtonText: 'Ok'
      });
      return;
    }

    // Crear objeto de capacitación compatible con el backend
    const capacitacionData: iGTHCapacitacion = {
      tipo: this.capacitacionEditandoId ? 1 : 0, // 0 = Insertar, 1 = Editar
      idCapacitacion: this.capacitacionEditandoId ? parseInt(this.capacitacionEditandoId) : 0,
      idEntidadCap: 1, // Valor por defecto
      nombre: this.nuevaCapacitacion.nombre,
      titulo: this.nuevaCapacitacion.certificacion, // Usar certificacion como titulo (CAP_TITULO)
      categoria: 'Disponible',
      descripcion: this.nuevaCapacitacion.justificacion || '',
      estado: 'Disponible',
      fechaInicio: undefined,
      fechaFin: undefined,
      fechaExpiracion: undefined,
      urlVerificacion: this.nuevaCapacitacion.enlace || '',
      archivosAdjuntos: '',
      observaciones: '',
      duracion: this.nuevaCapacitacion.duracion,
      costo: 0,
      modalidad: 'Por definir'
    };

    // Llamar al servicio para guardar en el backend
    this.gthCapacitacionService.GuardarGthCapacitacion(capacitacionData).subscribe({
      next: (response: any) => {
        if (this.capacitacionEditandoId) {
          // Modo edición
          const index = this.capacitacionesDisponibles.findIndex(cap => cap.id === this.capacitacionEditandoId);
          if (index !== -1) {
            this.capacitacionesDisponibles[index] = {
              ...this.capacitacionesDisponibles[index],
              nombre: this.nuevaCapacitacion.nombre,
              duracion: this.nuevaCapacitacion.duracion,
              certificacion: this.nuevaCapacitacion.certificacion
            };
          }
          this.capacitacionEditandoId = null;
          Swal.fire({
            title: 'Capacitación actualizada',
            text: 'La capacitación ha sido actualizada exitosamente en el servidor.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
        } else {
          // Modo creación
          const nuevaCapacitacion: CapacitacionDisponible = {
            id: Date.now().toString(),
            nombre: this.nuevaCapacitacion.nombre,
            duracion: this.nuevaCapacitacion.duracion,
            certificacion: this.nuevaCapacitacion.certificacion,
            isStatic: false
          };

          this.capacitacionesDisponibles.push(nuevaCapacitacion);
          Swal.fire({
            title: 'Capacitación añadida',
            text: 'La capacitación ha sido registrada exitosamente en el servidor.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
        }

        this.resetForm();
        // Recargar capacitaciones del backend para mostrar la nueva
        this.cargarCapacitacionesDesdeBackend();
      },
      error: (error) => {
        // Error al guardar la capacitación
        Swal.fire({
          title: 'Error',
          text: 'Hubo un error al guardar la capacitación. Por favor, intenta nuevamente.',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    });
  }

  private resetForm(): void {
    // Resetear formulario
    this.nuevaCapacitacion = {
      nombre: '',
      duracion: 0,
      certificacion: '',
      justificacion: '',
      enlace: ''
    };

    this.showForm = false;
    this.showFormButton = true;
    this.capacitacionEditandoId = null;
    this.capacitacionEditando = null;
  }

  editarCapacitacion(capacitacion: CapacitacionDisponible): void {
    // Almacenar la capacitación que se va a editar
    this.capacitacionEditando = { ...capacitacion };
    
    // Llenar el formulario con los datos de la capacitación a editar
    this.nuevaCapacitacion = {
      nombre: capacitacion.nombre,
      duracion: capacitacion.duracion,
      certificacion: capacitacion.certificacion,
      justificacion: '',
      enlace: ''
    };
    
    // Guardar el ID de la capacitación que se está editando
    this.capacitacionEditandoId = capacitacion.id || null;
    
    // Mostrar el modal de edición
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.capacitacionEditando = null;
    this.capacitacionEditandoId = null;
    this.resetForm();
  }

  cancelarEdicion(): void {
    Swal.fire({
      title: '¿Cancelar edición?',
      text: 'Se perderán los cambios realizados.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, continuar'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.closeEditModal();
        Swal.fire('Cancelado', 'La edición ha sido cancelada.', 'info');
      }
    });
  }

  guardarEdicion(): void {
    if (!this.nuevaCapacitacion.nombre || !this.nuevaCapacitacion.duracion) {
      Swal.fire({
        title: 'Campos incompletos',
        text: 'Por favor completa los campos obligatorios.',
        icon: 'warning',
        confirmButtonText: 'Ok'
      });
      return;
    }

    if (!this.capacitacionEditandoId) {
      Swal.fire({
        title: 'Error',
        text: 'No se puede editar esta capacitación. ID no válido.',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      return;
    }

    // Crear objeto de capacitación compatible con el backend para edición
    const capacitacionData: iGTHCapacitacion = {
      tipo: 1, // 1 = Editar
      idCapacitacion: parseInt(this.capacitacionEditandoId),
      idEntidadCap: 1, // Valor por defecto
      nombre: this.nuevaCapacitacion.nombre,
      titulo: this.nuevaCapacitacion.certificacion, // Usar certificacion como titulo (CAP_TITULO)
      categoria: 'Disponible',
      descripcion: this.nuevaCapacitacion.justificacion || '',
      estado: 'Disponible',
      fechaInicio: undefined,
      fechaFin: undefined,
      fechaExpiracion: undefined,
      urlVerificacion: this.nuevaCapacitacion.enlace || '',
      archivosAdjuntos: '',
      observaciones: '',
      duracion: this.nuevaCapacitacion.duracion,
      costo: 0,
      modalidad: 'Por definir'
    };

    // Llamar al servicio para actualizar en el backend
    this.gthCapacitacionService.GuardarGthCapacitacion(capacitacionData).subscribe({
      next: (response: any) => {
        // Actualizar la capacitación en la lista local
        const index = this.capacitacionesDisponibles.findIndex(cap => cap.id === this.capacitacionEditandoId);
        if (index !== -1) {
          this.capacitacionesDisponibles[index] = {
            ...this.capacitacionesDisponibles[index],
            nombre: this.nuevaCapacitacion.nombre,
            duracion: this.nuevaCapacitacion.duracion,
            certificacion: this.nuevaCapacitacion.certificacion
          };
        }
        
        // Mostrar mensaje de éxito
        Swal.fire({
          title: 'Capacitación actualizada',
          text: 'La capacitación ha sido actualizada exitosamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });

        // Cerrar el modal y resetear formulario
        this.closeEditModal();
        
        // Recargar capacitaciones del backend para asegurar sincronización
        this.cargarCapacitacionesDesdeBackend();
      },
      error: (error) => {
        console.error('Error al actualizar la capacitación:', error);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un error al actualizar la capacitación. Por favor, intenta nuevamente.',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    });
  }

  confirmarEliminacion(capacitacion: CapacitacionDisponible): void {
    Swal.fire({
      title: `¿Eliminar la capacitación "${capacitacion.nombre}"?`,
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.eliminarCapacitacion(capacitacion.id!, capacitacion.nombre);
      }
    });
  }

  private eliminarCapacitacion(id: string, nombre: string): void {
    // Validar que el ID exista
    if (!id || id === '') {
      Swal.fire({
        title: 'Error',
        text: 'No se puede eliminar esta capacitación. ID no válido.',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      return;
    }

    // Crear objeto de capacitación para eliminación (tipo 2)
    const capacitacionData: iGTHCapacitacion = {
      tipo: 2, // 2 = Eliminación
      idCapacitacion: parseInt(id),
      idEntidadCap: 0,
      nombre: 'string',
      titulo: 'string',
      categoria: 'string',
      descripcion: 'string',
      estado: 'string',
      fechaInicio: new Date().toISOString(),
      fechaFin: new Date().toISOString(),
      fechaExpiracion: new Date().toISOString(),
      urlVerificacion: 'string',
      archivosAdjuntos: 'string',
      observaciones: 'string',
      duracion: 0,
      costo: 0,
      modalidad: 'string'
    };

    // Llamar al servicio para eliminar en el backend
    this.gthCapacitacionService.GuardarGthCapacitacion(capacitacionData).subscribe({
      next: (response: any) => {
        // Eliminar de la lista local
        this.capacitacionesDisponibles = this.capacitacionesDisponibles.filter(cap => cap.id !== id);
        
        // Mostrar mensaje de éxito
        Swal.fire({
          title: 'Eliminado',
          text: `La capacitación "${nombre}" ha sido eliminada correctamente del servidor.`,
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });

        // Recargar capacitaciones del backend para asegurar sincronización
        this.cargarCapacitacionesDesdeBackend();
      },
      error: (error) => {
        // Error al eliminar la capacitación
        Swal.fire({
          title: 'Error',
          text: 'Hubo un error al eliminar la capacitación. Por favor, intenta nuevamente.',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    });
  }

  openEmployeeTrainingsModal(empleado: Empleado): void {
    // Buscar los datos de capacitación del empleado
    this.selectedEmployeeTrainings = this.employeeTrainingsData.find(
      emp => emp.empleado.nombre === empleado.nombre
    ) || null;
    
    if (this.selectedEmployeeTrainings) {
      this.showModal = true;
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedEmployeeTrainings = null;
  }

  /**
   * Abre el modal de asignación de empleados para una capacitación disponible
   */
  abrirModalAsignar(capacitacion: CapacitacionDisponible): void {
    this.capacitacionParaAsignar = capacitacion;
    this.cargandoEmpleadosGTH = true;
    this.showAssignModal = true;
    this.empleadoSeleccionado = null;
    // Cargar empleados GTH desde el backend (solo activos)
    this.gthEmpleadoService.MostrarConParametros(0, undefined, undefined, 'Activo').subscribe({
      next: (response: any) => {
        this.empleadosGTH = response.$values || response || [];
        this.cargandoEmpleadosGTH = false;
      },
      error: (error) => {
        this.empleadosGTH = [];
        this.cargandoEmpleadosGTH = false;
        console.error('Error al cargar empleados GTH:', error);
      }
    });
  }

  cerrarModalAsignar(): void {
    this.showAssignModal = false;
    this.capacitacionParaAsignar = null;
  }

  seleccionarEmpleado(emp: iGTHEmpleado): void {
    this.empleadoSeleccionado = emp;
  }

  confirmarAsignacion(event: Event): void {
    event.stopPropagation();
    if (!this.empleadoSeleccionado || !this.capacitacionParaAsignar) return;
    Swal.fire({
      title: '¿Asignar capacitación?',
      html: `¿Deseas asignar <b>${this.capacitacionParaAsignar.nombre}</b> a <b>${this.empleadoSeleccionado.nombre} ${this.empleadoSeleccionado.apellido}</b>?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, asignar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.crearAsignacionCapacitacion();
      }
    });
  }

  private crearAsignacionCapacitacion(): void {
    if (!this.empleadoSeleccionado || !this.capacitacionParaAsignar) return;
    const asignacionData = {
      tipo: 0, // 0 = Insertar
      idAsignacion: 0,
      idCapacitacion: this.capacitacionParaAsignar.id ? parseInt(this.capacitacionParaAsignar.id) : 0,
      idEmpleado: this.empleadoSeleccionado.idEmpleado,
      estado: 'En Progreso',
      fecha: new Date(), // Usar objeto Date
      observaciones: ''
    };
    this.gthAsignacionCapacitacionService.crearAsignacionCapacitacion(asignacionData).subscribe({
      next: () => {
        Swal.fire({
          title: 'Asignación exitosa',
          text: `La capacitación "${this.capacitacionParaAsignar?.nombre}" ha sido asignada a ${this.empleadoSeleccionado?.nombre} ${this.empleadoSeleccionado?.apellido}.`,
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        this.cerrarModalAsignar();
        this.refrescarAsignacionesEnCurso();
      },
      error: (error: any) => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo asignar la capacitación. Intenta nuevamente.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  abrirModalSolicitud(solicitud: GTHSolicitudCapacitacionDetalladaModel): void {
    this.solicitudSeleccionada = solicitud;
    this.respuestaJustificacion = '';
    this.showSolicitudModal = true;
  }

  cerrarModalSolicitud(): void {
    this.showSolicitudModal = false;
    this.solicitudSeleccionada = null;
    this.respuestaJustificacion = '';
  }

  aprobarSolicitud(): void {
    if (!this.solicitudSeleccionada) return;
    const respuestaTexto = this.respuestaJustificacion?.trim() || '';
    const respuesta = `Aceptada, ${respuestaTexto}`;
    const fechaRespuesta = new Date();

    const solicitudEditada = {
      tipo: 1, // Editar
      idCapacitacion: this.solicitudSeleccionada.idCapacitacion,
      idEmpleado: this.solicitudSeleccionada.idEmpleado,
      cedulaEmpleado: this.solicitudSeleccionada.cedulaEmpleado,
      justificacion: this.solicitudSeleccionada.justificacion,
      fechaSolicitud: this.solicitudSeleccionada.fechaSolicitud,
      respuesta: respuesta,
      fechaRespuesta: fechaRespuesta
    };

    this.gthSolicitudCapacitacionService.crearSolicitudCapacitacion(solicitudEditada).subscribe({
      next: () => {
        this.cerrarModalSolicitud();
        this.cargarSolicitudesCapacitacion();
        Swal.fire({
          title: 'Solicitud aprobada',
          text: 'La solicitud ha sido aprobada correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      },
      error: (error) => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo aprobar la solicitud. Intenta nuevamente.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  rechazarSolicitud(): void {
    if (!this.solicitudSeleccionada) return;
    const respuestaTexto = this.respuestaJustificacion?.trim() || '';
    const respuesta = `Rechazada, ${respuestaTexto}`;
    const fechaRespuesta = new Date();

    const solicitudEditada = {
      tipo: 1, // Editar
      idCapacitacion: this.solicitudSeleccionada.idCapacitacion,
      idEmpleado: this.solicitudSeleccionada.idEmpleado,
      cedulaEmpleado: this.solicitudSeleccionada.cedulaEmpleado,
      justificacion: this.solicitudSeleccionada.justificacion,
      fechaSolicitud: this.solicitudSeleccionada.fechaSolicitud,
      respuesta: respuesta,
      fechaRespuesta: fechaRespuesta
    };

    this.gthSolicitudCapacitacionService.crearSolicitudCapacitacion(solicitudEditada).subscribe({
      next: () => {
        this.cerrarModalSolicitud();
        this.cargarSolicitudesCapacitacion();
        Swal.fire({
          title: 'Solicitud rechazada',
          text: 'La solicitud ha sido rechazada correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      },
      error: (error) => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo rechazar la solicitud. Intenta nuevamente.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  // Devuelve el estado de la solicitud basado en el campo respuesta
  getEstadoSolicitud(solicitud: GTHSolicitudCapacitacionDetalladaModel): string {
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

  // Devuelve la clase de color para el estado de la solicitud
  getEstadoColor(solicitud: GTHSolicitudCapacitacionDetalladaModel): string {
    const estado = this.getEstadoSolicitud(solicitud);
    if (estado === 'Aprobada') return 'badge-success'; // verde
    if (estado === 'Rechazada') return 'badge-danger'; // rojo
    return 'badge-warning'; // amarillo para solicitada
  }

  getProgressColor(progreso?: number): string {
    if (!progreso) return '#gray-400';
    if (progreso < 30) return '#ef4444'; // rojo
    if (progreso < 70) return '#f59e0b'; // ámbar
    return '#10b981'; // verde esmeralda
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'En Curso': return 'estado-en-curso';
      case 'Completada': return 'estado-completada';
      case 'Solicitada': return 'estado-solicitada';
      default: return '';
    }
  }
}
