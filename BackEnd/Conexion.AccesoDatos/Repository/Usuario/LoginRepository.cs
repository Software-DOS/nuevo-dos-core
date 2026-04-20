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

        public async Task<IEnumerable<Generica>> Insert(Empleado empleado)
        {
            using (SqlConnection sql = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("InsertarModificarEliminarEmpleado", sql))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@IdEmpleado", empleado.IdEmpleado));
                    cmd.Parameters.Add(new SqlParameter("@IdEmpresa", empleado.IdEmpresa));
                    cmd.Parameters.Add(new SqlParameter("@IdPerfil", empleado.IdPerfil));
                    cmd.Parameters.Add(new SqlParameter("@NombresApellidos", empleado.NombresApellidos));
                    cmd.Parameters.Add(new SqlParameter("@Rucedula", empleado.Rucedula));
                    cmd.Parameters.Add(new SqlParameter("@Sueldo", empleado.Sueldo));
                    cmd.Parameters.Add(new SqlParameter("@Ingreso", empleado.Ingreso));
                    cmd.Parameters.Add(new SqlParameter("@Clase", empleado.Clase));
                    cmd.Parameters.Add(new SqlParameter("@Direccion", empleado.Direccion));
                    cmd.Parameters.Add(new SqlParameter("@Telefono", empleado.Telefono));
                    cmd.Parameters.Add(new SqlParameter("@Regimen", empleado.Regimen));
                    cmd.Parameters.Add(new SqlParameter("@Correo", empleado.Correo));
                    cmd.Parameters.Add(new SqlParameter("@password_hash", empleado.password_hash));
                    cmd.Parameters.Add(new SqlParameter("@password_salt", empleado.password_salt));
                    cmd.Parameters.Add(new SqlParameter("@Rol", empleado.Rol));
                    cmd.Parameters.Add(new SqlParameter("@FondoReserva", empleado.FondoReserva));
                    cmd.Parameters.Add(new SqlParameter("@Estado", empleado.Estado));
                    cmd.Parameters.Add(new SqlParameter("@Tipo", empleado.Tipo));
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