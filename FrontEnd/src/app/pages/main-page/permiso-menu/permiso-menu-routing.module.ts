import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//componentes
import { PermisoMenuComponent } from './permiso-menu.component';

const routes: Routes = [
    { path: '', component: PermisoMenuComponent}
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class PermisoMenuRoutingModule { }