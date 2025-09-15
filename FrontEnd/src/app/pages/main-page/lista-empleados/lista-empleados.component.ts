import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js'; // npm install crypto-js

interface Empleado {
  id: number;
  nombre: string;
  cedula: string;
  cargo: string;
  area: string;
  certificaciones: number;
  photo: string;
}

@Component({
  selector: 'app-lista-empleados',
  templateUrl: './lista-empleados.component.html',
  styleUrls: ['./lista-empleados.component.css']
})
export class ListaEmpleadosComponent implements OnInit {

  empleados: Empleado[] = [
    {
      id: 1,
      nombre: 'José Casas',
      cedula: '1234567890',
      cargo: 'Desarrollador Backend',
      area: 'Tecnología',
      certificaciones: 3,
      photo: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
    },
    {
      id: 2,
      nombre: 'Juan Perez',
      cedula: '1234567890',
      cargo: 'Desarrollador Backend',
      area: 'Tecnología',
      certificaciones: 3,
      photo: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
    },
    {
      id: 3,
      nombre: 'María Fernanda Cordero',
      cedula: '1809988776',
      cargo: 'Analista de Recursos Humanos',
      area: 'Talento Humano',
      certificaciones: 5,
      photo: 'https://cdn-icons-png.flaticon.com/512/2922/2922561.png'
    },
    {
      id: 4,
      nombre: 'Carlos Andrés Mejía',
      cedula: '0914578903',
      cargo: 'Diseñador Gráfico',
      area: 'Marketing',
      certificaciones: 2,
      photo: 'https://cdn-icons-png.flaticon.com/512/147/147144.png'
    },
    {
      id: 5,
      nombre: 'Diana Alejandra Salas',
      cedula: '0803456789',
      cargo: 'Coordinadora de Finanzas',
      area: 'Finanzas',
      certificaciones: 4,
      photo: 'https://cdn-icons-png.flaticon.com/512/2922/2922510.png'
    },
    {
      id: 6,
      nombre: 'Fernando Viteri',
      cedula: '0609876543',
      cargo: 'Ingeniero DevOps',
      area: 'Tecnología',
      certificaciones: 6,
      photo: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
    },
    {
      id: 7,
      nombre: 'Ana Lucía Ortega',
      cedula: '1204567890',
      cargo: 'Especialista en Calidad',
      area: 'Control de Calidad',
      certificaciones: 3,
      photo: 'https://cdn-icons-png.flaticon.com/512/2922/2922512.png'
    },
    {
      id: 8,
      nombre: 'Jorge Molina',
      cedula: '1734567890',
      cargo: 'Administrador de Base de Datos',
      area: 'Tecnología',
      certificaciones: 2,
      photo: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
    },
    {
      id: 9,
      nombre: 'Gabriela Sánchez',
      cedula: '1103456789',
      cargo: 'Consultora Legal',
      area: 'Legal',
      certificaciones: 1,
      photo: 'https://cdn-icons-png.flaticon.com/512/2922/2922556.png'
    }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  // navigateToEmployeeCV(empleadoId: number): void {
  //   // Navigate to admin CV page or employee CV page based on your routing setup
  //   // Adjust the route path according to your routing configuration
  //   this.router.navigate(['/admin-cv', empleadoId]);
  // }


  // navigateToEmployeeCV(): void {
  //   this.router.navigate(['/admin-cv']);
  // }
  navigateToEmployeeCV(cedula: string): void {
    const encryptedCedula = CryptoJS.AES.encrypt(cedula, 'clave_secreta').toString();
    this.router.navigate(['/admin-cv', encryptedCedula]);
  }

  // Damos color a la etiqueta de AREA
  getAreaClass(area: string): string {
  const areaKey = area.toLowerCase();
  switch (areaKey) {
    case 'tecnología':
      return 'area-badge area-tecnologia';
    case 'talento humano':
      return 'area-badge area-talento';
    case 'marketing':
      return 'area-badge area-marketing';
    case 'finanzas':
      return 'area-badge area-finanzas';
    case 'legal':
      return 'area-badge area-legal';
    case 'control de calidad':
      return 'area-badge area-calidad';
    default:
      return 'area-badge';
  }
}



}
