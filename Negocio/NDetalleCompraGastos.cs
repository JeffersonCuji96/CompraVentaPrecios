using Datos;
using Datos.DataAnnotations;
using Datos.ViewModels;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Transactions;

namespace Negocio
{
    public class NDetalleCompraGastos
    {
        private readonly NProducto nProducto = new NProducto();
        private readonly NCompra nCompra = new NCompra();
        private readonly NDetalleGasto nDetalleGasto = new NDetalleGasto();
        private readonly NDetalleCompra nDetalleCompra = new NDetalleCompra();
        public int Guardar(DetalleCompraGasto detalle)
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
                        var detalleCompra = nProducto.VerificarYAgregar(detalle.DetalleCompra, db);
                        decimal montoGasto = detalle.DetalleGasto.Sum(item => Convert.ToDecimal(item.Precio));
                        decimal sumaCompra = detalleCompra.Sum(item => Convert.ToDecimal(item.Precio) * Convert.ToDecimal(item.Cantidad));
                        decimal montoFactura = (sumaCompra * 12 / 100) + sumaCompra;
                        decimal porcentajeCosto = Math.Round(montoGasto / montoFactura * 100, 6);
                        decimal montoPorcentaje = (porcentajeCosto / 100) + 1;
                        decimal montoCompra = Math.Round(montoPorcentaje * montoFactura, 2);
                        long idCompra = nCompra.Guardar(detalle.Fecha, montoCompra, db);
                        nDetalleGasto.Guardar(detalle.DetalleGasto, idCompra, db);
                        nDetalleCompra.Guardar(detalleCompra, idCompra, porcentajeCosto, montoPorcentaje, db);
                        scope.Complete();
                        estado = 1;
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
        public bool VerificarFecha(DateTime fecha)
        {
            bool res = false;
            using (var db = new BDVentaCompraEntities())
            {
                res = db.TCompra.Any(x => x.Fecha == fecha);
            }
            return res;
        }
        public Tuple<List<CompraGastoViewModel>, List<DetalleCompraViewModel>, MontoCompraGasto, List<DetalleGananciaVenta>> ObtenerCompraGasto(DateTime fecha)
        {
            using (var db = new BDVentaCompraEntities())
            {
                var montos = new MontoCompraGasto();
                var lstGananciaVenta = new List<DetalleGananciaVenta>();
                bool verificacionGananciaVenta = false;
                long idCompra = 0;

                var lstCompraGasto = db.TDetalleGasto.Include(x => x.TGasto)
                    .Where(x => x.TCompra.Fecha == fecha).Select(x => new CompraGastoViewModel()
                    {
                        Gasto = x.TGasto.Descripcion,
                        Precio = x.Precio,
                        TotalCosto = x.TCompra.Monto
                    }).ToList();

                var lstDetalleCompra = db.TDetalleCompra.Include(x => x.TProducto)
                    .Where(x => x.TCompra.Fecha == fecha).Select(x => new DetalleCompraViewModel()
                    {
                        Descripcion = x.TProducto.Descripcion,
                        Cantidad = x.Cantidad,
                        Precio = x.Precio,
                        TotalFactura = x.TotalFactura,
                        PorcentajeCosto = x.PorcentajeCosto,
                        CostoUnidad = x.CostoUnidad,
                        CostoUnitario = x.CostoUnitario,
                        CostoTotal = x.CostoTotal,
                        IdCompra = x.TCompra.IdCompra
                    }).ToList();

                if (lstCompraGasto.Count != 0 && lstDetalleCompra.Count != 0)
                {
                    montos.MontoFactura = lstDetalleCompra.Sum(x => x.TotalFactura);
                    montos.TotalGasto = lstCompraGasto.Sum(x => x.Precio);
                    montos.PorcentajeCosto = lstDetalleCompra.First().PorcentajeCosto;
                    idCompra = lstDetalleCompra.First().IdCompra;
                }
                if (idCompra != 0)
                {
                    verificacionGananciaVenta = db.TGananciaVenta.Any(x => x.IdCompra == idCompra);
                    if (verificacionGananciaVenta)
                    {
                        lstGananciaVenta = db.TGananciaVenta.Where(x => x.IdCompra == idCompra).Select(x => new DetalleGananciaVenta()
                        {
                            PorcentajeGanancia = x.PorcentajeGanancia,
                            MontoPorcentajeGanancia = x.MontoPorcentajeGanancia,
                            PrecioVenta = x.PrecioVenta,
                            PrecioVentaEstablecido = x.PrecioVentaEstablecido,
                            TotalVenta = x.TotalVenta,
                            MontoGanancia = x.MontoGanancia,
                            TotalUtilidadBruta = x.TotalUtilidadBruta,
                            UnidadesVendidas = x.UnidadesVendidas,
                            TotalVendido = x.TotalVendido,
                            Stock = x.Stock,
                            IdCompra = x.IdCompra
                        }).ToList();
                    }
                }
                return Tuple.Create(lstCompraGasto, lstDetalleCompra, montos, lstGananciaVenta);
            }
        }
    }
}
