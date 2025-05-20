import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Imenu } from '../interface/imenu';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment'; 
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http: HttpClient) { }

  cargarMenu(IdEmpleado:string){
    return this.http.get(environment.urlbackend + "api/Menu/MostrarMenu?IdEmpleado=" + IdEmpleado);
  }

}
