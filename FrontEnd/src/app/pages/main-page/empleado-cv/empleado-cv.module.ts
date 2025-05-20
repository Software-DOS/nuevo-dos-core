import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//componentes
import { EmpleadoCvComponent } from './empleado-cv.component';
//modulo
import { EmpleadoCvRoutingModule } from './empleado-cv-routing.module';

@NgModule({
  declarations: [EmpleadoCvComponent],
  imports: [
    CommonModule,
    EmpleadoCvRoutingModule
  ]
})
export class EmpleadoCvModule { }
