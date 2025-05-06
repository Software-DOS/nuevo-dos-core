using Conexion.AccesoDatos.Repository.Administracion;
using Conexion.Entidad.Administracion;
using Microsoft.AspNetCore.Mvc;
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
    public class ClienteServicioController : Controller
    {
        private readonly ClienteServicioRepository _repository;
        private readonly IConfiguration _config;
        public ClienteServicioController(ClienteServicioRepository repository, IConfiguration config)
        {
            this._repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _config = config;
        }

        [HttpPost("[action]")]
        public async Task<IEnumerable<Generica>> Guardar([FromBody] ClienteServicioViewModel model)
        {
            ClienteServicio db = new ClienteServicio();
            db.IdClienteServicio = model.IdClienteServicio;
            db.IdTipoIdentificacion = model.IdTipoIdentificacion;
            db.RuCedula = model.RuCedula;
            db.Descripcion = model.Descripcion;
            db.Direccion = model.Direccion;
            db.Email = model.Email;
            db.Telefono = model.Telefono;
            db.Estado = model.Estado;
            db.Tipo = model.Tipo;

            var responseResul = await _repository.Insert(db);
            return responseResul.Select(s => new Generica
            {
                valor1 = s.valor1,
                valor2 = s.valor2
            });
        }

        [HttpGet("[action]")]
        public async Task<IEnumerable<ClienteServicioViewModel>> MostrarClienteServicio(Int32 Tipo, Int64 IdClienteServicio)
        {
            var response = await _repository.GetByMostrarClienteServicio(IdClienteServicio, Tipo);
            return response.Select(s => new ClienteServicioViewModel
            {
                IdClienteServicio = s.IdClienteServicio,
                IdTipoIdentificacion = s.IdTipoIdentificacion,
                RuCedula = s.RuCedula,
                Descripcion = s.Descripcion,
                Direccion = s.Direccion,
                Email = s.Email,
                Telefono=s.Telefono
            });

        }


        [HttpGet("[action]")]
        public async Task<IEnumerable<ClienteServicioViewModel>> MostrarClienteServicioLike(Int32 Tipo,string Busquedad, Int64 IdClienteServicio)
        {
            var response = await _repository.GetByMostrarClienteServicioLike(IdClienteServicio, Busquedad, Tipo);
            return response.Select(s => new ClienteServicioViewModel
            {
                IdClienteServicio = s.IdClienteServicio,
                IdTipoIdentificacion = s.IdTipoIdentificacion,
                RuCedula = s.RuCedula,
                Descripcion = s.Descripcion,
                Direccion = s.Direccion,
                Email = s.Email,
                Telefono = s.Telefono
            });

        }
    }
}
