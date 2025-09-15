import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { iGTHEmpleado } from 'src/app/interface/igth-empleado';
import { GthEmpleadoService } from 'src/app/services/gthempleado.service';
import { alerts } from 'src/app/helpers/alerts';
import { ElementRef, ViewChild } from '@angular/core';

// Usar forkJoin para manejar múltiples observables
import { forkJoin } from 'rxjs';
import { Idependiente } from 'src/app/interface/idependiente';

import { firstValueFrom } from 'rxjs';

declare var Swal: any;

// Agregar esta interfaz al inicio de tu componente
interface DependienteFormulario {
  nombre: string;
  fechaNacimiento: string;
  discapacidad: string;
  documentoBase64: string;
  relacion: string;
}

@Component({
  selector: 'app-empleado-cv',
  templateUrl: './empleado-cv.component.html',
  styleUrls: ['./empleado-cv.component.css']
})

export class EmpleadoCvComponent implements OnInit {
  
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  cargandoDependientes: boolean = false;

  activeSection: string = 'datos-personales';
  activeSubcategory: string = ''; // Sección activa por defecto
  activeSubcategoryAcad: string = ''; // Sección activa por defecto

  isEditing: boolean = false;
  sectionEditStates: { [key: string]: boolean } = {
    'datos-personales': false,
    'info-profesional': false
  };

  // Variable para almacenar la información del empleado
  empleado: iGTHEmpleado | null = null;
  cedulaEmpleado: string = ''; // Cambia esto por la cédula real del empleado
  

  // NgModel properties for employee personal info
  public nombreCompleto: string = '';
  public correoElectronico: string = '';
  public posicion: string = '';
  public area: string = '';
  public subarea: string = '';

  // NgModel properties for bibliography
  public fechaNacimiento: string = '';
  public paisNacimiento: string = '';
  public provinciaNacimiento: string = '';
  public ciudadNacimiento: string = '';

  // NgModel properties for personal details
  public nombres: string = '';
  public apellidos: string = '';
  public sexo: string = '';
  public estadoCivil: string = '';
  public tipoSangre: string = '';
  public etnia: string = '';
  public nivelEstudio: string = '';
  public cargasFamiliares: number = 0;

  // NgModel properties for contact
  public correoInstitucional: string = '';
  public correoPersonal: string = '';
  public numeroCelular: string = '';
  public direccion: string = '';

  // NgModel properties for emergency contact
  public nombreEmergencia: string = '';
  public relacionEmergencia: string = '';
  public telefonoEmergencia: string = '';

  // NgModel properties for new forms
  public nuevoDependienteNombre: string = '';
  public nuevoDependienteFechaNacimiento: string = '';
  public nuevoDependienteDiscapacidad: string = '';

  public nuevaEducacionNivel: string = '';
  public nuevaEducacionCarrera: string = '';
  public nuevaEducacionInstitucion: string = '';

  public nuevaCertificacionTitulo: string = '';
  public nuevaCertificacionInstitucion: string = '';
  public nuevaCertificacionFecha: string = '';

  public nuevoIdiomaIdioma: string = '';
  public nuevoIdiomaNivel: string = '';
  public nuevoIdiomaCertificacion: string = '';

  public nuevoProyectoTitulo: string = '';
  public nuevoProyectoEspecialidad: string = '';
  public nuevoProyectoAno: string = '';

  // Additional missing properties for spouse information
  public estadoConyugal: string = '';
  public nombreConyuge: string = '';
  public fechaMatrimonio: string = '';
  public discapacidadConyuge?: boolean;
  public documentosConyuge: string = '';
 

  // Array de dependientes para el formulario
  dependientesInsert = [
    {
      // idDependiente: '',
      depNombreMdl: '',
      depFechaNacimientoMdl: '',
      depDiscapacidadMdl: '',
      documentoBase64: '',
      depRelacionMdl: ''
    }
  ];  

  dependientes: Idependiente[] = [];

  // Dependientes para mosytrar en el Front
  employeeData: {
      family: {
        children: Idependiente[];
      };
    } = {
      family: {
        children: []
      }
    };


  // Additional missing properties for identity documents
  public numeroCedula: string = '';
  public documentoIdentidad: string = '';

  // Additional missing properties for professional information
  public cargoActual: string = '';
  public fechaInicio: string = '';
  public empresa: string = '';
  public areaLaboral: string = '';
  public subareaLaboral: string = '';
  public jefeDirecto: string = '';
  public tipoContrato: string = '';
  public ubicacion: string = '';

  // Additional missing properties for education
  public carreraTercerNivel: string = '';
  public institucionTercerNivel: string = '';
  public masterCuartoNivel: string = '';
  public institucionCuartoNivel: string = '';

  // Additional missing properties for certifications
  public tituloEspecialidad: string = '';
  public institucionEspecialidad: string = '';
  public fechaEspecialidad: string = '';
  public certificadoEspecialidad: string = '';

  // Additional missing properties for languages
  public idioma: string = '';
  public nivelIdioma: string = '';
  public certificacionIdioma: string = '';

  // Additional missing properties for projects
  public tituloProyecto: string = '';
  public especialidadProyecto: string = '';
  public anoProyecto: string = '';

  // Properties for job history
  public cargoHistorial: string = '';
  public empresaHistorial: string = '';
  public fechasHistorial: string = '';
  public funcionesHistorial: string = '';

  // Properties for new job history form
  public nuevoHistorialCargo: string = '';
  public nuevoHistorialEmpresa: string = '';
  public nuevoHistorialFechas: string = '';
  public nuevoHistorialFunciones: string = '';


/* -------------  Campos para mostrar en el HTML  ----------  */
// Variables para mostrar la información (solo lectura)

  fotoPerfilUrl: string = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'; // Imagen por defecto
  fotoPerfilUrlDisplay: string = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

  // Variables para manejar la subida de fotos
  archivoSeleccionado: File | null = null;
  subiendoFoto: boolean = false;
  idEmpleadoActual: number | null = null;

  nombreCompletoDisplay: string = ''; 
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

