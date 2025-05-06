using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Conexion.AccesoDatos.Repository.CArchivo;

namespace WinForProcesarArchivo
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void btnValidar_Click(object sender, EventArgs e)
        {
            CargarXLSX cargar = new CargarXLSX();
            cargar.SubirArchivo(2);
        }
    }
}
