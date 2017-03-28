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
import {TipoLicencia} from "../../+dto/maintenance/tipoLicencia";
import {TipoLicenciaService} from "../../+common/service/tipolicencia.service";
import {CentroCosto} from "../../+dto/maintenance/centroCosto";
import {CentroCostoService} from "../../+common/service/centrocosto.service";
import {UnidadDeNegocioCombo} from "../../+dto/unidadDeNegocioCombo";
import {DepartamentoAreaCombo} from "../../+dto/departamentoAreaCombo";
import {ComponentBase} from "../../+common/service/componentBase";
import {Http} from "@angular/http";
import {BackendService} from "../../+rest/backend.service";

declare var $: any;

@Component({
    selector: 'administrar-centrocosto',
    templateUrl: 'administrar.centrocosto.component.html',
    providers: []
})
export class AdministrarCentroCostoComponent extends  ComponentBase implements OnInit {

    @Output() save: EventEmitter<any> = new EventEmitter();

    public estados:TablaGeneralResult[];
    public estadosSelect: TablaGeneralResult;
    public defaultItem: UnidadDeNegocioCombo = {idUnidadDeNegocio: null, nombre: 'Todos'};
    public defaultItemEstados: TablaGeneralResult = {codigo: null, nombre: 'Todos',grupo:null};
    public defaultItemDepartamento: DepartamentoAreaCombo = {idDepartamentoArea: null,idUnidadDeNegocio: null, nombre: 'Todos'};

    public undnegocios: UnidadDeNegocioCombo[];
    public departamentos: DepartamentoAreaCombo[];
    public unidadNegocioSelect: UnidadDeNegocioCombo;
    public departamentoSelect: DepartamentoAreaCombo;

    storeSessionFilter: StoreSessionFilter = new StoreSessionFilter();

    localhost:  String = environment.backend;
    port: String = environment.port;
    centroCosto: CentroCosto = new CentroCosto();



    constructor(public backendService: BackendService,
                private empleadoService: EmpleadoService,
                private completerService: CompleterService,
                private location: Location,
                private centroCostoService: CentroCostoService ) {

        super(backendService,'OR006');
        this.getEstados();
        this.getUndNegocio();
        //this.obtenerDepartamentos();

        //this.dataServiceEmpleado = completerService.remote(this.urlAutocompleteEmpleado,'nombreEmpleado','nombreEmpleado');
        this.storeSessionFilter = this.empleadoService.retrieveSessionStorage('editCentroCostoResult');
        if(this.storeSessionFilter!=null && this.storeSessionFilter.isNew == false){
            this.obtenerCentroCostoDetalle(this.storeSessionFilter.idTableFilter);
            //this.view = this.alerta.subscriptores;
        }
    }

    private obtenerCentroCostoDetalle(idCentroCosto: any): void{
        this.centroCostoService.obtenerCentroCostoDetalle(idCentroCosto).subscribe(
            data => this.showDetail(data),
            error => this.errorMessage = <any>error
        );
    }

    ngOnInit() {

    }

    onRegresarBusquedaCentrosCostos(){
        this.location.back();
    }
    onGuardarCentroCosto(){
        if(this.validarRequerido()){
            this.msgs.push({severity: 'error', summary: 'Runakuna Error', detail:'Ingrese los campos obligatorios.'});
            return;
        }

        //this.alerta.subscriptores = this.view;

        this.centroCosto.idEmpresa = this.currentUser.idEmpresa;

        this.centroCostoService.registrarCentroCosto(this.centroCosto).subscribe(
            data => {

                this.backendService.notification(this.msgs, data);

                if (data.codigo == 1) {
                    setTimeout(() => {
                        this.navegarBusquedaCentroCosto(data);
                    }, 3000);
                }

            },
            error => {

                this.backendService.notification(this.msgs, error);
            }

        );
    }
    showDetail(data:CentroCosto){
        this.centroCosto= data;
        if(this.unidadNegocioSelect==null || this.unidadNegocioSelect==undefined){
            this.unidadNegocioSelect=new UnidadDeNegocioCombo();
        }
        if(this.departamentoSelect==null || this.departamentoSelect==undefined){
            this.departamentoSelect=new DepartamentoAreaCombo();
        }
        this.unidadNegocioSelect.idUnidadDeNegocio=data.idUnidadDeNegocio;

        this.obtenerDepartamentos(this.unidadNegocioSelect.idUnidadDeNegocio);
        this.departamentoSelect.idDepartamentoArea=data.idDepartamentoArea;
        //this.view = data.subscriptores;
    }
    navegarBusquedaCentroCosto(data:NotificacionResult){
        this.goBack();

    }
    private validarRequerido():boolean{
        let validacion = false;
        if(this.centroCosto.estado=== undefined || this.centroCosto.estado == null || this.estados === undefined || this.estados == null){
            $('#estados').addClass('invalid').removeClass('required');
            $('#estados').parent().addClass('state-error').removeClass('state-success');
            $('#estados').css('border','2px solid red');
            validacion = true;
        }
        return validacion;
    }

    goBack(): void {
        this.location.back();
    }


    public changeEstado(value): void {
        let estadoVal: any = value;
        this.centroCosto.estado = estadoVal;
        $('#estados').css('border','none');
    }

    public changeDpto(value): void {
        let dptoVal: any = value.idDepartamentoArea;
        this.centroCosto.idDepartamentoArea = dptoVal;

    }

    /* CARGA GRILLA*/

    /* CARGAR COMBO*/

    private getEstados() {
        this.estados = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Estado' === grupo.grupo);
    }
    private getUndNegocio() {
        this.undnegocios = this.storageCommomnValueResult.unidadDeNegocio;
    }

    private obtenerDepartamentos(idUndNegocio: number) {
        this.departamentos = this.storageCommomnValueResult.departamentoArea.filter(depa => idUndNegocio === depa.idUnidadDeNegocio);
    }

    actualizarDpto(value): void {
        let codigo: any = value.idUnidadDeNegocio;
        this.departamentoSelect = this.defaultItemDepartamento;
        if(value == null){
            this.departamentos = null;
        }else {
            this.obtenerDepartamentos(codigo);
        }
        this.centroCosto.idUnidadDeNegocio=codigo;
        //this.isEnableProyectos = true;

    }

}