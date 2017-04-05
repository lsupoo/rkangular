/**
 * Created by javier.cuicapuza on 12/27/2016.
 */
import {Component, OnInit, EventEmitter,Output} from '@angular/core';
import { Location } from '@angular/common';
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {NotificacionResult} from "../../+dto/NotificacionResult";
import {LocalStorageGlobal} from "../../+dto/localStorageDto";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {CompleterData, CompleterService} from "ng2-completer";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {NotificationsService} from "angular2-notifications/src/notifications.service";
import {CargoService} from "../../+common/service/cargo.service";
import {UnidadDeNegocioCombo} from "../../+dto/unidadDeNegocioCombo";
import {DepartamentoAreaCombo} from "../../+dto/departamentoAreaCombo";
import {EnumRolEmpleado} from "../../+enums/enumRolEmpleado";
import {ReporteMarcacionSubscriptor} from "../../+dto/maintenance/ReporteMarcacionSubscriptor";
import {ReporteMarcacion} from "../../+dto/maintenance/reporteMarcacion";
import {StoreSessionFilter} from "../../+dto/storeSessionFilter";
import {StorageResult} from "../../+dto/storageResult";
import {ProyectoCombo} from "../../+dto/proyectoCombo";
import {Http} from "@angular/http";
import {ComponentBase} from "../../+common/service/componentBase";
import {BackendService} from "../../+rest/backend.service";
import {Router} from "@angular/router";

declare var $: any;

@Component({
    selector: 'administrar-reporte-marcaciones',
    templateUrl: 'detalle.marcaciones.component.html',
    providers: [CargoService,NotificationsService]
})
export class AdministrarMarcacionesComponent extends ComponentBase implements OnInit {


    //public storageCommomnValueResult: StorageResult = new StorageResult();
    storeSessionFilter: StoreSessionFilter = new StoreSessionFilter();

    localhost:  String = environment.backend;
    port: String = environment.port;
    public defaultItemEstados: TablaGeneralResult = {codigo: null, nombre: 'Todos',grupo:null};
    public defaultItemDepartamento: DepartamentoAreaCombo = {idDepartamentoArea: null,idUnidadDeNegocio: null, nombre: 'Todos'};
    public estadosSelect: TablaGeneralResult;
    public estados:TablaGeneralResult[];
    public unidadDeNegocio: UnidadDeNegocioCombo[];
    public proyecto: ProyectoCombo[];
    public proyectoSelect: ProyectoCombo;
    public defaultItemProyecto: ProyectoCombo = {idProyecto: null,idDepartamentoArea:null, nombre: 'Todos'};
    public departamentoArea: DepartamentoAreaCombo[];
    public departamentoSelect: DepartamentoAreaCombo;
    public unidadNegocioSelect: UnidadDeNegocioCombo;
    public defaultItemUndNegocio: UnidadDeNegocioCombo = {idUnidadDeNegocio: null, nombre: 'Todos'};

    reporteMarcacion: ReporteMarcacion = new ReporteMarcacion();
    private view: Array<ReporteMarcacionSubscriptor>=[];
    public subscriptor: ReporteMarcacionSubscriptor = new ReporteMarcacionSubscriptor;

    private dataServiceEmpleado:CompleterData;
    private dataServiceJefe:CompleterData;

    @Output() save: EventEmitter<any> = new EventEmitter();

    constructor(public backendService: BackendService,
                private empleadoService: EmpleadoService,
                private completerService: CompleterService,
                private _router: Router,
                private location: Location) {

        super(backendService,'MA004');
        this.dataServiceJefe = completerService.remote(this.urlAutocompleteEmpleado,'nombreEmpleado','nombreEmpleado');
        this.dataServiceEmpleado = completerService.remote(this.urlAutocompleteEmpleado,'nombreEmpleado','nombreEmpleado');
        //this.storageCommomnValueResult = JSON.parse(localStorage.getItem('localStorageCommonsValues'));


        this.storeSessionFilter = this.empleadoService.retrieveSessionStorage('editReporteMarcacionResult');
        if(this.storeSessionFilter.isNew == false){
            this.obtenerReporteMarcacionById(this.storeSessionFilter.idTableFilter);
        }else{
            this.reporteMarcacion = new ReporteMarcacion();
        }
    }
    private obtenerReporteMarcacionById(idReporteMarcacion: any): void{
        this.empleadoService.obtenerReporteMarcacionById(idReporteMarcacion).subscribe(
            data => this.showDetail(data),
            error => this.errorMessage = <any>error
        );
    }
    showDetail(data:ReporteMarcacion){
        this.reporteMarcacion = data;
        this.view = data.subscriptores;
        this.actualizarDpto(this.reporteMarcacion.idUnidadDeNegocio);
        this.actualizarProyecto(this.reporteMarcacion.idDepartamentoArea);
    }

