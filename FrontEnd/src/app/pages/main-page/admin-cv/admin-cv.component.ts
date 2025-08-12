import { Component, OnInit, AfterViewInit } from '@angular/core';
import { GthEmpleadoService } from 'src/app/services/gthempleado.service';
import { iGTHEmpleado } from 'src/app/interface/igth-empleado';
import { ActivatedRoute } from '@angular/router';

import * as CryptoJS from 'crypto-js';

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

  // Variable para almacenar la información del empleado
  empleado: iGTHEmpleado | null = null;
  // cedulaEmpleado: string = ''; // Cambia esto por la cédula real del empleado

  /* -------------  Campos para mostrar en el HTML  ----------  */
// Variables para mostrar la información (solo lectura)

  fotoPerfilUrl: string = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'; // Imagen por defecto
  fotoPerfilUrlDisplay: string = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

  nombreCompletoDisplay: string = ''; 
  nombresDisplay: string = '';
  apellidosDisplay: string = '';
  correoElectronicoDisplay: string = ''; 
  posicionDisplay: string = ''; 
  areaDisplay: string = ''; 
  subareaDisplay: string = '';

  fechaNacimientoDisplay: string = '';
  sexoDisplay: string = '';
  tipoSangreDisplay: string = '';
  etniaDisplay: string = '';
  numeroCedulaDisplay: string = '';
  paisNacimientoDisplay: string = '';
  provinciaNacimientoDisplay: string = '';
  ciudadNacimientoDisplay: string = '';

  documentoIdentidadDisplay: string = '';

  correoInstitucionalDisplay: string = '';
  correoPersonalDisplay: string = '';
  numeroCelularDisplay: string = '';
  direccionDisplay: string = '';

  nivelEstudioDisplay: string = '';
  cargasFamiliaresDisplay: string = '';

  nombreEmergenciaDisplay: string = '';
  relacionEmergenciaDisplay: string = '';
  telefonoEmergenciaDisplay: string = '';

  estadoConyugalDisplay: string = ''; //Duplicado en html
  nombreConyugeDisplay: string = '';
  fechaMatrimonioDisplay: string = '';

  discapacidadConyugeDisplay: string = '';
  
  nombreDepDisplay: string = '';
  fechaNacimientoDepDisplay: string = '';
  discapacidadDepDisplay: string = '';

  // Dependientes
  employeeData: {
    family: {
      children: Array<{
        name: string;
        birthDate: string;
        disability: string;
      }>;
    };
  } = {
    family: {
      children: []  // Por ahora está vacío
    }
  };
  // Empleo actual
  currentPosition: string = '';
  employmentStartDate: string = '';
  currentCompany: string = '';
  employmentArea: string = '';
  employmentSubArea: string = '';
  directManager: string = '';
  contractType: string = '';
  employmentLocation: string = '';


  // Familia
  // spouseName: string = 'Ana Martínez López';
  // spouseMarriageDate: string = '10 de junio de 2015';
  // spouseDisability: string = 'No';

  // children: { name: string; birthDate: string; disability: string }[] = [
  //   {
  //     name: 'Carlos Rodríguez Martínez',
  //     birthDate: '5 de mayo de 2016',
  //     disability: 'No'
  //   }
  // ];

//   // Empleo actual
//   currentPosition: string = 'Analista de Sistemas';
//   employmentStartDate: string = '1 de enero de 2020';
//   currentCompany: string = 'Tecnología Innovadora S.A.';
//   employmentArea: string = 'Tecnología de la Información';
//   employmentSubArea: string = 'Desarrollo de Aplicaciones';
//   directManager: string = 'María Sánchez';
//   contractType: string = 'Indefinido';
//   employmentLocation: string = 'Sede Central Madrid';

