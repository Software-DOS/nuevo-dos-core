using Conexion.Entidad.Administracion;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Conexion.AccesoDatos.Repository.Administracion
{
    public class GTHEmpleadoRepository
    {
        private readonly string _connectionString;

        public GTHEmpleadoRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Conexion");
        }

        /// <summary>
        /// Ejecuta SP para insertar, actualizar o eliminar un empleado.
        /// </summary>
        public async Task<IEnumerable<Generica>> Gestionar(int tipo, GTHEmpleado empleado)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("SP_Gestionar_GTH_EMPLEADO", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));
            cmd.Parameters.Add(new SqlParameter("@ID_EMPLEADO", empleado.IdEmpleado));
            cmd.Parameters.Add(new SqlParameter("@ID_PERFIL", empleado.IdPerfil ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@ID_CELULA", empleado.IdCelula ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_CEDULA", empleado.Cedula ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_NOMBRE", empleado.Nombre ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_APELLIDO", empleado.Apellido ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_FECHANACIMIENTO", 
                string.IsNullOrEmpty(empleado.FechaNacimiento) ? (object)DBNull.Value : 
                DateTime.TryParse(empleado.FechaNacimiento, out DateTime fechaNac) ? fechaNac : (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_DIRECCION", empleado.Direccion ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_TELEFONO", empleado.Telefono ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_CORREO", empleado.Correo ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_CORREOCORPORATIVO", empleado.CorreoCorporativo ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_FECHACONTRATACION", 
                string.IsNullOrEmpty(empleado.FechaContratacion) ? (object)DBNull.Value : 
                DateTime.TryParse(empleado.FechaContratacion, out DateTime fechaCont) ? fechaCont : (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_ESTADOCIVIL", empleado.EstadoCivil ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_SEXO", empleado.Sexo ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_FOTOPERFILURL", empleado.FotoPerfilUrl ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_ESTADOEMPLEADO", empleado.EstadoEmpleado ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_TIPO", empleado.EmpTipo ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_ACT_PASSWORD", empleado.ActPassword ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_PASSWORD", empleado.Password ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_SUELDO", empleado.Sueldo ?? (object)DBNull.Value));
            
            // Nuevos parámetros añadidos
            cmd.Parameters.Add(new SqlParameter("@EMP_TIPOSANGRE", empleado.TipoSangre ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_ETNIA", empleado.Etnia ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_PAISNACIMIENTO", empleado.PaisNacimiento ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_PROVINCIA_NACIMIENTO", empleado.ProvinciaNacimiento ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_CIUDAD_NACIMIENTO", empleado.CiudadNacimiento ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_NIVELESTUDIO", empleado.NivelEstudio ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_CARGASFAMILIARES", empleado.CargasFamiliares ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_DOCUMENTOIDENTIDAD", empleado.DocumentoIdentidad ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_NOMBREEMERGENCIA", empleado.NombreEmergencia ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_RELACIONEMERGENCIA", empleado.RelacionEmergencia ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_TELEFONOEMERGENCIA", empleado.TelefonoEmergencia ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_NOMBRECONYUGE", empleado.NombreConyuge ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_FECHAMATRIMONIO", 
                string.IsNullOrEmpty(empleado.FechaMatrimonio) ? (object)DBNull.Value : 
                DateTime.TryParse(empleado.FechaMatrimonio, out DateTime fechaMat) ? fechaMat : (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_DISCAPACIDADCONYUGE", empleado.DiscapacidadConyuge ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_DOCUMENTOSCONYUGE", empleado.DocumentosConyuge ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_CARGOACTUAL", empleado.CargoActual ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_AREA", empleado.Area ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_SUBAREA", empleado.SubArea ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_EMPRESA", empleado.Empresa ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_JEFEDIRECTO", empleado.JefeDirecto ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_TIPOCONTRATO", empleado.TipoContrato ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_UBICACION", empleado.Ubicacion ?? (object)DBNull.Value));

            await sql.OpenAsync();
            var response = new List<Generica>();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                response.Add(new Generica
                {
                    valor1 = Convert.ToInt16(reader["Codigo"] ?? reader["CodigoEstado"]),
                    valor2 = reader[reader.GetName(0)].ToString()
                });
            }
            return response;
        }

        /// <summary>
        /// Ejecuta SP para mostrar empleados según filtros.
        /// 1 = IdEmpleado/Cédula, 2 = IdCelula, 3 = EstadoEmpleado, 4 = Cédula exclusiva, 0 = Todos.
        /// </summary>
        public async Task<IEnumerable<GTHEmpleado>> Mostrar(
            int tipo,
            int? idEmpleado = null,
            int? idCelula = null,
            string estadoEmpleado = null,
            string cedulaEmpleado = null)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("GTH_MostrarEmpleado", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@ID_Empleado", idEmpleado ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@ID_Celula", idCelula ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@Emp_EstadoEmpleado", estadoEmpleado ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@CedulaEmpleado", cedulaEmpleado ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));

            await sql.OpenAsync();
            var list = new List<GTHEmpleado>();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(new GTHEmpleado
                {
                    // Convierte Int32 a Int64 de forma segura
                    IdEmpleado = reader["ID_EMPLEADO"] != DBNull.Value
                                          ? Convert.ToInt64(reader["ID_EMPLEADO"])
                                          : 0L,
                    IdPerfil = reader["ID_PERFIL"] != DBNull.Value
                                          ? Convert.ToInt64(reader["ID_PERFIL"])
                                          : (long?)null,
                    IdCelula = reader["ID_CELULA"] != DBNull.Value
                                          ? Convert.ToInt64(reader["ID_CELULA"])
                                          : (long?)null,
                    Cedula = reader["EMP_CEDULA"]?.ToString(),
                    Nombre = reader["EMP_NOMBRE"]?.ToString(),
                    Apellido = reader["EMP_APELLIDO"]?.ToString(),
                    FechaNacimiento = reader["EMP_FECHANACIMIENTO"] != DBNull.Value ? 
                        Convert.ToDateTime(reader["EMP_FECHANACIMIENTO"]).ToString("yyyy-MM-dd") : null,
                    Direccion = reader["EMP_DIRECCION"]?.ToString(),
                    Telefono = reader["EMP_TELEFONO"]?.ToString(),
                    Correo = reader["EMP_CORREO"]?.ToString(),
                    CorreoCorporativo = reader["EMP_CORREOCORPORATIVO"]?.ToString(),
                    FechaContratacion = reader["EMP_FECHACONTRATACION"] != DBNull.Value ? 
                        Convert.ToDateTime(reader["EMP_FECHACONTRATACION"]).ToString("yyyy-MM-dd") : null,
                    EstadoCivil = reader["EMP_ESTADOCIVIL"]?.ToString(),
                    Sexo = reader["EMP_SEXO"]?.ToString(),
                    FotoPerfilUrl = reader["EMP_FOTOPERFILURL"]?.ToString(),
                    EstadoEmpleado = reader["EMP_ESTADOEMPLEADO"]?.ToString(),
                    EmpTipo = reader["EMP_TIPO"] != DBNull.Value
                                          ? Convert.ToInt32(reader["EMP_TIPO"])
                                          : (int?)null,
                    ActPassword = reader["EMP_ACT_PASSWORD"] as bool?,
                    Password = reader["EMP_PASSWORD"]?.ToString(),
                    Sueldo = reader["EMP_SUELDO"] as decimal?,
                    
                    // Nuevos campos añadidos
                    TipoSangre = reader["EMP_TIPOSANGRE"]?.ToString(),
                    Etnia = reader["EMP_ETNIA"]?.ToString(),
                    PaisNacimiento = reader["EMP_PAISNACIMIENTO"]?.ToString(),
                    ProvinciaNacimiento = reader["EMP_PROVINCIA_NACIMIENTO"]?.ToString(),
                    CiudadNacimiento = reader["EMP_CIUDAD_NACIMIENTO"]?.ToString(),
                    NivelEstudio = reader["EMP_NIVELESTUDIO"]?.ToString(),
                    CargasFamiliares = reader["EMP_CARGASFAMILIARES"] != DBNull.Value
                                                ? Convert.ToInt32(reader["EMP_CARGASFAMILIARES"])
                                                : (int?)null,
                    DocumentoIdentidad = reader["EMP_DOCUMENTOIDENTIDAD"]?.ToString(),
                    NombreEmergencia = reader["EMP_NOMBREEMERGENCIA"]?.ToString(),
                    RelacionEmergencia = reader["EMP_RELACIONEMERGENCIA"]?.ToString(),
                    TelefonoEmergencia = reader["EMP_TELEFONOEMERGENCIA"]?.ToString(),
                    NombreConyuge = reader["EMP_NOMBRECONYUGE"]?.ToString(),
                    FechaMatrimonio = reader["EMP_FECHAMATRIMONIO"] != DBNull.Value ? 
                        Convert.ToDateTime(reader["EMP_FECHAMATRIMONIO"]).ToString("yyyy-MM-dd") : null,
                    DiscapacidadConyuge = reader["EMP_DISCAPACIDADCONYUGE"] as bool?,
                    DocumentosConyuge = reader["EMP_DOCUMENTOSCONYUGE"]?.ToString(),
                    CargoActual = reader["EMP_CARGOACTUAL"]?.ToString(),
                    Area = reader["EMP_AREA"]?.ToString(),
                    SubArea = reader["EMP_SUBAREA"]?.ToString(),
                    Empresa = reader["EMP_EMPRESA"]?.ToString(),
                    JefeDirecto = reader["EMP_JEFEDIRECTO"]?.ToString(),
                    TipoContrato = reader["EMP_TIPOCONTRATO"]?.ToString(),
                    Ubicacion = reader["EMP_UBICACION"]?.ToString()
                });
            }
            return list;
        }
    }
}
