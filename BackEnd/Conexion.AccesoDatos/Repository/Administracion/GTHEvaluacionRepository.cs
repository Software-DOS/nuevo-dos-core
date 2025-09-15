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
    public class GTHEvaluacionRepository
    {
        private readonly string _connectionString;

        public GTHEvaluacionRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Conexion");
        }

        /// <summary>
        /// Ejecuta SP para insertar, actualizar o eliminar una evaluación.
        /// Tipos: 1=Insertar, 2=Actualizar, 3=Eliminar, 4=Cambiar Estado
        /// </summary>
        public async Task<IEnumerable<Generica>> Gestionar(int tipo, GTHEvaluacion evaluacion)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("SP_Gestionar_GTH_EVALUACION", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));
            cmd.Parameters.Add(new SqlParameter("@ID_EVALUACION", (object)evaluacion.IdEvaluacion ?? DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@ID_EMPLEADO", (object)evaluacion.IdEmpleado ?? DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@ID_JEFE", (object)evaluacion.IdJefe ?? DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@ANIO", (object)evaluacion.Anio ?? DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@ESTADO", evaluacion.Estado ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@FECHA_INICIO", (object)evaluacion.FechaInicio ?? DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@FECHA_LIMITE", (object)evaluacion.FechaLimite ?? DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@FECHA_FINALIZACION", (object)evaluacion.FechaFinalizacion ?? DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@CALIFICACION_FINAL", (object)evaluacion.CalificacionFinal ?? DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@OBSERVACIONES", evaluacion.Observaciones ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@USUARIO_CREACION", "SISTEMA"));
            cmd.Parameters.Add(new SqlParameter("@FASE", (object)evaluacion.Fase ?? DBNull.Value));

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
        /// Ejecuta SP para mostrar evaluaciones según filtros.
        /// Tipos: 0=Todas, 1=Por ID, 2=Por Empleado, 3=Por Estado, 4=Por Año
        /// </summary>
        public async Task<IEnumerable<GTHEvaluacion>> Mostrar(
            int tipo,
            int? idEvaluacion = null,
            long? idEmpleado = null,
            string estado = null,
            int? anio = null)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("GTH_MostrarEvaluacion", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));
            cmd.Parameters.Add(new SqlParameter("@ID_EVALUACION", idEvaluacion ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@ID_EMPLEADO", idEmpleado ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@ESTADO", estado ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@ANIO", anio ?? (object)DBNull.Value));

            await sql.OpenAsync();
            var list = new List<GTHEvaluacion>();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(new GTHEvaluacion
                {
                    IdEvaluacion = reader["ID_EVALUACION"] != DBNull.Value
                                          ? Convert.ToInt32(reader["ID_EVALUACION"])
                                          : 0,
                    IdEmpleado = reader["ID_EMPLEADO"] != DBNull.Value
                                          ? Convert.ToInt64(reader["ID_EMPLEADO"])
                                          : 0,
                    IdJefe = reader["ID_JEFE"] != DBNull.Value
                                          ? Convert.ToInt64(reader["ID_JEFE"])
                                          : (long?)null,
                    Anio = reader["ANIO"] != DBNull.Value
                                          ? Convert.ToInt32(reader["ANIO"])
                                          : 0,
                    Estado = reader["ESTADO"]?.ToString(),
                    FechaInicio = reader["FECHA_INICIO"] != DBNull.Value
                                          ? Convert.ToDateTime(reader["FECHA_INICIO"])
                                          : (DateTime?)null,
                    FechaLimite = reader["FECHA_LIMITE"] != DBNull.Value
                                          ? Convert.ToDateTime(reader["FECHA_LIMITE"])
                                          : (DateTime?)null,
                    FechaFinalizacion = reader["FECHA_FINALIZACION"] != DBNull.Value
                                          ? Convert.ToDateTime(reader["FECHA_FINALIZACION"])
                                          : (DateTime?)null,
                    CalificacionFinal = reader["CALIFICACION_FINAL"] != DBNull.Value
                                          ? Convert.ToDecimal(reader["CALIFICACION_FINAL"])
                                          : (decimal?)null,
                    Observaciones = reader["OBSERVACIONES"]?.ToString(),
                    FechaCreacion = reader["FECHA_CREACION"] != DBNull.Value
                                          ? Convert.ToDateTime(reader["FECHA_CREACION"])
                                          : (DateTime?)null,
                    FechaModificacion = reader["FECHA_MODIFICACION"] != DBNull.Value
                                          ? Convert.ToDateTime(reader["FECHA_MODIFICACION"])
                                          : (DateTime?)null,
                    UsuarioCreacion = reader["USUARIO_CREACION"]?.ToString(),
                    Fase = reader["FASE"] != DBNull.Value
                                          ? Convert.ToInt32(reader["FASE"])
                                          : (int?)null
                });
            }
            return list;
        }

        /// <summary>
        /// Ejecuta SP para cambiar la fase de una evaluación específica.
        /// </summary>
        public async Task<IEnumerable<Generica>> CambiarFase(int idEvaluacion, int fase)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("SP_Gestionar_GTH_EVALUACION", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@Tipo", 5)); // Tipo 5 = Cambiar Fase
            cmd.Parameters.Add(new SqlParameter("@ID_EVALUACION", idEvaluacion));
            cmd.Parameters.Add(new SqlParameter("@FASE", fase));

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
    }
}
