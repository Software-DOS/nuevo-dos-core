import { Component, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-formulario-solicitud',
  templateUrl: './formulario-solicitud.component.html',
  styleUrls: ['./formulario-solicitud.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FormularioSolicitudComponent {
  @Output() enviado = new EventEmitter<void>();

  enviarFormulario() {
    this.enviado.emit();
  }
}
