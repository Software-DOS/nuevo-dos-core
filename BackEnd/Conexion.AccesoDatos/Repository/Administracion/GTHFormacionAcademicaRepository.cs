using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Conexion.Entidad.Administracion;
using Microsoft.Extensions.Configuration;

namespace Conexion.AccesoDatos.Repository.Administracion
{
    public class GTHFormacionAcademicaRepository
    {
        private readonly string _connectionString;

        public GTHFormacionAcademicaRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Conexion");
        }

        /// <summary>
        /// Ejecuta SP para mostrar formación académica según filtros.
        /// 1 = IdFormacion, 2 = IdInfoProf.
        /// </summary>
        public async Task<IEnumerable<GTHFormacionAcademica>> Mostrar(
            int tipo,
            int? idFormacion = null,
            int? idInfoProf = null)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("GTH_MostrarFormacionAcademica", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@ID_Formacion", idFormacion ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@ID_Infoprof", idInfoProf ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));

            await sql.OpenAsync();
            var list = new List<GTHFormacionAcademica>();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var formVal = reader["ID_FORMACION"];
                var infoVal = reader["ID_INFOPROF"];

                list.Add(new GTHFormacionAcademica
                {
                    IdFormacion = formVal != DBNull.Value
                        ? Convert.ToInt64(formVal)
                        : 0L,
                    IdInfoProf = infoVal != DBNull.Value
                        ? Convert.ToInt64(infoVal)
                        : (long?)null,
                    Institucion = reader["FORM_INSTITUCION"]?.ToString(),
                    AnioInicio = reader["FORM_ANIOINICIO"] as DateTime?,
                    AnioGraduacion = reader["FORM_ANIOGRADUACION"] as DateTime?,
                    Especialidad = reader["FORM_ESPECIALIDAD"]?.ToString(),
                    Promedio = reader["FORM_PROMEDIO"] as double?,
                    Descripcion = reader["FORM_DESCRIPCION"]?.ToString(),
                    UltimaActualizacion = reader["FORM_ULTIMAACTUALIZACION"] as DateTime?
                });
            }
            return list;
        }

        /// <summary>
        /// Ejecuta SP para insertar, actualizar o eliminar formación académica.
        /// </summary>
        public async Task<IEnumerable<Generica>> Gestionar(int tipo, GTHFormacionAcademica formacion)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("SP_Gestionar_GTH_FORMACIONACADEMICA", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));
            cmd.Parameters.Add(new SqlParameter("@ID_FORMACION", formacion.IdFormacion));
            cmd.Parameters.Add(new SqlParameter("@ID_INFOPROF", formacion.IdInfoProf ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@FORM_INSTITUCION", formacion.Institucion ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@FORM_ANIOINICIO", formacion.AnioInicio ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@FORM_ANIOGRADUACION", formacion.AnioGraduacion ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@FORM_ESPECIALIDAD", formacion.Especialidad ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@FORM_PROMEDIO", formacion.Promedio ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@FORM_DESCRIPCION", formacion.Descripcion ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@FORM_ULTIMAACTUALIZACION", formacion.UltimaActualizacion ?? (object)DBNull.Value));

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
    }
}
