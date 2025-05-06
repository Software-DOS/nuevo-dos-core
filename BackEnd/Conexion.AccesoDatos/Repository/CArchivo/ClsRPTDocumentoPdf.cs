using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.Reporting.WinForms;
using Microsoft.VisualBasic;
using Microsoft.VisualBasic.CompilerServices;
using OnBarcode.Barcode;

using System.Data;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;

namespace Conexion.AccesoDatos.Repository.CArchivo
{
    public class ClsRPTDocumentoPdf
    {
        #region Variable
        private static string _rutaLog;
        #endregion

        #region BuscarArchivo
        public static bool BuscarArchivo(string Ruta)
        {
            bool flag;
            try
            {
                FileInfo info = new FileInfo(Ruta);
                if (info.Exists)
                {
                    return true;
                }
                flag = false;
            }
            catch (Exception exception1)
            {
                ProjectData.SetProjectError(exception1);
                Exception exception = exception1;
                flag = false;

                return flag;

            }
            return flag;
        }
        #endregion

        #region CargarImg_BarCode_Banner
        public static bool CargarImg_BarCode_Banner(int TipoDoc, ref DataSet ds, string DirectorioRDLC, ref string mensaje)
        {
            bool flag;
            try
            {
                string str2 = string.Empty;
                switch (TipoDoc)
                {
                    case 1:
                        str2 = "Factura";
                        break;

                    case 2:
                        str2 = "Retencion";
                        break;

                    case 3:
                        str2 = "NotaCredito";
                        break;

                    case 4:
                        str2 = "NotaDebito";
                        break;

                    case 5:
                        str2 = "GuiaRemision";
                        break;
                    case 6:
                        str2 = "Factura";
                        break;
                }
                byte[] buffer = GenerarCodBarras(DBNullToTexto(RuntimeHelpers.GetObjectValue(ds.Tables[str2].Rows[0]["ClaveAcceso"])), ref mensaje);
                if (buffer != null)
                {
                    try
                    {
                        ds.Tables[str2].Rows[0]["ImgCodigoBarra"] = buffer;
                    }
                    catch (Exception exception1)
                    {
                        ProjectData.SetProjectError(exception1);
                        Exception exception = exception1;

                    }
                }
                if (BuscarArchivo(DirectorioRDLC + "ImgBanner001.jpg"))
                {
                    byte[] buffer2 = File.ReadAllBytes(DirectorioRDLC + "ImgBanner001.jpg");
                    ds.Tables[str2].Rows[0]["ImgBanner001"] = buffer2;
                }
                if (BuscarArchivo(DirectorioRDLC + "ImgBanner002.jpg"))
                {
                    byte[] buffer3 = File.ReadAllBytes(DirectorioRDLC + "ImgBanner002.jpg");
                    ds.Tables[str2].Rows[0]["ImgBanner002"] = buffer3;
                }
                if (BuscarArchivo(DirectorioRDLC + "ImgBanner003.jpg"))
                {
                    byte[] buffer4 = File.ReadAllBytes(DirectorioRDLC + "ImgBanner003.jpg");
                    ds.Tables[str2].Rows[0]["ImgBanner003"] = buffer4;
                }
                flag = true;
            }
            catch (Exception exception3)
            {
                ProjectData.SetProjectError(exception3);
                Exception exception2 = exception3;
                mensaje = "DIRECTORIO RDLC [" + DirectorioRDLC.ToString() + "]. ERROR: " + exception2.Message;
                flag = false;

                return flag;

            }
            return flag;
        }
        #endregion

        #region ClearMemory
        public static void ClearMemory()
        {
            try
            {
                SetProcessWorkingSetSize(Process.GetCurrentProcess().Handle, -1, -1);
            }
            catch (Exception exception1)
            {
                ProjectData.SetProjectError(exception1);
                Exception exception = exception1;

            }
        }
        #endregion

        #region  DBNullToTexto
        public static string DBNullToTexto(object obj)
        {
            if (Information.IsDBNull(RuntimeHelpers.GetObjectValue(obj)))
            {
                return "";
            }
            if (obj == null)
            {
                return "";
            }
            return obj.ToString();
        }
        #endregion

