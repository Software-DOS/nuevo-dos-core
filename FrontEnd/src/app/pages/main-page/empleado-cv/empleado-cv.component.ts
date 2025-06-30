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
      tipo:0,
      idEmpleado:0,
      idPerfil:0,
      idCelula:1,
      cedula: "123456789",
      nombre: "Isaac",
      apellido: "Friedman",
      fechaNacimiento: "",
      direccion: "",
      telefono: "",
      correo: "",
      correoCorporativo: "",
      fechaContratacion: "",
      estadoCivil: "",
      sexo: "",
      fotoPerfilUrl: "",
      estadoEmpleado: "",
      empTipo: 0,
      actPassword: false,
      password: "",
      sueldo: 0,
    }
 
     console.log("data: ",data);
 
         this.gthEmpleadoService.GuardarGthEmpleado(data).subscribe(
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
  toggleAddDependentForm(): void {
    this.showAddDependentForm = !this.showAddDependentForm;
    if (!this.showAddDependentForm) {
      // Limpiar campos cuando se cierra el formulario
      this.nuevoDependienteNombre = '';
      this.nuevoDependienteFechaNacimiento = '';
      this.nuevoDependienteDiscapacidad = '';
    }
  }

  toggleAddEducationForm(): void {
    this.showAddEducationForm = !this.showAddEducationForm;
    if (!this.showAddEducationForm) {
      // Limpiar campos cuando se cierra el formulario
      this.nuevaEducacionNivel = '';
      this.nuevaEducacionCarrera = '';
      this.nuevaEducacionInstitucion = '';
    }
  }

  toggleAddCertificationForm(): void {
    this.showAddCertificationForm = !this.showAddCertificationForm;
    if (!this.showAddCertificationForm) {
      // Limpiar campos cuando se cierra el formulario
      this.nuevaCertificacionTitulo = '';
      this.nuevaCertificacionInstitucion = '';
      this.nuevaCertificacionFecha = '';
    }
  }

  toggleAddLanguageForm(): void {
    this.showAddLanguageForm = !this.showAddLanguageForm;
    if (!this.showAddLanguageForm) {
      // Limpiar campos cuando se cierra el formulario
      this.nuevoIdiomaIdioma = '';
      this.nuevoIdiomaNivel = '';
      this.nuevoIdiomaCertificacion = '';
    }
  }

  toggleAddProjectForm(): void {
    this.showAddProjectForm = !this.showAddProjectForm;
    if (!this.showAddProjectForm) {
      // Limpiar campos cuando se cierra el formulario
      this.nuevoProyectoTitulo = '';
      this.nuevoProyectoEspecialidad = '';
      this.nuevoProyectoAno = '';
    }
  }

  toggleAddJobHistoryForm(): void {
    this.showAddJobHistoryForm = !this.showAddJobHistoryForm;
    if (!this.showAddJobHistoryForm) {
      // Limpiar campos cuando se cierra el formulario
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
}
