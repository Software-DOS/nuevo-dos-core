using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Conexion.AccesoDatos.Repository.Administracion;
using Conexion.Entidad.Administracion;
using WebAppConexion.Models;

namespace WebAppConexion.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GTHDepartamentoController : ControllerBase
    {
        private readonly GTHDepartamentoRepository _repository;

        public GTHDepartamentoController(GTHDepartamentoRepository repository)
        {
            _repository = repository;
        }

        /// <summary>
        /// Devuelve la lista de departamentos según los filtros proporcionados.
        /// 1 = IdDepartamento, 2 = IdCelula, 0 = Todos.
        /// </summary>
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<GTHDepartamentoViewModel>>> Mostrar(
            [FromQuery] int tipo,
            [FromQuery] int? idDepartamento = null,
            [FromQuery] int? idCelula = null)
        {
            var entidades = await _repository.Mostrar(tipo, idDepartamento, idCelula);

            var modelos = entidades.Select(e => new GTHDepartamentoViewModel
            {
                Tipo = tipo,
                IdDepartamento = e.IdDepartamento,
                IdCelula = e.IdCelula,
                Nombre = e.Nombre,
                Descripcion = e.Descripcion,
                Jefe = e.Jefe,
                Empresa = e.Empresa
            });

            return Ok(modelos);
        }

        /// <summary>
        /// Ejecuta la operación de gestión de departamento:
        /// 0 = Insertar, 1 = Editar, 2 = Eliminar.
        /// </summary>
        [HttpPost("[action]")]
        public async Task<ActionResult<IEnumerable<Generica>>> Gestionar(
            [FromBody] GTHDepartamentoViewModel model)
        {
            var entidad = new GTHDepartamento
            {
                IdDepartamento = model.IdDepartamento,
                IdCelula = model.IdCelula,
                Nombre = model.Nombre,
                Descripcion = model.Descripcion,
                Jefe = model.Jefe,
                Empresa = model.Empresa
            };

            var resultado = await _repository.Gestionar(model.Tipo, entidad);
            return Ok(resultado.Select(r => new Generica
            {
                valor1 = r.valor1,
                valor2 = r.valor2
            }));
        }
    }
}