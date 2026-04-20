import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, tap, catchError } from 'rxjs/operators';
import { iGTHCapacitacion } from '../interface/ight-capacitacion';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GthCapacitacionService {
 
  constructor(private http: HttpClient) { }
 
  GuardarGthCapacitacion(data: iGTHCapacitacion): Observable<any> {
    return this.http.post(environment.urlbackend + "api/GTHCapacitacion/Gestionar", data)
      .pipe(
        tap((response: any) => {
          console.log('Respuesta del servidor:', response);
        }),
        catchError(this.handleError)
      );
  }

  MostrarCapacitaciones(tipo: number = 0, idCapacitacion?: number, idEntidadCap?: number, estado?: string, fechaInicio?: string, fechaFin?: string): Observable<any> {
    let params = `?tipo=${tipo}`;
    
    if (idCapacitacion) params += `&idCapacitacion=${idCapacitacion}`;
    if (idEntidadCap) params += `&idEntidadCap=${idEntidadCap}`;
    if (estado) params += `&estado=${estado}`;
    if (fechaInicio) params += `&fechaInicio=${fechaInicio}`;
    if (fechaFin) params += `&fechaFin=${fechaFin}`;

    return this.http.get(environment.urlbackend + "api/GTHCapacitacion/Mostrar" + params)
      .pipe(
        tap((response: any) => {
          console.log('Capacitaciones obtenidas:', response);
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Crea una nueva capacitación y devuelve el ID generado automáticamente.
   * Utiliza el endpoint específico para inserción que retorna solo el ID.
   */
  crearCapacitacion(capacitacion: iGTHCapacitacion): Observable<number> {
    return this.http.post<number>(environment.urlbackend + "api/GTHCapacitacion/crear", capacitacion)
      .pipe(
        tap((idGenerado: number) => {
          console.log('ID de capacitación generado:', idGenerado);
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Verifica si una capacitación tiene registros relacionados (solicitudes o asignaciones).
   * Útil para mostrar advertencias antes de eliminar.
   */
  verificarDependencias(idCapacitacion: number): Observable<any> {
    return this.http.get(environment.urlbackend + `api/GTHCapacitacion/verificar-dependencias/${idCapacitacion}`)
      .pipe(
        tap((response: any) => {
          console.log('Dependencias verificadas:', response);
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Realiza eliminación inteligente de una capacitación:
   * - Si no tiene registros relacionados: elimina físicamente
   * - Si tiene registros relacionados: cambia estado a 'inactiva'
   */
  eliminarInteligente(idCapacitacion: number): Observable<any> {
    return this.http.delete(environment.urlbackend + `api/GTHCapacitacion/eliminar-inteligente/${idCapacitacion}`)
      .pipe(
        tap((response: any) => {
          console.log('Eliminación inteligente completada:', response);
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
