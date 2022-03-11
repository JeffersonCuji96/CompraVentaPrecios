using Datos;
using Datos.DataAnnotations;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Negocio
{
    public class NDetalleGananciaVenta
    {
        public List<TGananciaVenta> ObtenerGananciaVenta(CompraGananciaPorcentaje detalle)
        {
            var gananciaVenta = new List<TGananciaVenta>();
            for (int i = 0; i < detalle.DetalleCompra.Count; i++)
            {
                var objTGananciaVenta = new TGananciaVenta();
                decimal porcentaje = Convert.ToDecimal(detalle.PorcentajeGanancia);
                objTGananciaVenta.PorcentajeGanancia = porcentaje;
                objTGananciaVenta.MontoPorcentajeGanancia = Math.Round(detalle.DetalleCompra[i].CostoTotal / (1 - porcentaje / 100), 2);
                objTGananciaVenta.PrecioVenta = Math.Round(objTGananciaVenta.MontoPorcentajeGanancia / detalle.DetalleCompra[i].Cantidad, 2);
                objTGananciaVenta.PrecioVentaEstablecido = objTGananciaVenta.PrecioVenta;
                objTGananciaVenta.TotalVenta = Math.Round(objTGananciaVenta.PrecioVentaEstablecido * detalle.DetalleCompra[i].Cantidad, 2);
                objTGananciaVenta.MontoGanancia = Math.Round(objTGananciaVenta.PrecioVentaEstablecido - detalle.DetalleCompra[i].CostoUnitario, 2);
                objTGananciaVenta.TotalUtilidadBruta = Math.Round((objTGananciaVenta.PrecioVentaEstablecido - detalle.DetalleCompra[i].CostoUnitario) * detalle.DetalleCompra[i].Cantidad, 2);
                objTGananciaVenta.UnidadesVendidas = 0;
                objTGananciaVenta.TotalVendido = 0;
                objTGananciaVenta.Stock = detalle.DetalleCompra[i].Cantidad;
                objTGananciaVenta.IdCompra = detalle.DetalleCompra[i].IdCompra;
                gananciaVenta.Add(objTGananciaVenta);
            }
            return gananciaVenta;
        }
    }
}
