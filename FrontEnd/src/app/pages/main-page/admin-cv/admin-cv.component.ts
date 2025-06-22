import { Component, OnInit, AfterViewInit } from '@angular/core';

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
      dependents: 2
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

  constructor() { }

  ngOnInit(): void {
    // Component initialization
  }

  ngAfterViewInit(): void {
    this.initializeAnimations();
    this.showSection('bibliografia');
    this.showSubcategory('info-organizacional');
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
}
