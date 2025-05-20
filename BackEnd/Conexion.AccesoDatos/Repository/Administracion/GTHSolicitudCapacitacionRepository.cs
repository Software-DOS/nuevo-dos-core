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
    public class GTHSolicitudCapacitacionRepository
    {
        private readonly string _connectionString;

        public GTHSolicitudCapacitacionRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Conexion");
        }

        /// <summary>
        /// Ejecuta SP para insertar, actualizar o eliminar una solicitud de capacitación.
        /// </summary>
        public async Task<IEnumerable<Generica>> Manage(int tipo, GTHSolicitudCapacitacion solicitud)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("SP_Gestionar_GTH_SOLICITUDCAPACITACION", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));
            cmd.Parameters.Add(new SqlParameter("@ID_CAPACITACION", solicitud.IdCapacitacion));
            cmd.Parameters.Add(new SqlParameter("@ID_EMPLEADO", solicitud.IdEmpleado));
            cmd.Parameters.Add(new SqlParameter("@CAP_S_JUSTIFICACION", solicitud.Justificacion ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@CAP_S_FECHASOLICITUD", solicitud.FechaSolicitud ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@CAP_S_RESPUESTA", solicitud.Respuesta ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@CAP_S_FECHARESPUESTA", solicitud.FechaRespuesta ?? (object)DBNull.Value));

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
        /// Ejecuta SP para mostrar solicitudes de capacitación según filtros.
        /// </summary>
        public async Task<IEnumerable<GTHSolicitudCapacitacion>> Show(int tipo,
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
                list.Add(new GTHSolicitudCapacitacion
                {
                    IdCapacitacion = (long)reader["ID_CAPACITACION"],
                    IdEmpleado = (long)reader["ID_EMPLEADO"],
                    Justificacion = reader["CAP_S_JUSTIFICACION"].ToString(),
                    FechaSolicitud = reader["CAP_S_FECHASOLICITUD"] as DateTime?,
                    Respuesta = reader["CAP_S_RESPUESTA"].ToString(),
                    FechaRespuesta = reader["CAP_S_FECHARESPUESTA"] as DateTime?
                });
            }
            return list;
        }
    }
}
