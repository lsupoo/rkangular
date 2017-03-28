import {Component} from '@angular/core';
import {Observable} from "rxjs";
import {BandaSalarialDialogFormComponent} from "./banda.salarial.dialog.component";
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {PermisoService} from "../../+common/service/permiso.service";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {Licencia} from "../../+dto/maintenance/licencia";
import {CompleterData, CompleterService} from "ng2-completer";
import {environment} from "../../../environments/environment";
import {Router} from "@angular/router";
import {BandaSalarial} from "../../+dto/maintenance/bandaSalarial";
import {DepartamentoAreaCombo} from "../../+dto/departamentoAreaCombo";
import {CargoService} from "../../+common/service/cargo.service";
import {Cargo} from "../../+dto/maintenance/cargo";
import {NotificacionResult} from "../../+dto/NotificacionResult";
import {UnidadDeNegocioCombo} from "../../+dto/unidadDeNegocioCombo";
import {ProyectoCombo} from "../../+dto/proyectoCombo";
import {StorageResult} from "../../+dto/storageResult";

import {ViewChild} from "@angular/core/src/metadata/di";
import {Http} from "@angular/http";
import {PageChangeEvent} from "@progress/kendo-angular-grid";
import {CargoCombo} from "../../+dto/cargoCombo";
import {NotificationsService} from "angular2-notifications/src/notifications.service";
import {ComponentBase} from "../../+common/service/componentBase";
import {CurrentUser} from "../../+dto/currentUser";
import {BackendService} from "../../+rest/backend.service";

declare var $: any;

@Component({
    selector: 'administrar-cargo',
    templateUrl: 'administrar.cargo.component.html',
    providers: [CargoService,NotificationsService]
})
export class AdministrarCargoComponent extends ComponentBase {

    localhost:  String = environment.backend;
    port: String = environment.port;

    public licencia:Licencia= new Licencia();

    public defaultItemUnd: UnidadDeNegocioCombo = {idUnidadDeNegocio: null, nombre: 'Seleccionar'};
    public defaultItemEstado: TablaGeneralResult = {codigo: null, nombre: 'Seleccionar',grupo:null};
    public defaultItemDepartamento: DepartamentoAreaCombo = {idDepartamentoArea: null,idUnidadDeNegocio: null, nombre: 'Seleccionar'};
    public defaultItemProyecto: ProyectoCombo = {idProyecto: null,idDepartamentoArea: null, nombre: 'Seleccionar'};

    public defaultItemCargo: CargoCombo = {idCargo: null, nombre: 'Seleccionar'};

    public undnegocios: UnidadDeNegocioCombo[];
    public proyectos: ProyectoCombo[];
    public departamentos: DepartamentoAreaCombo[];

    public estados:TablaGeneralResult[];

    public cargo:Cargo=new Cargo();

    private dataServiceEmpleado:CompleterData;

    private cargoCombo:CargoCombo[]=[];
    protected currentUser:CurrentUser;


    constructor(private empleadoService: EmpleadoService,
                public backendService: BackendService,
                private _router: Router,
                private completerService: CompleterService,
                private cargoService: CargoService) {

        super(backendService,'OR005');
        this.dataServiceEmpleado = completerService.remote(this.urlAutocompleteEmpleado,'nombreEmpleado','nombreEmpleado');

        let isNewCargo:boolean = this.empleadoService.retrieveSessionStorage('isNewCargo');

        this.getUnidadDeNegocio();
        this.getCargoEstados();
        this.getCargosSuperior();

        if(isNewCargo){

        }else{
            let idCargo:number = this.empleadoService.retrieveSessionStorage('idCargo');
            this.verCargo(idCargo);
        }

    }

    private getUnidadDeNegocio() {
        this.undnegocios = this.storageCommomnValueResult.unidadDeNegocio;
    }

    private obtenerDepartamentos(idUndNegocio: number) {
        this.departamentos = this.storageCommomnValueResult.departamentoArea.filter(depa => idUndNegocio === depa.idUnidadDeNegocio);
    }

    private obtenerProyecto(idDepartamentoArea: number) {
        this.proyectos = this.storageCommomnValueResult.proyecto.filter(proyect => idDepartamentoArea === proyect.idDepartamentoArea);
    }

    private getCargosSuperior() {
        this.cargoCombo = this.storageCommomnValueResult.cargo;
    }

    private getCargoEstados() {
        this.estados = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Estado' === grupo.grupo);
    }

    verCargo(idCargo: number){
        this.cargoService.obtenerCargo(idCargo).subscribe(
            data => this.cargarCargo(data),
            error => this.errorMessage = <any>error
        );
    }

    private cargarCargo(data:Cargo){

        this.actualizarDpto(data.idUnidadDeNegocio);

        if(data.idDepartamentoArea != null) {
            this.actualizarProyecto(data.idDepartamentoArea);
        }

        this.cargo = data;

        this.viewBandaSalarial = this.cargo.bandasSalariales;

    }

    actualizarDpto(value): void {
        let codigo:any = value;
        this.cargo.idDepartamentoArea = null;
        if(value == null) {
            this.departamentos = null;
        }else {
            this.obtenerDepartamentos(codigo);
        }
        this.cargo.idProyecto = null;
        this.proyectos = null;

    }

    actualizarProyecto(value): void {
        let codigo:any = value;
        this.cargo.idProyecto = null;
        if(value == null) {
            this.proyectos = null;
        }else {
            this.obtenerProyecto(codigo);
        }

    }