//   // Historial laboral
//   workHistory: { position: string; company: string; dates: string; functions: string }[] = [
//     {
//       position: 'Desarrollador Senior',
//       company: 'Software Solutions Inc.',
//       dates: '2018 - 2019',
//       functions: 'Desarrollo de aplicaciones web empresariales, liderazgo de equipo técnico'
//     },
//     {
//       position: 'Desarrollador Full Stack',
//       company: 'Tech Innovations Ltd.',
//       dates: '2016 - 2018',
//       functions: 'Desarrollo full stack, implementación de APIs RESTful'
//     },
//     {
//       position: 'Desarrollador Junior',
//       company: 'Digital Systems Corp.',
//       dates: '2014 - 2016',
//       functions: 'Mantenimiento de aplicaciones web, desarrollo frontend'
//     }
//   ];

// // Educación
// educationDegrees: { level: string; title: string; institution: string }[] = [
//   {
//     level: 'Título de Tercer Nivel',
//     title: 'Ingeniería en Sistemas Informáticos',
//     institution: 'Universidad Politécnica de Madrid'
//   },
//   {
//     level: 'Títulos de Cuarto Nivel',
//     title: 'Máster en Desarrollo de Software',
//     institution: 'ESIC Business School'
//   },
//   {
//     level: 'Títulos de Cuarto Nivel',
//     title: 'Máster en Gestión de Proyectos IT',
//     institution: 'IE Business School'
//   }
// ];

// certifications: { title: string; institution: string; date: string }[] = [
//   {
//     title: 'Certificación AWS Solutions Architect',
//     institution: 'Amazon Web Services',
//     date: '2022'
//   }
// ];

// // Idiomas
// languages: { language: string; level: string }[] = [
//   {
//     language: 'Inglés',
//     level: 'Avanzado'
//   }
// ];

