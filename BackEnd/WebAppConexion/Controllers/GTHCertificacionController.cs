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
    public class GTHCertificacionController : Controller
    {
        private readonly GTHCertificacionRepository _repository;
        private readonly IConfiguration _config;

        public GTHCertificacionController(GTHCertificacionRepository repository, IConfiguration config)
        {
            this._repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _config = config;
        }

        /// <summary>
        /// Devuelve la lista de certificaciones según los filtros proporcionados.
        /// 0 = Todos, 1 = Por cédula empleado.
        /// </summary>
        [HttpGet("[action]")]
        public async Task<IEnumerable<GTHCertificacionViewModel>> Mostrar(
            [FromQuery] int tipo,
            [FromQuery] string cedulaEmpleado = null)
        {
            // Llamamos al repositorio con los filtros
            var entidades = await _repository.Mostrar(tipo, cedulaEmpleado);

            // Mapear cada GTHCertificacion a ViewModel
            return entidades.Select(e => new GTHCertificacionViewModel
            {
                Tipo = e.Tipo,
                IdCertificacion = e.IdCertificacion,
                CedulaEmpleado = e.CedulaEmpleado,
                CerTitulo = e.CerTitulo,
                CerInstitucion = e.CerInstitucion,
                CerFecha = e.CerFecha?.ToString("yyyy-MM-dd"),
                CerCertificadoUrl = e.CerCertificadoUrl
            });
        }

        /// <summary>
        /// Ejecuta la operación de gestión de certificación:
        /// 0 = Insertar, 1 = Editar, 2 = Eliminar.
        /// </summary>
        [HttpPost("[action]")]
        public async Task<IEnumerable<Generica>> Gestionar([FromBody] GTHCertificacionViewModel model)
        {
            // Parsear la fecha del string al DateTime
            DateTime? fechaConvertida = null;
            if (!string.IsNullOrEmpty(model.CerFecha))
            {
                if (DateTime.TryParse(model.CerFecha, out DateTime fecha))
                {
                    fechaConvertida = fecha;
                }
            }

            // Mapear ViewModel a la entidad GTHCertificacion
            var db = new GTHCertificacion
            {
                Tipo = model.Tipo,
                IdCertificacion = model.IdCertificacion,
                CedulaEmpleado = model.CedulaEmpleado,
                CerTitulo = model.CerTitulo,
                CerInstitucion = model.CerInstitucion,
                CerFecha = fechaConvertida,
                CerCertificadoUrl = model.CerCertificadoUrl
            };

            var responseResult = await _repository.Gestionar(db.Tipo, db);

            // Devolver la respuesta mapeada a Generica
            return responseResult.Select(s => new Generica
            {
                valor1 = s.valor1,
                valor2 = s.valor2
            });
        }
    }
}
