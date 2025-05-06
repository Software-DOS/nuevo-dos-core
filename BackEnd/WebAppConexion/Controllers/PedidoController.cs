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
    public class PedidoController : Controller
    {
        private readonly PedidoRepository _repository;
        private readonly IConfiguration _config;
        public PedidoController(PedidoRepository repository, IConfiguration config)
        {
            this._repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _config = config;
        }

        [HttpPost("[action]")]
        public async Task<IEnumerable<GenericaPdf>> GuardarFactura([FromBody] GuardarFacturaViewModel model)
        {

            GuardarFactura db = new GuardarFactura();
            db.IdEmpresa = model.IdEmpresa;
            db.JsonPedido = model.JsonPedido;
            db.JsonCliente = model.JsonCliente;
            db.JsonEncabezado = model.JsonEncabezado;
            db.Observacion = model.Observacion;
            db.Estado = model.Estado;
            db.Tipo = model.Tipo;

            var responseResul = await _repository.InsertFactura(db);
            return responseResul.Select(s => new GenericaPdf
            {
                valor1 = s.valor1,
                valor2 = s.valor2,
                valor3 = s.valor3,
            });

        }

        [HttpPost("[action]")]
        public async Task<IEnumerable<GenericaPdf>> GuardarPedido([FromBody] EncabezadoPedidoViewModel model)
        {

            EncabezadoPedido db = new EncabezadoPedido();
            db.IdPedido = model.IdPedido;
            db.IdEmpresa = model.IdEmpresa;
            db.Cliente = model.Cliente;
            db.Observacion = model.Observacion;
            db.FechaRegistro = model.FechaRegistro;
            db.Json = model.Json;
            db.Estado = model.Estado;
            db.Tipo = model.Tipo;

            var responseResul = await _repository.Insert(db);
            return responseResul.Select(s => new GenericaPdf
            {
                valor1 = s.valor1,
                valor2 = s.valor2,
                valor3 = s.valor3,
                valor4 =s.valor4,
            });

        }

        [HttpGet("[action]")]
        public async Task<IEnumerable<MostrarPedidoViewModel>> MostrarPedido(Int64 IdPedido, Int64 IdEmpresa, Int32 Tipo)
        {
            DateTime date = DateTime.Now;

            var response = await _repository.GetByMostrarPedido(IdPedido, IdEmpresa, Tipo);
            return response.Select(s => new MostrarPedidoViewModel
            {
                IdPedido = s.IdPedido,
                Cliente = s.Cliente,
                StrFechaRegistro = s.FechaRegistro.ToString("dd/MM/yyyy"),
                Total = s.Total,
                Estado = s.Estado,
            });

        }

        [HttpGet("[action]")]
        public async Task<IEnumerable<DetalleFacturaViewModel>> MostrarFacturas(Int64 IdEmpresa,DateTime FechaInicio, DateTime FechaFinal, Int32 Tipo)
        {
            var response = await _repository.GetByMostrarFacturas(IdEmpresa,FechaInicio, FechaFinal, Tipo);
            return response.Select(s => new DetalleFacturaViewModel
            {
                IdFactura = s.IdFactura,
                TipoDocumento = s.TipoDocumento,
                Descripcion = s.Descripcion,
                NumDocumento = s.NumDocumento,
                Observacion = s.Observacion,
                StrFechaEmision = s.FechaEmision.ToString("dd/MM/yyyy"),
                SubTotal = s.SubTotal,
                Iva =s.Iva,
                Total = s.Total,
            });

        }

        [HttpGet("[action]")]
        public async Task<IEnumerable<GenericaPdf>> MostrarPedidoImpreso(Int64 IdPedido, Int64 IdEmpresa, Int32 Tipo)
        {
            DateTime date = DateTime.Now;

            var response = await _repository.GetByMostrarPedidoImpreso(IdPedido, IdEmpresa, Tipo);
            return response.Select(s => new GenericaPdf
            {
                valor1 = s.valor1,
                valor2 = s.valor2,
                valor3 = s.valor3,
                valor4 = s.valor4,
            });

        }

        [HttpGet("[action]")]
        public async Task<IEnumerable<GenericaPdf>> MostrarFacturaImpreso(Int64 IdFactura, Int64 IdEmpresa, Int32 Tipo)
        {
            DateTime date = DateTime.Now;

            var response = await _repository.GetByMostrarFacturaImpreso(IdFactura, IdEmpresa, Tipo);
            return response.Select(s => new GenericaPdf
            {
                valor1 = s.valor1,
                valor2 = s.valor2,
                valor3 = s.valor3,
            });

        }

        [HttpGet("[action]")]
        public async Task<IEnumerable<DetallePedidoViewModel>> MostrarDetallePedido(Int64 IdPedido, Int64 IdEmpresa, string StrPedidos, Int32 Tipo)
        {

            var response = await _repository.GetByMostrarDetallePedido(IdPedido, IdEmpresa, StrPedidos, Tipo);
            return response.Select(s => new DetallePedidoViewModel
            {
                IdDetalle  = s.IdDetalle,
                IdPedido = s.IdPedido,
                Cantidad = s.Cantidad,
                Detalle = s.Detalle,
                Precio = s.Precio ,
                Iva = s.Iva,
                Total = s.Total,
                Porcentaje = s.Porcentaje,
                IdInventario = s.IdInventario,
                Observacion = s.Observacion,
            });

        }

    }
}
