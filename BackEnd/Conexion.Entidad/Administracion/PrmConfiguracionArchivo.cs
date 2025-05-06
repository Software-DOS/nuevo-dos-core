using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Conexion.Entidad.Administracion
{
    public class PrmConfiguracionArchivo
    {
        public Int64 IdContrato { get; set; }
        public Int64 IdForeCast { get; set; }
        public string RutaArchivo { get; set; }
        public string NombreArchivo { get; set; }
        public string NombreArchivoSalida { get; set; }
        public string Extencion { get; set; }
    }
}
