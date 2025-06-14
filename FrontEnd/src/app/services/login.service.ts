import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Ilogin } from '../interface/ilogin';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment'; 
import { map, tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }
  
  private readonly llaveToken ='token';
  
  guardarToken():string{
    // Fix: Read token from sessionStorage instead of hardcoded string
    const token = sessionStorage.getItem(this.llaveToken);
    console.log("🔍 [DEBUG] Token from sessionStorage:", token);
    
    if (!token) {
      console.log("❌ [DEBUG] No token found in sessionStorage");
      return '';
    }
    
    try {
      const dataToken = JSON.parse(atob(token.split('.')[1]));
      console.log("🔍 [DEBUG] Decoded token data:", dataToken);
      
      // Check for different email claim formats
      const email = dataToken['email'] || 
                   dataToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
                   dataToken['Email'];
      
      return email || '';
    } catch (error) {
      console.error("❌ [DEBUG] Error decoding token:", error);
      return '';
    }
  }
  
  login(data:Ilogin): Observable<any>{
    console.log("🚀 [DEBUG] Starting login with data:", JSON.stringify(data));
    console.log("🔗 [DEBUG] Backend URL:", environment.urlbackend);
    
    const loginUrl = environment.urlbackend + "api/Login/Login?email=" + data.email + "&password=" + data.password;
    console.log("🔗 [DEBUG] Full login URL:", loginUrl);
    
    return this.http.get(loginUrl).pipe(
      tap((resp: any) => {
        console.log("✅ [DEBUG] Raw response from backend:", resp);
        console.log("🔍 [DEBUG] Token in response:", resp.token);
      }),
      map((resp:any)=>{
        console.log("🔄 [DEBUG] Processing response in map operator");
        if (resp && resp.token) {
          // Clear any existing token first
          sessionStorage.removeItem('token');
          
          // Set the new token
          sessionStorage.setItem('token', resp.token);
          console.log("💾 [DEBUG] Token saved to sessionStorage:", resp.token);
          
          // Validate the token was saved correctly
          const savedToken = sessionStorage.getItem('token');
          console.log("✅ [DEBUG] Token retrieved from sessionStorage:", savedToken);
          
          // Additional validation - check if token can be decoded
          try {
            const decoded = JSON.parse(atob(resp.token.split('.')[1]));
            console.log("🔍 [DEBUG] Successfully decoded saved token:", decoded);
            console.log("🔍 [DEBUG] Available claims in token:", Object.keys(decoded));
          } catch (decodeError) {
            console.error("❌ [DEBUG] Error decoding saved token:", decodeError);
          }
          
          return resp;
        } else {
          console.error("❌ [DEBUG] No token in response:", resp);
          throw new Error('No token received from server');
        }
      }),
      catchError((error) => {
        console.error("❌ [DEBUG] Error in login service:", error);
        return throwError(error);
      })
    );
  }

  // Helper method to check if user is logged in
  isLoggedIn(): boolean {
    const token = sessionStorage.getItem('token');
    const isValid = !!token;
    console.log("🔍 [DEBUG] IsLoggedIn check - Token exists:", isValid);
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        console.log("🔍 [DEBUG] Token is valid and decoded:", decoded);
        
        // Check for different email claim formats
        const email = decoded['email'] || 
                     decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
                     decoded['Email'];
        
        if (email) {
          console.log("🔍 [DEBUG] Valid email found in token:", email);
          return true;
        } else {
          console.log("❌ [DEBUG] No email found in token");
          return false;
        }
      } catch (error) {
        console.error("❌ [DEBUG] Invalid token:", error);
        this.logout();
        return false;
      }
    }
    return false;
  }

  // Helper method to get current user info from token
  getCurrentUser(): any {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) return null;
      
      const decoded = JSON.parse(atob(token.split('.')[1]));
      console.log("👤 [DEBUG] Current user from token:", decoded);
      return decoded;
    } catch (error) {
      console.error("❌ [DEBUG] Error getting current user:", error);
      return null;
    }
  }

  // Method to clear token on logout
  logout(): void {
    sessionStorage.removeItem('token');
    sessionStorage.clear(); // Clear all session storage
    console.log("🚪 [DEBUG] User logged out, token removed");
  }

  ActualizarClaveEmpleado(Correo:string,Titulo:string,TipoDocumento:string,Clave:string,Tipo:number){
    return this.http.get(environment.urlbackend + "api/EnviarNotificacion/ActualizarClaveEmpleado?Correo=" + Correo + "&Titulo=" + Titulo +"&TipoDocumento=" + TipoDocumento +"&Clave=" + Clave +"&Tipo=" + Tipo +"");
  }

}
