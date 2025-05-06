import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//ruta
import { ReporteVentasRoutingModule } from './reporte-ventas-routing.module';

//componente
import { ReporteVentasComponent } from './reporte-ventas.component';

import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { NgxPaginationModule } from 'ngx-pagination';
import { OrderModule } from 'ngx-order-pipe';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    ReporteVentasComponent,
  ],
  imports: [
    CommonModule,
    ReporteVentasRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    OrderModule,
    FilterPipeModule,
    NgMultiSelectDropDownModule
  ]
})
export class ReporteVentasModule { }
