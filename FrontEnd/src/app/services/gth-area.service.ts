import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IgthArea, } from '../interface/igth-area';

import { map, tap, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GthAreaService {

  private readonly baseUrl = environment.urlbackend;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  /**
  * Obtener todos las celulas
  *  Devuelve la lista de células según los filtros proporcionados.
  *  1 = IdCelula, 2 = Nombre. 0 = Todos.
  */
    MostrarCelulas() {
     return this.http.get<IgthArea[]>(
    environment.urlbackend + 'api/GTHCelula/Mostrar',
    {
      params: {
        tipo: '0'
      }
    }
     );
   }

  /**
     * Gestiona una célula (crear, actualizar, eliminar)
     * @param tipo - 0=Insertar, 1=Editar, 2=Eliminar
     * @param celula - Datos de la célula
     * @returns Observable con la respuesta del servidor
     */
   gestionarCelula(tipo: number, celula: IgthArea): Observable<any> {
  const url = `${this.baseUrl}api/GTHCelula/Gestionar`;
  
  const payload = {
    tipo: tipo,
    ...celula
  };    
  
  console.log('📤 Payload enviado:', payload);
  
  return this.http.post(url, payload, this.httpOptions)
    .pipe(
      tap((response: any) => {
        console.log('📥 Respuesta completa del backend:', response);
        console.log('📥 Estructura:', {
          valores: response?.$values,
          primerValor: response?.$values?.[0],
          valor1: response?.$values?.[0]?.valor1,
          valor2: response?.$values?.[0]?.valor2
        });
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

}
