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
    public class GTHHabilidadesRepository
    {
        private readonly string _connectionString;

        public GTHHabilidadesRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Conexion");
        }

        /// <summary>
        /// Ejecuta SP para insertar, actualizar o eliminar una habilidad.
        /// </summary>
        public async Task<IEnumerable<Generica>> Manage(int tipo, GTHHabilidad habilidad)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("SP_Gestionar_GTH_HABILIDADES", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));
            cmd.Parameters.Add(new SqlParameter("@ID_HABILIDAD", habilidad.IdHabilidad));
            cmd.Parameters.Add(new SqlParameter("@HAB_NOMBRE", habilidad.Nombre ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@HAB_CATEGORIA", habilidad.Categoria ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@HAB_DESCRIPCION", habilidad.Descripcion ?? (object)DBNull.Value));

            await sql.OpenAsync();
            var response = new List<Generica>();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                response.Add(new Generica
                {
                    valor1 = Convert.ToInt16(reader["CodigoEstado"] ?? reader["CodigoEstado"] /* fallback */),
                    valor2 = reader["Resultado"].ToString()
                });
            }
            return response;
        }

        /// <summary>
        /// Ejecuta SP para mostrar habilidades según filtros.
        /// </summary>
        public async Task<IEnumerable<GTHHabilidad>> Show(int tipo,
            int? idHabilidad = null,
            string nombre = null,
            string categoria = null)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("GTH_MostrarHabilidades", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@ID_Habilidad", idHabilidad ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@Hab_Nombre", nombre ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@Hab_Categoria", categoria ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));

            await sql.OpenAsync();
            var list = new List<GTHHabilidad>();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(new GTHHabilidad
                {
                    IdHabilidad = (long)reader["ID_HABILIDAD"],
                    Nombre = reader["HAB_NOMBRE"].ToString(),
                    Categoria = reader["HAB_CATEGORIA"].ToString(),
                    Descripcion = reader["HAB_DESCRIPCION"].ToString()
                });
            }
            return list;
        }
    }
}