    ngOnInit() {
        this.getUndNegocio();
        this.getEstados();
    }
    onAgregarSubscriptor(e){
        e.preventDefault();

        //this.subscriptor.idEmpleado = this.reporteMarcacion.idEmpleado;
        //this.subscriptor.nombreEmpleado = this.reporteMarcacion.nombreEmpleado;
        this.save.emit(this.reporteMarcacion);
        this.crearSubscriptor(this.reporteMarcacion);
        this.reporteMarcacion.nombreEmpleado = undefined;
    }
    public crearSubscriptor(data: ReporteMarcacionSubscriptor): Observable<ReporteMarcacionSubscriptor[]> {
        return this.fetch("create", data);
    }

    public onDelete(e: ReporteMarcacionSubscriptor): void {
        const operation = this.eliminarSubscriptor(e);
    }

    public eliminarSubscriptor(data: ReporteMarcacionSubscriptor): Observable<ReporteMarcacionSubscriptor[]> {
        return this.fetch("destroy", data);
    }

    private fetch(action: string = "", data?: ReporteMarcacionSubscriptor): Observable<ReporteMarcacionSubscriptor[]>  {
        if(action=="create"){
            var reporteMarcacionSubscriptor : ReporteMarcacionSubscriptor = (JSON.parse(JSON.stringify(data)));
            this.view.push(reporteMarcacionSubscriptor);
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

    selectEmpleado(e){
        if(e !=null)
            this.reporteMarcacion.idEmpleado = e.originalObject.idEmpleado;
        else
            this.reporteMarcacion.idEmpleado = null;
    }

    selectJefe(e){
        if(e !=null)
            this.reporteMarcacion.idJefe = e.originalObject.idEmpleado;
        else
            this.reporteMarcacion.idJefe = null;
    }
    /* CARGA GRILLA*/
    private getSubscriptores(){

        this.empleadoService.buscarSubscriptores(this.reporteMarcacion).subscribe(
            data => {
                this.view = data;
            },
            error => this.errorMessage = <any>error
        );
    }

    /*CARGAR COMBOS*/
    private getEstados() {
        this.estados = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Estado' === grupo.grupo);
    }

    private getUndNegocio() {
        this.unidadDeNegocio = this.storageCommomnValueResult.unidadDeNegocio;
    }

    actualizarDpto(value): void {

        let codigo: any = value;
        this.departamentoSelect = this.defaultItemDepartamento;
        if(value == null){
            this.departamentoArea = null;
        }else {
            this.obtenerDepartamentos(codigo);
        }
        //this.isEnableProyectos = true;
        this.proyectoSelect = this.defaultItemProyecto;
        this.proyecto =null;


    }

    public actualizarProyecto(value): void {
        let codigo: any = value;
        this.obtenerProyecto(codigo);

    }
    public changeEstado(value): void {
        let estadoVal: any = value;
        this.reporteMarcacion.estado = estadoVal;
        $('#estadoReq').css('border','none');

    }

    private obtenerDepartamentos(idUndNegocio: number) {
        this.departamentoArea = this.storageCommomnValueResult.departamentoArea.filter(depa => idUndNegocio === depa.idUnidadDeNegocio);
    }

    private obtenerProyecto(idDepartamentoArea: number) {
        this.proyecto = this.storageCommomnValueResult.proyecto.filter(proyect => idDepartamentoArea === proyect.idDepartamentoArea);
    }
    /*END-CARGAR COMBOS*/
    onRegresarBusquedaReporteMarcaciones(){
        this.location.back();
    }
    onGuardarReporteMarcaciones(){

        if(this.validarRequerido()){
            this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'Ingrese los campos obligatorios.'});
            return;
        }
        if(this.validarReporteRequerido()){
            this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'Seleccionar un tipo de reporte.'});
            return;
        }
        if(this.validarSubscriptorRequerido()){
            this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'AÃ±adir un subscriptor.'});
            return;
        }


        this.reporteMarcacion.subscriptores = this.view;
        this.empleadoService.guardarReporteMarcacion(this.reporteMarcacion).subscribe(
            data => {

                this.backendService.notification(this.msgs, data);

                if (data.codigo == 1) {
                    setTimeout(() => {
                        this.navegarBusquedaReporte(data);
                    }, 3000);
                }

            },
            error => {
                this.backendService.notification(this.msgs, error);
            }

        );
    }

    navegarBusquedaReporte(data:NotificacionResult){
        this._router.navigate(['/mantenimientos/busquedaReporteMarcaciones']);
    }

    private validarRequerido():boolean{
        let validacion = false;
        if(this.reporteMarcacion.estado=== undefined || this.reporteMarcacion.estado == null || this.estados === undefined || this.estados == null){
            $('#estadoReq').addClass('invalid').removeClass('required');
            $('#estadoReq').parent().addClass('state-error').removeClass('state-success');
            $('#estadoReq').css('border','2px solid red');
            validacion = true;
        }
        return validacion;
    }
    private validarReporteRequerido():boolean{
        let validacion = false;
        if((this.reporteMarcacion.reporteDiario=== undefined || this.reporteMarcacion.reporteDiario == null) && (this.reporteMarcacion.reporteAcumulado=== undefined || this.reporteMarcacion.reporteAcumulado == null)){
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
}