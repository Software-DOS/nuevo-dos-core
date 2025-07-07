import { Component, OnInit, AfterViewInit } from '@angular/core';
import { GthEmpleadoService } from 'src/app/services/gthempleado.service';
import { iGTHEmpleado } from 'src/app/interface/igth-empleado';

declare var Swal: any;

interface EmployeeData {
  personalInfo: {
    fullName: string;
    email: string;
    position: string;
    area: string;
    subArea: string;
    photo: string;
  };
  bibliography: {
    birthDate: string;
    birthCountry: string;
    birthProvince: string;
    birthCity: string;
  };
  personalDetails: {
    firstName: string;
    lastName: string;
    gender: string;
    maritalStatus: string;
    bloodType: string;
    educationLevel: string;
    dependents: number;
    ethnic: string;
  };
  contact: {
    institutionalEmail: string;
    personalEmail: string;
    cellPhone: string;
    address: string;
  };
  emergency: {
    name: string;
    relationship: string;
    phone: string;
  };
  family: {
    spouse: {
      name: string;
      marriageDate: string;
      disability: string;
    };
    children: Array<{
      name: string;
      birthDate: string;
      disability: string;
    }>;
  };
  employment: {
    position: string;
    startDate: string;
    company: string;
    area: string;
    subArea: string;
    directManager: string;
    contractType: string;
    location: string;
  };
  workHistory: Array<{
    position: string;
    company: string;
    dates: string;
    functions: string;
  }>;
  education: {
    degrees: Array<{
      level: string;
      title: string;
      institution: string;
    }>;
    certifications: Array<{
      title: string;
      institution: string;
      date: string;
    }>;
  };
  languages: Array<{
    language: string;
    level: string;
  }>;
  projects: Array<{
    title: string;
    specialty: string;
    year: string;
  }>;
}

@Component({
  selector: 'app-admin-cv',
  templateUrl: './admin-cv.component.html',
  styleUrls: ['./admin-cv.component.css']
})
export class AdminCvComponent implements OnInit, AfterViewInit {
  
  // NgModel properties para filtros y búsqueda
  public empleadoSeleccionado: string = '5'; // Por defecto cargar empleado ID 1
  public filtroArea: string = '';
  public filtroDepartamento: string = '';
  public filtroEstado: string = '';
  public busquedaTexto: string = '';

  // Listas para dropdowns
  public listaEmpleados: any[] = [];
  public listaAreas: any[] = [];
  public listaDepartamentos: any[] = [];

  // Control de carga
  public cargando: boolean = false;
  public empleadoActual: any = null;

  // Datos del empleado desde el backend
  public empleadoBackend: iGTHEmpleado | null = null;

