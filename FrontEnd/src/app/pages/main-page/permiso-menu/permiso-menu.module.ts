import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//ruta
import { PermisoMenuRoutingModule } from './permiso-menu-routing.module';

//componente
import { PermisoMenuComponent } from './permiso-menu.component';

import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { NgxPaginationModule } from 'ngx-pagination';
import { OrderModule } from 'ngx-order-pipe';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    PermisoMenuComponent
  ],
  imports: [
    CommonModule,
    PermisoMenuRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    OrderModule,
    FilterPipeModule,
    NgMultiSelectDropDownModule
  ]
})
export class PermisoMenuModule { }
