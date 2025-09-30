import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, tap, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { 
  IGTHCompetenciaViewModel, 
  IGTHNivelCompetenciaViewModel, 
  IGTHAsignacionCompetenciaViewModel
} from '../interface/ight-competencia';

@Injectable({
  providedIn: 'root'
})
export class GthCompetenciaService {
  
  private readonly baseUrl = environment.urlbackend;
  
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todas las competencias según los filtros proporcionados
   * @param tipo - Tipo de búsqueda: 0=Todas, 1=Por ID, 2=Por Estado, 3=Por Nombre
   * @param idCompetencia - ID específico de competencia (opcional)
   * @param estado - Estado de la competencia (opcional)
   * @param nombreCompetencia - Nombre de la competencia (opcional)
   * @returns Observable con la lista de competencias
   */
  mostrarCompetencias(
    tipo: number = 0,
    idCompetencia?: number,
    estado?: string,
    nombreCompetencia?: string
  ): Observable<any> {
    let url = `${this.baseUrl}api/GTHCompetencia/Mostrar?tipo=${tipo}`;
    
    if (idCompetencia !== undefined) {
      url += `&idCompetencia=${idCompetencia}`;
    }
    if (estado) {
      url += `&estado=${estado}`;
    }
    if (nombreCompetencia) {
      url += `&nombreCompetencia=${encodeURIComponent(nombreCompetencia)}`;
    }

    return this.http.get<any>(url)
      .pipe(
        tap((response: any) => {
          // console.log('🎯 Competencias obtenidas del backend:', response);
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Obtiene todas las competencias activas
   * @returns Observable con la lista de competencias activas
   */
  obtenerCompetenciasActivas(): Observable<any> {
    const url = `${this.baseUrl}api/GTHCompetencia/activas`;
    
    return this.http.get<any>(url)
      .pipe(
        tap((response: any) => {
          // console.log('🎯 Respuesta cruda de competencias activas:', response);
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Obtiene una competencia específica por su ID
   * @param id - ID de la competencia
   * @returns Observable con la competencia específica
   */
  obtenerCompetenciaPorId(id: number): Observable<IGTHCompetenciaViewModel> {
    const url = `${this.baseUrl}api/GTHCompetencia/${id}`;
    
    return this.http.get<IGTHCompetenciaViewModel>(url)
      .pipe(
        tap((response: any) => {
          // console.log('🎯 Competencia obtenida por ID:', response);
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Obtiene las primeras 5 competencias activas para la hoja de ruta
   * @returns Observable con las primeras 5 competencias
   */
  obtenerPrimeras5Competencias(): Observable<IGTHCompetenciaViewModel[]> {
    return this.obtenerCompetenciasActivas()
      .pipe(
        map((response: any) => {
          // console.log('🔍 Respuesta cruda del backend:', response);
          
          // La respuesta viene encapsulada, necesitamos extraer el array
          let competencias: IGTHCompetenciaViewModel[] = [];
          
          if (response && response.$values) {
            // Si la respuesta tiene $values, usar esa propiedad
            competencias = response.$values;
          } else if (Array.isArray(response)) {
            // Si la respuesta es directamente un array
            competencias = response;
          } else {
            console.warn('⚠️ Formato de respuesta inesperado:', response);
            competencias = [];
          }
          
          // console.log('📋 Competencias extraídas:', competencias);
          
          // Retorna solo las primeras 5 competencias
          const primeras5 = competencias.slice(0, 5);
          // console.log('🎯 Primeras 5 competencias seleccionadas:', primeras5);
          
          return primeras5;
        }),
        tap((competencias: IGTHCompetenciaViewModel[]) => {
          // console.log('🎯 Primeras 5 competencias para hoja de ruta:', competencias);
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Gestiona una competencia (crear, actualizar, eliminar)
   * @param competencia - Datos de la competencia
   * @returns Observable con la respuesta del servidor
   */
  gestionarCompetencia(competencia: IGTHCompetenciaViewModel): Observable<any> {
    const url = `${this.baseUrl}api/GTHCompetencia/Gestionar`;
    
    return this.http.post(url, competencia, this.httpOptions)
      .pipe(
        tap((response: any) => {
          // console.log('🎯 Respuesta gestión competencia:', response);
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
      errorMessage = `Código: ${error.status}, Mensaje: ${error.error?.message || error.message}`;
    }
    
    return throwError(errorMessage);
  }


  /* ===============================================================================================
                               APIs de Nivel Competencias
  =================================================================================================*/

  /**
   * Gestiona una Asignación de competencia (crear, actualizar, eliminar)
   * @param nivelCompetencia - Datos de la Asignacion competencia
   * @returns Observable con la respuesta del servidor
   */
  gestionarNivelCompetencia(nivelCompetencia: IGTHNivelCompetenciaViewModel): Observable<any> {
    const url = `${this.baseUrl}api/GTHNivelCompetencia/Gestionar`;
    
    return this.http.post(url, nivelCompetencia, this.httpOptions)
      .pipe(
        tap((response: any) => {
          // console.log('🎯 Respuesta gestión Nivel competencia:', response);
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Obtiene todos los niveles de las competencias según los filtros proporcionados
   * @param tipo - Tipo de búsqueda: 0=Todas, 1=Por ID, 2=Por Estado, 3=Por Nombre  
   * @param idNivel - ID específico del nivel de competencia (opcional)
   * @param estado - Estado de la competencia (opcional)
   * @param idCompetencia - ID específico de competencia (opcional)
   * @returns Observable con la lista de competencias
   */
  mostrarNivelCompetencias(
    tipo: number = 0,
    idNivel?: number,
    idCompetencia?: number,
    estado?: string
  ): Observable<any> {
    let url = `${this.baseUrl}api/GTHNivelCompetencia/Mostrar?tipo=${tipo}`;
    
    if (idCompetencia !== undefined) {
      url += `&idCompetencia=${idCompetencia}`;
    }
    if (estado) {
      url += `&estado=${estado}`;
    }
    if (idNivel !== undefined) {
      url += `&idNivel=${idNivel}`;
    }

    return this.http.get<any>(url)
      .pipe(
        tap((response: any) => {
          // console.log('🎯 Competencias obtenidas del backend:', response);
        }),
        catchError(this.handleError)
      );
  }

  /* ===============================================================================================
                               APIs de Asignacion Competencias
  =================================================================================================*/

  /**
   * Gestiona una Asigancion_competencia (crear, actualizar, eliminar)
   * @param Asig_competencia - Datos de la competencia
   * @returns Observable con la respuesta del servidor
   */
  gestionarAsignacionCompetencia(Asig_competencia: IGTHAsignacionCompetenciaViewModel): Observable<any> {
    const url = `${this.baseUrl}api/GTHAsignacionCompetencia/Gestionar`;
    
    return this.http.post(url, Asig_competencia, this.httpOptions)
      .pipe(
        tap((response: any) => {
          // console.log('🎯 Respuesta gestión competencia:', response);
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Obtiene una competencia específica por su ID
   * @param id - ID de la evaluacion
   * @returns Observable con la competencia específica
   */
  obtenerAsignacionCompetenciaPorIdEvaluacion(id: number): Observable<IGTHAsignacionCompetenciaViewModel> {
    const url = `${this.baseUrl}api/GTHAsignacionCompetencia/evaluacion/${id}`;
    
    return this.http.get<IGTHAsignacionCompetenciaViewModel>(url)
      .pipe(
        tap((response: any) => {
          // console.log('🎯 Competencia obtenida por ID:', response);
        }),
        catchError(this.handleError)
      );
  }
  
}
