using Datos;
using Negocio;
using System.Web.Mvc;

namespace CompraVentaPrecios.Controllers
{
    public class ProductoController : Controller
    {
        private readonly NProducto nProducto = new NProducto();
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult Listar()
        {
            var lstProductos = nProducto.Listar();
            return Json(new { data = lstProductos }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult Obtener(int id)
        {
            var objProducto = nProducto.Obtener(id);
            return Json(new { objProducto }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Guardar(TProducto objProducto)
        {
            int res = nProducto.Guardar(objProducto);
            return Json(new { estado = res }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult Eliminar(int id)
        {
            int res = nProducto.Eliminar(id);
            return Json(new { estado = res }, JsonRequestBehavior.AllowGet);
        }
    }
}