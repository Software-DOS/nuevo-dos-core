import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

//componentes
import { ListaCapacitacionesComponent } from './lista-capacitaciones.component';
//modulo
import { ListaCapacitacionesRoutingModule } from './lista-capacitaciones-routing.module';

@NgModule({
  declarations: [ListaCapacitacionesComponent],
  imports: [
    CommonModule,
    FormsModule,
    ListaCapacitacionesRoutingModule
  ]
})
export class ListaCapacitacionesModule { }
