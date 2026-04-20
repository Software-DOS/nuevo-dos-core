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
    public class GTHObjetivoRepository
    {
        private readonly string _connectionString;

        public GTHObjetivoRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Conexion");
        }

        /// <summary>
        /// Ejecuta SP para insertar, actualizar o eliminar un objetivo.
        /// Tipos: 1=Insertar, 2=Actualizar, 3=Eliminar
        /// </summary>
        public async Task<IEnumerable<Generica>> Gestionar(int tipo, GTHObjetivo objetivo)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("SP_Gestionar_GTH_OBJETIVO", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));
            cmd.Parameters.Add(new SqlParameter("@ID_OBJETIVO", (object)objetivo.IdObjetivo ?? DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@ID_EVALUACION", (object)objetivo.IdEvaluacion ?? DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@TITULO", objetivo.Titulo ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@DESCRIPCION", objetivo.Descripcion ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@TIPO_OBJETIVO", objetivo.TipoObjetivo ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@PESO", (object)objetivo.Peso ?? DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@VALORACION_EMPLEADO", (object)objetivo.ValoracionEmpleado ?? DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@VALORACION_JEFE", (object)objetivo.ValoracionJefe ?? DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@CALIFICACION_EMPLEADO", (object)objetivo.CalificacionEmpleado ?? DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@CALIFICACION_FINAL", (object)objetivo.CalificacionFinal ?? DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@FECHA_LIMITE", (object)objetivo.FechaLimite ?? DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@COMENTARIOS_EMPLEADO", objetivo.ComentariosEmpleado ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@COMENTARIOS_JEFE", objetivo.ComentariosJefe ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@ESTADO", objetivo.Estado ?? (object)DBNull.Value));
            // cmd.Parameters.Add(new SqlParameter("@USUARIO_CREACION", "SISTEMA")); // TEMPORAL: Comentado hasta actualizar el SP

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
        /// Ejecuta SP para mostrar objetivos según filtros.
        /// Tipos: 0=Todos, 1=Por ID, 2=Por Evaluación, 3=Por Estado
        /// </summary>
        public async Task<IEnumerable<GTHObjetivo>> Mostrar(
            int tipo,
            int? idObjetivo = null,
            int? idEvaluacion = null,
            string estado = null)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("GTH_MostrarObjetivo", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));
            cmd.Parameters.Add(new SqlParameter("@ID_OBJETIVO", idObjetivo ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@ID_EVALUACION", idEvaluacion ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@ESTADO", estado ?? (object)DBNull.Value));

            await sql.OpenAsync();
            var list = new List<GTHObjetivo>();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(new GTHObjetivo
                {
                    IdObjetivo = reader["ID_OBJETIVO"] != DBNull.Value
                                          ? Convert.ToInt32(reader["ID_OBJETIVO"])
                                          : 0,
                    IdEvaluacion = reader["ID_EVALUACION"] != DBNull.Value
                                          ? Convert.ToInt32(reader["ID_EVALUACION"])
                                          : 0,
                    Titulo = reader["TITULO"]?.ToString(),
                    Descripcion = reader["DESCRIPCION"]?.ToString(),
                    TipoObjetivo = reader["TIPO_OBJETIVO"]?.ToString(),
                    Peso = reader["PESO"] != DBNull.Value
                                          ? Convert.ToDecimal(reader["PESO"])
                                          : 0,
                    ValoracionEmpleado = reader["VALORACION_EMPLEADO"] != DBNull.Value
                                          ? Convert.ToInt32(reader["VALORACION_EMPLEADO"])
                                          : (int?)null,
                    ValoracionJefe = reader["VALORACION_JEFE"] != DBNull.Value
                                          ? Convert.ToInt32(reader["VALORACION_JEFE"])
                                          : (int?)null,
                    CalificacionEmpleado = reader["CALIFICACION_EMPLEADO"] != DBNull.Value
                                          ? Convert.ToInt32(reader["CALIFICACION_EMPLEADO"])
                                          : (int?)null,
                    CalificacionFinal = reader["CALIFICACION_FINAL"] != DBNull.Value
                                          ? Convert.ToInt32(reader["CALIFICACION_FINAL"])
                                          : (int?)null,
                    FechaLimite = reader["FECHA_LIMITE"] != DBNull.Value
                                          ? Convert.ToDateTime(reader["FECHA_LIMITE"])
                                          : (DateTime?)null,
                    ComentariosEmpleado = reader["COMENTARIOS_EMPLEADO"]?.ToString(),
                    ComentariosJefe = reader["COMENTARIOS_JEFE"]?.ToString(),
                    Estado = reader["ESTADO"]?.ToString(),
                    FechaCreacion = reader["FECHA_CREACION"] != DBNull.Value
                                          ? Convert.ToDateTime(reader["FECHA_CREACION"])
                                          : (DateTime?)null,
                    FechaModificacion = reader["FECHA_MODIFICACION"] != DBNull.Value
                                          ? Convert.ToDateTime(reader["FECHA_MODIFICACION"])
                                          : (DateTime?)null
                });
            }
            return list;
        }
    }
}