        #region DS_DisposeClearNothing
        public static bool DS_DisposeClearNothing(ref object ds)
        {
            bool flag;
            try
            {
                try
                {
                    if ((((double)Process.GetCurrentProcess().WorkingSet64) / 1048576.0) > 150.0)
                    {
                        GC.Collect();
                        try
                        {
                            GC.WaitForPendingFinalizers();
                            ClearMemory();
                        }
                        catch (Exception exception1)
                        {
                            ProjectData.SetProjectError(exception1);
                            Exception exception = exception1;

                        }
                    }
                }
                catch (Exception exception6)
                {
                    ProjectData.SetProjectError(exception6);
                    Exception exception2 = exception6;

                }
                try
                {
                    NewLateBinding.LateCall(ds, null, "Dispose", new object[0], null, null, null, true);
                    NewLateBinding.LateCall(ds, null, "destroy", new object[0], null, null, null, true);
                }
                catch (Exception exception7)
                {
                    ProjectData.SetProjectError(exception7);
                    Exception exception3 = exception7;

                }
                try
                {
                    NewLateBinding.LateCall(ds, null, "Clear", new object[0], null, null, null, true);
                    NewLateBinding.LateCall(ds, null, "destroy", new object[0], null, null, null, true);
                }
                catch (Exception exception8)
                {
                    ProjectData.SetProjectError(exception8);
                    Exception exception4 = exception8;

                }
                ds = null;
                flag = true;
            }
            catch (Exception exception9)
            {
                ProjectData.SetProjectError(exception9);
                Exception exception5 = exception9;
                flag = false;

                return flag;

            }
            return flag;
        }
        #endregion

        #region GenerarCodBarras
        public static byte[] GenerarCodBarras(string ClaveAcceso, ref string mensaje)
        {
            byte[] buffer;
            try
            {
                byte[] buffer2;
                Linear linear = new Linear
                {
                    Type = BarcodeType.CODE128,
                    Data = ClaveAcceso,
                    X = 2f,
                    Y = 150f,
                    Format = ImageFormat.Jpeg,
                    ShowText = false,
                    LeftMargin = 0f,
                    RightMargin = 0f,
                    TopMargin = 0f,
                    BottomMargin = 0f,
                    Resolution = 0x60
                };
                linear.drawBarcode();
                Bitmap image = linear.drawBarcode();
                using (Graphics graphics = Graphics.FromImage(image))
                {
                    int width = image.Width;
                    int height = image.Height;
                    Rectangle srcRect = new Rectangle(0, 15, width, height - 0x23);
                    Rectangle destRect = new Rectangle(0, 0, srcRect.Width, srcRect.Height);
                    graphics.DrawImage(image, destRect, srcRect, GraphicsUnit.Pixel);
                    MemoryStream stream = new MemoryStream();
                    image.Save(stream, ImageFormat.Jpeg);
                    buffer2 = stream.GetBuffer();
                    try
                    {
                        image.Dispose();
                        stream.Dispose();
                    }
                    catch (Exception exception1)
                    {
                        ProjectData.SetProjectError(exception1);
                        Exception exception = exception1;

                    }
                }
                buffer = buffer2;
            }
            catch (Exception exception3)
            {
                ProjectData.SetProjectError(exception3);
                Exception exception2 = exception3;
                mensaje = exception2.Message;
                buffer = null;

                return buffer;

            }
            return buffer;
        }
        #endregion

