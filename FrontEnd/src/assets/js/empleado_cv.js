// Función para mostrar sección
function showSection(targetId) {
  // Ocultar todas las secciones principales
  document.querySelectorAll('.content-section').forEach(section => {
    section.classList.remove('active');
  });
  // Resetear estilo de todos los links
  document.querySelectorAll('.category-link').forEach(link => {
    link.classList.remove('selected');
  });
  // Mostrar la sección seleccionada
  const targetSection = document.getElementById(targetId);
  targetSection.classList.add('active');
  // Marcar link seleccionado
  const selectedLink = document.querySelector(`.category-link[data-target="${targetId}"]`);
  if(selectedLink) {
    selectedLink.classList.add('selected');
  }
}

// Funciones de subcategorías
function showSubcategory(targetId) {
  const section = document.querySelector(`#${targetId}`).closest('.content-section');
  section.querySelectorAll('.subcategory-section').forEach(subsection => {
    subsection.classList.remove('active');
  });
  section.querySelectorAll('.subcategory-link').forEach(link => {
    link.classList.remove('active');
  });
  const targetSubsection = document.getElementById(targetId);
  targetSubsection.classList.add('active');
  const selectedLink = section.querySelector(`.subcategory-link[data-subtarget="${targetId}"]`);
  selectedLink.classList.add('active');
}

function toggleEdit() {
  const inputs = document.querySelectorAll('.value');
  const isEditing = inputs[0].disabled;
  inputs.forEach(input => {
    input.disabled = !isEditing;
  });
}

// Nueva función para editar secciones específicas
function toggleSectionEdit(sectionId) {
  const section = document.getElementById(sectionId);
  const inputs = section.querySelectorAll('.value');
  const isEditing = inputs[0].disabled;
  inputs.forEach(input => {
    input.disabled = !isEditing;
  });
}

function toggleAddProjectForm() {
  const form = document.getElementById('addProjectForm');
  const isShowing = form.style.display !== 'none';
  form.style.display = isShowing ? 'none' : 'block';
  
  // Limpiar campos cuando se cierra el formulario
  if (isShowing) {
    document.getElementById('newProjectTitle').value = '';
    document.getElementById('newProjectSpecialty').value = '';
    document.getElementById('newProjectYear').value = '';
  }
}

// Proyecto
function addProject() {
  const title = document.getElementById('newProjectTitle').value.trim();
  const specialty = document.getElementById('newProjectSpecialty').value.trim();
  const year = document.getElementById('newProjectYear').value.trim();

  if (!title || !specialty || !year) {
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
    html: `<strong>${title}</strong><br>Especialidad: ${specialty}<br>Año: ${year}`,
    icon: 'success',
    confirmButtonText: 'Aceptar'
  });

  // Limpiar campos
  document.getElementById('newProjectTitle').value = '';
  document.getElementById('newProjectSpecialty').value = '';
  document.getElementById('newProjectYear').value = '';
  toggleAddProjectForm();
}

function toggleAddLanguageForm() {
  const form = document.getElementById('addLanguageForm');
  const isShowing = form.style.display !== 'none';
  form.style.display = isShowing ? 'none' : 'block';
  
  // Limpiar campos cuando se cierra el formulario
  if (isShowing) {
    document.getElementById('newLanguage').value = '';
    document.getElementById('newLanguageLevel').value = '';
    document.getElementById('newLanguageCertification').value = '';
  }
}

// Idioma
function addLanguage() {
  const language = document.getElementById('newLanguage').value.trim();
  const level = document.getElementById('newLanguageLevel').value.trim();
  const certification = document.getElementById('newLanguageCertification').value.trim();

  if (!language || !level || !certification) {
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
    html: `<strong>${language}</strong><br>Nivel: ${level}<br>Certificación: ${certification}`,
    icon: 'success',
    confirmButtonText: 'Aceptar'
  });

  document.getElementById('newLanguage').value = '';
  document.getElementById('newLanguageLevel').value = '';
  document.getElementById('newLanguageCertification').value = '';
  toggleAddLanguageForm();
}