  employeeData: EmployeeData = {
    personalInfo: {
      fullName: 'Juan Carlos Rodríguez Martínez',
      email: 'juan.rodriguez@empresa.com',
      position: 'Analista de Sistemas',
      area: 'Tecnología de la Información',
      subArea: 'Desarrollo de Aplicaciones',
      photo: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
    },
    bibliography: {
      birthDate: '15 de marzo de 1985',
      birthCountry: 'España',
      birthProvince: 'Madrid',
      birthCity: 'Madrid'
    },
    personalDetails: {
      firstName: 'Juan Carlos',
      lastName: 'Rodríguez Martínez',
      gender: 'Masculino',
      maritalStatus: 'Casado',
      bloodType: 'O+',
      educationLevel: 'Máster',
      dependents: 2,
      ethnic: 'Hispano'
    },
    contact: {
      institutionalEmail: 'juan.rodriguez@empresa.com',
      personalEmail: 'juanc.rodriguez@gmail.com',
      cellPhone: '+34 612 345 678',
      address: 'Calle Serrano 123, 28006 Madrid'
    },
    emergency: {
      name: 'Ana Martínez López',
      relationship: 'Esposa',
      phone: '+34 623 456 789'
    },
    family: {
      spouse: {
        name: 'Ana Martínez López',
        marriageDate: '10 de junio de 2015',
        disability: 'No'
      },
      children: [
        {
          name: 'Carlos Rodríguez Martínez',
          birthDate: '5 de mayo de 2016',
          disability: 'No'
        }
      ]
    },
    employment: {
      position: 'Analista de Sistemas',
      startDate: '1 de enero de 2020',
      company: 'Tecnología Innovadora S.A.',
      area: 'Tecnología de la Información',
      subArea: 'Desarrollo de Aplicaciones',
      directManager: 'María Sánchez',
      contractType: 'Indefinido',
      location: 'Sede Central Madrid'
    },
    workHistory: [
      {
        position: 'Desarrollador Senior',
        company: 'Software Solutions Inc.',
        dates: '2018 - 2019',
        functions: 'Desarrollo de aplicaciones web empresariales, liderazgo de equipo técnico'
      },
      {
        position: 'Desarrollador Full Stack',
        company: 'Tech Innovations Ltd.',
        dates: '2016 - 2018',
        functions: 'Desarrollo full stack, implementación de APIs RESTful'
      },
      {
        position: 'Desarrollador Junior',
        company: 'Digital Systems Corp.',
        dates: '2014 - 2016',
        functions: 'Mantenimiento de aplicaciones web, desarrollo frontend'
      }
    ],
    education: {
      degrees: [
        {
          level: 'Título de Tercer Nivel',
          title: 'Ingeniería en Sistemas Informáticos',
          institution: 'Universidad Politécnica de Madrid'
        },
        {
          level: 'Títulos de Cuarto Nivel',
          title: 'Máster en Desarrollo de Software',
          institution: 'ESIC Business School'
        },
        {
          level: 'Títulos de Cuarto Nivel',
          title: 'Máster en Gestión de Proyectos IT',
          institution: 'IE Business School'
        }
      ],
      certifications: [
        {
          title: 'Certificación AWS Solutions Architect',
          institution: 'Amazon Web Services',
          date: '2022'
        }
      ]
    },
    languages: [
      {
        language: 'Inglés',
        level: 'Avanzado'
      }
    ],
    projects: [
      {
        title: 'Sistema de Gestión Empresarial',
        specialty: 'Desarrollo Full Stack',
        year: '2022'
      }
    ]
  };

  currentSection: string = 'bibliografia';
  currentSubSection: string = 'info-organizacional';

  constructor(private gthEmpleadoService: GthEmpleadoService) { }

  ngOnInit(): void {
    // Asegurar que bibliografía sea la sección activa por defecto
    this.currentSection = 'bibliografia';
    this.currentSubSection = 'info-organizacional';
    
    // Cargar empleado por defecto (ID 1)
    this.cargarEmpleadoPorId(5);
    this.cargarListasIniciales();
  }
  ngAfterViewInit(): void {
    this.initializeAnimations();
    this.showSection('bibliografia');
    this.showSubcategory('info-organizacional');
    this.initializeStickyNavigation();
    
    // Asegurar que bibliografía esté seleccionada al cargar
    setTimeout(() => {
      this.marcarCategoriaSeleccionada('bibliografia');
    }, 100);
  }

