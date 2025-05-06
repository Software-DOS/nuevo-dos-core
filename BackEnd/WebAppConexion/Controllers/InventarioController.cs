using Conexion.AccesoDatos.Repository.Negocio;
using Conexion.Entidad.Administracion;
using Conexion.Entidad.Negocio;
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
    public class InventarioController : Controller
    {
        private readonly InventarioRepository _repository;
        private readonly IConfiguration _config;
        public InventarioController(InventarioRepository repository, IConfiguration config)
        {
            this._repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _config = config;
        }

        [HttpPost("[action]")]
        public async Task<IEnumerable<Generica>> GuardarInventario([FromBody] InventarioViewModel model)
        {

            Inventario db = new Inventario();
            db.IdInventario = model.IdInventario;
            db.IdEmpresa = model.IdEmpresa;
            db.CodigoPrincipal = model.CodigoPrincipal;
            db.CodigoBarra = model.CodigoBarra;
            db.Descripcion = model.Descripcion;
            db.Stock = model.Stock;
            db.PrecioPublico = model.PrecioPublico;
            db.Costo = model.Costo;
            db.Servicio = model.Servicio;
            db.Iva = model.Iva;
            db.Imagen = model.Imagen;
            db.Impresion = model.Impresion;
            db.json = model.json;
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
        public async Task<IEnumerable<InventarioViewModel>> MostrarInventario(Int64 IdInventario, Int64 IdEmpresa, string Descripcion, Int32 Tipo)
        {
            DateTime date = DateTime.Now;

            var response = await _repository.GetByMostrarInventario(IdInventario, IdEmpresa, Descripcion, Tipo);
            return response.Select(s => new InventarioViewModel
            {
                IdInventario = s.IdInventario,
                IdEmpresa = s.IdEmpresa,
                CodigoPrincipal = s.CodigoPrincipal,
                CodigoBarra = s.CodigoBarra,
                Descripcion = s.Descripcion,
                Stock = s.Stock,
                PrecioPublico = s.PrecioPublico,
                Costo = s.Costo,
                Servicio = s.Servicio,
                Iva = s.Iva,
                Imagen = s.Imagen,
                Impresion = s.Impresion,
                Estado = s.Estado,
                ListaPrecios = s.ListaPrecios,
            });

        }
    }
}
