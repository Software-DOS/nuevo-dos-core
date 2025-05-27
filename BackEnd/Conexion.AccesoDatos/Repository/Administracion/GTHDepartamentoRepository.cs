using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Conexion.Entidad.Administracion;
using Microsoft.Extensions.Configuration;

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
        /// Ejecuta SP para mostrar departamentos según filtros.
        /// 1 = IdDepartamento, 2 = IdCelula.
        /// </summary>
        public async Task<IEnumerable<GTHDepartamento>> Mostrar(int tipo,
            long? idDepartamento = null,
            long? idCelula = null)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("GTH_MostrarDepartamento", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@ID_Departamento", idDepartamento ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@ID_Celula", idCelula ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));

            await sql.OpenAsync();
            var list = new List<GTHDepartamento>();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var depVal = reader["ID_DEPARTAMENTO"];
                var celVal = reader["ID_CELULA"];

                list.Add(new GTHDepartamento
                {
                    IdDepartamento = depVal != DBNull.Value
                        ? Convert.ToInt64(depVal)
                        : 0L,
                    IdCelula = celVal != DBNull.Value
                        ? Convert.ToInt64(celVal)
                        : (long?)null,
                    Nombre = reader["DEP_NOMBRE"]?.ToString(),
                    Descripcion = reader["DEP_DESCRIPCION"]?.ToString(),
                    Jefe = reader["DEP_JEFE"]?.ToString(),
                    Empresa = reader["DEP_EMPRESA"]?.ToString()
                });
            }
            return list;
        }

        /// <summary>
        /// Ejecuta SP para insertar, actualizar o eliminar un departamento.
        /// 1 = Insertar, 2 = Editar, 3 = Eliminar.
        /// </summary>
        public async Task<IEnumerable<Generica>> Gestionar(int tipo, GTHDepartamento departamento)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("SP_Gestionar_GTH_Departamento", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));
            cmd.Parameters.Add(new SqlParameter("@ID_Departamento", departamento.IdDepartamento));
            cmd.Parameters.Add(new SqlParameter("@ID_Celula", departamento.IdCelula ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@DEP_Nombre", departamento.Nombre ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@DEP_Descripcion", departamento.Descripcion ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@DEP_Jefe", departamento.Jefe ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@DEP_Empresa", departamento.Empresa ?? (object)DBNull.Value));

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