        #region GeneraReporteReciboPdf
        public static byte[] GeneraReporteReciboPdf(string DirectorioRDLC, DataSet ds, string origen, ref string mensaje)
        {
            byte[] buffer;
            string texto = "";
            try
            {
                byte[] buffer2;
                int tipoDoc = 6;
                if (!CargarImg_BarCode_Banner(tipoDoc, ref ds, DirectorioRDLC, ref mensaje))
                {
                    return null;
                }
                texto = "F1";
                LogSeguimiento(texto);
                using (ReportViewer viewer = new ReportViewer())
                {
                    string str4;
                    string str5;
                    string str6;
                    string[] strArray;
                    Warning[] warningArray;
                    string str2 = string.Empty;
                    viewer.LocalReport.DataSources.Clear();
                    ReportDataSource item = new ReportDataSource("DsFactura", ds.Tables["Factura"]);
                    ReportDataSource source5 = new ReportDataSource("DsDetalleFactura", ds.Tables["DetalleFactura"]);
                    ReportDataSource source6 = new ReportDataSource("DsFacturaAdicionales", ds.Tables["FacturaAdicionales"]);
                    ReportDataSource source7 = new ReportDataSource("DsFacturaImpuesto", ds.Tables["FacturaImpuesto"]);
                    ReportDataSource source8 = new ReportDataSource("DsDetalleFacturaImpuesto", ds.Tables["DetalleFacturaImpuesto"]);
                    ReportDataSource source9 = new ReportDataSource("DsDetalleFacturaAdicional", ds.Tables["DetalleFacturaAdicional"]);
                    ReportDataSource source10 = new ReportDataSource("Ds_Reembolso", ds.Tables["Reembolso"]);
                    ReportDataSource source11 = new ReportDataSource("Ds_Pago", ds.Tables["Pago"]);
                    ReportDataSource source12 = new ReportDataSource("Ds_ReembolsoImpuesto", ds.Tables["ReembolsoImpuesto"]);
                    ReportDataSource source2 = new ReportDataSource("Ds_AdicionalBD", ds.Tables["DtAdicionalBD"]);
                    ReportDataSource source3 = new ReportDataSource("Ds_Compensacion", ds.Tables["Compensacion"]);
                    ReportDataSource source4 = new ReportDataSource("Ds_OtrosRubrosTerceros", ds.Tables["OtrosRubrosTerceros"]);
                    texto = "F14";
                    viewer.LocalReport.DataSources.Add(item);
                    viewer.LocalReport.DataSources.Add(source5);
                    viewer.LocalReport.DataSources.Add(source6);
                    viewer.LocalReport.DataSources.Add(source7);
                    viewer.LocalReport.DataSources.Add(source8);
                    viewer.LocalReport.DataSources.Add(source9);
                    viewer.LocalReport.DataSources.Add(source10);
                    viewer.LocalReport.DataSources.Add(source11);
                    viewer.LocalReport.DataSources.Add(source12);
                    viewer.LocalReport.DataSources.Add(source2);
                    viewer.LocalReport.DataSources.Add(source3);
                    viewer.LocalReport.DataSources.Add(source4);
                    texto = "F15";
                    viewer.RefreshReport();
                    texto = "F16";
                    LogSeguimiento(texto);
                    string str3 = retornarRDLC(DirectorioRDLC, tipoDoc, origen, ref mensaje);
                    texto = "F17-" + str3;
                    LogSeguimiento(texto);
                    viewer.LocalReport.ReportPath = str3;
                    texto = "F18-" + str3;
                    LogSeguimiento(texto);
                    viewer.LocalReport.DisplayName = str2;
                    texto = "F19-" + str3;
                    LogSeguimiento(texto);
                    buffer2 = viewer.LocalReport.Render("PDF", null, out str6, out str4, out str5, out strArray, out warningArray);
                    texto = "F20-" + str3;
                    LogSeguimiento(texto);
                    LocalReport localReport = viewer.LocalReport;
                    localReport.DataSources.Clear();
                    localReport.Dispose();
                    localReport = null;
                    texto = "F21-" + str3;
                    LogSeguimiento(texto);
                    object obj2 = viewer;
                    DS_DisposeClearNothing(ref obj2);
                    obj2 = ds;
                    DS_DisposeClearNothing(ref obj2);
                    ds = (DataSet)obj2;
                    texto = "F22-" + str3;
                    LogSeguimiento(texto);
                }
                buffer = buffer2;
            }
            catch (Exception exception1)
            {
                ProjectData.SetProjectError(exception1);
                Exception exception = exception1;
                LogSeguimiento(texto);
                string message = "";
                if (exception.InnerException != null)
                {
                    message = exception.InnerException.Message;
                }
                mensaje = "DIRECTORIO RDLC [" + DirectorioRDLC.ToString() + "]. CAMPO[" + texto + "]. ERROR: " + exception.Message.ToString() + ". InnerException: " + message;
                buffer = null;

                return buffer;

            }
            return buffer;
        }
        #endregion

