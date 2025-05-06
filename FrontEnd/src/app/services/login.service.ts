import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ilogin } from '../interface/ilogin';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment'; 
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }
  
  private readonly llaveToken ='token';
  guardarToken():string{
    //console.log("valorToken:",this.llaveToken);
    var dataToken =JSON.parse(atob(this.llaveToken.split('.')[1]));
    //console.log("dataToken:",dataToken);
    return dataToken['email'];
  }
  
  login(data:Ilogin){
    //console.log("Retornamos la data"+ JSON.stringify(data));
    //return "Retornamos la data"+ JSON.stringify(data);
    //console.log("environment.urlbackend: ",environment.urlbackend);
    return this.http.get(environment.urlbackend +"api/Login/Login?email=" + data.email +"&password="+data.password).pipe(
      map((resp:any)=>{
        sessionStorage.setItem('token',resp.token);
      })
    );
  }

  ActualizarClaveEmpleado(Correo:string,Titulo:string,TipoDocumento:string,Clave:string,Tipo:number){
    return this.http.get(environment.urlbackend + "api/EnviarNotificacion/ActualizarClaveEmpleado?Correo=" + Correo + "&Titulo=" + Titulo +"&TipoDocumento=" + TipoDocumento +"&Clave=" + Clave +"&Tipo=" + Tipo +"");
  }

}
