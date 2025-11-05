import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Ilogin } from '../interface/ilogin';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment'; 
import { map, tap, catchError } from 'rxjs/operators';
import { GthEmpleadoService } from './gthempleado.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient,
    private gthEmpleadoService: GthEmpleadoService
  ) { }
  
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
    // console.log("🚀 [DEBUG] Starting login with data:", JSON.stringify(data));
    // console.log("🔗 [DEBUG] Backend URL:", environment.urlbackend);
    
    const loginUrl = environment.urlbackend + "api/Login/Login?email=" + data.email + "&password=" + data.password;
    // console.log("🔗 [DEBUG] Full login URL:", loginUrl);
    
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
          
          // Procesar ID de GTH empleado después del login exitoso
          setTimeout(() => {
            this.procesarIdGthEmpleadoPostLogin();
          }, 100);
          
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

  // ════════════════════════════════════════════════════════════════════
// 🔐 MÉTODO DE LOGIN CON ACTIVE DIRECTORY
// ════════════════════════════════════════════════════════════════════
/**
 * Autentica un usuario contra Active Directory y la base de datos local
 * 
 * @param data - Objeto con email/usuario y password
 * @returns Observable con la respuesta del backend (contiene token JWT)
 */
loginAD(data: Ilogin): Observable<any> {
  // BORRAR - PRODUCCIÓN: console.log("🚀 [DEBUG] Starting AD login with data:", JSON.stringify(data));
  
  // Construir URL del endpoint de autenticación
  const loginUrl = environment.urlbackend + "api/Auth/loginAD";
  // BORRAR - PRODUCCIÓN: console.log("🔗 [DEBUG] AD Login URL:", loginUrl);
  
  // Preparar datos para enviar al backend
  const body = {
    usuario: data.email,     // Usuario o email del formulario
    clave: data.password     // Contraseña del formulario
  };
  
  // BORRAR - PRODUCCIÓN: console.log("📤 [DEBUG] Enviamos desde el servicio el POST body:", JSON.stringify(body));
  
  // Realizar petición HTTP POST al backend
  return this.http.post(loginUrl, body).pipe(
    
    // TAP: Interceptar respuesta para logs (no modifica la data)
    tap((resp: any) => {
      // BORRAR - PRODUCCIÓN: console.log("✅ [DEBUG] Raw response from AD backend:", resp);
      // BORRAR - PRODUCCIÓN: console.log("🔍 [DEBUG] Token in response:", resp.token);
    }),
    
    // MAP: Procesar respuesta y guardar token en sessionStorage
    map((resp: any) => {
      // BORRAR - PRODUCCIÓN: console.log("🔄 [DEBUG] Processing AD response");
      
      // Verificar que la respuesta contiene un token
      if (resp && resp.token) {
        
        // Limpiar token anterior y guardar el nuevo
        sessionStorage.removeItem('token');
        sessionStorage.setItem('token', resp.token);
        // BORRAR - PRODUCCIÓN: console.log("💾 [DEBUG] AD Token saved to sessionStorage");
        
        // Verificar que el token se guardó correctamente
        const savedToken = sessionStorage.getItem('token');
        // BORRAR - PRODUCCIÓN: console.log("✅ [DEBUG] Token retrieved:", savedToken ? 'EXISTS' : 'NULL');
        
        // Decodificar token para verificar su contenido (solo para debug)
        try {
          const decoded = JSON.parse(atob(resp.token.split('.')[1]));
          // BORRAR - PRODUCCIÓN: console.log("🔍 [DEBUG] Decoded AD token:", decoded);
        } catch (decodeError) {
          // BORRAR - PRODUCCIÓN: console.error("❌ [DEBUG] Error decoding AD token:", decodeError);
        }
        
        // Retornar la respuesta original
        return resp;
        
      } else {
        // No se recibió token del backend
        console.error("❌ [DEBUG] No token in AD response");
        throw new Error('No token received from Active Directory server');
      }
    }),
    
    // CATCH ERROR: Manejar errores de la petición HTTP
    catchError((error) => {
      console.error("❌ [DEBUG] Error in AD login service:", error);
      return throwError(error);
    })
  );
}


// ════════════════════════════════════════════════════════════════════
// ✅ VERIFICAR SI EL USUARIO ESTÁ AUTENTICADO
// ════════════════════════════════════════════════════════════════════
/**
 * Verifica si existe un token válido en sessionStorage
 * Valida que el token contenga datos del usuario
 * 
 * @returns true si está autenticado, false en caso contrario
 */
