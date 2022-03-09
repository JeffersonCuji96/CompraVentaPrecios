var arrayDetalleCompra = [];
var urlHost = "https://localhost:44334";

function ObtenerCostos() {
    $("#btnObtenerCostos").attr("disabled", true);
    Limpiar();
    if ($("#txtFechaCompra").val() === "") {
        swal("Fecha", "Debe ingresar la fecha", { className: "swalSize" }).then(() => {
            $("#txtFechaCompra").focus();
            $("#btnObtenerCostos").attr("disabled", false);
        });
    } else {
        jQuery.ajax({
            url: urlHost + "/Costo/ObtenerCompraGasto" + "?fecha=" + $("#txtFechaCompra").val(),
            type: "GET",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (x) {
                if (x.Item1.length !== 0 && x.Item2.length !== 0) {
                    arrayDetalleCompra = Array.from(x.Item2);
                    CargarTablaGasto(x);
                    CargarTBodyDetalleGasto(x);
                } else {
                    swal("Información no procesada!", "No hay datos que mostrar para la fecha ingresada", "warning");
                }
                $("#btnObtenerCostos").attr("disabled", false);
            }
        });
    }
}
function CargarTablaGasto(x) {
    $("#tdTotalFactura").text(x.Item3.MontoFactura.toFixed(2));
    $("#tdTotalGasto").text(x.Item3.TotalGasto.toFixed(2));
    $("#tdPorcCosto").text(x.Item3.PorcentajeCosto.toFixed(6) + '%');
    $("#tdTotalCosto").text(x.Item1[0].TotalCosto.toFixed(2));
    $("#rowBefore").hide();
    for (let i = 0; i < x.Item1.length; i++) {
        $('#rowAfter').after(
            '<tr>' +
            '<td class="rowGasto text-center">' + x.Item1[i].Gasto + '</td>' +
            '<td class="rowGasto text-right">' + x.Item1[i].Precio.toFixed(2) + '</td>' +
            '</tr >'
        );
    }
}
function CargarTBodyDetalleGasto(x) {
    let sumaStock = 0;
    let sumaTotalFactura = 0;
    let sumaTotalCosto = 0;
    for (let i = 0; i < x.Item2.length; i++) {
        $("#tblDetalle tbody").append(
            '<tr>' +
            '<td class="text-center align-middle">' + (i + 1) + '</td>' +
            '<td class="align-middle">' + x.Item2[i].Descripcion + '</td>' +
            '<td class="text-center align-middle">' + x.Item2[i].Cantidad + '</td>' +
            '<td class="text-right align-middle">' + x.Item2[i].Precio.toFixed(2) + '</td>' +
            '<td class="text-right align-middle">' + x.Item2[i].TotalFactura.toFixed(2) + '</td>' +
            '<td class="text-center align-middle">' + x.Item2[i].PorcentajeCosto.toFixed(6) + '</td>' +
            '<td class="text-right align-middle">' + x.Item2[i].CostoUnidad.toFixed(2) + '</td>' +
            '<td class="text-right align-middle">' + x.Item2[i].CostoUnitario.toFixed(2) + '</td>' +
            '<td class="text-right align-middle row' + i + '">' + x.Item2[i].CostoTotal.toFixed(2) + '</td>' +
            '</tr>'
        );
        sumaStock += x.Item2[i].Cantidad;
        sumaTotalFactura += x.Item2[i].TotalFactura;
        sumaTotalCosto += x.Item2[i].CostoTotal;
    }
    CargarTFootDetalleCompra(sumaStock, sumaTotalFactura, sumaTotalCosto);
}
function CargarTFootDetalleCompra(sumaStock, sumaTotalFactura, sumaTotalCosto) {
    $("#tfootRowBefore").before(
        '<tr class="small rowSum">' +
        '<td></td>' +
        '<td></td>' +
        '<td class="text-center font-weight-bold">' + sumaStock + '</td>' +
        '<td></td>' +
        '<td class="text-right font-weight-bold">' + sumaTotalFactura.toFixed(2) + '</td>' +
        '<td></td>' +
        '<td></td>' +
        '<td></td>' +
        '<td class="text-right font-weight-bold rowFoot">' + sumaTotalCosto.toFixed(2) + '</td>' +
        '</tr>'
    );
}
function Limpiar() {
    arrayDetalleCompra = [];
    $('#tblDetalle tbody > tr').remove();
    $("#tdTotalFactura").text("0.00");
    $("#tdTotalGasto").text("0.00");
    $("#tdPorcCosto").text("0%");
    $("#tdTotalCosto").text("0.00");
    $(".rowGasto").remove();
    $(".rowSum").remove();
    $('#rowBefore').show();
}