// // Proyectos
// projects: { title: string; specialty: string; year: string }[] = [
//   {
//     title: 'Sistema de Gestión Empresarial',
//     specialty: 'Desarrollo Full Stack',
//     year: '2022'
//   }
// ];

  // Control de carga
  public cargando: boolean = false;
  public empleadoActual: any = null;

  // Datos del empleado desde el backend
  public empleadoBackend: iGTHEmpleado | null = null;

  //employeeData: EmployeeData | null = null;

  
  
  currentSection: string = 'info-personal';
  currentSubSection: string = 'info-organizacional';

  constructor(
    private gthEmpleadoService: GthEmpleadoService,
    private route: ActivatedRoute 
  ) { }


  ngOnInit(): void {
    // Asegurar que bibliografía sea la sección activa por defecto
    this.currentSection = 'info-personal';
    this.currentSubSection = 'info-organizacional';
    
    // Cargar empleado por defecto (ID 1)
    this.cargarEmpleadoPorId(5);
    this.cargarListasIniciales();

    const encryptedId = this.route.snapshot.paramMap.get('id');
    const decryptedId = CryptoJS.AES.decrypt(encryptedId!, 'clave_secreta').toString(CryptoJS.enc.Utf8);
    console.log('Cédula descifrada:', decryptedId); //Borrar

    this.buscarEmpleadoPorCedula(decryptedId);
  }

  /**
   * Busca un empleado específico por cédula
   * @param cedula - Cédula del empleado a buscar
   */
  buscarEmpleadoPorCedula(cedula: string): void {
    console.log('Componente: cédula enviada al servicio ->', cedula); // 👈 AÑADIR ESTO

    this.gthEmpleadoService.BuscarPorCedula(cedula).subscribe({
      next: (empleado: any) => {
        console.log('Respuesta del backend ->', empleado);

        const datosEmpleado = empleado?.$values?.[0];

        if (datosEmpleado) {
          this.empleado = datosEmpleado;
          this.mapearDatosParaMostrar();
        } else {
          console.warn('No se encontró empleado con la cédula:', cedula);
        }
      },
      error: (error) => {
        console.error('Error al buscar empleado por cédula:', error);
      }
    });
  }

  /**
   * Mapea los datos del empleado a las variables de visualización
   */
  private mapearDatosParaMostrar(): void {
    if (this.empleado) {
      // Información básica
      // Mostrar foto si existe, si no usar imagen por defecto
      this.fotoPerfilUrl = this.empleado.fotoPerfilUrl?.trim()
      ? this.empleado.fotoPerfilUrl
      : 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

      this.nombreCompletoDisplay = `${this.empleado.nombre} ${this.empleado.apellido}`;
      this.nombresDisplay = `${this.empleado.nombre}`; 
      this.apellidosDisplay = `${this.empleado.apellido}`;
      this.correoElectronicoDisplay = this.empleado.correo || this.empleado.correoCorporativo;
      this.posicionDisplay = this.empleado.cargoActual;
      this.areaDisplay = this.empleado.area;
      this.subareaDisplay = this.empleado.subarea;

      // Información personal
      this.fechaNacimientoDisplay = this.empleado.fechaNacimiento || '';
      this.sexoDisplay = this.empleado.sexo;
      this.tipoSangreDisplay = this.empleado.tipoSangre;
      this.etniaDisplay = this.empleado.etnia;      
      this.paisNacimientoDisplay = this.empleado.paisNacimiento;
      this.provinciaNacimientoDisplay = this.empleado.provinciaNacimiento;
      this.ciudadNacimientoDisplay = this.empleado.ciudadNacimiento;
      this.numeroCedulaDisplay = this.empleado.cedula;
      this.documentoIdentidadDisplay = this.empleado.documentoIdentidad;

      this.correoInstitucionalDisplay = this.empleado.correoCorporativo;
      this.correoPersonalDisplay = this.empleado.correo;
      this.numeroCelularDisplay = this.empleado.telefono;
      this.direccionDisplay = this.empleado.direccion;

      this.nivelEstudioDisplay = this.empleado.nivelEstudio;
      this.cargasFamiliaresDisplay = (this.empleado.cargasFamiliares ?? 0).toString(); //Asignamos por defecto 0

      this.nombreEmergenciaDisplay = this.empleado.nombreEmergencia;
      this.relacionEmergenciaDisplay = this.empleado.relacionEmergencia;
      this.telefonoEmergenciaDisplay = this.empleado.telefonoEmergencia;

      

      //Informacion de Dependientes
      this.estadoConyugalDisplay = this.empleado.estadoCivil;
      this.nombreConyugeDisplay = this.empleado.nombreConyuge;
      this.fechaMatrimonioDisplay = this.empleado.fechaMatrimonio;
      this.discapacidadConyugeDisplay = this.empleado.discapacidadConyuge === true ? 'Sí' : this.empleado.discapacidadConyuge === false 
      ? 'No' : 'No registrado'; //Asignamos por defecto

      this.employeeData = {
        family: {
          children: [
            {
              name: 'Leo',
              birthDate: '1994-12-01',
              disability: 'No'
            },
            {
              name: 'Jose',
              birthDate: '1992-12-01',
              disability: 'No'
            }
          ]
        }
      };

    }
  }  






  ngAfterViewInit(): void {
    this.initializeAnimations();
    this.initializeStickyNavigation();
    
    // Mostrar sección inicial (esto ya hace todo: mostrar, marcar, animar)
    this.showSection('info-personal');
    this.showSubcategory('info-organizacional'); // si aplica
  }


  showSection(targetId: string): void {
  // Hide all sections
  const sections = document.querySelectorAll('.content-section');
  sections.forEach(section => {
    section.classList.remove('active');
  });
  
  // Reset all category links - CAMBIAR de .category-link a .category-link3
  const links = document.querySelectorAll('.category-link3');
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
  
  // Mark selected link - CAMBIAR de .category-link a .category-link3
  const selectedLink = document.querySelector(`.category-link3[data-target="${targetId}"]`);
  if (selectedLink) {
    selectedLink.classList.add('selected');
  }
  
  this.currentSection = targetId;
}

  // marcarCategoriaSeleccionada(targetId: string): void {
  //   // Asegurar que la categoría esté marcada como seleccionada
  //   const links = document.querySelectorAll('.category-link');
  //   links.forEach(link => {
  //     link.classList.remove('selected');
  //   });

  //   const selectedLink = document.querySelector(`.category-link[data-target="${targetId}"]`);
  //   if (selectedLink) {
  //     selectedLink.classList.add('selected');
  //   }

  //   // También asegurar que la sección esté activa
  //   const targetSection = document.getElementById(targetId);
  //   if (targetSection) {
  //     targetSection.classList.add('active');
  //   }
  // }

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
          //this.actualizarDatosEmpleado();
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

  // actualizarDatosEmpleado(): void {
  //   if (!this.empleadoActual) return;
    
  //   // Actualizar employeeData con los datos del backend
  //   this.employeeData = {
  //     personalInfo: {
  //       fullName: `${this.empleadoActual.nombre || ''} ${this.empleadoActual.apellido || ''}`.trim() || 'Nombre no disponible',
  //       email: this.empleadoActual.correo || this.empleadoActual.correoCorporativo || 'Email no disponible',
  //       position: this.empleadoActual.cargoActual || 'Cargo no disponible',
  //       area: this.empleadoActual.area || 'Área no disponible',
  //       subArea: this.empleadoActual.subArea || 'Sub-área no disponible',
  //       photo: this.empleadoActual.fotoPerfilUrl || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
  //     },
  //     bibliography: {
  //       birthDate: this.empleadoActual.fechaNacimiento || 'Fecha no disponible',
  //       birthCountry: this.empleadoActual.paisNacimiento || 'País no disponible',
  //       birthProvince: this.empleadoActual.provinciaNacimiento || 'Provincia no disponible',
  //       birthCity: this.empleadoActual.ciudadNacimiento || 'Ciudad no disponible'
  //     },
  //     personalDetails: {
  //       firstName: this.empleadoActual.nombre || 'Nombre no disponible',
  //       lastName: this.empleadoActual.apellido || 'Apellido no disponible',
  //       gender: this.empleadoActual.sexo || 'No especificado',
  //       maritalStatus: this.empleadoActual.estadoCivil || 'No especificado',
  //       bloodType: this.empleadoActual.tipoSangre || 'No especificado',
  //       educationLevel: this.empleadoActual.nivelEstudio || 'No especificado',
  //       dependents: this.empleadoActual.cargasFamiliares || 0,
  //       ethnic: this.empleadoActual.etnia || 'No especificado'
  //     },
  //     contact: {
  //       institutionalEmail: this.empleadoActual.correoCorporativo || 'Email no disponible',
  //       personalEmail: this.empleadoActual.correo || 'Email no disponible',
  //       cellPhone: this.empleadoActual.telefono || 'Teléfono no disponible',
  //       address: this.empleadoActual.direccion || 'Dirección no disponible'
  //     },
  //     emergency: {
  //       name: this.empleadoActual.nombreEmergencia || 'No especificado',
  //       relationship: this.empleadoActual.relacionEmergencia || 'No especificado',
  //       phone: this.empleadoActual.telefonoEmergencia || 'No especificado'
  //     },
  //     family: {
  //       spouse: {
  //         name: this.empleadoActual.nombreConyuge || 'No especificado',
  //         marriageDate: this.empleadoActual.fechaMatrimonio || 'No especificado',
  //         disability: this.empleadoActual.discapacidadConyuge ? 'Sí' : 'No'
  //       },
  //       children: [] // Esto se cargaría de otra tabla/endpoint
  //     },
  //     employment: {
  //       position: this.empleadoActual.cargoActual || 'Cargo no disponible',
  //       startDate: this.empleadoActual.fechaContratacion || 'Fecha no disponible',
  //       company: this.empleadoActual.empresa || 'Empresa no disponible',
  //       area: this.empleadoActual.area || 'Área no disponible',
  //       subArea: this.empleadoActual.subArea || 'Sub-área no disponible',
  //       directManager: this.empleadoActual.jefeDirecto || 'No especificado',
  //       contractType: this.empleadoActual.tipoContrato || 'No especificado',
  //       location: this.empleadoActual.ubicacion || 'No especificado'
  //     },
  //     workHistory: [], // Esto se cargaría de otra tabla/endpoint
  //     education: {
  //       degrees: [], // Esto se cargaría de otra tabla/endpoint
  //       certifications: [] // Esto se cargaría de otra tabla/endpoint
  //     },
  //     languages: [], // Esto se cargaría de otra tabla/endpoint
  //     projects: [] // Esto se cargaría de otra tabla/endpoint
  //   };
    
  //   console.log('Datos actualizados del empleado:', this.employeeData);
  // }

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
