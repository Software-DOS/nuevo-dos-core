import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//ruta
import { PedidoRoutingModule } from './pedido-routing.module';

//componente
import { PedidoComponent } from './pedido.component';

import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { NgxPaginationModule } from 'ngx-pagination';
import { OrderModule } from 'ngx-order-pipe';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    PedidoComponent,
  ],
  imports: [
    CommonModule,
    PedidoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    OrderModule,
    FilterPipeModule,
    NgMultiSelectDropDownModule
  ]
})
export class PedidoModule { }
