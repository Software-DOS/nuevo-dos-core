import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//componentes
import { ListaEvaluacionesComponent } from './lista-evaluaciones.component';
//modulo
import { ListaEvaluacionesRoutingModule } from './lista-evaluaciones-routing.module';

@NgModule({
  declarations: [ListaEvaluacionesComponent],
  imports: [
    CommonModule,
    ListaEvaluacionesRoutingModule
  ]
})
export class ListaEvaluacionesModule { }
