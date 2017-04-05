import {Component, OnInit} from "@angular/core";
import {GridDataResult, PageChangeEvent} from "@progress/kendo-angular-grid";

import {Router} from "@angular/router";

import {environment} from "../../../environments/environment";
import {CompleterService} from "ng2-completer";
import {UnidadDeNegocioCombo} from "../../+dto/unidadDeNegocioCombo";
import {DepartamentoAreaCombo} from "../../+dto/departamentoAreaCombo";
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {Permiso} from "../../+dto/maintenance/permiso";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {Marcacion} from "../../+dto/maintenance/marcacion";
import {Subscription} from "rxjs";
import {CargoFilter} from "../../+dto/cargoFilter";
import {Cargo} from "../../+dto/maintenance/cargo";
import {ProyectoCombo} from "../../+dto/proyectoCombo";
import {StorageResult} from "../../+dto/storageResult";
import {CentroCostoFilter} from "../../+dto/centroCostoFilter";
import {CentroCosto} from "../../+dto/maintenance/centroCosto";
import {CentroCostoService} from "../../+common/service/centrocosto.service";
import {CentroCostoResult} from "../../+dto/centroCostoResult";
import {StoreSessionFilter} from "../../+dto/storeSessionFilter";
import {ComponentBase} from "../../+common/service/componentBase";
import {Http} from "@angular/http";
import {BackendService} from "../../+rest/backend.service";
import {ConfirmDialogComponent} from "../../shared/confirm/confirmDialogBase";
import {ViewChild} from "@angular/core/src/metadata/di";

declare var $: any;

@Component({
    selector: 'busqueda-centrocosto',
    templateUrl: 'busqueda.centrocosto.component.html'
})
export class BusquedaCentroCostoComponent  extends ComponentBase implements OnInit {

    busy: Subscription;
    public undnegocios: UnidadDeNegocioCombo[];

    public departamentos: DepartamentoAreaCombo[];
    public unidadNegocioSelect: UnidadDeNegocioCombo;
    public departamentoSelect: DepartamentoAreaCombo;
    storeSessionFilter: StoreSessionFilter = new StoreSessionFilter();
    public estadosSelect: TablaGeneralResult;
    public defaultItem: UnidadDeNegocioCombo = {idUnidadDeNegocio: null, nombre: 'Todos'};

    public defaultItemTablaGeneral: TablaGeneralResult = {codigo: null, nombre: 'Todos', grupo:null};

    public defaultItemDepartamento: DepartamentoAreaCombo = {idDepartamentoArea: null,idUnidadDeNegocio: null, nombre: 'Todos'};
    //public storageCommomnValueResult: StorageResult = new StorageResult();

    busquedaCentroCosto: CentroCostoFilter = new CentroCostoFilter();

    public centros: CentroCostoResult[] = [];

    public estados:TablaGeneralResult[];

    private gridView: GridDataResult;
    private pageSize: number = 10;
    private data: Object[];
    private skip: number = 0;


    public isEmpty:boolean = true;
    public isSearch: boolean = false;

    public noItems: boolean = false;


    localhost:  String = environment.backend;
    port: String = environment.port;

    constructor(private empleadoService: EmpleadoService,
                private _router: Router,
                private completerService: CompleterService,
                public backendService: BackendService,
                private centroCostoService: CentroCostoService){
        super(backendService,'OR006');
        //this.storageCommomnValueResult = JSON.parse(localStorage.getItem('localStorageCommonsValues'));
        this.onSubmit();
    }

    onLimpiar(){
        this.busquedaCentroCosto.nombre = undefined;
    this.unidadNegocioSelect = this.defaultItem;
        this.departamentoSelect = this.defaultItemDepartamento;
        this.departamentos = null;


        this.centros = [];

        this.gridView = {
            data: [],
            total: 0
        };

        this.skip = 0;
    }

    onSubmit(){
        this.validarValoresSeleccionados();


        this.getCentrosCostos();
    }

    onNuevoCentroCosto(){
        this.storeSessionFilter.isNew = true;
        this.storeSessionFilter.idTableFilter = null;
        this.empleadoService.storeSessionStorage('editCentroCostoResult',this.storeSessionFilter);
        this._router.navigate(['/organizacion/administrarCentroCosto']);
    }

    private getCentrosCostos() {
        this.busy = this.centroCostoService.buscarCentrosCostos(this.busquedaCentroCosto).subscribe(
            data => {
                this.isSearch = true;
                this.centros = data;
                this.skip = 0;

                this.obtenerCentroCostos()
            },
            error => this.errorMessage = <any>error
        );
    }

    public onActualizarCentroCosto(dataItem: CentroCosto): void {

        this.storeSessionFilter.isNew = false;
        this.storeSessionFilter.idTableFilter = dataItem.idCentroCosto;
        this.empleadoService.storeSessionStorage('editCentroCostoResult',this.storeSessionFilter);
        //this.centroCostoService.storeDataCargo(dataItem);
        this._router.navigate(['/organizacion/administrarCentroCosto']);

    }

    onEliminarCentroCosto(dto: CentroCosto): void {

        this.centroCostoService.eliminarCentroCosto(dto.idCentroCosto).subscribe(

            data => {

                this.backendService.notification(this.msgs, data);

                if (data.codigo == 1) {
                    this.getCentrosCostos();
                }

            },
            error => {

                this.backendService.notification(this.msgs, error);
            }
        );
    }

    private obtenerCentroCostos(): void {

        if(this.centros.length>0){
            this.isEmpty=false;
            this.gridView = {
                data: this.centros.slice(this.skip, this.skip + this.pageSize),
                total: this.centros.length
            };
        }else{
            this.isEmpty=true;

            this.gridView = {
                data: [],
                total: 0
            };
        }


    }

    protected pageChangeCentrosCostos(event: PageChangeEvent): void {
        this.skip = event.skip;
        this.obtenerCentroCostos();

    }


    ngOnInit() {
        this.getUndNegocio();
        this.getProyectoEstados();
    }


    private validarValoresSeleccionados() {

        if (this.busquedaCentroCosto.nombre === undefined) this.busquedaCentroCosto.nombre = '';

    }


    private getUndNegocio() {
        this.undnegocios = this.storageCommomnValueResult.unidadDeNegocio;
    }

    private obtenerDepartamentos(idUndNegocio: number) {
        this.departamentos = this.storageCommomnValueResult.departamentoArea.filter(depa => idUndNegocio === depa.idUnidadDeNegocio);
    }

    private getProyectoEstados() {
        this.estados = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Estado' === grupo.grupo);
    }

    actualizarDpto(value): void {

        let codigo: any = value;
        this.busquedaCentroCosto.idDepartamentoArea = null;
        if(value == null){
            this.departamentos = null;
        }else {
            this.obtenerDepartamentos(codigo);
        }
        //this.isEnableProyectos = true;

    }

    @ViewChild(ConfirmDialogComponent) private confirmDialogComponent: ConfirmDialogComponent;

    public confirm(dataItem:CentroCosto): void {
        this.confirmDialogComponent.titulo="Eliminar Centro de Costo"
        this.confirmDialogComponent.dataItem=dataItem;
        this.confirmDialogComponent.onShow();

    }



}