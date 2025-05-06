import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//ruta
import { FacturaServicioRoutingModule } from './factura-servicio-routing.module';

//componente
import { FacturaServicioComponent } from './factura-servicio.component';


import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { ModelClienteComponent } from './model-cliente/model-cliente.component';
import { ModelProductoComponent } from './model-producto/model-producto.component';

import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    FacturaServicioComponent,
    ModelClienteComponent,
    ModelProductoComponent,
  ],
  imports: [
    CommonModule,
    FacturaServicioRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
  ],
  entryComponents: [
    ModelClienteComponent,
    ModelProductoComponent,
  ]
})
export class FacturaServicioModule { }
