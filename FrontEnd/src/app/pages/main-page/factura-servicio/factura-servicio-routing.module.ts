import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//componente
import { FacturaServicioComponent } from './factura-servicio.component';

const routes: Routes = [
    { path: '', component: FacturaServicioComponent}
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class FacturaServicioRoutingModule { }
