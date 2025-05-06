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
    public class ClienteServicioRepository
    {
        private readonly string _connectionString;

        public ClienteServicioRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Conexion");
        }

        public async Task<IEnumerable<Generica>> Insert(ClienteServicio clienteServicio )
        {
            using (SqlConnection sql = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("InsertarModificarEliminarClienteServicio", sql))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@IdClienteServicio", clienteServicio.IdClienteServicio));
                    cmd.Parameters.Add(new SqlParameter("@IdTipoIdentificacion", clienteServicio.IdTipoIdentificacion));
                    cmd.Parameters.Add(new SqlParameter("@RuCedula", clienteServicio.RuCedula));
                    cmd.Parameters.Add(new SqlParameter("@Descripcion", clienteServicio.Descripcion));
                    cmd.Parameters.Add(new SqlParameter("@Direccion", clienteServicio.Direccion));
                    cmd.Parameters.Add(new SqlParameter("@Email", clienteServicio.Email));
                    cmd.Parameters.Add(new SqlParameter("@Telefono", clienteServicio.Telefono));
                    cmd.Parameters.Add(new SqlParameter("@Estado", clienteServicio.Estado));
                    cmd.Parameters.Add(new SqlParameter("@Tipo", clienteServicio.Tipo));
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

        public async Task<IEnumerable<ClienteServicio>> GetByMostrarClienteServicio(Int64 IdClienteServicio, Int32 Tipo)
        {
            using (SqlConnection sql = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("MostrarClienteServicio", sql))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@IdClienteServicio", IdClienteServicio));
                    cmd.Parameters.Add(new SqlParameter("@Tipo", Tipo));
                    var response = new List<ClienteServicio>();
                    await sql.OpenAsync();

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            response.Add(MapToClienteServicio(reader));
                        }
                    }

                    return response;
                }
            }
        }

        public async Task<IEnumerable<ClienteServicio>> GetByMostrarClienteServicioLike(Int64 IdClienteServicio,string Busquedad, Int32 Tipo)
        {
            using (SqlConnection sql = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("MostrarClienteServicio", sql))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@IdClienteServicio", IdClienteServicio));
                    cmd.Parameters.Add(new SqlParameter("@Busquedad", Busquedad));
                    cmd.Parameters.Add(new SqlParameter("@Tipo", Tipo));
                    var response = new List<ClienteServicio>();
                    await sql.OpenAsync();

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            response.Add(MapToClienteServicio(reader));
                        }
                    }

                    return response;
                }
            }
        }

        private ClienteServicio MapToClienteServicio(SqlDataReader reader)
        {
            return new ClienteServicio()
            {
                IdClienteServicio = (Int64)reader["IdClienteServicio"],
                IdTipoIdentificacion = (Int32)reader["IdTipoIdentificacion"],
                RuCedula = reader["RuCedula"].ToString(),
                Descripcion = reader["Descripcion"].ToString(),
                Direccion = reader["Direccion"].ToString(),
                Email = reader["Email"].ToString(),
                Telefono = reader["Telefono"].ToString(),
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
