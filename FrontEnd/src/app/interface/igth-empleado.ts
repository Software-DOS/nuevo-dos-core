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
  
  // Información Personal
  tipoSangre: string;
  etnia: string;
  paisNacimiento: string;
  provinciaNacimiento: string;
  ciudadNacimiento: string;
  nivelEstudio: string;
  cargasFamiliares?: number;
  documentoIdentidad: string;
  
  // Contacto de Emergencia
  nombreEmergencia: string;
  relacionEmergencia: string;
  telefonoEmergencia: string;
  
  // Información Conyugal
  nombreConyuge: string;
  fechaMatrimonio: string;
  discapacidadConyuge?: boolean;
  documentosConyuge: string;
  
  // Información Laboral
  cargoActual: string;
  area: string;
  subArea: string;
  empresa: string;
  jefeDirecto: string;
  tipoContrato: string;
  ubicacion: string;
}
