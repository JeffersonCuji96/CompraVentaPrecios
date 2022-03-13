using Datos;
using Datos.DataAnnotations;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Transactions;

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

        public int Guardar(List<DetalleGananciaVenta> gananciaVentas)
        {
            int estado = 0;
            TransactionOptions options = new TransactionOptions();
            options.Timeout = new TimeSpan(0, 15, 0);
            using (TransactionScope scope = new TransactionScope(TransactionScopeOption.Required, options))
            {
                using (var db = new BDVentaCompraEntities())
                {
                    try
                    {
                        var idCompra = gananciaVentas.First().IdCompra;
                        var verificacionDetalleCompra = db.TGananciaVenta.Any(x => x.IdCompra == idCompra);
                        if (verificacionDetalleCompra==false)
                        {
                            for (int i = 0; i < gananciaVentas.Count; i++)
                            {
                                var objGananciaVenta = new TGananciaVenta()
                                {
                                    PorcentajeGanancia = gananciaVentas[i].PorcentajeGanancia,
                                    MontoPorcentajeGanancia = gananciaVentas[i].MontoPorcentajeGanancia,
                                    PrecioVenta = gananciaVentas[i].PrecioVenta,
                                    PrecioVentaEstablecido = Convert.ToDecimal(gananciaVentas[i].PrecioVentaEstablecido),
                                    TotalVenta = gananciaVentas[i].TotalVenta,
                                    MontoGanancia = gananciaVentas[i].MontoGanancia,
                                    TotalUtilidadBruta = gananciaVentas[i].TotalUtilidadBruta,
                                    UnidadesVendidas = gananciaVentas[i].UnidadesVendidas,
                                    TotalVendido = gananciaVentas[i].TotalVendido,
                                    Stock = gananciaVentas[i].Stock,
                                    IdCompra = gananciaVentas[i].IdCompra
                                };
                                db.TGananciaVenta.Add(objGananciaVenta);
                                db.SaveChanges();
                            }
                            scope.Complete();
                            estado = 1;
                            return estado;
                        }
                        estado = 3;
                    }
                    catch
                    {
                        estado = 2;
                        scope.Dispose();
                    }
                }
            }
            return estado;
        }

    }

}
