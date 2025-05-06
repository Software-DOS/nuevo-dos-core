using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Conexion.Entidad.Administracion
{
    public class CargarArchivo
    {
        public Int64 IdCargarArchivo { get; set; }
        public Int64 IdContrato { get; set; }
        public Int64 IdForeCast { get; set; }
        public string nombre { get; set; }
        public string nombreArchivo { get; set; }
        public string base64textString { get; set; }
        public string RutaArchivo { get; set; }
        public int Estado { get; set; }
        public int Tipo { get; set; }
    }
}
