//------------------------------------------------------------------------------
// <auto-generated>
//     Este código se generó a partir de una plantilla.
//
//     Los cambios manuales en este archivo pueden causar un comportamiento inesperado de la aplicación.
//     Los cambios manuales en este archivo se sobrescribirán si se regenera el código.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Datos
{
    using System;
    using System.Collections.Generic;
    
    public partial class TDetalleCompra
    {
        public long IdDetalleCompra { get; set; }
        public int Cantidad { get; set; }
        public decimal Precio { get; set; }
        public decimal TotalFactura { get; set; }
        public decimal PorcentajeCosto { get; set; }
        public decimal CostoUnidad { get; set; }
        public decimal CostoUnitario { get; set; }
        public decimal CostoTotal { get; set; }
        public long IdCompra { get; set; }
        public long IdProducto { get; set; }
    
        public virtual TCompra TCompra { get; set; }
        public virtual TProducto TProducto { get; set; }
    }
}
