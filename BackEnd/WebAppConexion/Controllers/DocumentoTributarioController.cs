using Conexion.AccesoDatos.Repository.Administracion;
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
    public class DocumentoTributarioController : Controller
    {
        private readonly DocumentoTributarioRepository _repository;
        private readonly IConfiguration _config;
        public DocumentoTributarioController(DocumentoTributarioRepository repository, IConfiguration config)
        {
            this._repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _config = config;
        }

        [HttpGet("[action]")]
        public async Task<IEnumerable<SecuencialDocViewModel>> MostrarSecuencialDoc(string Nombre, int Tipo)
        {
            var response = await _repository.GetByMostrarSecuencialDoc(Nombre, Tipo);
            return response.Select(s => new SecuencialDocViewModel
            {
                Establecimiento = s.Establecimiento,
                PuntoEmision = s.PuntoEmision,
                StrSecuencial = s.Secuencial.ToString().PadLeft(9, '0'),
            });

        }

        [HttpGet("[action]")]
        public async Task<IEnumerable<ComboViewModel>> MostrarCombo(Int32 Tipo, Int64 IdCliente)
        {
            var response = await _repository.GetByMostrarCombo(Tipo, IdCliente);
            return response.Select(s => new ComboViewModel
            {
                IdProceso = s.IdProceso,
                Descripcion = s.Descripcion,
            });
        }

    }
}
