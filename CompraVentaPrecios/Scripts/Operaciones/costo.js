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
                    HabilitacionPrecioPorcentaje(false);
                    CargarTablaGasto(x);
                    CargarTBodyDetalleGasto(x);
                    if (x.Item4.length !== 0) {
                        CargarTBodyGananciaVenta(x.Item4);
                        HabilitacionPrecioPorcentaje(true);
                        $("#txtPorcGanancia").val(x.Item4[0].PorcentajeGanancia);
                    }
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
                CargarTBodyGananciaVenta(res,true);
                $("#btnCalcular").attr("disabled", false);
            }
        });
    }
}
function HabilitacionPrecioPorcentaje(estado) {
    $(".txtPrecioEstablecido").attr("disabled", estado);
    $(".btnPrecioEstablecido").attr("disabled", estado);
    $("#txtPorcGanancia").attr("disabled", estado);
    $("#btnCalcular").attr("disabled", estado);
    $("#btnGananciaVenta").attr("disabled", estado);
}
function CargarTBodyGananciaVenta(res, estado = false) {
    let sumaMontoPorcentaje = 0;
    let sumaTotalVenta = 0;
    let sumaUtilidadBruta = 0;
    let sumaUnidadesVendidas = 0;
    let sumaTotalVendido = 0;
    for (let i = 0; i < res.length; i++) {
        $('.row' + i).after(
            '<td id="IdGanancia' + i + '" class="rowGanancia d-none">' + res[i].IdGanancia + '</td>' +
            '<td id="PorcentajeGanancia' + i + '" class="rowGanancia d-none">' + res[i].PorcentajeGanancia.toFixed(2).replace(".", ",") + '</td>' +
            '<td id="MontoPorcentaje' + i + '" class="rowGanancia align-middle text-right">' + res[i].MontoPorcentajeGanancia.toFixed(2).replace(".", ",") + '</td>' +
            '<td id="PrecioVenta' + i + '" class="rowGanancia align-middle text-right">' + res[i].PrecioVenta.toFixed(2).replace(".", ",") + '</td>' +
            '<td class="rowGanancia"><div class="row ml-2">' +
            '<input id="PrecioEstablecido' + i + '" type="text" class="form-control w80 btn-sm text-right txtPrecioEstablecido" onkeypress="return EntradaPrecio(event);" onpaste="return false" value="' + res[i].PrecioVentaEstablecido.toFixed(2).replace(".", ",") + '"/>&nbsp;' +
            '<button type="button" class="btn btn-info btn-sm btnPrecioEstablecido" onclick="CalcularPrecioEstablecido(' + i + ')"><i class="fa fa-calculator"></i></button ></div></td >' +
            '<td id="TotalVenta' + i + '" class="rowGanancia align-middle text-right">' + res[i].TotalVenta.toFixed(2).replace(".", ",") + '</td>' +
            '<td id="Ganancia' + i + '" class="rowGanancia align-middle text-right">' + res[i].MontoGanancia.toFixed(2).replace(".", ",") + '</td>' +
            '<td id="UtilidadBruta' + i + '" class="rowGanancia align-middle text-right">' + res[i].TotalUtilidadBruta.toFixed(2).replace(".", ",") + '</td>' +
            '<td class="rowGanancia"><div class="row ml-2">' +
            '<input id="CantidadVendida' + i + '" type="text" class="form-control w80 btn-sm text-center txtCantidadVendida" onkeypress="return EntradaCantidad(event);" onpaste="return false" value="' + res[i].UnidadesVendidas + '"/>&nbsp;' +
            '<button id="btnVendido' + i + '" type="button" class="btn btn-info btn-sm btnCantidadVendida" onclick="CalcularUnidadesVendidas(' + i + ');"><i class="fa fa-calculator"></i></button ></div></td >' +
            '<td id="TotalVendido' + i + '" class="rowGanancia align-middle text-right">' + res[i].TotalVendido.toFixed(2).replace(".", ",") + '</td>' +
            '<td id="Stock' + i + '" class="rowGanancia align-middle text-center">' + res[i].Stock + '</td>'
        );
        sumaMontoPorcentaje += res[i].MontoPorcentajeGanancia;
        sumaTotalVenta += res[i].TotalVenta;
        sumaUtilidadBruta += res[i].TotalUtilidadBruta;
        sumaUnidadesVendidas += res[i].UnidadesVendidas;
        sumaTotalVendido += res[i].TotalVendido;

        if (estado === false) {
            if (res[i].Stock === 0) {
                HabilitacionUnidadVenta(i, true);
            } else {
                HabilitacionUnidadVenta(i, false);
            }
        } else {
            HabilitacionUnidadesVentas(estado);
        }
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
        '<td id="SumaUnidades" class="rowSum2 text-center font-weight-bold">' + sumaUnidadesVendidas + '</td>' +
        '<td id="SumaTotalVendido" class="rowSum2 text-right font-weight-bold">' + sumaTotalVendido.toFixed(2).replace(".", ",") + '</td>' +
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

function CalcularPrecioEstablecido(index) {
    var precioEstablecido = parseFloat($("#PrecioEstablecido" + index).val().replace(",", ".")).toFixed(2);
    var precioVenta = parseFloat($("#PrecioVenta" + index).text().replace(",", ".")).toFixed(2);
    $("#PrecioEstablecido" + index).val(precioEstablecido.replace(".", ","));
    if (precioEstablecido < precioVenta) {
        var precioEstablecidoInvalido = precioEstablecido.replace(".", ",");
        $("#PrecioEstablecido" + index).val(precioVenta.replace(".", ","));
        $("#PrecioEstablecido" + index).focus();
        precioEstablecido = precioVenta;
        swal("Venta", "El precio de venta establecido: " + precioEstablecidoInvalido + ". No puede ser menor al precio de venta: " + precioVenta.replace(".", ","), "warning");
    }
    var stock = arrayDetalleCompra[index].Cantidad;
    var costoUnitario = arrayDetalleCompra[index].CostoUnitario;
    var totalVenta = precioEstablecido * stock;
    var ganancia = precioEstablecido - costoUnitario;
    var utilidadBruta = (precioEstablecido - costoUnitario) * stock;
    $("#TotalVenta" + index).text(totalVenta.toFixed(2).replace(".", ","));
    $("#Ganancia" + index).text(ganancia.toFixed(2).replace(".", ","));
    $("#UtilidadBruta" + index).text(utilidadBruta.toFixed(2).replace(".", ","));
    SumarMontosGananciaVenta();
}
function SumarMontosGananciaVenta() {
    $(".rowSum2").remove();
    let sumaMontoPorcentaje = 0;
    let sumaTotalVenta = 0;
    let sumaUtilidadBruta = 0;
    let sumaUnidadesVendidas = 0;
    let sumaTotalVendido = 0;
    for (let i = 0; i < arrayDetalleCompra.length; i++) {
        sumaMontoPorcentaje += parseFloat($("#MontoPorcentaje" + i).text().replace(",", "."));
        sumaTotalVenta += parseFloat($("#TotalVenta" + i).text().replace(",", "."));
        sumaUtilidadBruta += parseFloat($("#UtilidadBruta" + i).text().replace(",", "."));
        sumaUnidadesVendidas += parseInt($("#CantidadVendida" + i).val());
        sumaTotalVendido += parseFloat($("#TotalVendido" + i).text().replace(",", "."));
    }
    CargarTFootGananciaVenta(sumaMontoPorcentaje, sumaTotalVenta, sumaUtilidadBruta, sumaUnidadesVendidas, sumaTotalVendido);
}
function GuardarGananciaVenta() {
    $("#btnGananciaVenta").attr("disabled", true);
    if (arrayDetalleCompra.length === 0) {
        swal("Costos", "Primer debe obtener los costos", { className: "swalSize" });
        $("#btnGananciaVenta").attr("disabled", false);
    } else {
        arrayGananciaVenta = [];
        for (let i = 0; i < arrayDetalleCompra.length; i++) {
            var objGananciaVenta = {
                PorcentajeGanancia: parseFloat($("#PorcentajeGanancia" + i).text().replace(",", ".")),
                MontoPorcentajeGanancia: parseFloat($("#MontoPorcentaje" + i).text().replace(",", ".")),
                PrecioVenta: parseFloat($("#PrecioVenta" + i).text().replace(",", ".")),
                PrecioVentaEstablecido: $("#PrecioEstablecido" + i).val(),
                TotalVenta: parseFloat($("#TotalVenta" + i).text().replace(",", ".")),
                MontoGanancia: parseFloat($("#Ganancia" + i).text().replace(",", ".")),
                TotalUtilidadBruta: parseFloat($("#UtilidadBruta" + i).text().replace(",", ".")),
                UnidadesVendidas: 0,
                TotalVendido: 0,
                Stock: parseInt($("#Stock" + i).text()),
                IdCompra: arrayDetalleCompra[i].IdCompra
            };
            arrayGananciaVenta.push(objGananciaVenta);
        }
        jQuery.ajax({
            url: urlHost + "/Costo/GuardarGananciaVenta",
            type: "POST",
            data: JSON.stringify(arrayGananciaVenta),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (res) {
                if (res.estado === 0) {
                    let list = '';
                    for (var i = 0; i < res.errores.length; i++) {
                        list += i + 1 + ". " + res.errores[i] + '\n';
                    }
                    $("#btnGananciaVenta").attr("disabled", false);
                    swal("Error", list);
                } else if (res.estado === 1) {
                    $(".rowGanancia").remove();
                    $(".rowSum2").remove();
                    CargarTBodyGananciaVenta(res.lstGananciaVenta);
                    HabilitacionPrecioPorcentaje(true);
                    swal("Transacción exitosa!", "Información guardada", "success");
                } else if (res.estado === 3) {
                    swal("Transacción erronea!", "El detalle ya se encuentra ingresado", "warning");
                } else {
                    $("#btnGananciaVenta").attr("disabled", false);
                    swal("Transacción erronea", "La operación no se realizó", "error");
                }
            }
        });
    }
}

function HabilitacionUnidadesVentas(estado) {
    $(".txtCantidadVendida").attr("disabled", estado);
    $(".btnCantidadVendida").attr("disabled", estado);
}

function HabilitacionUnidadVenta(index, estado) {
    $("#CantidadVendida" + index).attr("disabled", estado);
    $("#btnVendido" + index).attr("disabled", estado);
}

function SumarTotalUnidadesVenta(index, item) {
    let sumaTotalVendido = 0;
    let sumaUnidadesVendidas = 0;
    $("#TotalVendido" + index).text(item.TotalVendido.toFixed(2));
    $("#Stock" + index).text(item.Stock);
    $("#CantidadVendida" + index).val(item.UnidadesVendidas);
    for (let i = 0; i < arrayDetalleCompra.length; i++) {
        sumaUnidadesVendidas += parseInt($("#CantidadVendida" + i).val());
        sumaTotalVendido += parseFloat($("#TotalVendido" + i).text().replace(",", "."));
    }
    $("#SumaUnidades").text(sumaUnidadesVendidas);
    $("#SumaTotalVendido").text(sumaTotalVendido.toFixed(2).replace(".", ","));
}

function CalcularUnidadesVendidas(index) {
    var idGanancia = parseFloat($("#IdGanancia" + index).text());
    var cantidadVendida = parseInt($("#CantidadVendida" + index).val());
    if (isNaN(cantidadVendida)) {
        swal("Cantidad Vendida", "Ingrese una cantidad", "warning");
    } else if (cantidadVendida === 0) {
        swal("Cantidad Vendida", "La cantidad no puede ser cero", "warning");
    } else {
        var data = {
            UnidadesVenta: {
                IdGanancia: idGanancia,
                Cantidad: cantidadVendida
            }
        };
        jQuery.ajax({
            url: urlHost + "/Costo/GuardarUnidadesVendidas",
            type: "POST",
            data: JSON.stringify(data),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (res) {
                if (res.Item1 === 0) {
                    let list = '';
                    for (var i = 0; i < res.errores.length; i++) {
                        list += i + 1 + ". " + res.errores[i] + '\n';
                    }
                    swal("Error", list);
                } else if (res.Item1 === 3) {
                    swal("Unidades Vendidas", "La cantidad vendida no pueder ser cero ni mayor o menor al stock del producto", "warning").then(() => {
                        $("#CantidadVendida" + index).focus();
                    });
                } else if (res.Item1 === 1) {
                    HabilitacionUnidadVenta(index, res.Item2.Habilitacion);
                    SumarTotalUnidadesVenta(index, res.Item2);
                    swal("Transacción exitosa!", "Información guardada", "success");
                } else {
                    swal("Transacción erronea", "La operación no se realizó", "error");
                }
            }
        });
    }
}