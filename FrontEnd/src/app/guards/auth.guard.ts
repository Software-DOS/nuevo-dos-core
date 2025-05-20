import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router){}

  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    //console.log('route',route);  
    //console.log('state',state); 

    //return false;
    return new Promise(resolve=>{

      //validar que el token exisite
      if(sessionStorage.getItem('token')!=null){    
        
        //const valor = localStorage.getItem('token');
        const valor = sessionStorage.getItem('token');
        //console.log("valor:",valor)
        if (typeof valor === 'string') {
          try {
          var dataToken =JSON.parse(atob(valor.split('.')[1]));
            } catch(e){
              this.router.navigateByUrl("/login");
              resolve(false);
            }
        }
        if(dataToken['email']!=null)    {
          //console.log("resl:",dataToken['email'])
          resolve(true);
        }  
        else{
          //console.log("resl:",dataToken['email'])
          this.router.navigateByUrl("/login");
          resolve(false);
        }
        
      }
      else{
        this.router.navigateByUrl("/login");
        resolve(false);
      }

    })

  }
  
}
