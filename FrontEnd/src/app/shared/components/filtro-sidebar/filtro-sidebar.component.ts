import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-filtro-sidebar',
  templateUrl: './filtro-sidebar.component.html',
  styleUrls: ['./filtro-sidebar.component.css'] // si usas estilos propios
})
export class FiltroSidebarComponent {
  @Input() departamentos: string[] = [];
  @Input() calificaciones: string[] = [];
  @Input() experiencias: string[] = [];
  @Input() ubicaciones: string[] = [];
  @Input() idiomas: string[] = [];

  @Output() filtrosCambiados = new EventEmitter<any>();

  filtros = {
    departamento: '',
    calificado: '',
    experiencia: '',
    ubicacion: '',
    idioma: ''
  };

  aplicarFiltro() {
    this.filtrosCambiados.emit(this.filtros);
  }
}