        #region GeneraReporteFacturaPdf
        public static byte[] GeneraReporteFacturaPdf(string DirectorioRDLC, DataSet ds, string origen, ref string mensaje)
        {
            byte[] buffer;
            string texto = "";
            try
            {
                byte[] buffer2;
                int tipoDoc = 1;
                if (!CargarImg_BarCode_Banner(tipoDoc, ref ds, DirectorioRDLC, ref mensaje))
                {
                    return null;
                }
                texto = "F1";
                LogSeguimiento(texto);
                using (ReportViewer viewer = new ReportViewer())
                {
                    string str4;
                    string str5;
                    string str6;
                    string[] strArray;
                    Warning[] warningArray;
                    string str2 = string.Empty;
                    viewer.LocalReport.DataSources.Clear();
                    ReportDataSource item = new ReportDataSource("DsFactura", ds.Tables["Factura"]);
                    ReportDataSource source5 = new ReportDataSource("DsDetalleFactura", ds.Tables["DetalleFactura"]);
                    ReportDataSource source6 = new ReportDataSource("DsFacturaAdicionales", ds.Tables["FacturaAdicionales"]);
                    ReportDataSource source7 = new ReportDataSource("DsFacturaImpuesto", ds.Tables["FacturaImpuesto"]);
                    ReportDataSource source8 = new ReportDataSource("DsDetalleFacturaImpuesto", ds.Tables["DetalleFacturaImpuesto"]);
                    ReportDataSource source9 = new ReportDataSource("DsDetalleFacturaAdicional", ds.Tables["DetalleFacturaAdicional"]);
                    ReportDataSource source10 = new ReportDataSource("Ds_Reembolso", ds.Tables["Reembolso"]);
                    ReportDataSource source11 = new ReportDataSource("Ds_Pago", ds.Tables["Pago"]);
                    ReportDataSource source12 = new ReportDataSource("Ds_ReembolsoImpuesto", ds.Tables["ReembolsoImpuesto"]);
                    ReportDataSource source2 = new ReportDataSource("Ds_AdicionalBD", ds.Tables["DtAdicionalBD"]);
                    ReportDataSource source3 = new ReportDataSource("Ds_Compensacion", ds.Tables["Compensacion"]);
                    ReportDataSource source4 = new ReportDataSource("Ds_OtrosRubrosTerceros", ds.Tables["OtrosRubrosTerceros"]);
                    texto = "F14";
                    viewer.LocalReport.DataSources.Add(item);
                    viewer.LocalReport.DataSources.Add(source5);
                    viewer.LocalReport.DataSources.Add(source6);
                    viewer.LocalReport.DataSources.Add(source7);
                    viewer.LocalReport.DataSources.Add(source8);
                    viewer.LocalReport.DataSources.Add(source9);
                    viewer.LocalReport.DataSources.Add(source10);
                    viewer.LocalReport.DataSources.Add(source11);
                    viewer.LocalReport.DataSources.Add(source12);
                    viewer.LocalReport.DataSources.Add(source2);
                    viewer.LocalReport.DataSources.Add(source3);
                    viewer.LocalReport.DataSources.Add(source4);
                    texto = "F15";
                    viewer.RefreshReport();
                    texto = "F16";
                    LogSeguimiento(texto);
                    string str3 = retornarRDLC(DirectorioRDLC, tipoDoc, origen, ref mensaje);
                    texto = "F17-" + str3;
                    LogSeguimiento(texto);
                    viewer.LocalReport.ReportPath = str3;
                    texto = "F18-" + str3;
                    LogSeguimiento(texto);
                    viewer.LocalReport.DisplayName = str2;
                    texto = "F19-" + str3;
                    LogSeguimiento(texto);
                    buffer2 = viewer.LocalReport.Render("PDF", null, out str6, out str4, out str5, out strArray, out warningArray);
                    texto = "F20-" + str3;
                    LogSeguimiento(texto);
                    LocalReport localReport = viewer.LocalReport;
                    localReport.DataSources.Clear();
                    localReport.Dispose();
                    localReport = null;
                    texto = "F21-" + str3;
                    LogSeguimiento(texto);
                    object obj2 = viewer;
                    DS_DisposeClearNothing(ref obj2);
                    obj2 = ds;
                    DS_DisposeClearNothing(ref obj2);
                    ds = (DataSet)obj2;
                    texto = "F22-" + str3;
                    LogSeguimiento(texto);
                }
                buffer = buffer2;
            }
            catch (Exception exception1)
            {
                ProjectData.SetProjectError(exception1);
                Exception exception = exception1;
                LogSeguimiento(texto);
                string message = "";
                if (exception.InnerException != null)
                {
                    message = exception.InnerException.Message;
                }
                mensaje = "DIRECTORIO RDLC [" + DirectorioRDLC.ToString() + "]. CAMPO[" + texto + "]. ERROR: " + exception.Message.ToString() + ". InnerException: " + message;
                buffer = null;

                return buffer;

            }
            return buffer;
        }
        #endregion

