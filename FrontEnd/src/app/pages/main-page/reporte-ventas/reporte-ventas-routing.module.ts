import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//componentes
import { ReporteVentasComponent } from './reporte-ventas.component';

const routes: Routes = [
  { path: '', component: ReporteVentasComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReporteVentasRoutingModule { }
