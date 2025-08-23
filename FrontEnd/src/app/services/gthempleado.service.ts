import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import { map, tap, catchError } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { iGTHEmpleado } from '../interface/igth-empleado';
import { Idependiente} from '../interface/idependiente';

@Injectable({
  providedIn: 'root'
})
export class GthEmpleadoService {

  // Subject para comunicar cambios de foto de perfil entre componentes
  private fotoPerfilCambiada = new Subject<{idEmpleado: number, nuevaUrl: string}>();
  public fotoPerfilCambiada$ = this.fotoPerfilCambiada.asObservable();
 
  constructor(private http: HttpClient) { }
 
  /**
   * Obtener todos los empleados GTH
   */
  Mostrar(){
    return this.http.get(environment.urlbackend + "api/GTHEmpleado/Mostrar");
  }

  /**
   * Obtener empleados GTH con parámetros específicos
   * @param tipo - Tipo de consulta (0 = Todos, 1 = Por ID/Cédula, 2 = Por Célula, 3 = Por Estado, 4 = Por Cédula exclusiva)
   * @param idEmpleado - ID del empleado específico
   * @param idCelula - ID de la célula
   * @param estadoEmpleado - Estado del empleado
   * @param cedulaEmpleado - Cédula del empleado
   */
  MostrarConParametros(tipo: number = 0, idEmpleado?: number, idCelula?: number, estadoEmpleado?: string, cedulaEmpleado?: string){
    let params = `?tipo=${tipo}`;
    if (idEmpleado) params += `&idEmpleado=${idEmpleado}`;
    if (idCelula) params += `&idCelula=${idCelula}`;
    if (estadoEmpleado) params += `&estadoEmpleado=${estadoEmpleado}`;
    if (cedulaEmpleado) params += `&cedulaEmpleado=${cedulaEmpleado}`;
    
    return this.http.get(environment.urlbackend + "api/GTHEmpleado/Mostrar" + params);
  }

  /**
   * Buscar empleado específicamente por cédula
   * @param cedula - Cédula del empleado a buscar
   */
  BuscarPorCedula(cedula: string) {
    console.log('Llamando a BuscarPorCedula con cédula:', cedula); //Comentar
    return this.MostrarConParametros(4, undefined, undefined, undefined, cedula);
  }


  /**
   * Guardar o actualizar empleado GTH
   */
  GuardarGthEmpleado(data:iGTHEmpleado){
      return this.http.post(environment.urlbackend +"api/GTHEmpleado/Gestionar",data);
  }

  /**
   * Gestionar empleado GTH (alias para GuardarGthEmpleado)
   */
  gestionarEmpleado(data:iGTHEmpleado){
      return this.GuardarGthEmpleado(data);
  }

  /**
   * Obtener ID del empleado GTH por cédula
   * @param cedula - Cédula del empleado a buscar
   * @returns Observable con el ID del empleado GTH
   */
  obtenerIdGthEmpleadoPorCedula(cedula: string){
    return this.http.get<{idEmpleado: number}>(
      environment.urlbackend + `api/GTHEmpleado/obtener-id-gth-empleado/${cedula}`
    );
  }

  /**
   * Obtener ID del empleado GTH por email
   * @param email - Email del empleado a buscar
   * @returns Observable con el ID del empleado GTH
   */
  obtenerIdGthEmpleadoPorEmail(email: string){
    return this.http.get<{idEmpleado: number}>(
      environment.urlbackend + `api/GTHEmpleado/obtener-id-gth-empleado-por-email/${email}`
    );
  }

  /**
   * Obtener cédula del empleado GTH por email
   * @param email - Email del empleado a buscar
   * @returns Observable con la cédula del empleado GTH
   */
  obtenerCedulaPorEmail(email: string){
    return this.http.get<{cedula: string, idEmpleado: number, nombre: string, apellido: string}>(
      environment.urlbackend + `api/GTHEmpleado/obtener-cedula-por-email/${email}`
    );
  }

  /**
   * Guarda el ID del empleado GTH en sessionStorage
   * @param idEmpleado - ID del empleado GTH a guardar
   */
  guardarIdGthEmpleadoEnSession(idEmpleado: number): void {
    console.log('[GthEmpleadoService] Guardando ID:', idEmpleado);
    sessionStorage.setItem('idGthEmpleado', idEmpleado.toString());
    const verificacion = sessionStorage.getItem('idGthEmpleado');
    console.log('[GthEmpleadoService] Verificación guardado:', verificacion);
  }

  /**
   * Obtiene el ID del empleado GTH desde sessionStorage
   * @returns ID del empleado GTH o null si no existe
   */
  obtenerIdGthEmpleadoDesdeSession(): number | null {
    const id = sessionStorage.getItem('idGthEmpleado');
    console.log('[GthEmpleadoService] Obteniendo ID:', id);
    return id ? parseInt(id, 10) : null;
  }

  /**
   * Limpia el ID del empleado GTH del sessionStorage
   */
  limpiarIdGthEmpleadoDeSession(): void {
    sessionStorage.removeItem('idGthEmpleado');
  }

