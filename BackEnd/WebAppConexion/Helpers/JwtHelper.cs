using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using ServiceLoginGTH; // Tu servicio de Active Directory

namespace WebAppConexion.Helpers
{
    public class JwtHelper
    {
        private readonly string _key;
        private readonly string _issuer;
        private readonly string _audience;

        public JwtHelper(string key, string issuer, string audience = "CompuequipApp")
        {
            _key = key;
            _issuer = issuer;
            _audience = audience;
        }

        public string GenerateToken(UserInfo userInfo)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_key);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                // 🔍 PASO 1: Tomar todos los datos del usuario
                Subject = new ClaimsIdentity(new[]
                {
                    // Claims estándar que Angular espera
                    new Claim(ClaimTypes.Email, userInfo.Email ?? ""),
                    new Claim(ClaimTypes.Name, userInfo.Name ?? ""),
                    new Claim("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress", userInfo.Email ?? ""),
                    
                    // Claims personalizados del usuario
                    new Claim("Id", userInfo.Id.ToString()),
                    new Claim("Login", userInfo.Login ?? ""),
                    new Claim("Usuario", userInfo.Name ?? ""),
                    new Claim("ProfileId", userInfo.ProfileId.ToString()),
                    new Claim("RoleId", userInfo.RoleId.ToString()),
                    new Claim("ActiveUser", userInfo.ActiveUser.ToString()),
                    new Claim("Email", userInfo.Email ?? "")
                }),
                Expires = DateTime.UtcNow.AddDays(7), // Token válido por 7 días
                Issuer = _issuer,
                Audience = _audience,
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            // 🔍 PASO 2: Encriptar todos estos datos en un string
            // Usa la clave secreta de appsettings.json
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}