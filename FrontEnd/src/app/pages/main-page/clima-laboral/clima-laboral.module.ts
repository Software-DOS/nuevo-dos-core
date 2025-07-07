import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//ruta
import { ClimaLaboralRoutingModule } from './clima-laboral-routing.module';

//componente
import { ClimaLaboralComponent } from './clima-laboral.component'; 

@NgModule({
  declarations: [
    ClimaLaboralComponent
  ],
  imports: [
    CommonModule,
    ClimaLaboralRoutingModule
  ]
})
export class ClimaLaboralModule { }
