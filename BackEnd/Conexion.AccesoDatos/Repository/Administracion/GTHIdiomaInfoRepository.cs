using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Conexion.Entidad.Administracion;
using Microsoft.Extensions.Configuration;

namespace Conexion.AccesoDatos.Repository.Administracion
{
    public class GTHIdiomaInfoRepository
    {
        private readonly string _connectionString;

        public GTHIdiomaInfoRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Conexion");
        }

        /// <summary>
        /// Ejecuta SP para insertar o eliminar asociación idioma ↔ información profesional.
        /// 1 = Insertar, 2 = Eliminar.
        /// </summary>
        public async Task<IEnumerable<Generica>> Gestionar(int tipo, GTHIdiomaInfo idiomaInfo)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("SP_Gestionar_GTH_IDIOMAINFO", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));
            cmd.Parameters.Add(new SqlParameter("@ID_INFOPROF", idiomaInfo.IdInfoProf));
            cmd.Parameters.Add(new SqlParameter("@ID_IDIOMA", idiomaInfo.IdIdioma));

            await sql.OpenAsync();
            var response = new List<Generica>();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var codeVal = reader["Codigo"];
                var msgVal = reader["Mensaje"];
                response.Add(new Generica
                {
                    valor1 = codeVal != DBNull.Value ? Convert.ToInt32(codeVal) : 0,
                    valor2 = msgVal != DBNull.Value ? msgVal.ToString() : string.Empty
                });
            }
            return response;
        }

        /// <summary>
        /// Ejecuta SP para mostrar asociaciones idioma ↔ información profesional según filtros.
        /// 1 = IdInfoProf, 2 = IdIdioma.
        /// </summary>
        public async Task<IEnumerable<GTHIdiomaInfo>> Mostrar(int tipo,
            int? idInfoProf = null,
            int? idIdioma = null)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("GTH_MostrarIdiomaInfo", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@ID_Infoprof", idInfoProf ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@ID_Idioma", idIdioma ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));

            await sql.OpenAsync();
            var list = new List<GTHIdiomaInfo>();
            using var reader = await cmd.ExecuteReaderAsync();

            // Local helpers for safe reading
            object SafeGet(string col)
            {
                try { return reader[col]; }
                catch (IndexOutOfRangeException) { return DBNull.Value; }
            }
            long SafeGetLong(string col)
            {
                var val = SafeGet(col);
                return val != DBNull.Value ? Convert.ToInt64(val) : 0L;
            }
            long? SafeGetNullableLong(string col)
            {
                var val = SafeGet(col);
                return val != DBNull.Value ? Convert.ToInt64(val) : (long?)null;
            }

            while (await reader.ReadAsync())
            {
                list.Add(new GTHIdiomaInfo
                {
                    IdInfoProf = SafeGetLong("ID_INFOPROF"),
                    IdIdioma = SafeGetLong("ID_IDIOMA")
                });
            }
            return list;
        }
    }
}
