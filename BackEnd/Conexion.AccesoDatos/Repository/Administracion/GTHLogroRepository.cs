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
    public class GTHLogroRepository
    {
        private readonly string _connectionString;

        public GTHLogroRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Conexion");
        }

        /// <summary>
        /// Ejecuta SP para insertar, actualizar o eliminar un logro.
        /// </summary>
        public async Task<IEnumerable<Generica>> Gestionar(int tipo, GTHLogro logro)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("SP_Gestionar_GTH_LOGRO", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));
            cmd.Parameters.Add(new SqlParameter("@ID_LOGRO", logro.IdLogro));
            cmd.Parameters.Add(new SqlParameter("@ID_INFOPROF", logro.IdInfoProf ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@LOGRO_TITULO", logro.Titulo ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@LOGRO_TIPO", logro.Tipo ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@LOGRO_DESCRIPCION", logro.Descripcion ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@LOGRO_FECHALOGRO", logro.FechaLogro ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@LOGRO_EVIDENCIA", logro.Evidencia ?? (object)DBNull.Value));

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
        /// Ejecuta SP para mostrar logros según filtros.
        /// </summary>
        public async Task<IEnumerable<GTHLogro>> Mostrar(int tipo,
            int? idLogro = null,
            int? idInfoProf = null,
            string tipoLogro = null)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("GTH_MostrarLogro", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@ID_Logro", idLogro ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@ID_Infoprof", idInfoProf ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@Logro_Tipo", tipoLogro ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));

            await sql.OpenAsync();
            var list = new List<GTHLogro>();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(new GTHLogro
                {
                    IdLogro = (long)reader["ID_LOGRO"],
                    IdInfoProf = reader["ID_INFOPROF"] as long?,
                    Tipo = reader["LOGRO_TIPO"].ToString(),
                    Descripcion = reader["LOGRO_DESCRIPCION"].ToString(),
                    FechaLogro = reader["LOGRO_FECHALOGRO"] as DateTime?
                });
            }
            return list;
        }
    }
}
