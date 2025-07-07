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
    public class GTHCertificacionRepository
    {
        private readonly string _connectionString;

        public GTHCertificacionRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Conexion");
        }

        /// <summary>
        /// Ejecuta SP para insertar, actualizar o eliminar una certificación.
        /// </summary>
        public async Task<IEnumerable<Generica>> Gestionar(int tipo, GTHCertificacion certificacion)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("SP_Gestionar_GTH_CERTIFICACION", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));
            cmd.Parameters.Add(new SqlParameter("@ID_CERTIFICACION", certificacion.IdCertificacion));
            cmd.Parameters.Add(new SqlParameter("@CEDULA_EMPLEADO", certificacion.CedulaEmpleado ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@CER_TITULO", certificacion.CerTitulo ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@CER_INSTITUCION", certificacion.CerInstitucion ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@CER_FECHA", certificacion.CerFecha ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@CER_CERTIFICADOURL", certificacion.CerCertificadoUrl ?? (object)DBNull.Value));

            await sql.OpenAsync();
            var response = new List<Generica>();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                response.Add(new Generica
                {
                    valor1 = Convert.ToInt16(reader["CodigoEstado"]),
                    valor2 = reader["Resultado"].ToString()
                });
            }
            return response;
        }

        /// <summary>
        /// Ejecuta SP para mostrar certificaciones según filtros.
        /// </summary>
        public async Task<IEnumerable<GTHCertificacion>> Mostrar(
            int tipo,
            string cedulaEmpleado = null)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("GTH_MostrarCertificaciones", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@CEDULA_EMPLEADO", cedulaEmpleado ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));

            await sql.OpenAsync();
            var list = new List<GTHCertificacion>();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(new GTHCertificacion
                {
                    IdCertificacion = reader["ID_CERTIFICACION"] != DBNull.Value
                                          ? Convert.ToInt32(reader["ID_CERTIFICACION"])
                                          : 0,
                    CedulaEmpleado = reader["CEDULA_EMPLEADO"]?.ToString(),
                    CerTitulo = reader["CER_TITULO"]?.ToString(),
                    CerInstitucion = reader["CER_INSTITUCION"]?.ToString(),
                    CerFecha = reader["CER_FECHA"] != DBNull.Value
                                   ? Convert.ToDateTime(reader["CER_FECHA"])
                                   : (DateTime?)null,
                    CerCertificadoUrl = reader["CER_CERTIFICADOURL"]?.ToString()
                });
            }
            return list;
        }
    }
}
