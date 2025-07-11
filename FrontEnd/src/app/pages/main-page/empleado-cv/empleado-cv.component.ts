import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { iGTHEmpleado } from 'src/app/interface/igth-empleado';
import { GthEmpleadoService } from 'src/app/services/gthempleado.service';
import { alerts } from 'src/app/helpers/alerts';

declare var Swal: any;

@Component({
  selector: 'app-empleado-cv',
  templateUrl: './empleado-cv.component.html',
  styleUrls: ['./empleado-cv.component.css']
})
export class EmpleadoCvComponent implements OnInit {
  
  activeSection: string = 'datos-personales';
  activeSubcategory: string = 'info-organizacional';
  isEditing: boolean = false;
  sectionEditStates: { [key: string]: boolean } = {
    'datos-personales': false,
    'info-profesional': false
  };

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
  public discapacidadConyuge: string = '';
  public documentosConyuge: string = '';

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
  }
 
  guardarEmpleado(){
 
    console.log("Ingreso");
 
    const data: iGTHEmpleado = {
      tipo: 0,
      idEmpleado: 0,
      idPerfil: 0,
      idCelula: 1,
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
      discapacidadConyuge: this.discapacidadConyuge === 'true' || this.discapacidadConyuge === 'Si',
      documentosConyuge: this.documentosConyuge,
      
      // Información Laboral
      cargoActual: this.cargoActual,
      area: this.areaLaboral || this.area,
      subArea: this.subareaLaboral || this.subarea,
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
             //console.log("valor1",valor1);
             //console.log("valor2",valor2);
   
             //guardar un nuevo empleado
             if (valor1 == 1) {
               alerts.basicAlert('Excelente', valor2, 'success');
 
             }
             //actualizar un empleado
             else if (valor1 == 2) {
               //this.loading = false;
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
             //this.loading = false;
           }
         );
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
    this.nuevoDependienteNombre = '';
    this.nuevoDependienteFechaNacimiento = '';
    this.nuevoDependienteDiscapacidad = '';
    
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

  // Variable para controlar el modal
showEditModal: boolean = false;

// Función para abrir el modal
openEditModal(): void {
  this.showEditModal = true;
}

// Función para cerrar el modal
closeEditModal(): void {
  this.showEditModal = false;
}

// Función para cerrar el modal al hacer clic en el overlay
closeModalOnOverlay(event: Event): void {
  if (event.target === event.currentTarget) {
    this.closeEditModal();
  }
}


}
