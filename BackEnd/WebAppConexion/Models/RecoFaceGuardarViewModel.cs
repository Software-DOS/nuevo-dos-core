using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAppConexion.Models
{
    public class RecoFaceGuardarViewModel
    {
        public Int64 IdRecoFace { get; set; }
        public string Json { get; set; }
        public int Estado { get; set; }
        public int Tipo { get; set; }
    }
}
