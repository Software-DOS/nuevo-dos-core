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
 
  GuardarGthEmpleado(data:iGTHEmpleado){
      return this.http.post(environment.urlbackend +"api/GTHEmpleado/Gestionar",data);
  }
 
}