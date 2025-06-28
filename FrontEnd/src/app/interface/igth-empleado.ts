export interface iGTHEmpleado {
  tipo: number;
  idEmpleado: number;
  idPerfil?: number;
  idCelula?: number;
  cedula: string;
  nombre: string;
  apellido: string;
  fechaNacimiento?: string;
  direccion: string;
  telefono: string;
  correo: string;
  correoCorporativo: string;
  fechaContratacion?: string;
  estadoCivil: string;
  sexo: string;
  fotoPerfilUrl: string;
  estadoEmpleado: string;
  empTipo?: number;
  actPassword?: boolean;
  password: string;
  sueldo?: number;
}
