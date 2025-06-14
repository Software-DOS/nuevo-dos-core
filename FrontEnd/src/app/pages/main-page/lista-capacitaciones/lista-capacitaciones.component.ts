import { Component, OnInit } from '@angular/core';

declare var Swal: any;

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

@Component({
  selector: 'app-lista-capacitaciones',
  templateUrl: './lista-capacitaciones.component.html',
  styleUrls: ['./lista-capacitaciones.component.css']
})
export class ListaCapacitacionesComponent implements OnInit {

  activeTab: string = 'curso';
  showForm: boolean = false;
  showFormButton: boolean = true;

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
    { nombre: 'Comunicación Efectiva', duracion: 15, certificacion: 'Soft Skills Essentials', isStatic: true },
    { nombre: 'Excel para Análisis', duracion: 25, certificacion: 'Certificación Excel Avanzado', isStatic: true }
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

  constructor() { }

  ngOnInit(): void {
    this.cargarCapacitacionesGuardadas();
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

    const nuevaCapacitacion: CapacitacionDisponible = {
      id: Date.now().toString(),
      nombre: this.nuevaCapacitacion.nombre,
      duracion: this.nuevaCapacitacion.duracion,
      certificacion: this.nuevaCapacitacion.certificacion,
      isStatic: false
    };

    this.capacitacionesDisponibles.push(nuevaCapacitacion);
    this.guardarCapacitaciones();

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

    Swal.fire({
      title: 'Capacitación añadida',
      text: 'La capacitación ha sido registrada exitosamente.',
      icon: 'success',
      confirmButtonText: 'Aceptar'
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

  private guardarCapacitaciones(): void {
    const capacitacionesDinamicas = this.capacitacionesDisponibles.filter(cap => !cap.isStatic);
    localStorage.setItem('capacitacionesDisponibles', JSON.stringify(capacitacionesDinamicas));
  }
}
