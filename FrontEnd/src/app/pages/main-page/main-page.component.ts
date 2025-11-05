import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/services/menu.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  public usuario:any="";
  public menu:any=[];
  public submenu:any=[];
  public submenuFinal:any=[];
  public cadena:string = "";
  public Imagen:string = "";

  constructor(private router: Router,private menuService: MenuService) { }

  ngOnInit(): void {
    
    const valor = sessionStorage.getItem('token');

    if (typeof valor === 'string') {
      var IdEmpleado =JSON.parse(atob(valor.split('.')[1]));
      this.usuario = IdEmpleado['NombresApellidos'];
      // this.Imagen = "assets/img/" + IdEmpleado['Imagen'];
      // console.log("this.Imagen:",this.Imagen);
      // this.menuService.cargarMenu(IdEmpleado['IdEmpleado']).subscribe(
      this.menuService.cargarMenu('1').subscribe(
        (resp:any)=>{
            this.menu=resp['$values'];
            console.log("this.menu",this.menu);
            // if (!localStorage.getItem('foo')) {
            //   localStorage.setItem('foo', 'no reload')
            //   location.reload()
            // } else {
            //   localStorage.removeItem('foo')
            // }
        },
        (err)=>{
          console.log("err:",err);
        }
      );
    }

  }

}
