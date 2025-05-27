using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Conexion.Entidad.Administracion;
using Microsoft.Extensions.Configuration;

namespace Conexion.AccesoDatos.Repository.Administracion
{
    public class GTHHabInfoRepository
    {
        private readonly string _connectionString;

        public GTHHabInfoRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Conexion");
        }

        /// <summary>
        /// Ejecuta SP para mostrar asociación habilidad ↔ información profesional según filtros.
        /// 1 = IdHabilidad, 2 = IdInfoProf.
        /// </summary>
        public async Task<IEnumerable<GTHHabInfo>> Mostrar(
            int tipo,
            int? idHabilidad = null,
            int? idInfoProf = null)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("GTH_MostrarHabInfo", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@ID_Habilidad", idHabilidad ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@ID_InfoProf", idInfoProf ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));

            await sql.OpenAsync();
            var list = new List<GTHHabInfo>();
            using var reader = await cmd.ExecuteReaderAsync();

            long SafeGetLong(string col)
            {
                try
                {
                    var val = reader[col];
                    return val != DBNull.Value ? Convert.ToInt64(val) : 0L;
                }
                catch (IndexOutOfRangeException)
                {
                    return 0L;
                }
            }

            while (await reader.ReadAsync())
            {
                list.Add(new GTHHabInfo
                {
                    IdHabilidad = SafeGetLong("ID_HABILIDAD"),
                    IdInfoProf = SafeGetLong("ID_INFOPROF")
                });
            }
            return list;
        }

        /// <summary>
        /// Ejecuta SP para insertar o eliminar asociación habilidad ↔ información profesional.
        /// 1 = Insertar, 2 = Eliminar.
        /// </summary>
        public async Task<IEnumerable<Generica>> Gestionar(
            int tipo,
            GTHHabInfo entidad)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("SP_Gestionar_GTH_HabInfo", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));
            cmd.Parameters.Add(new SqlParameter("@ID_Habilidad", entidad.IdHabilidad));
            cmd.Parameters.Add(new SqlParameter("@ID_InfoProf", entidad.IdInfoProf));

            await sql.OpenAsync();
            var response = new List<Generica>();
            using var reader = await cmd.ExecuteReaderAsync();

            object SafeGet(string col)
            {
                try
                {
                    return reader[col];
                }
                catch (IndexOutOfRangeException)
                {
                    return DBNull.Value;
                }
            }

            while (await reader.ReadAsync())
            {
                // Obtiene código del SP, puede ser CodigoEstado o Codigo
                var codeValObj = SafeGet("CodigoEstado");
                if (codeValObj == DBNull.Value)
                    codeValObj = SafeGet("Codigo");

                // Obtiene mensaje, puede ser Resultado o Mensaje
                var msgValObj = SafeGet("Resultado");
                if (msgValObj == DBNull.Value)
                    msgValObj = SafeGet("Mensaje");

                int valor1 = 0;
                if (codeValObj != DBNull.Value && int.TryParse(codeValObj.ToString(), out var tmp))
                    valor1 = tmp;

                string valor2 = msgValObj != DBNull.Value ? msgValObj.ToString() : string.Empty;

                response.Add(new Generica
                {
                    valor1 = valor1,
                    valor2 = valor2
                });
            }
            return response;
        }
    }
}
