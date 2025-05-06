using Conexion.AccesoDatos.Repository.Negocio;
using Conexion.Entidad.Administracion;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAppConexion.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PagoController : Controller
    {
        private readonly PagoRepository _repository;
        private readonly IConfiguration _config;
        public PagoController(PagoRepository repository, IConfiguration config)
        {
            this._repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _config = config;
        }

        [HttpGet("[action]")]
        public async Task<IEnumerable<Generica>> GuardarFacturaServicio(string JsonDatos, string JsonDatosFinal, string Descripcion, string FechaEmision)
        {
            var responseResul = await _repository.InsertFacturaServicio(JsonDatos, JsonDatosFinal, Descripcion, 1, 1, FechaEmision);
            return responseResul.Select(s => new Generica
            {
                valor1 = s.valor1,
                valor2 = s.valor2
            });
        }

    }
}