isLoggedIn(): boolean {
  // Obtener token de sessionStorage
  const token = sessionStorage.getItem('token');
  const isValid = !!token;
  // BORRAR - PRODUCCIÓN: console.log("🔍 [DEBUG] IsLoggedIn check - Token exists:", isValid);
  
  if (token) {
    try {
      // Decodificar token JWT
      const decoded = JSON.parse(atob(token.split('.')[1]));
      // BORRAR - PRODUCCIÓN: console.log("🔍 [DEBUG] Token is valid and decoded:", decoded);
      
      // Buscar claims del usuario en diferentes formatos posibles
      const email = decoded['email'] || 
                   decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
                   decoded['Email'];
      
      const id = decoded['Id'] || decoded['id'];
      const login = decoded['Login'] || decoded['login'];
      const userName = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || 
                      decoded['Name'] ||
                      decoded['DisplayName'];
      
      // Si tiene al menos uno de estos datos, el token es válido
      if (email || id || login || userName) {
        // BORRAR - PRODUCCIÓN: console.log("✅ [DEBUG] Valid user data found in token");
        // BORRAR - PRODUCCIÓN: console.log("  - Email:", email || 'N/A');
        // BORRAR - PRODUCCIÓN: console.log("  - ID:", id || 'N/A');
        // BORRAR - PRODUCCIÓN: console.log("  - Login:", login || 'N/A');
        // BORRAR - PRODUCCIÓN: console.log("  - Name:", userName || 'N/A');
        return true;
      } else {
        console.log("❌ [DEBUG] No user data found in token");
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


// ════════════════════════════════════════════════════════════════════
// 👤 OBTENER INFORMACIÓN DEL USUARIO ACTUAL
// ════════════════════════════════════════════════════════════════════
/**
 * Obtiene todos los datos del usuario desde el token decodificado
 * 
 * @returns Objeto con los claims del token o null si no existe
 */
getCurrentUser(): any {
  try {
    const token = sessionStorage.getItem('token');
    if (!token) return null;
    
    // Decodificar y retornar todo el payload del token
    const decoded = JSON.parse(atob(token.split('.')[1]));
    // BORRAR - PRODUCCIÓN: console.log("👤 [DEBUG] Current user from token:", decoded);
    return decoded;
  } catch (error) {
    console.error("❌ [DEBUG] Error getting current user:", error);
    return null;
  }
}


// ════════════════════════════════════════════════════════════════════
// 🚪 CERRAR SESIÓN
// ════════════════════════════════════════════════════════════════════
/**
 * Cierra la sesión del usuario
 * Limpia el token y todos los datos de sessionStorage
 */
logout(): void {
  sessionStorage.removeItem('token');
  // Limpiar el ID de GTH empleado
  this.gthEmpleadoService.limpiarIdGthEmpleadoDeSession();
  sessionStorage.clear();
  // BORRAR - PRODUCCIÓN: console.log("🚪 [DEBUG] User logged out, token removed");
}


// ════════════════════════════════════════════════════════════════════
// 📧 OBTENER EMAIL DEL USUARIO ACTUAL
// ════════════════════════════════════════════════════════════════════
/**
 * Extrae el email del usuario desde el token JWT
 * Busca en múltiples formatos de claims
 * 
 * @returns Email del usuario o null si no existe
 */
obtenerEmailUsuarioActual(): string | null {
  try {
    const token = sessionStorage.getItem('token');
    if (!token) return null;
    
    // Decodificar token
    const decoded = JSON.parse(atob(token.split('.')[1]));
    
    // Buscar el email en diferentes campos posibles del token
    const email = decoded['email'] || 
                 decoded['Email'] || 
                 decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
                 decoded['emailaddress'];
    
    // BORRAR - PRODUCCIÓN: console.log("🔍 [DEBUG] Email obtenido del token:", email);
    return email || null;
  } catch (error) {
    console.error("❌ [DEBUG] Error obteniendo email del token:", error);
    return null;
  }
}


// ════════════════════════════════════════════════════════════════════
// 🔄 PROCESAR ID DE GTH EMPLEADO POST-LOGIN
// ════════════════════════════════════════════════════════════════════
/**
 * Obtiene y guarda el ID de GTH empleado después de un login exitoso
 * Este ID se usa para cargar foto de perfil y otros datos del empleado
 * 
 * @param email - Email del empleado (opcional, se obtiene del token si no se proporciona)
 */
procesarIdGthEmpleadoPostLogin(email?: string): void {
  // Usar el email proporcionado o extraerlo del token
  const emailUsuario = email || this.obtenerEmailUsuarioActual();
  
  if (!emailUsuario) {
    console.warn("⚠️ [DEBUG] No se pudo obtener el email para buscar el ID de GTH empleado");
    return;
  }

  // BORRAR - PRODUCCIÓN: console.log("🔄 [DEBUG] Procesando ID de GTH empleado para email:", emailUsuario);
  
  // Llamar al servicio para obtener y guardar el ID en sessionStorage
  this.gthEmpleadoService.procesarYGuardarIdGthEmpleadoPorEmail(emailUsuario).subscribe({
    next: (response) => {
      console.log("[LoginService] ID de GTH empleado procesado exitosamente:", response.idEmpleado);
      
      // Verificar que se guardó correctamente en sessionStorage
      setTimeout(() => {
        const idVerificacion = sessionStorage.getItem('idGthEmpleado');
        // BORRAR - PRODUCCIÓN: console.log("[LoginService] Verificación - ID en sessionStorage:", idVerificacion);
        
        if (!idVerificacion) {
          console.warn("[LoginService] Forzando guardado del ID...");
          sessionStorage.setItem('idGthEmpleado', response.idEmpleado.toString());
        }
      }, 100);
    },
    error: (error) => {
      console.warn("[LoginService] No se pudo obtener el ID de GTH empleado:", error);
      // No es un error crítico, el usuario puede seguir usando la aplicación
    }
  });
}

  ActualizarClaveEmpleado(Correo:string,Titulo:string,TipoDocumento:string,Clave:string,Tipo:number){
    return this.http.get(environment.urlbackend + "api/EnviarNotificacion/ActualizarClaveEmpleado?Correo=" + Correo + "&Titulo=" + Titulo +"&TipoDocumento=" + TipoDocumento +"&Clave=" + Clave +"&Tipo=" + Tipo +"");
  }

}
