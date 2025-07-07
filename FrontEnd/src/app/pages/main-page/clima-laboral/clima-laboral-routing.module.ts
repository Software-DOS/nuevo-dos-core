import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//componentes
import { ClimaLaboralComponent } from './clima-laboral.component';

const routes: Routes = [
    { path: '', component: ClimaLaboralComponent}
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class ClimaLaboralRoutingModule { }