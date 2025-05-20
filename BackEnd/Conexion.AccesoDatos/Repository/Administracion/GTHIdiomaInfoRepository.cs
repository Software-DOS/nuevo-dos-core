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
    public class GTHIdiomaInfoRepository
    {
        private readonly string _connectionString;

        public GTHIdiomaInfoRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Conexion");
        }

        /// <summary>
        /// Ejecuta SP para insertar o eliminar asociación idioma ↔ información profesional.
        /// </summary>
        public async Task<IEnumerable<Generica>> Manage(int tipo, GTHIdiomaInfo idiomaInfo)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("SP_Gestionar_GTH_IDIOMAINFO", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));
            cmd.Parameters.Add(new SqlParameter("@ID_INFOPROF", idiomaInfo.IdInfoProf));
            cmd.Parameters.Add(new SqlParameter("@ID_IDIOMA", idiomaInfo.IdIdioma));

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
        /// Ejecuta SP para mostrar asociaciones idioma ↔ información profesional.
        /// </summary>
        public async Task<IEnumerable<GTHIdiomaInfo>> Show(int tipo,
            int? idInfoProf = null,
            int? idIdioma = null)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("GTH_MostrarIdiomaInfo", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@ID_Infoprof", idInfoProf ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@ID_Idioma", idIdioma ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));

            await sql.OpenAsync();
            var list = new List<GTHIdiomaInfo>();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(new GTHIdiomaInfo
                {
                    IdInfoProf = (long)reader["ID_INFOPROF"],
                    IdIdioma = (long)reader["ID_IDIOMA"]
                });
            }
            return list;
        }
    }
}