        #region GeneraReporteGuiaRemisionPdf
        public static byte[] GeneraReporteGuiaRemisionPdf(string DirectorioRDLC, DataSet ds, string origen, ref string mensaje)
        {
            byte[] buffer;
            string str = "";
            try
            {
                byte[] buffer2;
                int tipoDoc = 5;
                if (!CargarImg_BarCode_Banner(tipoDoc, ref ds, DirectorioRDLC, ref mensaje))
                {
                    return null;
                }
                str = "GR1";
                using (ReportViewer viewer = new ReportViewer())
                {
                    string str4;
                    string str5;
                    string str6;
                    string[] strArray;
                    Warning[] warningArray;
                    string str2 = string.Empty;
                    str = "GR2";
                    ReportDataSource item = new ReportDataSource("dsGuiaRemision", ds.Tables["GuiaRemision"]);
                    str = "GR3";
                    ReportDataSource source3 = new ReportDataSource("GRAgrupado", ds.Tables["GRAgrupado"]);
                    str = "GR4";
                    ReportDataSource source4 = new ReportDataSource("DatoAdicionalGuiaRemision", ds.Tables["DatoAdicionalGuiaRemision"]);
                    str = "GR4.1";
                    ReportDataSource source5 = new ReportDataSource("DsDestinatario", ds.Tables["GuiaRemisionDestinatario"]);
                    str = "GR4.2";
                    ReportDataSource source6 = new ReportDataSource("DsDetalle", ds.Tables["GuiaRemisionDetalle"]);
                    str = "GR4.3";
                    ReportDataSource source7 = new ReportDataSource("DsDetalleDatoAdicional", ds.Tables["DatoAdicionalGuiaRemisionDetalle"]);
                    str = "GR7.AdBD";
                    ReportDataSource source2 = new ReportDataSource("Ds_AdicionalBD", ds.Tables["DtAdicionalBD"]);
                    str = "GR5";
                    viewer.LocalReport.DataSources.Clear();
                    str = "GR6";
                    viewer.LocalReport.DataSources.Add(item);
                    str = "GR7";
                    viewer.LocalReport.DataSources.Add(source3);
                    str = "GR8";
                    viewer.LocalReport.DataSources.Add(source4);
                    str = "GR8.1";
                    viewer.LocalReport.DataSources.Add(source5);
                    str = "GR8.1";
                    viewer.LocalReport.DataSources.Add(source6);
                    str = "GR8.1";
                    viewer.LocalReport.DataSources.Add(source7);
                    str = "GR8.3";
                    viewer.LocalReport.DataSources.Add(source2);
                    str = "GR9";
                    viewer.RefreshReport();
                    str = "GR10";
                    string str3 = retornarRDLC(DirectorioRDLC, tipoDoc, origen, ref mensaje);
                    str = "GR11-" + str3;
                    viewer.LocalReport.ReportPath = str3;
                    str = "GR12-" + str3;
                    viewer.LocalReport.DisplayName = str2;
                    str = "GR13-" + str3;
                    buffer2 = viewer.LocalReport.Render("PDF", null, out str6, out str4, out str5, out strArray, out warningArray);
                    str = "GR14-" + str3;
                    viewer.LocalReport.DataSources.Clear();
                    str = "GR15-" + str3;
                    object obj2 = viewer;
                    DS_DisposeClearNothing(ref obj2);
                    obj2 = ds;
                    DS_DisposeClearNothing(ref obj2);
                    ds = (DataSet)obj2;
                    str = "GR16-" + str3;
                }
                buffer = buffer2;
            }
            catch (Exception exception1)
            {
                ProjectData.SetProjectError(exception1);
                Exception exception = exception1;
                string message = "";
                if (exception.InnerException != null)
                {
                    message = exception.InnerException.Message;
                }
                mensaje = "DIRECTORIO RDLC [" + DirectorioRDLC.ToString() + "]. CAMPO[" + str + "]. ERROR: " + exception.Message.ToString() + ". InnerException: " + message;
                buffer = null;

                return buffer;

            }
            return buffer;
        }
        #endregion

