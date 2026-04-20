import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, tap, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

import { Ievaluacion } from '../interface/ievaluacion';
import { IgthObjetivo } from '../interface/igth-objetivo';
import { IgthCelula } from '../interface/igth-departamento';

@Injectable({
  providedIn: 'root',
})
export class GthObjetivoService {
  private readonly baseUrl = environment.urlbackend;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  
  // gestionarObjetivo(Objetivo: IgthObjetivo): Observable<any> {
  //   const url = `${this.baseUrl}api/GTHObjetivo/Gestionar`;
    
  //   return this.http.post(url, Objetivo, this.httpOptions)
  //     .pipe(
  //       tap((response: any) => {
  //         // console.log('🎯 Respuesta gestión objwtivo:', response);
  //       }),
  //       catchError(this.handleError)
  //     );
  // }

  /**
   * Gestiona una Asigancion_competencia (crear, actualizar, eliminar)
   * @param Objetivo - Datos de la competencia
   * @returns Observable con la respuesta del servidor
   */
  gestionarObjetivo(Objetivo: IgthObjetivo): Observable<any> {
    const url = `${this.baseUrl}api/GTHObjetivo/Gestionar?tipo=${Objetivo.tipo}`;
    return this.http.post(url, Objetivo, this.httpOptions);
  }



  /**
   * Obtener todos los objetivos
   */
  MostrarObjetivos() {
    return this.http.get<Ievaluacion[]>(
      environment.urlbackend + 'api/GTHObjetivo/Mostrar',
      {
        params: {
          tipo: '0',
        },
      }
    );
  }

  /**
   * Obtiene los objetivos específicos por id evaluacion
   * @param id - ID de la evaluacion
   * @returns Observable con la competencia específica
   */
  obtenerObjetivosPorIdEvaluacion(id: number): Observable<IgthObjetivo> {
    const url = `${this.baseUrl}api/GTHObjetivo/evaluacion/${id}`;

    return this.http.get<IgthObjetivo>(url).pipe(
      tap((response: any) => {
        // console.log('🎯 Objetivos obtenidos por ID:', response);
      }),
      catchError(this.handleError)
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




  /*==============================================================================
            Servicios para obtener y guaradar los objetivos de area
  ===============================================================================*/
  
  /**
   * Gestiona una célula (crear, actualizar, eliminar)
   * @param tipo - 0=Insertar, 1=Editar, 2=Eliminar
   * @param celula - Datos de la célula
   * @returns Observable con la respuesta del servidor
   */
  gestionarCelula(tipo: number, celula: IgthCelula): Observable<any> {
    const url = `${this.baseUrl}api/GTHCelula/Gestionar`;
    
    // Preparar el payload con el tipo
    const payload = {
      tipo: tipo,
      ...celula
    };    
    
    return this.http.post(url, payload, this.httpOptions)
      .pipe(
        tap((response: any) => {
          // console.log('🎯 Respuesta gestión célula:', response);
        }),
        catchError(this.handleError)
      );
  }
  
  /**
   * FUNCIÓN PARA ACTUALIZAR OBJETIVO EN CÉLULA
   * @param idCelula - ID de la célula a actualizar
   * @param objetivo - Texto del objetivo
   * @returns Observable con la respuesta
   */
  actualizarObjetivoCelula(idCelula: number, objetivo: string): Observable<any> {
    const datosCelula: IgthCelula = {
      idCelula: idCelula,
      objetivo: objetivo
      // Solo enviamos los campos que necesitamos actualizar
      // Los demás se mantienen con sus valores actuales
    };   
    
    return this.gestionarCelula(1, datosCelula); // tipo = 1 para editar
  }
  


/**
 * Obtiene el objetivo de la celula
 * @param tipo - Tipo de consulta (1 para buscar por ID)
 * @param idCelula - ID de la celula
 * @returns Observable con los datos de la célula
 */
obtenerObjetivosPorIdCelula(tipo: number, idCelula: number): Observable<IgthCelula> {
  const url = `${this.baseUrl}api/GTHCelula/Mostrar?tipo=${tipo}&idCelula=${idCelula}`;

  return this.http.get<IgthCelula>(url)
    .pipe(
      tap((response: any) => {
        // console.log('🎯 Objetivo obtenido por ID_Celula:', response);
      }),
      catchError(this.handleError)
    );
}
  
  


}
