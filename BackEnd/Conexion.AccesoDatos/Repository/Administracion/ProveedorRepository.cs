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
   public  class ProveedorRepository
    {
        private readonly string _connectionString;

        public ProveedorRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Conexion");
        }

        public async Task<IEnumerable<Proveedor>> GetByMostrarProveedor(Int64 IdProveedor, Int32 Tipo)
        {
            using (SqlConnection sql = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("MostrarProveedor", sql))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@IdProveedor", IdProveedor));
                    cmd.Parameters.Add(new SqlParameter("@Tipo", Tipo));
                    var response = new List<Proveedor>();
                    await sql.OpenAsync();

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            response.Add(MapToProveedor(reader));
                        }
                    }

                    return response;
                }
            }
        }

        public async Task<IEnumerable<Generica>> Insert(Proveedor proveedor)
        {
            using (SqlConnection sql = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("InsertarModificarEliminarProveedor", sql))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@IdProveedor", proveedor.IdProveedor));
                    cmd.Parameters.Add(new SqlParameter("@Nombre", proveedor.Nombre ));
                    cmd.Parameters.Add(new SqlParameter("@NombreComercial", proveedor.NombreComercial ));
                    cmd.Parameters.Add(new SqlParameter("@Rucedula", proveedor.RuCedula ));
                    cmd.Parameters.Add(new SqlParameter("@Direccion", proveedor.Direccion));
                    cmd.Parameters.Add(new SqlParameter("@Telefono", proveedor.Telefono));
                    cmd.Parameters.Add(new SqlParameter("@Email", proveedor.Email));
                    cmd.Parameters.Add(new SqlParameter("@CodContable", proveedor.CodContable));
                    cmd.Parameters.Add(new SqlParameter("@AutorizacionSri", proveedor.AutorizacionSri));
                    cmd.Parameters.Add(new SqlParameter("@FechaAutorizacion", proveedor.FechaAutorizacion));
                    cmd.Parameters.Add(new SqlParameter("@FechaCaducidad", proveedor.FechaCaducidad));
                    cmd.Parameters.Add(new SqlParameter("@Estado", proveedor.Estado));
                    cmd.Parameters.Add(new SqlParameter("@Retencion", proveedor.Retencion));
                    cmd.Parameters.Add(new SqlParameter("@Tipo", proveedor.Tipo));
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

        private Proveedor MapToProveedor(SqlDataReader reader)
        {
            return new Proveedor()
            {
                IdProveedor = (Int64)reader["IdProveedor"],
                IdPlanCuenta = (Int64)reader["IdPlanCuenta"],
                Descripcion = reader["Descripcion"].ToString(),
                Nombre = reader["Nombre"].ToString(),
                NombreComercial = reader["NombreComercial"].ToString(),
                RuCedula = reader["RuCedula"].ToString(),
                Direccion = reader["Direccion"].ToString(),
                Telefono = reader["Telefono"].ToString(),
                Email = reader["Email"].ToString(),
                CodContable = reader["CodContable"].ToString(),
                AutorizacionSri = reader["AutorizacionSri"].ToString(),
                FechaAutorizacion = (DateTime)reader["FechaAutorizacion"],
                FechaCaducidad = (DateTime)reader["FechaCaducidad"],
                Estado = (Int32)reader["Estado"],
                Retencion = reader["Retencion"].ToString(),
            };
        }

    }
}