  /**
   * Proceso completo: obtener ID por cédula y guardarlo en sessionStorage
   * @param cedula - Cédula del empleado
   * @returns Observable con el ID del empleado GTH
   */
  procesarYGuardarIdGthEmpleado(cedula: string) {
    return this.obtenerIdGthEmpleadoPorCedula(cedula).pipe(
      tap(response => {
        if (response && response.idEmpleado) {
          this.guardarIdGthEmpleadoEnSession(response.idEmpleado);
        }
      }),
      catchError(error => {
        console.error('Error al obtener ID de empleado GTH:', error);
        throw error;
      })
    );
  }

  /**
   * Proceso completo: obtener ID por email y guardarlo en sessionStorage
   * @param email - Email del empleado
   * @returns Observable con el ID del empleado GTH
   */
  procesarYGuardarIdGthEmpleadoPorEmail(email: string) {
    return this.obtenerIdGthEmpleadoPorEmail(email).pipe(
      tap(response => {
        if (response && response.idEmpleado) {
          this.guardarIdGthEmpleadoEnSession(response.idEmpleado);
        }
      }),
      catchError(error => {
        console.error('Error al obtener ID de empleado GTH por email:', error);
        throw error;
      })
    );
  }

  /**
   * Sube una foto de perfil para un empleado
   * @param idEmpleado - ID del empleado
   * @param archivo - Archivo de imagen a subir
   * @returns Observable con la respuesta del servidor
   */
  subirFotoPerfil(idEmpleado: number, archivo: File) {
    const formData = new FormData();
    formData.append('archivo', archivo);
    
    return this.http.post(
      environment.urlbackend + `api/GTHEmpleado/subir-foto-perfil/${idEmpleado}`, 
      formData
    ).pipe(
      tap((response: any) => {
        // Notificar a otros componentes que la foto ha cambiado con cache-busting
        if (response && response.fotoPerfilUrl) {
          const urlBase = this.construirUrlImagen(response.fotoPerfilUrl);
          const urlConCacheBusting = `${urlBase}?t=${Date.now()}`;
          this.fotoPerfilCambiada.next({
            idEmpleado: idEmpleado,
            nuevaUrl: urlConCacheBusting
          });
        }
      })
    );
  }

  /**
   * Obtiene la foto de perfil de un empleado
   * @param idEmpleado - ID del empleado
   * @returns Observable con la URL de la foto de perfil
   */
  obtenerFotoPerfil(idEmpleado: number) {
    return this.http.get(
      environment.urlbackend + `api/GTHEmpleado/obtener-foto-perfil/${idEmpleado}`
    );
  }

  /**
   * Elimina la foto de perfil de un empleado
   * @param idEmpleado - ID del empleado
   * @returns Observable con la confirmación de eliminación
   */
  eliminarFotoPerfil(idEmpleado: number) {
    return this.http.delete(
      environment.urlbackend + `api/GTHEmpleado/eliminar-foto-perfil/${idEmpleado}`
    );
  }

  /**
   * Construye la URL completa para mostrar una imagen
   * @param fotoPerfilUrl - URL relativa de la foto
   * @returns URL completa para mostrar la imagen
   */
  construirUrlImagen(fotoPerfilUrl: string): string {
    if (!fotoPerfilUrl) {
      return environment.urlbackend + 'img/usuarios/default-avatar.png';
    }
    
    // Si ya tiene el dominio, devolverla tal como está
    if (fotoPerfilUrl.startsWith('http')) {
      return fotoPerfilUrl;
    }
    
    // Si es una URL relativa, agregar el dominio del backend
    const urlLimpia = fotoPerfilUrl.startsWith('/') ? fotoPerfilUrl.substring(1) : fotoPerfilUrl;
    return environment.urlbackend + urlLimpia;
  }

  /**
   * Obtiene la foto de perfil del empleado logueado desde sessionStorage
   * @returns Observable con la URL de la foto de perfil del empleado actual
   */
  obtenerFotoPerfilEmpleadoActual() {
    const idEmpleado = this.obtenerIdGthEmpleadoDesdeSession();
    if (!idEmpleado) {
      return of({ fotoPerfilUrl: '/img/usuarios/default-avatar.png' });
    }
    
    return this.obtenerFotoPerfil(idEmpleado).pipe(
      catchError(error => {
        console.error('Error al obtener foto de perfil del empleado actual:', error);
        return of({ fotoPerfilUrl: '/img/usuarios/default-avatar.png' });
      })
    );
  }

  /**
   * Notifica manualmente que la foto de perfil de un empleado ha cambiado
   * @param idEmpleado - ID del empleado
   * @param nuevaUrl - Nueva URL de la foto
   */
  notificarCambioFotoPerfil(idEmpleado: number, nuevaUrl: string): void {
    this.fotoPerfilCambiada.next({
      idEmpleado: idEmpleado,
      nuevaUrl: nuevaUrl
    });
  }

  /**
   * Limpia archivos huérfanos de fotos de empleados (mantenimiento)
   * @returns Observable con el resultado de la limpieza
   */
  limpiarFotosHuerfanas() {
    return this.http.post(
      environment.urlbackend + 'api/GTHEmpleado/limpiar-fotos-huerfanas',
      {}
    );
  }
 
}