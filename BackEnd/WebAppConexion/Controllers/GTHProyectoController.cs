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
    public class GTHProyectoController : Controller
    {
        private readonly GTHProyectoRepository _repository;
        private readonly IConfiguration _config;

        public GTHProyectoController(GTHProyectoRepository repository, IConfiguration config)
        {
            this._repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _config = config;
        }

        /// <summary>
        /// Devuelve la lista de proyectos según los filtros proporcionados.
        /// 0 = Todos, 1 = Por cédula empleado.
        /// </summary>
        [HttpGet("[action]")]
        public async Task<IEnumerable<GTHProyectoViewModel>> Mostrar(
            [FromQuery] int tipo,
            [FromQuery] string cedulaEmpleado = null)
        {
            // Llamamos al repositorio con los filtros
            var entidades = await _repository.Mostrar(tipo, cedulaEmpleado);

            // Mapear cada GTHProyecto a tu ViewModel
            return entidades.Select(e => new GTHProyectoViewModel
            {
                Tipo = e.Tipo,
                IdProyecto = e.IdProyecto,
                CedulaEmpleado = e.CedulaEmpleado,
                ProTitulo = e.ProTitulo,
                ProEspecialidad = e.ProEspecialidad,
                ProAnio = e.ProAnio
            });
        }

        /// <summary>
        /// Ejecuta la operación de gestión de proyecto:
        /// 0 = Insertar, 1 = Editar, 2 = Eliminar.
        /// </summary>
        [HttpPost("[action]")]
        public async Task<IEnumerable<Generica>> Gestionar([FromBody] GTHProyectoViewModel model)
        {
            // Mapear ViewModel a la entidad GTHProyecto
            var db = new GTHProyecto
            {
                Tipo = model.Tipo,
                IdProyecto = model.IdProyecto,
                CedulaEmpleado = model.CedulaEmpleado,
                ProTitulo = model.ProTitulo,
                ProEspecialidad = model.ProEspecialidad,
                ProAnio = model.ProAnio
            };

            var responseResult = await _repository.Gestionar(db.Tipo, db);
            return responseResult;
        }
    }
}
