using Conexion.Entidad.Administracion;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace Conexion.AccesoDatos.Repository.Administracion
{
    public class GTHCelulaRepository
    {
        private readonly string _connectionString;

        public GTHCelulaRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Conexion");
        }

        /// <summary>
        /// Ejecuta SP para mostrar células según filtros.
        /// 1 = IdCelula, 2 = Nombre, 0 = Todos.
        /// </summary>
        public async Task<IEnumerable<GTHCelula>> Mostrar(int tipo, int? idCelula = null, string nombre = null)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("GTH_MostrarCelula", sql) { CommandType = CommandType.StoredProcedure };

            cmd.Parameters.Add(new SqlParameter("@ID_Celula", idCelula ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@Cel_Nombre", nombre ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));

            await sql.OpenAsync();
            var list = new List<GTHCelula>();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(new GTHCelula
                {
                    IdCelula = reader["ID_CELULA"] != DBNull.Value
                        ? Convert.ToInt64(reader["ID_CELULA"])
                        : 0L,
                    Nombre = reader["CEL_NOMBRE"]?.ToString(),
                    Descripcion = reader["CEL_DESCRIPCION"]?.ToString(),
                    Encargado = reader["CEL_ENCARGADO"]?.ToString()
                });
            }
            return list;
        }

        /// <summary>
        /// Ejecuta SP para insertar, actualizar o eliminar una célula.
        /// 0 = Insertar, 1 = Editar, 2 = Eliminar.
        /// </summary>
        public async Task<IEnumerable<Generica>> Gestionar(int tipo, GTHCelula celula)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("SP_Gestionar_GTH_CELULA", sql) { CommandType = CommandType.StoredProcedure };

            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));
            cmd.Parameters.Add(new SqlParameter("@ID_CELULA", celula.IdCelula));
            cmd.Parameters.Add(new SqlParameter("@CEL_NOMBRE", celula.Nombre ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@CEL_DESCRIPCION", celula.Descripcion ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@CEL_ENCARGADO", celula.Encargado ?? (object)DBNull.Value));

            await sql.OpenAsync();
            var response = new List<Generica>();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                response.Add(new Generica
                {
                    valor1 = reader["Codigo"] != DBNull.Value ? Convert.ToInt32(reader["Codigo"]) : 0,
                    valor2 = reader["Mensaje"]?.ToString()
                });
            }
            return response;
        }
    }
}
