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
    public class GTHAsignacionCapacitacionRepository
    {
        private readonly string _connectionString;

        public GTHAsignacionCapacitacionRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Conexion");
        }

        /// <summary>
        /// Ejecuta SP para insertar, actualizar o eliminar una asignación de capacitación.
        /// </summary>
        public async Task<IEnumerable<Generica>> Manage(int tipo, GTHAsignacionCapacitacion asignacion)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("SP_Gestionar_GTH_ASIGNACIONCAPACITACION", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));
            cmd.Parameters.Add(new SqlParameter("@ID_CAPACITACION", asignacion.IdCapacitacion));
            cmd.Parameters.Add(new SqlParameter("@ID_EMPLEADO", asignacion.IdEmpleado));
            cmd.Parameters.Add(new SqlParameter("@CAP_A_FECHA", asignacion.Fecha ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@CAP_A_PROGRESO", asignacion.Progreso ?? (object)DBNull.Value));

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
        /// Ejecuta SP para mostrar asignaciones de capacitación según filtros.
        /// </summary>
        public async Task<IEnumerable<GTHAsignacionCapacitacion>> Show(int tipo,
            int? idCapacitacion = null,
            int? idEmpleado = null)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("GTH_MostrarAsignacionCapacitacion", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@ID_Capacitacion", idCapacitacion ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@ID_Empleado", idEmpleado ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));

            await sql.OpenAsync();
            var list = new List<GTHAsignacionCapacitacion>();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(new GTHAsignacionCapacitacion
                {
                    IdCapacitacion = (long)reader["ID_CAPACITACION"],
                    IdEmpleado = (long)reader["ID_EMPLEADO"],
                    Fecha = reader["CAP_A_FECHA"] as DateTime?,
                    Progreso = reader["CAP_A_PROGRESO"] as int?
                });
            }
            return list;
        }
    }
}
