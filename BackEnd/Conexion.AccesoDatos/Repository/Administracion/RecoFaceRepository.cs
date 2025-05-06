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
    public class RecoFaceRepository
    {
        private readonly string _connectionString;

        public RecoFaceRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Conexion");
        }

        public async Task<IEnumerable<Generica>> Insert(RecoFaceGuardar recoFace)
        {
            using (SqlConnection sql = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("InsertarModificarEliminarRecoFace", sql))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@IdRecoFace", recoFace.IdRecoFace));
                    cmd.Parameters.Add(new SqlParameter("@Json", recoFace.Json));
                    cmd.Parameters.Add(new SqlParameter("@Estado", recoFace.Estado));
                    cmd.Parameters.Add(new SqlParameter("@Tipo", recoFace.Tipo));
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

        public async Task<IEnumerable<RecoFace>> GetByMostrarRecoFace(Int64 IdRecoFace, Int32 Tipo)
        {
            using (SqlConnection sql = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("MostrarRecoFace", sql))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@IdRecoFace", IdRecoFace));
                    cmd.Parameters.Add(new SqlParameter("@Tipo", Tipo));
                    var response = new List<RecoFace>();
                    await sql.OpenAsync();

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            response.Add(MapToReoFace(reader));
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

        private RecoFace MapToReoFace(SqlDataReader reader)
        {
            return new RecoFace()
            {
                IdRecoFace = (Int64)reader["IdRecoFace"],
                NombreArchivo = reader["NombreArchivo"].ToString(),
                ArchivoBase64 = reader["ArchivoBase64"].ToString(),
                DescriptorString = reader["DescriptorString"].ToString(),
                Estado = (Int32)reader["Estado"],
            };
        }

    }
}
