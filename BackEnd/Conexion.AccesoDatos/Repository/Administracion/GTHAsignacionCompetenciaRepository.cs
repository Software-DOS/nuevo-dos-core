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
    public class GTHAsignacionCompetenciaRepository
    {
        private readonly string _connectionString;

        public GTHAsignacionCompetenciaRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Conexion");
        }

        /// <summary>
        /// Ejecuta SP para insertar, actualizar o eliminar una asignación de competencia.
        /// Tipos: 1=Insertar, 2=Actualizar, 3=Eliminar
        /// </summary>
        public async Task<IEnumerable<Generica>> Gestionar(int tipo, GTHAsignacionCompetencia asignacionCompetencia)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("SP_Gestionar_GTH_ASIGNACION_COMPETENCIA", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));
            cmd.Parameters.Add(new SqlParameter("@ID_ASIGNACION", (object)asignacionCompetencia.IdAsignacion ?? DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@ID_EVALUACION", (object)asignacionCompetencia.IdEvaluacion ?? DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@ID_NIVEL_COMPETENCIA", (object)asignacionCompetencia.IdNivelCompetencia ?? DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@VALORACION_EMPLEADO", (object)asignacionCompetencia.ValoracionEmpleado ?? DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@VALORACION_JEFE", (object)asignacionCompetencia.ValoracionJefe ?? DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@CALIFICACION_EMPLEADO", (object)asignacionCompetencia.CalificacionEmpleado ?? DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@CALIFICACION_FINAL", (object)asignacionCompetencia.CalificacionFinal ?? DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@FECHA_LIMITE", (object)asignacionCompetencia.FechaLimite ?? DBNull.Value));            
            cmd.Parameters.Add(new SqlParameter("@COMENTARIOS_EMPLEADO", asignacionCompetencia.ComentariosEmpleado ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@COMENTARIOS_JEFE", asignacionCompetencia.ComentariosJefe ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@ESTADO", asignacionCompetencia.Estado ?? (object)DBNull.Value));
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
        /// Ejecuta SP para mostrar asignaciones de competencia según filtros.
        /// Tipos: 0=Todas, 1=Por ID, 2=Por Evaluación, 3=Por Estado
        /// </summary>
        public async Task<IEnumerable<GTHAsignacionCompetencia>> Mostrar(
            int tipo,
            int? idAsignacion = null,
            int? idEvaluacion = null,
            string estado = null)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("GTH_MostrarAsignacionCompetencia", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));
            cmd.Parameters.Add(new SqlParameter("@ID_ASIGNACION", idAsignacion ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@ID_EVALUACION", idEvaluacion ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@ESTADO", estado ?? (object)DBNull.Value));

            await sql.OpenAsync();
            var list = new List<GTHAsignacionCompetencia>();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(new GTHAsignacionCompetencia
                {
                    IdAsignacion = reader["ID_ASIGNACION"] != DBNull.Value
                                          ? Convert.ToInt32(reader["ID_ASIGNACION"])
                                          : 0,
                    IdEvaluacion = reader["ID_EVALUACION"] != DBNull.Value
                                          ? Convert.ToInt32(reader["ID_EVALUACION"])
                                          : 0,
                    IdNivelCompetencia = reader["ID_NIVEL_COMPETENCIA"] != DBNull.Value
                                          ? Convert.ToInt32(reader["ID_NIVEL_COMPETENCIA"])
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
                    ComentariosEmpleado = reader["COMENTARIOS_EMPLEADO"]?.ToString(),
                    ComentariosJefe = reader["COMENTARIOS_JEFE"]?.ToString(),
                    FechaLimite = reader["FECHA_LIMITE"] != DBNull.Value
                                          ? Convert.ToDateTime(reader["FECHA_LIMITE"])
                                          : (DateTime?)null,
                    FechaAutoevaluacion = reader["FECHA_AUTOEVALUACION"] != DBNull.Value
                                          ? Convert.ToDateTime(reader["FECHA_AUTOEVALUACION"])
                                          : (DateTime?)null,
                    FechaEvaluacionJefe = reader["FECHA_EVALUACION_JEFE"] != DBNull.Value
                                          ? Convert.ToDateTime(reader["FECHA_EVALUACION_JEFE"])
                                          : (DateTime?)null,
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
