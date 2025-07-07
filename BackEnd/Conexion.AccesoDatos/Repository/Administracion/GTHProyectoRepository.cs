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
    public class GTHProyectoRepository
    {
        private readonly string _connectionString;

        public GTHProyectoRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Conexion");
        }

        /// <summary>
        /// Ejecuta SP para insertar, actualizar o eliminar un proyecto.
        /// </summary>
        public async Task<IEnumerable<Generica>> Gestionar(int tipo, GTHProyecto proyecto)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("SP_Gestionar_GTH_PROYECTO", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));
            cmd.Parameters.Add(new SqlParameter("@ID_PROYECTO", proyecto.IdProyecto));
            cmd.Parameters.Add(new SqlParameter("@CEDULA_EMPLEADO", proyecto.CedulaEmpleado ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@PRO_TITULO", proyecto.ProTitulo ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@PRO_ESPECIALIDAD", proyecto.ProEspecialidad ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@PRO_ANIO", proyecto.ProAnio ?? (object)DBNull.Value));

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
        /// Ejecuta SP para mostrar proyectos según filtros.
        /// </summary>
        public async Task<IEnumerable<GTHProyecto>> Mostrar(
            int tipo,
            string cedulaEmpleado = null)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("GTH_MostrarProyectos", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@CEDULA_EMPLEADO", cedulaEmpleado ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));

            await sql.OpenAsync();
            var list = new List<GTHProyecto>();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(new GTHProyecto
                {
                    IdProyecto = reader["ID_PROYECTO"] != DBNull.Value
                                          ? Convert.ToInt32(reader["ID_PROYECTO"])
                                          : 0,
                    CedulaEmpleado = reader["CEDULA_EMPLEADO"]?.ToString(),
                    ProTitulo = reader["PRO_TITULO"]?.ToString(),
                    ProEspecialidad = reader["PRO_ESPECIALIDAD"]?.ToString(),
                    ProAnio = reader["PRO_ANIO"] != DBNull.Value
                                          ? Convert.ToInt32(reader["PRO_ANIO"])
                                          : (int?)null
                });
            }
            return list;
        }
    }
}
