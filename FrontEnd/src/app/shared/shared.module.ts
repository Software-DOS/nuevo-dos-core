import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//componetes
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { FooterComponent } from './footer/footer.component';
import { SideBarComponent } from './side-bar/side-bar.component';

//rutas de angular
import  { RouterModule } from '@angular/router'


@NgModule({
  declarations: [
    NavBarComponent,
    FooterComponent,
    SideBarComponent
  ],
  exports:[
    NavBarComponent,
    FooterComponent,
    SideBarComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class SharedModule { }
