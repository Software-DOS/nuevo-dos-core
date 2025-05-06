using Conexion.AccesoDatos.Repository.Administracion;
using Conexion.Entidad.Administracion;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using WebAppConexion.Models;

namespace WebAppConexion.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmpleadoController : Controller
    {
        private readonly EmpleadoRepository _repository;
        private readonly IConfiguration _config;
        public EmpleadoController(EmpleadoRepository repository, IConfiguration config)
        {
            this._repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _config = config;
        }

        [HttpPost("[action]")]
        public async Task<IEnumerable<Generica>>  Guardar([FromBody] GuardarEmpleadoViewModel model)
        {
            Empleado db = new Empleado();
            db.IdEmpleado = model.IdEmpleado;
            db.IdEmpresa = model.IdEmpresa;
            db.IdPerfil = model.IdPerfil;
            db.NombresApellidos = model.NombresApellidos;
            db.Rucedula = model.Rucedula;
            db.Sueldo = model.Sueldo;
            db.Ingreso = model.Ingreso;
            db.Clase = model.Clase;
            db.Direccion = model.Direccion;
            db.Telefono = model.Telefono;
            db.Regimen = model.Regimen;
            db.Correo = model.Correo.ToLower();
            db.Rol = model.Rol;
            db.FondoReserva = model.FondoReserva;
            db.Estado = model.Estado;
            db.Tipo = model.Tipo;
            if (model.act_password == true)
            {
                CrearPasswordHash(model.Contrasenia, out byte[] passwordHash, out byte[] passwordSalt);
                db.password_hash = passwordHash;
                db.password_salt = passwordSalt;
            }

            var responseResul = await _repository.Insert(db);
            return responseResul.Select(s => new Generica
            {
                valor1 = s.valor1,
                valor2 = s.valor2
            });
        }

        [HttpPost("[action]")]
        public async Task<IEnumerable<Generica>> GuardarPermisoMenu([FromBody] PermisoMenuViewModel model)
        {

            PermisoMenu db = new PermisoMenu();
            db.IdEmpleado = model.IdEmpleado;
            db.Lista = model.Lista;
            db.Tipo = model.Tipo;

            var responseResul = await _repository.InsertPermisoMenu(db);
            return responseResul.Select(s => new Generica
            {
                valor1 = s.valor1,
                valor2 = s.valor2
            });

        }

        [HttpGet("[action]")]
        public async Task<IEnumerable<Generica>> EnviarMensajeWhatsapp(string Mensaje, string Numero)
        {
            DateTime date = DateTime.Now;

            var response = await _repository.EnviarMensajeWhatsapp(Mensaje, Numero);
            return response.Select(s => new Generica
            {
                valor1 = s.valor1,
                valor2 = s.valor2
            });

        }

        [HttpGet("[action]")]
        public async Task<IEnumerable<EmpleadoViewModel>> MostrarEmpleados(Int64 IdEmpresa, Int32 Tipo)
        {
            DateTime date = DateTime.Now;

            var response = await _repository.GetByMostrarEmpleados(IdEmpresa, Tipo);
            return response.Select(s => new EmpleadoViewModel
            {
                IdEmpleado = s.IdEmpleado,
                IdEmpresa = s.IdEmpresa,
                IdPerfil=s.IdPerfil,
                NombresApellidos = s.NombresApellidos.ToUpper(),
                Rucedula=s.Rucedula,
                Sueldo=s.Sueldo,
                Ingreso=s.Ingreso,
                Clase=s.Clase ,
                Direccion=s.Direccion ,
                Telefono=s.Telefono ,
                Regimen=s.Regimen,
                Correo=s.Correo ,
                Rol=s.Rol,
                FondoReserva = s.FondoReserva,
                Estado =s.Estado,
                MesesTrabajo = Math.Abs((date.Month - s.Ingreso.Month) + 12 * (date.Year - s.Ingreso.Year)),

            });

        }

        [HttpGet("[action]")]
        public async Task<IEnumerable<PermisoEmpleadoViewModel>> MostrarPermisoMenu(Int64 IdEmpleado, Int32 Tipo)
        {
            DateTime date = DateTime.Now;

            var response = await _repository.GetByMostrarPermisoMenu(IdEmpleado, Tipo);
            return response.Select(s => new PermisoEmpleadoViewModel
            {
                IdMenu = s.IdMenu,
                Titulo = s.Titulo,
                Estado = s.Estado,
                ValorBool = s.ValorBool,
            });

        }

        [HttpGet("[action]")]
        public async Task<IEnumerable<ComboViewModel>> MostrarDescripcionCombo(Int32 Tipo, Int64 IdProceso, string Descripcion)
        {
            var response = await _repository.GetByMostrarDescripcionCombo(Tipo, IdProceso, Descripcion);
            return response.Select(s => new ComboViewModel
            {
                IdProceso = s.IdProceso,
                Descripcion = s.Descripcion,
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
