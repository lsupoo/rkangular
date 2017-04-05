import {Component, OnInit, ViewChild} from '@angular/core';
import { Location } from '@angular/common';
import {PermisoService} from "../../+common/service/permiso.service";
import {HistorialLaboral} from "../../+dto/maintenance/historialLaboral";
import {Empleado} from "../../+dto/maintenance/empleado";
import {NotificacionResult} from "../../+dto/notificacionResult";

import {EmpleadoService} from "../../+common/service/empleado.service";
import {HorasExtra} from "../../+dto/maintenance/horasExtra";
import {StoreSessionFilter} from "../../+dto/storeSessionFilter";
import {HorasExtraService} from "../../+common/service/horasExtra.service";
import {Http} from "@angular/http";
import {ComponentBase} from "../../+common/service/componentBase";
import {MotivoRechazoHorasExtraComponent} from "./motivoRechazoHorasExtra";
import {Router} from "@angular/router";
import {BackendService} from "../../+rest/backend.service";

declare var $: any;

@Component({
	selector: 'adminHorasExtra',
	templateUrl: 'administrarHorasExtras.component.html'
})

export class AdministrarHorasExtraComponent extends ComponentBase implements OnInit {
	private historiaLaboralActual: HistorialLaboral = new HistorialLaboral();
	private horasExtra: HorasExtra = new HorasExtra();
	private empleado:Empleado = new Empleado();
	authorizedButton : boolean;
	storeSessionFilter: StoreSessionFilter = new StoreSessionFilter();
	@ViewChild(MotivoRechazoHorasExtraComponent) protected motivoRechazoHorasExtraComponent: MotivoRechazoHorasExtraComponent;
	constructor(private permisoService:PermisoService,
				private empleadoService: EmpleadoService,
                public backendService: BackendService,
				private horasExtraService: HorasExtraService,
				private _router: Router,
				private location: Location) {
		super(backendService,'GT006');
		this.storeSessionFilter = this.empleadoService.retrieveSessionStorage('editHorasExtraResult');
		if(this.storeSessionFilter.isNew == false){
			this.obtenerHorasExtraById(this.storeSessionFilter.idTableFilter);
		}

	}

	private obtenerHorasExtraById(idHorasExtra: any): void{
		this.horasExtraService.obtenerHorasExtraById(idHorasExtra).subscribe(
			data => this.showDetail(data),
			error => this.errorMessage = <any>error
		);
	}
	showDetail(data:HorasExtra){

		this.horasExtra = data;

		this.horasExtra.horasAdicionales = this.horasExtra.horasNoCompensables + parseFloat(this.horasExtra.horas.toString());

		this.empleado.idEmpleado = this.horasExtra.idEmpleado;
		this.obtenerHistoriaLaboralActual(this.empleado);

		if(this.horasExtra.idAtendidoPor!=null && this.horasExtra.idAtendidoPor == this.currentUser.idEmpleado && this.horasExtra.estado=='P'){
			this.authorizedButton = true;
		}

	}

	ngOnInit() {

	}

	onRegresarBusquedaVacaciones(){
		this.location.back();
	}

	onEliminarHorasExtraEmpleado(){

        this.empleadoService.eliminarHorasExtraEmpleado(this.horasExtra.idHorasExtra).subscribe(
			data => {

				this.backendService.notification(this.msgs, data);

				if (data.codigo == 1) {
					setTimeout(() => {
						this.navegarBusquedaHorasExtra(data);
					}, 3000);
				}

			},
			error => {
				this.backendService.notification(this.msgs, error);
			}
        );
	}
	onRegresarBusquedaHorasExtra(){
		this.location.back();
	}
	onAprobarHorasExtraEmpleado(){
		this.empleadoService.aprobarHorasExtraEmpleado(this.horasExtra).subscribe(
			data => {

				this.backendService.notification(this.msgs, data);

				if (data.codigo == 1) {
					setTimeout(() => {
						this.navegarBusquedaHorasExtra(data);
					}, 3000);
				}

			},
			error => {
				this.backendService.notification(this.msgs, error);
			}
        );
	}
	onRechazarHorasExtraEmpleado(){
		this.empleadoService.rechazarHorasExtraEmpleado(this.horasExtra).subscribe(
			data => {

				this.backendService.notification(this.msgs, data);

				if (data.codigo == 1) {
					setTimeout(() => {
						this.navegarBusquedaHorasExtra(data);
					}, 3000);
				}

			},
			error => {
				this.backendService.notification(this.msgs, error);
			}
        );
	}

	
	/* SERVICIOS REST */
	private obtenerHistoriaLaboralActual(empleado: Empleado) {
        this.permisoService.obtenerHistoriaLaboralActual(empleado).subscribe(
        historiaLaboral => this.historiaLaboralActual = historiaLaboral,
            error =>  this.errorMessage = <any>error);
    }

	goBack(): void {
    
        this.location.back();
    }


  /* NOTIFICATION */
	navegarBusquedaHorasExtra(data:NotificacionResult){
  		this._router.navigate(['/gestionTiempo/busquedaHorasExtras']);
  }

	public cargarMotivoRechazo(): void {
		this.motivoRechazoHorasExtraComponent.titulo="Denegacion"
		this.motivoRechazoHorasExtraComponent.dataItem=this.horasExtra;
		this.motivoRechazoHorasExtraComponent.onShow();

	}
}