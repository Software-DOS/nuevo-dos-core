import { Component, OnInit } from '@angular/core';
import { GthCapacitacionService } from 'src/app/services/gthcapacitacion.service';
import { GthSolicitudCapacitacionService, GTHSolicitudCapacitacionDetalladaModel } from 'src/app/services/gth-solicitud-capacitacion.service';
import { GthAsignacionCapacitacionService, GTHAsignacionCapacitacionDetalladaModel } from 'src/app/services/gth-asignacion-capacitacion.service';
import { GthEmpleadoService } from 'src/app/services/gthempleado.service';
import { iGTHCapacitacion } from 'src/app/interface/ight-capacitacion';
import { iGTHEmpleado } from 'src/app/interface/igth-empleado';
import { environment } from 'src/environments/environment';
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

  // Nuevas propiedades para asignaciones pendientes (aprobadas pero no iniciadas)
  asignacionesPendientes: GTHAsignacionCapacitacionDetalladaModel[] = [];
  cargandoAsignacionesPendientes: boolean = false;

  // Nuevas propiedades para capacitaciones completadas (vista admin)
  capacitacionesCompletadas: GTHAsignacionCapacitacionDetalladaModel[] = [];
  cargandoCompletadas: boolean = false;

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
    this.cargarAsignacionesPendientes(); // Cargar asignaciones pendientes
    this.cargarCapacitacionesCompletadas(); // Cargar capacitaciones completadas
  }

  private cargarSolicitudesCapacitacion(): void {
    this.cargandoSolicitudes = true;
    
    // Cargar todas las solicitudes (tipo 0 = todas)
    this.gthSolicitudCapacitacionService.mostrarSolicitudesCapacitacionDetallada(0).subscribe({
      next: (response: GTHSolicitudCapacitacionDetalladaModel[]) => {
        console.log('Solicitudes detalladas obtenidas:', response);
        
        // Obtener todas las asignaciones activas para filtrar capacitaciones ya iniciadas
        this.gthAsignacionCapacitacionService.mostrarAsignacionesEnCurso(0).subscribe({
          next: (asignaciones: GTHAsignacionCapacitacionDetalladaModel[]) => {
            // Obtener IDs de capacitaciones que ya tienen asignaciones activas
            const idsCapacitacionesConAsignacion = asignaciones.map(a => a.idCapacitacion);
            console.log('IDs de capacitaciones con asignaciones activas:', idsCapacitacionesConAsignacion);
            
            // Filtrar solicitudes excluyendo las que ya tienen asignación activa
            this.solicitudesDetalladas = (response || []).filter(solicitud => 
              !idsCapacitacionesConAsignacion.includes(solicitud.idCapacitacion)
            );
            
            console.log('Solicitudes filtradas (sin asignaciones activas):', this.solicitudesDetalladas);
            this.cargandoSolicitudes = false;
          },
          error: (errorAsignaciones) => {
            console.warn('Error al obtener asignaciones para filtrar, mostrando todas las solicitudes:', errorAsignaciones);
            // En caso de error al obtener asignaciones, mostrar todas las solicitudes
            this.solicitudesDetalladas = response || [];
            this.cargandoSolicitudes = false;
          }
        });
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
        // Filtrar solo las asignaciones que están realmente en curso (progreso > 0 y < 100)
        this.asignacionesEnCurso = (response || []).filter(asignacion => 
          asignacion.progreso && asignacion.progreso > 0 && asignacion.progreso < 100
        );
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

  /**
   * Carga las asignaciones pendientes (aprobadas por admin pero no iniciadas por empleado)
   * Estas son asignaciones con progreso = 0 o null
   */
  private cargarAsignacionesPendientes(): void {
    this.cargandoAsignacionesPendientes = true;
    console.log('[ListaCapacitaciones] Cargando asignaciones pendientes...');
    
    this.gthAsignacionCapacitacionService.mostrarAsignacionesEnCurso(0).subscribe({
      next: (response: GTHAsignacionCapacitacionDetalladaModel[]) => {
        // Filtrar solo las asignaciones con progreso = 0 o null (pendientes de iniciar)
        this.asignacionesPendientes = (response || []).filter(asignacion => 
          !asignacion.progreso || asignacion.progreso === 0
        );
        console.log('[ListaCapacitaciones] Asignaciones pendientes cargadas:', this.asignacionesPendientes.length, 'registros');
        this.cargandoAsignacionesPendientes = false;
      },
      error: (error) => {
        console.error('[ListaCapacitaciones] Error al cargar asignaciones pendientes:', error);
        this.asignacionesPendientes = []; // Limpiar en caso de error
        this.cargandoAsignacionesPendientes = false;
      }
    });
  }

  /**
   * Refresca la lista de asignaciones pendientes
   */
  public refrescarAsignacionesPendientes(): void {
    console.log('[ListaCapacitaciones] Refrescando asignaciones pendientes...');
    this.cargarAsignacionesPendientes();
  }

  /**
   * Carga las capacitaciones completadas desde el backend
   */
  private cargarCapacitacionesCompletadas(): void {
    this.cargandoCompletadas = true;
    console.log('[ListaCapacitaciones] Cargando capacitaciones completadas...');

    // Usar mostrarAsignacionesEnCurso() para obtener todas las asignaciones y filtrar las completadas
    this.gthAsignacionCapacitacionService.mostrarAsignacionesEnCurso().subscribe({
      next: (todasAsignaciones: GTHAsignacionCapacitacionDetalladaModel[]) => {
        console.log('[ListaCapacitaciones] Todas las asignaciones obtenidas:', todasAsignaciones);
        
        // Filtrar solo las que tienen progreso >= 100%
        this.capacitacionesCompletadas = (todasAsignaciones || []).filter(asignacion => 
          asignacion.progreso !== null && 
          asignacion.progreso !== undefined && 
          asignacion.progreso >= 100
        );

        console.log('[ListaCapacitaciones] Capacitaciones completadas filtradas:', this.capacitacionesCompletadas.length, 'registros');
        this.cargandoCompletadas = false;
      },
      error: (error) => {
        console.error('[ListaCapacitaciones] Error al cargar capacitaciones completadas:', error);
        this.capacitacionesCompletadas = []; // Limpiar en caso de error
        this.cargandoCompletadas = false;
      }
    });
  }

  /**
   * Refresca la lista de capacitaciones completadas
   */
  public refrescarCapacitacionesCompletadas(): void {
    console.log('[ListaCapacitaciones] Refrescando capacitaciones completadas...');
    this.cargarCapacitacionesCompletadas();
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

    const idCapacitacion = parseInt(id);

    // Primero verificar si tiene dependencias para mostrar advertencia adecuada
    this.gthCapacitacionService.verificarDependencias(idCapacitacion).subscribe({
      next: (verificacion: any) => {
        // Mostrar modal de confirmación con información específica
        const mensajeAdvertencia = verificacion.tieneDependencias 
          ? `⚠️ Esta capacitación tiene solicitudes o asignaciones relacionadas.\n\n` +
            `Se marcará como "inactiva" en lugar de eliminarse para preservar la integridad de los datos.\n\n` +
            `¿Desea continuar?`
          : `Esta capacitación será eliminada completamente del sistema.\n\n` +
            `¿Está seguro de que desea eliminar "${nombre}"?`;

        Swal.fire({
          title: verificacion.tieneDependencias ? 'Marcar como Inactiva' : 'Eliminar Capacitación',
          text: mensajeAdvertencia,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: verificacion.tieneDependencias ? '#f39c12' : '#d33',
          cancelButtonColor: '#6c757d',
          confirmButtonText: verificacion.tieneDependencias ? 'Sí, marcar como inactiva' : 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.ejecutarEliminacionInteligente(idCapacitacion, nombre, verificacion.tieneDependencias);
          }
        });
      },
      error: (error) => {
        console.error('Error al verificar dependencias:', error);
        // Si hay error en verificación, proceder con eliminación estándar
        this.mostrarConfirmacionEliminacion(idCapacitacion, nombre);
      }
    });
  }

  private ejecutarEliminacionInteligente(idCapacitacion: number, nombre: string, tieneDependencias: boolean): void {
    // Llamar al nuevo endpoint de eliminación inteligente
    this.gthCapacitacionService.eliminarInteligente(idCapacitacion).subscribe({
      next: (response: any) => {
        if (response.success) {
          // Eliminar de la lista local (tanto si se elimina como si se marca inactiva)
          this.capacitacionesDisponibles = this.capacitacionesDisponibles.filter(cap => cap.id !== idCapacitacion.toString());
          
          // Mostrar mensaje de éxito apropiado
          const icono = tieneDependencias ? 'info' : 'success';
          const titulo = tieneDependencias ? 'Marcada como Inactiva' : 'Eliminada';
          
          Swal.fire({
            title: titulo,
            text: response.message,
            icon: icono,
            confirmButtonText: 'Aceptar'
          });

          // Recargar capacitaciones del backend para asegurar sincronización
          this.cargarCapacitacionesDesdeBackend();
        } else {
          Swal.fire({
            title: 'Error',
            text: response.message || 'No se pudo procesar la eliminación.',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        }
      },
      error: (error) => {
        console.error('Error en eliminación inteligente:', error);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un error al procesar la eliminación. Por favor, intenta nuevamente.',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    });
  }

  private mostrarConfirmacionEliminacion(idCapacitacion: number, nombre: string): void {
    Swal.fire({
      title: '¿Eliminar Capacitación?',
      text: `¿Está seguro de que desea eliminar "${nombre}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ejecutarEliminacionInteligente(idCapacitacion, nombre, false);
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
        // Después de aprobar la solicitud, crear una asignación de capacitación para el empleado
        const nuevaAsignacion = {
          tipo: 0, // Insertar nueva asignación
          idCapacitacion: this.solicitudSeleccionada!.idCapacitacion,
          idEmpleado: this.solicitudSeleccionada!.idEmpleado,
          cedulaEmpleado: this.solicitudSeleccionada!.cedulaEmpleado,
          fecha: new Date(),
          progreso: 0 // Inicia con progreso 0, hasta que el empleado la inicie
        };

        this.gthAsignacionCapacitacionService.crearAsignacionCapacitacion(nuevaAsignacion).subscribe({
          next: () => {
            console.log('Asignación de capacitación creada exitosamente para el empleado');
            this.cerrarModalSolicitud();
            this.cargarSolicitudesCapacitacion();
            this.cargarAsignacionesEnCurso(); // Actualizar la vista de asignaciones
            this.cargarAsignacionesPendientes(); // Actualizar la vista de asignaciones pendientes
            Swal.fire({
              title: 'Solicitud aprobada',
              text: 'La solicitud ha sido aprobada correctamente y la capacitación está disponible para el empleado.',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            });
          },
          error: (error) => {
            console.error('Error al crear asignación de capacitación:', error);
            // Aun así mostrar éxito porque la solicitud sí se aprobó
            this.cerrarModalSolicitud();
            this.cargarSolicitudesCapacitacion();
            Swal.fire({
              title: 'Solicitud aprobada',
              text: 'La solicitud ha sido aprobada, pero hubo un problema al crear la asignación. Por favor contacta al administrador.',
              icon: 'warning',
              confirmButtonText: 'Aceptar'
            });
          }
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
      
      console.log('[ListaCapacitaciones] Abriendo certificado:', urlCompleta);
      
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
}
