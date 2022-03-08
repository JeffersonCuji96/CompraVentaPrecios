namespace Datos.ViewModels
{
    public class DetalleCompraViewModel
    {
        public string Descripcion { get; set; }
        public int Cantidad { get; set; }
        public decimal Precio { get; set; }
        public decimal TotalFactura { get; set; }
        public decimal PorcentajeCosto { get; set; }
        public decimal CostoUnidad { get; set; }
        public decimal CostoUnitario { get; set; }
        public decimal CostoTotal { get; set; }
        public long IdCompra { get; set; }
    }
}
