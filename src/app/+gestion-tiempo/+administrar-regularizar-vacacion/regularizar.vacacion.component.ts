import { Component, OnInit } from '@angular/core';
import {PermisoService} from "../../+common/service/permiso.service";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {HistorialLaboral} from "../../+dto/maintenance/historialLaboral";
import {PeriodoEmpleado} from "../../+dto/maintenance/periodoEmpleado";
import {Empleado} from "../../+dto/maintenance/empleado";
import {Vacacion} from "../../+dto/maintenance/vacacion";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {ComponentBase} from "../../+common/service/componentBase";
import {Http} from "@angular/http";
import {NotificationsService} from "angular2-notifications/src/notifications.service";
import {Router} from "@angular/router";
import {ExpressionRegularValidate} from "../../+common/Utils/expressionRegularValidate";
import {Message} from "primeng/components/common/api";
import {BackendService} from "../../+rest/backend.service";
import {CompleterData, CompleterService} from "ng2-completer";
import {Location} from "@angular/common";

declare var $: any;

@Component({
	selector: 'regularizar-vacacion',
	templateUrl: 'regularizar.vacacion.component.html'
})

export class RegularizarVacacionComponent extends ComponentBase implements OnInit {
	private historiaLaboralActual: HistorialLaboral = new HistorialLaboral();
	private periodoEmpleadoActual: PeriodoEmpleado = new PeriodoEmpleado();
	private agendarVacacion: Vacacion = new Vacacion();
	private agendarVacacionPeriodo: Vacacion = new Vacacion();
	private empleado:Empleado = new Empleado();

	private historiasLaboralesActuales: HistorialLaboral[] = [];

	private defaultItemHistoriaLaboral: any = {idJefeInmendiato:null, jefeInmediato:'Seleccionar'};

	private confirmActive=false;
	msgs: Message[] = [];

	private dataServiceEmpleado:CompleterData;

	constructor(public backendService: BackendService,
				private _router: Router,
				private permisoService:PermisoService,
				private empleadoService: EmpleadoService,
				private completerService: CompleterService,
				private location: Location) {
		super(backendService,'GT002');
		this.dataServiceEmpleado = completerService.remote(this.urlAutocompleteEmpleado,'nombreEmpleado','nombreEmpleado');

	}

	ngOnInit() {

	}
	onRegistrarVacaciones(){

		this.agendarVacacion.idEmpleado = this.empleado.idEmpleado;
		this.agendarVacacion.idPeriodoEmpleado = this.agendarVacacionPeriodo.idPeriodoEmpleado;
		this.empleadoService.regularizarVacacion(this.agendarVacacion).subscribe(
			data => {
				this.confirmActive=false;
				this.backendService.notification(this.msgs, data);
				if (data.codigo == 1) {
					setTimeout(() => {
						this.location.back();
					}, 2000);
				}
			},
			error => {
				this.confirmActive=false;
				this.backendService.notification(this.msgs, error);
			}
		);
	}

	validarRequerido():boolean{

		let validacion = false;
		if(this.agendarVacacion.fechaInicio === undefined || this.agendarVacacion.fechaInicio == null || this.agendarVacacion.fechaInicio=='' ){
			$('#datepickerDesde').addClass('invalid').removeClass('required');
			$('#datepickerDesde').parent().addClass('state-error').removeClass('state-success');
			validacion = true;
		}
		if(this.agendarVacacion.fechaFin === undefined || this.agendarVacacion.fechaFin == null || this.agendarVacacion.fechaFin=='' ){
			$('#datepickerHasta').addClass('invalid').removeClass('required');
			$('#datepickerHasta').parent().addClass('state-error').removeClass('state-success');
			validacion = true;
		}
		if(this.agendarVacacion.idAtendidoPor=== undefined || this.agendarVacacion.idAtendidoPor == null ){
			$('#jefeInmediato').addClass('invalid').removeClass('required');
			$('#jefeInmediato').parent().addClass('state-error').removeClass('state-success');
			$('#jefeInmediato').css('border','2px solid red');
			validacion = true;
		}


		return validacion;
	}

