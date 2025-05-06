using Conexion.AccesoDatos.Repository.Administracion;
using Conexion.Entidad.Administracion;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace WebAppConexion.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EnviarNotificacionController : Controller
    {
        private readonly EnviarNotificacionRepository _repository;
        private readonly IConfiguration _config;
        public EnviarNotificacionController(EnviarNotificacionRepository repository, IConfiguration config)
        {
            this._repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _config = config;
        }

        [HttpGet("[action]")]
        public async Task<IEnumerable<Generica>> ActualizarClaveEmpleado(string Correo, string Titulo, string TipoDocumento,string Clave, int Tipo)
        {
            var responseResul = await _repository.GetByActualizarClaveEmpleado(Correo, Titulo, TipoDocumento, Clave, Tipo);
            return responseResul.Select(s => new Generica
            {
                valor1 = s.valor1,
                valor2 = s.valor2
            });
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

    }
}
