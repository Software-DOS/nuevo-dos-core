import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

//componentes
import { EmpleadoCvComponent } from './empleado-cv.component';
//modulo
import { EmpleadoCvRoutingModule } from './empleado-cv-routing.module';

@NgModule({
  declarations: [EmpleadoCvComponent],
  imports: [
    CommonModule,
    FormsModule,
    EmpleadoCvRoutingModule
  ]
})
export class EmpleadoCvModule { }
