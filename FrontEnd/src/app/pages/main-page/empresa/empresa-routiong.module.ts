import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//componentes
import { EmpresaComponent } from './empresa.component';

const routes: Routes = [
  { path: '', component: EmpresaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class  EmpresaRoutingModule { }