        #region  GeneraReporteNotaCreditoPdf
        public static byte[] GeneraReporteNotaCreditoPdf(string DirectorioRDLC, DataSet ds, string origen, ref string mensaje)
        {
            byte[] buffer;
            string str = "";
            try
            {
                byte[] buffer2;
                int tipoDoc = 3;
                if (!CargarImg_BarCode_Banner(tipoDoc, ref ds, DirectorioRDLC, ref mensaje))
                {
                    return null;
                }
                str = "NC1";
                using (ReportViewer viewer = new ReportViewer())
                {
                    string str4;
                    string str5;
                    string str6;
                    string[] strArray;
                    Warning[] warningArray;
                    string str2 = string.Empty;
                    str = "NC2";
                    ReportDataSource item = new ReportDataSource("DsNotaCredito", ds.Tables["NotaCredito"]);
                    str = "NC3";
                    ReportDataSource source4 = new ReportDataSource("DsNotaCreditoDetalle", ds.Tables["NotaCreditoDetalle"]);
                    str = "NC4";
                    ReportDataSource source5 = new ReportDataSource("DsNotaCreditoAdicional", ds.Tables["NotaCreditoAdicional"]);
                    str = "NC5";
                    ReportDataSource source6 = new ReportDataSource("DsNotaCreditoDetalleImp", ds.Tables["NotaCreditoDetalleImp"]);
                    str = "NC6";
                    ReportDataSource source7 = new ReportDataSource("DsNotaCreditoImp", ds.Tables["NotaCreditoImp"]);
                    str = "NC7";
                    ReportDataSource source8 = new ReportDataSource("DsNotaCreditoDetAdicional", ds.Tables["NotaCreditoDetAdicional"]);
                    str = "NC7.AdBD";
                    ReportDataSource source2 = new ReportDataSource("Ds_AdicionalBD", ds.Tables["DtAdicionalBD"]);
                    str = "NC8";
                    viewer.LocalReport.DataSources.Clear();
                    ReportDataSource source3 = new ReportDataSource("Ds_Compensacion", ds.Tables["Compensacion"]);
                    viewer.LocalReport.DataSources.Add(source3);
                    str = "NC9";
                    viewer.LocalReport.DataSources.Add(item);
                    str = "NC10";
                    viewer.LocalReport.DataSources.Add(source4);
                    str = "NC11";
                    viewer.LocalReport.DataSources.Add(source5);
                    str = "NC12";
                    viewer.LocalReport.DataSources.Add(source6);
                    str = "NC13";
                    viewer.LocalReport.DataSources.Add(source7);
                    str = "NC14";
                    viewer.LocalReport.DataSources.Add(source8);
                    str = "NC14.1";
                    viewer.LocalReport.DataSources.Add(source2);
                    str = "NC15";
                    viewer.RefreshReport();
                    str = "NC16";
                    string str3 = retornarRDLC(DirectorioRDLC, tipoDoc, origen, ref mensaje);
                    str = "NC17-" + str3;
                    viewer.LocalReport.ReportPath = str3;
                    str = "NC18-" + str3;
                    viewer.LocalReport.DisplayName = str2;
                    str = "NC19-" + str3;
                    buffer2 = viewer.LocalReport.Render("PDF", null, out str6, out str4, out str5, out strArray, out warningArray);
                    str = "NC20-" + str3;
                    viewer.LocalReport.DataSources.Clear();
                    str = "NC21-" + str3;
                    object obj2 = viewer;
                    DS_DisposeClearNothing(ref obj2);
                    obj2 = ds;
                    DS_DisposeClearNothing(ref obj2);
                    ds = (DataSet)obj2;
                    str = "NC22-" + str3;
                }
                buffer = buffer2;
            }
            catch (Exception exception1)
            {
                ProjectData.SetProjectError(exception1);
                Exception exception = exception1;
                string message = "";
                if (exception.InnerException != null)
                {
                    message = exception.InnerException.Message;
                }
                mensaje = "DIRECTORIO RDLC [" + DirectorioRDLC.ToString() + "]. CAMPO[" + str + "]. ERROR: " + exception.Message.ToString() + ". InnerException: " + message;
                buffer = null;

                return buffer;

            }
            return buffer;
        }
        #endregion

        #region GeneraReporteNotaDebitoPdf
        public static byte[] GeneraReporteNotaDebitoPdf(string DirectorioRDLC, DataSet ds, string origen, ref string mensaje)
        {
            byte[] buffer;
            string str = "";
            try
            {
                byte[] buffer2;
                int tipoDoc = 4;
                if (!CargarImg_BarCode_Banner(tipoDoc, ref ds, DirectorioRDLC, ref mensaje))
                {
                    return null;
                }
                str = "ND1";
                using (ReportViewer viewer = new ReportViewer())
                {
                    string str4;
                    string str5;
                    string str6;
                    string[] strArray;
                    Warning[] warningArray;
                    string str2 = string.Empty;
                    str = "ND2";
                    ReportDataSource item = new ReportDataSource("DsNotaDebito", ds.Tables["NotaDebito"]);
                    str = "ND3";
                    ReportDataSource source3 = new ReportDataSource("DsNotaDebitoMotivo", ds.Tables["NotaDebitoMotivo"]);
                    str = "ND4";
                    ReportDataSource source4 = new ReportDataSource("DsNotaDebitoAdicional", ds.Tables["NotaDebitoAdicional"]);
                    str = "ND5";
                    ReportDataSource source5 = new ReportDataSource("DsDetalleImpNotaDebito", ds.Tables["DetalleImpNotaDebito"]);
                    str = "ND.AdBD";
                    ReportDataSource source2 = new ReportDataSource("Ds_AdicionalBD", ds.Tables["DtAdicionalBD"]);
                    str = "ND6";
                    viewer.LocalReport.DataSources.Clear();
                    str = "ND7";
                    ReportDataSource source6 = new ReportDataSource("Ds_Pago", ds.Tables["Pago"]);
                    ReportDataSource source7 = new ReportDataSource("Ds_Compensacion", ds.Tables["Compensacion"]);
                    viewer.LocalReport.DataSources.Add(source6);
                    viewer.LocalReport.DataSources.Add(source7);
                    viewer.LocalReport.DataSources.Add(item);
                    str = "ND8";
                    viewer.LocalReport.DataSources.Add(source3);
                    str = "ND9";
                    viewer.LocalReport.DataSources.Add(source4);
                    str = "ND10";
                    viewer.LocalReport.DataSources.Add(source5);
                    str = "ND10.1";
                    viewer.LocalReport.DataSources.Add(source2);
                    str = "ND11";
                    viewer.RefreshReport();
                    str = "ND12";
                    string str3 = retornarRDLC(DirectorioRDLC, tipoDoc, origen, ref mensaje);
                    str = "NC13-" + str3;
                    viewer.LocalReport.ReportPath = str3;
                    str = "NC14-" + str3;
                    viewer.LocalReport.DisplayName = str2;
                    str = "NC15-" + str3;
                    buffer2 = viewer.LocalReport.Render("PDF", null, out str6, out str4, out str5, out strArray, out warningArray);
                    str = "NC16-" + str3;
                    viewer.LocalReport.DataSources.Clear();
                    str = "NC17-" + str3;
                    object obj2 = viewer;
                    DS_DisposeClearNothing(ref obj2);
                    obj2 = ds;
                    DS_DisposeClearNothing(ref obj2);
                    ds = (DataSet)obj2;
                    str = "NC18-" + str3;
                }
                buffer = buffer2;
            }
            catch (Exception exception1)
            {
                ProjectData.SetProjectError(exception1);
                Exception exception = exception1;
                string message = "";
                if (exception.InnerException != null)
                {
                    message = exception.InnerException.Message;
                }
                mensaje = "DIRECTORIO RDLC [" + DirectorioRDLC.ToString() + "]. CAMPO[" + str + "]. ERROR: " + exception.Message.ToString() + ". InnerException: " + message;
                buffer = null;

                return buffer;

            }
            return buffer;
        }
        #endregion

