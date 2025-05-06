using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using System.Data.Sql;
using System.Data.SqlClient;
using ClosedXML.Excel;
using System.Globalization;
using System.ComponentModel;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Conexion.Entidad.Administracion;
using Conexion.Entidad.Negocio;
using Microsoft.Extensions.Configuration;
using System.Net.Mail;
using System.Net;

namespace Conexion.AccesoDatos.Repository.CArchivo
{
  
    public class EntRespuesta
    {
        // Codigo del estado de la respuesta
        // 0 - Error, 1 - Exito
        public string estado { get; set; }
        // Contendra el resultado de la consulta, puede ser: arreglo para grid.
        public dynamic resultado { get; set; }
        // Mensaje que se muestra al usaurio, puede ser de exito o error dependiendo del estado
        public string mensaje { get; set; }
        // Tipo de mensaje que permitira indicar si el mensaje a mostrarse es confirmación, warning, alerta, informativo
        // valores permitidos: success, info, warning, danger 
        public string tipoMensaje { get; set; }
        // Determina el codigo de error en caso de producirse y existir para evitar mostrar mensajes de error técnicos
        public string codigoError { get; set; }
        // Contendra el resultado de la consulta cuando retorna un datatable.
        public DataTable resultadoTabla { get; set; }

        public DataSet resultadoSet { get; set; }
    }
    public class CargarXLSX
    {
        private readonly string _connectionString;
        public CargarXLSX(string configuration)
        {
            _connectionString = configuration;
        }

        #region conectar
        public SqlConnection conectar()
        {
            SqlConnection cn = new SqlConnection();
            //cn.ConnectionString = "Data Source=GUILLERMO; Initial Catalog=SistemaConexion; User Id=sa; Password=Sql$erver2014";
            cn.ConnectionString = _connectionString;// "Data Source=conexiondb2022.database.windows.net; Initial Catalog=CONEXIONDB; User Id=Administrator2022; Password=U$uar10conexion";
            return cn;

        }
        #endregion

        #region GenerarlRolDePagos

        #endregion

        #region RetornarConfigSMTP
        public DataTable RetornarConfigSMTP(ref string mensaje)
        {
            DataTable dtResultados = new DataTable();
            SqlCommand cmd = null;
            SqlDataReader dr = null;
            try
            {
                SqlConnection cnx = conectar();
                cnx.Open();
                cmd = new SqlCommand("mostrarempresas", cnx);
                cmd.Parameters.AddWithValue("@RUC", "");
                cmd.Parameters.AddWithValue("@Tipo", "");
                cmd.CommandType = CommandType.StoredProcedure;
                dr = cmd.ExecuteReader();
                dtResultados.Load(dr);
            }
            catch (Exception ex)
            {
                mensaje = ex.Message.ToString();
            }
            finally
            {
                cmd.Connection.Close();
            }
            return dtResultados;
        }
        #endregion

        #region NotificacionOportunidad
        public DataTable NotificacionOportunidad(Int64 IdForeCast,int tipo, ref string mensaje)
        {
            DataTable dtResultados = new DataTable();
            SqlCommand cmd = null;
            SqlDataReader dr = null;
            try
            {
                SqlConnection cnx = conectar();
                cnx.Open();
                cmd = new SqlCommand("NotificacionOportunidad", cnx);
                cmd.Parameters.AddWithValue("@IdForeCast", IdForeCast);
                cmd.Parameters.AddWithValue("@Tipo", tipo);
                cmd.CommandType = CommandType.StoredProcedure;
                dr = cmd.ExecuteReader();
                dtResultados.Load(dr);
            }
            catch (Exception ex)
            {
                mensaje = ex.Message.ToString();
            }
            finally
            {
                cmd.Connection.Close();
            }
            return dtResultados;
        }
        #endregion


        #region MostrarCargaArhivoConfig
        public PrmConfiguracionArchivo MostrarCargaArhivoConfig(Int64 IdContrato,Int64 IdForeCast,string TipoDocumento)
        {
            PrmConfiguracionArchivo cargarArchivos = null;
            SqlCommand cmd = null;
            SqlDataReader dr = null;
            try
            {
                SqlConnection cnx = conectar();
                cnx.Open();
                cmd = new SqlCommand("MostrarCargaArhivoConfig", cnx);
                cmd.Parameters.AddWithValue("@IdContrato", IdContrato);
                cmd.Parameters.AddWithValue("@IdForeCast", IdForeCast);
                cmd.Parameters.AddWithValue("@TipoDocumento", TipoDocumento);
                cmd.CommandType = CommandType.StoredProcedure;
                dr = cmd.ExecuteReader();
                cargarArchivos = new PrmConfiguracionArchivo();
                while (dr.Read())
                {
                    cargarArchivos.RutaArchivo = dr["RutaArchivo"].ToString();
                    cargarArchivos.NombreArchivo = dr["NombreArchivo"].ToString();
                    cargarArchivos.Extencion = dr["Extencion"].ToString();
                    cargarArchivos.NombreArchivoSalida = dr["NombreArchivoSalida"].ToString();
                }
            }
            catch (Exception)
            {
                cargarArchivos = null;
            }
            finally
            {
                cmd.Connection.Close();
            }
            return cargarArchivos;
        }
        #endregion

        #region EnviarCorreo
        public bool EnviarCorreo(string correosDestinatarios, string correoTitulo, string correoContenido, EntParametrosCorreo parametrosServidorCorreo)
        {
            bool Temp = false;
            string ErrorProceso = "";

            string smtpAddress = parametrosServidorCorreo.smtpAddress;
            string emailFrom = parametrosServidorCorreo.emailFrom;
            string password = parametrosServidorCorreo.password;
            string subject = correoTitulo;
            string body = correoContenido;
            int portNumber = parametrosServidorCorreo.portNumber;
            bool enableSSL = parametrosServidorCorreo.enableSSL;
            string emailFromName = parametrosServidorCorreo.emailFromName;

            using (MailMessage mail = new MailMessage())
            {
                mail.From = new MailAddress(emailFrom, emailFromName);

                foreach (string correoIndividual in correosDestinatarios.Split(new Char[] { ';' }))
                {
                    if (correoIndividual != "")
                    {
                        mail.To.Add(correoIndividual);
                    }
                }
                mail.Subject = subject;
                mail.Body = body;
                mail.IsBodyHtml = true;
                using (SmtpClient smtp = new SmtpClient(smtpAddress, portNumber))
                {
                    try
                    {
                        smtp.Credentials = new NetworkCredential(emailFrom, password);
                        smtp.EnableSsl = enableSSL;
                        smtp.Send(mail);
                        Temp = true;
                    }
                    catch (Exception ex)
                    {
                        Temp = false;
                        ErrorProceso = ex.Message.ToString().Trim();
                    }
                }
            }


            return Temp;
        }
        #endregion


    }
}