  estadoConyugalDisplay: string = '';
  nombreConyugeDisplay: string = '';
  fechaMatrimonioDisplay: string = '';

  discapacidadConyugeDisplay: string = '';
  
  nombreDepDisplay: string = '';
  fechaNacimientoDepDisplay: string = '';
  discapacidadDepDisplay: string = '';
  relacionDepDisplay: string = '';

  // Informacion Laboral
  cargoActualLabDisplay: string = '';
  fechaInicioLabDisplay: string = '';
  empresaLabDisplay: string = '';
  areaLaboralDisplay: string = '';
  subareaLaboralDisplay: string = '';

  jefeDirectoDisplay: string = '';
  tipoContratoDisplay: string = '';
  ubicacionDisplay: string = '';

  cargoHistorialDisplay: string = '';
  empresaHistorialDisplay: string = '';
  fechasHistorialDisplay: string = '';
  funcionesHistorialDisplay: string = '';


  // Informacion academica
  carreraTercerNivelDisplay: string = '';
  institucionTercerNivelDisplay: string = '';

  masterCuartoNivelDisplay: string = '';
  institucionCuartoNivelDisplay: string = '';

  tituloEspecialidadDisplay: string = '';
  institucionEspecialidadDisplay: string = '';
  fechaEspecialidadDisplay: string = '';
  certificadoEspecialidadDisplay: string = '';

  // Idioma
  idiomaDisplay: string = '';
  nivelIdiomaDisplay: string = '';
  certificacionIdiomaDisplay: string = '';

  // Proyecto
  tituloProyectoDisplay: string = '';
  especialidadProyectoDisplay: string = '';
  anoProyectoDisplay: string = '';



  //
  public generica: any = [];
  public cargaInicial: any = [];
 
  constructor(
    private  gthEmpleadoService:GthEmpleadoService,
  ) { }
 
  ngOnInit(): void {
    const valor = sessionStorage.getItem('token');
    if (typeof valor === 'string') {
      var IdEmpleado = JSON.parse(atob(valor.split('.')[1]));
      console.log('Empresa: ', IdEmpleado);
     /* this.strPerfil=IdEmpleado["Perfil"];
      this.IdEmpresa=IdEmpleado["IdEmpresa"];
      if(this.strPerfil!="ADMINISTRADOR"){
        this.Idtipo=1;
        this.OcultarEmpresa=false;
      }*/
    }

    this.cargarDatosEmpleado();


  }

  cargarDatosEmpleado(): void {
    // Obtener ID del empleado del sessionStorage
    const idEmpleado = this.gthEmpleadoService.obtenerIdGthEmpleadoDesdeSession();
    
    if (idEmpleado) {
      this.idEmpleadoActual = idEmpleado;
      this.buscarEmpleadoPorId(idEmpleado);
    } else {
      console.warn('No se encontró ID de empleado en sessionStorage, usando cédula de prueba');
      // Fallback: usar cédula hardcoded para testing
      this.buscarEmpleadoPorCedula('1809988776');
    }
  }

