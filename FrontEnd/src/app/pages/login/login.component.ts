import { Component, OnInit } from '@angular/core';
import { FormBuilder,Validator, Validators } from '@angular/forms';
import { functions } from 'src/app/helpers/functions';
import { Ilogin } from 'src/app/interface/ilogin';
import { LoginService } from 'src/app/services/login.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { alerts } from 'src/app/helpers/alerts';
import { subscribeOn } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  //Creamos grupo de controles
  //emailClave:['',[Validators.required,Validators.email]],
  public f = this.form.group({
      email:['',[Validators.required,Validators.email]],
      password:['',Validators.required]
  });



//variable que valida el envio del formulario
  formSubmitted=false;
  verLogin=true;
  cambiarClave=false;
  nuevaClave=false;
  loading = false;
  public ClaveTemporal:any="";
  public emailClave:string="";
  public clave1:string="";
  public clave2:string="";
  public generica: any = [];
  public carga: any = [];
  constructor(private form: FormBuilder,private loginService: LoginService,private router: Router) { }

  ngOnInit(): void {
  }

  //funcion login
  login(){

     this.formSubmitted=true;
      //console.log(this.f);
      if(this.f.invalid){
        return;
      }
      const data: Ilogin = {
        email:this.f.controls['email'].value,
        password:this.f.controls['password'].value
      }
      
      //console.log(this.loginService.login(data)); 
      this.loading=true;
      this.loginService.login(data).subscribe(

          (resp:any)=>{
             
              const valor = sessionStorage.getItem('token');
              if (typeof valor === 'string') {
                var IdEmpleado =JSON.parse(atob(valor.split('.')[1]));
                this.ClaveTemporal=IdEmpleado["ClaveTemporal"];
                if(this.ClaveTemporal==""){
                  this.router.navigateByUrl("/");  
                }
                else if (this.ClaveTemporal==this.f.controls['password'].value){
                  this.verLogin=false;
                  this.cambiarClave=false;
                  this.nuevaClave=true;
                }
                else{
                  alerts.basicAlert("Error","La clave temporal no es correcta..","error"); 
                }
                //console.log("IdEmpleado: ",IdEmpleado);
              }     
              this.loading=false;
          },
          (err)=>{
              //console.log("status",err.error.status);
              //console.log("title",err.error.title);
              if(err.error.status==404){
                alerts.basicAlert("Error","Invalid password","error");         
              }else{
                alerts.basicAlert("Error","Invalid email or password","error");
              }
              this.loading=false;
          }

      );
  }

  CambiarClave(){
    this.verLogin = false;
    this.cambiarClave = true;
    this.nuevaClave=false;
  }

  CambiarContrasenia(){
    if(this.emailClave==""){
      alerts.basicAlert(
        'Advertencia',
        'Debe ingresar el email',
        'warning'
      );
    }
    else{
    this.loading=true;
    this.loginService.ActualizarClaveEmpleado(this.emailClave, "Actualizar Contraseña","RESET USUARIO","",0).subscribe(
      (resp: any) => {
        this.carga = resp['$values'];
        this.generica = this.carga[0];
        let valor1;
        let valor2;
        valor1 = this.generica.valor1;
        valor2 = this.generica.valor2;
        if (valor1 == 1) {
          this.verLogin = true;
          this.cambiarClave = false;
          this.nuevaClave=false;
          this.loading=false;
          alerts.basicAlert('Excelente', valor2, 'success');
        }
        //console.log("this.carga: ",this.carga);
      },
      (err) => {
        console.log('err:', err);
      }
    );
    }
  }

  ActualizarContrasenia(){

    if(this.clave1!=this.clave2){
      alerts.basicAlert(
        'Advertencia',
        'La clave no son iguales..',
        'warning'
      );
    }
    else{
    this.loading=true;
    this.loginService.ActualizarClaveEmpleado(this.f.controls['email'].value, "Actualizar Contraseña","RESET USUARIO",this.clave2,1).subscribe(
      (resp: any) => {
        this.carga = resp['$values'];
        this.generica = this.carga[0];
        let valor1;
        let valor2;
        valor1 = this.generica.valor1;
        valor2 = this.generica.valor2;
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
        //console.log("this.carga: ",this.carga);
      },
      (err) => {
        console.log('err:', err);
      }
    );
    }

  }

  invalidField(field:string){

    return functions.invalidField(field,this.f,this.formSubmitted);
   
  }

}
