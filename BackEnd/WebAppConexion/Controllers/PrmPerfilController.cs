using Conexion.AccesoDatos.Repository.Administracion;
using Conexion.Entidad.Administracion;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAppConexion.Models;

namespace WebAppConexion.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PrmPerfilController : Controller
    {
        private readonly PrmPerfilRepository _repository;
        private readonly IConfiguration _config;
        public PrmPerfilController(PrmPerfilRepository repository, IConfiguration config)
        {
            this._repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _config = config;
        }

        [HttpPost("[action]")]
        public async Task<IEnumerable<Generica>> Guardar([FromBody] GuardarPrmPerfilViewModel model)
        {
            PrmPerfil db = new PrmPerfil();
            db.IdPerfil = model.IdPerfil;
            db.Descripcion = model.Descripcion;
            db.Estado = model.Estado;
            db.Tipo = model .Tipo;

            var responseResul = await _repository.Insert(db);
            return responseResul.Select(s => new Generica
            {
                valor1 = s.valor1,
                valor2 = s.valor2
            });

        }

        [HttpGet("[action]")]
        public async Task<IEnumerable<PrmPerfilViewModel>> MostrarPrmPerfil(string Descripcion)
        {
            var response = await _repository.GetByMostrarPrmPerfil(Descripcion);
            return response.Select(s => new PrmPerfilViewModel
            {
                IdPerfil = s.IdPerfil,
                Descripcion = s.Descripcion,
                Estado =s.Estado,
            });

        }

        [HttpGet("[action]")]
        public async Task<IEnumerable<PrmPerfilViewModel>> MostrarPrmPerfilId(Int64 IdPerfil)
        {
            var response = await _repository.GetByMostrarPrmPerfilId(IdPerfil);
            return response.Select(s => new PrmPerfilViewModel
            {
                IdPerfil = s.IdPerfil,
                Descripcion = s.Descripcion,
            });

        }

    }



}
