import { Component, OnInit, AfterViewInit } from '@angular/core';
import { GthEmpleadoService } from 'src/app/services/gthempleado.service';
import { iGTHEmpleado } from 'src/app/interface/igth-empleado';
import { ActivatedRoute } from '@angular/router';
import { Idependiente } from 'src/app/interface/idependiente';

import * as CryptoJS from 'crypto-js';
import { firstValueFrom } from 'rxjs';

declare var Swal: any;

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

  //--> dependientes
  dependientes: Idependiente[] = [];
  cargandoDependientes: boolean = false;

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

  employeeData: {
    family: {
      children: Idependiente[];
    };
  } = {
    family: {
      children: []
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

  // Control de carga
  public cargando: boolean = false;
  public empleadoActual: any = null;

  // Datos del empleado desde el backend
  public empleadoBackend: iGTHEmpleado | null = null;
  
  
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
    //this.cargarEmpleadoPorId(5);
    //this.cargarListasIniciales();

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
    console.log('Componente: cédula enviada al servicio ->', cedula); //-->borrar

    this.gthEmpleadoService.BuscarPorCedula(cedula).subscribe({
      next: (empleado: any) => {
        console.log('Respuesta del backend ->', empleado); //-->borrar

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
  private async mapearDatosParaMostrar(): Promise<void> { // ← Agregar 'async'
    if (this.empleado) {
      // Información básica
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
      this.cargasFamiliaresDisplay = (this.empleado.cargasFamiliares ?? 0).toString();
      this.nombreEmergenciaDisplay = this.empleado.nombreEmergencia;
      this.relacionEmergenciaDisplay = this.empleado.relacionEmergencia;
      this.telefonoEmergenciaDisplay = this.empleado.telefonoEmergencia;
      
      // Información de Dependientes
      this.estadoConyugalDisplay = this.empleado.estadoCivil;
      this.nombreConyugeDisplay = this.empleado.nombreConyuge;
      this.fechaMatrimonioDisplay = this.empleado.fechaMatrimonio;
      this.discapacidadConyugeDisplay = this.empleado.discapacidadConyuge === true ? 'Sí' : this.empleado.discapacidadConyuge === false 
      ? 'No' : 'No registrado';

      
      await this.cargarDependientes();   //lugar para cargar dependientes


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


  // -----------------------------------------------------------------

  

  private async cargarDependientes(): Promise<void> {
    // Verificar que empleado existe y tiene cédula
    if (!this.empleado?.cedula) {
      console.warn('No se puede cargar dependientes: empleado o cédula no disponible ->', this.empleado?.cedula); //-->borrar
      return;
    }

    try {
      this.cargandoDependientes = true;
      console.log('Cargando dependientes para empleado con cédula:', this.empleado.cedula); //-->borrar

      // Llamada al servicio usando firstValueFrom
      const response: any = await firstValueFrom(
        this.gthEmpleadoService.MostrarDependientesPorEmpleado(this.empleado.cedula)
      );

      console.log('Respuesta del servicio dependientes:', response); //-->borrar

      // Si la respuesta tiene $values, tomar esos datos
      if (response && response.$values && Array.isArray(response.$values)) {
        this.dependientes = response.$values;
      } else if (Array.isArray(response)) {
        this.dependientes = response;
      } else {
        this.dependientes = [];
      }

      // Mapear y enriquecer los datos para la UI
      this.employeeData = {
        family: {
          children: this.dependientes.map(dep => this.enriquecerDependiente(dep))
        }
      };

      console.log('Dependientes cargados y enriquecidos:', this.employeeData.family.children); //-->borrar

    } catch (error) {
      console.error('Error al cargar dependientes:', error);
      this.dependientes = [];
      this.employeeData = { family: { children: [] } };
    } finally {
      this.cargandoDependientes = false;
      console.log('Finalizó la carga de dependientes');
    }
  }

   /**
   * Enriquece el dependiente con campos adicionales para display
   */
private enriquecerDependiente(dependiente: Idependiente): Idependiente {
  // Convertir disability según el tipo de dato que viene desde la BD
  let discapacidadBool: boolean | null = null;
  
  // Si viene como number (bit de la BD: 0 o 1)
  if (typeof dependiente.depDiscapacidad === 'number') {
    discapacidadBool = dependiente.depDiscapacidad === 1;
  }
  // Si viene como string
  else if (typeof dependiente.depDiscapacidad === 'string') {
    if (dependiente.depDiscapacidad === 'true' || dependiente.depDiscapacidad === '1') {
      discapacidadBool = true;
    } else if (dependiente.depDiscapacidad === 'false' || dependiente.depDiscapacidad === '0') {
      discapacidadBool = false;
    }
  }
  // Si ya viene como boolean
  else if (typeof dependiente.depDiscapacidad === 'boolean') {
    discapacidadBool = dependiente.depDiscapacidad;
  }

  return {
    ...dependiente,
    depNombre: dependiente.depNombre || 'No registrado',
    depFechaNacimiento: dependiente.depFechaNacimiento ? 
    this.formatearFecha(dependiente.depFechaNacimiento) : 'No registrado',
    depDiscapacidad: this.mapearDiscapacidad(discapacidadBool),
    depRelacion: dependiente.depRelacion || 'No especificado',
    depDocumentoUrl: dependiente.depDocumentoUrl || ''
  };
}




  private tieneDocumentoValido(documentoUrl?: string): boolean {
    return !!(documentoUrl && documentoUrl.trim() !== '');
  }

  private formatearFecha(fecha: string): string {
    if (!fecha) return 'No registrado';
    try {
      if (fecha.includes('T')) {
        return fecha.split('T')[0];
      }
      return fecha;
    } catch {
      return fecha;
    }
  }

private mapearDiscapacidad(discapacidad?: boolean | null): string {
  if (discapacidad === true) return 'Sí';
  if (discapacidad === false) return 'No';
  return 'No registrado';
}



// ------------------------------------------------------------




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

  alerta(mensaje: string): void {
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        title: 'Advertencia...!!!',
        text: mensaje,
        icon: 'info',
        confirmButtonText: 'Aceptar'
      });
    } else {
      alert(mensaje);
    }
  }
}
