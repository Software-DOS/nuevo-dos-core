import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { iGTHEmpleado } from 'src/app/interface/igth-empleado';
import { GthEmpleadoService } from 'src/app/services/gthempleado.service';
import { alerts } from 'src/app/helpers/alerts';
import { ElementRef, ViewChild } from '@angular/core';

declare var Swal: any;
// Variables adicionales para mostrar los dependientes guardados
//dependientesDisplay: any[] = [];

@Component({
  selector: 'app-empleado-cv',
  templateUrl: './empleado-cv.component.html',
  styleUrls: ['./empleado-cv.component.css']
})
export class EmpleadoCvComponent implements OnInit {
  
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  // Variables adicionales para mostrar los dependientes guardados
  dependientesDisplay: any[] = [];
  

  activeSection: string = 'datos-personales';
  activeSubcategory: string = 'info-organizacional';
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

  // // Variables adicionales para mostrar los dependientes guardados
  // dependientesDisplay: any[] = [];

  // Array de dependientes para el formulario
  dependientes = [
    {
      nombre: '',
      fechaNacimiento: '',
      discapacidad: '',
      documentoBase64: '',
      relacion: ''
    }
  ];

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
      this.buscarEmpleadoPorCedula('1206039933001');
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
  private mapearDatosParaMostrar(): void {
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

      

    }
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
   
