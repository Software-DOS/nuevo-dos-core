using Conexion.AccesoDatos.Repository.Usuario;
using Conexion.Entidad.Administracion;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using WebAppConexion.Login;

namespace WebAppConexion.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        private readonly LoginRepository _repository;
        private readonly IConfiguration _config;

        public AuthController(LoginRepository repository, IConfiguration config)
        {
            _authService = new AuthService();
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _config = config;
        }

        // ========================================
        // 🆕 LOGIN CON ACTIVE DIRECTORY + BD LOCAL
        // ========================================
        [HttpPost("loginAD")]
        public async Task<IActionResult> LoginAD([FromBody] LoginRequest request)
        {
            Console.WriteLine("\n=== ENDPOINT POST /api/auth/loginAD ===");
            Console.WriteLine($"Usuario/Email: {request.Usuario}");

            try
            {
                // ✅ PASO 1: Validar entrada
                if (string.IsNullOrEmpty(request.Usuario) || string.IsNullOrEmpty(request.Clave))
                {
                    Console.WriteLine("❌ Usuario o clave vacíos");
                    return BadRequest(new { message = "Usuario y contraseña son requeridos" });
                }

                // ✅ PASO 2: Validar en Active Directory
                Console.WriteLine("Validando en Active Directory...");
                var userInfoAD = await _authService.ValidarUsuarioAsync(request.Usuario, request.Clave);

                if (userInfoAD == null)
                {
                    Console.WriteLine("❌ AD: Credenciales inválidas");
                    return Unauthorized(new { message = "Credenciales inválidas" });
                }

                // ⭐ QUITAMOS LA VALIDACIÓN DE ActiveUser
                // if (userInfoAD.ActiveUser == 0)
                // {
                //     Console.WriteLine("❌ AD: Usuario inactivo");
                //     return Unauthorized(new { message = "Usuario inactivo en Active Directory" });
                // }

                Console.WriteLine($"✅ AD: Usuario autenticado - {userInfoAD.Name}");
                Console.WriteLine($"Email del AD: {userInfoAD.Email}");
                Console.WriteLine($"ActiveUser: {userInfoAD.ActiveUser} (no validado)");

                // ✅ PASO 3: Buscar en base de datos local
                var emailParaBuscar = userInfoAD.Email;

                if (string.IsNullOrEmpty(emailParaBuscar))
                {
                    Console.WriteLine("❌ No se pudo obtener email del AD");
                    return StatusCode(500, new { message = "No se pudo obtener el email desde Active Directory" });
                }

                Console.WriteLine($"Buscando empleado en BD local: {emailParaBuscar}");
                var response = await _repository.GetByMostrarLogin(emailParaBuscar);

                if (response.password_hash != null)
                {
                    Console.WriteLine("❌ BD Local: Empleado no encontrado");
                    //return NotFound(new { message = "Usuario autenticado en AD pero no existe en la base de datos local. Contacte al administrador." });

                    Console.WriteLine($"✅ BD Local: Empleado encontrado - ID: {response.IdEmpleado}");
                    Console.WriteLine($"Nombre: {response.NombresApellidos}");
                    Console.WriteLine($"IdEmpresa: {response.IdEmpresa}");

                    // ✅ PASO 4: Generar token
                    var claims = new List<Claim>
                    {
                        new Claim(ClaimTypes.NameIdentifier, response.IdEmpleado.ToString()),
                        new Claim(ClaimTypes.Email, emailParaBuscar),
                        new Claim("IdEmpresa", response.IdEmpresa.ToString()),
                        new Claim("IdEmpleado", response.IdEmpleado.ToString()),
                        new Claim("email", emailParaBuscar),
                        new Claim("NombresApellidos", response.NombresApellidos ?? ""),
                        new Claim("Perfil", response.Rucedula ?? ""),
                        new Claim("Imagen", response.RutaImagen ?? ""),
                        new Claim("ClaveTemporal", response.ClaveTemporal ?? "")
                    };

                    var token = GenerarToken(claims);

                    Console.WriteLine("✅ Token generado exitosamente");
                    Console.WriteLine($"Token preview: {token.Substring(0, Math.Min(50, token.Length))}...");

                    // ✅ PASO 5: Retornar token
                    return Ok(new { token = token });

                }
                else
                {
                    if(response.password_hash == null)
                    {
                        Empleado db = new Empleado();
                        db.IdEmpleado = 0;
                        db.IdEmpresa = 1;
                        db.IdPerfil = 7;
                        db.NombresApellidos = userInfoAD.Name;
                        db.Rucedula = "";
                        db.Sueldo = 0;
                        db.Ingreso = DateTime.Now;
                        db.Clase = "";
                        db.Direccion = "";
                        db.Telefono = "";
                        db.Regimen = "";
                        db.Correo = userInfoAD.Email;
                        db.Rol = "";
                        db.FondoReserva = "";
                        db.Estado = 1;
                        db.Tipo = 1;
                        CrearPasswordHash(request.Clave, out byte[] passwordHash, out byte[] passwordSalt);
                        db.password_hash = passwordHash;
                        db.password_salt = passwordSalt;
                        var responseResul = await _repository.Insert(db);
                    }

                    var responseNuevo = await _repository.GetByMostrarLogin(emailParaBuscar);

                    Console.WriteLine($"✅ BD Local: Empleado encontrado - ID: {responseNuevo.IdEmpleado}");
                    Console.WriteLine($"Nombre: {responseNuevo.NombresApellidos}");
                    Console.WriteLine($"IdEmpresa: {responseNuevo.IdEmpresa}");

                    // ✅ PASO 4: Generar token
                    var claims = new List<Claim>
                    {
                        new Claim(ClaimTypes.NameIdentifier, responseNuevo.IdEmpleado.ToString()),
                        new Claim(ClaimTypes.Email, emailParaBuscar),
                        new Claim("IdEmpresa", responseNuevo.IdEmpresa.ToString()),
                        new Claim("IdEmpleado", responseNuevo.IdEmpleado.ToString()),
                        new Claim("email", emailParaBuscar),
                        new Claim("NombresApellidos", responseNuevo.NombresApellidos ?? ""),
                        new Claim("Perfil", responseNuevo.Rucedula ?? ""),
                        new Claim("Imagen", responseNuevo.RutaImagen ?? ""),
                        new Claim("ClaveTemporal", responseNuevo.ClaveTemporal ?? "")
                    };

                    var token = GenerarToken(claims);

                    Console.WriteLine("✅ Token generado exitosamente");
                    Console.WriteLine($"Token preview: {token.Substring(0, Math.Min(50, token.Length))}...");

                    // ✅ PASO 5: Retornar token
                    return Ok(new { token = token });

                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ ERROR: {ex.Message}");
                Console.WriteLine($"StackTrace: {ex.StackTrace}");

                return StatusCode(500, new { message = $"Error: {ex.Message}" });
            }
        }

        // ========================================
        // 🔑 MÉTODO GENERAR TOKEN
        // ========================================
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

        // ========================================
        // MÉTODO GET - Para pruebas (sin validación de ActiveUser)
        // ========================================
        [HttpGet("validar")]
        public async Task<IActionResult> Validar(string usuario, string clave)
        {
            try
            {
                if (string.IsNullOrEmpty(usuario) || string.IsNullOrEmpty(clave))
                {
                    return BadRequest(new { mensaje = "Usuario y contraseña son requeridos" });
                }

                var userInfo = await _authService.ValidarUsuarioAsync(usuario, clave);

                if (userInfo == null)
                {
                    return Unauthorized(new { mensaje = "Credenciales inválidas" });
                }

                // ⭐ NO VALIDAMOS ActiveUser
                Console.WriteLine($"Usuario encontrado: {userInfo.Name}, ActiveUser: {userInfo.ActiveUser}");

                return Ok(new
                {
                    success = true,
                    data = new
                    {
                        usuario = userInfo.Name,
                        email = userInfo.Email,
                        login = userInfo.Login,
                        activeUser = userInfo.ActiveUser // Solo informativo
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error: {ex.Message}" });
            }
        }

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
    }



    public class LoginRequest
    {
        public string Usuario { get; set; }
        public string Clave { get; set; }
    }
}