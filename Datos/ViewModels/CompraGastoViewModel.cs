using System;

namespace Datos.ViewModels
{
    public class CompraGastoViewModel
    {
        public string Producto { get; set; }
        public decimal Precio { get; set; }
        public decimal TotalCompra { get; set; }
    }
    public class MontoCompraGasto
    {
        public decimal TotalGasto { get; set; }
        public decimal PorcentajeCosto { get; set; }
        public decimal TotalCosto { get; set; }
    }
}
