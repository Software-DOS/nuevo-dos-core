using Conexion.Entidad.Administracion;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Conexion.AccesoDatos.Repository.Usuario
{
    public class LoginRepository
    {
        private readonly string _connectionString;

        public LoginRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Conexion");
        }

        public async Task<Empleado> GetByMostrarLogin(string Correo)
        {
            using (SqlConnection sql = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("WebVerUsuario", sql))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@Correo", Correo));
                    var response = new Empleado();
                    await sql.OpenAsync();

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            response = MapToEmpresa(reader);
                        }
                    }

                    return response;
                }
            }
        }

        public async Task<IEnumerable<Empleado>> GetByMostrarLoginId(Int64 IdEmpleado)
        {
            using (SqlConnection sql = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("WebMostrarEmpleado", sql))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@IdEmpleado", IdEmpleado));
                    var response = new List<Empleado>();
                    await sql.OpenAsync();

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            response.Add(ConsultarLogin(reader));
                        }
                    }

                    return response;
                }
            }
        }

        public async Task ActualizarEmpleado(Empleado empleado)
        {
            using (SqlConnection sql = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("WebActualizarEmpleado", sql))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@IdEmpleado", empleado.IdEmpleado));
                    cmd.Parameters.Add(new SqlParameter("@password_hash", empleado.password_hash));
                    cmd.Parameters.Add(new SqlParameter("@password_salt", empleado.password_salt));
                    await sql.OpenAsync();
                    await cmd.ExecuteNonQueryAsync();
                    return;
                }
            }
        }

        private Empleado MapToEmpresa(SqlDataReader reader)
        {
            return new Empleado()
            {
                IdEmpleado = (Int64)reader["IdEmpleado"],
                IdEmpresa = (Int64)reader["IdEmpresa"],
                NombresApellidos = reader["NombresApellidos"].ToString(),
                password_hash = (byte[])reader["password_hash"],
                password_salt = (byte[])reader["password_salt"],
                Rucedula = reader["Perfil"].ToString(),
                RutaImagen = reader["RutaImagen"].ToString(),
                ClaveTemporal = reader["ClaveTemporal"].ToString(),
            };
        }

        private Empleado ConsultarLogin(SqlDataReader reader)
        {
            return new Empleado()
            {
                IdEmpleado = (Int64)reader["IdEmpleado"],
                NombresApellidos = reader["NombresApellidos"].ToString(),
            };
        }
    }
}
