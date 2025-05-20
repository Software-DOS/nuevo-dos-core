import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//componentes
import { ListaCapacitacionesComponent } from './lista-capacitaciones.component';

const routes: Routes = [
  { path: '', component: ListaCapacitacionesComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListaCapacitacionesRoutingModule { }
