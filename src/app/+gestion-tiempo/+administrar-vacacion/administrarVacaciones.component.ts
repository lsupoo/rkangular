import {Component, OnInit, ViewChild} from '@angular/core';
import { Location } from '@angular/common';
import {PermisoService} from "../../+common/service/permiso.service";
import {HistorialLaboral} from "../../+dto/maintenance/historialLaboral";
import {PeriodoEmpleado} from "../../+dto/maintenance/periodoEmpleado";
import {Empleado} from "../../+dto/maintenance/empleado";
import {Vacacion} from "../../+dto/maintenance/vacacion";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {LocalStorageGlobal} from "../../+dto/localStorageDto";
import {EnumEstados} from "../../+enums/EnumEstados";
import {EnumRolEmpleado} from "../../+enums/EnumRolEmpleado";
import {StoreSessionFilter} from "../../+dto/storeSessionFilter";
import {VacacionService} from "../../+common/service/vacacion.service";
import {Http} from "@angular/http";
import {ComponentBase} from "../../+common/service/componentBase";
import {Router} from "@angular/router";
import {MotivoRechazoVacacionComponent} from "./motivoRechazoVacacion";
import {MotivoDevolucionVacacionComponent} from "./motivoDevolucionVacacion";
import {BackendService} from "../../+rest/backend.service";

declare var $: any;

@Component({
	selector: 'administrar-vacacioneses',
	templateUrl: 'administrarVacaciones.component.html',
	providers: []
})

export class AdministrarVacacionesComponent extends ComponentBase implements OnInit {

	private historiaLaboralActual: HistorialLaboral = new HistorialLaboral();
	private periodoEmpleadoActual: PeriodoEmpleado = new PeriodoEmpleado();
	private adminVacaciones: Vacacion = new Vacacion();
	private diasDisponiblesVacacion: Vacacion = new Vacacion();
	private adminVacacionesPeriodo: Vacacion = new Vacacion();
	private empleado:Empleado = new Empleado();

	storeSessionFilter: StoreSessionFilter = new StoreSessionFilter();
	@ViewChild(MotivoDevolucionVacacionComponent) protected motivoDevolucionComponent: MotivoDevolucionVacacionComponent;
	@ViewChild(MotivoRechazoVacacionComponent) protected motivoRechazoComponent: MotivoRechazoVacacionComponent;
	constructor(private permisoService:PermisoService,
				private vacacionService:VacacionService,
				private empleadoService: EmpleadoService,
                public backendService: BackendService,
				private _router: Router,
				private location: Location) {

		super(backendService,'GT002');

		this.storeSessionFilter = this.empleadoService.retrieveSessionStorage('editVacacionResult');

		if(this.storeSessionFilter.isNew == false){
			this.obtenerVacacionById(this.storeSessionFilter.idTableFilter);
		}


	}
	private obtenerVacacionById(idVacacion: any): void{
		this.vacacionService.obtenerVacacionById(idVacacion).subscribe(
			data => this.showDetail(data),
			error => this.errorMessage = <any>error
		);
	}
	showDetail(data:Vacacion){
		this.adminVacaciones = data;

		this.empleado.idEmpleado = this.adminVacaciones.idEmpleado;
		this.obtenerHistoriaLaboralActual(this.empleado);
		this.obtenerDiasDisponibles(this.empleado);
		this.obtenerPeriodoActual(this.empleado);
	}

