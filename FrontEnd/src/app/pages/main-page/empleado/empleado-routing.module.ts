import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//componentes
import { EmpleadoComponent } from './empleado.component';

const routes: Routes = [
    { path: '', component: EmpleadoComponent}
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class EmpleadoRoutingModule { }