using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Conexion.Entidad.Administracion;
using Microsoft.Extensions.Configuration;

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
        /// 1 = Insertar, 2 = Editar, 3 = Eliminar.
        /// </summary>
        public async Task<IEnumerable<Generica>> Gestionar(int tipo, GTHHabilidades habilidad)
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
                var codeVal = reader["CodigoEstado"];
                var msgVal = reader["Resultado"];
                response.Add(new Generica
                {
                    valor1 = codeVal != DBNull.Value ? Convert.ToInt32(codeVal) : 0,
                    valor2 = msgVal != DBNull.Value ? msgVal.ToString() : string.Empty
                });
            }
            return response;
        }

        /// <summary>
        /// Ejecuta SP para mostrar habilidades según los filtros proporcionados.
        /// 1 = IdHabilidad, 2 = Nombre, 3 = Categoria.
        /// </summary>
        public async Task<IEnumerable<GTHHabilidades>> Mostrar(
            int tipo,
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
            var list = new List<GTHHabilidades>();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var idVal = reader["ID_HABILIDAD"];

                list.Add(new GTHHabilidades
                {
                    IdHabilidad = idVal != DBNull.Value
                        ? Convert.ToInt64(idVal)
                        : 0L,
                    Nombre = reader["HAB_NOMBRE"]?.ToString(),
                    Categoria = reader["HAB_CATEGORIA"]?.ToString(),
                    Descripcion = reader["HAB_DESCRIPCION"]?.ToString()
                });
            }
            return list;
        }
    }
}
