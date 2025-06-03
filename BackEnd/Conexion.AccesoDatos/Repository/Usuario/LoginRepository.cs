// LoginRepository.cs (versión adaptada a la BD nueva y a GTHEmpleado)
using Conexion.Entidad.Administracion; // Aquí GTHEmpleado vive en este namespace
using Microsoft.Extensions.Configuration;
using System;
using System.Data.SqlClient;
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

        // Ahora devolvemos GTHEmpleado en lugar de Empleado
        public async Task<GTHEmpleado> GetByMostrarLogin(string Correo)
        {
            using (SqlConnection sql = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("WebVerUsuario", sql))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@Correo", Correo));
                    var response = new GTHEmpleado();
                    await sql.OpenAsync();

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            response = MapToGTHEmpleado(reader);
                        }
                    }

                    return response;
                }
            }
        }

        // Mapea las columnas que devuelve el SP de la nueva BD a nuestro POCO GTHEmpleado
        private GTHEmpleado MapToGTHEmpleado(SqlDataReader reader)
        {
            return new GTHEmpleado()
            {
                // En GTHEmpleado.cs, IdEmpleado está definido como long (o int, según tu modelo)
                IdEmpleado = Convert.ToInt64(reader["IdEmpleado"]),

                // En el SP concatenamos EMP_NOMBRE + ' ' + EMP_APELLIDO
                Nombre = reader["NombresApellidos"].ToString().Split(' ')[0], // si quieres separarlo
                Apellido = reader["NombresApellidos"].ToString().Split(' ').Length > 1
                                ? reader["NombresApellidos"].ToString().Substring(reader["NombresApellidos"].ToString().IndexOf(' ') + 1)
                                : string.Empty,

                // También podrías almacenar el full name en alguna propiedad adicional,
                // pero aquí usamos Nombre y Apellido por separado. Si no quieres separarlo, añade:
                // // NombreCompleto = reader["NombresApellidos"].ToString(),

                IdPerfil = reader["IdPerfil"] as long?,
                FotoPerfilUrl = reader["RutaImagen"].ToString(),

                // La columna EMP_PASSWORD se mapea a la propiedad Password en GTHEmpleado
                Password = reader["PasswordHash"].ToString()
            };
        }
    }
}
