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
    public class GTHIdiomaRepository
    {
        private readonly string _connectionString;

        public GTHIdiomaRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Conexion");
        }

        /// <summary>
        /// Ejecuta SP para insertar, actualizar o eliminar un idioma.
        /// </summary>
        public async Task<IEnumerable<Generica>> Manage(int tipo, GTHIdioma idioma)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("SP_Gestionar_GTH_IDIOMA", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));
            cmd.Parameters.Add(new SqlParameter("@ID_IDIOMA", idioma.IdIdioma));
            cmd.Parameters.Add(new SqlParameter("@IDI_NOMBRE", idioma.Nombre ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@IDI_DESCRIPCION", idioma.Descripcion ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@IDI_NIVEL", idioma.Nivel ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@IDI_NIVELESPECIFICO", idioma.NivelEspecifico ?? (object)DBNull.Value));

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
        /// Ejecuta SP para mostrar idiomas según filtros.
        /// </summary>
        public async Task<IEnumerable<GTHIdioma>> Show(int tipo,
            int? idIdioma = null,
            string nombre = null,
            string nivel = null,
            string nivelEspecifico = null)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("GTH_MostrarIdioma", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@ID_Idioma", idIdioma ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@IDI_Nombre", nombre ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@IDI_Nivel", nivel ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@IDI_NivelEspecifico", nivelEspecifico ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));

            await sql.OpenAsync();
            var list = new List<GTHIdioma>();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(new GTHIdioma
                {
                    IdIdioma = (long)reader["ID_IDIOMA"],
                    Nombre = reader["IDI_NOMBRE"].ToString(),
                    Descripcion = reader["IDI_DESCRIPCION"].ToString(),
                    Nivel = reader["IDI_NIVEL"].ToString(),
                    NivelEspecifico = reader["IDI_NIVELESPECIFICO"].ToString()
                });
            }
            return list;
        }
    }
}