	ngOnInit() {

	}
	onRegistrarVacaciones(){

	    if(this.validarRequerido()){
			this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'Ingrese los campos obligatorios.'});
	      	return;
		}

		this.adminVacaciones.idEmpleado = this.empleado.idEmpleado;
		this.empleadoService.registrarVacaciones(this.adminVacaciones).subscribe(
			data => {

				this.backendService.notification(this.msgs, data);

				if (data.codigo == 1) {
					setTimeout(() => {
						this.navegarBusquedaVacaciones(data);
					}, 3000);
				}

			},
			error => {
				this.backendService.notification(this.msgs, error);
			}
	      );
	}
	onRegresarBusquedaVacaciones(){
		this.location.back();
	}
	onActualizarVacacionEmpleado(){

	    if(this.validarRequerido()){
			this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'Ingrese los campos obligatorios.'});
	      	return;
		}
		this.adminVacaciones.idEmpleado = this.empleado.idEmpleado;
		this.adminVacaciones.diasVacacionesDisponibles = this.diasDisponiblesVacacion.diasVacacionesDisponibles;
		this.empleadoService.actualizarVacacionEmpleado(this.adminVacaciones).subscribe(
			data => {

				this.backendService.notification(this.msgs, data);

				if (data.codigo == 1) {
					setTimeout(() => {
						this.navegarBusquedaVacaciones(data);
					}, 3000);
				}

			},
			error => {
				this.backendService.notification(this.msgs, error);
			}
		);
	}
	onEnviarVacacionEmpleado(){
		this.empleadoService.enviarVacacionEmpleado(this.adminVacaciones).subscribe(
			data => {

				this.backendService.notification(this.msgs, data);

				if (data.codigo == 1) {
					setTimeout(() => {
						this.navegarBusquedaVacaciones(data);
					}, 3000);
				}

			},
			error => {
				this.backendService.notification(this.msgs, error);
			}
        );
	}
	onEliminarVacacionEmpleado(){

        this.empleadoService.eliminarVacacionEmpleado(this.adminVacaciones).subscribe(
			data => {

				this.backendService.notification(this.msgs, data);

				if (data.codigo == 1) {
					setTimeout(() => {
						this.navegarBusquedaVacaciones(data);
					}, 3000);
				}

			},
			error => {
				this.backendService.notification(this.msgs, error);
			}
        );
	}
	onDevolverVacacionEmpleado(){
		this.empleadoService.devolverVacacionEmpleado(this.adminVacaciones).subscribe(
			data => {

				this.backendService.notification(this.msgs, data);

				if (data.codigo == 1) {
					setTimeout(() => {
						this.navegarBusquedaVacaciones(data);
					}, 3000);
				}

			},
			error => {
				this.backendService.notification(this.msgs, error);
			}
        );
	}
	onAprobarVacacionEmpleado(){
		this.empleadoService.aprobarVacacionEmpleado(this.adminVacaciones).subscribe(
			data => {

				this.backendService.notification(this.msgs, data);

				if (data.codigo == 1) {
					setTimeout(() => {
						this.navegarBusquedaVacaciones(data);
					}, 3000);
				}

			},
			error => {
				this.backendService.notification(this.msgs, error);
			}
        );
	}
	onRechazarVacacionEmpleado(){
		this.empleadoService.rechazarVacacionEmpleado(this.adminVacaciones).subscribe(
			data => {

				this.backendService.notification(this.msgs, data);

				if (data.codigo == 1) {
					setTimeout(() => {
						this.navegarBusquedaVacaciones(data);
					}, 3000);
				}

			},
			error => {
				this.backendService.notification(this.msgs, error);
			}
        );
	}

	/* VALIDACIONES */
	validarRequerido():boolean{

	    let validacion = false;
	    if(this.adminVacaciones.fechaInicio === undefined || this.adminVacaciones.fechaInicio == null || this.adminVacaciones.fechaInicio=='' ){
	      $('#fechaInicio').addClass('invalid').removeClass('required');
	      $('#fechaInicio').parent().addClass('state-error').removeClass('state-success');
	      validacion = true;
	    }
	    if(this.adminVacaciones.fechaFin === undefined || this.adminVacaciones.fechaFin == null || this.adminVacaciones.fechaFin=='' ){
	      $('#fechaFin').addClass('invalid').removeClass('required');
	      $('#fechaFin').parent().addClass('state-error').removeClass('state-success');
	      validacion = true;
	    }
	    
	
	    return validacion;
  	}
	
	/* SERVICIOS REST */
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
            diasDisponibles => this.diasDisponiblesVacacion = diasDisponibles,
            error =>  this.errorMessage = <any>error);
	}

	private obtenerPeriodoActual(empleado: Empleado) {
		this.permisoService.obtenerPeriodoActual(empleado).subscribe(
            periodoEmpleado => this.adminVacacionesPeriodo = periodoEmpleado,
            error =>  this.errorMessage = <any>error);
	}

	/* DETECTED CHANGE */
	onChangeFechaInicio(value){
        this.adminVacaciones.fechaInicio = value;
        $('#fechaInicio').removeClass('state-error');
        $('#fechaInicio').parent().removeClass('state-error');
		if(this.adminVacaciones.fechaFin != null){
			this.onDiasCalendarios();	
		}
		
    }
	onChangeFechaFin(value){
        this.adminVacaciones.fechaFin = value;
        $('#fechaFin').removeClass('state-error');
        $('#fechaFin').parent().removeClass('state-error');
		this.onDiasCalendarios();
		
    }
	goBack(): void {
    
        this.location.back();
    }

	/* METHOD CALCULATE BUSINESS DAY AND WORKING DAY */
	onDayMommentJS(){
		var result = 0;

	    let cadenaFInicio:string[] = this.adminVacaciones.fechaInicio.split('/');
	    let cadenaFFin:string[] = this.adminVacaciones.fechaFin.split('/');
	
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

    let cadenaFInicio:string[] = this.adminVacaciones.fechaInicio.split('/');
    let cadenaFFin:string[] = this.adminVacaciones.fechaFin.split('/');

    let fechaIni:Date= new Date( parseInt(cadenaFInicio[2]),parseInt(cadenaFInicio[1])-1,parseInt(cadenaFInicio[0]));

    let fechaFin:Date= new Date( parseInt(cadenaFFin[2]),parseInt(cadenaFFin[1])-1,parseInt(cadenaFFin[0]));
    
    let interval= fechaFin.getTime()- fechaIni.getTime();

    let diasCalendariosVal:number = interval / (1000 * 60 * 60 * 24);
    
    
      let millisecondsPerDay = 86400 * 1000; // Day in milliseconds
      fechaIni.setHours(0,0,0,1);  // Start just after midnight
      fechaFin.setHours(23,59,59,999);  // End just before midnight
      let diff = fechaFin.getTime() - fechaIni.getTime();  // Milliseconds between datetime objects    
      let dias = Math.ceil(diff / millisecondsPerDay);
	
	this.adminVacaciones.diasCalendarios = dias;

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
    
    //Eliminar el día de inicio si el período comienza el domingo 
    //pero finaliza antes del sábado
    if(startDay == 0 && endDay != 6)
      dias = dias -1;
    
    //Eliminar el día final si el período termina el sábado
    //pero empieza después del domingo
    if(endDay == 6 && startDay != 0)
      //dias = dias -1
	  dias--;
	// Remove end day if span ends on Saturday but starts after Sunday
    /*if (endDay == 6 && startDay != 0) {
        dias--;
    }*/

    this.adminVacaciones.diasHabiles = dias;
  }

  /* NOTIFICATION */


	navegarBusquedaVacaciones(data:NotificacionResult){
        this._router.navigate(['/gestionTiempo/busquedaVacaciones']);
  }
	public cargarMotivoDevolucion(): void {
		this.motivoDevolucionComponent.titulo="Devolucion"
		this.motivoDevolucionComponent.dataItem=this.adminVacaciones;
		this.motivoDevolucionComponent.onShow();

	}

	public cargarMotivoRechazo(): void {
		this.motivoRechazoComponent.titulo="Denegacion"
		this.motivoRechazoComponent.dataItem=this.adminVacaciones;
		this.motivoRechazoComponent.onShow();

	}
}