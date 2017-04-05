import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { Location } from '@angular/common';
import {PermisoService} from "../../+common/service/permiso.service";
import {HistorialLaboral} from "../../+dto/maintenance/historialLaboral";
import {Empleado} from "../../+dto/maintenance/empleado";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {Message} from "primeng/components/common/api";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {HorasExtra} from "../../+dto/maintenance/horasExtra";
import * as moment from 'moment';
import {Http} from "@angular/http";
import {ComponentBase} from "../../+common/service/componentBase";
import {NotificationsService} from "angular2-notifications/src/notifications.service";
import {BackendService} from "../../+rest/backend.service";
import {HorasExtraService} from "../../+common/service/horasExtra.service";

declare var $: any;

@Component({
	selector: 'solicitarHorasExtra',
	templateUrl: 'solicitarHorasExtras.component.html',
	providers: [NotificationsService, HorasExtraService]
})

export class SolicitarHorasExtraComponent extends ComponentBase implements OnInit {

	private historiaLaboralActual: HistorialLaboral = new HistorialLaboral();
	
	private horasExtra: HorasExtra = new HorasExtra();
	private horasExtraAd: HorasExtra = new HorasExtra();

	private infoAdicional: HorasExtra = new HorasExtra();

	private empleado:Empleado = new Empleado();

	private historiasLaboralesActuales: HistorialLaboral[] = [];

	private defaultItemHistoriaLaboral: HistorialLaboral = new HistorialLaboral();

	private idJefeInmediatoDefault:number;
	private fechaDefault:string;

	//notificacion
	msgsNot: Message[] = [];

	private confirmActive=false;
	constructor(public backendService: BackendService, private route:ActivatedRoute,
				private _service: NotificationsService,
				private permisoService:PermisoService,
				private horasExtraService: HorasExtraService,
				private _router: Router,
				private empleadoService: EmpleadoService,
				private location: Location) {
		super(backendService,'AU004');

	this.defaultItemHistoriaLaboral.idJefeInmediato = null;
	this.defaultItemHistoriaLaboral.jefeInmediato = 'Seleccionar';


		this.empleado.idEmpleado = this.currentUser.idEmpleado;

		let idEmpleado = this.currentUser.idEmpleado;

		let fechaAct:Date = new Date();
		let nowFormat = moment(fechaAct).format('DD/MM/YYYY');

		this.horasExtra.fecha = nowFormat;
		this.fechaDefault = this.horasExtra.fecha;

		//calcular is personal de confianza
		this.obtenerEmpleadoEsPersonalConfianza(idEmpleado);
		this.obtenerHistoriaLaborales(idEmpleado);
		this.horasExtra.idEmpleado = this.currentUser.idEmpleado;
		this.obtenerHorasSemanalesPendientes(idEmpleado);
	}

	ngOnInit() {

	}

	obtenerHorasSemanalesPendientes(idEmpleado){
		this.horasExtraService.obtenerHorasSemanalesPendientes(idEmpleado).subscribe(
			horasExtraAd => this.cargarInformacionAdicional(horasExtraAd),
			error =>  this.errorMessage = <any>error);
	}

	obtenerEmpleadoEsPersonalConfianza(idEmpleado){
		this.empleadoService.obtenerEmpleadoEsPersonalConfianza(idEmpleado).subscribe(
			data => {
				this.cargarHorasExtras(data.esPersonalDeConfianza);
			},
			error =>  this.errorMessage = <any>error);
	}

	cargarHorasExtras(esPersonalDeConfianza:boolean){

		if(esPersonalDeConfianza){
			this.msgsNot.push({severity:'warn', summary:'Advertencia', detail:'Como es personal de confianza, no puede solicitar horas extras.'});
			$('#btnGuardar').prop("disabled",true);
			$('#btnNueva').prop("disabled",true);
		}else {
			$('#btnGuardar').prop("disabled",false);
			$('#btnNueva').prop("disabled",false);
		}
	}

