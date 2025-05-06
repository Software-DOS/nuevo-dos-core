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
    public class RecoFaceController : Controller
    {
        private readonly RecoFaceRepository _repository;
        private readonly IConfiguration _config;
        public RecoFaceController(RecoFaceRepository repository, IConfiguration config)
        {
            this._repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _config = config;
        }

        [HttpPost("[action]")]
        public async Task<IEnumerable<Generica>> Guardar([FromBody] RecoFaceGuardarViewModel model)
        {
            RecoFaceGuardar db = new RecoFaceGuardar();
            db.IdRecoFace = model.IdRecoFace;
            db.Json = model.Json;
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
        public async Task<IEnumerable<RecoFaceViewModel>> MostrarRecoFace(Int64 IdRecoFace, Int32 Tipo)
        {
            DateTime date = DateTime.Now;

            var response = await _repository.GetByMostrarRecoFace(IdRecoFace, Tipo);
            return response.Select(s => new RecoFaceViewModel
            {
               IdRecoFace = s.IdRecoFace,
               NombreArchivo  = s.NombreArchivo,
               ArchivoBase64 = s.ArchivoBase64,
               DescriptorString = s.DescriptorString,
            });

        }

    }
}
