import { Component, OnInit } from '@angular/core';
import { Iusers } from 'src/app/interface/iusers';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  users:Iusers[]=[];

  constructor() { }

  ngOnInit(): void {
    console.log(this.users);
  }

}
