using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
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

        /// <summary>
        /// Inserta una nueva capacitación y devuelve el ID generado automáticamente.
        /// Utiliza el SP específico SP_Insertar_GTH_CAPACITACION que retorna solo el ID.
        /// </summary>
        public async Task<long> InsertarYObtenerIdCapacitacionAsync(GTHCapacitacion capacitacion)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("SP_Insertar_GTH_CAPACITACION", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            // Agregar todos los parámetros necesarios para la inserción
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
            
            // Usar ExecuteScalarAsync para obtener directamente el ID retornado
            var result = await cmd.ExecuteScalarAsync();
            return result != null && result != DBNull.Value ? Convert.ToInt64(result) : 0L;
        }

        /// <summary>
        /// Verifica si una capacitación tiene registros relacionados en solicitudes o asignaciones.
        /// </summary>
        public async Task<bool> TieneRegistrosRelacionadosAsync(long idCapacitacion)
        {
            using var sql = new SqlConnection(_connectionString);
            
            // Query más simple y compatible
            var query = @"
                SELECT 
                    (SELECT COUNT(*) FROM GTH_SOLICITUDCAPACITACION WHERE ID_CAPACITACION = @IdCapacitacion) +
                    (SELECT COUNT(*) FROM GTH_ASIGNACIONCAPACITACION WHERE ID_CAPACITACION = @IdCapacitacion) AS Total";

            using var cmd = new SqlCommand(query, sql);
            cmd.Parameters.Add(new SqlParameter("@IdCapacitacion", idCapacitacion));

            await sql.OpenAsync();
            var count = (int)await cmd.ExecuteScalarAsync();
            return count > 0;
        }

        /// <summary>
        /// Ejecuta eliminación inteligente: elimina físicamente si no hay dependencias, 
        /// de lo contrario cambia el estado a 'inactiva'.
        /// Retorna información sobre la acción realizada.
        /// </summary>
        public async Task<Generica> EliminarInteligenteAsync(long idCapacitacion)
        {
            // Primero verificar si tiene registros relacionados
            var tieneRelaciones = await TieneRegistrosRelacionadosAsync(idCapacitacion);

            if (tieneRelaciones)
            {
                // Cambiar estado a 'inactiva' en lugar de eliminar
                return await CambiarEstadoCapacitacionAsync(idCapacitacion, "inactiva");
            }
            else
            {
                // Eliminar físicamente usando la lógica existente
                var capacitacion = new GTHCapacitacion { IdCapacitacion = idCapacitacion };
                var resultados = await Gestionar(2, capacitacion); // Tipo 2 = Eliminar
                var resultado = resultados.FirstOrDefault();
                
                return new Generica
                {
                    valor1 = resultado?.valor1 ?? 0,
                    valor2 = resultado?.valor2 ?? "Capacitación eliminada completamente"
                };
            }
        }

        /// <summary>
        /// Cambia el estado de una capacitación específica.
        /// </summary>
        private async Task<Generica> CambiarEstadoCapacitacionAsync(long idCapacitacion, string nuevoEstado)
        {
            using var sql = new SqlConnection(_connectionString);
            
            var query = @"
                UPDATE GTH_CAPACITACION 
                SET CAP_ESTADO = @NuevoEstado 
                WHERE ID_CAPACITACION = @IdCapacitacion";

            using var cmd = new SqlCommand(query, sql);
            cmd.Parameters.Add(new SqlParameter("@NuevoEstado", nuevoEstado));
            cmd.Parameters.Add(new SqlParameter("@IdCapacitacion", idCapacitacion));

            await sql.OpenAsync();
            var filasAfectadas = await cmd.ExecuteNonQueryAsync();

            return new Generica
            {
                valor1 = filasAfectadas > 0 ? 1 : 0,
                valor2 = filasAfectadas > 0 
                    ? "Capacitación marcada como inactiva (tiene registros relacionados)"
                    : "No se pudo actualizar la capacitación"
            };
        }
    }
}
