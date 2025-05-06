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

namespace WinSerCargarArchivo.Clase
{
    public class DetalleContratoExcel
    {
        public string Canal { get; set; }
        public string Programa { get; set; }
        public string Derecho { get; set; }
        public string Duracion { get; set; }
        public string Franja { get; set; }
        public string Tarifa { get; set; }
        public string TotalSegundo { get; set; }
        public string ValorNegocio { get; set; }

        public string data_1 { get; set; }
        public string data_2 { get; set; }
        public string data_3 { get; set; }
        public string data_4 { get; set; }
        public string data_5 { get; set; }
        public string data_6 { get; set; }
        public string data_7 { get; set; }
        public string data_8 { get; set; }
        public string data_9 { get; set; }
        public string data_10 { get; set; }
        public string data_11 { get; set; }
        public string data_12 { get; set; }
        public string data_13 { get; set; }
        public string data_14 { get; set; }
        public string data_15 { get; set; }
        public string data_16 { get; set; }
        public string data_17 { get; set; }
        public string data_18 { get; set; }
        public string data_19 { get; set; }
        public string data_20 { get; set; }
        public string data_21 { get; set; }
        public string data_22 { get; set; }
        public string data_23 { get; set; }
        public string data_24 { get; set; }
        public string data_25 { get; set; }
        public string data_26 { get; set; }
        public string data_27 { get; set; }
        public string data_28 { get; set; }
        public string data_29 { get; set; }
        public string data_30 { get; set; }
        public string data_31 { get; set; }
        public string Impacto { get; set; }
    }
    public class CargarArchivo
    {
        public Int64 IdCargarArchivo { get; set; }
        public Int64 IdContrato { get; set; }
        public string nombre { get; set; }
        public string nombreArchivo { get; set; }
        public string base64textString { get; set; }
        public string RutaArchivo { get; set; }
        public int Estado { get; set; }
        public int Tipo { get; set; }
    }
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
    }
    public class CargarXLSX
    {
        #region conectar
        public SqlConnection conectar()
        {
            SqlConnection cn = new SqlConnection();
            cn.ConnectionString = "Data Source=GUILLERMO; Initial Catalog=SistemaConexion; User Id=sa; Password=Sql$erver2014";
            return cn;

        }
        #endregion

        #region SubirArchivo
        public DataTable SubirArchivo(string RutaDocumento)
        {
            //Create a new DataTable.
            DataTable dt = new DataTable();
            List<DetalleContratoExcel> ll = new List<DetalleContratoExcel>();
            //Open the Excel file using ClosedXML.

            List<CargarArchivo> cargarArchivos = new List<CargarArchivo>();
            cargarArchivos = MostrarCargaArhivo(0);
            foreach (CargarArchivo data in cargarArchivos)
            {
                using (XLWorkbook workBook = new XLWorkbook(data.RutaArchivo))
                {
                    //Read the first Sheet from Excel file.
                    IXLWorksheet workSheet = workBook.Worksheet(1);

                    var rowCount = workBook.Worksheet(1).LastRowUsed().RowNumber();
                    var columnCount = workBook.Worksheet(1).LastColumnUsed().ColumnNumber();
                    rowCount = rowCount - 8;
                    int column = 2;
                    int row = 16;


                    while (row <= rowCount)
                    {
                        List<string> llString = new List<string>();
                        while (column <= columnCount)
                        {
                            string title = workBook.Worksheets.Worksheet(1).Cell(row, column).GetString();
                            llString.Add(title);
                            column++;
                        }

                        row++;
                        column = 2;
                        if (llString[0] != "")
                        {
                            #region LLenarDatos
                            DetalleContratoExcel detalle = new DetalleContratoExcel();
                            detalle.Canal = llString[0];
                            detalle.Programa = llString[1];
                            detalle.Derecho = llString[2];
                            detalle.Duracion = llString[3];
                            detalle.Franja = llString[4];
                            detalle.Tarifa = llString[5];
                            detalle.TotalSegundo = llString[6];
                            detalle.ValorNegocio = llString[7];

                            detalle.data_1 = llString[8];
                            detalle.data_2 = llString[9];
                            detalle.data_3 = llString[10];
                            detalle.data_4 = llString[11];
                            detalle.data_5 = llString[12];
                            detalle.data_6 = llString[13];
                            detalle.data_7 = llString[14];
                            detalle.data_8 = llString[15];
                            detalle.data_9 = llString[16];
                            detalle.data_10 = llString[17];

                            detalle.data_11 = llString[18];
                            detalle.data_12 = llString[19];
                            detalle.data_13 = llString[20];
                            detalle.data_14 = llString[21];
                            detalle.data_15 = llString[22];
                            detalle.data_16 = llString[23];
                            detalle.data_17 = llString[24];
                            detalle.data_18 = llString[25];
                            detalle.data_19 = llString[26];
                            detalle.data_20 = llString[27];

                            detalle.data_21 = llString[28];
                            detalle.data_22 = llString[29];
                            detalle.data_23 = llString[30];
                            detalle.data_24 = llString[31];
                            detalle.data_25 = llString[32];
                            detalle.data_26 = llString[33];
                            detalle.data_27 = llString[34];
                            detalle.data_28 = llString[35];
                            detalle.data_29 = llString[36];
                            detalle.data_30 = llString[37];
                            detalle.data_31 = llString[38];
                            detalle.Impacto = llString[39];
                            ll.Add(detalle);
                            #endregion
                        }
                    }

                }
                var json = JsonConvert.SerializeObject(ll);
                dt = (DataTable)JsonConvert.DeserializeObject(json, (typeof(DataTable)));

                EntRespuesta entRespuesta = new EntRespuesta();
                entRespuesta = ActualizarDetalleContrato(1, data.IdContrato, dt, 1);
            }
            return dt;
        }
        #endregion

        #region ActualizarDetalleContrato
        public EntRespuesta ActualizarDetalleContrato(Int64 IdForeCast, Int64 IdContrato, DataTable detalleContrato, int Tipo)
        {
            EntRespuesta Respuesta = new EntRespuesta();
            DataTable dtResultados = new DataTable();
            SqlCommand cmd = null;
            SqlDataReader dr = null;
            try
            {

                SqlConnection cnx = conectar();
                cnx.Open();
                cmd = new SqlCommand("InsertarModificarEliminarDetalleContrato", cnx);
                cmd.Parameters.AddWithValue("@IdForeCast", IdForeCast);
                cmd.Parameters.AddWithValue("@IdContrato", IdContrato);
                cmd.Parameters.AddWithValue("@SLQDetalleContrato", detalleContrato);
                cmd.Parameters.AddWithValue("@Tipo", Tipo);
                cmd.CommandType = CommandType.StoredProcedure;
                dr = cmd.ExecuteReader();
                dtResultados.Load(dr);
                Respuesta.estado = "1";
                if (dtResultados.Rows.Count > 0)
                {
                    Respuesta.mensaje = dtResultados.Rows[0][0].ToString();
                }
            }
            catch (Exception ex)
            {
                Respuesta.estado = "0";
                Respuesta.mensaje = ex.Message.ToString();
                Respuesta.tipoMensaje = "danger";
            }
            finally
            {
                cmd.Connection.Close();
            }
            return Respuesta;
        }
        #endregion

        #region MostrarCargaArhivo
        public List<CargarArchivo> MostrarCargaArhivo(int Tipo)
        {
            List<CargarArchivo> cargarArchivos = null;
            SqlCommand cmd = null;
            SqlDataReader dr = null;
            try
            {
                SqlConnection cnx = conectar();
                cnx.Open();
                cmd = new SqlCommand("MostrarCargaArhivo", cnx);
                cmd.Parameters.AddWithValue("@Tipo", Tipo);
                cmd.CommandType = CommandType.StoredProcedure;
                dr = cmd.ExecuteReader();
                cargarArchivos = new List<CargarArchivo>();
                while (dr.Read())
                {
                    CargarArchivo carga = new CargarArchivo();
                    carga.IdContrato = Convert.ToInt64(dr["IdContrato"].ToString());
                    carga.RutaArchivo = dr["RutaArchivo"].ToString();
                    cargarArchivos.Add(carga);
                }
            }
            catch (Exception ex)
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

    }
}
