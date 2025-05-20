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
    public class GTHExperienciaLaboralRepository
    {
        private readonly string _connectionString;

        public GTHExperienciaLaboralRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Conexion");
        }

        /// <summary>
        /// Ejecuta SP para insertar, actualizar o eliminar experiencia laboral.
        /// </summary>
        public async Task<IEnumerable<Generica>> Manage(int tipo, GTHExperienciaLaboral experiencia)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("SP_Gestionar_GTH_EXPERIENCIALABORAL", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));
            cmd.Parameters.Add(new SqlParameter("@ID_EXPERIENCIA", experiencia.IdExperiencia));
            cmd.Parameters.Add(new SqlParameter("@ID_INFOPROF", experiencia.IdInfoProf ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EXP_EMPRESA", experiencia.Empresa ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EXP_CARGO", experiencia.Cargo ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EXP_FECHAINICIO", experiencia.FechaInicio ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EXP_FECHAFIN", experiencia.FechaFin ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EXP_DESCRIPCION", experiencia.Descripcion ?? (object)DBNull.Value));

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
        /// Ejecuta SP para mostrar experiencia laboral según filtros.
        /// </summary>
        public async Task<IEnumerable<GTHExperienciaLaboral>> Show(int tipo,
            int? idExperiencia = null,
            int? idInfoProf = null)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("GTH_MostrarExperienciaLaboral", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@ID_Experiencia", idExperiencia ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@ID_Infoprof", idInfoProf ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));

            await sql.OpenAsync();
            var list = new List<GTHExperienciaLaboral>();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(new GTHExperienciaLaboral
                {
                    IdExperiencia = (long)reader["ID_EXPERIENCIA"],
                    IdInfoProf = reader["ID_INFOPROF"] as long?,
                    Empresa = reader["EXP_EMPRESA"].ToString(),
                    Cargo = reader["EXP_CARGO"].ToString(),
                    FechaInicio = reader["EXP_FECHAINICIO"] as DateTime?,
                    FechaFin = reader["EXP_FECHAFIN"] as DateTime?,
                    Descripcion = reader["EXP_DESCRIPCION"].ToString()
                });
            }
            return list;
        }
    }
}
