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
    public class GTHDepartamentoRepository
    {
        private readonly string _connectionString;

        public GTHDepartamentoRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Conexion");
        }

        /// <summary>
        /// Ejecuta SP para insertar, actualizar o eliminar un departamento.
        /// </summary>
        public async Task<IEnumerable<Generica>> Manage(int tipo, GTHDepartamento departamento)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("SP_Gestionar_GTH_DEPARTAMENTO", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));
            cmd.Parameters.Add(new SqlParameter("@ID_DEPARTAMENTO", departamento.IdDepartamento));
            cmd.Parameters.Add(new SqlParameter("@ID_CELULA", departamento.IdCelula ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@DEP_NOMBRE", departamento.Nombre ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@DEP_DESCRIPCION", departamento.Descripcion ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@DEP_JEFE", departamento.Jefe ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@DEP_EMPRESA", departamento.Empresa ?? (object)DBNull.Value));

            await sql.OpenAsync();
            var response = new List<Generica>();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                response.Add(new Generica
                {
                    valor1 = Convert.ToInt16(reader["CodigoEstado"] ?? reader["CodigoEstado"] /* fallback */),
                    valor2 = reader["Resultado"].ToString()
                });
            }
            return response;
        }

        /// <summary>
        /// Ejecuta SP para mostrar departamentos según filtros.
        /// </summary>
        public async Task<IEnumerable<GTHDepartamento>> Show(int tipo,
            int? idDepartamento = null,
            int? idCelula = null,
            string nombre = null)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("GTH_MostrarDepartamento", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@ID_Departamento", idDepartamento ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@ID_Celula", idCelula ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@Dep_Nombre", nombre ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));

            await sql.OpenAsync();
            var list = new List<GTHDepartamento>();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(new GTHDepartamento
                {
                    IdDepartamento = (long)reader["ID_DEPARTAMENTO"],
                    IdCelula = reader["ID_CELULA"] as long?,
                    Nombre = reader["DEP_NOMBRE"].ToString(),
                    Descripcion = reader["DEP_DESCRIPCION"].ToString(),
                    Jefe = reader["DEP_JEFE"].ToString(),
                    Empresa = reader["DEP_EMPRESA"].ToString()
                });
            }
            return list;
        }
    }
}
