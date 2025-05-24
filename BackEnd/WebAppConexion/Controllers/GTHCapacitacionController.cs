using Conexion.AccesoDatos.Repository.Administracion;
using Conexion.Entidad.Administracion;
using DocumentFormat.OpenXml.Drawing.Charts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAppConexion.Models;


namespace WebAppConexion.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GTHCapacitacionController : ControllerBase
    {
        private readonly GTHCapacitacionRepository _repository;

        public GTHCapacitacionController(GTHCapacitacionRepository repository)
        {
            _repository = repository;
        }

        /// <summary>
        /// Devuelve la lista de capacitaciones según los filtros proporcionados.
        /// 1 = IdCapacitacion, 2 = IdEntidadCap, 3 = Estado, 4 = FechaInicio, 5 = FechaFin.
        /// </summary>
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<GTHCapacitacionViewModel>>> Mostrar(
            [FromQuery] int tipo,
            [FromQuery] int? idCapacitacion = null,
            [FromQuery] long? idEntidadCap = null,
            [FromQuery] string estado = null,
            [FromQuery] DateTime? fechaInicio = null,
            [FromQuery] DateTime? fechaFin = null)
        {
            var entidades = await _repository.Mostrar(tipo,
                idCapacitacion,
                (int?)idEntidadCap,
                estado,
                fechaInicio,
                fechaFin);

            var modelos = entidades.Select(e => new GTHCapacitacionViewModel
            {
                Tipo = tipo,
                IdCapacitacion = e.IdCapacitacion,
                IdEntidadCap = e.IdEntidadCap,
                Nombre = e.Nombre,
                Titulo = e.Titulo,
                Categoria = e.Categoria,
                Descripcion = e.Descripcion,
                Estado = e.Estado,
                FechaInicio = e.FechaInicio,
                FechaFin = e.FechaFin,
                FechaExpiracion = e.FechaExpiracion,
                UrlVerificacion = e.UrlVerificacion,
                ArchivosAdjuntos = e.ArchivosAdjuntos,
                Observaciones = e.Observaciones,
                Duracion = e.Duracion,
                Costo = e.Costo,
                Modalidad = e.Modalidad
            });

            return Ok(modelos);
        }

        /// <summary>
        /// Ejecuta la operación de gestión de capacitación:
        /// 0 = Insertar, 1 = Editar, 2 = Eliminar.
        /// </summary>
        [HttpPost("[action]")]
        public async Task<ActionResult<IEnumerable<Generica>>> Gestionar(
            [FromBody] GTHCapacitacionViewModel model)
        {
            // Mapear ViewModel a Entidad
            var entidad = new GTHCapacitacion
            {
                IdCapacitacion = model.IdCapacitacion,
                IdEntidadCap = model.IdEntidadCap,
                Nombre = model.Nombre,
                Titulo = model.Titulo,
                Categoria = model.Categoria,
                Descripcion = model.Descripcion,
                Estado = model.Estado,
                FechaInicio = model.FechaInicio,
                FechaFin = model.FechaFin,
                FechaExpiracion = model.FechaExpiracion,
                UrlVerificacion = model.UrlVerificacion,
                ArchivosAdjuntos = model.ArchivosAdjuntos,
                Observaciones = model.Observaciones,
                Duracion = model.Duracion,
                Costo = model.Costo,
                Modalidad = model.Modalidad
            };

            var resultado = await _repository.Gestionar(model.Tipo, entidad);

            // Retornamos los valores genéricos
            return Ok(resultado.Select(r => new Generica
            {
                valor1 = r.valor1,
                valor2 = r.valor2
            }));
        }
    }
}
