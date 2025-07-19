import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

//componentes
import { AdminCvComponent } from './admin-cv.component';
//modulo
import { AdminCvRoutingModule } from './admin-cv-routing.module';

@NgModule({
  declarations: [AdminCvComponent],
  imports: [
    CommonModule,
    FormsModule,
    AdminCvRoutingModule
  ]
})
export class AdminCvModule { }