	private obtenerHistoriaLaborales(idEmpleado: number) {
		this.permisoService.obtenerHistoriasLaboralesPorEmpleado(idEmpleado).subscribe(
			historiaLaboral => this.saveObtenerHistoriaLaborales(historiaLaboral),
			error =>  this.errorMessage = <any>error);
	}

	private saveObtenerHistoriaLaborales(historiaLaboral: HistorialLaboral[]){
		this.historiasLaboralesActuales = historiaLaboral;
		this.agendarVacacion.idAtendidoPor = this.historiasLaboralesActuales[0].idJefeInmediato;
	}

	private obtenerHistoriaLaboralActual(empleado: Empleado) {
		this.permisoService.obtenerHistoriaLaboralActual(empleado).subscribe(
			historiaLaboral => this.historiaLaboralActual = historiaLaboral,
			error =>  this.errorMessage = <any>error);
	}
	private obtenerPeriodoEmpleadoActual(empleado: Empleado) {
		this.permisoService.obtenerPeriodoEmpleadoActual(empleado).subscribe(
			periodoEmpleado => this.periodoEmpleadoActual = periodoEmpleado,
			error =>  this.errorMessage = <any>error);
	}

	private obtenerDiasDisponibles(empleado: Empleado) {
		this.permisoService.obtenerDiasDisponiblesDeVacacion(empleado).subscribe(
			diasDisponibles => this.agendarVacacion.diasVacacionesDisponibles = diasDisponibles.diasVacacionesDisponibles,
			error =>  this.errorMessage = <any>error);
	}

	private obtenerPeriodoActual(empleado: Empleado) {
		this.permisoService.obtenerPeriodoActual(empleado).subscribe(
			periodoEmpleado => this.agendarVacacionPeriodo = periodoEmpleado,
			error =>  this.errorMessage = <any>error);
	}

	selectEmpleado(e){
		if(e !=null){
			this.agendarVacacion.idEmpleado = e.originalObject.idEmpleado;
			this.empleado.idEmpleado = this.agendarVacacion.idEmpleado;

			this.obtenerHistoriaLaborales(this.empleado.idEmpleado);
			this.obtenerDiasDisponibles(this.empleado);
			this.obtenerPeriodoActual(this.empleado);
		} else{
			this.agendarVacacion.idEmpleado = null;
		}
	}

	selectJefeInmediato(value){
		$('#jefeInmediato').css('border','none');
	}

	onChangeFechaInicio(value){
		if(value.type == 'change'){
			return;
		}
		this.agendarVacacion.fechaInicio = value;
		$('#datepickerDesde').removeClass('state-error');
		$('#datepickerDesde').parent().removeClass('state-error');
		if(this.agendarVacacion.fechaFin != null){
			this.onDiasCalendarios();
		}

	}
	onChangeFechaFin(value){
		if(value.type == 'change'){
			return;
		}
		this.agendarVacacion.fechaFin = value;
		$('#datepickerHasta').removeClass('state-error');
		$('#datepickerHasta').parent().removeClass('state-error');
		this.onDiasCalendarios();

	}

	onRegresarBusquedaVacaciones(){
		this.location.back();
	}

	searchDateParameter(){

		if (!this.isValidadCharacterDate)
			return;
		if(this.agendarVacacion.fechaInicio == null || this.agendarVacacion.fechaInicio === undefined){
			this.agendarVacacion.fechaInicio = this.inputDateInicioDatePicker;
		}if(this.agendarVacacion.fechaFin == null || this.agendarVacacion.fechaFin === undefined){
			this.agendarVacacion.fechaFin = this.inputDateFinDatePicker;
		}
		$('#datepickerDesde').removeClass('state-error');
		$('#datepickerDesde').parent().removeClass('state-error');
		if(this.agendarVacacion.fechaFin){
			this.onDiasCalendarios();
			this.isValidadCharacterDate = false;
			return;
		}
		$('#datepickerHasta').removeClass('state-error');
		$('#datepickerHasta').parent().removeClass('state-error');

		this.isValidadCharacterDate = false;
	}

