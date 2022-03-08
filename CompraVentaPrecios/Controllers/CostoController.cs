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
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult ObtenerCompraGasto(DateTime fecha)
        {
            var tupleDatos = nDetalleCompraGasto.ObtenerCompraGasto(fecha);
            return Json(tupleDatos, JsonRequestBehavior.AllowGet);
        }
    }
}