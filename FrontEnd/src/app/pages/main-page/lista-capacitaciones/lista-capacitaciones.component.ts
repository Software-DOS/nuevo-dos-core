import { Component, OnInit } from '@angular/core';
import { GthCapacitacionService } from 'src/app/services/gthcapacitacion.service';
import { iGTHCapacitacion } from 'src/app/interface/ight-capacitacion';
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
  selectedEmployeeTrainings: EmpleadoCapacitaciones | null = null;
  capacitacionEditandoId: string | null = null;

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

  capacitacionesDisponibles: CapacitacionDisponible[] = [
    { id: 'demo-1', nombre: 'Gestión de Proyectos', duracion: 30, certificacion: 'PMI Básico', isStatic: false },
    { id: 'demo-2', nombre: 'Desarrollo Web', duracion: 40, certificacion: 'Web Developer', isStatic: false }
  ];

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

  // Data for modal - Employee training details
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

  constructor(private gthCapacitacionService: GthCapacitacionService) { }

  ngOnInit(): void {
    this.cargarCapacitacionesGuardadas();
    this.cargarCapacitacionesDesdeBackend();
  }

  private cargarCapacitacionesDesdeBackend(): void {
    // Cargar capacitaciones disponibles del backend
    this.gthCapacitacionService.MostrarCapacitaciones(0).subscribe({
      next: (response: any) => {
        if (response && Array.isArray(response)) {
          // Convertir las capacitaciones del backend al formato local
          const capacitacionesBackend = response.map((cap: any) => ({
            id: cap.idCapacitacion.toString(),
            nombre: cap.nombre,
            duracion: cap.duracion || 0,
            certificacion: cap.titulo || '',
            isStatic: true // Marcar como estáticas las del backend
          }));
          
          // Agregar las capacitaciones del backend a las locales
          this.capacitacionesDisponibles = [
            ...this.capacitacionesDisponibles.filter(cap => !cap.isStatic), // Mantener solo las locales
            ...capacitacionesBackend
          ];
        }
      },
      error: (error) => {
        console.error('Error al cargar capacitaciones del backend:', error);
      }
    });
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
      titulo: this.nuevaCapacitacion.nombre,
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
        console.log('Capacitación guardada exitosamente:', response);
        
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

        this.guardarCapacitaciones();
        this.resetForm();
      },
      error: (error) => {
        console.error('Error al guardar la capacitación:', error);
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
  }

  editarCapacitacion(capacitacion: CapacitacionDisponible): void {
    // Llenar el formulario con los datos de la capacitación a editar
    this.nuevaCapacitacion = {
      nombre: capacitacion.nombre,
      duracion: capacitacion.duracion,
      certificacion: capacitacion.certificacion,
      justificacion: '',
      enlace: ''
    };
    
    // Guardar el ID de la capacitación que se está editando (si no es estática)
    // Para capacitaciones estáticas, se creará una nueva entrada dinámica
    this.capacitacionEditandoId = capacitacion.isStatic ? null : (capacitacion.id || null);
    
    // Mostrar el formulario
    this.showForm = true;
    this.showFormButton = false;
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
        this.eliminarCapacitacion(capacitacion.id!);
        Swal.fire({
          title: 'Eliminado',
          text: `La capacitación "${capacitacion.nombre}" ha sido eliminada correctamente.`,
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  private eliminarCapacitacion(id: string): void {
    this.capacitacionesDisponibles = this.capacitacionesDisponibles.filter(cap => cap.id !== id);
    this.guardarCapacitaciones();
  }

  private cargarCapacitacionesGuardadas(): void {
    const capacitacionesGuardadas = localStorage.getItem('capacitacionesDisponibles');
    if (capacitacionesGuardadas) {
      const capacitacionesDinamicas = JSON.parse(capacitacionesGuardadas);
      // Añadir las capacitaciones dinámicas a las estáticas
      this.capacitacionesDisponibles = [
        ...this.capacitacionesDisponibles,
        ...capacitacionesDinamicas.map((cap: any) => ({ ...cap, isStatic: false }))
      ];
    }
  }

  openEmployeeTrainingsModal(empleado: Empleado): void {
    // Find employee training data
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

  getProgressColor(progreso?: number): string {
    if (!progreso) return '#gray-400';
    if (progreso < 30) return '#ef4444'; // red
    if (progreso < 70) return '#f59e0b'; // amber
    return '#10b981'; // emerald
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'En Curso': return 'estado-en-curso';
      case 'Completada': return 'estado-completada';
      case 'Solicitada': return 'estado-solicitada';
      default: return '';
    }
  }

  private guardarCapacitaciones(): void {
    const capacitacionesDinamicas = this.capacitacionesDisponibles.filter(cap => !cap.isStatic);
    localStorage.setItem('capacitacionesDisponibles', JSON.stringify(capacitacionesDinamicas));
  }
}
