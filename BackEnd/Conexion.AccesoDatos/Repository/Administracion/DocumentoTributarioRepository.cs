using Conexion.Entidad.Administracion;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Conexion.AccesoDatos.Repository.Administracion
{
    public class DocumentoTributarioRepository
    {
        private readonly string _connectionString;

        public DocumentoTributarioRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Conexion");
        }

        public async Task<IEnumerable<SecuencialDoc>> GetByMostrarSecuencialDoc(string Nombre, Int32 Tipo)
        {
            using (SqlConnection sql = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("MostrarSecuencialDoc", sql))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@Nombre", Nombre));
                    cmd.Parameters.Add(new SqlParameter("@Tipo", Tipo));
                    var response = new List<SecuencialDoc>();
                    await sql.OpenAsync();

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            response.Add(MapToSucursal(reader));
                        }
                    }

                    return response;
                }
            }
        }

        public async Task<IEnumerable<Combo>> GetByMostrarCombo(Int32 Tipo, Int64 IdCliente)
        {
            using (SqlConnection sql = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("MostrarCombo", sql))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@Tipo", Tipo));
                    cmd.Parameters.Add(new SqlParameter("@IdCliente", IdCliente));
                    var response = new List<Combo>();
                    await sql.OpenAsync();

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            response.Add(MapToMedios(reader));
                        }
                    }

                    return response;
                }
            }
        }

        private Combo MapToMedios(SqlDataReader reader)
        {
            return new Combo()
            {
                IdProceso = (Int64)reader["IdProceso"],
                Descripcion = reader["Descripcion"].ToString()
            };
        }

        private SecuencialDoc MapToSucursal(SqlDataReader reader)
        {
            return new SecuencialDoc()
            {
                Secuencial = (Int32)reader["Secuencial"],
                PuntoEmision = reader["PuntoEmision"].ToString(),
                Establecimiento = reader["Establecimiento"].ToString()
            };
        }

    }
}
