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
    public class GTHNivelCompetenciaRepository
    {
        private readonly string _connectionString;

        public GTHNivelCompetenciaRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Conexion");
        }

        /// <summary>
        /// Ejecuta SP para insertar, actualizar o eliminar un nivel de competencia.
        /// Tipos: 1=Insertar, 2=Actualizar, 3=Eliminar
        /// </summary>
        public async Task<IEnumerable<Generica>> Gestionar(int tipo, GTHNivelCompetencia nivelCompetencia)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("SP_Gestionar_GTH_NIVEL_COMPETENCIA", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));
            cmd.Parameters.Add(new SqlParameter("@ID_NIVEL_COMPETENCIA", (object)nivelCompetencia.IdNivelCompetencia ?? DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@ID_COMPETENCIA", (object)nivelCompetencia.IdCompetencia ?? DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@NIVEL", (object)nivelCompetencia.Nivel ?? DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@DESCRIPCION", nivelCompetencia.Descripcion ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@ESTADO", nivelCompetencia.Estado ?? (object)DBNull.Value));
            // cmd.Parameters.Add(new SqlParameter("@USUARIO_CREACION", "SISTEMA")); // TEMPORAL: Comentado hasta actualizar el SP

            await sql.OpenAsync();
            var response = new List<Generica>();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                response.Add(new Generica
                {
                    valor1 = Convert.ToInt16(reader["valor1"]),
                    valor2 = reader["valor2"].ToString()
                });
            }
            return response;
        }

        /// <summary>
        /// Ejecuta SP para mostrar niveles de competencia según filtros.
        /// Tipos: 0=Todos, 1=Por ID, 2=Por Estado, 3=Por Competencia
        /// </summary>
        public async Task<IEnumerable<GTHNivelCompetencia>> Mostrar(
            int tipo,
            int? idNivel = null,
            string estado = null,
            int? idCompetencia = null)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("GTH_MostrarNivelCompetencia", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));
            cmd.Parameters.Add(new SqlParameter("@ID_NIVEL", idNivel ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@ESTADO", estado ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@ID_COMPETENCIA", idCompetencia ?? (object)DBNull.Value));

            await sql.OpenAsync();
            var list = new List<GTHNivelCompetencia>();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(new GTHNivelCompetencia
                {
                    IdNivelCompetencia = reader["ID_NIVEL"] != DBNull.Value
                                          ? Convert.ToInt32(reader["ID_NIVEL"])
                                          : 0,
                    IdCompetencia = reader["ID_COMPETENCIA"] != DBNull.Value
                                          ? Convert.ToInt32(reader["ID_COMPETENCIA"])
                                          : 0,
                    Nivel = reader["NIVEL"] != DBNull.Value
                                          ? Convert.ToInt32(reader["NIVEL"])
                                          : 0,
                    Descripcion = reader["DESCRIPCION"]?.ToString(),
                    Estado = reader["ESTADO"]?.ToString(),
                    FechaCreacion = reader["FECHA_CREACION"] != DBNull.Value
                                          ? Convert.ToDateTime(reader["FECHA_CREACION"])
                                          : (DateTime?)null
                });
            }
            return list;
        }
    }
}
