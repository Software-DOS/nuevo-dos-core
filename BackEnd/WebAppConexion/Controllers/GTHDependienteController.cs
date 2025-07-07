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
    public class GTHDependienteController : Controller
    {
        private readonly GTHDependienteRepository _repository;
        private readonly IConfiguration _config;

        public GTHDependienteController(GTHDependienteRepository repository, IConfiguration config)
        {
            this._repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _config = config;
        }

        /// <summary>
        /// Devuelve la lista de dependientes según los filtros proporcionados.
        /// 0 = Todos, 1 = Por cédula del empleado.
        /// </summary>
        [HttpGet("[action]")]
        public async Task<IEnumerable<GTHDependienteViewModel>> Mostrar(
            [FromQuery] int tipo,
            [FromQuery] string cedulaEmpleado = null)
        {
            // Llamamos al repositorio con los filtros
            var entidades = await _repository.Mostrar(tipo, cedulaEmpleado);

            // Mapear cada GTHDependiente a tu ViewModel
            return entidades.Select(e => new GTHDependienteViewModel
            {
                Tipo = e.Tipo,
                IdDependiente = e.IdDependiente,
                CedulaEmpleado = e.CedulaEmpleado,
                DepNombre = e.DepNombre,
                DepFechaNacimiento = e.DepFechaNacimiento,
                DepDiscapacidad = e.DepDiscapacidad,
                DepDocumentoUrl = e.DepDocumentoUrl
            });
        }

        /// <summary>
        /// Ejecuta la operación de gestión de dependiente:
        /// 0 = Insertar, 1 = Editar, 2 = Eliminar.
        /// </summary>
        [HttpPost("[action]")]
        public async Task<IEnumerable<Generica>> Gestionar([FromBody] GTHDependienteViewModel model)
        {
            // Mapear ViewModel a la entidad GTHDependiente
            var db = new GTHDependiente
            {
                Tipo = model.Tipo,
                IdDependiente = model.IdDependiente,
                CedulaEmpleado = model.CedulaEmpleado,
                DepNombre = model.DepNombre,
                DepFechaNacimiento = model.DepFechaNacimiento,
                DepDiscapacidad = model.DepDiscapacidad,
                DepDocumentoUrl = model.DepDocumentoUrl
            };

            var responseResul = await _repository.Gestionar(db.Tipo, db);

            // Devolver la respuesta mapeada a Generica
            return responseResul.Select(s => new Generica
            {
                valor1 = s.valor1,
                valor2 = s.valor2
            });
        }
    }
}
