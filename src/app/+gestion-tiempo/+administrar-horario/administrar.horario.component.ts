import {Component, OnInit,ViewChild} from '@angular/core';
import { Observable } from 'rxjs/Rx';
import {Router, ActivatedRoute} from "@angular/router";
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {NotificacionResult} from "../../+dto/NotificacionResult";
import {HorarioDia} from "../../+dto/maintenance/horarioDia";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {Horario} from "../../+dto/maintenance/horario";
import {HorarioDiaDialogFormComponent} from "./horario.dia.dialog.component";
import {NotificationsService} from "angular2-notifications/src/notifications.service";
import {HorarioService} from "../../+common/service/horario.service";
import {StorageResult} from "../../+dto/storageResult";
import {ProyectoCombo} from "../../+dto/proyectoCombo";
import {ComponentBase} from "../../+common/service/componentBase";
import {Http} from "@angular/http";
import {BackendService} from "../../+rest/backend.service";


declare var $: any;

@Component({
    selector: 'sa-administrar-horario',
    templateUrl: 'administrar.horario.component.html',
    providers: [ HorarioService]
})
export class AdministrarHorarioComponent extends ComponentBase {

    public defaultItem:TablaGeneralResult={codigo:null,nombre:'Seleccionar', grupo:null};

    public defaultItemProyecto: ProyectoCombo = {idProyecto: null, idDepartamentoArea:null, nombre: 'Seleccionar'};

    errorMessage:string;

    public mensaje:string;

    public horarioDias:HorarioDia[]=[];

    public proyecto: ProyectoCombo[];

    public estados:TablaGeneralResult[];

    public tiposHorario:TablaGeneralResult[];

    public horario:Horario=new Horario();

    public isEmpresa:boolean=true;
    public isEdit:boolean=false;
    public classEdit:string='input';

    //NotificacionResult
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

    public storageCommomnValueResult: StorageResult = new StorageResult();

    constructor(private empleadoService: EmpleadoService,
                private horarioService: HorarioService,
                public backendService: BackendService,
                private route:ActivatedRoute, private _router: Router) {

        super(backendService, 'GT004');

        this.storageCommomnValueResult = JSON.parse(localStorage.getItem('localStorageCommonsValues'));

        this.getTiposHorario();

        this.getEstados();

        let isNewHorario:boolean = this.empleadoService.retrieveSessionStorage('isNewHorario');

        if(isNewHorario){

            this.horarioDias= [new HorarioDia(-1,'LU','Lunes','Si',1,'08:00','17:30'),
                new HorarioDia(-2,'MA','Martes','Si',1,'08:00','17:30'),
                new HorarioDia(-3,'MI','Miercoles','Si',1,'08:00','17:30'),
                new HorarioDia(-4,'JU','Jueves','Si',1,'08:00','17:30'),
                new HorarioDia(-5,'VI','Viernes','Si',1,'08:00','17:30'),
                new HorarioDia(-6,'SA','Sabado','No',null,null,null),
                new HorarioDia(-7,'DO','Domingo','No',null,null,null)];
            this.isEdit = false;
            this.classEdit = 'input';
            this.horario.horasSemanal=48;

        }else{
            let idHorario:number = this.empleadoService.retrieveSessionStorage('idHorario');

            this.obtenerProyectos();

            this.obtenerHorarioDiaPorHorario(idHorario);
            this.obtenerhorario(idHorario);
            this.isEdit = true;
            this.isEmpresa = true;
            this.classEdit = 'input state-disabled';
        }


    }

    onChangeTipoHorario(value){
        if(value== 'PR'){
            this.isEmpresa = false;
            this.obtenerProyectos();
        }else{
            this.isEmpresa = true;
            this.horario.idProyecto = null;
            this.proyecto = [];
        }

    }

    private obtenerhorario(idHorario: number){
        this.horarioService.obtenerHorario(idHorario).subscribe(
            data => this.horario = data,
            error => this.errorMessage = <any>error
        );
    }

    private obtenerHorarioDiaPorHorario(idHorario:number){
        this.horarioService.obtenerHorarioDiaPorHorario(idHorario).subscribe(
            horario => this.horarioDias = horario,
            error =>  this.errorMessage = <any>error);
    }

    private getTiposHorario() {
        this.tiposHorario = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Horario.TipoHorario' === grupo.grupo);
    }

    private obtenerProyectos() {
        this.proyecto = this.storageCommomnValueResult.proyecto;
    }


    private getEstados() {
        this.estados = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Estado' === grupo.grupo);
    }

