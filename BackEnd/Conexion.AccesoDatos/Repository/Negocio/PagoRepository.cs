using Conexion.Entidad.Administracion;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Conexion.AccesoDatos.Repository.Negocio
{
    public class PagoRepository
    {
        private readonly string _connectionString;

        public PagoRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Conexion");
        }

        public async Task<IEnumerable<Generica>> InsertFacturaServicio(string json, string jsonFinal, string Descripcion, int Estado, int Tipo, string FechaEmision)
        {
            using (SqlConnection sql = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("InsertarModificarEliminarFacturaServicio", sql))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@json", json));
                    cmd.Parameters.Add(new SqlParameter("@jsonFinal", jsonFinal));
                    cmd.Parameters.Add(new SqlParameter("@Descripcion", Descripcion));
                    cmd.Parameters.Add(new SqlParameter("@Estado", Estado));
                    cmd.Parameters.Add(new SqlParameter("@FechaEmision", FechaEmision));
                    cmd.Parameters.Add(new SqlParameter("@Tipo", Tipo));
                    await sql.OpenAsync();
                    //await cmd.ExecuteNonQueryAsync();
                    var response = new List<Generica>();
                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            response.Add(MapToGenerica(reader));
                        }
                    }

                    return response;
                }
            }
        }

        private Generica MapToGenerica(SqlDataReader reader)
        {
            return new Generica()
            {
                valor1 = (Int16)reader["valor1"],
                valor2 = reader["valor2"].ToString()
            };
        }


    }
}