	cargarInformacionAdicional(data:HorasExtra){
		this.horasExtra.horaSalidaHorario = data.horaSalidaHorario;
		this.horasExtra.horasNoCompensables = data.horasSemanalesPendientes;
	}

	calcularHoraSalidaSolicitado(){

		if(this.horasExtra.horasAdicionales !=null && this.horasExtra.horasAdicionales != undefined) {

			let horaIni: string[] = this.horasExtra.horaSalidaHorario.split(':');

			let fechaFin: Date = new Date(2017, 0, 1, parseInt(horaIni[0]), parseInt(horaIni[1]));

			fechaFin.setMinutes(fechaFin.getMinutes() + this.horasExtra.horasAdicionales * 60);

			let horaFin: string = this.autocompleteOneZeroLeft(fechaFin.getHours()) + ':' + this.autocompleteOneZeroLeft(fechaFin.getMinutes());

			this.horasExtra.horaSalidaSolicitado = horaFin;

			let horaTotalExtra = this.horasExtra.horasAdicionales - this.horasExtra.horasNoCompensables;

			if(horaTotalExtra <= 0){
				horaTotalExtra = 0;
			}

			this.horasExtra.horas = parseFloat(horaTotalExtra.toFixed(2));

		}
	}

	autocompleteOneZeroLeft(value:number):string{
		let val:string = value.toString();

		if(val.length == 1){
			val = '0' + val;
		}
		return val;
	}

	onRegistrarHorasExtraEmpleado(){
		this.blockedUI  = true;
		this.empleadoService.registrarHorasExtra(this.horasExtra).subscribe(
	      data => {
			  this.confirmActive=false;
			  this.backendService.notification(this.msgs, data);
			  if (data.codigo == 1) {
				  $('#btnGuardar').prop("disabled",true);
			  }
			  this.blockedUI  = false;
	      }, error => {
				this.confirmActive=false;
				this.backendService.notification(this.msgs, error);
				this.blockedUI  = false;
			}

	      );
	}
	
	/* VALIDACIONES */
	validarRequerido():boolean{

	    let validacion = false;

	    if(this.horasExtra.fecha === undefined || this.horasExtra.fecha == null || this.horasExtra.fecha=='' ){
	      $('#fecha').addClass('invalid').removeClass('required');
	      $('#fecha').parent().addClass('state-error').removeClass('state-success');
	      validacion = true;
	    }
	    if(this.horasExtra.horas === undefined || this.horasExtra.horaSalidaSolicitado == null ){
	      $('#horas').addClass('invalid').removeClass('required');
	      $('#horas').parent().addClass('state-error').removeClass('state-success');
	      validacion = true;
	    }
	    if(this.horasExtra.motivo === undefined || this.horasExtra.motivo == null || this.horasExtra.motivo=='' ){
	      $('#motivo').addClass('invalid').removeClass('required');
	      $('#motivo').parent().addClass('state-error').removeClass('state-success');
	      validacion = true;
	    }
	    
	
	    return validacion;
  	}
	validarRequeridoHoraSalida():boolean{
		let validacion = false;
		if(this.horasExtra.fecha === undefined || this.horasExtra.fecha == null || this.horasExtra.fecha=='' ){
			$('#fecha').addClass('invalid').removeClass('required');
			$('#fecha').parent().addClass('state-error').removeClass('state-success');
			validacion = true;
		}
		return validacion;
	}

