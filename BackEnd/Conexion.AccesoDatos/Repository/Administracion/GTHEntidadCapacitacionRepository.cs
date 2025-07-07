using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Conexion.Entidad.Administracion;
using Microsoft.Extensions.Configuration;

namespace Conexion.AccesoDatos.Repository.Administracion
{
    public class GTHEntidadCapacitacionRepository
    {
        private readonly string _connectionString;

        public GTHEntidadCapacitacionRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Conexion");
        }

        /// <summary>
        /// Ejecuta SP para mostrar entidades de capacitación según filtros.
        /// 1 = IdEntidadCap, 2 = Nombre.
        /// </summary>
        public async Task<IEnumerable<GTHEntidadCapacitacion>> Mostrar(int tipo,
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
                var idVal = reader["ID_ENTIDADCAP"];

                list.Add(new GTHEntidadCapacitacion
                {
                    IdEntidadCap = idVal != DBNull.Value
                        ? Convert.ToInt64(idVal)
                        : 0L,
                    Nombre = reader["ECAP_NOMBRE"]?.ToString(),
                    Pagina = reader["ECAP_PAGINA"]?.ToString(),
                    InfoContacto = reader["ECAP_INFOCONTACTO"]?.ToString(),
                    Descripcion = reader["ECAP_DESCRIPCION"]?.ToString()
                });
            }
            return list;
        }

        /// <summary>
        /// Ejecuta SP para insertar, actualizar o eliminar una entidad de capacitación.
        /// 1 = Insertar, 2 = Editar, 3 = Eliminar.
        /// </summary>
        public async Task<IEnumerable<Generica>> Gestionar(int tipo, GTHEntidadCapacitacion entidad)
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
    }
}
