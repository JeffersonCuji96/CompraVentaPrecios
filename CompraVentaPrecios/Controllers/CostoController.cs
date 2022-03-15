using Datos.DataAnnotations;
using Negocio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CompraVentaPrecios.Controllers
{
    public class CostoController : Controller
    {
        private readonly NDetalleCompraGastos nDetalleCompraGasto = new NDetalleCompraGastos();
        private readonly NDetalleGananciaVenta nDetalleGananciaVenta = new NDetalleGananciaVenta();
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult ObtenerCompraGasto(DateTime fecha)
        {
            var tupleDatos = nDetalleCompraGasto.ObtenerCompraGasto(fecha);
            return Json(tupleDatos, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult ObtenerGananciaVenta(CompraGananciaPorcentaje detalle)
        {
            int estado = 0;
            if (!ModelState.IsValid)
            {
                var lstErrores = ModelState.Values.Where(E => E.Errors.Count > 0).SelectMany(E => E.Errors).Select(E => E.ErrorMessage).ToList();
                var errores = new HashSet<string>(lstErrores);
                return Json(new { errores, estado }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                var gananciaVenta = nDetalleGananciaVenta.ObtenerGananciaVenta(detalle);
                return Json(gananciaVenta, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult GuardarGananciaVenta(List<DetalleGananciaVenta> gananciaVentas)
        {
            int estado = 0;
            if (!ModelState.IsValid)
            {
                var lstErrores = ModelState.Values.Where(E => E.Errors.Count > 0).SelectMany(E => E.Errors).Select(E => E.ErrorMessage).ToList();
                var errores = new HashSet<string>(lstErrores);
                return Json(new { errores, estado }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                estado = nDetalleGananciaVenta.Guardar(gananciaVentas);
                if (estado == 1)
                {
                    var lstGananciaVenta = new List<DetalleGananciaVenta>();
                    var idCompra = gananciaVentas.First().IdCompra;
                    lstGananciaVenta = nDetalleGananciaVenta.CargarGananciaVenta(idCompra);
                    return Json(new { lstGananciaVenta, estado }, JsonRequestBehavior.AllowGet);
                }
                return Json(new { estado }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public JsonResult GuardarUnidadesVendidas(UnidadesVenta unidadesVenta)
        {
            int estado = 0;
            if (!ModelState.IsValid)
            {
                var lstErrores = ModelState.Values.Where(E => E.Errors.Count > 0).SelectMany(E => E.Errors).Select(E => E.ErrorMessage).ToList();
                var errores = new HashSet<string>(lstErrores);
                return Json(new { errores, estado }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                var res = nDetalleGananciaVenta.GuardarUnidadesVendidas(unidadesVenta);
                return Json(res, JsonRequestBehavior.AllowGet);
            }
        }
    }
}