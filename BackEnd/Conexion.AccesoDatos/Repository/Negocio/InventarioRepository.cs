using Conexion.Entidad.Administracion;
using Conexion.Entidad.Negocio;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Conexion.AccesoDatos.Repository.Negocio
{
   public class InventarioRepository
    {
        private readonly string _connectionString;

        public InventarioRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Conexion");
        }

        public async Task<IEnumerable<Generica>> Insert(Inventario inventario)
        {
            using (SqlConnection sql = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("InsertarModificarEliminarInventario", sql))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@IdInventario", inventario.IdInventario));
                    cmd.Parameters.Add(new SqlParameter("@IdEmpresa", inventario.IdEmpresa));
                    cmd.Parameters.Add(new SqlParameter("@CodigoPrincipal", inventario.CodigoPrincipal));
                    cmd.Parameters.Add(new SqlParameter("@CodigoBarra", inventario.CodigoBarra));
                    cmd.Parameters.Add(new SqlParameter("@Descripcion", inventario.Descripcion));
                    cmd.Parameters.Add(new SqlParameter("@Stock", inventario.Stock));
                    cmd.Parameters.Add(new SqlParameter("@PrecioPublico", inventario.PrecioPublico));
                    cmd.Parameters.Add(new SqlParameter("@Costo", inventario.Costo));
                    cmd.Parameters.Add(new SqlParameter("@Servicio", inventario.Servicio));
                    cmd.Parameters.Add(new SqlParameter("@Iva", inventario.Iva));
                    cmd.Parameters.Add(new SqlParameter("@Imagen", inventario.Imagen));
                    cmd.Parameters.Add(new SqlParameter("@Impresion", inventario.Impresion));
                    cmd.Parameters.Add(new SqlParameter("@Json", inventario.json));
                    cmd.Parameters.Add(new SqlParameter("@Estado", inventario.Estado));
                    cmd.Parameters.Add(new SqlParameter("@Tipo", inventario.Tipo));
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

        public async Task<IEnumerable<Inventario>> GetByMostrarInventario(Int64 IdInventario, Int64 IdEmpresa, string Descripcion, Int32 Tipo)
        {
            using (SqlConnection sql = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("MostrarInventario", sql))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@IdInventario", IdInventario));
                    cmd.Parameters.Add(new SqlParameter("@IdEmpresa", IdEmpresa));
                    cmd.Parameters.Add(new SqlParameter("@Descripcion", Descripcion));
                    cmd.Parameters.Add(new SqlParameter("@Tipo", Tipo));
                    var response = new List<Inventario>();
                    await sql.OpenAsync();

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            response.Add(MapToInventario(reader));
                        }
                    }

                    return response;
                }
            }
        }

        private Inventario MapToInventario(SqlDataReader reader)
        {
            return new Inventario()
            {
                IdInventario = (Int64)reader["IdInventario"],
                IdEmpresa = (Int64)reader["IdEmpresa"],
                CodigoPrincipal = reader["CodigoPrincipal"].ToString(),
                CodigoBarra = reader["CodigoBarra"].ToString(),
                Descripcion = reader["Descripcion"].ToString(),
                Stock = (decimal)reader["Stock"],
                PrecioPublico = (decimal)reader["PrecioPublico"],
                Costo = (decimal)reader["Costo"],
                Servicio = reader["Servicio"].ToString(),
                Iva = (int)reader["Iva"],
                Imagen = reader["Imagen"].ToString(),
                Impresion = reader["Impresion"].ToString(),
                Estado =(int)reader["Estado"],
                ListaPrecios = reader["ListaPrecios"].ToString(),
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
