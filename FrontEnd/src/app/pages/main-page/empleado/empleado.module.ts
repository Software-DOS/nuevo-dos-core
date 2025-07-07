import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//Angular Reactive
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { OrderModule } from 'ngx-order-pipe';
import { FilterPipeModule } from 'ngx-filter-pipe';
//ruta
import { EmpleadoRoutingModule } from './empleado-routing.module';

//componente
import { EmpleadoComponent } from './empleado.component';

@NgModule({
  declarations: [
    EmpleadoComponent
  ],
  imports: [
    CommonModule,
    EmpleadoRoutingModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    FormsModule
  ]
})
export class EmpleadoModule { }