  showSection(targetId: string): void {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
      section.classList.remove('active');
    });

    // Reset all category links
    const links = document.querySelectorAll('.category-link');
    links.forEach(link => {
      link.classList.remove('selected');
    });

    // Show selected section
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.classList.add('active');
      
      // Add animation indices for list items
      const listItems = targetSection.querySelectorAll('li');
      listItems.forEach((li, index) => {
        (li as HTMLElement).style.setProperty('--index', index.toString());
      });
    }

    // Mark selected link
    const selectedLink = document.querySelector(`.category-link[data-target="${targetId}"]`);
    if (selectedLink) {
      selectedLink.classList.add('selected');
    }

    this.currentSection = targetId;
  }

  marcarCategoriaSeleccionada(targetId: string): void {
    // Asegurar que la categoría esté marcada como seleccionada
    const links = document.querySelectorAll('.category-link');
    links.forEach(link => {
      link.classList.remove('selected');
    });

    const selectedLink = document.querySelector(`.category-link[data-target="${targetId}"]`);
    if (selectedLink) {
      selectedLink.classList.add('selected');
    }

    // También asegurar que la sección esté activa
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.classList.add('active');
    }
  }

  showSubcategory(targetId: string): void {
    const section = document.querySelector(`#${targetId}`)?.closest('.content-section');
    
    if (section) {
      // Hide all subsections in current section
      const subsections = section.querySelectorAll('.subcategory-section');
      subsections.forEach(subsection => {
        subsection.classList.remove('active');
      });

      // Reset all subcategory links
      const subLinks = section.querySelectorAll('.subcategory-link');
      subLinks.forEach(link => {
        link.classList.remove('active');
      });

      // Show selected subsection
      const targetSubsection = document.getElementById(targetId);
      if (targetSubsection) {
        targetSubsection.classList.add('active');
      }

      // Mark selected link
      const selectedSubLink = section.querySelector(`.subcategory-link[data-subtarget="${targetId}"]`);
      if (selectedSubLink) {
        selectedSubLink.classList.add('active');
      }
    }

    this.currentSubSection = targetId;
  }

  onCategoryClick(event: Event, targetId: string): void {
    event.preventDefault();
    this.showSection(targetId);
  }

  onSubcategoryClick(event: Event, targetId: string): void {
    event.preventDefault();
    this.showSubcategory(targetId);
  }

  onPrintCV(): void {
    // Create hidden iframe for printing
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = 'exportar_cv.html';
    document.body.appendChild(iframe);

    // Wait for load and print
    iframe.onload = () => {
      if (iframe.contentWindow) {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      }

      // Clean up after printing
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 3000);
    };
  }

  toggleDropdown(): void {
    const dropdown = document.getElementById('profileMenu');
    if (dropdown) {
      dropdown.classList.toggle('show');
    }
  }

  private initializeAnimations(): void {
    // Back to top button functionality
    window.addEventListener('scroll', () => {
      const backToTop = document.querySelector('.back-to-top');
      if (backToTop) {
        if (window.pageYOffset > 300) {
          backToTop.classList.add('visible');
        } else {
          backToTop.classList.remove('visible');
        }
      }
    });

    // Back to top click handler
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }

    // Category link click handlers
    const categoryLinks = document.querySelectorAll('.category-link');
    categoryLinks.forEach(link => {
      link.addEventListener('click', (event) => {
        const targetId = (event.target as HTMLElement).getAttribute('data-target');
        if (targetId) {
          this.onCategoryClick(event, targetId);
        }
      });
    });

    // Subcategory link click handlers
    const subcategoryLinks = document.querySelectorAll('.subcategory-link');
    subcategoryLinks.forEach(link => {
      link.addEventListener('click', (event) => {
        const targetId = (event.target as HTMLElement).getAttribute('data-subtarget');
        if (targetId) {
          this.onSubcategoryClick(event, targetId);
        }
      });
    });
  }

  private initializeStickyNavigation(): void {
    const categoryIndex = document.querySelector('.category-index');
    
    if (categoryIndex) {
      // Crear un Intersection Observer para detectar cuando el elemento está sticky
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.intersectionRatio < 1) {
              // El elemento está sticky
              categoryIndex.classList.add('is-sticky');
            } else {
              // El elemento no está sticky
              categoryIndex.classList.remove('is-sticky');
            }
          });
        },
        {
          threshold: [1],
          rootMargin: '-80px 0px 0px 0px' // Ajustar según la posición top del sticky
        }
      );

      observer.observe(categoryIndex);
    }
  }

  // Métodos para cargar datos del backend
  cargarEmpleadoPorId(idEmpleado: number): void {
    this.cargando = true;
    
    // Usar el método con parámetros para cargar un empleado específico
    this.gthEmpleadoService.MostrarConParametros(1, idEmpleado).subscribe({
      next: (response: any) => {
        console.log('Respuesta del backend:', response);
        
        // Buscar el empleado específico en la respuesta
        let empleados = response.$values || response;
        if (Array.isArray(empleados) && empleados.length > 0) {
          this.empleadoActual = empleados[0]; // Tomar el primer resultado
        } else if (!Array.isArray(empleados) && empleados) {
          this.empleadoActual = empleados;
        } else {
          this.empleadoActual = null;
        }
        
        if (this.empleadoActual) {
          this.actualizarDatosEmpleado();
          // this.mostrarMensajeExito(`Empleado ${this.empleadoActual.nombre} ${this.empleadoActual.apellido} cargado correctamente`);
          console.log(`Empleado ${this.empleadoActual.nombre} ${this.empleadoActual.apellido} cargado correctamente`);
        } else {
          // this.mostrarMensajeError('Empleado no encontrado');
          console.warn('Empleado no encontrado');
        }
        
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar empleado:', error);
        // this.mostrarMensajeError('Error al cargar los datos del empleado');
        console.warn('Error al cargar los datos del empleado');
        this.cargando = false;
      }
    });
  }

  cargarListasIniciales(): void {
    // Cargar lista de empleados desde el backend
    this.gthEmpleadoService.MostrarConParametros(0).subscribe({
      next: (response: any) => {
        console.log('Lista de empleados:', response);
        let empleados = response.$values || response;
        
        if (Array.isArray(empleados)) {
          this.listaEmpleados = empleados.map(emp => ({
            id: emp.idEmpleado,
            nombre: `${emp.nombre || ''} ${emp.apellido || ''}`.trim() || `Empleado ${emp.idEmpleado}`
          }));
        }
      },
      error: (error) => {
        console.error('Error al cargar lista de empleados:', error);
        // Fallback a datos estáticos
        this.listaEmpleados = [
          { id: 1, nombre: 'Empleado 1' },
          { id: 2, nombre: 'Empleado 2' }
        ];
      }
    });
    
    // Listas estáticas por ahora (se pueden cargar del backend después)
    this.listaAreas = [
      { id: 1, nombre: 'Tecnología de la Información' },
      { id: 2, nombre: 'Recursos Humanos' },
      { id: 3, nombre: 'Marketing' },
      { id: 4, nombre: 'Ventas' },
      { id: 5, nombre: 'Administración' },
      { id: 6, nombre: 'Finanzas' }
    ];
    
    this.listaDepartamentos = [
      { id: 1, nombre: 'Desarrollo de Aplicaciones' },
      { id: 2, nombre: 'Gestión Humana' },
      { id: 3, nombre: 'Ventas Digitales' },
      { id: 4, nombre: 'Soporte Técnico' },
      { id: 5, nombre: 'Marketing Digital' },
      { id: 6, nombre: 'Contabilidad' }
    ];
  }

  actualizarDatosEmpleado(): void {
    if (!this.empleadoActual) return;
    
    // Actualizar employeeData con los datos del backend
    this.employeeData = {
      personalInfo: {
        fullName: `${this.empleadoActual.nombre || ''} ${this.empleadoActual.apellido || ''}`.trim() || 'Nombre no disponible',
        email: this.empleadoActual.correo || this.empleadoActual.correoCorporativo || 'Email no disponible',
        position: this.empleadoActual.cargoActual || 'Cargo no disponible',
        area: this.empleadoActual.area || 'Área no disponible',
        subArea: this.empleadoActual.subArea || 'Sub-área no disponible',
        photo: this.empleadoActual.fotoPerfilUrl || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
      },
      bibliography: {
        birthDate: this.empleadoActual.fechaNacimiento || 'Fecha no disponible',
        birthCountry: this.empleadoActual.paisNacimiento || 'País no disponible',
        birthProvince: this.empleadoActual.provinciaNacimiento || 'Provincia no disponible',
        birthCity: this.empleadoActual.ciudadNacimiento || 'Ciudad no disponible'
      },
      personalDetails: {
        firstName: this.empleadoActual.nombre || 'Nombre no disponible',
        lastName: this.empleadoActual.apellido || 'Apellido no disponible',
        gender: this.empleadoActual.sexo || 'No especificado',
        maritalStatus: this.empleadoActual.estadoCivil || 'No especificado',
        bloodType: this.empleadoActual.tipoSangre || 'No especificado',
        educationLevel: this.empleadoActual.nivelEstudio || 'No especificado',
        dependents: this.empleadoActual.cargasFamiliares || 0,
        ethnic: this.empleadoActual.etnia || 'No especificado'
      },
      contact: {
        institutionalEmail: this.empleadoActual.correoCorporativo || 'Email no disponible',
        personalEmail: this.empleadoActual.correo || 'Email no disponible',
        cellPhone: this.empleadoActual.telefono || 'Teléfono no disponible',
        address: this.empleadoActual.direccion || 'Dirección no disponible'
      },
      emergency: {
        name: this.empleadoActual.nombreEmergencia || 'No especificado',
        relationship: this.empleadoActual.relacionEmergencia || 'No especificado',
        phone: this.empleadoActual.telefonoEmergencia || 'No especificado'
      },
      family: {
        spouse: {
          name: this.empleadoActual.nombreConyuge || 'No especificado',
          marriageDate: this.empleadoActual.fechaMatrimonio || 'No especificado',
          disability: this.empleadoActual.discapacidadConyuge ? 'Sí' : 'No'
        },
        children: [] // Esto se cargaría de otra tabla/endpoint
      },
      employment: {
        position: this.empleadoActual.cargoActual || 'Cargo no disponible',
        startDate: this.empleadoActual.fechaContratacion || 'Fecha no disponible',
        company: this.empleadoActual.empresa || 'Empresa no disponible',
        area: this.empleadoActual.area || 'Área no disponible',
        subArea: this.empleadoActual.subArea || 'Sub-área no disponible',
        directManager: this.empleadoActual.jefeDirecto || 'No especificado',
        contractType: this.empleadoActual.tipoContrato || 'No especificado',
        location: this.empleadoActual.ubicacion || 'No especificado'
      },
      workHistory: [], // Esto se cargaría de otra tabla/endpoint
      education: {
        degrees: [], // Esto se cargaría de otra tabla/endpoint
        certifications: [] // Esto se cargaría de otra tabla/endpoint
      },
      languages: [], // Esto se cargaría de otra tabla/endpoint
      projects: [] // Esto se cargaría de otra tabla/endpoint
    };
    
    console.log('Datos actualizados del empleado:', this.employeeData);
  }

  onEmpleadoSeleccionadoChange(): void {
    if (this.empleadoSeleccionado) {
      const idEmpleado = parseInt(this.empleadoSeleccionado);
      if (!isNaN(idEmpleado)) {
        this.cargarEmpleadoPorId(idEmpleado);
      }
    }
  }

  aplicarFiltros(): void {
    // Implementar lógica de filtros si es necesario
    console.log('Aplicando filtros:', {
      area: this.filtroArea,
      departamento: this.filtroDepartamento,
      estado: this.filtroEstado,
      busqueda: this.busquedaTexto
    });
  }

  buscarEmpleados(): void {
    // Implementar búsqueda si es necesario
    console.log('Buscando empleados con:', this.busquedaTexto);
  }

  mostrarMensajeError(mensaje: string): void {
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        title: 'Error',
        text: mensaje,
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    } else {
      alert(mensaje);
    }
  }

  mostrarMensajeExito(mensaje: string): void {
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        title: 'Éxito',
        text: mensaje,
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
    } else {
      alert(mensaje);
    }
  }
}
