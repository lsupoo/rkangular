import {Component} from '@angular/core';
import { Router } from '@angular/router';
import {LocalStorageGlobal} from "../../+dto/localStorageDto";
import {Empleado} from "../../+dto/maintenance/empleado";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {Marcacion} from "../../+dto/maintenance/marcacion";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {NotificationsService} from "angular2-notifications/src/notifications.service";
import {SolicitudCambioMarcacion} from "../../+dto/maintenance/solicitudCambioMarcacion";
import {ComponentBase} from "../../+common/service/componentBase";
import {Http} from "@angular/http";
import {StoreSessionFilter} from "../../+dto/storeSessionFilter";
import {BackendService} from "../../+rest/backend.service";

declare var $: any;

@Component({
    selector: 'sa-administrar-marcacion',
    templateUrl: 'administrar.marcacion.component.html',
    providers: [NotificationsService]
})
export class AdministrarMarcacionComponent extends ComponentBase {

    public options = {
        timeOut: 2500,
        lastOnBottom: true,
        clickToClose: true,
        maxLength: 0,
        maxStack: 7,
        showProgressBar: false,
        pauseOnHover: true,
        preventDuplicates: false,
        preventLastDuplicates: 'visible',
        rtl: false,
        animate: 'scale',
        position: ['right', 'top']
    };

    public empleado:Empleado=new Empleado();

    public marcacion:Marcacion= new Marcacion();

    public solicitudCambioMarcacion:SolicitudCambioMarcacion= new SolicitudCambioMarcacion();

    public isCheckedHoraIngreso:boolean=false;
    public isCheckedHoraIniAlmuerzo:boolean=false;
    public isCheckedHoraFinAlmuerzo:boolean=false;
    public isCheckedHoraSalida:boolean=false;
    storeSessionFilter: StoreSessionFilter = new StoreSessionFilter();

    //localStorageValue: LocalStorageGlobal = new LocalStorageGlobal();

    public tieneSolicitud:boolean=false;


    constructor(private _service: NotificationsService,
                public backendService: BackendService,
                private empleadoService:EmpleadoService,
                private _router: Router) {
        super(backendService,'GT005');

        let isNewMarcacion:boolean = this.empleadoService.retrieveSessionStorage('isNewMarcacion');
        if(isNewMarcacion){

        }else{
            let idMarcacion:number = this.empleadoService.retrieveSessionStorage('idMarcacion');
            this.obtenerSolicitudCambioMarcacion(idMarcacion);
        }



    }


    private obtenerSolicitudCambioMarcacion(idMarcacion: number) {

        this.empleadoService.obtenerSolicitudCambioMarcacion(idMarcacion).subscribe(
            solicitud => this.cargarSolicitudCambio(solicitud,),
            error =>  this.errorMessage = <any>error);
    }

    public cargarSolicitudCambio(solicitud:SolicitudCambioMarcacion){

        this.marcacion = solicitud.marcacion;

        //if(solicitud.tieneSolicitudCambio){

            if(solicitud.estado == 'P') {

                this.tieneSolicitud = solicitud.tieneSolicitudCambio;
                this.solicitudCambioMarcacion.idSolicitudCambioMarcacion = solicitud.idSolicitudCambioMarcacion;
                this.solicitudCambioMarcacion.horaIngreso = solicitud.horaIngreso;
                this.solicitudCambioMarcacion.horaInicioAlmuerzo = solicitud.horaInicioAlmuerzo;
                this.solicitudCambioMarcacion.horaFinAlmuerzo = solicitud.horaFinAlmuerzo;
                this.solicitudCambioMarcacion.horaSalida = solicitud.horaSalida;
            }
            else{

                //this.tieneSolicitud = false;
            }
        //}else{
            this.tieneSolicitud = solicitud.tieneSolicitudCambio;
            this.solicitudCambioMarcacion.idSolicitudCambioMarcacion = undefined;
            this.solicitudCambioMarcacion.horaIngreso = solicitud.marcacion.horaIngreso;
            this.solicitudCambioMarcacion.horaInicioAlmuerzo = solicitud.marcacion.horaInicioAlmuerzo;
            this.solicitudCambioMarcacion.horaFinAlmuerzo = solicitud.marcacion.horaFinAlmuerzo;
            this.solicitudCambioMarcacion.horaSalida = solicitud.marcacion.horaSalida;
        //}



    }

    onRegresarBusquedaMarcacion(){
        this._router.navigate(['/gestionTiempo/busquedaMarcaciones']);
    }

    private onRegistrarSolicitudCorreccionMarcacion(){
        this.solicitudCambioMarcacion.marcacion = this.marcacion;

        this.empleadoService.registrarCorreccionMarcacion(this.solicitudCambioMarcacion).subscribe(
            data => {
                this.navegarDashborad(data);
            },
            error => error
        );
    }

    private onAprobarSolicitudCorreccionMarcacion(){
        this.solicitudCambioMarcacion.marcacion = this.marcacion;

        this.empleadoService.aprobarCorreccionMarcacion(this.solicitudCambioMarcacion).subscribe(
            data => {
                this.navegarDashborad(data);
            },
            error => error
        );
    }

    private onRechazarSolicitudCorreccionMarcacion(){
        this.solicitudCambioMarcacion.marcacion = this.marcacion;

        this.empleadoService.rechazarCorreccionMarcacion(this.solicitudCambioMarcacion).subscribe(
            data => {
                this.navegarDashborad(data);
            },
            error => error
        );
    }

    navegarDashborad(data:NotificacionResult){
        if(data.codigo == 1){
            this._router.navigate(['/dashboard/analytics']);
        }
        else if(data.codigo == 0){
            this._service.error("Error", data.mensaje);
        }

    }

    cambiarHoraIngreso(value){
        let isChecked:boolean = value.target.checked;
        this.isCheckedHoraIngreso = isChecked;
    }

    cambiarHoraIniAlmuerzo(value){
        let isChecked:boolean = value.target.checked;
        this.isCheckedHoraIniAlmuerzo = isChecked;
    }

    cambiarHoraFinAlmuerzo(value){
        let isChecked:boolean = value.target.checked;
        this.isCheckedHoraFinAlmuerzo = isChecked;
    }

    cambiarHoraSalida(value){
        let isChecked:boolean = value.target.checked;
        this.isCheckedHoraSalida = isChecked;
    }

    onChangeHoraIngreso(value){
        this.solicitudCambioMarcacion.horaIngreso = value;
    }

    onChangeHoraInicioAlmuerzo(value){
        this.solicitudCambioMarcacion.horaInicioAlmuerzo = value;
    }

    onChangeHoraFinAlmuerzo(value){
        this.solicitudCambioMarcacion.horaFinAlmuerzo = value;
    }

    onChangeHoraSalida(value){
        this.solicitudCambioMarcacion.horaSalida = value;
    }

}
