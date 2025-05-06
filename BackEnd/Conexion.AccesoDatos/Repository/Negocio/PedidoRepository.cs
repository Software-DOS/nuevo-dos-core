using Conexion.Entidad.Administracion;
using Conexion.Entidad.Negocio;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Previewer;
using QuestPDF.Infrastructure;
using System.Data;
using Newtonsoft.Json.Linq;
using QuestPDF.Drawing;

namespace Conexion.AccesoDatos.Repository.Negocio
{
    public class PedidoRepository
    {
        private readonly string _connectionString;
        public DocumentMetadata GetMetadata() => DocumentMetadata.Default;
        public PedidoRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Conexion");
        }
        public async Task<IEnumerable<GenericaPdf>> Insert(EncabezadoPedido encabezadoPedido)
        {
            using (SqlConnection sql = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("InsertarModificarEliminarPedido", sql))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@IdPedido", encabezadoPedido.IdPedido));
                    cmd.Parameters.Add(new SqlParameter("@IdEmpresa", encabezadoPedido.IdEmpresa));
                    cmd.Parameters.Add(new SqlParameter("@Cliente", encabezadoPedido.Cliente));
                    cmd.Parameters.Add(new SqlParameter("@Observacion", encabezadoPedido.Observacion));
                    cmd.Parameters.Add(new SqlParameter("@FechaRegistro", encabezadoPedido.FechaRegistro));
                    cmd.Parameters.Add(new SqlParameter("@Json", encabezadoPedido.Json));
                    cmd.Parameters.Add(new SqlParameter("@Estado", encabezadoPedido.Estado));
                    cmd.Parameters.Add(new SqlParameter("@Tipo", encabezadoPedido.Tipo));
                    await sql.OpenAsync();
                    //await cmd.ExecuteNonQueryAsync();
                    var response = new List<GenericaPdf>();
                    var responseFinal = new List<GenericaPdf>();
                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            response.Add(MapToGenericaPedido(reader));
                        }
                    }

                    #region GenerarPdfg
                    Int64 IdpedidoRegistro = 0;
                    foreach (GenericaPdf generica1 in response)
                    {
                        IdpedidoRegistro = generica1.IdPedido;
                    }

                    var responseEmpresa = await GetByMostrarEmpresa(encabezadoPedido.IdEmpresa, 1);
                    DataTable dataTable = ConvertJsonToDataTable(encabezadoPedido.Json);
                    DataTable dataPlancha = SepararFilasDiferentes(dataTable);
                    DataTable dataCocina = new DataTable();
                    if (dataPlancha.Rows.Count > 0)
                    {
                       dataCocina = EliminarFila(dataTable, dataPlancha.Rows[0]["Impresion"].ToString());
                    }

                    if(dataPlancha.Rows.Count>0 && dataCocina.Rows.Count > 0)
                    {
                        #region multiplePedido
                        string Plancha = GenerarPdfPedidoTable(dataPlancha, encabezadoPedido.Observacion, responseEmpresa, IdpedidoRegistro);
                        string Cocina = GenerarPdfPedidoTable(dataCocina, encabezadoPedido.Observacion, responseEmpresa, IdpedidoRegistro);
                        GenericaPdf generica = new GenericaPdf();
                        if (Plancha != "" && Cocina != "")
                        {
                            foreach (GenericaPdf generica1 in response)
                            {
                                generica.valor1 = generica1.valor1;
                                generica.valor2 = generica1.valor2;
                                generica.valor3 = Plancha;
                                generica.valor4 = Cocina;
                                responseFinal.Add(generica);
                            }
                            return responseFinal;
                        }
                        #endregion
                    }
                    else
                    {
                        #region unPedido
                        string resul = GenerarPdfPedido(encabezadoPedido, responseEmpresa, IdpedidoRegistro);
                        GenericaPdf generica = new GenericaPdf();
                        if (resul != "")
                        {
                            foreach (GenericaPdf generica1 in response)
                            {
                                generica.valor1 = generica1.valor1;
                                generica.valor2 = generica1.valor2;
                                generica.valor3 = resul;
                                generica.valor4 = "";
                                responseFinal.Add(generica);
                            }
                            return responseFinal;
                        }
                        #endregion
                    }

                    #endregion

                    return response;
                }
            }
        }
        public async Task<IEnumerable<GenericaPdf>> InsertFactura(GuardarFactura factura)
        {
            using (SqlConnection sql = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("InsertarModificarEliminarFactura", sql))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@IdEmpresa", factura.IdEmpresa));
                    cmd.Parameters.Add(new SqlParameter("@JsonPedido", factura.JsonPedido));
                    cmd.Parameters.Add(new SqlParameter("@JsonCliente", factura.JsonCliente));
                    cmd.Parameters.Add(new SqlParameter("@JsonEncabezado", factura.JsonEncabezado));
                    cmd.Parameters.Add(new SqlParameter("@Estado", factura.Estado));
                    cmd.Parameters.Add(new SqlParameter("@Tipo", factura.Tipo));
                    await sql.OpenAsync();
                    //await cmd.ExecuteNonQueryAsync();
                    var response = new List<GenericaPdf>();
                    var responseFinal = new List<GenericaPdf>();
                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            response.Add(MapToGenerica(reader));
                        }
                    }

                    #region GenerarPdf

                    var responseEmpresa = await GetByMostrarEmpresa(factura.IdEmpresa, 1);

                    string resul = GenerarPdfPuntoVentaFactura(factura, responseEmpresa);
                    GenericaPdf generica = new GenericaPdf();
                    if (resul != "")
                    {
                        foreach (GenericaPdf generica1 in response)
                        {
                            generica.valor1 = generica1.valor1;
                            generica.valor2 = generica1.valor2;
                            generica.valor3 = resul;
                            responseFinal.Add(generica);
                        }
                        return responseFinal;
                    }
                    #endregion

                    return response;
                }
            }
        }
     
        #region Parametros
        public DataTable ConvertJsonToDataTable(string json)
        {
            // Deserializar el JSON en un JArray
            JArray jsonArray = JArray.Parse(json);

            // Crear una DataTable vacía
            DataTable dataTable = new DataTable();

            // Si el array no está vacío, obtener las propiedades del primer objeto
            if (jsonArray.Count > 0)
            {
                JObject firstObject = (JObject)jsonArray[0];
                foreach (JProperty property in firstObject.Properties())
                {
                    // Crear una columna para cada propiedad
                    dataTable.Columns.Add(property.Name, typeof(string));
                }

                // Llenar la DataTable con los datos del JSON
                foreach (JObject obj in jsonArray)
                {
                    DataRow dataRow = dataTable.NewRow();
                    foreach (JProperty property in obj.Properties())
                    {
                        dataRow[property.Name] = property.Value.ToString();
                    }
                    dataTable.Rows.Add(dataRow);
                }
            }

            return dataTable;
        }
        public DataTable SepararFilasDiferentes(DataTable dataTableOriginal)
        {
            // Crear un nuevo DataTable para almacenar las filas diferentes
            DataTable dataTableFiltrado = dataTableOriginal.Clone(); // Clonar la estructura del DataTable original
            // Condición para determinar si una fila es diferente (por ejemplo, duplicados por el nombre y edad)
            string filter = $"Impresion = '{dataTableOriginal.Rows[0]["Impresion"]}'";
            DataRow[] rowsIguales = dataTableOriginal.Select(filter);
            foreach (var fila in rowsIguales)
            {
                dataTableFiltrado.ImportRow(fila);
            }
            return dataTableFiltrado;
        }
        public DataTable EliminarFila(DataTable dataTable, string Impresion)
        {
            // Lista temporal para almacenar filas a eliminar
            List<DataRow> rowsToDelete = new List<DataRow>();
            // Usar foreach para encontrar filas que deben ser eliminadas
            foreach (DataRow row in dataTable.Rows)
            {
                // Condición de eliminación (por ejemplo, eliminar donde el ID es par)
                if (row["Impresion"].ToString() == Impresion)
                {
                    rowsToDelete.Add(row);
                }
            }
            // Eliminar las filas almacenadas en la lista temporal
            foreach (DataRow row in rowsToDelete)
            {
                dataTable.Rows.Remove(row);
            }
            return dataTable;
        }
        public string GenerarPdf(EncabezadoPedido encabezadoPedido, IEnumerable<Empresa> empresas)
        {
            string ResultadoPdf = "";
          
            string rutaArchivo = AppDomain.CurrentDomain.BaseDirectory;
            rutaArchivo = rutaArchivo.Replace("bin\\Debug\\net5.0\\", "");
            rutaArchivo = rutaArchivo + "Imagen\\Logo.jpeg";
            DataTable dataTable = new DataTable();
            dataTable = ConvertJsonToDataTable(encabezadoPedido.Json);
            try
            {
                string empresa = "";
                string RuCedula = "";
                foreach (Empresa s in empresas)
                {
                    empresa = s.NombreComercial;
                    RuCedula = s.Ruc;
                }

                    var data = Document.Create(document =>
                {
                    document.Page(page =>
                    {
                        page.Size(PageSizes.A4);
                        //page.Size(80, 200, Unit.Millimetre);
                        page.Margin(30);

                        page.Header().ShowOnce().Row(row =>
                        {
                            var rutaImagen = rutaArchivo;
                            byte[] imageData = System.IO.File.ReadAllBytes(rutaImagen);

                            //row.ConstantItem(140).Height(60).Placeholder();
                            row.ConstantItem(150).Image(imageData);


                            row.RelativeItem().Column(col =>
                            {
                                col.Item().AlignCenter().Text(empresa).Bold().FontSize(14);
                                //col.Item().AlignCenter().Text("City").Bold().FontSize(9);
                                //col.Item().AlignCenter().Text("Campus Gustavo Galindo Km 30.5 Via Perimetral").FontSize(9);
                                //col.Item().AlignCenter().Text("2-269690").FontSize(9);
                                //col.Item().AlignCenter().Text("codigo@example.com").FontSize(9);

                            });

                            row.RelativeItem().Column(col =>
                            {
                                col.Item().Border(1).BorderColor("#257272")
                                .AlignCenter().Text("RUC "+ RuCedula);

                                col.Item().Background("#257272").Border(1)
                                .BorderColor("#257272").AlignCenter()
                                .Text("Pedido").FontColor("#fff");

                                //col.Item().Border(1).BorderColor("#257272").
                                //AlignCenter().Text("B0001 - 234");


                            });
                        });

                        page.Content().PaddingVertical(10).Column(col1 =>
                        {
                            col1.Item().Column(col2 =>
                            {
                                col2.Item().Text("Datos del cliente").Underline().Bold();

                                col2.Item().Text(txt =>
                                {
                                    txt.Span("Nombre: ").SemiBold().FontSize(10);
                                    txt.Span(encabezadoPedido.Cliente).FontSize(10);
                                });

                                //col2.Item().Text(txt =>
                                //{
                                //    txt.Span("DNI: ").SemiBold().FontSize(10);
                                //    txt.Span("978978979").FontSize(10);
                                //});

                                //col2.Item().Text(txt =>
                                //{
                                //    txt.Span("Direccion: ").SemiBold().FontSize(10);
                                //    txt.Span("av. miraflores 123").FontSize(10);
                                //});
                            });

                            col1.Item().LineHorizontal(0.5f);

                            col1.Item().Table(tabla =>
                            {
                            tabla.ColumnsDefinition(columns =>
                            {
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                            });

                            tabla.Header(header =>
                            {
                                header.Cell().Background("#257272")
                                .Padding(2).Text("Cantidad").FontColor("#fff");

                                header.Cell().Background("#257272")
                               .Padding(2).Text("Descripcion").FontColor("#fff");

                                header.Cell().Background("#257272")
                               .Padding(2).Text("Precio").FontColor("#fff");

                                header.Cell().Background("#257272")
                               .Padding(2).Text("Iva").FontColor("#fff");

                                header.Cell().Background("#257272")
                                .Padding(2).Text("SubTotal").FontColor("#fff");
                            });

                            foreach (DataRow dt in dataTable.Rows)
                            {
                                tabla.Cell().BorderBottom(0.5f).BorderColor("#D9D9D9")
                                .Padding(2).Text(dt["Cantidad"].ToString()).FontSize(10);

                                tabla.Cell().BorderBottom(0.5f).BorderColor("#D9D9D9")
                               .Padding(2).Text(dt["Detalle"].ToString()).FontSize(10);

                                tabla.Cell().BorderBottom(0.5f).BorderColor("#D9D9D9")
                               .Padding(2).Text(dt["Precio"].ToString()).FontSize(10);

                                tabla.Cell().BorderBottom(0.5f).BorderColor("#D9D9D9")
                               .Padding(2).Text(dt["Iva"].ToString()).FontSize(10);

                                tabla.Cell().BorderBottom(0.5f).BorderColor("#D9D9D9")
                               .Padding(2).Text(dt["Total"].ToString()).FontSize(10);
                            }

                            // Fila del total
                            //tabla.Cell().BorderBottom(0.0f).BorderColor("#D9D9D9");
                            //tabla.Cell().AlignLeft();
                            //tabla.Cell().Padding(20).Text("Total:  " + CalculateTotal(dataTable).ToString()).FontSize(10);

                            });

                            col1.Spacing(10);
                            col1.Item().AlignRight().Text("Total: " + $"${CalculateTotal(dataTable).ToString():F2}").FontSize(14).Bold();

                        });

                        page.Footer()
                        .AlignRight()
                        .Text(txt =>
                        {
                            txt.Span("Pagina ").FontSize(10);
                            txt.CurrentPageNumber().FontSize(10);
                            txt.Span(" de ").FontSize(10);
                            txt.TotalPages().FontSize(10);
                        });
                    });
                }).GeneratePdf();

                ResultadoPdf = Convert.ToBase64String(data);
            }
            catch (Exception ex)
            {
                ResultadoPdf = ex.Message.ToString();
            }

            return ResultadoPdf;
        }
        public string GenerarPdfPuntoVentaFactura(GuardarFactura factura, IEnumerable<Empresa> empresas)
        {
            string ResultadoPdf = "";

            string rutaArchivo = AppDomain.CurrentDomain.BaseDirectory;
            rutaArchivo = rutaArchivo.Replace("bin\\Debug\\net5.0\\", "");
            rutaArchivo = rutaArchivo + "Imagen\\Logo.jpeg";
            DataTable dataTable = new DataTable();
            DataTable dataTableCliente = new DataTable();
            DataTable dataTableEncaFactura = new DataTable();
            dataTable = ConvertJsonToDataTable(factura.JsonPedido);
            dataTableCliente = ConvertJsonToDataTable("[" + factura.JsonCliente + "]");
            dataTableEncaFactura = ConvertJsonToDataTable("[" + factura.JsonEncabezado + "]");
            try
            {

                string empresa = "";
                string RuCedula = "";
                string Direccion = "";
                string ImagenString64 = "";
                int RecortarDetalle = 0;
                foreach (Empresa s in empresas)
                {
                    empresa = s.NombreComercial;
                    RuCedula = s.Ruc;
                    Direccion = s.Direccion;
                    ImagenString64 = s.ImagenString64;
                    RecortarDetalle = s.RecortarDetalle;
                }

                byte[] imageData = null;
                if (ImagenString64 != null)
                {
                    imageData = Convert.FromBase64String(ImagenString64);
                }

                var data = Document.Create(document =>
                {
                    document.Page(page =>
                    {
                        page.Size(50, 200, Unit.Millimetre); // Tamaño de la página en mm
                        page.Margin(10); // Márgenes pequeños para aprovechar el espacio
                        page.DefaultTextStyle(x => x.FontSize(10)); // Tamaño de fuente por defecto

                        page.Content().Column(column =>
                        {
                            // Encabezado
                            DateTime thisDay = DateTime.Today;
                            string time = DateTime.Now.ToString("T");
                            if (imageData != null)
                            {
                                column.Item().Image(imageData);
                            }
                            column.Item().AlignCenter().Text(empresa).FontSize(8).Bold();
                            column.Item().AlignCenter().Text("Ruc: " + RuCedula).FontSize(7);
                            column.Item().AlignCenter().Text("Dir. " + Direccion).FontSize(7);
                            //column.Item().AlignCenter().Text("Fecha: 2024-08-08 10:00 AM").FontSize(10);
                            column.Spacing(1); // Espacio en blanco para separar
                            column.Item().AlignCenter().Text("==========================").FontSize(8);
                            column.Item().AlignLeft().Text("Cliente: " + dataTableCliente.Rows[0]["Descripcion"].ToString()).FontSize(7);
                            column.Item().AlignLeft().Text("Ruc/CI:  " + dataTableCliente.Rows[0]["RuCedula"].ToString()).FontSize(7);
                            //column.Item().AlignLeft().Text("Fecha:   " + thisDay.ToString("D") + "  " + time).FontSize(8);
                            column.Item().AlignLeft().Text("Fecha:   " + thisDay.ToString("dd/MM/yyyy") + "  " + time).FontSize(7);
                            column.Item().AlignCenter().Text(factura.Observacion).FontSize(7);
                            if (dataTableEncaFactura.Rows[0]["NumDocumento"].ToString() != "000-000-000000000")
                            {
                                column.Item().AlignLeft().Text("Num. Factura:   " + dataTableEncaFactura.Rows[0]["NumDocumento"].ToString()).FontSize(7);
                            }
                            column.Item().AlignCenter().Text("==========================").FontSize(8);
                            // Detalle de la compra
                            column.Item().Row(row =>
                            {
                                row.RelativeItem(2).Text("Cant.").Bold().FontSize(6);
                                row.RelativeItem(5).Text("Artículo").Bold().FontSize(6);
                                row.RelativeItem(2).AlignRight().Text("Precio").Bold().FontSize(6);
                                row.RelativeItem(2).AlignRight().Text("SbTotal").Bold().FontSize(6);
                            });

                            column.Spacing(1);  // Espacio en blanco para separar

                            // Aquí agregas los items. Puedes hacerlo dinámicamente si es necesario.
                            foreach (DataRow dt in dataTable.Rows)
                            {
                                decimal total = Convert.ToDecimal(dt["Precio"].ToString()) + Convert.ToDecimal(dt["Iva"].ToString());
                                decimal SubTotal = Convert.ToDecimal(dt["Cantidad"].ToString()) * (Convert.ToDecimal(dt["Precio"].ToString()) + Convert.ToDecimal(dt["Iva"].ToString()));

                                if (RecortarDetalle != 0 && dt["Detalle"].ToString().Length > RecortarDetalle)
                                {
                                    AddItem(column, dt["Cantidad"].ToString(), dt["Detalle"].ToString().Substring(0,RecortarDetalle), total.ToString(), SubTotal.ToString());
                                }
                                else
                                {
                                    AddItem(column, dt["Cantidad"].ToString(), dt["Detalle"].ToString(), total.ToString(), SubTotal.ToString());
                                }
                                //AddItemDescripcion(column, dt["Cantidad"].ToString(), dt["Detalle"].ToString(), total.ToString(), SubTotal.ToString());
                            }
                            column.Spacing(1);  // Espacio en blanco para separar
                            column.Item().AlignCenter().Text("==========================").FontSize(8);
                            // Total
                            column.Item().Row(row =>
                            {
                                row.RelativeItem(1).AlignRight().Text("SubTotal:   " + $"${CalculateSubTotal(dataTable).ToString():F2}").Bold().FontSize(7);
                            });

                            column.Item().Row(row =>
                            {
                                row.RelativeItem(1).AlignRight().Text("Iva:        " + $"${CalculateIva(dataTable).ToString():F2}").Bold().FontSize(7);
                            });

                            column.Item().Row(row =>
                            {
                                row.RelativeItem(1).AlignRight().Text("Total:      " + $"${CalculateTotal(dataTable).ToString():F2}").Bold().FontSize(7);
                            });
                        });
                    });
                }).GeneratePdf();

                ResultadoPdf = Convert.ToBase64String(data);
            }
            catch (Exception ex)
            {
                ResultadoPdf = ex.Message.ToString();
            }

            return ResultadoPdf;
        }
        public string GenerarPdfPedido(EncabezadoPedido factura, IEnumerable<Empresa> empresas, Int64 IdpedidoRegistro)
        {
            string ResultadoPdf = "";

            string rutaArchivo = AppDomain.CurrentDomain.BaseDirectory;
            rutaArchivo = rutaArchivo.Replace("bin\\Debug\\net5.0\\", "");
            rutaArchivo = rutaArchivo + "Imagen\\Logo.jpeg";
            DataTable dataTable = new DataTable();
            DataTable dataTableCliente = new DataTable();
            DataTable dataTableEncaFactura = new DataTable();
            dataTable = ConvertJsonToDataTable(factura.Json);
            //dataTableCliente = ConvertJsonToDataTable( "[" + factura.JsonCliente +"]" );
            //dataTableEncaFactura = ConvertJsonToDataTable("[" + factura.JsonEncabezado + "]");
            try
            {

                string empresa = "";
                string RuCedula = "";
                string Direccion = "";
                string ImagenString64 = "";
                foreach (Empresa s in empresas)
                {
                    empresa = s.NombreComercial;
                    RuCedula = s.Ruc;
                    Direccion = s.Direccion;
                    ImagenString64 = s.ImagenString64;
                }

                byte[] imageData = null;
                if (ImagenString64 != null)
                {
                    imageData = Convert.FromBase64String(ImagenString64);
                }

                var data = Document.Create(document =>
                {
                    document.Page(page =>
                    {
                        page.Size(50, 200, Unit.Millimetre); // Tamaño de la página en mm
                        page.Margin(10); // Márgenes pequeños para aprovechar el espacio
                        page.DefaultTextStyle(x => x.FontSize(10)); // Tamaño de fuente por defecto

                        page.Content().Column(column =>
                        {
                            // Encabezado
                            DateTime thisDay = DateTime.Today;
                            string time = DateTime.Now.ToString("T");
                            column.Item().AlignCenter().Text("Pedido #: " + IdpedidoRegistro.ToString()).FontSize(12);
                            column.Item().AlignCenter().Text(factura.Observacion).FontSize(12);
                            column.Item().AlignLeft().Text("Fecha:   " + thisDay.ToString("dd/MM/yyyy") + "  " + time).FontSize(8);
                            // Detalle de la compra
                            column.Item().Row(row =>
                            {
                                row.RelativeItem(2).Text("Cant.").Bold().FontSize(7);
                                row.RelativeItem(3).Text("Artículo").Bold().FontSize(7);
                            });

                            column.Spacing(2);  // Espacio en blanco para separar

                            // Aquí agregas los items. Puedes hacerlo dinámicamente si es necesario.
                            foreach (DataRow dt in dataTable.Rows)
                            {
                                decimal total = Convert.ToDecimal(dt["Precio"].ToString()) + Convert.ToDecimal(dt["Iva"].ToString());
                                decimal SubTotal = Convert.ToDecimal(dt["Cantidad"].ToString())*(Convert.ToDecimal(dt["Precio"].ToString()) + Convert.ToDecimal(dt["Iva"].ToString()));

                                AddItemPedido(column, dt["Cantidad"].ToString(), dt["Detalle"].ToString(), "", "");
                            }
                            column.Spacing(5);  // Espacio en blanco para separar
                            column.Item().AlignCenter().Text("==========================").FontSize(8);
                        });
                    });
                }).GeneratePdf();

                ResultadoPdf = Convert.ToBase64String(data);
            }
            catch (Exception ex)
            {
                ResultadoPdf = ex.Message.ToString();
            }

            return ResultadoPdf;
        }
        public string GenerarPdfPedidoTable(DataTable dataTable, string Observacion, IEnumerable<Empresa> empresas, Int64 IdpedidoRegistro)
        {
            string ResultadoPdf = "";

            string rutaArchivo = AppDomain.CurrentDomain.BaseDirectory;
            rutaArchivo = rutaArchivo.Replace("bin\\Debug\\net5.0\\", "");
            rutaArchivo = rutaArchivo + "Imagen\\Logo.jpeg";
            try
            {

                string empresa = "";
                string RuCedula = "";
                string Direccion = "";
                string ImagenString64 = "";
                foreach (Empresa s in empresas)
                {
                    empresa = s.NombreComercial;
                    RuCedula = s.Ruc;
                    Direccion = s.Direccion;
                    ImagenString64 = s.ImagenString64;
                }

                byte[] imageData = null;
                if (ImagenString64 != null)
                {
                    imageData = Convert.FromBase64String(ImagenString64);
                }

                var data = Document.Create(document =>
                {
                    document.Page(page =>
                    {
                        page.Size(50, 200, Unit.Millimetre); // Tamaño de la página en mm
                        page.Margin(10); // Márgenes pequeños para aprovechar el espacio
                        page.DefaultTextStyle(x => x.FontSize(10)); // Tamaño de fuente por defecto

                        page.Content().Column(column =>
                        {
                            // Encabezado
                            DateTime thisDay = DateTime.Today;
                            string time = DateTime.Now.ToString("T");
                            column.Item().AlignCenter().Text("Pedido #: " + IdpedidoRegistro.ToString()).FontSize(12);
                            column.Item().AlignCenter().Text(Observacion).FontSize(12);
                            column.Item().AlignLeft().Text("Fecha:   " + thisDay.ToString("dd/MM/yyyy") + "  " + time).FontSize(8);
                            // Detalle de la compra
                            column.Item().Row(row =>
                            {
                                row.RelativeItem(2).Text("Cant.").Bold().FontSize(7);
                                row.RelativeItem(3).Text("Artículo").Bold().FontSize(7);
                            });

                            column.Spacing(2);  // Espacio en blanco para separar

                            // Aquí agregas los items. Puedes hacerlo dinámicamente si es necesario.
                            foreach (DataRow dt in dataTable.Rows)
                            {
                                decimal total = Convert.ToDecimal(dt["Precio"].ToString()) + Convert.ToDecimal(dt["Iva"].ToString());
                                decimal SubTotal = Convert.ToDecimal(dt["Cantidad"].ToString()) * (Convert.ToDecimal(dt["Precio"].ToString()) + Convert.ToDecimal(dt["Iva"].ToString()));

                                AddItemPedido(column, dt["Cantidad"].ToString(), dt["Detalle"].ToString(), "", "");
                            }
                            column.Spacing(5);  // Espacio en blanco para separar
                            column.Item().AlignCenter().Text("==========================").FontSize(8);
                        });
                    });
                }).GeneratePdf();

                ResultadoPdf = Convert.ToBase64String(data);
            }
            catch (Exception ex)
            {
                ResultadoPdf = ex.Message.ToString();
            }

            return ResultadoPdf;
        }
        private void AddItem(ColumnDescriptor column, string Cantidad, string itemName, string price,string subTotal)
        {
            column.Item().Row(row =>
            {
                row.RelativeItem(1).Text(Cantidad).FontSize(6);
                row.RelativeItem(4).Text(itemName).FontSize(6);
                row.RelativeItem(1).Text(price).FontSize(6);
                row.RelativeItem(1).Text(subTotal).FontSize(6);
            });
        }

        private void AddItemDescripcion(ColumnDescriptor column, string Cantidad, string itemName, string price, string subTotal)
        {
            column.Item().Row(row =>
            {
                row.RelativeItem(10).Text(itemName).FontSize(7);
            });
        }

        private void AddItemPedido(ColumnDescriptor column, string Cantidad, string itemName, string price, string subTotal)
        {
            column.Item().Row(row =>
            {
                row.RelativeItem(1).Text(Cantidad).FontSize(7);
                row.RelativeItem(4).Text(itemName).FontSize(7);
            });
        }
        decimal CalculateTotal(DataTable data)
        {
            decimal total = 0;
            foreach (DataRow dt in data.Rows)
            {
                total += Convert.ToDecimal(dt["Total"]);
            }
            return Convert.ToDecimal(total.ToString("F2"));//Math.Round(total, 2);
        }
        decimal CalculateSubTotal(DataTable data)
        {
            decimal Subtotal = 0;
            foreach (DataRow dt in data.Rows)
            {
                Subtotal += Convert.ToDecimal(dt["Cantidad"])* Convert.ToDecimal(dt["Precio"]);
            }
            return Convert.ToDecimal(Subtotal.ToString("F2"));//Math.Round(Subtotal, 2);
        }
        decimal CalculateIva(DataTable data)
        {
            decimal iva = 0;
            foreach (DataRow dt in data.Rows)
            {
                iva += (Convert.ToDecimal(dt["Cantidad"]) * Convert.ToDecimal(dt["Precio"])) * (Convert.ToDecimal(dt["Porcentaje"])/100);
            }
            return Convert.ToDecimal(iva.ToString("F2"));//Math.Round(iva, 2);
        }

        #endregion

        public async Task<IEnumerable<MostrarPedido>> GetByMostrarPedido(Int64 IdPedido, Int64 IdEmpresa, Int32 Tipo)
        {
            using (SqlConnection sql = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("MostrarPedido", sql))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@IdPedido", IdPedido));
                    cmd.Parameters.Add(new SqlParameter("@IdEmpresa", IdEmpresa));
                    cmd.Parameters.Add(new SqlParameter("@Tipo", Tipo));
                    var response = new List<MostrarPedido>();
                    await sql.OpenAsync();

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            response.Add(MapToPedido(reader));
                        }
                    }

                    return response;
                }
            }
        }

        public async Task<IEnumerable<DetalleFactura>> GetByMostrarFacturas(Int64 IdEmpresa, DateTime FechaInicio, DateTime FechaFinal, Int32 Tipo)
        {
            using (SqlConnection sql = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("MostrarFacturas", sql))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@IdEmpresa", IdEmpresa));
                    cmd.Parameters.Add(new SqlParameter("@FechaInicio", FechaInicio));
                    cmd.Parameters.Add(new SqlParameter("@FechaFinal", FechaFinal));
                    cmd.Parameters.Add(new SqlParameter("@Tipo", Tipo));
                    var response = new List<DetalleFactura>();
                    await sql.OpenAsync();

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            response.Add(MapToDetalleFactura(reader));
                        }
                    }

                    return response;
                }
            }
        }

        public async Task<IEnumerable<GenericaPdf>> GetByMostrarPedidoImpreso(Int64 IdPedido, Int64 IdEmpresa, Int32 Tipo)
        {
            using (SqlConnection sql = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("MostrarPedidoImpreso", sql))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@IdEmpresa", IdEmpresa));
                    cmd.Parameters.Add(new SqlParameter("@IdPedido", IdPedido));
                    cmd.Parameters.Add(new SqlParameter("@Tipo", Tipo));
                    var response = new List<EncabezadoPedido>();
                    var response2 = new List<GenericaPdf>();
                    var responseFinal = new List<GenericaPdf>();
                    await sql.OpenAsync();

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            response.Add(MapToPedidoImpreso(reader));
                        }
                    }

                    #region GenerarPdfg
                    Int64 IdpedidoRegistro = 0;
                    string Json = "";
                    string Observacion = "";
                    EncabezadoPedido encabezadoPedido = new EncabezadoPedido();
                    foreach (EncabezadoPedido generica1 in response)
                    {
                        IdpedidoRegistro = generica1.IdPedido;
                        Json = generica1.Json;
                        Observacion = generica1.Observacion;
                        encabezadoPedido.Observacion = Observacion;
                        encabezadoPedido.Json = Json;
                    }


                    var responseEmpresa = await GetByMostrarEmpresa(IdEmpresa, 1);
                    DataTable dataTable = ConvertJsonToDataTable(Json);
                    DataTable dataPlancha = SepararFilasDiferentes(dataTable);
                    DataTable dataCocina = new DataTable();
                    if (dataPlancha.Rows.Count > 0)
                    {
                        dataCocina = EliminarFila(dataTable, dataPlancha.Rows[0]["Impresion"].ToString());
                    }

                    if (dataPlancha.Rows.Count > 0 && dataCocina.Rows.Count > 0)
                    {
                        #region multiplePedido
                        string Plancha = GenerarPdfPedidoTable(dataPlancha, Observacion, responseEmpresa, IdpedidoRegistro);
                        string Cocina = GenerarPdfPedidoTable(dataCocina, Observacion, responseEmpresa, IdpedidoRegistro);
                        GenericaPdf generica = new GenericaPdf();
                        if (Plancha != "" && Cocina != "")
                        {

                            generica.valor1 = 1;
                            generica.valor2 = "";
                            generica.valor3 = Plancha;
                            generica.valor4 = Cocina;
                            responseFinal.Add(generica);

                            return responseFinal;
                        }
                        #endregion
                    }
                    else
                    {
                        #region unPedido
                        string resul = GenerarPdfPedido(encabezadoPedido, responseEmpresa, IdpedidoRegistro);
                        GenericaPdf generica = new GenericaPdf();
                        if (resul != "")
                        {

                            generica.valor1 = 1;
                            generica.valor2 = "";
                            generica.valor3 = resul;
                            generica.valor4 = "";
                            responseFinal.Add(generica);

                            return responseFinal;
                        }
                        #endregion
                    }

                    #endregion

                    return response2;
                }
            }
        }

        public async Task<IEnumerable<GenericaPdf>> GetByMostrarFacturaImpreso(Int64 IdFactura, Int64 IdEmpresa, Int32 Tipo)
        {
            using (SqlConnection sql = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("MostrarFacturaImpreso", sql))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@IdFactura", IdFactura));
                    cmd.Parameters.Add(new SqlParameter("@IdEmpresa", IdEmpresa));
                    cmd.Parameters.Add(new SqlParameter("@Tipo", Tipo));
                    var response = new List<GuardarFactura>();
                    var response2 = new List<GenericaPdf>();
                    var responseFinal = new List<GenericaPdf>();
                    await sql.OpenAsync();

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            response.Add(MapToFacturaImpreso(reader));
                        }
                    }

                    #region GenerarPdf

                    var responseEmpresa = await GetByMostrarEmpresa(IdEmpresa, 1);

                    GuardarFactura factura = new GuardarFactura();
                    foreach (GuardarFactura generica1 in response)
                    {
                        factura.JsonPedido = generica1.JsonPedido;
                        factura.JsonCliente = generica1.JsonCliente;
                        factura.JsonEncabezado = generica1.JsonEncabezado;
                        factura.Observacion = generica1.Observacion;
                    }

                    string resul = GenerarPdfPuntoVentaFactura(factura, responseEmpresa);
                    GenericaPdf generica = new GenericaPdf();
                    if (resul != "")
                    {
                        generica.valor1 = 1;
                        generica.valor2 = "";
                        generica.valor3 = resul;
                        responseFinal.Add(generica);
                        return responseFinal;
                    }
                    #endregion


                    return response2;
                }
            }
        }

        public async Task<IEnumerable<DetallePedido>> GetByMostrarDetallePedido(Int64 IdPedido, Int64 IdEmpresa, string StrPedidos, Int32 Tipo)
        {
            using (SqlConnection sql = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("MostrarPedido", sql))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@IdPedido", IdPedido));
                    cmd.Parameters.Add(new SqlParameter("@IdEmpresa", IdEmpresa));
                    cmd.Parameters.Add(new SqlParameter("@StrPedidos", StrPedidos));
                    cmd.Parameters.Add(new SqlParameter("@Tipo", Tipo));
                    var response = new List<DetallePedido>();
                    await sql.OpenAsync();

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            response.Add(MapToDetallePedido(reader));
                        }
                    }

                    return response;
                }
            }
        }
        private MostrarPedido MapToPedido(SqlDataReader reader)
        {
            return new MostrarPedido()
            {
                IdPedido = (Int64)reader["IdPedido"],
                Cliente = reader["Cliente"].ToString(),
                FechaRegistro = (DateTime)reader["FechaRegistro"],
                Total = (decimal)reader["Total"],
                Estado = (int)reader["Estado"],
            };
        }

        private DetalleFactura MapToDetalleFactura(SqlDataReader reader)
        {
            return new DetalleFactura()
            {
                IdFactura = (Int64)reader["IdFactura"],
                TipoDocumento = reader["TipoDocumento"].ToString(),
                NumDocumento = reader["NumDocumento"].ToString(),
                Observacion = reader["Observacion"].ToString(),
                Descripcion = reader["Descripcion"].ToString(),
                FechaEmision = (DateTime)reader["FechaEmision"],
                SubTotal = (decimal)reader["SubTotal"],
                Iva = (decimal)reader["Iva"],
                Total = (decimal)reader["Total"],
            };
        }
        private EncabezadoPedido MapToPedidoImpreso(SqlDataReader reader)
        {
            return new EncabezadoPedido()
            {
                IdPedido = (Int64)reader["IdPedido"],
                Observacion = reader["Observacion"].ToString(),
                Json = reader["Json"].ToString(),
            };
        }

        private GuardarFactura MapToFacturaImpreso(SqlDataReader reader)
        {
            return new GuardarFactura()
            {
                JsonPedido = reader["JsonPedido"].ToString(),
                JsonCliente = reader["JsonCliente"].ToString(),
                JsonEncabezado = reader["JsonEncabezado"].ToString(),
                Observacion = reader["Observacion"].ToString(),
            };
        }

        private DetallePedido MapToDetallePedido(SqlDataReader reader)
        {
            return new DetallePedido()
            {
                IdDetalle = (Int64)reader["IdDetalle"],
                IdPedido = (Int64)reader["IdPedido"],
                Cantidad = (decimal)reader["Cantidad"],
                Detalle = reader["Detalle"].ToString(),
                Precio = (decimal)reader["Precio"],
                Iva = (decimal)reader["Iva"],
                Total = (decimal)reader["Total"],
                Porcentaje = (Int32)reader["Porcentaje"],
                IdInventario = (Int64)reader["IdInventario"],
                Observacion = reader["Observacion"].ToString(),
            };
        }
        private GenericaPdf MapToGenerica(SqlDataReader reader)
        {
            return new GenericaPdf()
            {
                valor1 = (Int16)reader["valor1"],
                valor2 = reader["valor2"].ToString()
            };
        }
        private GenericaPdf MapToGenericaPedido(SqlDataReader reader)
        {
            return new GenericaPdf()
            {
                valor1 = (Int16)reader["valor1"],
                valor2 = reader["valor2"].ToString(),
                IdPedido = (Int64)reader["IdPedido"],
            };
        }
        public async Task<IEnumerable<Empresa>> GetByMostrarEmpresa(Int64 IdEmpresa, Int32 Tipo)
        {
            using (SqlConnection sql = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("MostrarEmpresa", sql))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@IdEmpresa", IdEmpresa));
                    cmd.Parameters.Add(new SqlParameter("@Tipo", Tipo));
                    var response = new List<Empresa>();
                    await sql.OpenAsync();

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            response.Add(MapToEmpresa(reader));
                        }
                    }

                    return response;
                }
            }
        }
        private Empresa MapToEmpresa(SqlDataReader reader)
        {
            return new Empresa()
            {
                IdEmpresa = (Int64)reader["IdEmpresa"],
                RazonSocial = reader["RazonSocial"].ToString(),
                NombreComercial = reader["NombreComercial"].ToString(),
                Ruc = reader["Ruc"].ToString(),
                NumResolucion = reader["NumResolucion"].ToString(),
                Direccion = reader["Direccion"].ToString(),
                Correo = reader["Correo"].ToString(),
                Telefono = reader["Telefono"].ToString(),
                Obligado = reader["Obligado"].ToString(),
                Regimen = reader["Regimen"].ToString(),
                RutaCertificado = reader["RutaCertificado"].ToString(),
                ClaveCertificado = reader["ClaveCertificado"].ToString(),
                RutaImagen = reader["RutaImagen"].ToString(),
                Estado = (int)reader["Estado"],
                FechaCaducidad = (DateTime)reader["FechaCaducidad"],
                RecortarDetalle = (int)reader["RecortarDetalle"],
                ImagenString64 = reader["ImagenString64"].ToString(),
            };
        }

    }
}
