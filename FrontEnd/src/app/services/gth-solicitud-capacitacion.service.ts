import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

export interface GTHSolicitudCapacitacionModel {
  tipo: number;
  idCapacitacion: number;
  idEmpleado: number;
  cedulaEmpleado?: string; // Opcional, no se usará cuando tenemos idEmpleado
  justificacion: string;
  fechaSolicitud?: Date;
  respuesta?: string;
  fechaRespuesta?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class GthSolicitudCapacitacionService {

  constructor(private http: HttpClient) { }

  /**
   * Crea una nueva solicitud de capacitación.
   * Utiliza el SP que gestiona solicitudes con la cédula del empleado.
   */
  crearSolicitudCapacitacion(solicitud: GTHSolicitudCapacitacionModel): Observable<any> {
    return this.http.post(environment.urlbackend + "api/GTHSolicitudCapacitacion/Gestionar", solicitud)
      .pipe(
        tap((response: any) => {
          console.log('Solicitud de capacitación creada:', response);
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Obtiene las solicitudes de capacitación según los filtros.
   */
  mostrarSolicitudesCapacitacion(tipo: number = 0, idCapacitacion?: number, idEmpleado?: number, cedulaEmpleado?: string): Observable<any> {
    let params = `?tipo=${tipo}`;
    
    if (idCapacitacion) params += `&idCapacitacion=${idCapacitacion}`;
    if (idEmpleado) params += `&idEmpleado=${idEmpleado}`;
    if (cedulaEmpleado) params += `&cedulaEmpleado=${cedulaEmpleado}`;

    return this.http.get(environment.urlbackend + "api/GTHSolicitudCapacitacion/Mostrar" + params)
      .pipe(
        tap((response: any) => {
          console.log('Solicitudes de capacitación obtenidas:', response);
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
