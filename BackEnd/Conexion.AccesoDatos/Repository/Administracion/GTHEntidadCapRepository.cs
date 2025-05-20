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
    public class GTHEntidadCapRepository
    {
        private readonly string _connectionString;

        public GTHEntidadCapRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Conexion");
        }

        /// <summary>
        /// Ejecuta SP para insertar, actualizar o eliminar una entidad de capacitación.
        /// </summary>
        public async Task<IEnumerable<Generica>> Manage(int tipo, GTHEntidadCapacitacion entidad)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("SP_Gestionar_GTH_ENTIDADCAP", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));
            cmd.Parameters.Add(new SqlParameter("@ID_ENTIDADCAP", entidad.IdEntidadCap));
            cmd.Parameters.Add(new SqlParameter("@ECAP_NOMBRE", entidad.Nombre ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@ECAP_PAGINA", entidad.Pagina ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@ECAP_INFOCONTACTO", entidad.InfoContacto ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@ECAP_DESCRIPCION", entidad.Descripcion ?? (object)DBNull.Value));

            await sql.OpenAsync();
            var response = new List<Generica>();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                response.Add(new Generica
                {
                    valor1 = Convert.ToInt16(reader["CodigoEstado"] as short? ?? reader.GetInt16(reader.GetOrdinal("CodigoEstado"))),
                    valor2 = reader["Resultado"].ToString()
                });
            }
            return response;
        }

        /// <summary>
        /// Ejecuta SP para mostrar entidades de capacitación según filtros.
        /// </summary>
        public async Task<IEnumerable<GTHEntidadCapacitacion>> Show(int tipo,
            int? idEntidadCap = null,
            string nombre = null)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("GTH_MostrarEntidadCap", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@ID_EntidadCap", idEntidadCap ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@ECap_Nombre", nombre ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));

            await sql.OpenAsync();
            var list = new List<GTHEntidadCapacitacion>();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(new GTHEntidadCapacitacion
                {
                    IdEntidadCap = (long)reader["ID_ENTIDADCAP"],
                    Nombre = reader["ECAP_NOMBRE"].ToString(),
                    Pagina = reader["ECAP_PAGINA"].ToString(),
                    InfoContacto = reader["ECAP_INFOCONTACTO"].ToString(),
                    Descripcion = reader["ECAP_DESCRIPCION"].ToString()
                });
            }
            return list;
        }
    }
}
