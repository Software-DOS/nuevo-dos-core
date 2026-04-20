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
  certificadoUrl?: string; // Nueva propiedad para el certificado
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
  certificadoUrl?: string; // Nueva propiedad para el certificado
}

export interface GTHSubirCertificadoResponse {
  success: boolean;
  mensaje: string;
  certificadoUrl: string;
  nombreArchivo: string;
  tamanoArchivo: number;
}

export interface GTHSubirAcuerdoResponse {
  success: boolean;
  mensaje: string;
  nombreArchivo: string;
  tamanoArchivo: number;
  fechaSubida: Date;
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
    let params = `?tipo=2`; // Filtrar por idEmpleado (más eficiente que obtener todas y filtrar)
    if (idEmpleado) params += `&idEmpleado=${idEmpleado}`;
    if (cedulaEmpleado) params += `&cedulaEmpleado=${cedulaEmpleado}`;

    return this.http.get<any>(environment.urlbackend + 'api/GTHAsignacionCapacitacion/MostrarDetalladaEnCurso' + params)
      .pipe(
        tap((response: any) => {
          console.log('Asignaciones del empleado obtenidas para filtrar completadas:', response);
        }),
        map((response: any) => {
          const datos = response.$values || response || [];
          // Filtrar solo las que tienen progreso >= 100
          const completadas = datos.filter((asignacion: any) => 
            asignacion.progreso !== null && asignacion.progreso !== undefined && asignacion.progreso >= 100
          );
          console.log('Capacitaciones completadas filtradas del empleado:', completadas);
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

  /**
   * Actualiza el progreso de una asignación de capacitación
   * Tipo 1 = Editar
   */
  actualizarProgresoCapacitacion(asignacion: GTHAsignacionCapacitacionModel): Observable<any> {
    // Asegurar que el tipo sea 1 para editar
    asignacion.tipo = 1;
    
    return this.http.post(environment.urlbackend + "api/GTHAsignacionCapacitacion/Gestionar", asignacion)
      .pipe(
        tap((response: any) => {
          console.log('Progreso de capacitación actualizado:', response);
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Sube un certificado PDF para una asignación de capacitación específica.
   * Sigue el mismo patrón que subir-foto-perfil del empleado.
   */
  subirCertificado(idEmpleado: number, idCapacitacion: number, archivo: File): Observable<GTHSubirCertificadoResponse> {
    const formData = new FormData();
    formData.append('archivo', archivo);

    return this.http.post<GTHSubirCertificadoResponse>(
      environment.urlbackend + `api/GTHAsignacionCapacitacion/subir-certificado/${idEmpleado}/${idCapacitacion}`,
      formData
    ).pipe(
      tap((response: GTHSubirCertificadoResponse) => {
        console.log('Certificado subido exitosamente:', response);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Descarga el acuerdo plantilla para capacitaciones
   */
  descargarAcuerdo(): Observable<Blob> {
    return this.http.get(
      environment.urlbackend + 'api/GTHAsignacionCapacitacion/descargar-acuerdo',
      { responseType: 'blob' }
    ).pipe(
      tap(() => {
        console.log('Acuerdo descargado exitosamente');
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Sube el acuerdo firmado por el empleado para una capacitación creada con título específico
   */
   subirAcuerdoCapacitacion(idEmpleado: number, tituloCapacitacion: string, archivo: File): Observable<GTHSubirAcuerdoResponse> {
    const formData = new FormData();
    formData.append('archivo', archivo);

    // Codificar el título para la URL
    const tituloEncoded = encodeURIComponent(tituloCapacitacion);

    return this.http.post<GTHSubirAcuerdoResponse>(
      environment.urlbackend + `api/GTHAsignacionCapacitacion/subir-acuerdo-capacitacion/${idEmpleado}/${tituloEncoded}`,
      formData
    ).pipe(
      tap((response: GTHSubirAcuerdoResponse) => {
        console.log('Acuerdo de capacitación subido exitosamente:', response);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Sube el acuerdo firmado por el empleado para una solicitud de capacitación
   */
  subirAcuerdoSolicitud(idEmpleado: number, archivo: File): Observable<GTHSubirAcuerdoResponse> {
    const formData = new FormData();
    formData.append('archivo', archivo);

    return this.http.post<GTHSubirAcuerdoResponse>(
      environment.urlbackend + `api/GTHAsignacionCapacitacion/subir-acuerdo-solicitud/${idEmpleado}`,
      formData
    ).pipe(
      tap((response: GTHSubirAcuerdoResponse) => {
        console.log('Acuerdo de solicitud subido exitosamente:', response);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Sube el acuerdo firmado por el empleado para una capacitación específica
   */
  subirAcuerdo(idEmpleado: number, idCapacitacion: number, archivo: File): Observable<GTHSubirAcuerdoResponse> {
    const formData = new FormData();
    formData.append('archivo', archivo);

    return this.http.post<GTHSubirAcuerdoResponse>(
      environment.urlbackend + `api/GTHAsignacionCapacitacion/subir-acuerdo/${idEmpleado}/${idCapacitacion}`,
      formData
    ).pipe(
      tap((response: GTHSubirAcuerdoResponse) => {
        console.log('Acuerdo subido exitosamente:', response);
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
