import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//componentes
import { ListaEmpleadosComponent } from './lista-empleados.component';
//modulo
import { ListaEmpleadosRoutingModule } from './lista-empleados-routing.module';

@NgModule({
  declarations: [
    ListaEmpleadosComponent
  ],
  imports: [
    CommonModule,
    ListaEmpleadosRoutingModule
  ]
})
export class ListaEmpleadosModule { }
