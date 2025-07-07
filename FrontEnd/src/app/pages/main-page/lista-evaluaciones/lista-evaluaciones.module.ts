import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

//componentes
import { ListaEvaluacionesComponent } from './lista-evaluaciones.component';
//modulo
import { ListaEvaluacionesRoutingModule } from './lista-evaluaciones-routing.module';

@NgModule({
  declarations: [ListaEvaluacionesComponent],
  imports: [
    CommonModule,
    FormsModule,
    ListaEvaluacionesRoutingModule
  ]
})
export class ListaEvaluacionesModule { }
