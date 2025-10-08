import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { 
  Ievaluacion, 
  ICrearEvaluacionRequest, 
  IEvaluacionResponse
} from '../interface/ievaluacion';

@Injectable({
  providedIn: 'root'
})
export class GthEvaluacionService {

  constructor(private http: HttpClient) { }

  /**
   * Obtener todos las evaluaciones
   */
  MostrarEvaluaciones() {
      return this.http.get<Ievaluacion[]>(
        environment.urlbackend + 'api/GTHEvaluacion/Mostrar',
        {
          params: {
            tipo: '0'
          }
        }
      );
    }

  /**
  * Obtener todos las evaluaciones por empleado
  */
  MostrarEvaluacionesPorEmpleado(idEmpleado: string) {
    return this.http.get<Ievaluacion[]>(
      environment.urlbackend + 'api/GTHEvaluacion/Mostrar',
      {
        params: {
          tipo: '2',
          idEmpleado: idEmpleado
        }
      }
    );
  }

  /**
  * Obtener todos las evaluaciones por empleado
  */
  MostrarEvaluacionesPorEstado(estado: string) {
    return this.http.get<Ievaluacion[]>(
      environment.urlbackend + 'api/GTHEvaluacion/Mostrar',
      {
        params: {
          tipo: '4',
          estado: estado
        }
      }
    );
  }

  /**
  * Obtener todos las evaluaciones por empleado y año
  */
  MostrarEvaluacionesPorEmpleadoyAnio(idEmpleado: number, anio: number) {
    return this.http.get<Ievaluacion[]>(
      environment.urlbackend + 'api/GTHEvaluacion/Mostrar',
      {
        params: {
          tipo: '6',
          idEmpleado: idEmpleado.toString(), // importante convertir a string
          anio: anio.toString()
        }
      }
    );
  }

  /**
   * Crear evaluación GTH - FORMATO CORREGIDO
   */
  crearGthEvaluacion(evaluacion: Ievaluacion): Observable<any> {
    const requestData = {
      tipo: 1,
      idEmpleado: evaluacion.idEmpleado,
      idJefe: evaluacion.idJefe,
      anio: evaluacion.anio || new Date().getFullYear(),
      estado: evaluacion.estado || 'PENDIENTE',
      usuarioCreacion: evaluacion.usuarioCreacion || 'SISTEMA',
      fase: evaluacion.fase || 0
    };
    
    return this.http.post(`${environment.urlbackend}api/GTHEvaluacion/Gestionar`, requestData);
  }
  /**
  * Guardar o actualizar evaluacion GTH  la FASE Debe ser 1 o mayor a 0
  */
  GuardarGthEvaluacion(data:Ievaluacion){
        return this.http.post(environment.urlbackend +"api/GTHEvaluacion/Gestionar",data);
    }

  
  /**
   * Actualizar evaluación GTH
   * @param evaluacion - Datos de la evaluación a gestionar
   * @returns Observable con la respuesta del servidor
   */
  actualizarGthEvaluacion(evaluacion: Ievaluacion): Observable<any> {
    const requestData: any = {
      tipo: evaluacion.tipo || 2,
      idEvaluacion: evaluacion.idEvaluacion || 0,
      idEmpleado: evaluacion.idEmpleado,
      idJefe: evaluacion.idJefe || null,
      anio: evaluacion.anio || new Date().getFullYear(),
      estado: evaluacion.estado || 'PENDIENTE',
      fechaInicio: evaluacion.fechaInicio || null,
      fechaLimite: evaluacion.fechaLimite || null,
      fechaFinalizacion: evaluacion.fechaFinalizacion || null,
      calificacionFinal: evaluacion.calificacionFinal || null,
      observaciones: evaluacion.observaciones || null,
      usuarioCreacion: evaluacion.usuarioCreacion || 'SISTEMA',
      fase: evaluacion.fase !== undefined ? evaluacion.fase : 0,
      retroalimentacion: evaluacion.retroalimentacion || null,
      planAccion: evaluacion.planAccion || null
    };

    console.log('Datos enviados para gestionar evaluación:', requestData);
    
    return this.http.post(`${environment.urlbackend}api/GTHEvaluacion/Gestionar`, requestData)
      .pipe(
        tap((response: any) => {
          console.log('Respuesta gestión evaluación:', response);
        }),
        catchError((error) => {
          console.error('Error al gestionar evaluación:', error);
          return throwError(() => error);
        })
      );
  }



  /**
     * Manejo de errores
     * @param error - Error HTTP
     * @returns Observable con el error
     */
    private handleError(error: HttpErrorResponse): Observable<never> {
      // console.error('❌ Error en el servicio de competencias:', error);
  
      let errorMessage = 'Ha ocurrido un error desconocido';
  
      if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Error del lado del servidor
        errorMessage = `Código: ${error.status}, Mensaje: ${
          error.error?.message || error.message
        }`;
      }
  
      return throwError(errorMessage);
    }
  

}
