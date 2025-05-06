import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-cap-row',
  templateUrl: './cap-row.component.html',
  styleUrls: ['./cap-row.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CapRowComponent {
  @Input() titulo = '';
  @Input() descripcion = '';
  @Input() duracion = '';
  @Input() fecha = '';
  @Input() estado = '';
  @Input() ruta = '#';
  @Input() textoBoton = 'Ver';
}
