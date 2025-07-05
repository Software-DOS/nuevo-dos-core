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
    public class GTHDependienteRepository
    {
        private readonly string _connectionString;

        public GTHDependienteRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Conexion");
        }

        /// <summary>
        /// Ejecuta SP para insertar, actualizar o eliminar un dependiente.
        /// </summary>
        public async Task<IEnumerable<Generica>> Gestionar(int tipo, GTHDependiente dependiente)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("SP_Gestionar_GTH_DEPENDIENTE", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));
            cmd.Parameters.Add(new SqlParameter("@ID_DEPENDIENTE", dependiente.IdDependiente));
            cmd.Parameters.Add(new SqlParameter("@CEDULA_EMPLEADO", dependiente.CedulaEmpleado ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@DEP_NOMBRE", dependiente.DepNombre ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@DEP_FECHANACIMIENTO", dependiente.DepFechaNacimiento ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@DEP_DISCAPACIDAD", dependiente.DepDiscapacidad ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@DEP_DOCUMENTOURL", dependiente.DepDocumentoUrl ?? (object)DBNull.Value));

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
        /// Ejecuta SP para mostrar dependientes según filtros.
        /// </summary>
        public async Task<IEnumerable<GTHDependiente>> Mostrar(
            int tipo,
            string cedulaEmpleado = null)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("GTH_MostrarDependientes", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@CEDULA_EMPLEADO", cedulaEmpleado ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));

            await sql.OpenAsync();
            var list = new List<GTHDependiente>();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(new GTHDependiente
                {
                    IdDependiente = reader["ID_DEPENDIENTE"] != DBNull.Value
                                          ? Convert.ToInt32(reader["ID_DEPENDIENTE"])
                                          : 0,
                    CedulaEmpleado = reader["CEDULA_EMPLEADO"]?.ToString(),
                    DepNombre = reader["DEP_NOMBRE"]?.ToString(),
                    DepFechaNacimiento = reader["DEP_FECHANACIMIENTO"] != DBNull.Value
                                               ? Convert.ToDateTime(reader["DEP_FECHANACIMIENTO"])
                                               : (DateTime?)null,
                    DepDiscapacidad = reader["DEP_DISCAPACIDAD"] != DBNull.Value
                                        ? Convert.ToBoolean(reader["DEP_DISCAPACIDAD"])
                                        : (bool?)null,
                    DepDocumentoUrl = reader["DEP_DOCUMENTOURL"]?.ToString()
                });
            }
            return list;
        }
    }
}
