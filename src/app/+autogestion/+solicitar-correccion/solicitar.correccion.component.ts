import {Component} from '@angular/core';
import { Router } from '@angular/router';
import {Empleado} from "../../+dto/maintenance/empleado";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {Marcacion} from "../../+dto/maintenance/marcacion";
import {SolicitudCambioMarcacion} from "../../+dto/maintenance/solicitudCambioMarcacion";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {NotificationsService} from "angular2-notifications/src/notifications.service";
import {Http} from "@angular/http";
import {ComponentBase} from "../../+common/service/componentBase";
import {BackendService} from "../../+rest/backend.service";

declare var $: any;

@Component({
    selector: 'sa-solicitar-correccion',
    templateUrl: 'solicitar.correccion.component.html',
    providers: [NotificationsService]
})
export class SolicitarCorreccionComponent extends ComponentBase{

    public options = {
        timeOut: 5000,
        lastOnBottom: true,
        clickToClose: true,
        maxLength: 0,
        maxStack: 7,
        showProgressBar: true,
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

    constructor(private _service: NotificationsService,
                public backendService: BackendService,
                private empleadoService:EmpleadoService,
                private _router: Router) {
        super(backendService,'AU001');
        this.empleado.idEmpleado = this.currentUser.idEmpleado;

        this.obtenerMarcacionEmpleado(this.empleado);

    }


    private obtenerMarcacionEmpleado(empleado: Empleado) {
        this.empleadoService.obtenerMarcacionEmpleado(empleado).subscribe(
            marcacion => this.cargarSolicitudCambio(marcacion),
            error =>  this.errorMessage = <any>error);
    }

    public cargarSolicitudCambio(marcacion:Marcacion){
        this.marcacion = marcacion;
        this.solicitudCambioMarcacion.horaIngreso = marcacion.horaIngreso;
        this.solicitudCambioMarcacion.horaInicioAlmuerzo = marcacion.horaInicioAlmuerzo;
        this.solicitudCambioMarcacion.horaFinAlmuerzo = marcacion.horaFinAlmuerzo;
        this.solicitudCambioMarcacion.horaSalida = marcacion.horaSalida;
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

    navegarDashborad(data:NotificacionResult){
        if(data.codigo == 1){
            //this.empleado = new Empleado();
            //this._service.success("Error", 'Ingrese los campos obligatorios.');
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
