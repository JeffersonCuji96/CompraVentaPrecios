var tabla_producto;
const urlHost = "https://localhost:44334";
$(document).ready(function () {
    tabla_producto = $("#tblProducto").DataTable({
        ajax: {
            url: urlHost+"/Producto/Listar",
            type: "GET",
            dataType: "json"
        },
        responsive:true,
        filter: true,
        columns: [
            {
                data: "IdProducto", name:"IdProducto", "render": function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            {  data: "Descripcion", name: "Descripcion" },
            {
                data: "IdProducto", "render": function (data) {
                    return "<button id='btnEdit' class='btn btn-info btn-sm' type='button' onclick='AbrirModal("+data+")' ><li class='fa fa-edit'></i></button>" +
                           "<button class='btn btn-danger btn-sm ml-3' type='button' onclick='Eliminar("+data+")'><li class='fa fa-trash'></li></button>";
                },
                orderable: false,
                searchable: false,
                width: "150px",
                className:"text-center",
            }
        ],
        dom: 'Bfrtip',
        buttons: [
            {
                text: 'Agregar Nuevo',
                attr: { class: 'btn btn-success btn-sm' },
                action: function () {
                    AbrirModal(0)
                }
            }
        ],
        language: {
            url: urlHost+"/Content/DataTable/idioma/datatable.es-ES.json"
        }
    }); 
});

function AbrirModal(id) {
    $("#txtIdProducto").val(id);
    if (id !== 0) {
        jQuery.ajax({
            url: urlHost+"/Producto/Obtener"+"?id="+id,
            type: "GET",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data.objProducto != null) {
                    $("#txtDescripcion").val(data.objProducto.Descripcion);
                }
            }
        });
    } else {
        $("#txtDescripcion").val("");
    }
    $('#FormModalProductos').modal('show');
}

function Guardar() {
    $("#btnGuardar").attr("disabled", true);
    var data = {
        objProducto: {
            IdProducto: $("#txtIdProducto").val(),
            Descripcion: $("#txtDescripcion").val()
        }
    };
    jQuery.ajax({
        url: urlHost+"/Producto/Guardar",
        type: "POST",
        data: JSON.stringify(data),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (res) {
            if (res.estado === 1) {
                $('#FormModalProductos').modal('hide');
                tabla_producto.ajax.reload();
                swal("Transacción exitosa!", "Información guardada", "success");
            } else if (res.estado === 0) {
                swal("Transacción erronea", "El campo es requerido", "warning");
            } else if (res.estado === 3) {
                swal("Transacción erronea", "El producto ya existe", "warning");
            } else {
                swal("Transacción erronea", "La operación no se realizó", "error");
            }
            $("#txtDescripcion").val("");
            $("#btnGuardar").attr("disabled", false);
        }
    });
}

function Eliminar(id) {
    swal({
        title: "Aviso",
        text: "¿Está seguro de eliminar el registro?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
        buttons:["CANCELAR","OK"]
    }).then((willDelete) => {
        if (willDelete) {
            jQuery.ajax({
                url: urlHost+"/Producto/Eliminar" + "?id=" + id,
                type: "GET",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (res) {
                    if (res.estado === 1) {
                        swal("Transacción exitosa!", "Información eliminada", "success");
                        tabla_producto.ajax.reload();
                    } else {
                        swal("Transacción erronea!", "La operación no se realizó", "error");
                    }
                }
            });
        }
    });
}

