namespace Datos.ViewModels
{
    public class CompraGastoViewModel
    {
        public string Gasto { get; set; }
        public decimal Precio { get; set; }
        public decimal TotalCosto { get; set; }
    }
    public class MontoCompraGasto
    {
        public decimal MontoFactura { get; set; }
        public decimal TotalGasto { get; set; }
        public decimal PorcentajeCosto { get; set; }
    }
}
