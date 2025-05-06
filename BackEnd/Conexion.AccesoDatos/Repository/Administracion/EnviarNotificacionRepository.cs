using Conexion.AccesoDatos.Repository.CArchivo;
using Conexion.Entidad.Administracion;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Conexion.AccesoDatos.Repository.Administracion
{
    public class EnviarNotificacionRepository
    {
        private readonly string _connectionString;
        private readonly IConfiguration _config;
        public EnviarNotificacionRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Conexion");
        }

        #region MetodosAdicionales

        #region CrearPasswordHash
        private void CrearPasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }

        }
        #endregion

        #region VerificarPasswordHash
        private bool VerificarPasswordHash(string password, byte[] passwordHashAlmacenado, byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {
                var passwordHashNuevo = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return new ReadOnlySpan<byte>(passwordHashAlmacenado).SequenceEqual(new ReadOnlySpan<byte>(passwordHashNuevo));
            }
        }
        #endregion

        #region GenerarToken
        private string GenerarToken(List<Claim> claims)
        {

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
              _config["Jwt:Issuer"],
              _config["Jwt:Issuer"],
              expires: DateTime.Now.AddMinutes(30),
              signingCredentials: creds,
              claims: claims);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        #endregion

        #endregion

        public async Task<IEnumerable<Generica>> GetByActualizarClaveEmpleado(string Correo,string Titulo, string TipoDocumento, string Clave, int tipo)
        {

            var  response3 = await GetByMostrarLogin(Correo);          

            CargarArchivo cargar = new CargarArchivo();
            PrmConfiguracionArchivo archivo = new PrmConfiguracionArchivo();
            CargarXLSX cargar1 = new CargarXLSX(_connectionString);
            archivo = cargar1.MostrarCargaArhivoConfig(0, 0, TipoDocumento);
            string ruta = archivo.RutaArchivo; //"E:\\SubirArchivo\\";
            var response2 = new List<Generica>();
            cargar.RutaArchivo = ruta + cargar.nombreArchivo;
            var response = new List<Generica>();
            string stringToEncrypt = "";
            if(tipo == 0)
            {
                stringToEncrypt = Guid.NewGuid().ToString("N").Substring(1, 8);

                #region Actualizar Empleado
                Empleado db = new Empleado();
                db.IdEmpleado = cargar.IdContrato;
                db.IdPerfil = 0;
                db.NombresApellidos = "";
                db.Rucedula = "";
                db.Sueldo = 0;
                db.Ingreso = Convert.ToDateTime("1900-01-01");
                db.Clase = "";
                db.Direccion = "";
                db.Telefono = "";
                db.Regimen = "";
                db.Correo = Correo;
                db.Rol = "";
                db.FondoReserva = "";
                db.Estado = 1;
                db.RutaImagen = "";
                db.ClaveTemporal = stringToEncrypt.ToUpper();
                db.Tipo = 5;

                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("InsertarModificarEliminarEmpleado", sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@IdEmpleado", db.IdEmpleado));
                        cmd.Parameters.Add(new SqlParameter("@IdPerfil", db.IdPerfil));
                        cmd.Parameters.Add(new SqlParameter("@NombresApellidos", db.NombresApellidos));
                        cmd.Parameters.Add(new SqlParameter("@Rucedula", db.Rucedula));
                        cmd.Parameters.Add(new SqlParameter("@Sueldo", db.Sueldo));
                        cmd.Parameters.Add(new SqlParameter("@Ingreso", db.Ingreso));
                        cmd.Parameters.Add(new SqlParameter("@Clase", db.Clase));
                        cmd.Parameters.Add(new SqlParameter("@Direccion", db.Direccion));
                        cmd.Parameters.Add(new SqlParameter("@Telefono", db.Telefono));
                        cmd.Parameters.Add(new SqlParameter("@Regimen", db.Regimen));
                        cmd.Parameters.Add(new SqlParameter("@Correo", db.Correo));
                        cmd.Parameters.Add(new SqlParameter("@password_hash", db.password_hash));
                        cmd.Parameters.Add(new SqlParameter("@password_salt", db.password_salt));
                        cmd.Parameters.Add(new SqlParameter("@Rol", db.Rol));
                        cmd.Parameters.Add(new SqlParameter("@FondoReserva", db.FondoReserva));
                        cmd.Parameters.Add(new SqlParameter("@Estado", db.Estado));
                        cmd.Parameters.Add(new SqlParameter("@RutaImagen", db.RutaImagen));
                        cmd.Parameters.Add(new SqlParameter("@ClaveTemporal", db.ClaveTemporal));
                        cmd.Parameters.Add(new SqlParameter("@Tipo", db.Tipo));
                        await sql.OpenAsync();
                        await cmd.ExecuteNonQueryAsync();
                    }
                }

                #endregion

                EnviarNotificacionOportunidad(Correo, Titulo, GenerarNotificacion(response3.NombresApellidos, Correo, stringToEncrypt, cargar.RutaArchivo, archivo.NombreArchivo));

                Generica generica = new Generica();
                generica.valor1 = 1;
                generica.valor2 = "Por favor revise su correo electrónico para completar el proceso de actualización de contraseña.";
                response.Add(generica);

            }
            else
            {
                CrearPasswordHash(Clave, out byte[] passwordHash, out byte[] passwordSalt);


                #region Actualizar Empleado
                Empleado db = new Empleado();
                db.IdEmpleado = cargar.IdContrato;
                db.IdPerfil = 0;
                db.NombresApellidos = "";
                db.Rucedula = "";
                db.Sueldo = 0;
                db.Ingreso = Convert.ToDateTime("1900-01-01");
                db.Clase = "";
                db.Direccion = "";
                db.Telefono = "";
                db.Regimen = "";
                db.Correo = Correo;
                db.Rol = "";
                db.FondoReserva = "";
                db.Estado = 1;
                db.RutaImagen = "";
                db.password_hash = passwordHash;
                db.password_salt = passwordSalt;
                db.ClaveTemporal = stringToEncrypt.ToUpper();
                db.Tipo = 5;

                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("InsertarModificarEliminarEmpleado", sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@IdEmpleado", db.IdEmpleado));
                        cmd.Parameters.Add(new SqlParameter("@IdPerfil", db.IdPerfil));
                        cmd.Parameters.Add(new SqlParameter("@NombresApellidos", db.NombresApellidos));
                        cmd.Parameters.Add(new SqlParameter("@Rucedula", db.Rucedula));
                        cmd.Parameters.Add(new SqlParameter("@Sueldo", db.Sueldo));
                        cmd.Parameters.Add(new SqlParameter("@Ingreso", db.Ingreso));
                        cmd.Parameters.Add(new SqlParameter("@Clase", db.Clase));
                        cmd.Parameters.Add(new SqlParameter("@Direccion", db.Direccion));
                        cmd.Parameters.Add(new SqlParameter("@Telefono", db.Telefono));
                        cmd.Parameters.Add(new SqlParameter("@Regimen", db.Regimen));
                        cmd.Parameters.Add(new SqlParameter("@Correo", db.Correo));
                        cmd.Parameters.Add(new SqlParameter("@password_hash", db.password_hash));
                        cmd.Parameters.Add(new SqlParameter("@password_salt", db.password_salt));
                        cmd.Parameters.Add(new SqlParameter("@Rol", db.Rol));
                        cmd.Parameters.Add(new SqlParameter("@FondoReserva", db.FondoReserva));
                        cmd.Parameters.Add(new SqlParameter("@Estado", db.Estado));
                        cmd.Parameters.Add(new SqlParameter("@RutaImagen", db.RutaImagen));
                        cmd.Parameters.Add(new SqlParameter("@ClaveTemporal", db.ClaveTemporal));
                        cmd.Parameters.Add(new SqlParameter("@Tipo", db.Tipo));
                        await sql.OpenAsync();
                        await cmd.ExecuteNonQueryAsync();
                    }
                }

                #endregion

                Generica generica = new Generica();
                generica.valor1 = 1;
                generica.valor2 = "Usted ha completado el proceso exitosamente..";
                response.Add(generica);

            }



            return response;
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

        private Empleado MapToEmpresa(SqlDataReader reader)
        {
            return new Empleado()
            {
                IdEmpleado = (Int64)reader["IdEmpleado"],
                NombresApellidos = reader["NombresApellidos"].ToString(),
                password_hash = (byte[])reader["password_hash"],
                password_salt = (byte[])reader["password_salt"],
                Rucedula = reader["Perfil"].ToString(),
                RutaImagen = reader["RutaImagen"].ToString(),
            };
        }

        private string GenerarNotificacion(string Nombre,string Usuario,string ClaveTemporal,string Notificacion,string Contenido)
        {
            string Resultado = "";
            Resultado = Contenido;
            Resultado = Resultado.Replace("[NombresApelidos]", Nombre);
            Resultado = Resultado.Replace("[Notificacion]", Notificacion);
            Resultado = Resultado.Replace("[Usuario]", Usuario);
            Resultado = Resultado.Replace("[Clave]", ClaveTemporal.ToUpper());
            return Resultado;
        }

        private string EnviarNotificacionOportunidad(string Correo,string Titulo,string Contienido)
        {
            string resultado = "";
            EntParametrosCorreo correo = new EntParametrosCorreo();
            DataTable table = new DataTable();
            PrmConfiguracionArchivo archivo = new PrmConfiguracionArchivo();
            CargarXLSX cargar1 = new CargarXLSX(_connectionString);
            string mensaje = "";
            table = cargar1.RetornarConfigSMTP(ref mensaje);
            if (table.Rows.Count > 0)
            {
                correo.smtpAddress = table.Rows[0]["HostSmtp"].ToString();
                correo.portNumber = Convert.ToInt32(table.Rows[0]["PuertoSmtp"].ToString());
                correo.emailFrom = table.Rows[0]["UsuarioSmtp"].ToString();
                correo.password = table.Rows[0]["ClaveSmtp"].ToString();
                correo.enableSSL = Convert.ToBoolean(table.Rows[0]["enableSSL"].ToString());

                bool temp = cargar1.EnviarCorreo(Correo.ToString(), Titulo.ToString(), Contienido.ToString(), correo);

            }

            return resultado;
        }


    }
}
