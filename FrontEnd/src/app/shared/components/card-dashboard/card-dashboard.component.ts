import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-card-dashboard',
  templateUrl: './card-dashboard.component.html',
  styleUrls: ['./card-dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None  // ✅ para que se apliquen tus estilos globales
})
export class CardDashboardComponent {
  @Input() clase = '';         // card-view, card-training, etc.
  @Input() icono = '';         // fa-file-alt, fa-edit, etc.
  @Input() titulo = '';
  @Input() descripcion = '';
  @Input() ruta = '';
  @Input() textoBoton = '';
}