    validarRequerido(){
        let validacion = false;

        if(this.horario.nombre === undefined || this.horario.nombre == null || this.horario.nombre=='' ){
            $('#nombreHorario').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }
        if(this.horario.horasSemanal === undefined || this.horario.horasSemanal == null){
            $('#horasSemana').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        if(this.horario.tipoHorario === undefined || this.horario.tipoHorario == null){

            validacion = true;
        }

        if(this.horario.estado === undefined || this.horario.estado == null){

            validacion = true;
        }

        return validacion;
    }

    ingresaNombreHorario(){
        $('#nombreHorario').parent().removeClass('state-error');
    }

    ingresaHorasSemanal(){
        $('#horasSemana').parent().removeClass('state-error');
    }

    onRegistrarHorario(){

        this.horario.horarioDias = this.horarioDias;

        this.currentUser  = JSON.parse(sessionStorage.getItem("authenticatedUser"));
        this.horario.idEmpresa=this.currentUser.idEmpresa;

        //this.horario.idEmpresa = 4;

        //validar
        if(this.validarRequerido()){
            this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'Ingrese los campos obligatorios.'});
            return;
        }

        if(this.horario.tipoHorario == 'PR'){
            if(this.horario.idProyecto === undefined || this.horario.idProyecto == null){
                this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'Seleccione el proyecto.'});
                return;
            }
        }


        this.horarioService.registrarHorario(this.horario).subscribe(
            data => {

                this.backendService.notification(this.msgs, data);

                if (data.codigo == 1) {
                    setTimeout(() => {
                        this.navegarBusquedaHorario(data);
                    }, 3000);
                }

            },
            error => {
                this.backendService.notification(this.msgs, error);
            }
        );


    }

    navegarBusquedaHorario(data:NotificacionResult){
        this.empleadoService.storeSessionStorage('idHorario',undefined);
        this._router.navigate(['/gestionTiempo/busquedaHorarios']);

    }

    onRegresarBusquedaHorario(){
        this.empleadoService.storeSessionStorage('idHorario',undefined);
        this._router.navigate(['/gestionTiempo/busquedaHorarios']);
    }
    cerrarDialog(){
        this.mensaje = '';
        $( '#dialog-message' ).dialog( "close" );
    }

    public dataItemHorarioDia: HorarioDia;

    @ViewChild(HorarioDiaDialogFormComponent) protected editHorarioDiaFormComponent: HorarioDiaDialogFormComponent;

    public onEditarHorarioDia(dataItem: any): void {
        this.editHorarioDiaFormComponent.tituloCabecera = "Editar Horario Dia";

        this.dataItemHorarioDia = dataItem;

        this.editHorarioDiaFormComponent.diaSemana = this.dataItemHorarioDia.diaSemana;
        this.editHorarioDiaFormComponent.nombreDiaSemana = this.dataItemHorarioDia.nombreDiaSemana;
        this.editHorarioDiaFormComponent.entrada = this.dataItemHorarioDia.entrada;
        this.editHorarioDiaFormComponent.salida = this.dataItemHorarioDia.salida;
        this.editHorarioDiaFormComponent.laboral = this.dataItemHorarioDia.laboral;
        this.editHorarioDiaFormComponent.tiempoAlmuerzo = this.dataItemHorarioDia.tiempoAlmuerzo;

    }

    public onCancelarHorarioDia(): void {
        this.dataItemHorarioDia = undefined;
    }

    public onAgregarHorarioDia(dto: HorarioDia): void {
        this.editarHorarioDia(dto);
        this.calculateHorasCubiertas();
    }

    public calculateHorasCubiertas() {
        var horasCubiertasAcumuladas =parseInt('0');
        var minutosCubiertasAcumuladas =parseInt('0');
        for(var i=0;i<this.horarioDias.length;i++) {
            if (this.horarioDias[i]!=null && this.horarioDias[i].salida!=null) {
                var salida = this.horarioDias[i].salida.split(':');
                var salidaHora = parseInt(salida[0]);
                var salidaMinutos = parseInt(salida[1]);
                var entrada = this.horarioDias[i].entrada.split(':');
                var entradaHora = parseInt(entrada[0]);
                var entradaMinutos = parseInt(entrada[1]);
                horasCubiertasAcumuladas = horasCubiertasAcumuladas + (salidaHora - entradaHora-this.horarioDias[i].tiempoAlmuerzo);
                minutosCubiertasAcumuladas = minutosCubiertasAcumuladas + Math.abs(salidaMinutos - entradaMinutos);
            }
        }
        horasCubiertasAcumuladas=horasCubiertasAcumuladas+minutosCubiertasAcumuladas/60;
        //minutosCubiertasAcumuladas=minutosCubiertasAcumuladas%60;

        //this.horario.horasCubiertas=horasCubiertasAcumuladas.toString()+":"+minutosCubiertasAcumuladas.toString();
        this.horario.horasCubiertas=horasCubiertasAcumuladas.toString();

    }


    public editarHorarioDia(data: HorarioDia): Observable<HorarioDia[]> {
        return this.fetchHorarioDia("update", data);
    }

    private fetchHorarioDia(action: string = "", data?: HorarioDia): Observable<HorarioDia[]>  {

        if(action=="update"){
            var indice = this.horarioDias.indexOf(data);
            if(indice>=0)
                this.horarioDias[indice]  = (JSON.parse(JSON.stringify(data)));
        }else if(action=="destroy"){
            var indice = this.horarioDias.indexOf(data);

            if(indice>=0)
                this.horarioDias.splice(indice, 1);

        }

        return Observable.of(this.horarioDias);
    }


}