var arrayGastos = new Array();
var arrayCompras = new Array();
var validoCompras = false;
var validoGastos = false;
var arrayProductos;
const urlHost = "https://localhost:44334";

$(document).ready(function () {
    ObtenerGastos();
    ObtenerProductos();
});

function Guardar() {
    $("#btnGuardar").attr("disabled", true);
    if ($("#txtFecha").val() === "") {
        swal("Fecha", "Debe ingresar la fecha", { className: "swalSize" }).then(() => {
            $("#txtFecha").focus();
            $("#btnGuardar").attr("disabled", false);
        }); return;
    }
    EstablecerComprasYGastos();
}

function EstablecerComprasYGastos() {
    arrayGastos = [];
    arrayCompras = [];
    var arrayGastosValidacion = new Array();
    var arrayComprasValidacion = new Array();
    $("#tblGasto TBODY TR").each(function () {
        var row = $(this);
        var objGasto = {};
        objGasto.IdGasto = parseFloat(row.find(".Id").html());
        objGasto.Precio = row.find(".Precio input").val().replace('.', ',');
        arrayGastos.push(objGasto);
        arrayGastosValidacion.push(objGasto);
    });
    $("#tblCompra TBODY TR").each(function () {
        var row = $(this);
        var objCompra = {};
        objCompra.Producto = row.find(".Producto select").val();
        objCompra.Cantidad = parseInt(row.find(".Cantidad input").val());
        objCompra.Precio = row.find(".Precio input").val().replace('.', ',');
        arrayCompras.push(objCompra);
        arrayComprasValidacion.push(objCompra);
    });
    ValidarCompras(arrayComprasValidacion);
    ValidarGastos(arrayGastosValidacion);
}

function ValidarGastos(gastos) {
    for (var i = 0; i < gastos.length; i++) {
        if (parseFloat(gastos[i].Precio) <= 0 || isNaN(parseFloat(gastos[i].Precio))) {
            swal("Gastos", "Ingrese un precio válido", { className: "swalSize" }).then(() => {
                $("#fila-gasto" + i + " input").focus();
                $("#btnGuardar").attr("disabled", false);
            }); return;
        }
        $("#fila-gasto" + i + " input").val(parseFloat(gastos[i].Precio.replace(',', '.')));
    }
    validoGastos = true;
}

function ValidarCompras(compras) {
    for (var i = 0; i < compras.length; i++) {
        if (compras[i].Producto === "Seleccionar") {
            swal("Productos", "Debe ingresar el producto", { className: "swalSize" }).then(() => {
                $("#btnGuardar").attr("disabled", false);
            }); return;
        }
        if (compras[i].Cantidad < 1 || isNaN(compras[i].Cantidad)) {
            swal("Productos", "Ingrese una cantidad válida", { className: "swalSize" }).then(() => {
                $("#fila-producto" + i + " .Cantidad input").focus();
                $("#btnGuardar").attr("disabled", false);
            }); return;
        }
        $("#fila-producto" + i + " .Cantidad input").val(compras[i].Cantidad);
        if (parseFloat(compras[i].Precio) <= 0 || isNaN(parseFloat(compras[i].Precio))) {
            swal("Productos", "Ingrese un precio válido", { className: "swalSize" }).then(() => {
                $("#fila-producto" + i + " .Precio input").focus();
                $("#btnGuardar").attr("disabled", false);
            }); return;
        }
        $("#fila-producto" + i + " .Precio input").val(parseFloat(compras[i].Precio.replace(',', '.')));
    }
    validoCompras = true;
}

function ObtenerGastos() {
    jQuery.ajax({
        url: urlHost+"/Gasto/Listar",
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (x) {
            $.each(x.data, function (index, item) {
                $("#tblGasto tbody").append(
                    '<tr>' + '<td class="d-none Id">' + item.IdGasto + '</td>' +
                    '<td>' + item.Descripcion + '</td>' +
                    '<td class="Precio" id="fila-gasto' + index + '"><input type="text" class="form-control text-center" value="0" onkeypress="return EntradaPrecio(event)" onpaste="return false"/></td></tr>');
            });
        }
    });
}

function ObtenerProductos() {
    jQuery.ajax({
        url: urlHost+"/Producto/Listar",
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (x) {
            arrayProductos = x.data;
            for (var i = 0; i < arrayProductos.length; i++) {
                $(".select2js").append(
                    '<option value="' + arrayProductos[i].IdProducto + '">' + arrayProductos[i].Descripcion + '</option>');
            }
        }
    });
}
