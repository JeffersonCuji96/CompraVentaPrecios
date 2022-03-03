var arrayGastos = new Array();
var arrayCompras = new Array();
var validoCompras = false;
var validoGastos = false;
var arrayProductos=new Array();
var contador = 1;
const urlHost = "https://localhost:44334";

$(document).ready(function () {
    ObtenerGastos();
    ObtenerProductos();
    InicializarSelect2();
});

function InicializarSelect2() {
    $('.select2js').select2({
        tags: true,
        selectOnClose: true
    });
}

function Guardar() {
    $("#btnGuardar").attr("disabled", true);
    if ($("#txtFecha").val() === "") {
        swal("Fecha", "Debe ingresar la fecha", { className: "swalSize" }).then(() => {
            $("#txtFecha").focus();
            $("#btnGuardar").attr("disabled", false);
        }); return;
    }
    EstablecerComprasYGastos();
    if (validoCompras && validoGastos) {
        var detalleCompraGasto = {
            Fecha: $("#txtFecha").val(),
            DetalleCompra: arrayCompras,
            DetalleGasto: arrayGastos
        };
        jQuery.ajax({
            url: urlHost+"/Compra/Guardar",
            type: "POST",
            data: JSON.stringify(detalleCompraGasto),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (res) {
                if (res.estado === 0) {
                    let list = '';
                    for (var i = 0; i < res.errores.length; i++) {
                        list += i + 1 + ". " + res.errores[i] + '\n';
                    }
                    swal("Error", list);
                    validoCompras = false;
                    validoGastos = false;
                } else if (res.estado === 1) {
                    Limpiar();
                    swal("Transacción exitosa!", "Información guardada", "success");
                } else {
                    swal("Transacción erronea", "La operación no se realizó", "error");
                }
                $("#btnGuardar").attr("disabled", false);
            }
        });
    }
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
        objGasto.Precio = row.find(".Precio input");
        arrayGastos.push(objGasto);
        arrayGastosValidacion.push(objGasto);
    });
    $("#tblCompra TBODY TR").each(function () {
        var row = $(this);
        var objCompra = {};
        objCompra.Producto = row.find(".Producto select").val();
        objCompra.Cantidad = parseInt(row.find(".Cantidad input").val());
        objCompra.Precio = row.find(".Precio input");
        arrayCompras.push(objCompra);
        arrayComprasValidacion.push(objCompra);
    });
    ValidarCompras(arrayComprasValidacion);
    ValidarGastos(arrayGastosValidacion);
}

function ValidarGastos(gastos) {
    for (var i = 0; i < gastos.length; i++) {
        if (parseFloat(gastos[i].Precio.replace(',', '.')) <= 0 || isNaN(parseFloat(gastos[i].Precio.replace(',', '.')))) {
            swal("Gastos", "Ingrese un precio válido", { className: "swalSize" }).then(() => {
                $("#fila-gasto" + i + " input").focus();
                $("#btnGuardar").attr("disabled", false);
            }); return;
        }
        $("#fila-gasto" + i + " input").val(gastos[i].Precio.replace('.', ','));
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
        if (parseFloat(compras[i].Precio.replace(',', '.')) <= 0 || isNaN(parseFloat(compras[i].Precio.replace(',', '.')))) {
            swal("Productos", "Ingrese un precio válido", { className: "swalSize" }).then(() => {
                $("#fila-producto" + i + " .Precio input").focus();
                $("#btnGuardar").attr("disabled", false);
            }); return;
        }
        $("#fila-producto" + i + " .Precio input").val(compras[i].Precio.replace('.', ','));
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

function CargarOpciones(numFila) {
    var n = numFila - 1;
    for (var i = 0; i < arrayProductos.length; i++) {
        $("#fila-producto" + n + " .select2js").append('<option value="' + arrayProductos[i].IdProducto + '">' + arrayProductos[i].Descripcion + '</option>');
    }
    InicializarSelect2();
}

function AgregarFila() {
    $('<tr id="fila-producto' + contador + '">' +
        '<td class="Producto"><select class="select2js form-control" onchange="RestablecerOpcion()"><option>Seleccionar</option></select></td>' +
        '<td class="Cantidad">' + '<input type="number" min="1" class="form-control" onkeypress="return EntradaCantidad(event)" value="0" onpaste="return false"/>' + '</td>' +
        '<td class="Precio">' + '<input type="number" min="1" class="form-control" onkeypress="return EntradaPrecio(event)" value="0" onpaste="return false"/>' + '</td>' +
        '<td>' + '<button type="button" class="btn btn-danger btn-sm" onclick="EliminarFila(' + contador + ');"><i class="fa fa-trash"></i></button>' + '</td>' +
        '</tr>').appendTo('#tblCompra');
    contador++;
    CargarOpciones(contador);
    RestablecerOpcion();
}

function RestablecerOpcion() {
    $('.select2js option').prop('disabled', false);
    $('.select2js').each(function () {
        var $this = $(this);
        $('.select2js')
            .not($this)
            .find('option')
            .each(function () {
                if ($(this).attr('value') == $this.val()) {
                    $(this).prop('disabled', true);
                }
            });
    });
}

function EliminarFila(numFila) {
    if (contador > 1) {
        $('#fila-producto' + numFila).remove();
        contador--;
    }
    RestablecerOpcion();
}

function EntradaPrecio(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode;
    return !(charCode > 31 && charCode != 44 && (charCode < 48 || charCode > 57));
}

function EntradaCantidad(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
}

function Limpiar() {
    $("#txtFecha").val(null);
    $("#tblGasto .Precio input").val(0);
    $('.select2js').val($('.select2js option:first-child').val()).trigger('change');
    $("#tblCompra .Cantidad input").val(0);
    $("#tblCompra .Precio input").val(0);
    if (contador > 1) {
        for (var i = 0; i < contador; i++) {
            EliminarFila(i);
        }
    }
}
