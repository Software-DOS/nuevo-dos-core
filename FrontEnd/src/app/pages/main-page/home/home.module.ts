import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//componentes
import { HomeComponent } from './home.component';
//modulo
import { HomeRoutingModule } from './home-routing.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
