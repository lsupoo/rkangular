/**
 * Created by javier.cuicapuza on 1/3/2017.
 */
import {Component, OnInit, EventEmitter,Output} from '@angular/core';
import { Location } from '@angular/common';
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {LocalStorageGlobal} from "../../+dto/localStorageDto";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {CompleterData, CompleterService} from "ng2-completer";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {NotificationsService} from "angular2-notifications/src/notifications.service";
import {CargoService} from "../../+common/service/cargo.service";
import {EnumRolEmpleado} from "../../+enums/enumRolEmpleado";
import {Alerta} from "../../+dto/maintenance/alerta";
import {AlertaSubscriptor} from "../../+dto/maintenance/alertaSubscriptor";
import {StoreSessionFilter} from "../../+dto/storeSessionFilter";
import {StorageResult} from "../../+dto/storageResult";
import {ComponentBase} from "../../+common/service/componentBase";
import {Http} from "@angular/http";
import {BackendService} from "../../+rest/backend.service";
import {Router} from "@angular/router";

declare var $: any;

@Component({
    selector: 'administrar-alertas',
    templateUrl: 'administrar.alertas.component.html',
    providers: []
})
export class AdministrarAlertasComponent extends ComponentBase implements OnInit {

    @Output() save: EventEmitter<any> = new EventEmitter();
    //notificacion
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
    //Combos
    //public storageCommomnValueResult: StorageResult = new StorageResult();
    public tipoNotificacion:TablaGeneralResult[];
    public tipoAlerta:TablaGeneralResult[];
    public estados:TablaGeneralResult[];
    public estadosSelect: TablaGeneralResult;
    public defaultItemTipoAlerta: TablaGeneralResult = {codigo: null, nombre: 'Todos',grupo: null};
    public defaultItemTipoNotificacion: TablaGeneralResult = {codigo: null, nombre: 'Todos',grupo: null};
    public defaultItemEstados: TablaGeneralResult = {codigo: null, nombre: 'Todos',grupo: null};
    private dataServiceEmpleado:CompleterData;
    storeSessionFilter: StoreSessionFilter = new StoreSessionFilter();

    localhost:  String = environment.backend;
    port: String = environment.port;
    alerta: Alerta = new Alerta();
    alertaSubscriptor: AlertaSubscriptor = new AlertaSubscriptor();
    private view: Array<AlertaSubscriptor>=[];

    constructor(public backendService: BackendService,
                private empleadoService: EmpleadoService,
                private completerService: CompleterService,
                private _router: Router,
                private location: Location) {
        super(backendService,'MA003');
        this.getTipoNotificacion();
        this.getTipoAlerta();
        this.getEstados();
        //this.storageCommomnValueResult = JSON.parse(localStorage.getItem('localStorageCommonsValues'));

        this.dataServiceEmpleado = completerService.remote(this.urlAutocompleteEmpleado,'nombreEmpleado','nombreEmpleado');

        this.storeSessionFilter = this.empleadoService.retrieveSessionStorage('editAlertaResult');
        if(this.storeSessionFilter.isNew == false){
            this.obtenerAlertaById(this.storeSessionFilter.idTableFilter);

            //this.view = this.alerta.subscriptores;
        }
    }

    private obtenerAlertaById(idAlerta: any): void{
        this.empleadoService.obtenerAlertaById(idAlerta).subscribe(
            data => this.showDetail(data),
            error => this.errorMessage = <any>error
        );
    }

    ngOnInit() {

    }

