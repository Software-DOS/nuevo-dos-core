export interface iGTHCapacitacion {
  tipo: number;
  idCapacitacion: number;
  idEntidadCap?: number;
  nombre: string;
  titulo: string;
  categoria: string;
  descripcion: string;
  estado: string;
  fechaInicio?: string;
  fechaFin?: string;
  fechaExpiracion?: string;
  urlVerificacion: string;
  archivosAdjuntos: string;
  observaciones: string;
  duracion?: number;
  costo?: number;
  modalidad: string;
}