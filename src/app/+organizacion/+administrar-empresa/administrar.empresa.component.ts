import {Component} from '@angular/core';
import {Observable} from "rxjs";
import {CompleterData, CompleterService} from "ng2-completer";
import {Router} from "@angular/router";
import {NotificacionResult} from "../../+dto/NotificacionResult";
import {StorageResult} from "../../+dto/storageResult";

import {ViewChild} from "@angular/core/src/metadata/di";
import {Http} from "@angular/http";
import {
    PageChangeEvent, GridComponent, GridDataResult, DataStateChangeEvent
} from "@progress/kendo-angular-grid";
import {ComponentBase} from "../../+common/service/componentBase";
import {environment} from "../../../environments/environment.prod";
import {UnidadDeNegocio} from "../../+dto/maintenance/unidadDeNegocio";
import {EmpresaService} from "../../+common/service/empresa.service";
import {Empresa} from "../../+dto/maintenance/empresa";
import {SortDescriptor} from "@progress/kendo-data-query";
import {UnidadNegocioDialogFormComponent} from "./unidad.negocio.dialog.component";
import {NotificationsService} from "angular2-notifications/src/notifications.service";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {BackendService} from "../../+rest/backend.service";

declare var $: any;

@Component({
    selector: 'administrar-empresa',
    templateUrl: 'administrar.empresa.component.html',
    providers: [EmpresaService,NotificationsService]
})
export class AdministrarEmpresaComponent extends ComponentBase {

    localhost:  String = environment.backend;
    port: String = environment.port;

    //public storageCommomnValueResult: StorageResult = new StorageResult();

    public empresa:Empresa=new Empresa();

    private dataServiceJefe:CompleterData;
    private dataServiceJefeReemplazo:CompleterData;
    public defaultItemEstado: TablaGeneralResult = {codigo: null, nombre: 'seleccionar',grupo: null};
    public estados:TablaGeneralResult[];

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

    private pageSize: number = 10;
    private skip: number = 0;
    private sort:Array<SortDescriptor>=[];

    constructor(private _service: NotificationsService,
                private _router: Router,
                public backendService: BackendService,
                private completerService: CompleterService,
                private empresaService: EmpresaService,
                private empleadoService: EmpleadoService) {

        super(backendService,'OR001');

        this.dataServiceJefe = completerService.remote(this.urlAutocompleteEmpleado,'nombreEmpleado','nombreEmpleado');
        this.dataServiceJefeReemplazo = completerService.remote(this.urlAutocompleteEmpleado,'nombreEmpleado','nombreEmpleado');

        this.getEstados();

        let isNewEmpresa:boolean = this.empleadoService.retrieveSessionStorage('isNewEmpresa');
        if(isNewEmpresa){

        }else{
            let idEmpresa:number = this.empleadoService.retrieveSessionStorage('idEmpresa');
            this.obtenerEmpresa(idEmpresa);
        }




    }

    private obtenerEmpresa(idEmpresa:number){
        this.empresaService.obtenerEmpresa(idEmpresa).subscribe(
            data => this.cargarEmpresa(data),
            error => this.errorMessage = <any>error
        );
    }

    private getEstados() {
        this.estados = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Estado' === grupo.grupo);
    }

    private cargarEmpresa(data:Empresa){

        this.empresa = data;
        this.viewUnidadNegocio = data.unidadesDeNegocio;
        this.obtenerGridUnidadNegocio();

    }

    selectJefe(e){
        if(e !=null)
            this.empresa.idJefe = e.originalObject.idEmpleado;
        else
            this.empresa.idJefe = null;
    }

    selectJefeReemplazo(e){
        if(e !=null)
            this.empresa.idJefeReemplazo = e.originalObject.idEmpleado;
        else
            this.empresa.idJefeReemplazo = null;
    }

    //dialog und negocio
    private gridViewUndNegocio: GridDataResult;

    @ViewChild(GridComponent) grid: GridComponent;

    public ngAfterViewInit(){
        //this.grid.expandRow(0);
    }



    protected pageChangeUndDeNegocio({skip, take, sort}: DataStateChangeEvent): void {
        this.skipUnidadNegocio = skip;
        this.sort = sort;
        this.pageSizeUnidadNegocio = take;

        this.obtenerGridUnidadNegocio();
    }

    private onRegresarBusquedaEmpresa(){
        this.empleadoService.storeSessionStorage('isNewEmpresa',true);
        this.empleadoService.storeSessionStorage('idEmpresa',undefined);
        this._router.navigate(['/organizacion/busquedaEmpresa']);
    }

    private onRegistrarEmpresa(){

        this.empresa.unidadesDeNegocio = this.viewUnidadNegocio;

        this.empresaService.registrarEmpresa(this.empresa).subscribe(
            data => {
                this.navegarBusquedEmpresa(data);
            },
            error => error
        );
    }

