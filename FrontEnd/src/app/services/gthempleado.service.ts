import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import { map, tap, catchError } from 'rxjs/operators';
import { iGTHEmpleado } from '../interface/igth-empleado';

@Injectable({
  providedIn: 'root'
})
export class GthEmpleadoService {
 
  constructor(private http: HttpClient) { }
 
  /**
   * Obtener todos los empleados GTH
   */
  Mostrar(){
    return this.http.get(environment.urlbackend + "api/GTHEmpleado/Mostrar");
  }

  /**
   * Guardar o actualizar empleado GTH
   */
  GuardarGthEmpleado(data:iGTHEmpleado){
      return this.http.post(environment.urlbackend +"api/GTHEmpleado/Gestionar",data);
  }
 
}