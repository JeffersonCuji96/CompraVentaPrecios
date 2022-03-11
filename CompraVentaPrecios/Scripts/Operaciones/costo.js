var arrayDetalleCompra = [];
var urlHost = "https://localhost:44334";

function CalcularCompraGasto() {
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
    $("#tdTotalFactura").text(x.Item3.MontoFactura.toFixed(2).replace(".",","));
    $("#tdTotalGasto").text(x.Item3.TotalGasto.toFixed(2).replace(".", ","));
    $("#tdPorcCosto").text(x.Item3.PorcentajeCosto.toFixed(6).replace(".", ",") + '%');
    $("#tdTotalCosto").text(x.Item1[0].TotalCosto.toFixed(2).replace(".", ","));
    $("#rowBefore").hide();
    for (let i = 0; i < x.Item1.length; i++) {
        $('#rowAfter').after(
            '<tr>' +
            '<td class="rowGasto text-center">' + x.Item1[i].Gasto + '</td>' +
            '<td class="rowGasto text-right">' + x.Item1[i].Precio.toFixed(2).replace(".", ",") + '</td>' +
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
            '<td class="text-right align-middle">' + x.Item2[i].Precio.toFixed(2).replace(".", ",") + '</td>' +
            '<td class="text-right align-middle">' + x.Item2[i].TotalFactura.toFixed(2).replace(".", ",") + '</td>' +
            '<td class="text-center align-middle">' + x.Item2[i].PorcentajeCosto.toFixed(6).replace(".", ",") + '</td>' +
            '<td class="text-right align-middle">' + x.Item2[i].CostoUnidad.toFixed(2).replace(".", ",") + '</td>' +
            '<td class="text-right align-middle">' + x.Item2[i].CostoUnitario.toFixed(2).replace(".", ",") + '</td>' +
            '<td class="text-right align-middle row' + i + '">' + x.Item2[i].CostoTotal.toFixed(2).replace(".", ",") + '</td>' +
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
        '<td class="text-right font-weight-bold">' + sumaTotalFactura.toFixed(2).replace(".", ",") + '</td>' +
        '<td></td>' +
        '<td></td>' +
        '<td></td>' +
        '<td class="text-right font-weight-bold rowFoot">' + sumaTotalCosto.toFixed(2).replace(".", ",") + '</td>' +
        '</tr>'
    );
}
function CalcularGananciaVenta() {
    $("#btnCalcular").attr("disabled", true);
    $(".rowGanancia").remove();
    $(".rowSum2").remove();
    var porcentajeGanancia = $("#txtPorcGanancia").val().replace(",", ".");
    console.log(porcentajeGanancia);
    if (arrayDetalleCompra.length === 0) {
        swal("Costos", "Primer debe obtener los costos", { className: "swalSize" });
        $("#btnCalcular").attr("disabled", false);
    } else if (porcentajeGanancia==="") {
        swal("Ganancia", "Ingresar un porcentaje de ganancia", { className: "swalSize" }).then(() => {
            $("#txtPorcGanancia").focus();
        });
        $("#btnCalcular").attr("disabled", false);
    } else if (porcentajeGanancia < 10) {
        swal("Ganancia", "El porcentaje mínimo de ganancia es del 10%", { className: "swalSize" });
        $("#btnCalcular").attr("disabled", false);
    }
    else if (porcentajeGanancia > 99) {
        swal("Ganancia", "Porcentaje de ganancia inválido", { className: "swalSize" });
        $("#btnCalcular").attr("disabled", false);
    } else {
        var data = {
            detalle: {
                DetalleCompra: arrayDetalleCompra,
                PorcentajeGanancia: parseFloat(porcentajeGanancia)
            }
        };
        jQuery.ajax({
            url: urlHost + "/Costo/ObtenerGananciaVenta",
            type: "POST",
            data: JSON.stringify(data),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (res) {
                if (res.estado === 0) {
                    let list = '';
                    for (var i = 0; i < res.errores.length; i++) {
                        list += i + 1 + ". " + res.errores[i] + '\n';
                    }
                    swal("Error", list);
                    $("#btnCalcular").attr("disabled", false);
                    return;
                }
                CargarTBodyGananciaVenta(res);
                $("#btnCalcular").attr("disabled", false);
            }
        });
    }
}
function CargarTBodyGananciaVenta(res) {
    let sumaMontoPorcentaje = 0;
    let sumaTotalVenta = 0;
    let sumaUtilidadBruta = 0;
    let sumaUnidadesVendidas = 0;
    let sumaTotalVendido = 0;
    for (let i = 0; i < res.length; i++) {
        $('.row' + i).after(
            '<td id="PorcentajeGanancia' + i + '" class="rowGanancia d-none">' + res[i].PorcentajeGanancia.toFixed(2).replace(".", ",") + '</td>' +
            '<td id="MontoPorcentaje' + i + '" class="rowGanancia align-middle text-right">' + res[i].MontoPorcentajeGanancia.toFixed(2).replace(".", ",") + '</td>' +
            '<td id="PrecioVenta' + i + '" class="rowGanancia align-middle text-right">' + res[i].PrecioVenta.toFixed(2).replace(".", ",") + '</td>' +
            '<td class="rowGanancia"><div class="row ml-2">' +
            '<input id="PrecioEstablecido' + i + '" type="text" class="form-control w80 btn-sm text-right" onkeypress="return EntradaPrecio(event);" onpaste="return false" value="' + res[i].PrecioVentaEstablecido.toFixed(2).replace(".", ",") + '"/>&nbsp;' +
            '<button type="button" class="btn btn-info btn-sm" onclick="CalcularPrecioEstablecido(' + i + ')"><i class="fa fa-calculator"></i></button ></div></td >' +
            '<td id="TotalVenta' + i + '" class="rowGanancia align-middle text-right">' + res[i].TotalVenta.toFixed(2).replace(".", ",") + '</td>' +
            '<td id="Ganancia' + i + '" class="rowGanancia align-middle text-right">' + res[i].MontoGanancia.toFixed(2).replace(".", ",") + '</td>' +
            '<td id="UtilidadBruta' + i + '" class="rowGanancia align-middle text-right">' + res[i].TotalUtilidadBruta.toFixed(2).replace(".", ",") + '</td>' +
            '<td class="rowGanancia"><div class="row ml-2">' +
            '<input id="CantidadVendida' + i + '" type="text" class="form-control w80 btn-sm text-center" onkeypress="return EntradaCantidad(event);" onpaste="return false" value="' + res[i].UnidadesVendidas + '"/>&nbsp;' +
            '<button id="btnVendido' + i + '" type="button" class="btn btn-info btn-sm" onclick="CalcularUnidadesVendidas(' + i + ');"><i class="fa fa-calculator"></i></button ></div></td >' +
            '<td id="TotalVendido' + i + '" class="rowGanancia align-middle text-right">' + res[i].TotalVendido.toFixed(2).replace(".", ",") + '</td>' +
            '<td id="Stock' + i + '" class="rowGanancia align-middle text-center">' + res[i].Stock + '</td>'
        );
        sumaMontoPorcentaje += res[i].MontoPorcentajeGanancia;
        sumaTotalVenta += res[i].TotalVenta;
        sumaUtilidadBruta += res[i].TotalUtilidadBruta;
        sumaUnidadesVendidas += res[i].UnidadesVendidas;
        sumaTotalVendido += res[i].TotalVendido;
        $("#CantidadVendida" + i).attr("disabled", true);
        $("#btnVendido" + i).attr("disabled", true);
    }
    CargarTFootGananciaVenta(sumaMontoPorcentaje, sumaTotalVenta, sumaUtilidadBruta, sumaUnidadesVendidas, sumaTotalVendido);
}
function CargarTFootGananciaVenta(sumaMontoPorcentaje, sumaTotalVenta, sumaUtilidadBruta, sumaUnidadesVendidas, sumaTotalVendido) {
    $('.rowFoot').after(
        '<td class="rowSum2 text-right font-weight-bold">' + sumaMontoPorcentaje.toFixed(2).replace(".", ",") + '</td>' +
        '<td class="rowSum2"></td>' +
        '<td class="rowSum2"></td>' +
        '<td class="rowSum2 text-right font-weight-bold">' + sumaTotalVenta.toFixed(2).replace(".", ",") + '</td>' +
        '<td class="rowSum2"></td>' +
        '<td class="rowSum2 text-right font-weight-bold">' + sumaUtilidadBruta.toFixed(2).replace(".", ",") + '</td>' +
        '<td class="rowSum2 text-center font-weight-bold">' + sumaUnidadesVendidas + '</td>' +
        '<td class="rowSum2 text-right font-weight-bold">' + sumaTotalVendido.toFixed(2).replace(".", ",") + '</td>' +
        '<td class="rowSum2"></td>'
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

function EntradaPrecio(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode;
    return !(charCode > 31 && charCode != 44 && (charCode < 48 || charCode > 57));
}

function EntradaCantidad(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
}