import {Component} from '@angular/core';
import {ComponentBase} from "../../+common/service/componentBase";
import {Http} from "@angular/http";
import {CalendarioResult} from "../../+dto/calendarioResult";
import {CalendarioService} from "../../+common/service/calendario.service";
import {Calendario} from "../../+dto/maintenance/calendario";
import {StoreSessionFilter} from "../../+dto/storeSessionFilter";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {Location} from "@angular/common";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {Router} from "@angular/router";
import {BackendService} from "../../+rest/backend.service";

declare var $: any;

@Component({
    selector: 'administrar-calendario',
    templateUrl: 'administrar.calendario.component.html'
})
export class AdministrarCalendarioComponent extends ComponentBase{

    private calendario: Calendario = new Calendario();
    storeSessionFilter: StoreSessionFilter = new StoreSessionFilter();
    public isCheckedTodoDia:boolean;

    constructor(public backendService: BackendService,
                private empleadoService: EmpleadoService,
                private _router: Router,
                private location: Location,
                private calendarioService: CalendarioService) {

        super(backendService,'OR004');

        this.storeSessionFilter = this.empleadoService.retrieveSessionStorage('editCalendarioResult');
        if(this.storeSessionFilter.isNew == false){
            this.obtenerCalendarioById(this.storeSessionFilter.idTableFilter);
        }else{
            this.calendario = new Calendario();
            this.isCheckedTodoDia = true;
            this.calendario.diaCompleto = true;
        }

    }

    private obtenerCalendarioById(idCalendario: any): void{
        this.calendarioService.obtenerCalendarioById(idCalendario).subscribe(
            data => this.showDetail(data),
            error => this.errorMessage = <any>error
        );
    }
    showDetail(data:Calendario){

        this.calendario = data;
        if(this.calendario.diaCompleto == true){
            this.isCheckedTodoDia = true;
        }
    }

    cambiarDiaCompleto(value){
        let isChecked:boolean = value.target.checked;
        this.isCheckedTodoDia = isChecked;
    }

    onChangeNombre(){
        $('#nombreCalendario').removeClass('state-error');
        $('#nombreCalendario').parent().removeClass('state-error');
        $('#nombreCalendario').css('border','2px solid grey');
    }

    onChangeFecha(value) {
        this.calendario.fecha = value;
        $('#datepickerFecha').removeClass('state-error');
        $('#datepickerFecha').parent().removeClass('state-error');
        $('#datepickerFecha').css('border','2px solid grey');
    }

    onChangeHoraInicio(){
        $('#horaInicio').removeClass('state-error');
        $('#horaInicio').parent().removeClass('state-error');
    }

    onChangeHoraFin(){
        //this.permisoEmpleado.horaFin = value;
        $('#horaFin').removeClass('state-error');
        $('#horaFin').parent().removeClass('state-error');
    }

    onRegresarBusquedaCalendario(){
        this.location.back();
    }

    onGuardarFeriado(){
        if(this.validarRequerido()){
            this.msgs.push({severity: 'error', summary: 'Runakuna Error', detail:'Ingrese los campos obligatorios.'});
            return;
        }
        if(this.calendario.diaCompleto == true){
            this.calendario.horaInicio = '';
            this.calendario.horaFin = '';
        }
        this.calendarioService.registrarCalendarioFeriado(this.calendario).subscribe(
            data => {

                this.backendService.notification(this.msgs, data);

                if (data.codigo == 1) {
                    setTimeout(() => {
                        this.navegarBusquedaCalendario(data);
                    }, 3000);
                }

            },
            error => {
                this.backendService.notification(this.msgs, error);
            }
        );
    }

    navegarBusquedaCalendario(data:NotificacionResult){
        sessionStorage.removeItem('editCalendarioResult');
        this._router.navigate(['/organizacion/busquedaCalendario']);
    }
    private validarRequerido():boolean{
        let validacion = false;
        if(this.calendario.nombre=== undefined || this.calendario.nombre == null || this.calendario.nombre === '' ){
            $('#nombreCalendario').addClass('invalid').removeClass('required');
            $('#nombreCalendario').parent().addClass('state-error').removeClass('state-success');
            $('#nombreCalendario').css('border','2px solid red');
            validacion = true;
        }

        if(this.calendario.fecha=== undefined || this.calendario.fecha == null || this.calendario.fecha === '' ){
            $('#datepickerFecha').addClass('invalid').removeClass('required');
            $('#datepickerFecha').parent().addClass('state-error').removeClass('state-success');
            $('#datepickerFecha').css('border','2px solid red');
            validacion = true;
        }
        return validacion;
    }


}