import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private loginService: LoginService){}

  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    console.log('🔒 [AUTH GUARD] Checking route access for:', state.url);
    
    return new Promise(resolve=>{

      //validar que el token exisite
      const token = sessionStorage.getItem('token');
      console.log('🔒 [AUTH GUARD] Token exists:', !!token);
      
      if(token != null){    
        
        console.log("🔒 [AUTH GUARD] Token found, validating...");
        if (typeof token === 'string') {
          try {
            var dataToken = JSON.parse(atob(token.split('.')[1]));
            console.log("🔒 [AUTH GUARD] Token decoded successfully:", dataToken);
            
            // Check for different email claim formats
            const email = dataToken['email'] || 
                         dataToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
                         dataToken['Email'] ||
                         dataToken['EmailAddress'];
            
            console.log("🔒 [AUTH GUARD] Email found in token:", email);
            
            if(email != null && email !== '') {
              console.log("🔒 [AUTH GUARD] Valid email in token:", email);
              console.log("✅ [AUTH GUARD] Access granted");
              resolve(true);
            } else {
              console.log("❌ [AUTH GUARD] No email in token, available claims:", Object.keys(dataToken));
              console.log("❌ [AUTH GUARD] Token content:", dataToken);
              this.router.navigateByUrl("/login");
              resolve(false);
            }
          } catch(e){
            console.error("❌ [AUTH GUARD] Error decoding token:", e);
            this.router.navigateByUrl("/login");
            resolve(false);
          }
        }
      } else {
        console.log("❌ [AUTH GUARD] No token found, redirecting to login");
        this.router.navigateByUrl("/login");
        resolve(false);
      }

    })

  }
  
}
