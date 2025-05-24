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
    public class GTHHabInfoRepository
    {
        private readonly string _connectionString;

        public GTHHabInfoRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Conexion");
        }

        /// <summary>
        /// Ejecuta SP para insertar, eliminar o (no actualizar) relación habilidad ↔ información profesional.
        /// </summary>
        public async Task<IEnumerable<Generica>> Gestionar(int tipo, GTHHabInfo habInfo)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("SP_Gestionar_GTH_HABINFO", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));
            cmd.Parameters.Add(new SqlParameter("@ID_HABILIDAD", habInfo.IdHabilidad));
            cmd.Parameters.Add(new SqlParameter("@ID_INFOPROF", habInfo.IdInfoProf));

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
        /// Ejecuta SP para mostrar relación habilidades ↔ información profesional.
        /// </summary>
        public async Task<IEnumerable<GTHHabInfo>> Mostrar(int tipo,
            int? idHabilidad = null,
            int? idInfoProf = null)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("GTH_MostrarHabInfo", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@ID_Habilidad", idHabilidad ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@ID_Infoprof", idInfoProf ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));

            await sql.OpenAsync();
            var list = new List<GTHHabInfo>();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(new GTHHabInfo
                {
                    IdHabilidad = (long)reader["ID_HABILIDAD"],
                    IdInfoProf = (long)reader["ID_INFOPROF"]
                });
            }
            return list;
        }
    }
}
