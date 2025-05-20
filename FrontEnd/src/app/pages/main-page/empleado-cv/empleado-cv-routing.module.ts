import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//componentes
import { EmpleadoCvComponent } from './empleado-cv.component';

const routes: Routes = [
  { path: '', component: EmpleadoCvComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpleadoCvRoutingModule { }
