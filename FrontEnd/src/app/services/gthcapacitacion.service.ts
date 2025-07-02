import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import { map, tap, catchError } from 'rxjs/operators';
import { iGTHCapacitacion } from '../interface/ight-capacitacion';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GthCapacitacionService {
 
  constructor(private http: HttpClient) { }
 
  GuardarGthCapacitacion(data:iGTHCapacitacion){
      return this.http.post(environment.urlbackend +"api/GTHCapacitacion/Gestionar",data);
  }

  MostrarCapacitaciones(tipo: number = 0, idCapacitacion?: number, idEntidadCap?: number, estado?: string, fechaInicio?: string, fechaFin?: string): Observable<any> {
    let params = `?tipo=${tipo}`;
    
    if (idCapacitacion) params += `&idCapacitacion=${idCapacitacion}`;
    if (idEntidadCap) params += `&idEntidadCap=${idEntidadCap}`;
    if (estado) params += `&estado=${estado}`;
    if (fechaInicio) params += `&fechaInicio=${fechaInicio}`;
    if (fechaFin) params += `&fechaFin=${fechaFin}`;

    return this.http.get(environment.urlbackend + "api/GTHCapacitacion/Mostrar" + params);
  }
 
}
