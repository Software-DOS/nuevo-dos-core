using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Conexion.Entidad.Administracion;
using Microsoft.Extensions.Configuration;

namespace Conexion.AccesoDatos.Repository.Administracion
{
    public class GTHInformacionProfesionalRepository
    {
        private readonly string _connectionString;

        public GTHInformacionProfesionalRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Conexion");
        }

        /// <summary>
        /// Ejecuta SP para mostrar información profesional según filtros.
        /// 1 = IdInfoProf, 2 = IdEmpleado, 3 = CedulaEmpleado, 0 = Todos.
        /// </summary>
        public async Task<IEnumerable<GTHInformacionProfesional>> Mostrar(
            int tipo,
            int? idInfoProf = null,
            int? idEmpleado = null,
            string cedulaEmpleado = null)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("GTH_MostrarInformacionProfesional", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@ID_Infoprof", idInfoProf ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@ID_Empleado", idEmpleado ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@CedulaEmpleado", cedulaEmpleado ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));

            await sql.OpenAsync();
            var list = new List<GTHInformacionProfesional>();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var infoVal = reader["ID_INFOPROF"];
                var empVal = reader["ID_EMPLEADO"];

                list.Add(new GTHInformacionProfesional
                {
                    IdInfoProf = infoVal != DBNull.Value
                        ? Convert.ToInt64(infoVal)
                        : 0L,
                    IdEmpleado = empVal != DBNull.Value
                        ? Convert.ToInt64(empVal)
                        : (long?)null,
                    DescripcionProfesional = reader["INFPROF_DESCPROFESIONAL"]?.ToString(),
                    PerfilLinkedIn = reader["INFPROF_PERFILLINKEDIN"]?.ToString(),
                    FechaCreacion = reader["INFPROF_FECHACREACION"] as DateTime?
                });
            }
            return list;
        }

        /// <summary>
        /// Ejecuta SP para insertar, actualizar o eliminar información profesional.
        /// </summary>
        public async Task<IEnumerable<Generica>> Gestionar(int tipo, GTHInformacionProfesional infoProf)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("SP_Gestionar_GTH_INFORMACIONPROFESIONAL", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));
            cmd.Parameters.Add(new SqlParameter("@ID_INFOPROF", infoProf.IdInfoProf));
            cmd.Parameters.Add(new SqlParameter("@ID_EMPLEADO", infoProf.IdEmpleado ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@INFPROF_DESCPROFESIONAL", infoProf.DescripcionProfesional ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@INFPROF_PERFILLINKEDIN", infoProf.PerfilLinkedIn ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@INFPROF_FECHACREACION", infoProf.FechaCreacion ?? (object)DBNull.Value));

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
    }
}
