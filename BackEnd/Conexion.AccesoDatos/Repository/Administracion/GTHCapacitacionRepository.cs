using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Conexion.Entidad.Administracion;
using Microsoft.Extensions.Configuration;

namespace Conexion.AccesoDatos.Repository.Administracion
{
    public class GTHCapacitacionRepository
    {
        private readonly string _connectionString;

        public GTHCapacitacionRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Conexion");
        }

        /// <summary>
        /// Ejecuta SP para mostrar capacitaciones según filtros.
        /// 1 = IdCapacitacion, 2 = IdEntidadCap, 3 = Estado, 4 = FechaInicio, 5 = FechaFin, 0 = Todos.
        /// </summary>
        public async Task<IEnumerable<GTHCapacitacion>> Mostrar(
            int tipo,
            int? idCapacitacion = null,
            int? idEntidadCap = null,
            string estado = null,
            DateTime? fechaInicio = null,
            DateTime? fechaFin = null)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("GTH_MostrarCapacitacion", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@ID_Capacitacion", idCapacitacion ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@ID_EntidadCap", idEntidadCap ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@CAP_Estado", estado ?? (object)DBNull.Value));
            // Parámetros de fecha: usar nombres compatibles con SP
            cmd.Parameters.Add(new SqlParameter("@FechaInicio", fechaInicio ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@FechaFin", fechaFin ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));

            await sql.OpenAsync();
            var response = new List<GTHCapacitacion>();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var capVal = reader["ID_CAPACITACION"];
                var entVal = reader["ID_ENTIDADCAP"];

                response.Add(new GTHCapacitacion
                {
                    IdCapacitacion = capVal != DBNull.Value
                        ? Convert.ToInt64(capVal)
                        : 0L,
                    IdEntidadCap = entVal != DBNull.Value
                        ? Convert.ToInt64(entVal)
                        : (long?)null,
                    Nombre = reader["CAP_NOMBRE"]?.ToString(),
                    Titulo = reader["CAP_TITULO"]?.ToString(),
                    Categoria = reader["CAP_CATEGORIA"]?.ToString(),
                    Descripcion = reader["CAP_DESCRIPCION"]?.ToString(),
                    Estado = reader["CAP_ESTADO"]?.ToString(),
                    FechaInicio = reader["CAP_FECHAINICIO"] as DateTime?,
                    FechaFin = reader["CAP_FECHAFIN"] as DateTime?,
                    FechaExpiracion = reader["CAP_FECHAEXPIRACION"] as DateTime?,
                    UrlVerificacion = reader["CAP_URLVERIFICACION"]?.ToString(),
                    ArchivosAdjuntos = reader["CAP_ARCHIVOSADJUNTOS"]?.ToString(),
                    Observaciones = reader["CAP_OBSERVACIONES"]?.ToString(),
                    Duracion = reader["CAP_DURACION"] as int?,
                    Costo = reader["CAP_COSTO"] as double?,
                    Modalidad = reader["CAP_MODALIDAD"]?.ToString()
                });
            }
            return response;
        }

        /// <summary>
        /// Ejecuta SP para insertar, actualizar o eliminar una capacitación.
        /// 1 = Insertar, 2 = Editar, 3 = Eliminar.
        /// </summary>
        public async Task<IEnumerable<Generica>> Gestionar(int tipo, GTHCapacitacion capacitacion)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("SP_Gestionar_GTH_CAPACITACION", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));
            cmd.Parameters.Add(new SqlParameter("@ID_CAPACITACION", capacitacion.IdCapacitacion));
            cmd.Parameters.Add(new SqlParameter("@ID_ENTIDADCAP", capacitacion.IdEntidadCap ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@CAP_NOMBRE", capacitacion.Nombre ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@CAP_TITULO", capacitacion.Titulo ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@CAP_CATEGORIA", capacitacion.Categoria ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@CAP_DESCRIPCION", capacitacion.Descripcion ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@CAP_ESTADO", capacitacion.Estado ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@CAP_FECHAINICIO", capacitacion.FechaInicio ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@CAP_FECHAFIN", capacitacion.FechaFin ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@CAP_FECHAEXPIRACION", capacitacion.FechaExpiracion ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@CAP_URLVERIFICACION", capacitacion.UrlVerificacion ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@CAP_ARCHIVOSADJUNTOS", capacitacion.ArchivosAdjuntos ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@CAP_OBSERVACIONES", capacitacion.Observaciones ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@CAP_DURACION", capacitacion.Duracion ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@CAP_COSTO", capacitacion.Costo ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@CAP_MODALIDAD", capacitacion.Modalidad ?? (object)DBNull.Value));

            await sql.OpenAsync();
            var result = new List<Generica>();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var codeVal = reader["Codigo"];
                var msgVal = reader["Mensaje"];
                result.Add(new Generica
                {
                    valor1 = codeVal != DBNull.Value ? Convert.ToInt32(codeVal) : 0,
                    valor2 = msgVal != DBNull.Value ? msgVal.ToString() : string.Empty
                });
            }
            return result;
        }
    }
}
