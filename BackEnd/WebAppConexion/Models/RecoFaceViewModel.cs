using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAppConexion.Models
{
    public class RecoFaceViewModel
    {
        public Int64 IdRecoFace { get; set; }
        public string NombreArchivo { get; set; }
        public string ArchivoBase64 { get; set; }
        public string DescriptorString { get; set; }
        public int Estado { get; set; }
        public int Tipo { get; set; }
    }
}
