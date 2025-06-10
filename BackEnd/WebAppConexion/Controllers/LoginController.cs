// LoginController.cs (versión adaptada para GTHEmpleado y comparación en texto plano)
using Conexion.AccesoDatos.Repository.Usuario;
using Conexion.Entidad.Administracion; // Para el modelo GTHEmpleado
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace WebAppConexion.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : Controller
    {
        private readonly LoginRepository _repository;
        private readonly IConfiguration _config;

        public LoginController(LoginRepository repository, IConfiguration config)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _config = config;
        }

        // Mantenemos la misma ruta GET: api/Login/Login?email={email}&password={password}
        [HttpGet("[action]")]
        public async Task<IActionResult> Login(string email, string password)
        {
            // Llamamos al repositorio que ahora devuelve un GTHEmpleado
            var response = await _repository.GetByMostrarLogin(email);

            if (response == null || string.IsNullOrEmpty(response.Password))
            {
                // Si no existe usuario o no hay password almacenada, devolvemos 404
                return NotFound();
            }

            // Comparación en texto plano (más adelante podrás mejorar con hashing)
            if (!password.Equals(response.Password))
            {
                return Unauthorized(); // Usuario encontrado, pero contraseña inválida
            }

            // Generamos una lista de claims mínimos con la info que nos importa
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, response.IdEmpleado.ToString()),
                new Claim(ClaimTypes.Email, email),
                new Claim("IdEmpleado", response.IdEmpleado.ToString()),
                new Claim("Nombre", response.Nombre),
                new Claim("Apellido", response.Apellido),
                new Claim("IdPerfil", response.IdPerfil.HasValue
                                     ? response.IdPerfil.Value.ToString()
                                     : string.Empty),
                // Si deseas incluir la URL de la foto, úsalo como claim opcional:
                new Claim("FotoPerfilUrl", response.FotoPerfilUrl ?? string.Empty),
                new Claim("ClaveTemporal", "")
            };

            // Devolvemos el token generado
            return Ok(new { token = GenerarToken(claims) });
        }

        #region Métodos auxiliares

        // Como de momento comparamos en texto plano, no necesitamos CrearPasswordHash ni VerificarPasswordHash.
        // Los dejo comentados para futura encriptación:

        /*
        private void CrearPasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            }
        }

        private bool VerificarPasswordHash(string password, byte[] passwordHashAlmacenado, byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {
                var passwordHashNuevo = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
                return new ReadOnlySpan<byte>(passwordHashAlmacenado).SequenceEqual(
                           new ReadOnlySpan<byte>(passwordHashNuevo));
            }
        }
        */

        private string GenerarToken(List<Claim> claims)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Issuer"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(30),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        #endregion
    }
}