             //guardar un nuevo empleado
            if (valor1 == 1) {
              // Después de guardar el empleado, guardar dependientes si existen
              this.guardarDependientesAlFinal();
              alerts.basicAlert('Excelente', valor2, 'success');
 
             }
             //actualizar un empleado
             else if (valor1 == 2) {
               //this.loading = false;
              // Después de guardar el empleado, guardar dependientes si existen
              this.guardarDependientesAlFinal();
              alerts.basicAlert('Excelente', valor2, 'success');
             }
             //existe el empleado
             else if (valor1 == 4) {
               //this.loading = false;
               //alerts.basicAlert('Advertencia', valor2, 'warning');
             }
           },
           (err) => {
             console.log('err', err);
           }
         );
  }

  // Método para guardar dependientes después de guardar el empleado principal
  private guardarDependientesAlFinal(): void {
    const dependientesValidos = this.dependientes.filter(dep => 
      dep.nombre && dep.nombre.trim() !== ''
    );

    if (dependientesValidos.length > 0) {
      const dependientesParaGuardar = dependientesValidos.map(dep => ({
        CedulaEmpleado: this.numeroCedula,
        DepNombre: dep.nombre,
        DepFechaNacimiento: dep.fechaNacimiento,
        DepDiscapacidad: dep.discapacidad && dep.discapacidad.toLowerCase() !== 'ninguna',
        DepDocumentoUrl: dep.documentoBase64,
        DepRelacion: dep.relacion || 'Hijo/a'
      }));

      const promesasGuardado = dependientesParaGuardar.map(dependiente => 
        this.gthEmpleadoService.GuardarDependiente(dependiente).toPromise()   //comentado
      );

      Promise.all(promesasGuardado)
        .then(responses => {
          console.log('Dependientes guardados:', responses);
        })
        .catch(error => {
          console.error('Error al guardar dependientes:', error);
        });
    }
  }

  // Form visibility states
  showAddDependentForm: boolean = false;
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
    this.showAddDependentForm = false;
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

  toggleAddDependentForm(): void {
    // Si el formulario está cerrado, cerrar todos los demás primero
    if (!this.showAddDependentForm) {
      this.closeAllForms();
      this.showAddDependentForm = true;
    } else {
      // Si ya está abierto, solo cerrarlo
      this.showAddDependentForm = false;
      this.nuevoDependienteNombre = '';
      this.nuevoDependienteFechaNacimiento = '';
      this.nuevoDependienteDiscapacidad = '';
    }
  }

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
  addDependent(): void {
    if (!this.newDependent.name || !this.newDependent.birthdate || !this.newDependent.disability) {
      Swal.fire({
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos del dependiente antes de guardar.',
        icon: 'warning',
        confirmButtonText: 'Ok'
      });
      return;
    }

    Swal.fire({
      title: 'Dependiente añadido',
      html: `<strong>${this.newDependent.name}</strong><br>Fecha de Nacimiento: ${this.newDependent.birthdate}<br>Discapacidad: ${this.newDependent.disability}`,
      icon: 'success',
      confirmButtonText: 'Aceptar'
    });

    this.newDependent = { name: '', birthdate: '', disability: '' };
    this.toggleAddDependentForm();
  }

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
    familiar: false
  };

  /* ========================================================================
    Funciones para abrir y cerrar modales de forma general
  ======================================================================== */

  openModal(modal: 'principal' | 'secundarios' | 'emergencia' | 'familiar') {
    
    if (modal === 'principal') this.cargarDatosPersonales();
    this.modalStates[modal] = true;
    
    if (modal === 'secundarios') this.cargarDatosPersonalesSecundarios();
    this.modalStates[modal] = true;

    if (modal === 'emergencia') this.cargarDatosEmergencia();
    this.modalStates[modal] = true;

    if (modal === 'familiar') this.cargarDatosFamiliar();
    this.modalStates[modal] = true;
  }

  closeModal(modal: 'principal' | 'secundarios' | 'emergencia' | 'familiar') {
    this.modalStates[modal] = false;
  }

  closeModalOnOverlay(event: Event, modal: 'principal' | 'secundarios' | 'emergencia' | 'familiar') {
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

  // dependientes = [
  //   {
  //     nombre: '',
  //     fechaNacimiento: '',
  //     discapacidad: '',
  //     documentoBase64: '',
  //     relacion: ''
  //   }
  // ];
  
  // Cargar datos al abrir modal Dependeientes familiares
  cargarDatosFamiliar(): void {
    this.estadoConyugal = this.estadoConyugalDisplay;
    this.nombreConyuge = this.nombreConyugeDisplay;
    this.fechaMatrimonio = this.fechaMatrimonioDisplay;
    this.discapacidadConyuge = (this.discapacidadConyugeDisplay === 'true' || 
                               this.discapacidadConyugeDisplay === '1' || 
                               this.discapacidadConyugeDisplay?.toLowerCase() === 'si');
    
    // Cargar dependientes existentes
    this.cargarDependientesExistentes();
  }

  // Método para cargar dependientes existentes desde el backend
  cargarDependientesExistentes(): void {
    if (this.numeroCedula) {
      this.gthEmpleadoService.ObtenerDependientes(this.numeroCedula).subscribe({
        next: (response: any) => {
          if (response && response.length > 0) {
            this.dependientes = response.map((dep: any) => ({
              nombre: dep.DepNombre || '',
              fechaNacimiento: dep.DepFechaNacimiento || '',
              discapacidad: dep.DepDiscapacidad || '',
              documentoBase64: dep.DepDocumentoUrl || '',
              relacion: dep.DepRelacion || ''
            }));
          } else {
            // Si no hay dependientes, inicializar con un registro vacío
            this.dependientes = [{
              nombre: '',
              fechaNacimiento: '',
              discapacidad: '',
              documentoBase64: '',
              relacion: ''
            }];
          }
        },
        error: (error) => {
          console.error('Error al cargar dependientes:', error);
          // Inicializar con registro vacío en caso de error
          this.dependientes = [{
            nombre: '',
            fechaNacimiento: '',
            discapacidad: '',
            documentoBase64: '',
            relacion: ''
          }];
        }
      });
    }
  }

  // Guardar información familiar incluyendo dependientes
  guardarInformacionFamiliar() {
    // Guardar información del cónyuge
    this.estadoConyugalDisplay = this.estadoConyugal;  
    this.nombreConyugeDisplay = this.nombreConyuge;
    this.fechaMatrimonioDisplay = this.fechaMatrimonio;
    this.discapacidadConyugeDisplay = this.discapacidadConyuge ? 'Sí' : 'No';
    
    // Guardar dependientes
    this.guardarDependientes();
  }

  //Método específico para guardar dependientes
  guardarDependientes(): void {
    // Filtrar dependientes que tengan al menos el nombre completo
    const dependientesValidos = this.dependientes.filter(dep => 
      dep.nombre && dep.nombre.trim() !== ''
    );

    if (dependientesValidos.length > 0) {
      // Preparar datos para enviar al backend
      const dependientesParaGuardar = dependientesValidos.map(dep => ({
        CedulaEmpleado: this.numeroCedula,
        DepNombre: dep.nombre,
        DepFechaNacimiento: dep.fechaNacimiento,
        DepDiscapacidad: dep.discapacidad && dep.discapacidad.toLowerCase() !== 'ninguna',
        DepDocumentoUrl: dep.documentoBase64,
        DepRelacion: dep.relacion || 'Hijo/a' // Valor por defecto
      }));

      // Llamar al servicio para guardar cada dependiente
      const promesasGuardado = dependientesParaGuardar.map(dependiente => 
        this.gthEmpleadoService.GuardarDependiente(dependiente).toPromise()  //comentado
      );

      Promise.all(promesasGuardado)
        .then(responses => {
          // Actualizar la visualización de dependientes
          this.dependientesDisplay = dependientesValidos;
          this.actualizarDisplayDependientes();
          
          this.closeModal('familiar');
          Swal.fire({
            icon: 'success',
            title: 'Información familiar actualizada correctamente',
            text: `Se guardaron ${dependientesValidos.length} dependiente(s)`,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });
        })
        .catch(error => {
          console.error('Error al guardar dependientes:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error al guardar',
            text: 'Hubo un problema al guardar la información de los dependientes'
          });
        });
    } else {
      // Si no hay dependientes válidos, solo cerrar el modal
      this.closeModal('familiar');
      Swal.fire({
        icon: 'info',
        title: 'Información familiar actualizada',
        text: 'No se encontraron dependientes para guardar',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    }
  }
  
  //Actualizar las variables de display para mostrar los dependientes
  actualizarDisplayDependientes(): void {
    if (this.dependientesDisplay.length > 0) {
      // Mostrar el primer dependiente (puedes modificar esto según tus necesidades)
      const primerDependiente = this.dependientesDisplay[0];
      this.nombreDepDisplay = primerDependiente.nombre;
      this.fechaNacimientoDepDisplay = primerDependiente.fechaNacimiento;
      this.discapacidadDepDisplay = primerDependiente.discapacidad;
      this.relacionDepDisplay = primerDependiente.relacion;
    }
  }

  // Método para eliminar un dependiente
  eliminarDependiente(index: number): void {
    if (this.dependientes.length > 1) {
      this.dependientes.splice(index, 1);
    }
  }
  // Método para manejar la selección de archivos
  onFileSelectedDep(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.dependientes[index].documentoBase64 = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Agregar dependiente (método existente mejorado)
  agregarDependiente() { 
    this.dependientes.push({
      nombre: '',
      fechaNacimiento: '',
      discapacidad: '',
      documentoBase64: '',
      relacion: ''
    });
  }


}
