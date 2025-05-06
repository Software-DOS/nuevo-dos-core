import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//ruta
import { PerfilesRoutingModule } from './perfiles-routing.module';

//componente
import { PerfilesComponent } from './perfiles.component';

import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { NgxPaginationModule } from 'ngx-pagination';
import { OrderModule } from 'ngx-order-pipe';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    PerfilesComponent
  ],
  imports: [
    CommonModule,
    PerfilesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    OrderModule,
    FilterPipeModule,
    NgMultiSelectDropDownModule
  ]
})
export class PerfilesModule { }
