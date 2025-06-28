import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

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

  // Form visibility states
  showAddDependentForm: boolean = false;
  showAddEducationForm: boolean = false;
  showAddCertificationForm: boolean = false;
  showAddLanguageForm: boolean = false;
  showAddProjectForm: boolean = false;

  // New item models
  newDependent = { name: '', birthdate: '', disability: '' };
  newEducation = { career: '', institution: '' };
  newCertification = { title: '', institution: '', date: '' };
  newLanguage = { language: '', level: '', certification: '' };
  newProject = { title: '', specialty: '', year: '' };

  constructor() { }

  ngOnInit(): void {
    this.showSection('datos-personales');
  }

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
  }

  toggleAddEducationForm(): void {
    this.showAddEducationForm = !this.showAddEducationForm;
  }

  toggleAddCertificationForm(): void {
    this.showAddCertificationForm = !this.showAddCertificationForm;
  }

  toggleAddLanguageForm(): void {
    this.showAddLanguageForm = !this.showAddLanguageForm;
  }

  toggleAddProjectForm(): void {
    this.showAddProjectForm = !this.showAddProjectForm;
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
