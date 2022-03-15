using Datos;
using Datos.DataAnnotations;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Transactions;
using Datos.ViewModels;
using System.Data.Entity;

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
                objTGananciaVenta.IdGanancia = 0;
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
        public List<DetalleGananciaVenta> CargarGananciaVenta(long idCompra)
        {
            var lstGananciaVenta = new List<DetalleGananciaVenta>();
            using (var db = new BDVentaCompraEntities())
            {
                lstGananciaVenta = db.TGananciaVenta.Where(x => x.IdCompra == idCompra).Select(x => new DetalleGananciaVenta()
                {
                    IdGanancia = x.IdGanancia,
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
            return lstGananciaVenta;
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
        public Tuple<int, DetalleUnidadesVenta> GuardarUnidadesVendidas(UnidadesVenta unidadesVenta)
        {
            int estado = 0;
            var detalleUnidadVenta = new DetalleUnidadesVenta();
            try
            {
                using (var db = new BDVentaCompraEntities())
                {
                    var tGananciaVenta = db.TGananciaVenta.Find(unidadesVenta.IdGanancia);
                    if (tGananciaVenta != null)
                    {
                        int stockActual = tGananciaVenta.Stock;
                        if (unidadesVenta.Cantidad > 0 && unidadesVenta.Cantidad <= stockActual)
                        {
                            int cantidadVendidaActual = tGananciaVenta.UnidadesVendidas;
                            decimal totalVendidoActual = tGananciaVenta.TotalVendido;
                            decimal precioEstablecido = tGananciaVenta.PrecioVentaEstablecido;
                            decimal totalVendidoNuevo = Math.Round(totalVendidoActual + unidadesVenta.Cantidad * precioEstablecido, 2);
                            int stockNuevo = stockActual - unidadesVenta.Cantidad;

                            tGananciaVenta.UnidadesVendidas = unidadesVenta.Cantidad + cantidadVendidaActual;
                            tGananciaVenta.Stock = stockNuevo;
                            tGananciaVenta.TotalVendido = totalVendidoNuevo;
                            db.Entry(tGananciaVenta).State = EntityState.Modified;
                            db.SaveChanges();

                            detalleUnidadVenta.Stock = tGananciaVenta.Stock;
                            detalleUnidadVenta.TotalVendido = tGananciaVenta.TotalVendido;
                            detalleUnidadVenta.UnidadesVendidas = tGananciaVenta.UnidadesVendidas;
                            estado = 1;
                            if (tGananciaVenta.Stock == 0)
                            {
                                detalleUnidadVenta.Habilitacion = true;
                            }
                            return Tuple.Create(estado, detalleUnidadVenta);
                        }
                    }
                    estado = 3;
                }
            }
            catch { estado = 2; }
            return Tuple.Create(estado, detalleUnidadVenta);
        }
    }

}
