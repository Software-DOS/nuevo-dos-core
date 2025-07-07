import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmpleadoCapacitacionesComponent } from './empleado-capacitaciones.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    EmpleadoCapacitacionesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: EmpleadoCapacitacionesComponent }
    ])
  ]
})
export class EmpleadoCapacitacionesModule { }
