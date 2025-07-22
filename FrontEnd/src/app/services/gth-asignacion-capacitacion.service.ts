import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

export interface EmpleadoInfo {
  idEmpleado: number;
  cedula: string;
  nombre: string;
  apellido: string;
  nombreCompleto: string;
  correo: string;
  correoCorporativo: string;
  telefono: string;
  cargoActual: string;
  area: string;
  estadoEmpleado: string;
}

export interface CapacitacionInfo {
  idCapacitacion: number;
  nombre: string;
  titulo: string;
  categoria: string;
  descripcion: string;
  estado: string;
  fechaInicio?: Date;
  fechaFin?: Date;
  duracion?: number;
  costo?: number;
  modalidad: string;
  observaciones: string;
}

export interface GTHAsignacionCapacitacionDetalladaModel {
  idAsignacion: number;
  idCapacitacion: number;
  idEmpleado: number;
  cedulaEmpleado?: string;
  fecha?: Date;
  progreso?: number;
  empleado: EmpleadoInfo;
  capacitacion: CapacitacionInfo;
}

@Injectable({
  providedIn: 'root'
})
export class GthAsignacionCapacitacionService {
  constructor(private http: HttpClient) { }

  mostrarAsignacionesEnCurso(tipo: number = 0, idCapacitacion?: number, idEmpleado?: number, cedulaEmpleado?: string): Observable<GTHAsignacionCapacitacionDetalladaModel[]> {
    let params = `?tipo=${tipo}`;
    if (idCapacitacion) params += `&idCapacitacion=${idCapacitacion}`;
    if (idEmpleado) params += `&idEmpleado=${idEmpleado}`;
    if (cedulaEmpleado) params += `&cedulaEmpleado=${cedulaEmpleado}`;

    return this.http.get<any>(environment.urlbackend + 'api/GTHAsignacionCapacitacion/MostrarDetalladaEnCurso' + params)
      .pipe(
        tap((response: any) => {
          console.log('Asignaciones en curso obtenidas:', response);
        }),
        map((response: any) => {
          const datos = response.$values || response || [];
          return datos;
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