    navegarBusquedEmpresa(data:NotificacionResult){
        if(data.codigo == 1){
            this.empresa = new Empresa();
            this.empleadoService.storeSessionStorage('isNewEmpresa',true);
            this.empleadoService.storeSessionStorage('idEmpresa',undefined);
            this._router.navigate(['/organizacion/busquedaEmpresa']);
        }
        else if(data.codigo == 0){
            this._service.error('Error',data.mensaje);
        }

    }

//unidadnegocio
    private pageSizeUnidadNegocio: number = 10;
    private skipUnidadNegocio: number = 0;


    public dataItemUnidadNegocio: UnidadDeNegocio;

    @ViewChild(UnidadNegocioDialogFormComponent) protected unidadNegocioDialogComponent: UnidadNegocioDialogFormComponent;

    private viewUnidadNegocio:Array<UnidadDeNegocio>=[];

    public agregarUnidadNegocio(): void {
        this.unidadNegocioDialogComponent.titulo = "Agregar";
        this.unidadNegocioDialogComponent.agregarUnidadNegocio();

    }

    public onEditarUnidadNegocio(dataItem: UnidadDeNegocio): void {
        this.unidadNegocioDialogComponent.titulo = "Editar";
        this.unidadNegocioDialogComponent.obtenerEstados();
        this.unidadNegocioDialogComponent.cargarAutocomplete();
        this.dataItemUnidadNegocio = dataItem;

        this.unidadNegocioDialogComponent.nombre = this.dataItemUnidadNegocio.nombre;
        this.unidadNegocioDialogComponent.estado = this.dataItemUnidadNegocio.estado;
        this.unidadNegocioDialogComponent.jefe = this.dataItemUnidadNegocio.jefe;
        this.unidadNegocioDialogComponent.idJefe = this.dataItemUnidadNegocio.idJefe;
        this.unidadNegocioDialogComponent.jefeReemplazo = this.dataItemUnidadNegocio.jefeReemplazo;
        this.unidadNegocioDialogComponent.idJefeReemplazo = this.dataItemUnidadNegocio.idJefeReemplazo;
        this.unidadNegocioDialogComponent.jefeNoDisponible = this.dataItemUnidadNegocio.jefeNoDisponible;
        this.unidadNegocioDialogComponent.nombreEstado = this.dataItemUnidadNegocio.nombreEstado;
    }

    public onGuardarUnidadNegocio(dto: UnidadDeNegocio): void {

        const operation = (dto.idUnidadDeNegocio === undefined || dto.idUnidadDeNegocio== null) ?
            this.crearUnidadNegocio(dto) :
            this.editarUnidadNegocio(dto);

        this.obtenerGridUnidadNegocio();

    }

    public onEliminarUnidadNegocio(e: UnidadDeNegocio): void {
        const operation = this.eliminarUnidadNegocio(e);
        this.obtenerGridUnidadNegocio();
    }

    public onCancelarUnidadNegocio(): void {
        this.dataItemUnidadNegocio = undefined;
    }

    public obtenerUnidadNegocio(): Observable<UnidadDeNegocio[]> {
        return this.fetchUnidadNegocio();
    }

    public editarUnidadNegocio(data: UnidadDeNegocio): Observable<UnidadDeNegocio[]> {
        return this.fetchUnidadNegocio("update", data);
    }

    public crearUnidadNegocio(data: UnidadDeNegocio): Observable<UnidadDeNegocio[]> {
        data.idUnidadDeNegocio = this.generarIdUnidadNegocioTemporal();
        return this.fetchUnidadNegocio("create", data);

    }

    public eliminarUnidadNegocio(data: UnidadDeNegocio): Observable<UnidadDeNegocio[]> {
        return this.fetchUnidadNegocio("destroy", data);
    }

    private fetchUnidadNegocio(action: string = "", data?: UnidadDeNegocio): Observable<UnidadDeNegocio[]>  {



        if(action=="create"){
            let unidadNegocio : UnidadDeNegocio = (JSON.parse(JSON.stringify(data)));
            this.viewUnidadNegocio.push(unidadNegocio);
        }else if(action=="update"){
            let indice = this.viewUnidadNegocio.indexOf(data);
            if(indice>=0)
                this.viewUnidadNegocio[indice]  = (JSON.parse(JSON.stringify(data)));
        }else if(action=="destroy"){
            let indice = this.viewUnidadNegocio.indexOf(data);

            if(indice>=0)
                this.viewUnidadNegocio.splice(indice, 1);

        }

        return Observable.of(this.viewUnidadNegocio);
    }

    obtenerGridUnidadNegocio():void{
        if(this.viewUnidadNegocio.length>0){
            //this.isEmpty=false;
            this.gridViewUndNegocio = {
                data: this.viewUnidadNegocio.slice(this.skipUnidadNegocio, this.skipUnidadNegocio + this.pageSizeUnidadNegocio),
                total: this.viewUnidadNegocio.length
            };
        }else{
            //this.isEmpty=true;
            this.gridViewUndNegocio = {
                data: [],
                total: 0
            };
        }
    }

    generarIdUnidadNegocioTemporal():number {
        if (this.viewUnidadNegocio != null)
            return (this.viewUnidadNegocio.length + 2)* -1;
        else
            return-1;
    }


}