	/* DETECTED CHANGE */
	onChangeFecha(value){

        this.horasExtra.fecha = value;
        /*$('#fecha').removeClass('state-error');
        $('#fecha').parent().removeClass('state-error');*/
		
  	}
	onChangeMotivo(val){
		/*$('#motivo').removeClass('state-error');
		$('#motivo').parent().removeClass('state-error');*/
		this.horasExtra.motivo = val;
	}
	onChangeHoraSalidaSolicitado(val){

		if(this.validarRequeridoHoraSalida()){
			this.mensaje = 'Ingrese la fecha';
			this.horasExtra.horaSalidaSolicitado = null;
			this._service.error("Error", this.mensaje);
			return;
		}
        this.horasExtra.horaSalidaSolicitado = val;
				
        $('#horaSalidaSolicitado').removeClass('state-error');
        $('#horaSalidaSolicitado').parent().removeClass('state-error');


        this.empleado.fechaIngreso = this.horasExtra.fecha;
		this.obtenerInformacionAdicional(this.empleado);

				
		this.horasExtra.horasSemanalesPendientes = 0;
								
  }
	
	/* SERVICIOS REST */

	private obtenerHistoriaLaborales(idEmpleado: number) {
		this.permisoService.obtenerHistoriasLaboralesPorEmpleado(idEmpleado).subscribe(
			historiaLaboral => this.validateDataJefeInmediato(historiaLaboral),
			error =>  this.errorMessage = <any>error);
	}

	validateDataJefeInmediato(historialLaboral: HistorialLaboral[]){
		if(historialLaboral.length!=0){
			this.historiasLaboralesActuales = historialLaboral;
			if(historialLaboral.length == 1){
				this.horasExtra.idAtendidoPor = historialLaboral[0].idJefeInmediato;
				this.idJefeInmediatoDefault = historialLaboral[0].idJefeInmediato;
			}
		}else{
			this.historiasLaboralesActuales = historialLaboral;
		}
	}

	private obtenerHistoriaLaboralActual(empleado: Empleado) {
      this.permisoService.obtenerHistoriaLaboralActual(empleado).subscribe(
        historiaLaboral => this.historiaLaboralActual = historiaLaboral,
            error =>  this.errorMessage = <any>error);
  }

	private obtenerInformacionAdicional(empleado: Empleado){

			this.permisoService.obtenerInformacionAdicional(this.empleado).subscribe(
        	infoAdicional => {
        		this.getTotalHorasExtras(infoAdicional)
        	},
            error =>  this.errorMessage = <any>error);
	}

	getTotalHorasExtras(infoAdicionalVal:HorasExtra){
		this.horasExtra.horaSalidaHorario = infoAdicionalVal.horaSalidaHorario;


				
				var start = moment.utc(this.horasExtra.horaSalidaHorario, "HH:mm");
				var end = moment.utc(this.horasExtra.horaSalidaSolicitado, "HH:mm");
				
				// account for crossing over to midnight the next day
				if (end.isBefore(start)) end.add(1, 'day');
				
				// calculate the duration
				var d = moment.duration(end.diff(start));
				
				// subtract the lunch break
				d.subtract(30, 'minutes');
				
				var s = moment.utc(+d).format('H.mm');

	}

	
	goBack(): void {
    
        this.location.back();
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


		if(this.horasExtra.horas != null && this.horasExtra.horas == 0){
			this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'No tiene horas extras para solicitar.'});
			return;
		}

		this.confirmActive= true;
	}

	ingresaHoras(){
		$('#horas').parent().removeClass('state-error');
	}

	ingresaMotivo(){
		$('#motivo').parent().removeClass('state-error');
	}

	public limpiarDatos(){
		this.horasExtra.idAtendidoPor=this.idJefeInmediatoDefault;
		this.horasExtra.fecha=this.fechaDefault;
		this.horasExtra.horaSalidaSolicitado=null;
		this.horasExtra.motivo=null;
		//this.horasExtra.horaSalidaHorario=null;
		//this.horasExtra.horasSemanalesPendientes=null;

		this.horasExtra.horas = null;
		this.horasExtra.horasAdicionales=null;

		$('#btnGuardar').prop("disabled",false);

	}
	public verSolicitudesHE() {
		localStorage.setItem('tabActive','tab-active-8');
		this._router.navigate(['/autogestion/actualizarDatosPersonales']);
	}
}