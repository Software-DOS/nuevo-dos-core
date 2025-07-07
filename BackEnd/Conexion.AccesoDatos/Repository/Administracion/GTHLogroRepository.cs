using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Conexion.Entidad.Administracion;
using Microsoft.Extensions.Configuration;

namespace Conexion.AccesoDatos.Repository.Administracion
{
    public class GTHLogroRepository
    {
        private readonly string _connectionString;

        public GTHLogroRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Conexion");
        }

        /// <summary>
        /// Ejecuta SP para mostrar logros según filtros.
        /// 1 = IdLogro, 2 = IdInfoProf, 3 = TipoLogro.
        /// </summary>
        public async Task<IEnumerable<GTHLogro>> Mostrar(
            int tipo,
            int? idLogro = null,
            int? idInfoProf = null,
            string tipoLogro = null)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("GTH_MostrarLogro", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@ID_Logro", idLogro ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@ID_Infoprof", idInfoProf ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@Logro_Tipo", tipoLogro ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));

            await sql.OpenAsync();
            var list = new List<GTHLogro>();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var logroVal = reader["ID_LOGRO"];
                var infoVal = reader["ID_INFOPROF"];

                // Funciones locales para lectura segura
                string SafeGetString(string col)
                {
                    try { return reader[col]?.ToString(); }
                    catch (IndexOutOfRangeException) { return string.Empty; }
                }
                DateTime? SafeGetDate(string col)
                {
                    try { return reader[col] as DateTime?; }
                    catch (IndexOutOfRangeException) { return null; }
                }

                list.Add(new GTHLogro
                {
                    IdLogro = logroVal != DBNull.Value
                        ? Convert.ToInt64(logroVal)
                        : 0L,
                    IdInfoProf = infoVal != DBNull.Value
                        ? Convert.ToInt64(infoVal)
                        : (long?)null,
                    Titulo = SafeGetString("LOGRO_TITULO"),
                    LogroTipo = SafeGetString("LOGRO_TIPO"),
                    Descripcion = SafeGetString("LOGRO_DESCRIPCION"),
                    FechaLogro = SafeGetDate("LOGRO_FECHALOGRO"),
                    Evidencia = SafeGetString("LOGRO_EVIDENCIA")
                });
            }
            return list;
        }

        /// <summary>
        /// Ejecuta SP para insertar, actualizar o eliminar un logro.
        /// 1 = Insertar, 2 = Editar, 3 = Eliminar.
        /// </summary>
        public async Task<IEnumerable<Generica>> Gestionar(
            int tipo,
            GTHLogro logro)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("SP_Gestionar_GTH_LOGRO", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));
            cmd.Parameters.Add(new SqlParameter("@ID_LOGRO", logro.IdLogro));
            cmd.Parameters.Add(new SqlParameter("@ID_INFOPROF", logro.IdInfoProf ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@LOGRO_TITULO", logro.Titulo ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@LOGRO_TIPO", logro.LogroTipo ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@LOGRO_DESCRIPCION", logro.Descripcion ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@LOGRO_FECHALOGRO", logro.FechaLogro ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@LOGRO_EVIDENCIA", logro.Evidencia ?? (object)DBNull.Value));

            await sql.OpenAsync();
            var response = new List<Generica>();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var codeVal = reader["Codigo"];
                var msgVal = reader["Mensaje"];

                response.Add(new Generica
                {
                    valor1 = codeVal != DBNull.Value
                        ? Convert.ToInt32(codeVal)
                        : 0,
                    valor2 = msgVal != DBNull.Value
                        ? msgVal.ToString()
                        : string.Empty
                });
            }
            return response;
        }
    }
}
