import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  // Ruta del logo (ajusta según tu estructura de carpetas)
  logoEmpresa: string = 'assets/img/logo.png';
  // O si está en la ruta que mencionaste:
  // logoEmpresa: string = 'assets/imagenes/img/usuarios/logo-empresa.png';
  
  logoPlaceholder: string = 'assets/img/logo1.png'; // Imagen de respaldo


  constructor(private router: Router) { 
    console.log('🏠 HomeComponent cargado');
  }

  ngOnInit(): void {
    // Home page initialization logic here
  }

  // Manejo de error si la imagen no carga
  onImageError(event: any): void {
    console.warn('Error al cargar el logo, usando placeholder');
    event.target.src = this.logoPlaceholder;
    // O mostrar un logo por defecto
    // event.target.src = 'assets/img/logo-default.png';
  }

}
