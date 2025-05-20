import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//ruta
import { UsersRoutingModule } from './user-routing.module';

//componente
import { UserComponent } from './user.component';

@NgModule({
  declarations: [UserComponent],
  imports: [
    CommonModule,
    UsersRoutingModule
  ]
})
export class UserModule { }
