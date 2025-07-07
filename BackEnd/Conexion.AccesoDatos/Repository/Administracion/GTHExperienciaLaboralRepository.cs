using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Conexion.Entidad.Administracion;
using Microsoft.Extensions.Configuration;

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
        /// Ejecuta SP para mostrar experiencia laboral según filtros.
        /// 1 = IdExperiencia, 2 = IdInfoProf.
        /// </summary>
        public async Task<IEnumerable<GTHExperienciaLaboral>> Mostrar(
            int tipo,
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
                var expVal = reader["ID_EXPERIENCIA"];
                var infoVal = reader["ID_INFOPROF"];

                list.Add(new GTHExperienciaLaboral
                {
                    IdExperiencia = expVal != DBNull.Value
                        ? Convert.ToInt64(expVal)
                        : 0L,
                    IdInfoProf = infoVal != DBNull.Value
                        ? Convert.ToInt64(infoVal)
                        : (long?)null,
                    Empresa = reader["EXP_EMPRESA"]?.ToString(),
                    Cargo = reader["EXP_CARGO"]?.ToString(),
                    FechaInicio = reader["EXP_FECHAINICIO"] as DateTime?,
                    FechaFin = reader["EXP_FECHAFIN"] as DateTime?,
                    Descripcion = reader["EXP_DESCRIPCION"]?.ToString()
                });
            }
            return list;
        }

        /// <summary>
        /// Ejecuta SP para insertar, actualizar o eliminar experiencia laboral.
        /// 1 = Insertar, 2 = Editar, 3 = Eliminar.
        /// </summary>
        public async Task<IEnumerable<Generica>> Gestionar(
            int tipo,
            GTHExperienciaLaboral experiencia)
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
                var codeVal = reader["Codigo"];
                var msgVal = reader["Mensaje"];

                response.Add(new Generica
                {
                    valor1 = codeVal != DBNull.Value
                        ? Convert.ToInt32(codeVal)
                        : 0,
                    valor2 = msgVal != DBNull.Value
                        ? msgVal.ToString()
                        : string.Empty
                });
            }
            return response;
        }
    }
}
