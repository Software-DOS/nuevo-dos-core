import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//componentes
import { ListaEvaluacionesComponent } from './lista-evaluaciones.component';


const routes: Routes = [
  { path: '', component: ListaEvaluacionesComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListaEvaluacionesRoutingModule { }
