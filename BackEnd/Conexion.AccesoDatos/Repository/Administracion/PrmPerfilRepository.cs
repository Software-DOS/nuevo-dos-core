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
    public class PrmPerfilRepository
    {
        private readonly string _connectionString;

        public PrmPerfilRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Conexion");
        }

        public async Task<IEnumerable<Generica>> Insert(PrmPerfil prmPerfil)
        {
            using (SqlConnection sql = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("InsertarModificarEliminarPrmPerfil", sql))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@IdPerfil", prmPerfil.IdPerfil));
                    cmd.Parameters.Add(new SqlParameter("@Descripcion", prmPerfil.Descripcion));
                    cmd.Parameters.Add(new SqlParameter("@Estado", prmPerfil.Estado));
                    cmd.Parameters.Add(new SqlParameter("@Tipo", prmPerfil.Tipo));
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

        public async Task Modify(PrmPerfil prmPerfil)
        {
            using (SqlConnection sql = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("InsertarModificarEliminarPrmPerfil", sql))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@IdPerfil", prmPerfil.IdPerfil));
                    cmd.Parameters.Add(new SqlParameter("@Descripcion", prmPerfil.Descripcion));
                    cmd.Parameters.Add(new SqlParameter("@Estado", prmPerfil.Estado));
                    cmd.Parameters.Add(new SqlParameter("@Tipo", prmPerfil.Tipo));
                    await sql.OpenAsync();
                    await cmd.ExecuteNonQueryAsync();
                    return;
                }
            }
        }

        public async Task<IEnumerable<PrmPerfil>> GetByMostrarPrmPerfil(string Descripcion)
        {
            using (SqlConnection sql = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("MostrarPrmPerfil", sql))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@Descripcion", Descripcion));
                    var response = new List<PrmPerfil>();
                    await sql.OpenAsync();

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            response.Add(MapToPrmPerfil(reader));
                        }
                    }

                    return response;
                }
            }
        }

        public async Task<IEnumerable<PrmPerfil>> GetByMostrarPrmPerfilId(Int64 IdPerfil)
        {
            using (SqlConnection sql = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("WebMostrarPrmPerfil", sql))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@IdPerfil", IdPerfil));
                    var response = new List<PrmPerfil>();
                    await sql.OpenAsync();

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            response.Add(ConsultarPerfil(reader));
                        }
                    }

                    return response;
                }
            }
        }

        private PrmPerfil ConsultarPerfil(SqlDataReader reader)
        {
            return new PrmPerfil()
            {
                IdPerfil = (Int64)reader["IdPerfil"],
                Descripcion = reader["Descripcion"].ToString(),
            };
        }

        private PrmPerfil MapToPrmPerfil(SqlDataReader reader)
        {
            return new PrmPerfil()
            {
                IdPerfil = (Int64)reader["IdPerfil"],
                Descripcion = reader["Descripcion"].ToString(),
                Estado = (Int32)reader["Estado"],
            };
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
