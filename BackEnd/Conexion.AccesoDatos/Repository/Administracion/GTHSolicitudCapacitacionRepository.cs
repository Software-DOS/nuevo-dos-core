using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Conexion.Entidad.Administracion;
using Microsoft.Extensions.Configuration;

namespace Conexion.AccesoDatos.Repository.Administracion
{
    public class GTHSolicitudCapacitacionRepository
    {
        private readonly string _connectionString;

        public GTHSolicitudCapacitacionRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Conexion");
        }

        /// <summary>
        /// Ejecuta SP para mostrar solicitudes de capacitación según filtros.
        /// 1 = IdCapacitacion, 2 = IdEmpleado.
        /// </summary>
        public async Task<IEnumerable<GTHSolicitudCapacitacion>> Mostrar(
            int tipo,
            int? idCapacitacion = null,
            int? idEmpleado = null)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("GTH_MostrarSolicitudCapacitacion", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@ID_Capacitacion", idCapacitacion ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@ID_Empleado", idEmpleado ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));

            await sql.OpenAsync();
            var list = new List<GTHSolicitudCapacitacion>();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                // Funciones de lectura segura
                object SafeGet(string col)
                {
                    try { return reader[col]; }
                    catch (IndexOutOfRangeException) { return DBNull.Value; }
                }
                string SafeGetString(string col)
                {
                    var val = SafeGet(col);
                    return val != DBNull.Value ? val.ToString() : string.Empty;
                }
                DateTime? SafeGetDate(string col)
                {
                    var val = SafeGet(col);
                    return val != DBNull.Value ? val as DateTime? : null;
                }
                long SafeGetLong(string col)
                {
                    var val = SafeGet(col);
                    return val != DBNull.Value ? Convert.ToInt64(val) : 0L;
                }

                list.Add(new GTHSolicitudCapacitacion
                {
                    IdCapacitacion = SafeGetLong("ID_CAPACITACION"),
                    IdEmpleado = SafeGetLong("ID_EMPLEADO"),
                    Justificacion = SafeGetString("CAP_S_JUSTIFICACION"),
                    FechaSolicitud = SafeGetDate("CAP_S_FECHASOLICITUD"),
                    Respuesta = SafeGetString("CAP_S_RESPUESTA"),
                    FechaRespuesta = SafeGetDate("CAP_S_FECHARESPUESTA")
                });
            }
            return list;
        }

        /// <summary>
        /// Ejecuta SP para insertar, actualizar o eliminar una solicitud de capacitación.
        /// 1 = Insertar, 2 = Editar, 3 = Eliminar.
        /// </summary>
        public async Task<IEnumerable<Generica>> Gestionar(
            int tipo,
            GTHSolicitudCapacitacion solicitud)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("SP_Gestionar_GTH_SOLICITUDCAPACITACION", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));
            cmd.Parameters.Add(new SqlParameter("@ID_Capacitacion", solicitud.IdCapacitacion));
            cmd.Parameters.Add(new SqlParameter("@ID_Empleado", solicitud.IdEmpleado));
            cmd.Parameters.Add(new SqlParameter("@CAP_S_Justificacion", solicitud.Justificacion ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@CAP_S_FechaSolicitud", solicitud.FechaSolicitud ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@CAP_S_Respuesta", solicitud.Respuesta ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@CAP_S_FechaRespuesta", solicitud.FechaRespuesta ?? (object)DBNull.Value));

            await sql.OpenAsync();
            var response = new List<Generica>();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var codeVal = reader["Codigo"];
                var msgVal = reader["Mensaje"];

                response.Add(new Generica
                {
                    valor1 = codeVal != DBNull.Value ? Convert.ToInt32(codeVal) : 0,
                    valor2 = msgVal != DBNull.Value ? msgVal.ToString() : string.Empty
                });
            }
            return response;
        }
    }
}
