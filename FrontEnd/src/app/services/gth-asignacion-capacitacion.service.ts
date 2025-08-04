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

export interface GTHAsignacionCapacitacionModel {
  tipo: number;
  idCapacitacion: number;
  idEmpleado: number;
  cedulaEmpleado?: string;
  fecha?: Date;
  progreso?: number;
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

  /**
   * Obtiene las capacitaciones completadas (progreso >= 100%) de un empleado
   */
  mostrarCapacitacionesCompletadas(idEmpleado?: number, cedulaEmpleado?: string): Observable<GTHAsignacionCapacitacionDetalladaModel[]> {
    let params = `?tipo=0`; // Obtener todas las asignaciones
    if (idEmpleado) params += `&idEmpleado=${idEmpleado}`;
    if (cedulaEmpleado) params += `&cedulaEmpleado=${cedulaEmpleado}`;

    return this.http.get<any>(environment.urlbackend + 'api/GTHAsignacionCapacitacion/MostrarDetalladaEnCurso' + params)
      .pipe(
        tap((response: any) => {
          console.log('Todas las asignaciones obtenidas para filtrar completadas:', response);
        }),
        map((response: any) => {
          const datos = response.$values || response || [];
          // Filtrar solo las que tienen progreso >= 100
          const completadas = datos.filter((asignacion: any) => 
            asignacion.progreso !== null && asignacion.progreso !== undefined && asignacion.progreso >= 100
          );
          console.log('Capacitaciones completadas filtradas:', completadas);
          return completadas;
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Crea una nueva asignación de capacitación
   * Tipo 0 = Insertar, 1 = Editar, 2 = Eliminar
   */
  crearAsignacionCapacitacion(asignacion: GTHAsignacionCapacitacionModel): Observable<any> {
    return this.http.post(environment.urlbackend + "api/GTHAsignacionCapacitacion/Gestionar", asignacion)
      .pipe(
        tap((response: any) => {
          console.log('Asignación de capacitación creada:', response);
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