  /**
   * Busca un empleado específico por ID
   * @param idEmpleado - ID del empleado a buscar
   */
  buscarEmpleadoPorId(idEmpleado: number): void {
    console.log('Componente: ID enviado al servicio ->', idEmpleado);

    this.gthEmpleadoService.MostrarConParametros(1, idEmpleado).subscribe({
      next: (empleado: any) => {
        console.log('Respuesta del backend ->', empleado);

        const datosEmpleado = empleado?.$values?.[0];

        if (datosEmpleado) {
          this.empleado = datosEmpleado;
          this.mapearDatosParaMostrar();
        } else {
          console.warn('No se encontró empleado con el ID:', idEmpleado);
        }
      },
      error: (error) => {
        console.error('Error al buscar empleado por ID:', error);
      }
    });
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
  private async mapearDatosParaMostrar(): Promise<void>  {
    if (this.empleado) {
      // Guardar ID del empleado para usar en subida de fotos
      this.idEmpleadoActual = this.empleado.idEmpleado;

      // Información básica
      // Cargar foto desde el backend usando el servicio
      this.cargarFotoPerfilEmpleado();

      this.nombreCompletoDisplay = `${this.empleado.nombre} ${this.empleado.apellido}`;
      this.nombres = `${this.empleado.nombre}`; 
      this.apellidos = `${this.empleado.apellido}`;
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

      await this.cargarDependientes();   //lugar para cargar dependientes

      this.showSubcategory('info-organizacional');
      this.showSubcategoryAcad('estudios');

      this.carreraTercerNivelDisplay = this.carreraTercerNivel;
      this.institucionTercerNivelDisplay = this.institucionTercerNivel;

      this.masterCuartoNivelDisplay = this.masterCuartoNivel;
      this.institucionCuartoNivelDisplay = this.institucionCuartoNivel;


    }
  }  


  /*#=========================================================================
                        Cargar datos de dependientes desde la base 
  ============================================================================*/
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
  private mapearDiscapacidad(discapacidad?: boolean | null): string {
    if (discapacidad === true) return 'Sí';
    if (discapacidad === false) return 'No';
    return 'No registrado';
  }






  /**
   * Actualiza los datos del empleado (útil para refrescar información)
   */
  actualizarDatos(): void {
    this.cargarDatosEmpleado();
  }

  /**
   * Establece la cédula del empleado y carga sus datos
   * @param cedula - Cédula del empleado
   */
  establecerEmpleado(cedula: string): void {
    this.cedulaEmpleado = cedula;
    this.buscarEmpleadoPorCedula(cedula);
  }


  guardarEmpleado(){
 
    console.log("Ingreso");
 
    const data: iGTHEmpleado = {
      tipo: 1,
      idEmpleado: 0,
      idPerfil: 0,
      idCelula: 3,
      cedula: this.numeroCedula,
      nombre: this.nombres,
      apellido: this.apellidos,
      fechaNacimiento: this.fechaNacimiento,
      direccion: this.direccion,
      telefono: this.numeroCelular,
      correo: this.correoPersonal,
      correoCorporativo: this.correoInstitucional,
      fechaContratacion: this.fechaInicio || "",
      estadoCivil: this.estadoCivil,
      sexo: this.sexo,
      fotoPerfilUrl: "",
      estadoEmpleado: "ACTIVO",
      empTipo: 0,
      actPassword: false,
      password: "",
      sueldo: 0,
      
      // Información Personal
      tipoSangre: this.tipoSangre,
      etnia: this.etnia,
      paisNacimiento: this.paisNacimiento,
      provinciaNacimiento: this.provinciaNacimiento,
      ciudadNacimiento: this.ciudadNacimiento,
      nivelEstudio: this.nivelEstudio,
      cargasFamiliares: this.cargasFamiliares,
      documentoIdentidad: this.documentoIdentidad,
      
      // Contacto de Emergencia
      nombreEmergencia: this.nombreEmergencia,
      relacionEmergencia: this.relacionEmergencia,
      telefonoEmergencia: this.telefonoEmergencia,
      
      // Información Conyugal
      nombreConyuge: this.nombreConyuge,
      fechaMatrimonio: this.fechaMatrimonio,
      discapacidadConyuge: this.discapacidadConyuge,
      documentosConyuge: this.documentosConyuge,

      //Cargar Dependientes
      
      // Información Laboral
      cargoActual: this.cargoActual,
      area: this.areaLaboral || this.area,
      subarea: this.subareaLaboral || this.subarea,
      empresa: this.empresa,
      jefeDirecto: this.jefeDirecto,
      tipoContrato: this.tipoContrato,
      ubicacion: this.ubicacion
    }
 
     console.log("data: ",data);
 
         this.gthEmpleadoService.gestionarEmpleado(data).subscribe(
           (resp: any) => {
            console.log("resp",resp['$values']);
             this.cargaInicial = resp['$values'];
             console.log("this.cargaInicial",this.cargaInicial);
             this.generica = this.cargaInicial[0];
             console.log("this.generica",this.generica);
             let valor1;
             let valor2;
             valor1 = this.generica.valor1;
             valor2 = this.generica.valor2;
   
           },
           (err) => {
             console.log('err', err);
           }
         );
  }
 


  // Form visibility states
  // showAddDependentForm: boolean = false;
  showAddEducationForm: boolean = false;
  showAddCertificationForm: boolean = false;
  showAddLanguageForm: boolean = false;
  showAddProjectForm: boolean = false;
  showAddJobHistoryForm: boolean = false;

  // New item models
  newDependent = { name: '', birthdate: '', disability: '' };
  newEducation = { career: '', institution: '' };
  newCertification = { title: '', institution: '', date: '' };
  newLanguage = { language: '', level: '', certification: '' };
  newProject = { title: '', specialty: '', year: '' };

  showSection(targetId: string): void {
    this.activeSection = targetId;
  }

  showSubcategory(targetId: string): void {
    this.activeSubcategory = targetId;
  }
  showSubcategoryAcad(targetId: string): void {
    this.activeSubcategoryAcad = targetId;
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  toggleSectionEdit(sectionId: string): void {
    this.sectionEditStates[sectionId] = !this.sectionEditStates[sectionId];
  }

  previewImage(event: any): void {
    const image = document.getElementById('employeeImage') as HTMLImageElement;
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e: any) {
      image.src = e.target.result;
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  // Form toggle methods
  // Método centralizado para cerrar todos los formularios emergentes
  private closeAllForms(): void {
    // this.showAddDependentForm = false;
    this.showAddEducationForm = false;
    this.showAddCertificationForm = false;
    this.showAddLanguageForm = false;
    this.showAddProjectForm = false;
    this.showAddJobHistoryForm = false;
    
    // Limpiar todos los campos cuando se cierran los formularios
    this.clearAllFormFields();
  }

  // Método para limpiar todos los campos de los formularios
  private clearAllFormFields(): void {
    // Limpiar campos del formulario de dependientes
    // this.nuevoDependienteNombre = '';
    // this.nuevoDependienteFechaNacimiento = '';
    // this.nuevoDependienteDiscapacidad = '';
    
    // Limpiar campos del formulario de educación
    this.nuevaEducacionNivel = '';
    this.nuevaEducacionCarrera = '';
    this.nuevaEducacionInstitucion = '';
    
    // Limpiar campos del formulario de certificaciones
    this.nuevaCertificacionTitulo = '';
    this.nuevaCertificacionInstitucion = '';
    this.nuevaCertificacionFecha = '';
    
    // Limpiar campos del formulario de idiomas
    this.nuevoIdiomaIdioma = '';
    this.nuevoIdiomaNivel = '';
    this.nuevoIdiomaCertificacion = '';
    
    // Limpiar campos del formulario de proyectos
    this.nuevoProyectoTitulo = '';
    this.nuevoProyectoEspecialidad = '';
    this.nuevoProyectoAno = '';
    
    // Limpiar campos del formulario de historial laboral
    this.nuevoHistorialCargo = '';
    this.nuevoHistorialEmpresa = '';
    this.nuevoHistorialFechas = '';
    this.nuevoHistorialFunciones = '';
  }

  // toggleAddDependentForm(): void {
  //   // Si el formulario está cerrado, cerrar todos los demás primero
  //   if (!this.showAddDependentForm) {
  //     this.closeAllForms();
  //     this.showAddDependentForm = true;
  //   } else {
  //     // Si ya está abierto, solo cerrarlo
  //     this.showAddDependentForm = false;
  //     this.nuevoDependienteNombre = '';
  //     this.nuevoDependienteFechaNacimiento = '';
  //     this.nuevoDependienteDiscapacidad = '';
  //   }
  // }

  toggleAddEducationForm(): void {
    // Si el formulario está cerrado, cerrar todos los demás primero
    if (!this.showAddEducationForm) {
      this.closeAllForms();
      this.showAddEducationForm = true;
    } else {
      // Si ya está abierto, solo cerrarlo
      this.showAddEducationForm = false;
      this.nuevaEducacionNivel = '';
      this.nuevaEducacionCarrera = '';
      this.nuevaEducacionInstitucion = '';
    }
  }

  toggleAddCertificationForm(): void {
    // Si el formulario está cerrado, cerrar todos los demás primero
    if (!this.showAddCertificationForm) {
      this.closeAllForms();
      this.showAddCertificationForm = true;
    } else {
      // Si ya está abierto, solo cerrarlo
      this.showAddCertificationForm = false;
      this.nuevaCertificacionTitulo = '';
      this.nuevaCertificacionInstitucion = '';
      this.nuevaCertificacionFecha = '';
    }
  }

  toggleAddLanguageForm(): void {
    // Si el formulario está cerrado, cerrar todos los demás primero
    if (!this.showAddLanguageForm) {
      this.closeAllForms();
      this.showAddLanguageForm = true;
    } else {
      // Si ya está abierto, solo cerrarlo
      this.showAddLanguageForm = false;
      this.nuevoIdiomaIdioma = '';
      this.nuevoIdiomaNivel = '';
      this.nuevoIdiomaCertificacion = '';
    }
  }

  toggleAddProjectForm(): void {
    // Si el formulario está cerrado, cerrar todos los demás primero
    if (!this.showAddProjectForm) {
      this.closeAllForms();
      this.showAddProjectForm = true;
    } else {
      // Si ya está abierto, solo cerrarlo
      this.showAddProjectForm = false;
      this.nuevoProyectoTitulo = '';
      this.nuevoProyectoEspecialidad = '';
      this.nuevoProyectoAno = '';
    }
  }

  toggleAddJobHistoryForm(): void {
    // Si el formulario está cerrado, cerrar todos los demás primero
    if (!this.showAddJobHistoryForm) {
      this.closeAllForms();
      this.showAddJobHistoryForm = true;
    } else {
      // Si ya está abierto, solo cerrarlo
      this.showAddJobHistoryForm = false;
      this.nuevoHistorialCargo = '';
      this.nuevoHistorialEmpresa = '';
      this.nuevoHistorialFechas = '';
      this.nuevoHistorialFunciones = '';
    }
  }

  // Add methods
  // addDependent(): void {
  //   if (!this.newDependent.name || !this.newDependent.birthdate || !this.newDependent.disability) {
  //     Swal.fire({
  //       title: 'Campos incompletos',
  //       text: 'Por favor completa todos los campos del dependiente antes de guardar.',
  //       icon: 'warning',
  //       confirmButtonText: 'Ok'
  //     });
  //     return;
  //   }

  //   Swal.fire({
  //     title: 'Dependiente añadido',
  //     html: `<strong>${this.newDependent.name}</strong><br>Fecha de Nacimiento: ${this.newDependent.birthdate}<br>Discapacidad: ${this.newDependent.disability}`,
  //     icon: 'success',
  //     confirmButtonText: 'Aceptar'
  //   });

  //   this.newDependent = { name: '', birthdate: '', disability: '' };
  //   this.toggleAddDependentForm();
  // }

  addEducation(): void {
    if (!this.newEducation.career || !this.newEducation.institution) {
      Swal.fire({
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos del estudio antes de guardar.',
        icon: 'warning',
        confirmButtonText: 'Ok'
      });
      return;
    }

    Swal.fire({
      title: 'Estudio añadido',
      html: `<strong>${this.newEducation.career}</strong><br>Institución: ${this.newEducation.institution}`,
      icon: 'success',
      confirmButtonText: 'Aceptar'
    });

    this.newEducation = { career: '', institution: '' };
    this.toggleAddEducationForm();
  }

  addCertification(): void {
    if (!this.newCertification.title || !this.newCertification.institution || !this.newCertification.date) {
      Swal.fire({
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos de la certificación antes de guardar.',
        icon: 'warning',
        confirmButtonText: 'Ok'
      });
      return;
    }

    Swal.fire({
      title: 'Certificación añadida',
      html: `<strong>${this.newCertification.title}</strong><br>Institución: ${this.newCertification.institution}<br>Fecha: ${this.newCertification.date}`,
      icon: 'success',
      confirmButtonText: 'Aceptar'
    });

    this.newCertification = { title: '', institution: '', date: '' };
    this.toggleAddCertificationForm();
  }

  addLanguage(): void {
    if (!this.newLanguage.language || !this.newLanguage.level || !this.newLanguage.certification) {
      Swal.fire({
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos del idioma antes de guardar.',
        icon: 'warning',
        confirmButtonText: 'Ok'
      });
      return;
    }

    Swal.fire({
      title: 'Idioma añadido',
      html: `<strong>${this.newLanguage.language}</strong><br>Nivel: ${this.newLanguage.level}<br>Certificación: ${this.newLanguage.certification}`,
      icon: 'success',
      confirmButtonText: 'Aceptar'
    });

    this.newLanguage = { language: '', level: '', certification: '' };
    this.toggleAddLanguageForm();
  }

  addProject(): void {
    if (!this.newProject.title || !this.newProject.specialty || !this.newProject.year) {
      Swal.fire({
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos del proyecto antes de guardar.',
        icon: 'warning',
        confirmButtonText: 'Ok'
      });
      return;
    }

    Swal.fire({
      title: 'Proyecto añadido',
      html: `<strong>${this.newProject.title}</strong><br>Especialidad: ${this.newProject.specialty}<br>Año: ${this.newProject.year}`,
      icon: 'success',
      confirmButtonText: 'Aceptar'
    });

    this.newProject = { title: '', specialty: '', year: '' };
    this.toggleAddProjectForm();
  }

  addJobHistory(): void {
    if (!this.nuevoHistorialCargo || !this.nuevoHistorialEmpresa || !this.nuevoHistorialFechas || !this.nuevoHistorialFunciones) {
      Swal.fire({
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos de la experiencia laboral antes de guardar.',
        icon: 'warning',
        confirmButtonText: 'Ok'
      });
      return;
    }

    Swal.fire({
      title: 'Experiencia laboral añadida',
      html: `<strong>${this.nuevoHistorialCargo}</strong><br>Empresa: ${this.nuevoHistorialEmpresa}<br>Fechas: ${this.nuevoHistorialFechas}<br>Funciones: ${this.nuevoHistorialFunciones}`,
      icon: 'success',
      confirmButtonText: 'Aceptar'
    });

    // Limpiar campos después de guardar
    this.nuevoHistorialCargo = '';
    this.nuevoHistorialEmpresa = '';
    this.nuevoHistorialFechas = '';
    this.nuevoHistorialFunciones = '';
    this.toggleAddJobHistoryForm();
  }

  printCV(): void {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = "exportar_cv.html";
    document.body.appendChild(iframe);

    iframe.onload = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();

      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 3000);
    };
  }

  /* ========================================================================
          Estados de Modales (centralizado)
  ======================================================================== */

  modalStates = {
    principal: false,
    secundarios: false,
    emergencia: false,
    familiar: false,
    empleo: false,
    laboral: false
  };


  /* ========================================================================
    Funciones para abrir y cerrar modales de forma general
  ======================================================================== */

  openModal(modal: 'principal' | 'secundarios' | 'emergencia' | 'familiar' | 'empleo' | 'laboral') {
    
    if (modal === 'principal') this.cargarDatosPersonales();
    this.modalStates[modal] = true;
    
    if (modal === 'secundarios') this.cargarDatosPersonalesSecundarios();
    this.modalStates[modal] = true;

    if (modal === 'emergencia') this.cargarDatosEmergencia();
    this.modalStates[modal] = true;

    if (modal === 'familiar') this.cargarDatosFamiliar();
    this.modalStates[modal] = true;

    if (modal === 'empleo') this.cargarInfoEmpleoDisplay();
    this.modalStates[modal] = true;

    if (modal === 'laboral') this.cargarDatosFamiliar();
    this.modalStates[modal] = true;
  }

  closeModal(modal: 'principal' | 'secundarios' | 'emergencia' | 'familiar' | 'empleo' | 'laboral') {
    this.modalStates[modal] = false;
  }

  closeModalOnOverlay(event: Event, modal: 'principal' | 'secundarios' | 'emergencia' | 'familiar' | 'empleo' | 'laboral') {
    if (event.target === event.currentTarget) {
      this.closeModal(modal);
    }
  }

  

  /* ========================================================================
    Datos Personales 
  ======================================================================== */

  seleccionarFoto(): void {
    this.fileInput.nativeElement.click(); // Abre el selector de archivos
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Validar tipo de archivo
      const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!tiposPermitidos.includes(file.type)) {
        Swal.fire({
          title: 'Error',
          text: 'Solo se permiten archivos de imagen (JPG, PNG, GIF)',
          icon: 'error'
        });
        return;
      }

      // Validar tamaño (5MB máximo)
      const maxSize = 5 * 1024 * 1024; // 5MB en bytes
      if (file.size > maxSize) {
        Swal.fire({
          title: 'Error', 
          text: 'El archivo es demasiado grande. Tamaño máximo: 5MB',
          icon: 'error'
        });
        return;
      }

      this.archivoSeleccionado = file;

      // Mostrar preview de la imagen
      const reader = new FileReader();
      reader.onload = () => {
        this.fotoPerfilUrlDisplay = reader.result as string;
      };
      reader.readAsDataURL(file);

      // Ya no subir automáticamente, esperar a que se presione "Guardar"
      console.log('Archivo seleccionado para subir:', file.name);
    }
  }

  /**
   * Sube la foto de perfil al backend
   */
  subirFotoPerfil(): void {
    if (!this.archivoSeleccionado || !this.idEmpleadoActual) {
      Swal.fire({
        title: 'Error',
        text: 'No se ha seleccionado ningún archivo o no se pudo identificar el empleado',
        icon: 'error'
      });
      return;
    }

    this.subiendoFoto = true;

    this.gthEmpleadoService.subirFotoPerfil(this.idEmpleadoActual, this.archivoSeleccionado).subscribe({
      next: (response: any) => {
        console.log('Foto subida exitosamente:', response);
        
        // Actualizar la URL de la foto con la nueva imagen y cache-busting
        if (response.fotoPerfilUrl) {
          const urlBase = this.gthEmpleadoService.construirUrlImagen(response.fotoPerfilUrl);
          const cacheBusting = `?t=${Date.now()}`;
          this.fotoPerfilUrl = urlBase + cacheBusting;
          this.fotoPerfilUrlDisplay = this.fotoPerfilUrl;
          
          console.log('Foto actualizada con cache-busting:', this.fotoPerfilUrl);
        }

        Swal.fire({
          title: '¡Éxito!',
          text: 'Foto de perfil actualizada correctamente',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });

        this.subiendoFoto = false;
        this.archivoSeleccionado = null;
      },
      error: (error) => {
        console.error('Error al subir foto:', error);
        
        // Restaurar imagen anterior en caso de error
        this.cargarFotoPerfilEmpleado();
        
        let mensajeError = 'Error al subir la foto de perfil';
        if (error.error && error.error.mensaje) {
          mensajeError = error.error.mensaje;
        }

        Swal.fire({
          title: 'Error',
          text: mensajeError,
          icon: 'error'
        });

        this.subiendoFoto = false;
        this.archivoSeleccionado = null;
      }
    });
  }

  /**
   * Carga la foto de perfil del empleado desde el backend
   */
  cargarFotoPerfilEmpleado(): void {
    if (this.idEmpleadoActual) {
      this.gthEmpleadoService.obtenerFotoPerfil(this.idEmpleadoActual).subscribe({
        next: (response: any) => {
          if (response && response.fotoPerfilUrl) {
            this.fotoPerfilUrl = this.gthEmpleadoService.construirUrlImagen(response.fotoPerfilUrl);
            this.fotoPerfilUrlDisplay = this.fotoPerfilUrl;
          } else {
            this.establecerImagenPorDefecto();
          }
        },
        error: (error) => {
          console.error('Error al cargar foto de perfil:', error);
          this.establecerImagenPorDefecto();
        }
      });
    } else {
      this.establecerImagenPorDefecto();
    }
  }

  /**
   * Establece la imagen por defecto
   */
  private establecerImagenPorDefecto(): void {
    this.fotoPerfilUrl = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
    this.fotoPerfilUrlDisplay = this.fotoPerfilUrl;
  }

  // Cargar datos al abrir modal Datos personales
  cargarDatosPersonales(): void {
    
    this.nombres = this.nombres; 
    this.apellidos = this.apellidos;
    this.correoElectronico = this.correoElectronicoDisplay; 
    this.posicion = this.posicionDisplay; 
    this.area = this.areaDisplay; 
    this.subarea = this.subareaDisplay;
  }
  // Guardar cambios de datos personales 
  guardarDatosPersonales(): void {
    if (!this.nombres || !this.correoElectronico ) {
      alert('Por favor, completa todos los campos obligatorios');
      return;
    }
     
    
    this.nombreCompletoDisplay = this.nombres + ' ' + this.apellidos;  
    this.correoElectronicoDisplay = this.correoElectronico;
    this.posicionDisplay = this.posicion;
    this.areaDisplay = this.area;
    this.subareaDisplay = this.subarea; 

    // Si hay una nueva foto seleccionada, subirla antes de cerrar el modal
    if (this.archivoSeleccionado && this.idEmpleadoActual) {
      this.subiendoFoto = true;
      this.gthEmpleadoService.subirFotoPerfil(this.idEmpleadoActual, this.archivoSeleccionado).subscribe({
        next: (response: any) => {
          console.log('Foto subida exitosamente desde modal:', response);
          
          // Actualizar la URL de la foto local con cache-busting
          if (response.fotoPerfilUrl) {
            const urlBase = this.gthEmpleadoService.construirUrlImagen(response.fotoPerfilUrl);
            const cacheBusting = `?t=${Date.now()}`;
            this.fotoPerfilUrl = urlBase + cacheBusting;
            this.fotoPerfilUrlDisplay = this.fotoPerfilUrl;
            
            console.log('Nueva URL de imagen con cache-busting:', this.fotoPerfilUrl);
          }

          this.subiendoFoto = false;
          this.archivoSeleccionado = null;
          
          // Cerrar modal y mostrar éxito
          this.closeModal('principal');
          
          Swal.fire({
            icon: 'success',
            title: 'Datos y foto actualizados correctamente',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });
        },
        error: (error) => {
          console.error('Error al subir foto desde modal:', error);
          this.subiendoFoto = false;
          
          // Aún cerrar el modal pero mostrar que los datos se guardaron
          this.closeModal('principal');
          
          Swal.fire({
            icon: 'warning',
            title: 'Datos actualizados, pero hubo un problema con la foto',
            text: 'Intenta subir la foto nuevamente',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 4000
          });
        }
      });
    } else {
      // No hay foto nueva, solo cerrar modal
      this.closeModal('principal');

      Swal.fire({
        icon: 'success',
        title: 'Datos personales actualizados',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    }
  }

  
  /* ========================================================================
    Datos Personales Secundarios
  ======================================================================== */

  // Cargar datos al abrir modal secundarios
  cargarDatosPersonalesSecundarios(): void {
    this.fechaNacimiento = this.fechaNacimientoDisplay;
    this.sexo = this.sexoDisplay;
    this.tipoSangre = this.tipoSangreDisplay;
    this.etnia = this.etniaDisplay;
    this.numeroCedula = this.numeroCedulaDisplay;
    this.paisNacimiento = this.paisNacimientoDisplay;
    this.provinciaNacimiento = this.provinciaNacimientoDisplay;
    this.ciudadNacimiento = this.ciudadNacimientoDisplay;

    this.documentoIdentidad = this.documentoIdentidadDisplay;
    this.correoInstitucional = this.correoInstitucionalDisplay;
    this.correoPersonal = this.correoElectronicoDisplay;
    this.numeroCelular = this.numeroCelularDisplay;
    this.direccion = this.direccionDisplay;
    this.nivelEstudio = this.nivelEstudioDisplay;
    this.cargasFamiliares = this.cargasFamiliaresDisplay ? Number(this.cargasFamiliaresDisplay) : 0;
    this.nombreEmergencia = this.nombreEmergenciaDisplay;
    this.relacionEmergencia = this.relacionEmergenciaDisplay;
    this.telefonoEmergencia = this.telefonoEmergenciaDisplay;
    
  }

  // Guardar cambios de datos personales secundarios
  guardarDatosPersonalesSecundarios(): void {
    if (!this.fechaNacimiento || !this.sexo || !this.tipoSangre || !this.etnia || 
        !this.numeroCedula || !this.paisNacimiento || !this.provinciaNacimiento || 
        !this.ciudadNacimiento) {
      alert('Por favor, completa todos los campos obligatorios');
      return;
    }

    this.nombreCompletoDisplay = this.nombres + ' ' + this.apellidos;  
    this.correoElectronicoDisplay = this.correoElectronico;
    this.posicionDisplay = this.posicion;
    this.areaDisplay = this.area;
    this.subareaDisplay = this.subarea;

    this.fechaNacimientoDisplay = this.fechaNacimiento;
    this.sexoDisplay = this.sexo;
    this.tipoSangreDisplay = this.tipoSangre;
    this.etniaDisplay = this.etnia;
    this.numeroCedulaDisplay = this.numeroCedula;
    this.paisNacimientoDisplay = this.paisNacimiento;
    this.provinciaNacimientoDisplay = this.provinciaNacimiento;
    this.ciudadNacimientoDisplay = this.ciudadNacimiento;

    this.closeModal('secundarios');

    Swal.fire({
      icon: 'success',
      title: 'Datos personales secundarios actualizados',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
  }

  // Manejo de archivo
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.documentoIdentidad = file;
    }
  }

  // Formatear fecha para mostrar
  formatearFecha(fecha: string): string {
    if (!fecha) return '';
    
    // Añade hora media para evitar desfases por zona horaria
    const date = new Date(fecha + 'T12:00:00');
    
    return date.toLocaleDateString('es-EC', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }


  /* ========================================================================
    Contacto de Emergencia
  ======================================================================== */

  // Cargar datos al abrir modal Emergencia
  cargarDatosEmergencia(): void {
    this.nombreEmergencia = this.nombreEmergenciaDisplay;
    this.relacionEmergencia = this.relacionEmergenciaDisplay;
    this.telefonoEmergencia = this.telefonoEmergenciaDisplay;
  }

  guardarContactoEmergencia() {
    
    this.nombreEmergenciaDisplay = this.nombreEmergencia;  
    this.relacionEmergenciaDisplay = this.relacionEmergencia;
    this.telefonoEmergenciaDisplay = this.telefonoEmergencia;

    this.closeModal('emergencia');

    Swal.fire({
      icon: 'success',
      title: 'Contacto de emergencia actualizado',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
  }



  /* ========================================================================
                        Información Familiar
  ======================================================================== */

  // Cargar datos al abrir MODAL de familiares y Dependeientes 
  cargarDatosFamiliar(): void {
    this.estadoConyugal = this.estadoConyugalDisplay;
    this.nombreConyuge = this.nombreConyugeDisplay;
    this.fechaMatrimonio = this.fechaMatrimonioDisplay;
    this.discapacidadConyuge = (this.discapacidadConyugeDisplay === 'true' || 
                               this.discapacidadConyugeDisplay === '1' || 
                               this.discapacidadConyugeDisplay?.toLowerCase() === 'si');
    
    // Cargar dependientes existentes
    // this.cargarDependientesExistentes();
    this.cargarDependientesDesdeDisplay();
  }

  // Cargar dependientes desde los datos ya existentes en el componente
  cargarDependientesDesdeDisplay(): void {
    if (this.employeeData?.family?.children && this.employeeData.family.children.length > 0) {
      this.dependientesInsert = this.employeeData.family.children.map((dep: Idependiente) => ({
        IdDependiente: dep.IdDependiente || null,
        depNombreMdl: dep.depNombre || '',
        depFechaNacimientoMdl: dep.depFechaNacimiento ? this.formatearFechaParaInput(dep.depFechaNacimiento) : '',
        depDiscapacidadMdl: this.normalizarDiscapacidad(dep.depDiscapacidad),
        depRelacionMdl: dep.depRelacion || '',
        documentoBase64: dep.depDocumentoUrl || ''
      }));
    } else {
      this.inicializarDependientesVacios();
    }
  }

  // Método auxiliar para normalizar el valor de discapacidad
  private normalizarDiscapacidad(discapacidad: any): string {
    if (discapacidad === null || discapacidad === undefined || discapacidad === '') {
      return '';
    }
    
    // Si viene como number (bit de la BD: 0 o 1)
    if (typeof discapacidad === 'number') {
      return discapacidad === 1 ? 'si' : 'no';
    }
    
    // Si viene como string
    if (typeof discapacidad === 'string') {
      const valor = discapacidad.toLowerCase();
      if (valor === 'true' || valor === '1' || valor === 'si' || valor === 'sí') {
        return 'si';
      } else if (valor === 'false' || valor === '0' || valor === 'no') {
        return 'no';
      }
      return valor;
    }
    
    // Si viene como boolean
    if (typeof discapacidad === 'boolean') {
      return discapacidad ? 'si' : 'no';
    }
    
    return '';
  }

// Método auxiliar para inicializar dependientes vacíos
private inicializarDependientesVacios(): void {
  this.dependientesInsert = [{
    // IdDependiente: null,
    depNombreMdl: '',
    depFechaNacimientoMdl: '',
    depDiscapacidadMdl: '',
    depRelacionMdl: '',
    documentoBase64: '',
    // archivoOriginal: null
  }];
}

// Función auxiliar para formatear fecha para input date
  private formatearFechaParaInput(fecha: string | null | undefined): string {
    if (!fecha) return '';

    try {
      // Caso: la fecha ya está en formato YYYY-MM-DD → la dejamos igual
      if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        return fecha;
      }

      // Caso: la fecha viene en formato DD/MM/YYYY → convertir a YYYY-MM-DD
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(fecha)) {
        const [dia, mes, anio] = fecha.split('/');
        return `${anio}-${mes}-${dia}`;
      }

      // Intentar parsear cualquier otro formato con Date()
      const fechaObj = new Date(fecha);
      if (!isNaN(fechaObj.getTime())) {
        return fechaObj.toISOString().split('T')[0];
      }

      return '';
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return '';
    }
  }


  // Guardar información familiar incluyendo dependientes
  async guardarInformacionFamiliar() {
    // Guardar información del cónyuge
    this.estadoConyugalDisplay = this.estadoConyugal;  
    this.nombreConyugeDisplay = this.nombreConyuge;
    this.fechaMatrimonioDisplay = this.fechaMatrimonio;
    this.discapacidadConyugeDisplay = this.discapacidadConyuge ? 'Sí' : 'No';
    
    // Guardar dependientes
    this.guardarDependientes();

    // Luego eliminar los dependientes que fueron eliminados en la UI
    this.eliminarDependientesGuardados();

    await this.cargarDependientes();   //lugar para cargar dependientes
  }

  //Método específico para guardar dependientes
  guardarDependientes(): void {
    // Filtrar dependientes que tengan al menos el nombre completo
    const dependientesValidos = this.dependientesInsert.filter(dep => {
      const ok = !!dep.depNombreMdl && dep.depNombreMdl.trim() !== '';
      if (!ok) {
        console.warn('⚠️ Dependiente descartado por nombre vacío:', dep);
      }
      return ok;
    });
    
    console.log(`✅ ${dependientesValidos.length} dependiente(s) válidos para guardar`);
    console.table(
      dependientesValidos.map((d, i) => ({
        i,
        nombre: d.depNombreMdl,
        fechaMdl: d.depFechaNacimientoMdl,
        discapacidadMdl: d.depDiscapacidadMdl,
        relacionMdl: d.depRelacionMdl,
        docCargado: !!d.documentoBase64
      }))
    );
    
    if (dependientesValidos.length > 0) {
      // Función auxiliar para manejar la discapacidad
      const determinarDiscapacidad = (discapacidad: string | null): boolean | null => {
        if (!discapacidad || discapacidad.trim() === '') return null;

        const valor = discapacidad.toLowerCase();
        if (valor === 'sí' || valor === 'si' || valor === 'true' || valor === '1') {
          return true;
        }
        if (valor === 'no' || valor === 'false' || valor === '0') {
          return false;
        }
        return null;
      };

      // Preparar datos para enviar al backend
      const dependientesParaGuardar = dependientesValidos.map((dep, i) => {
        const discapacidadNormalizada = determinarDiscapacidad(dep.depDiscapacidadMdl);

        console.log(
          `🧩 Dependiente ${i}`,
          'Nombre:', dep.depNombreMdl,
          '| Fecha:', dep.depFechaNacimientoMdl,
          '| Discapacidad raw:', dep.depDiscapacidadMdl,
          '| Discapacidad normalizada:', discapacidadNormalizada,
          '| Tipo:', typeof discapacidadNormalizada
        );

        return {
          CedulaEmpleado: this.numeroCedulaDisplay ?? '',
          DepNombre: dep.depNombreMdl?.trim() ?? '',
          DepFechaNacimiento: dep.depFechaNacimientoMdl ?? '',
          DepDiscapacidad: discapacidadNormalizada,   // 👈 aquí ya va como boolean/null
          DepDocumentoUrl: dep.documentoBase64 ?? '',
          DepRelacion: dep.depRelacionMdl ?? ''
        };
      });

      // Llamar al servicio para guardar cada dependiente
      const promesasGuardado = dependientesParaGuardar.map(dependiente => 
        this.gthEmpleadoService.GuardarDependiente(dependiente).toPromise()
      );

      Promise.all(promesasGuardado)
        .then(responses => {
          // Actualizar la visualización de dependientes
          // this.dependientesDisplay = dependientesValidos;
          
          this.closeModal('familiar');

          this.mostrarMensajeExitoPersonalizado(
            'Información familiar actualizada correctamente',
            `Se guardaron ${dependientesValidos.length} dependiente(s)`
          );

        })
        .catch(error => {
          console.error('Error al guardar dependientes:', error);
          this.mostrarMensajeErrorPersonalizado(
            'Error al guardar',
            'Hubo un problema al guardar la información de los dependientes'
          );
        });
    } else {
      // Si no hay dependientes válidos, solo cerrar el modal
      this.closeModal('familiar');

      this.mostrarMensajeExitoPersonalizado(
        'Información familiar actualizada',
        'No se encontraron dependientes para guardar'
      );
    }
  }

  dependientesEliminados: { cedulaEmpleado: string; depNombre: string }[] = [];

  
  eliminarDependiente(index: number): void {
    if (this.dependientesInsert.length > 1) {
      const dependiente = this.dependientesInsert[index];

      // Guardar la información necesaria para eliminar después
      if (dependiente.depNombreMdl && this.numeroCedulaDisplay) {
        this.dependientesEliminados.push({
          cedulaEmpleado: this.numeroCedulaDisplay,
          depNombre: dependiente.depNombreMdl
        });
      }

      // Quitar de la lista visible
      this.dependientesInsert.splice(index, 1);
    }
  }

  eliminarDependientesGuardados(): void {
    this.dependientesEliminados.forEach(dep => {
      this.gthEmpleadoService.EliminarDependiente(this.numeroCedulaDisplay, dep.depNombre)
      
        .subscribe({
          next: () => console.log(`Dependiente ${dep.depNombre} eliminado correctamente`),
          error: err => console.error('Error al eliminar dependiente', err)
        });
    });
  
    // Limpiar array después de procesar
    this.dependientesEliminados = [];
  }

  // Método para manejar la selección de archivos
  onFileSelectedDep(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // this.dependientes[index].documentoBase64 = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Agregar dependiente (método existente mejorado)
  agregarDependiente() { 
    this.dependientesInsert.push({
      depNombreMdl: '',
      depFechaNacimientoMdl: '',
      depDiscapacidadMdl: '',
      documentoBase64: '',
      depRelacionMdl: ''
    });
  }

 
  /* ========================================================================
                        Información de Empleo
  ======================================================================== */

  // Cargar datos al abrir MODAL de familiares y Dependeientes 
  cargarInfoEmpleoDisplay(): void {

    this.showSubcategory('info-organizacional');
    this.showSubcategory('estudios');

    this.carreraTercerNivel = this.carreraTercerNivelDisplay;
    this.institucionTercerNivel = this.institucionTercerNivelDisplay;

    this.masterCuartoNivel = this.masterCuartoNivelDisplay;
    this.institucionCuartoNivel = this.institucionCuartoNivelDisplay;
    


    // this.cargarDependientesExistentes();
    // this.cargarDependientesDesdeDisplay();
  }

  
  // Guardar información familiar incluyendo dependientes
  async guardarInformacionEmpleo() {
    // Guardar información del cónyuge
    this.estadoConyugalDisplay = this.estadoConyugal;  
    this.nombreConyugeDisplay = this.nombreConyuge;
    this.fechaMatrimonioDisplay = this.fechaMatrimonio;
    this.discapacidadConyugeDisplay = this.discapacidadConyuge ? 'Sí' : 'No';
    
    // Guardar dependientes
    this.guardarDependientes();

    // Luego eliminar los dependientes que fueron eliminados en la UI
    this.eliminarDependientesGuardados();

    await this.cargarDependientes();   //lugar para cargar dependientes
  }
  

  

  //----------------------  Mensajes POPup  --------------------------
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

  mostrarMensajeErrorPersonalizado(titulo: string, mensaje: string ): void {
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        title: titulo,
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

  mostrarMensajeExitoPersonalizado(titulo: string, mensaje: string ): void {
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        title: titulo,
        text: mensaje,
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
    } else {
      alert(mensaje);
    }
  }

  alerta(mensaje: string): void {    
    Swal.fire({
      title: 'Advertencia...!!!',
      text: mensaje,
      icon: 'info',
      confirmButtonText: 'Aceptar'
    });
  }


}
