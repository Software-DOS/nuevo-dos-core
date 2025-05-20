import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//componentes
import { ListaCapacitacionesComponent } from './lista-capacitaciones.component';
//modulo
import { ListaCapacitacionesRoutingModule } from './lista-capacitaciones-routing.module';

@NgModule({
  declarations: [ListaCapacitacionesComponent],
  imports: [
    CommonModule,
    ListaCapacitacionesRoutingModule
  ]
})
export class ListaCapacitacionesModule { }
