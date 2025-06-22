import { Component, OnInit } from '@angular/core';

interface Applicant {
  id: number;
  name: string;
  department: string;
  applicationDate: string;
  qualified: string;
  avatar: string;
  experienceLevel?: string;
  location?: string;
  languages?: string[];
}

@Component({
  selector: 'app-lista-aplicantes',
  templateUrl: './lista-aplicantes.component.html',
  styleUrls: ['./lista-aplicantes.component.css']
})
export class ListaAplicantesComponent implements OnInit {

  activeTab: string = 'curso';

  // Employee Information for navbar
  employee = {
    name: 'Admin User',
    email: 'admin@empresa.com',
    avatar: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
  };

  // Filter options
  filters = {
    department: '',
    qualified: '',
    experience: '',
    location: '',
    language: ''
  };

  // Applicants data
  applicants: Applicant[] = [
    {
      id: 1,
      name: 'José Casas',
      department: 'Desarrollo',
      applicationDate: '05/04/2025',
      qualified: 'Si',
      avatar: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
      experienceLevel: 'Senior',
      location: 'Quito',
      languages: ['Inglés', 'Español']
    },
    {
      id: 2,
      name: 'Juan Casas',
      department: 'Recursos Humanos',
      applicationDate: '01/04/2025',
      qualified: 'No',
      avatar: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
      experienceLevel: 'Junior',
      location: 'Guayaquil',
      languages: ['Español']
    },
    {
      id: 3,
      name: 'María González',
      department: 'Desarrollo',
      applicationDate: '03/04/2025',
      qualified: 'Si',
      avatar: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
      experienceLevel: 'Semi Senior',
      location: 'Cuenca',
      languages: ['Inglés', 'Español', 'Francés']
    },
    {
      id: 4,
      name: 'Carlos Mendoza',
      department: 'Recursos Humanos',
      applicationDate: '02/04/2025',
      qualified: 'Si',
      avatar: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
      experienceLevel: 'Senior',
      location: 'Quito',
      languages: ['Inglés', 'Español']
    }
  ];

  filteredApplicants: Applicant[] = [];

  // Filter options for dropdowns
  departmentOptions = ['Todos', 'Desarrollo', 'Recursos Humanos'];
  qualifiedOptions = ['Todos', 'Si', 'No'];
  experienceOptions = ['Todos', 'Junior', 'Semi Senior', 'Senior'];
  locationOptions = ['Todos', 'Quito', 'Guayaquil', 'Cuenca'];
  languageOptions = ['Todos', 'Inglés', 'Español', 'Francés'];

  constructor() { }

  ngOnInit(): void {
    this.filteredApplicants = [...this.applicants];
  }

  applyFilters(): void {
    this.filteredApplicants = this.applicants.filter(applicant => {
      const matchesDepartment = !this.filters.department || 
                               this.filters.department === 'Todos' || 
                               applicant.department === this.filters.department;
      
      const matchesQualified = !this.filters.qualified || 
                              this.filters.qualified === 'Todos' || 
                              applicant.qualified === this.filters.qualified;
      
      const matchesExperience = !this.filters.experience || 
                               this.filters.experience === 'Todos' || 
                               applicant.experienceLevel === this.filters.experience;
      
      const matchesLocation = !this.filters.location || 
                             this.filters.location === 'Todos' || 
                             applicant.location === this.filters.location;
      
      const matchesLanguage = !this.filters.language || 
                             this.filters.language === 'Todos' || 
                             (applicant.languages && applicant.languages.includes(this.filters.language));

      return matchesDepartment && matchesQualified && matchesExperience && 
             matchesLocation && matchesLanguage;
    });
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  switchTab(tabName: string): void {
    this.activeTab = tabName;
  }

  viewApplicant(applicantId: number): void {
    // Navigate to evaluation page or applicant details
    console.log('Viewing applicant:', applicantId);
    // This would normally use Angular Router
    // this.router.navigate(['/evaluacion', applicantId]);
  }

  toggleDropdown(): void {
    const dropdown = document.getElementById('profileMenu');
    if (dropdown) {
      dropdown.classList.toggle('show');
    }
  }

  logout(): void {
    // Logout logic will be implemented later
    console.log('Logout clicked');
  }

}
