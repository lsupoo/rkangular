import {Component, OnInit} from "@angular/core";

import {Router} from "@angular/router";

import {EmpleadoService} from "../../+common/service/empleado.service";
import {ComponentBase} from "../../+common/service/componentBase";
import {Http} from "@angular/http";
import {CompensacionService} from "../../+common/service/compensacion.service";
import {NotificationsService} from "angular2-notifications/src/notifications.service";
import {HorasExtra} from "../../+dto/maintenance/horasExtra";
import {Compensacion} from "../../+dto/maintenance/compensacion";
import {HorasExtraService} from "../../+common/service/horasExtra.service";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {Message} from "primeng/primeng";
import {BackendService} from "../../+rest/backend.service";

declare var $: any;

@Component({
    selector: 'recuperar-horas',
    templateUrl: 'recuperar.horas.component.html',
    providers : [CompensacionService,NotificationsService,HorasExtraService]
})
export class RecuperarHorasComponent extends ComponentBase {

    public idEmpleado:number;

    public compensacion:Compensacion = new Compensacion();

    public horasExtra: HorasExtra = new HorasExtra();

    public fecha : Date = new Date();

    msgs: Message[] = [];

    es:any  = {firstDayOfWeek: 1,
        dayNames:["Domingo","Lunes","Martes","Miercoles","Jueves","Viernes","Sabado"],
        dayNamesShort:["Dom","Lun","Mar","Mie","Jue","Vie","Sab"],
        dayNamesMin:["Do","Lu","Ma","Mi","Ju","Vi","Sa"],
        monthNames:["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Setiembre","Octubre","Noviembre","Diciembre"],
        monthNamesShort:["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Set","Oct","Nov","Dic"]
    };

    constructor(private empleadoService: EmpleadoService,
                private _router: Router,
                public backendService: BackendService,
                private compensacionService : CompensacionService,
                private horasExtraService : HorasExtraService){

        super(backendService,'OR005');

        let isNewEmpresa:boolean = this.empleadoService.retrieveSessionStorage('isNewCompensacion');
        if(isNewEmpresa){

        }else{

            this.idEmpleado = this.currentUser.idEmpleado;
            let idEmpleadoCompensacion:number = this.empleadoService.retrieveSessionStorage('idEmpleadoCompensacion');
            this.obtenerCompensacion(idEmpleadoCompensacion);
        }

    }

    private obtenerCompensacion(idEmpleadoCompensacion:number){
        this.compensacionService.obtenerCompensacion(idEmpleadoCompensacion).subscribe(
            data => this.cargarCompensacion(data),
            error => this.errorMessage = <any>error
        );
    }

    private cargarCompensacion(data:Compensacion){
        this.compensacion = data;
    }

    private onRegresarBusquedaCompensacion(){
        this.empleadoService.storeSessionStorage('isNewCompensacion',true);
        this.empleadoService.storeSessionStorage('idEmpleadoCompensacion',undefined);
        this._router.navigate(['/gestionTiempo/busquedaCompensacion']);
    }

    private onRegistrarRecuperacionHoras(){
        this.horasExtra.tipo = 'RH';
        this.horasExtra.estado = 'A';
        this.horasExtra.idAtendidoPor = this.idEmpleado;
        this.horasExtra.idEmpleado = this.compensacion.idEmpleado;

        let cadena:string[] = this.horasExtra.fecha.split('/');
        let horaIni:string[] = this.horasExtra.horaSalidaHorario.split(':');
        let horaFin:string[] = this.horasExtra.horaSalidaSolicitado.split(':');

        let fechaIni:Date= new Date( parseInt(cadena[2]),parseInt(cadena[1])-1,parseInt(cadena[0]),parseInt(horaIni[0]),parseInt(horaIni[1]));

        let fechaFin:Date= new Date( parseInt(cadena[2]),parseInt(cadena[1])-1,parseInt(cadena[0]),parseInt(horaFin[0]),parseInt(horaFin[1]));

        let fechaPerm:Date= new Date( parseInt(cadena[2]),parseInt(cadena[1])-1,parseInt(cadena[0]));


        /*if(fechaPerm<fechaAct){
            this.msgs.push({severity:'error', summary:'La fecha del permiso debe ser mayor o igual a la fecha de hoy.', detail:'Runakuna Error'});
            return;
        }

        if(fechaFin.getTime()<fechaIni.getTime()){
            this.msgs.push({severity:'error', summary:'La hora final del permiso debe ser mayor a la hora inicial del permiso.', detail:'Runakuna Error'});
            return;
        }*/

        let interval= fechaFin.getTime()- fechaIni.getTime();
        let hours:number = interval / (1000*60*60);
        //this.horasExtra.horas = parseFloat(hours.toFixed(2)).toString();

        this.horasExtra.horas = hours;

        this.horasExtraService.recuperarHoras(this.horasExtra).subscribe(
            data => {
                this.navegarBusquedaCompensacion(data);
            },
            error => error
        );
    }

    navegarBusquedaCompensacion(data:NotificacionResult){
        if(data.codigo == 1){
            this.horasExtra = new HorasExtra();
            this.empleadoService.storeSessionStorage('isNewCompensacion',true);
            this.empleadoService.storeSessionStorage('idEmpleadoCompensacion',undefined);
            this._router.navigate(['/gestionTiempo/busquedaCompensacion']);
        }
        else if(data.codigo == 0){
            this.msgs.push({severity:'error', summary:data.mensaje, detail:'Runakuna Error'});
        }

    }

    onChangeFecha(value){
        this.horasExtra.fecha = value;
    }





}