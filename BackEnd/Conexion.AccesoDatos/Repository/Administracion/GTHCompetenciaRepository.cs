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
    public class GTHCompetenciaRepository
    {
        private readonly string _connectionString;

        public GTHCompetenciaRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Conexion");
        }

        /// <summary>
        /// Ejecuta SP para insertar, actualizar o eliminar una competencia.
        /// Tipos: 1=Insertar, 2=Actualizar, 3=Eliminar
        /// </summary>
        public async Task<IEnumerable<Generica>> Gestionar(int tipo, GTHCompetencia competencia)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("SP_Gestionar_GTH_COMPETENCIA", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));
            cmd.Parameters.Add(new SqlParameter("@ID_COMPETENCIA", (object)competencia.IdCompetencia ?? DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@NOMBRE_COMPETENCIA", competencia.NombreCompetencia ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@DESCRIPCION", competencia.Descripcion ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@TIPO_COMPETENCIA", competencia.TipoCompetencia ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@ESTADO", competencia.Estado ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@USUARIO_CREACION", "SISTEMA"));

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
        /// Ejecuta SP para mostrar competencias según filtros.
        /// Tipos: 0=Todas, 1=Por ID, 2=Por Estado, 3=Por Nombre, 4=Por Tipo Competencia, 5=Filtros Combinados
        /// </summary>
        public async Task<IEnumerable<GTHCompetencia>> Mostrar(
            int tipo,
            int? idCompetencia = null,
            string estado = null,
            string nombreCompetencia = null,
            string tipoCompetencia = null)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("GTH_MostrarCompetencia", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));
            cmd.Parameters.Add(new SqlParameter("@ID_COMPETENCIA", idCompetencia ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@ESTADO", estado ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@NOMBRE_COMPETENCIA", nombreCompetencia ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@TIPO_COMPETENCIA", tipoCompetencia ?? (object)DBNull.Value));

            await sql.OpenAsync();
            var list = new List<GTHCompetencia>();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(new GTHCompetencia
                {
                    IdCompetencia = reader["ID_COMPETENCIA"] != DBNull.Value
                                          ? Convert.ToInt32(reader["ID_COMPETENCIA"])
                                          : 0,
                    NombreCompetencia = reader["NOMBRE_COMPETENCIA"]?.ToString(),
                    Descripcion = reader["DESCRIPCION"]?.ToString(),
                    TipoCompetencia = reader["TIPO_COMPETENCIA"]?.ToString(),
                    Estado = reader["ESTADO"]?.ToString(),
                    FechaCreacion = reader["FECHA_CREACION"] != DBNull.Value
                                          ? Convert.ToDateTime(reader["FECHA_CREACION"])
                                          : (DateTime?)null,
                    FechaModificacion = reader["FECHA_MODIFICACION"] != DBNull.Value
                                          ? Convert.ToDateTime(reader["FECHA_MODIFICACION"])
                                          : (DateTime?)null,
                    UsuarioCreacion = reader["USUARIO_CREACION"]?.ToString()
                });
            }
            return list;
        }
    }
}
