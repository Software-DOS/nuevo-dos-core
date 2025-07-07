import { Component, OnInit } from '@angular/core';

interface WorkExperience {
  position: string;
  company: string;
  period: string;
  responsibilities: string[];
}

interface Education {
  degree: string;
  institution: string;
  year?: string;
}

interface Project {
  name: string;
  specialty: string;
  year: string;
}

interface Certification {
  name: string;
  institution: string;
  year: string;
}

interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  birthdate: string;
  city: string;
  position: string;
  area: string;
  subarea: string;
  supervisor: string;
  avatar: string;
}

@Component({
  selector: 'app-exportar-cv',
  templateUrl: './exportar-cv.component.html',
  styleUrls: ['./exportar-cv.component.css']
})
export class ExportarCvComponent implements OnInit {

  // Personal Information
  personalInfo: PersonalInfo = {
    name: 'Juan Carlos Rodríguez Martínez',
    email: 'juan.rodriguez@empresa.com',
    phone: '+34 612 345 678',
    address: 'Calle Serrano 123, 28006 Madrid',
    birthdate: '15-03-1985',
    city: 'Madrid',
    position: 'Analista de Sistemas',
    area: 'Tecnología de la Información',
    subarea: 'Desarrollo de Aplicaciones',
    supervisor: 'María Sánchez',
    avatar: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
  };

  // Work Experience
  workExperience: WorkExperience[] = [
    {
      position: 'Analista de Sistemas',
      company: 'Tecnología Innovadora S.A.',
      period: '2020 - Actualidad',
      responsibilities: [
        'Desarrollo de aplicaciones para el área de TI.',
        'Participación en proyectos de innovación tecnológica.'
      ]
    },
    {
      position: 'Desarrollador Senior',
      company: 'Software Solutions Inc.',
      period: '2018 - 2019',
      responsibilities: [
        'Desarrollo de aplicaciones web empresariales.',
        'Liderazgo de equipo técnico.'
      ]
    },
    {
      position: 'Desarrollador Full Stack',
      company: 'Tech Innovations Ltd.',
      period: '2016 - 2018',
      responsibilities: [
        'Implementación de APIs RESTful y arquitectura de microservicios.'
      ]
    },
    {
      position: 'Desarrollador Junior',
      company: 'Digital Systems Corp.',
      period: '2014 - 2016',
      responsibilities: [
        'Mantenimiento de plataformas web y desarrollo frontend.'
      ]
    }
  ];

  // Education
  education: Education[] = [
    {
      degree: 'Máster en Desarrollo de Software',
      institution: 'ESIC Business School'
    },
    {
      degree: 'Ingeniería en Sistemas Informáticos',
      institution: 'Universidad Politécnica de Madrid'
    }
  ];

  // Projects
  projects: Project[] = [
    {
      name: 'Sistema de Gestión Empresarial',
      specialty: 'Desarrollo Full Stack',
      year: '2022'
    }
  ];

  // Certifications
  certifications: Certification[] = [
    {
      name: 'AWS Solutions Architect',
      institution: 'Amazon Web Services',
      year: '2022'
    }
  ];

  // Languages
  languages = [
    {
      language: 'Inglés',
      level: 'Avanzado'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    // Auto-print when component loads (optional)
    // setTimeout(() => {
    //   window.print();
    // }, 1000);
  }

  printCV(): void {
    window.print();
  }

}
