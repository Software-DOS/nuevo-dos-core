import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ilogin } from 'src/app/interface/ilogin';
import { LoginService } from 'src/app/services/login.service';
import { alerts } from 'src/app/helpers/alerts';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public f!: FormGroup; // FormGroup inicializado en ngOnInit

  // Flags que usa tu template original
  public verLogin = true;
  public cambiarClave = false;
  public nuevaClave  = false;

  // Campos para recuperación de contraseña (stubs)
  public emailClave = '';
  public clave1     = '';
  public clave2     = '';

  public loading = false;
  public formSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.f = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  login(): void {
    this.formSubmitted = true;
    if (this.f.invalid) {
      return;
    }

    const data: Ilogin = {
      email:    this.f.value.email,
      password: this.f.value.password
    };

    this.loading = true;
    this.loginService.login(data).subscribe(
      (token: string) => {
        // Guardar token en sea ssionStorage
        this.loginService.saveToken(token);
        // Recargar la página para aplicar el token y navegar al home
        window.location.href = '/';
      },
      err => {
        console.error('Error en login:', err);
        if (err.status === 404) {
          alerts.basicAlert('Error', 'Usuario no encontrado', 'error');
        } else if (err.status === 401) {
          alerts.basicAlert('Error', 'Contraseña incorrecta', 'error');
        } else {
          alerts.basicAlert('Error', 'Error al iniciar sesión', 'error');
        }
        this.loading = false;
      }
    );
  }

  // Stubs para que el template compile sin errores
  CambiarClave(): void {
    this.verLogin    = false;
    this.cambiarClave = true;
    this.nuevaClave  = false;
  }

  CambiarContrasenia(): void {
    alerts.basicAlert('Info', 'Función de recuperar aún no implementada', 'info');
  }

  ActualizarContrasenia(): void {
    alerts.basicAlert('Info', 'Función de actualizar aún no implementada', 'info');
  }

  invalidField(field: string): boolean {
    const control = this.f.get(field);
    return this.formSubmitted && !!control?.invalid;
  }
}
