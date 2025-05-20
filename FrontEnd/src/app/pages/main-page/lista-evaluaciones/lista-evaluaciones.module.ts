import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//componentes
import { ListaEvaluacionesComponent } from './lista-evaluaciones.component';
//modulo
import { ListaCapacitacionesRoutingModule } from '../lista-capacitaciones/lista-capacitaciones-routing.module';

@NgModule({
  declarations: [ListaEvaluacionesComponent],
  imports: [
    CommonModule,
    ListaCapacitacionesRoutingModule
  ]
})
export class ListaEvaluacionesModule { }
