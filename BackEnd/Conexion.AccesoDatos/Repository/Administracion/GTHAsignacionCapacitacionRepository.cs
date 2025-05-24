using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Conexion.Entidad.Administracion;
using Microsoft.Extensions.Configuration;

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
        /// Ejecuta SP para mostrar asignaciones de capacitación según filtros.
        /// 1 = IdCapacitacion, 2 = IdEmpleado.
        /// </summary>
        public async Task<IEnumerable<GTHAsignacionCapacitacion>> Mostrar(
            int tipo,
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
                var capacitacionValue = reader["ID_CAPACITACION"];
                var empleadoValue = reader["ID_EMPLEADO"];

                list.Add(new GTHAsignacionCapacitacion
                {
                    IdCapacitacion = capacitacionValue != DBNull.Value
                        ? Convert.ToInt64(capacitacionValue)
                        : 0L,
                    IdEmpleado = empleadoValue != DBNull.Value
                        ? Convert.ToInt64(empleadoValue)
                        : 0L,
                    Fecha = reader["CAP_A_FECHA"] as DateTime?,
                    Progreso = reader["CAP_A_PROGRESO"] as int?
                });
            }

            return list;
        }

        /// <summary>
        /// Ejecuta SP para insertar, actualizar o eliminar una asignación de capacitación.
        /// 1 = Insertar, 2 = Editar, 3 = Eliminar.
        /// </summary>
        public async Task<IEnumerable<Generica>> Gestionar(
            int tipo,
            GTHAsignacionCapacitacion asignacion)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("SP_Gestionar_GTH_ASIGNACIONCAPACITACION", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));
            cmd.Parameters.Add(new SqlParameter("@ID_Capacitacion", asignacion.IdCapacitacion));
            cmd.Parameters.Add(new SqlParameter("@ID_Empleado", asignacion.IdEmpleado));
            cmd.Parameters.Add(new SqlParameter("@CAP_A_Fecha", asignacion.Fecha ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@CAP_A_Progreso", asignacion.Progreso ?? (object)DBNull.Value));

            await sql.OpenAsync();
            var response = new List<Generica>();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var codigoValue = reader["Codigo"];
                var mensajeValue = reader["Mensaje"];

                response.Add(new Generica
                {
                    valor1 = codigoValue != DBNull.Value ? Convert.ToInt32(codigoValue) : 0,
                    valor2 = mensajeValue != DBNull.Value ? mensajeValue.ToString() : string.Empty
                });
            }

            return response;
        }
    }
}
