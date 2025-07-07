import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
    }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navigateToEmployeeCV(empleadoId: number): void {
    // Navigate to admin CV page or employee CV page based on your routing setup
    // Adjust the route path according to your routing configuration
    this.router.navigate(['/admin-cv', empleadoId]);
  }
}
