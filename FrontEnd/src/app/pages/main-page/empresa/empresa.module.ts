import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//Angular Reactive
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { OrderModule } from 'ngx-order-pipe';
import { FilterPipeModule } from 'ngx-filter-pipe';

//ruta
import { EmpresaRoutingModule } from './empresa-routiong.module';

//componente
import { EmpresaComponent } from './empresa.component';


@NgModule({
  declarations: [
    EmpresaComponent,
  ],
  imports: [
    CommonModule,
    EmpresaRoutingModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    OrderModule,
    FilterPipeModule,
    FormsModule
  ]
})
export class EmpresaModule { }
