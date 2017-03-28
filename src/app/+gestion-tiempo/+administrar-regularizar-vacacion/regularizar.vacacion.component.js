"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var historialLaboral_1 = require("../../+dto/maintenance/historialLaboral");
var periodoEmpleado_1 = require("../../+dto/maintenance/periodoEmpleado");
var empleado_1 = require("../../+dto/maintenance/empleado");
var vacacion_1 = require("../../+dto/maintenance/vacacion");
var componentBase_1 = require("../../+common/service/componentBase");
var RegularizarVacacionComponent = (function (_super) {
    __extends(RegularizarVacacionComponent, _super);
    function RegularizarVacacionComponent(backendService, _router, permisoService, empleadoService, completerService, location) {
        var _this = _super.call(this, backendService, 'GT002') || this;
        _this.backendService = backendService;
        _this._router = _router;
        _this.permisoService = permisoService;
        _this.empleadoService = empleadoService;
        _this.completerService = completerService;
        _this.location = location;
        _this.historiaLaboralActual = new historialLaboral_1.HistorialLaboral();
        _this.periodoEmpleadoActual = new periodoEmpleado_1.PeriodoEmpleado();
        _this.agendarVacacion = new vacacion_1.Vacacion();
        _this.agendarVacacionPeriodo = new vacacion_1.Vacacion();
        _this.empleado = new empleado_1.Empleado();
        _this.historiasLaboralesActuales = [];
        _this.defaultItemHistoriaLaboral = { idJefeInmendiato: null, jefeInmediato: 'Seleccionar' };
        _this.confirmActive = false;
        _this.msgs = [];
        _this.dataServiceEmpleado = completerService.remote(_this.urlAutocompleteEmpleado, 'nombreEmpleado', 'nombreEmpleado');
        return _this;
    }
    RegularizarVacacionComponent.prototype.ngOnInit = function () {
    };
    RegularizarVacacionComponent.prototype.onRegistrarVacaciones = function () {
        var _this = this;
        debugger;
        this.agendarVacacion.idEmpleado = this.empleado.idEmpleado;
        this.agendarVacacion.idPeriodoEmpleado = this.agendarVacacionPeriodo.idPeriodoEmpleado;
        this.empleadoService.regularizarVacacion(this.agendarVacacion).subscribe(function (data) {
            _this.confirmActive = false;
            _this.backendService.notification(_this.msgs, data);
            if (data.codigo == 1) {
                setTimeout(function () {
                    _this.location.back();
                }, 2000);
            }
        }, function (error) {
            _this.confirmActive = false;
            _this.backendService.notification(_this.msgs, error);
            console.log(error);
        });
    };
    RegularizarVacacionComponent.prototype.validarRequerido = function () {
        var validacion = false;
        if (this.agendarVacacion.fechaInicio === undefined || this.agendarVacacion.fechaInicio == null || this.agendarVacacion.fechaInicio == '') {
            $('#datepickerDesde').addClass('invalid').removeClass('required');
            $('#datepickerDesde').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }
        if (this.agendarVacacion.fechaFin === undefined || this.agendarVacacion.fechaFin == null || this.agendarVacacion.fechaFin == '') {
            $('#datepickerHasta').addClass('invalid').removeClass('required');
            $('#datepickerHasta').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }
        if (this.agendarVacacion.idAtendidoPor === undefined || this.agendarVacacion.idAtendidoPor == null) {
            $('#jefeInmediato').addClass('invalid').removeClass('required');
            $('#jefeInmediato').parent().addClass('state-error').removeClass('state-success');
            $('#jefeInmediato').css('border', '2px solid red');
            validacion = true;
        }
        return validacion;
    };
    RegularizarVacacionComponent.prototype.obtenerHistoriaLaborales = function (idEmpleado) {
        var _this = this;
        this.permisoService.obtenerHistoriasLaboralesPorEmpleado(idEmpleado).subscribe(function (historiaLaboral) { return _this.saveObtenerHistoriaLaborales(historiaLaboral); }, function (error) { return _this.errorMessage = error; });
    };
    RegularizarVacacionComponent.prototype.saveObtenerHistoriaLaborales = function (historiaLaboral) {
        this.historiasLaboralesActuales = historiaLaboral;
        this.agendarVacacion.idAtendidoPor = this.historiasLaboralesActuales[0].idJefeInmediato;
    };
    RegularizarVacacionComponent.prototype.obtenerHistoriaLaboralActual = function (empleado) {
        var _this = this;
        this.permisoService.obtenerHistoriaLaboralActual(empleado).subscribe(function (historiaLaboral) { return _this.historiaLaboralActual = historiaLaboral; }, function (error) { return _this.errorMessage = error; });
    };
    RegularizarVacacionComponent.prototype.obtenerPeriodoEmpleadoActual = function (empleado) {
        var _this = this;
        this.permisoService.obtenerPeriodoEmpleadoActual(empleado).subscribe(function (periodoEmpleado) { return _this.periodoEmpleadoActual = periodoEmpleado; }, function (error) { return _this.errorMessage = error; });
    };
    RegularizarVacacionComponent.prototype.obtenerDiasDisponibles = function (empleado) {
        var _this = this;
        this.permisoService.obtenerDiasDisponiblesDeVacacion(empleado).subscribe(function (diasDisponibles) { return _this.agendarVacacion.diasVacacionesDisponibles = diasDisponibles.diasVacacionesDisponibles; }, function (error) { return _this.errorMessage = error; });
    };
    RegularizarVacacionComponent.prototype.obtenerPeriodoActual = function (empleado) {
        var _this = this;
        this.permisoService.obtenerPeriodoActual(empleado).subscribe(function (periodoEmpleado) { return _this.agendarVacacionPeriodo = periodoEmpleado; }, function (error) { return _this.errorMessage = error; });
    };
    RegularizarVacacionComponent.prototype.selectEmpleado = function (e) {
        if (e != null) {
            this.agendarVacacion.idEmpleado = e.originalObject.idEmpleado;
            this.empleado.idEmpleado = this.agendarVacacion.idEmpleado;
            this.obtenerHistoriaLaborales(this.empleado.idEmpleado);
            this.obtenerDiasDisponibles(this.empleado);
            this.obtenerPeriodoActual(this.empleado);
        }
        else {
            this.agendarVacacion.idEmpleado = null;
        }
    };
    RegularizarVacacionComponent.prototype.selectJefeInmediato = function (value) {
        $('#jefeInmediato').css('border', 'none');
    };
    RegularizarVacacionComponent.prototype.onChangeFechaInicio = function (value) {
        if (value.type == 'change') {
            return;
        }
        this.agendarVacacion.fechaInicio = value;
        $('#datepickerDesde').removeClass('state-error');
        $('#datepickerDesde').parent().removeClass('state-error');
        if (this.agendarVacacion.fechaFin != null) {
            this.onDiasCalendarios();
        }
    };
    RegularizarVacacionComponent.prototype.onChangeFechaFin = function (value) {
        if (value.type == 'change') {
            return;
        }
        this.agendarVacacion.fechaFin = value;
        $('#datepickerHasta').removeClass('state-error');
        $('#datepickerHasta').parent().removeClass('state-error');
        this.onDiasCalendarios();
    };
    RegularizarVacacionComponent.prototype.onRegresarBusquedaVacaciones = function () {
        this.location.back();
    };
    RegularizarVacacionComponent.prototype.searchDateParameter = function () {
        if (!this.isValidadCharacterDate)
            return;
        if (this.agendarVacacion.fechaInicio == null || this.agendarVacacion.fechaInicio === undefined) {
            this.agendarVacacion.fechaInicio = this.inputDateInicioDatePicker;
        }
        if (this.agendarVacacion.fechaFin == null || this.agendarVacacion.fechaFin === undefined) {
            this.agendarVacacion.fechaFin = this.inputDateFinDatePicker;
        }
        $('#datepickerDesde').removeClass('state-error');
        $('#datepickerDesde').parent().removeClass('state-error');
        if (this.agendarVacacion.fechaFin) {
            this.onDiasCalendarios();
            this.isValidadCharacterDate = false;
            return;
        }
        $('#datepickerHasta').removeClass('state-error');
        $('#datepickerHasta').parent().removeClass('state-error');
        this.isValidadCharacterDate = false;
    };
    RegularizarVacacionComponent.prototype.onDayMommentJS = function () {
        var result = 0;
        var cadenaFInicio = this.agendarVacacion.fechaInicio.split('/');
        var cadenaFFin = this.agendarVacacion.fechaFin.split('/');
        var fechaIni = new Date(parseInt(cadenaFInicio[2]), parseInt(cadenaFInicio[1]) - 1, parseInt(cadenaFInicio[0]));
        var fechaFin = new Date(parseInt(cadenaFFin[2]), parseInt(cadenaFFin[1]) - 1, parseInt(cadenaFFin[0]));
        fechaIni.setHours(0, 0, 0, 1); // Start just after midnight
        fechaFin.setHours(23, 59, 59, 999); // End just before midnight
        var currentDate = fechaIni;
        while (currentDate <= fechaFin) {
            var weekDay = currentDate.getDay();
            if (weekDay != 0 && weekDay != 6)
                result++;
            currentDate.setDate(currentDate.getDate() + 1);
        }
        //console.log('>>>>>>Working day'+result);
        return result;
    };
    RegularizarVacacionComponent.prototype.onDiasCalendarios = function () {
        var cadenaFInicio = this.agendarVacacion.fechaInicio.split('/');
        var cadenaFFin = this.agendarVacacion.fechaFin.split('/');
        var fechaIni = new Date(parseInt(cadenaFInicio[2]), parseInt(cadenaFInicio[1]) - 1, parseInt(cadenaFInicio[0]));
        var fechaFin = new Date(parseInt(cadenaFFin[2]), parseInt(cadenaFFin[1]) - 1, parseInt(cadenaFFin[0]));
        var interval = fechaFin.getTime() - fechaIni.getTime();
        var diasCalendariosVal = interval / (1000 * 60 * 60 * 24);
        var millisecondsPerDay = 86400 * 1000; // Day in milliseconds
        fechaIni.setHours(0, 0, 0, 1); // Start just after midnight
        fechaFin.setHours(23, 59, 59, 999); // End just before midnight
        var diff = fechaFin.getTime() - fechaIni.getTime(); // Milliseconds between datetime objects
        var dias = Math.ceil(diff / millisecondsPerDay);
        this.agendarVacacion.diasCalendarios = dias;
        //console.log('>>>>>>>>DAY CALENDAR'+dias);
        //Dias Habiles
        //Restar dos semanas por cada semana
        var weeks = Math.floor(dias / 7);
        //dias = dias - (weeks * 2);
        dias -= weeks * 2;
        //Manejar casos especiales
        var startDay = fechaIni.getDay();
        var endDay = fechaFin.getDay();
        //Eliminar el fin de semana no eliminado previamente
        if (startDay - endDay > 1)
            //dias = dias -2;
            dias -= 2;
        //Eliminar el dÃ­a de inicio si el perÃ­odo comienza el domingo
        //pero finaliza antes del sÃ¡bado
        if (startDay == 0 && endDay != 6)
            dias = dias - 1;
        //Eliminar el dÃ­a final si el perÃ­odo termina el sÃ¡bado
        //pero empieza despuÃ©s del domingo
        if (endDay == 6 && startDay != 0)
            //dias = dias -1
            dias--;
        // Remove end day if span ends on Saturday but starts after Sunday
        /*if (endDay == 6 && startDay != 0) {
         dias--;
         }*/
        this.agendarVacacion.diasHabiles = dias;
    };
    RegularizarVacacionComponent.prototype.onClose = function () {
        this.closeForm();
    };
    RegularizarVacacionComponent.prototype.onCancel = function (e) {
        e.preventDefault();
        this.closeForm();
    };
    RegularizarVacacionComponent.prototype.closeForm = function () {
        this.confirmActive = false;
        //this.cancel.emit();
    };
    RegularizarVacacionComponent.prototype.showMessage = function () {
        this.validateValuesRequired();
    };
    RegularizarVacacionComponent.prototype.validateValuesRequired = function () {
        if (this.validarRequerido()) {
            this.msgs.push({ severity: 'error', summary: 'Runakuna Error', detail: 'Ingrese los campos obligatorios.' });
            return;
        }
        this.confirmActive = true;
    };
    RegularizarVacacionComponent.prototype.limpiarDatos = function () {
        this.agendarVacacion.idAtendidoPor = null;
        this.agendarVacacion.fechaInicio = undefined;
        this.agendarVacacion.diasCalendarios = null;
        this.agendarVacacion.fechaFin = undefined;
        this.agendarVacacion.diasHabiles = null;
        $('#btnGuardar').prop("disabled", false);
    };
    RegularizarVacacionComponent.prototype.verSolicitudesVacaciones = function () {
        localStorage.setItem('tabActive', 'tab-active-7');
        this._router.navigate(['/autogestion/actualizarDatosPersonales']);
    };
    return RegularizarVacacionComponent;
}(componentBase_1.ComponentBase));
RegularizarVacacionComponent = __decorate([
    core_1.Component({
        selector: 'regularizar-vacacion',
        templateUrl: 'regularizar.vacacion.component.html'
    })
], RegularizarVacacionComponent);
exports.RegularizarVacacionComponent = RegularizarVacacionComponent;