function toggleAddEducationForm() {
  const form = document.getElementById('addEducationForm');
  const isShowing = form.style.display !== 'none';
  form.style.display = isShowing ? 'none' : 'block';
  
  // Limpiar campos cuando se cierra el formulario
  if (isShowing) {
    document.getElementById('newEducationLevel').value = '';
    document.getElementById('newEducationCareer').value = '';
    document.getElementById('newEducationInstitution').value = '';
  }
}

// Educación
function addEducation() {
  const career = document.getElementById('newEducationCareer').value.trim();
  const institution = document.getElementById('newEducationInstitution').value.trim();

  if (!career || !institution) {
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
    html: `<strong>${career}</strong><br>Institución: ${institution}`,
    icon: 'success',
    confirmButtonText: 'Aceptar'
  });

  document.getElementById('newEducationCareer').value = '';
  document.getElementById('newEducationInstitution').value = '';
  toggleAddEducationForm();
}

function toggleAddCertificationForm() {
  const form = document.getElementById('addCertificationForm');
  const isShowing = form.style.display !== 'none';
  form.style.display = isShowing ? 'none' : 'block';
  
  // Limpiar campos cuando se cierra el formulario
  if (isShowing) {
    document.getElementById('newCertificationTitle').value = '';
    document.getElementById('newCertificationInstitution').value = '';
    document.getElementById('newCertificationDate').value = '';
  }
}

// Certificación
function addCertification() {
  const title = document.getElementById('newCertificationTitle').value.trim();
  const institution = document.getElementById('newCertificationInstitution').value.trim();
  const date = document.getElementById('newCertificationDate').value.trim();

  if (!title || !institution || !date) {
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
    html: `<strong>${title}</strong><br>Institución: ${institution}<br>Fecha: ${date}`,
    icon: 'success',
    confirmButtonText: 'Aceptar'
  });

  document.getElementById('newCertificationTitle').value = '';
  document.getElementById('newCertificationInstitution').value = '';
  document.getElementById('newCertificationDate').value = '';
  toggleAddCertificationForm();
}

function toggleAddDependentForm() {
  const form = document.getElementById('addDependentForm');
  const isShowing = form.style.display !== 'none';
  form.style.display = isShowing ? 'none' : 'block';
  
  // Limpiar campos cuando se cierra el formulario
  if (isShowing) {
    document.getElementById('newDependentName').value = '';
    document.getElementById('newDependentBirthdate').value = '';
    document.getElementById('newDependentDisability').value = '';
  }
}

// Dependiente
function addDependent() {
  const name = document.getElementById('newDependentName').value.trim();
  const birthdate = document.getElementById('newDependentBirthdate').value.trim();
  const disability = document.getElementById('newDependentDisability').value.trim();

  if (!name || !birthdate || !disability) {
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
    html: `<strong>${name}</strong><br>Fecha de Nacimiento: ${birthdate}<br>Discapacidad: ${disability}`,
    icon: 'success',
    confirmButtonText: 'Aceptar'
  });

  document.getElementById('newDependentName').value = '';
  document.getElementById('newDependentBirthdate').value = '';
  document.getElementById('newDependentDisability').value = '';
  toggleAddDependentForm();
}

function previewImage(event) {
  const image = document.getElementById('employeeImage');
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function(e) {
    image.src = e.target.result;
  };

  if (file) {
    reader.readAsDataURL(file);
  }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Inicialmente mostrar la primera sección
  showSection('datos-personales');

  // Añadir evento a los links de categoría
  document.querySelectorAll('.category-link').forEach(link => {
    link.addEventListener('click', function() {
      const targetId = this.getAttribute('data-target');
      showSection(targetId);
    });
  });

  // Event listeners para subcategorías
  document.querySelectorAll('.subcategory-link').forEach(link => {
    link.addEventListener('click', function() {
      const targetId = this.getAttribute('data-subtarget');
      showSubcategory(targetId);
    });
  });

  // Event listener para el botón de imprimir CV
  document.getElementById("printCVButton").addEventListener("click", () => {
    // Crear iframe oculto
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = "exportar_cv.html";
    document.body.appendChild(iframe);

    // Esperar que cargue
    iframe.onload = () => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();

      // Limpiar después de un rato
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 3000);
    };
  });
});
