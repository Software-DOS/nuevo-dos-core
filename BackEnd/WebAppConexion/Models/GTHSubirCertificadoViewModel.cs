namespace WebAppConexion.Models
{
    /// <summary>
    /// Respuesta del endpoint de subida de certificados
    /// </summary>
    public class GTHSubirCertificadoViewModel
    {
        public bool Success { get; set; }
        public string Mensaje { get; set; }
        public string CertificadoUrl { get; set; }
        public string NombreArchivo { get; set; }
        public long TamanoArchivo { get; set; }
    }
}