	onDayMommentJS(){
		var result = 0;

		let cadenaFInicio:string[] = this.agendarVacacion.fechaInicio.split('/');
		let cadenaFFin:string[] = this.agendarVacacion.fechaFin.split('/');

		let fechaIni:Date= new Date( parseInt(cadenaFInicio[2]),parseInt(cadenaFInicio[1])-1,parseInt(cadenaFInicio[0]));

		let fechaFin:Date= new Date( parseInt(cadenaFFin[2]),parseInt(cadenaFFin[1])-1,parseInt(cadenaFFin[0]));

		fechaIni.setHours(0,0,0,1);  // Start just after midnight
		fechaFin.setHours(23,59,59,999);  // End just before midnight

		var currentDate = fechaIni;
		while (currentDate <= fechaFin)  {

			var weekDay = currentDate.getDay();
			if(weekDay != 0 && weekDay != 6)
				result++;

			currentDate.setDate(currentDate.getDate()+1);
		}
		return result;
	}


	onDiasCalendarios(){

		let cadenaFInicio:string[] = this.agendarVacacion.fechaInicio.split('/');
		let cadenaFFin:string[] = this.agendarVacacion.fechaFin.split('/');

		let fechaIni:Date= new Date( parseInt(cadenaFInicio[2]),parseInt(cadenaFInicio[1])-1,parseInt(cadenaFInicio[0]));

		let fechaFin:Date= new Date( parseInt(cadenaFFin[2]),parseInt(cadenaFFin[1])-1,parseInt(cadenaFFin[0]));

		let interval= fechaFin.getTime()- fechaIni.getTime();

		let diasCalendariosVal:number = interval / (1000 * 60 * 60 * 24);


		let millisecondsPerDay = 86400 * 1000; // Day in milliseconds
		fechaIni.setHours(0,0,0,1);  // Start just after midnight
		fechaFin.setHours(23,59,59,999);  // End just before midnight
		let diff = fechaFin.getTime() - fechaIni.getTime();  // Milliseconds between datetime objects
		let dias = Math.ceil(diff / millisecondsPerDay);

		this.agendarVacacion.diasCalendarios = dias;

		//Dias Habiles
		//Restar dos semanas por cada semana
		let weeks = Math.floor(dias / 7);

		//dias = dias - (weeks * 2);
		dias -= weeks * 2;

		//Manejar casos especiales
		let startDay = fechaIni.getDay();
		let endDay = fechaFin.getDay();
		//Eliminar el fin de semana no eliminado previamente
		if(startDay - endDay > 1)
		//dias = dias -2;
			dias -= 2;

		//Eliminar el dÃ­a de inicio si el perÃ­odo comienza el domingo
		//pero finaliza antes del sÃ¡bado
		if(startDay == 0 && endDay != 6)
			dias = dias -1;

		//Eliminar el dÃ­a final si el perÃ­odo termina el sÃ¡bado
		//pero empieza despuÃ©s del domingo
		if(endDay == 6 && startDay != 0)
		//dias = dias -1
			dias--;
		// Remove end day if span ends on Saturday but starts after Sunday
		/*if (endDay == 6 && startDay != 0) {
		 dias--;
		 }*/

		this.agendarVacacion.diasHabiles = dias;
	}


	public onClose() {
		this.closeForm();
	}
	public onCancel(e) {
		e.preventDefault();
		this.closeForm();
	}
	public closeForm(){
		this.confirmActive= false;
		//this.cancel.emit();
	}
	public showMessage(){
		this.validateValuesRequired();
	}

	private validateValuesRequired(){
		if(this.validarRequerido()){
			this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'Ingrese los campos obligatorios.'});
			return;
		}
		this.confirmActive= true;
	}

	public limpiarDatos(){
		this.agendarVacacion.idAtendidoPor=null;
		this.agendarVacacion.fechaInicio=undefined;
		this.agendarVacacion.diasCalendarios=null;
		this.agendarVacacion.fechaFin=undefined;
		this.agendarVacacion.diasHabiles=null;

		$('#btnGuardar').prop("disabled",false);

	}

	public verSolicitudesVacaciones() {
		localStorage.setItem('tabActive','tab-active-7');
		this._router.navigate(['/autogestion/actualizarDatosPersonales']);
	}
}