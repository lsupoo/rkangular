"use strict";
var NotificacionResult = (function () {
    function NotificacionResult(codigo, mensaje, detail) {
        this.codigo = codigo;
        this.mensaje = mensaje;
        this.detail = detail;
    }
    return NotificacionResult;
}());
exports.NotificacionResult = NotificacionResult;
