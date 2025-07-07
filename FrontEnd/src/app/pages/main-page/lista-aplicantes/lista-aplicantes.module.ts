import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ListaAplicantesComponent } from './lista-aplicantes.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    ListaAplicantesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: ListaAplicantesComponent }
    ])
  ]
})
export class ListaAplicantesModule { }
