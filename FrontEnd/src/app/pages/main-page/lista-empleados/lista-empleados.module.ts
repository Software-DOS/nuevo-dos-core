import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
    FormsModule,
    ListaEmpleadosRoutingModule
  ]
})
export class ListaEmpleadosModule { }
