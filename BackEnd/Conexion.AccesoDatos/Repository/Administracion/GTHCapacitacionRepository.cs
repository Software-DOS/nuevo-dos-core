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
    public class GTHCapacitacionRepository
    {
        private readonly string _connectionString;

        public GTHCapacitacionRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Conexion");
        }

        /// <summary>
        /// Ejecuta SP para insertar, actualizar o eliminar una capacitación.
        /// </summary>
        public async Task<IEnumerable<Generica>> Gestionar(int tipo, GTHCapacitacion capacitacion)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("SP_Gestionar_GTH_CAPACITACION", sql) { CommandType = CommandType.StoredProcedure };

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
            var response = new List<Generica>();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                response.Add(new Generica
                {
                    valor1 = Convert.ToInt16(reader["Codigo"]),
                    valor2 = reader["Mensaje"].ToString()
                });
            }
            return response;
        }

        /// <summary>
        /// Ejecuta SP para mostrar capacitaciones según filtros.
        /// </summary>
        public async Task<IEnumerable<GTHCapacitacion>> Mostrar(int tipo,
            int? idCapacitacion = null,
            int? idEntidadCap = null,
            string estado = null,
            DateTime? fechaInicio = null,
            DateTime? fechaFin = null)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("GTH_MostrarCapacitacion", sql) { CommandType = CommandType.StoredProcedure };

            cmd.Parameters.Add(new SqlParameter("@ID_Capacitacion", idCapacitacion ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@ID_EntidadCap", idEntidadCap ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@CAP_Estado", estado ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@FechaInicio", fechaInicio ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@FechaFin", fechaFin ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));

            await sql.OpenAsync();
            var response = new List<GTHCapacitacion>();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                response.Add(new GTHCapacitacion
                {
                    IdCapacitacion = (long)reader["ID_CAPACITACION"],
                    IdEntidadCap = reader["ID_ENTIDADCAP"] as long?,
                    Nombre = reader["CAP_NOMBRE"].ToString(),
                    Titulo = reader["CAP_TITULO"].ToString(),
                    Categoria = reader["CAP_CATEGORIA"].ToString(),
                    Descripcion = reader["CAP_DESCRIPCION"].ToString(),
                    Estado = reader["CAP_ESTADO"].ToString(),
                    FechaInicio = reader["CAP_FECHAINICIO"] as DateTime?,
                    FechaFin = reader["CAP_FECHAFIN"] as DateTime?,
                    FechaExpiracion = reader["CAP_FECHAEXPIRACION"] as DateTime?,
                    UrlVerificacion = reader["CAP_URLVERIFICACION"].ToString(),
                    ArchivosAdjuntos = reader["CAP_ARCHIVOSADJUNTOS"].ToString(),
                    Observaciones = reader["CAP_OBSERVACIONES"].ToString(),
                    Duracion = reader["CAP_DURACION"] as int?,
                    Costo = reader["CAP_COSTO"] as double?,
                    Modalidad = reader["CAP_MODALIDAD"].ToString()
                });
            }
            return response;
        }
    }
}