        #region GeneraReporteRetencionPdf
        public static byte[] GeneraReporteRetencionPdf(string DirectorioRDLC, DataSet ds, string origen, ref string mensaje)
        {
            byte[] buffer;
            string str = "";
            try
            {
                byte[] buffer2;
                int tipoDoc = 2;
                if (!CargarImg_BarCode_Banner(tipoDoc, ref ds, DirectorioRDLC, ref mensaje))
                {
                    return null;
                }
                str = "R1";
                using (ReportViewer viewer = new ReportViewer())
                {
                    string str4;
                    string str5;
                    string str6;
                    string[] strArray;
                    Warning[] warningArray;
                    string str2 = string.Empty;
                    str = "R2";
                    ReportDataSource item = new ReportDataSource("DsRetencion", ds.Tables["Retencion"]);
                    str = "R3";
                    ReportDataSource source3 = new ReportDataSource("DsDetalleRetencion", ds.Tables["DetalleRetencion"]);
                    str = "R4";
                    ReportDataSource source4 = new ReportDataSource("DsRetencionAdicional", ds.Tables["RetencionAdicional"]);
                    str = "R7.AdBD";
                    ReportDataSource source2 = new ReportDataSource("Ds_AdicionalBD", ds.Tables["DtAdicionalBD"]);
                    str = "R5";
                    viewer.LocalReport.DataSources.Clear();
                    str = "R6";
                    viewer.LocalReport.DataSources.Add(item);
                    str = "R7";
                    viewer.LocalReport.DataSources.Add(source3);
                    str = "R8";
                    viewer.LocalReport.DataSources.Add(source4);
                    str = "R8.1";
                    viewer.LocalReport.DataSources.Add(source2);
                    str = "R9";
                    viewer.RefreshReport();
                    str = "R10";
                    string str3 = retornarRDLC(DirectorioRDLC, tipoDoc, origen, ref mensaje);
                    str = "R11-" + str3;
                    viewer.LocalReport.ReportPath = str3;
                    str = "R12-" + str3;
                    viewer.LocalReport.DisplayName = str2;
                    str = "R13-" + str3;
                    buffer2 = viewer.LocalReport.Render("PDF", null, out str6, out str4, out str5, out strArray, out warningArray);
                    str = "R14-" + str3;
                    viewer.LocalReport.DataSources.Clear();
                    str = "R15-" + str3;
                    object obj2 = viewer;
                    DS_DisposeClearNothing(ref obj2);
                    obj2 = ds;
                    DS_DisposeClearNothing(ref obj2);
                    ds = (DataSet)obj2;
                    str = "R16-" + str3;
                }
                buffer = buffer2;
            }
            catch (Exception exception1)
            {
                ProjectData.SetProjectError(exception1);
                Exception exception = exception1;
                string message = "";
                if (exception.InnerException != null)
                {
                    message = exception.InnerException.Message;
                }
                mensaje = "DIRECTORIO RDLC [" + DirectorioRDLC.ToString() + "]. CAMPO[" + str + "]. ERROR: " + exception.Message.ToString() + ". InnerException: " + message;
                buffer = null;

                return buffer;

            }
            return buffer;
        }
        #endregion

