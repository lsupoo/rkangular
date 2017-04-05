/**
 * Created by javier.cuicapuza on 1/3/2017.
 */
import {Component, OnInit, EventEmitter,Output} from '@angular/core';
import { Location } from '@angular/common';
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {CompleterData} from "ng2-completer";
import {environment} from "../../../environments/environment";
import {NotificationsService} from "angular2-notifications/src/notifications.service";
import {AlertaSubscriptor} from "../../+dto/maintenance/alertaSubscriptor";
import {StoreSessionFilter} from "../../+dto/storeSessionFilter";
import {StorageResult} from "../../+dto/storageResult";
import {TipoLicencia} from "../../+dto/maintenance/tipoLicencia";
import {TipoLicenciaService} from "../../+common/service/tipolicencia.service";
import {ComponentBase} from "../../+common/service/componentBase";
import {Http} from "@angular/http";
import {BackendService} from "../../+rest/backend.service";
import {Router} from "@angular/router";

declare var $: any;

@Component({
    selector: 'administrar-tiposlicencias',
    templateUrl: 'administrar.tiposlicencias.component.html',
    providers: [NotificationsService]
})
export class AdministrarTiposLicenciasComponent extends ComponentBase implements OnInit {

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
    public estados:TablaGeneralResult[];
    public estadosSelect: TablaGeneralResult;
    public defaultItemEstados: TablaGeneralResult = {codigo: null, nombre: 'Seleccionar'};
    errorMessage: string;
    public mensaje:string;
    private dataServiceEmpleado:CompleterData;

    storeSessionFilter: StoreSessionFilter = new StoreSessionFilter();

    localhost:  String = environment.backend;
    port: String = environment.port;
    tipoLicencia: TipoLicencia = new TipoLicencia();

    private view: Array<AlertaSubscriptor>=[];

    constructor(private _service: NotificationsService,
                private empleadoService: EmpleadoService,
                public backendService: BackendService,
                private _router: Router,
                private location: Location,
                private tipoLicenciaService: TipoLicenciaService ) {

        super(backendService,'MA005');
        //this.storageCommomnValueResult = JSON.parse(localStorage.getItem('localStorageCommonsValues'));
        this.getEstados();

        this.storeSessionFilter = this.empleadoService.retrieveSessionStorage('editTipoLicenciaResult');
        if(this.storeSessionFilter.isNew == false){
            this.obtenerTipoLicenciaDetalle(this.storeSessionFilter.idTableFilter);
            //this.view = this.alerta.subscriptores;
        }
    }

    private obtenerTipoLicenciaDetalle(idTipoLicencia: any): void{
        this.tipoLicenciaService.obtenerTipoLicenciaDetalle(idTipoLicencia).subscribe(
            data => this.showDetail(data),
            error => this.errorMessage = <any>error
        );
    }

    ngOnInit() {

    }

    onRegresarBusquedaTiposLicencias(){
        this.location.back();
    }
    onGuardarTiposLicencias(){
        if(this.validarRequerido()){
            this._service.error("Error", 'Ingrese el campos obligatorio.');
            return;
        }
        if(this.tipoLicencia.activaParaESS==undefined || this.tipoLicencia.activaParaESS==null){
            this.tipoLicencia.activaParaESS=false;
        }
        //this.alerta.subscriptores = this.view;
        this.tipoLicenciaService.registrarTipoLicencia(this.tipoLicencia).subscribe(
            data => {
                this.backendService.notification(this.msgs, data);
                setTimeout(() => {
                this.navegarDashboard(data);
                }, 3000);
            },
            error => {
                this.backendService.notification(this.msgs, error);
            }

        );
    }
    showDetail(data:TipoLicencia){
        this.tipoLicencia= data;
        //this.view = data.subscriptores;
    }
    navegarDashboard(data:NotificacionResult){

        if(data.codigo == 1){
            this.mensaje = data.mensaje;
            this._service.success("Correcto", this.mensaje);
            this.tipoLicencia = new TipoLicencia();
            //this.goBack();
            this._router.navigate(['/mantenimientos/busquedaTiposLicencias']);
        }

        else if(data.codigo == 0){
            this.mensaje = data.mensaje;
            this._service.error("Error", this.mensaje);

        }

    }
    private validarRequerido():boolean{
        let validacion = false;
        if(this.tipoLicencia.estado=== undefined || this.tipoLicencia.estado == null || this.estados === undefined || this.estados == null){
            $('#estados').addClass('invalid').removeClass('required');
            $('#estados').parent().addClass('state-error').removeClass('state-success');
            $('#estados').css('border','2px solid red');
            validacion = true;
        }

        if(this.tipoLicencia.nombre=== undefined || this.tipoLicencia.nombre == null || this.tipoLicencia.nombre == ''){
            $('#nombre').addClass('invalid').removeClass('required');
            $('#nombre').parent().addClass('state-error').removeClass('state-success');
            $('#nombre').css('border','2px solid red');
            validacion = true;
        }

        if(this.tipoLicencia.codigo=== undefined || this.tipoLicencia.codigo == null || this.tipoLicencia.codigo == ''){
            $('#codigo').addClass('invalid').removeClass('required');
            $('#codigo').parent().addClass('state-error').removeClass('state-success');
            $('#codigo').css('border','2px solid red');
            validacion = true;
        }
        return validacion;
    }

    goBack(): void {
        this.location.back();
    }


    public changeEstado(value): void {
        let estadoVal: any = value;
        this.tipoLicencia.estado = estadoVal;
        $('#estados').css('border','none');
    }

    /* CARGA GRILLA*/

    /* CARGAR COMBO*/

    private getEstados() {
        this.estados = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Estado' === grupo.grupo);
        this.tipoLicencia.estado='A';
    }
}