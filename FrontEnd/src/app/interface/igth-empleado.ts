export interface iGTHEmpleado {
  tipo: number;
  idEmpleado: number;
  idPerfil?: number;
  idCelula?: string;
  cedula: string;
  nombre: string;
  apellido: string;
  fechaNacimiento?: Date;
  direccion: string;
  telefono: string;
  correo: string;
  correoCorporativo: string;
  fechaContratacion?: Date;
  estadoCivil: string;
  sexo: string;
  fotoPerfilUrl: string;
  estadoEmpleado: string;
  empTipo?: number;
  actPassword?: boolean;
  password: string;
  sueldo?: number;
}