        #region GeneraRideXCodDocSRI
        public byte[] GeneraRideXCodDocSRI(string CodDocSRI, string DirectorioRDLC, DataSet ds, string origen, ref string mensaje)
        {
            byte[] buffer = null;
            mensaje = "";
            if (DirectorioRDLC == null)
            {
                DirectorioRDLC = "";
            }
            switch (CodDocSRI)
            {
                case "01":
                    return GeneraReporteFacturaPdf(DirectorioRDLC, ds, origen, ref mensaje);

                case "07":
                    return GeneraReporteRetencionPdf(DirectorioRDLC, ds, origen, ref mensaje);

                case "04":
                    return GeneraReporteNotaCreditoPdf(DirectorioRDLC, ds, origen, ref mensaje);

                case "05":
                    return GeneraReporteNotaDebitoPdf(DirectorioRDLC, ds, origen, ref mensaje);

                case "06":
                    buffer = GeneraReporteGuiaRemisionPdf(DirectorioRDLC, ds, origen, ref mensaje);
                    break;
            }
            return buffer;
        }
        #endregion

        #region LogSeguimiento        
        public static object LogSeguimiento(string texto)
        {
            object obj2 = null;
            return obj2;
        }
        #endregion

        #region  retornarRDLC
        public static string retornarRDLC(string DirectorioRDLC, int tipoDoc, string origen, ref string mensaje)
        {
            string str;
            try
            {
                string str2 = DirectorioRDLC;
                if (origen == "SRI")
                {
                    switch (tipoDoc)
                    {
                        case 1:
                            return (str2 + "RptFacturaSRI.rdlc");

                        case 2:
                            return (str2 + "RptRetencionSRI.rdlc");

                        case 3:
                            return (str2 + "RptNotaCreditoSRI.rdlc");

                        case 4:
                            return (str2 + "RptNotaDebitoSRI.rdlc");

                        case 5:
                            return (str2 + "RptGuiaRemisionSRI.rdlc");
                    }
                }
                else if (origen == "GS")
                {
                    switch (tipoDoc)
                    {
                        case 1:
                            return (str2 + "RptFacturaND.rdlc");

                        case 2:
                            return (str2 + "RptRetencionND.rdlc");

                        case 3:
                            return (str2 + "RptNotaCreditoND.rdlc");

                        case 4:
                            return (str2 + "RptNotaDebitoND.rdlc");

                        case 5:
                            return (str2 + "RptGuiaRemisionND.rdlc");
                        case 6:
                            return (str2 + "RptRecibo.rdlc");
                    }
                }
                else if (origen == "REC")
                {
                    switch (tipoDoc)
                    {
                        case 1:
                            return (str2 + "RptFacturaREC.rdlc");

                        case 2:
                            return (str2 + "RptRetencionREC.rdlc");

                        case 3:
                            return (str2 + "RptNotaCreditoREC.rdlc");

                        case 4:
                            return (str2 + "RptNotaDebitoREC.rdlc");

                        case 5:
                            return (str2 + "RptGuiaRemisionREC.rdlc");
                    }
                }
                else
                {
                    switch (tipoDoc)
                    {
                        case 1:
                            return (str2 + "RptFactura" + origen + ".rdlc");

                        case 2:
                            return (str2 + "RptRetencion" + origen + ".rdlc");

                        case 3:
                            return (str2 + "RptNotaCredito" + origen + ".rdlc");

                        case 4:
                            return (str2 + "RptNotaDebito" + origen + ".rdlc");

                        case 5:
                            return (str2 + "RptGuiaRemision" + origen + ".rdlc");
                    }
                }
                str = null;
            }
            catch (Exception exception1)
            {
                ProjectData.SetProjectError(exception1);
                Exception exception = exception1;
                mensaje = exception.Message.ToString();
                str = null;

                return str;

            }
            return str;
        }
        #endregion

        #region SetProcessWorkingSetSize
        [DllImport("kernel32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        private static extern bool SetProcessWorkingSetSize(IntPtr procHandle, int min, int max);
        #endregion

        #region RutaLog
        public static string RutaLog
        {
            get
            {
                return _rutaLog;
            }
            set
            {
                if (_rutaLog != value)
                {
                    _rutaLog = value;
                }
            }
        }
        #endregion
    }
}
