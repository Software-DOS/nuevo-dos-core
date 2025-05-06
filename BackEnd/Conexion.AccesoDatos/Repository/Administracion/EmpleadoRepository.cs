using Conexion.Entidad.Administracion;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Twilio;
using Twilio.Types;
using Twilio.Rest.Api.V2010.Account;

using System.Diagnostics; // Se importa la librería System.Diagnostics

namespace Conexion.AccesoDatos.Repository.Administracion
{
    public class EmpleadoRepository
    {
        private readonly string _connectionString;

        public EmpleadoRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Conexion");
        }

        public async Task<IEnumerable<Generica>> Insert(Empleado empleado )
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

        public async Task Modify(Empleado empleado)
        {
            using (SqlConnection sql = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("InsertarModificarEliminarEmpleado", sql))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@IdEmpleado", empleado.IdEmpleado));
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
                    await cmd.ExecuteNonQueryAsync();
                    return;
                }
            }
        }

        public async Task<IEnumerable<Generica>> InsertPermisoMenu(PermisoMenu permiso)
        {
            using (SqlConnection sql = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("InsertarModificarEliminarPermisoMenu", sql))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@IdEmpleado", permiso.IdEmpleado));
                    cmd.Parameters.Add(new SqlParameter("@Lista", permiso.Lista));
                    cmd.Parameters.Add(new SqlParameter("@Tipo", permiso.Tipo));
                    await sql.OpenAsync();
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

        public async Task<IEnumerable<Generica>> EnviarMensajeWhatsapp(string Mensaje, string Numero)
        {
            var response = new List<Generica>();
            try
            {
                Numero = "+593" + Numero;

                System.Diagnostics.Process.Start("http://api.whatsapp.com/send?phone=" + Numero + "&text=" + Mensaje);
            }
            catch (Exception ex)
            {

            }
           
            return response;

        }

        public async Task<IEnumerable<Empleado>> GetByMostrarEmpleados(Int64 IdEmpresa,Int32 Tipo)
        {
            using (SqlConnection sql = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("MostrarEmpleado", sql))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@IdEmpresa", IdEmpresa));
                    cmd.Parameters.Add(new SqlParameter("@Tipo", Tipo));
                    var response = new List<Empleado>();
                    await sql.OpenAsync();

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            response.Add(MapToEmpleados(reader));
                        }
                    }

                    return response;
                }
            }
        }

        public async Task<IEnumerable<PermisoEmpleado>> GetByMostrarPermisoMenu(Int64 IdEmpleado, Int32 Tipo)
        {
            using (SqlConnection sql = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("MostrarPermisoMenu", sql))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@IdEmpleado", IdEmpleado));
                    cmd.Parameters.Add(new SqlParameter("@Tipo", Tipo));
                    var response = new List<PermisoEmpleado>();
                    await sql.OpenAsync();

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            response.Add(MapToPermisoMenu(reader));
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


        public async Task<IEnumerable<Combo>> GetByMostrarDescripcionCombo(Int32 Tipo, Int64 IdProceso, string Descripcion)
        {
            using (SqlConnection sql = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("MostrarDescripcionCombo", sql))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@Tipo", Tipo));
                    cmd.Parameters.Add(new SqlParameter("@IdProceso", IdProceso));
                    cmd.Parameters.Add(new SqlParameter("@Descripcion", Descripcion));
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

        private Empleado ConsultarLogin(SqlDataReader reader)
        {
            return new Empleado()
            {
                IdEmpleado = (Int64)reader["IdEmpleado"],
                NombresApellidos = reader["NombresApellidos"].ToString(),
            };
        }

        private Combo MapToMedios(SqlDataReader reader)
        {
            return new Combo()
            {
                IdProceso = (Int64)reader["IdProceso"],
                Descripcion = reader["Descripcion"].ToString()
            };
        }
        private Empleado MapToEmpleados(SqlDataReader reader)
        {
            return new Empleado()
            {
                IdEmpleado = (Int64)reader["IdEmpleado"],
                IdEmpresa = (Int64)reader["IdEmpresa"],
                IdPerfil = (Int64)reader["IdPerfil"],
                NombresApellidos = reader["NombresApellidos"].ToString(),
                Rucedula = reader["Rucedula"].ToString(),
                Sueldo = (decimal)reader["Sueldo"],
                Ingreso = (DateTime)reader["Ingreso"],
                Clase = reader["Clase"].ToString(),
                Direccion = reader["Direccion"].ToString(),
                Telefono = reader["Telefono"].ToString(),
                Regimen = reader["Regimen"].ToString(),
                Correo = reader["Correo"].ToString(),
                Rol = reader["Rol"].ToString(),
                FondoReserva = reader["FondoReserva"].ToString(),
                Estado = (Int32)reader["Estado"],
            };
        }

        private PermisoEmpleado MapToPermisoMenu(SqlDataReader reader)
        {
            return new PermisoEmpleado()
            {
                IdMenu = (Int64)reader["IdMenu"],
                Titulo = reader["Titulo"].ToString(),
                Estado = (Int32)reader["Estado"],
                ValorBool = (bool)reader["ValorBool"],
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