    validarRequerido():boolean{
        let validacion = false;
        if(this.cargo.estado=== undefined || this.cargo.estado == null || this.cargo.estado == '' ){
            $('#estado').addClass('invalid').removeClass('required');
            $('#estado').parent().addClass('state-error').removeClass('state-success');
            $('#estado').css('border','2px solid red');
            validacion = true;
        }

        if(this.cargo.nombre=== undefined || this.cargo.nombre == null || this.cargo.nombre== '' ){
            $('#nombre').addClass('invalid').removeClass('required');
            $('#nombre').parent().addClass('state-error').removeClass('state-success');

            validacion = true;
        }
        return validacion;
    }

    onRegresarBusquedaCargo(){
        this.empleadoService.storeSessionStorage('isNewCargo',true);
        this.empleadoService.storeSessionStorage('idCargo',undefined);
        this._router.navigate(['/organizacion/busquedaCargo']);
    }

    onRegistrarCargo(){
        if(this.validarRequerido()){
            this.msgs.push({severity: 'error', summary: 'Runakuna Error', detail:'Ingrese los campos obligatorios.'});
            return;
        }

        this.cargo.bandasSalariales = this.viewBandaSalarial;
        //this.cargo.idEmpresa = 4;
        this.currentUser  = JSON.parse(sessionStorage.getItem("authenticatedUser"));
        this.cargo.idEmpresa=this.currentUser.idEmpresa;

        this.empleadoService.registrarCargo(this.cargo).subscribe(
            data => {

                this.backendService.notification(this.msgs, data);

                if (data.codigo == 1) {
                    setTimeout(() => {
                        this.navegarBusquedaCargo(data);
                    }, 3000);
                }

            },
            error => {

                this.backendService.notification(this.msgs, error);
            }
        );


    }

    navegarBusquedaCargo(data:NotificacionResult){
        this.empleadoService.storeSessionStorage('isNewCargo',true);
        this.empleadoService.storeSessionStorage('idCargo',undefined);
        this._router.navigate(['/organizacion/busquedaCargo']);

    }

    //banda salarial

    private pageSize: number = 10;
    private skip: number = 0;

    protected pageChangeBandaSalarial(event: PageChangeEvent): void {
        //this.skip = event.skip;
        //this.obtenerDocumentos().subscribe(data => this.view = data);
    }

    public dataItemBandaSalarial: BandaSalarial;

    @ViewChild(BandaSalarialDialogFormComponent) protected bandaSalarialDialogComponent: BandaSalarialDialogFormComponent;

    private viewBandaSalarial:Array<BandaSalarial>=[];

    public agregarBandaSalarial(): void {
        this.bandaSalarialDialogComponent.titulo = "Agregar";
        this.bandaSalarialDialogComponent.agregarBandaSalarial();


    }

    public onEditarBandaSalarial(dataItem: BandaSalarial): void {
        this.bandaSalarialDialogComponent.titulo = "Editar";
        this.bandaSalarialDialogComponent.obtenerMonedas();
        this.dataItemBandaSalarial = dataItem;

        this.bandaSalarialDialogComponent.idMoneda = this.dataItemBandaSalarial.idMoneda;
        //this.bandaSalarialDialogComponent.idCargo = this.dataItemBandaSalarial.idCargo;
        this.bandaSalarialDialogComponent.limiteSuperior = this.dataItemBandaSalarial.limiteSuperior;
        this.bandaSalarialDialogComponent.limiteMedio = this.dataItemBandaSalarial.limiteMedio;
        this.bandaSalarialDialogComponent.limiteInferior = this.dataItemBandaSalarial.limiteInferior;
        this.bandaSalarialDialogComponent.nombreMoneda = this.dataItemBandaSalarial.nombreMoneda;
        this.bandaSalarialDialogComponent.inicioVigencia = this.dataItemBandaSalarial.inicioVigencia;
        this.bandaSalarialDialogComponent.finVigencia = this.dataItemBandaSalarial.finVigencia;
    }

    public onGuardarBandaSalarial(dto: BandaSalarial): void {

        const operation = (dto.idBandaSalarial === undefined || dto.idBandaSalarial== null) ?
            this.crearBandaSalarial(dto) :
            this.editarBandaSalarial(dto);

    }

    public onEliminarBandaSalarial(e: BandaSalarial): void {
        const operation = this.eliminarBandaSalarial(e);
    }

    public onCancelarBandaSalarial(): void {
        this.dataItemBandaSalarial = undefined;
    }

    public obtenerBandaSalarial(): Observable<BandaSalarial[]> {
        return this.fetchBandaSalarial();
    }

    public editarBandaSalarial(data: BandaSalarial): Observable<BandaSalarial[]> {
        return this.fetchBandaSalarial("update", data);
    }

    public crearBandaSalarial(data: BandaSalarial): Observable<BandaSalarial[]> {
        data.idBandaSalarial = this.generarIdBandaSalarialTemporal();
        return this.fetchBandaSalarial("create", data);

    }

    public eliminarBandaSalarial(data: BandaSalarial): Observable<BandaSalarial[]> {
        return this.fetchBandaSalarial("destroy", data);
    }

    private fetchBandaSalarial(action: string = "", data?: BandaSalarial): Observable<BandaSalarial[]>  {



        if(action=="create"){
            let bandasal : BandaSalarial = (JSON.parse(JSON.stringify(data)));
            this.viewBandaSalarial.push(bandasal);
        }else if(action=="update"){
            let indice = this.viewBandaSalarial.indexOf(data);
            if(indice>=0)
                this.viewBandaSalarial[indice]  = (JSON.parse(JSON.stringify(data)));
        }else if(action=="destroy"){
            let indice = this.viewBandaSalarial.indexOf(data);

            if(indice>=0)
                this.viewBandaSalarial.splice(indice, 1);

        }

        return Observable.of(this.viewBandaSalarial);
    }

    generarIdBandaSalarialTemporal():number {
        if (this.viewBandaSalarial != null)
            return (this.viewBandaSalarial.length + 2)* -1;
        else
            return-1;
    }

}