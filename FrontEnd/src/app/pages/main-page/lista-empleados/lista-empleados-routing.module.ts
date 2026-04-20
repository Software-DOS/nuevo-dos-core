import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//componentes
import { ListaEmpleadosComponent } from './lista-empleados.component';

const routes: Routes = [
   { path: '', component: ListaEmpleadosComponent}
];

// const routes: Routes = [
//   { path: ':id', component: ListaEmpleadosComponent }
// ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListaEmpleadosRoutingModule { }
