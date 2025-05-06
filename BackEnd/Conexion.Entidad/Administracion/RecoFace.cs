using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Conexion.Entidad.Administracion
{
    public class RecoFace
    {
        public Int64 IdRecoFace { get; set; }
        public string NombreArchivo { get; set; }
        public string ArchivoBase64 { get; set; }
        public string DescriptorString { get; set; }
        public int Estado { get; set; }
        public int Tipo { get; set; }
    }
}
