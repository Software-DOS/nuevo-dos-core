import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//ruta
import { InventarioRoutingModule } from './inventario-routing.module';

//componente
import { InventarioComponent } from './inventario.component';

import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { NgxPaginationModule } from 'ngx-pagination';
import { OrderModule } from 'ngx-order-pipe';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    InventarioComponent,
  ],
  imports: [
    CommonModule,
    InventarioRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    OrderModule,
    FilterPipeModule,
    NgMultiSelectDropDownModule
  ]
})
export class InventarioModule { }
