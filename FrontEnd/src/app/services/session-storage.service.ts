import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  constructor() { }

  /**
   * Constantes para las llaves de sessionStorage
   */
  private readonly KEYS = {
    TOKEN: 'token',
    ID_GTH_EMPLEADO: 'idGthEmpleado'
  };

  /**
   * Obtiene un valor del sessionStorage
   * @param key - Llave del valor a obtener
   * @returns Valor del sessionStorage o null si no existe
   */
  getItem(key: string): string | null {
    try {
      return sessionStorage.getItem(key);
    } catch (error) {
      console.error('Error obteniendo item del sessionStorage:', error);
      return null;
    }
  }

  /**
   * Guarda un valor en sessionStorage
   * @param key - Llave del valor a guardar
   * @param value - Valor a guardar
   */
  setItem(key: string, value: string): void {
    try {
      sessionStorage.setItem(key, value);
    } catch (error) {
      console.error('Error guardando item en sessionStorage:', error);
    }
  }

  /**
   * Elimina un item del sessionStorage
   * @param key - Llave del item a eliminar
   */
  removeItem(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error('Error eliminando item del sessionStorage:', error);
    }
  }

  /**
   * Limpia completamente el sessionStorage
   */
  clear(): void {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error('Error limpiando sessionStorage:', error);
    }
  }

  /**
   * Obtiene el ID del empleado GTH desde sessionStorage
   * @returns ID del empleado GTH o null si no existe
   */
  getIdGthEmpleado(): number | null {
    const id = this.getItem(this.KEYS.ID_GTH_EMPLEADO);
    console.log('[SessionStorageService] Obteniendo ID:', id);
    return id ? parseInt(id, 10) : null;
  }

  /**
   * Guarda el ID del empleado GTH en sessionStorage
   * @param idEmpleado - ID del empleado GTH a guardar
   */
  setIdGthEmpleado(idEmpleado: number): void {
    console.log('[SessionStorageService] Guardando ID:', idEmpleado);
    this.setItem(this.KEYS.ID_GTH_EMPLEADO, idEmpleado.toString());
    const verificacion = this.getItem(this.KEYS.ID_GTH_EMPLEADO);
    console.log('[SessionStorageService] Verificación guardado:', verificacion);
  }

  /**
   * Elimina el ID del empleado GTH del sessionStorage
   */
  removeIdGthEmpleado(): void {
    this.removeItem(this.KEYS.ID_GTH_EMPLEADO);
  }
}
