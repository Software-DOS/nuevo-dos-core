import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { subscribeOn } from 'rxjs';
import { Imenu } from 'src/app/interface/imenu';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})

export class SideBarComponent implements OnInit {
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
      this.Imagen = "assets/img/" + IdEmpleado['Imagen'];
      //console.log("this.Imagen:",this.Imagen);
      this.menuService.cargarMenu(IdEmpleado['IdEmpleado']).subscribe(
        (resp:any)=>{
            this.menu=resp['$values'];
            if (!localStorage.getItem('foo')) { 
              localStorage.setItem('foo', 'no reload') 
              location.reload() 
            } else {
              localStorage.removeItem('foo') 
            }
        },
        (err)=>{
          console.log("err:",err);
        }
      );
    }
  }


  //Filtrar menus
  findSubMenu(submenuFinal: any[],id:number): any[] {
    return submenuFinal.filter(p => p.Imenu=id);
  }

  //cerrar sesion
  logout(){
      localStorage.removeItem('token');
      this.router.navigateByUrl("/login");
  }

}
