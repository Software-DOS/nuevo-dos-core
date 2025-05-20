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
    public class GTHFormacionAcademicaRepository
    {
        private readonly string _connectionString;

        public GTHFormacionAcademicaRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Conexion");
        }

        /// <summary>
        /// Ejecuta SP para insertar, actualizar o eliminar formación académica.
        /// </summary>
        public async Task<IEnumerable<Generica>> Manage(int tipo, GTHFormacionAcademica formacion)
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
                response.Add(new Generica
                {
                    valor1 = Convert.ToInt16(reader["Codigo"]),
                    valor2 = reader["Mensaje"].ToString()
                });
            }
            return response;
        }

        /// <summary>
        /// Ejecuta SP para mostrar formación académica según filtros.
        /// </summary>
        public async Task<IEnumerable<GTHFormacionAcademica>> Show(int tipo,
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
                list.Add(new GTHFormacionAcademica
                {
                    IdFormacion = (long)reader["ID_FORMACION"],
                    IdInfoProf = reader["ID_INFOPROF"] as long?,
                    Institucion = reader["FORM_INSTITUCION"].ToString(),
                    AnioInicio = reader["FORM_ANIOINICIO"] as DateTime?,
                    AnioGraduacion = reader["FORM_ANIOGRADUACION"] as DateTime?,
                    Especialidad = reader["FORM_ESPECIALIDAD"].ToString(),
                    Promedio = reader["FORM_PROMEDIO"] as double?,
                    Descripcion = reader["FORM_DESCRIPCION"].ToString(),
                    UltimaActualizacion = reader["FORM_ULTIMAACTUALIZACION"] as DateTime?
                });
            }
            return list;
        }
    }
}