    onRegresarBusquedaAlertas(){
        this.location.back();
    }
    onGuardarAlertas(){
        if(this.validarRequerido()){

            this.msgs.push({severity: 'error', summary: 'Runakuna Error', detail:'Ingrese los campos obligatorios.'});
            return;
        }
        /*if(this.validarSubscriptorRequerido()){
         this._service.error("Error", 'AÃ±adir un subscriptor.');
         return;
         }*/
        this.alerta.subscriptores = this.view;
        this.empleadoService.guardarAlerta(this.alerta).subscribe(
            data => {

                this.backendService.notification(this.msgs, data);

                if (data.codigo == 1) {
                    setTimeout(() => {
                        this.navegarBusquedaAlertas(data);
                    }, 3000);
                }
            },
            error => {

                this.backendService.notification(this.msgs, error);
            }

        );
    }
    showDetail(data:Alerta){
        this.alerta = data;

        if (data.subscriptores!= undefined && data.subscriptores.length>0) {
            this.view = data.subscriptores;
        }
    }
    navegarBusquedaAlertas(data:NotificacionResult){

        //this.goBack();
        this._router.navigate(['/mantenimientos/busquedaAlertas']);

    }
    private validarRequerido():boolean{
        let validacion = false;
        if(this.alerta.codigoEstado=== undefined || this.alerta.codigoEstado == null || this.estados === undefined || this.estados == null){
            $('#estados').addClass('invalid').removeClass('required');
            $('#estados').parent().addClass('state-error').removeClass('state-success');
            $('#estados').css('border','2px solid red');
            validacion = true;
        }
        return validacion;
    }
    private validarSubscriptorRequerido():boolean{
        let validacion = false;
        if(this.view === undefined || this.view == null || this.view.length <= 0){
            validacion = true;
        }
        return validacion;
    }
    goBack(): void {
        this.location.back();
    }

    selectEmpleado(e){
        if(e !=null)
            this.alertaSubscriptor.idEmpleado = e.originalObject.idEmpleado;
        else
            this.alertaSubscriptor.idEmpleado = null;
    }
    public changeEstado(value): void {
        let estadoVal: any = value;
        this.alerta.codigoEstado = estadoVal;
        $('#estados').css('border','none');

    }
    public changeTipoNotificacion(value): void {
        let tipoNotificacionVal: any = value;
        this.alerta.tipoNotificacion = tipoNotificacionVal;
        $('#tipoNotificacion').css('border','none');

    }
    public changeTipoAlerta(value): void {
        let tipoAlertaVal: any = value;
        this.alerta.tipoAlerta = tipoAlertaVal;
        $('#tipoAlerta').css('border','none');

    }
    /* CARGA GRILLA*/
    /*private getSubscriptores(){
     this.empleadoService.buscarSubscriptoresAlertas(this.alerta).subscribe(
     data => {
     this.view = data;
     },
     error => this.errorMessage = <any>error
     );
     }*/
    onAgregarSubscriptor(e){

        e.preventDefault();
        this.save.emit(this.alertaSubscriptor);
        this.crearSubscriptor(this.alertaSubscriptor);
        this.alerta.nombreEmpleado = undefined;
    }
    public crearSubscriptor(data: AlertaSubscriptor): Observable<AlertaSubscriptor[]> {
        return this.fetch("create", data);
    }
    public onDelete(e: AlertaSubscriptor): void {
        const operation = this.eliminarSubscriptor(e);
    }
    public eliminarSubscriptor(data: AlertaSubscriptor): Observable<AlertaSubscriptor[]> {
        return this.fetch("destroy", data);
    }

    private fetch(action: string = "", data?: AlertaSubscriptor): Observable<AlertaSubscriptor[]>  {
        if(action=="create"){
            var alertaSubscriptor : AlertaSubscriptor = (JSON.parse(JSON.stringify(data)));
            this.view.push(alertaSubscriptor);
        }else if(action=="update"){
            var indice = this.view.indexOf(data);
            if(indice>=0)
                this.view[indice]  = (JSON.parse(JSON.stringify(data)));
        }else if(action=="destroy"){
            var indice = this.view.indexOf(data);

            if(indice>=0)
                this.view.splice(indice, 1);

        }

        return Observable.of(this.view);
    }

    /* CARGAR COMBO*/
    private getTipoNotificacion() {
        this.tipoNotificacion = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Alerta.TipoNotificacion' === grupo.grupo);
    }
    private getTipoAlerta() {
        this.tipoAlerta = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Alerta.Tipo' === grupo.grupo);
    }
    private getEstados() {
        this.estados = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Estado' === grupo.grupo);
    }
}