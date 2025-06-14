import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder,Validator, Validators } from '@angular/forms';
import { functions } from 'src/app/helpers/functions';
import { Ilogin } from 'src/app/interface/ilogin';
import { LoginService } from 'src/app/services/login.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { alerts } from 'src/app/helpers/alerts';
// import { subscribeOn } from 'rxjs'; // ⭐ Línea no utilizada - puedes eliminar
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // ⭐ Formulario reactivo para login
  public f = this.form.group({
      email:['',[Validators.required,Validators.email]],
      password:['',Validators.required]
  });

  // ⭐ Variables de estado del componente
  formSubmitted=false;
  verLogin=true;
  cambiarClave=false;
  nuevaClave=false;
  loading = false;
  
  // ⭐ Variables para funcionalidad de cambio de contraseña
  public ClaveTemporal:any="";
  public emailClave:string="";
  public clave1:string="";
  public clave2:string="";
  public generica: any = [];
  public carga: any = [];
  
  constructor(
    private form: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private ngZone: NgZone // ⭐ Necesario para navegación correcta
  ) { }

  ngOnInit(): void {
    // ⭐ Verificar si el usuario ya está autenticado
    if (this.loginService.isLoggedIn()) {
      console.log("👤 [DEBUG] User already logged in, redirecting to home");
      this.router.navigateByUrl("/");
    }
  }

  // ⭐ Función principal de login
  login(){
     this.formSubmitted=true;
     console.log("🎯 [DEBUG] Login form submitted");
     console.log("🎯 [DEBUG] Form validity:", this.f.valid);
     
      // ⭐ Validación del formulario
      if(this.f.invalid){
        console.log("❌ [DEBUG] Form is invalid, stopping login");
        return;
      }
      
      // ⭐ Preparar datos para envío
      const data: Ilogin = {
        email:this.f.controls['email'].value,
        password:this.f.controls['password'].value
      }
      
      console.log("📤 [DEBUG] Sending login data:", JSON.stringify(data)); 
      this.loading = true;
      
      // ⭐ Llamada al servicio de login
      this.loginService.login(data).subscribe({
          next: (resp:any) => {
             console.log("✅ [DEBUG] Login successful, response:", resp);
             
              // ⭐ Verificación doble del token guardado
              const valor = sessionStorage.getItem('token');
              console.log("🔍 [DEBUG] Token from sessionStorage after login:", valor);
              
              if (typeof valor === 'string' && valor.trim() !== '') {
                try {
                  var IdEmpleado = JSON.parse(atob(valor.split('.')[1]));
                  console.log("👤 [DEBUG] Decoded employee data:", IdEmpleado);
                  
                  // ⭐ Verificar claims de email en diferentes formatos
                  const email = IdEmpleado['email'] || 
                               IdEmpleado['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
                               IdEmpleado['Email'];
                  
                  if (!email) {
                    console.error("❌ [DEBUG] No email claim found in token");
                    alerts.basicAlert("Error", "Token inválido - no se encontró email", "error");
                    this.loading = false;
                    return;
                  }
                  
                  console.log("✅ [DEBUG] Email found in token:", email);
                  
                  // ⭐ Usar NgZone para asegurar que la navegación funcione correctamente
                  this.ngZone.run(() => {
                    console.log("🔄 [DEBUG] Running navigation inside NgZone");
                    this.loading = false;
                    
                    console.log("🚀 [DEBUG] Attempting navigation to home");
                    
                    // ⭐ Navegación con fallback en caso de fallo
                    this.router.navigate(['/']).then((success) => {
                      console.log("✅ [DEBUG] Navigation success:", success);
                      if (success) {
                        // ⭐ Mostrar mensaje de éxito después de navegación exitosa
                        alerts.basicAlert("Éxito", "Login exitoso", "success");
                      } else {
                        console.log("⚠️ [DEBUG] Navigation failed, trying alternative method");
                        // ⭐ Fallback: recarga forzada de página
                        window.location.href = '/';
                      }
                    }).catch((navError) => {
                      console.error("❌ [DEBUG] Navigation error:", navError);
                      // ⭐ Fallback final: recarga forzada
                      window.location.href = '/';
                    });
                  });
                  
                } catch (tokenError) {
                  console.error("❌ [DEBUG] Error parsing token:", tokenError);
                  alerts.basicAlert("Error", "Error al procesar el token de autenticación", "error");
                  this.loading = false;
                }
              } else {
                console.error("❌ [DEBUG] No valid token found after login");
                alerts.basicAlert("Error", "No se recibió un token válido del servidor", "error");
                this.loading = false;
              }     
          },
          error: (err) => {
              // ⭐ Manejo comprehensivo de errores
              console.error("❌ [DEBUG] Login failed with error:", err);
              
              if(err.error && err.error.status === 404){
                alerts.basicAlert("Error","Invalid password","error");         
              } else if(err.status === 401) {
                alerts.basicAlert("Error","Invalid email or password","error");
              } else if(err.status === 0) {
                alerts.basicAlert("Error","Network error - Please check your connection","error");
              } else {
                alerts.basicAlert("Error","Invalid email or password","error");
              }
              this.loading = false;
          }
      });
  }

  // ⭐ Funciones para cambio de contraseña
  CambiarClave(){
    this.verLogin = false;
    this.cambiarClave = true;
    this.nuevaClave=false;
  }

  CambiarContrasenia(){
    if(this.emailClave==""){
      alerts.basicAlert('Advertencia', 'Debe ingresar el email', 'warning');
    }
    else{
      this.loading=true;
      this.loginService.ActualizarClaveEmpleado(this.emailClave, "Actualizar Contraseña","RESET USUARIO","",0).subscribe(
        (resp: any) => {
          this.carga = resp['$values'];
          this.generica = this.carga[0];
          let valor1 = this.generica.valor1;
          let valor2 = this.generica.valor2;
          
          if (valor1 == 1) {
            this.verLogin = true;
            this.cambiarClave = false;
            this.nuevaClave=false;
            this.loading=false;
            alerts.basicAlert('Excelente', valor2, 'success');
          }
        },
        (err) => {
          console.log('err:', err);
          this.loading = false; // ⭐ Asegurar que loading se resetee en caso de error
        }
      );
    }
  }

  ActualizarContrasenia(){
    if(this.clave1!=this.clave2){
      alerts.basicAlert('Advertencia', 'La clave no son iguales..', 'warning');
    }
    else{
      this.loading=true;
      this.loginService.ActualizarClaveEmpleado(this.f.controls['email'].value, "Actualizar Contraseña","RESET USUARIO",this.clave2,1).subscribe(
        (resp: any) => {
          this.carga = resp['$values'];
          this.generica = this.carga[0];
          let valor1 = this.generica.valor1;
          let valor2 = this.generica.valor2;
          
          if (valor1 == 1) {
            this.verLogin = true;
            this.cambiarClave = false;
            this.nuevaClave=false;
            this.loading=false;
            this.formSubmitted=false;
            this.f.controls['email'].setValue("");
            this.f.controls['password'].setValue("");
            alerts.basicAlert('Excelente', valor2, 'success');
          }
        },
        (err) => {
          console.log('err:', err);
          this.loading = false; // ⭐ Asegurar que loading se resetee en caso de error
        }
      );
    }
  }

  // ⭐ Función helper para validación de campos
  invalidField(field:string){
    return functions.invalidField(field,this.f,this.formSubmitted);
  }
}
