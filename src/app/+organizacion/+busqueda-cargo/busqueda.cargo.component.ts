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
import {ProyectoCombo} from "../../+dto/proyectoCombo";
import {StorageResult} from "../../+dto/storageResult";
import {ComponentBase} from "../../+common/service/componentBase";
import {Http} from "@angular/http";
import {CargoResult} from "../../+dto/cargoResult";
import {CargoQuickFilter} from "../../+dto/cargoQuickFilter";
import {CargoService} from "../../+common/service/cargo.service";
import {BackendService} from "../../+rest/backend.service";
import {Cargo} from "../../+dto/maintenance/cargo";
import {ConfirmDialogComponent} from "../../shared/confirm/confirmDialogBase";
import {ViewChild} from "@angular/core/src/metadata/di";

declare var $: any;

@Component({
    selector: 'busqueda-cargo',
    templateUrl: 'busqueda.cargo.component.html',
    providers: [CargoService]
})
export class BusquedaCargoComponent extends ComponentBase implements OnInit {

    busy: Subscription;
    public undnegocios: UnidadDeNegocioCombo[];
    public proyectos: ProyectoCombo[];
    public departamentos: DepartamentoAreaCombo[];
    public unidadNegocioSelect: UnidadDeNegocioCombo;
    public departamentoSelect: DepartamentoAreaCombo;
    public proyectoSelect: ProyectoCombo;
    public estadosSelect: TablaGeneralResult;
    public defaultItem: UnidadDeNegocioCombo = {idUnidadDeNegocio: null, nombre: 'Todos'};

    public defaultItemTablaGeneral: TablaGeneralResult = {codigo: null, nombre: 'Todos',grupo: null};

    public defaultItemDepartamento: DepartamentoAreaCombo = {idDepartamentoArea: null,idUnidadDeNegocio: null, nombre: 'Todos'};
    public defaultItemProyecto: ProyectoCombo = {idProyecto: null,idDepartamentoArea: null, nombre: 'Todos'};
    //public storageCommomnValueResult: StorageResult = new StorageResult();


    busquedaCargos: CargoFilter = new CargoFilter();

    public marcaciones: Marcacion[] = [];

    public cargos: CargoResult[] = [];

    public estados:TablaGeneralResult[];

    private gridView: GridDataResult;
    private pageSize: number = 10;
    private data: Object[];
    private skip: number = 0;

    dataItem: Permiso;
    public isEmpty:boolean = true;
    public isSearch: boolean = false;

    public noItems: boolean = false;

    quickFilter: CargoQuickFilter = new CargoQuickFilter();

    localhost:  String = environment.backend;
    port: String = environment.port;

    constructor(private empleadoService: EmpleadoService,
                private _router: Router,
                public backendService: BackendService,
                private completerService: CompleterService,
                private cargoService:CargoService){

        super(backendService,'OR005');

        this.onSubmit();
    }

    onLimpiar(){
        this.busquedaCargos.nombre = undefined;

        this.unidadNegocioSelect = this.defaultItem;
        this.departamentoSelect = this.defaultItemDepartamento;
        this.departamentos = null;
        this.proyectoSelect = this.defaultItemProyecto;
        this.proyectos= null;

        this.cargos = [];

        this.gridView = {
            data: [],
            total: 0
        };

        this.skip = 0;
    }

    onSubmit(){
        this.validarValoresSeleccionados();


        this.getCargos();
    }

    onQuickSearck() {


        this.busquedaRapidaCargos();

    }

    busquedaRapidaCargos(){
        this.busy = this.cargoService.buquedaRapidaCargos(this.quickFilter).subscribe(
            data => {
                this.isSearch = true;
                this.cargos = data;
                this.skip = 0;

                this.obtenerCargos()
            },
            error => this.errorMessage = <any>error
        );
    }

    onNuevoCargo(){
        this.empleadoService.storeSessionStorage('isNewCargo',true);
        this.empleadoService.storeSessionStorage('idCargo',undefined);
        this._router.navigate(['/organizacion/administrarCargo']);
    }

    private getCargos() {
        this.busy = this.cargoService.buscarCargos(this.busquedaCargos).subscribe(
            data => {
                this.isSearch = true;
                this.cargos = data;
                this.skip = 0;

                this.obtenerCargos()
            },
            error => this.errorMessage = <any>error
        );
    }

    public onActualizarCargo(data: CargoResult): void {


        this.empleadoService.storeSessionStorage('isNewCargo',false);
        this.empleadoService.storeSessionStorage('idCargo',data.idCargo);
        this._router.navigate(['/organizacion/administrarCargo']);

    }

    onEliminarCargo(dto: CargoResult): void {

        this.empleadoService.eliminarCargo(dto.idCargo).subscribe(
            data => {

                this.backendService.notification(this.msgs, data);

                if (data.codigo == 1) {
                    this.getCargos();
                }

            },
            error => {
                this.backendService.notification(this.msgs, error);
            }
        );


    }

    private obtenerCargos(): void {

        if(this.cargos.length>0){
            this.isEmpty=false;
            this.gridView = {
                data: this.cargos.slice(this.skip, this.skip + this.pageSize),
                total: this.cargos.length
            };
        }else{
            this.isEmpty=true;

            this.gridView = {
                data: [],
                total: 0
            };
        }


    }

    protected pageChangeCargos(event: PageChangeEvent): void {
        this.skip = event.skip;
        this.obtenerCargos();

    }


    ngOnInit() {
        this.getUndNegocio();
        this.getProyectoEstados();
    }


    private validarValoresSeleccionados() {

        if (this.busquedaCargos.nombre === undefined) this.busquedaCargos.nombre = '';

    }


    private getUndNegocio() {
        this.undnegocios = this.storageCommomnValueResult.unidadDeNegocio;
    }

    private obtenerDepartamentos(idUndNegocio: number) {
        this.departamentos = this.storageCommomnValueResult.departamentoArea.filter(depa => idUndNegocio === depa.idUnidadDeNegocio);
    }

    private obtenerProyecto(idDepartamentoArea: number) {
        this.proyectos = this.storageCommomnValueResult.proyecto.filter(proyect => idDepartamentoArea === proyect.idDepartamentoArea);
    }


    private getProyectoEstados() {
        this.estados = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Estado' === grupo.grupo);
    }

    actualizarDpto(value): void {


        let codigo: any = value;
        this.busquedaCargos.idDepartamentoArea = null;
        if(value == null){
            this.departamentos = null;
        }else {
            this.obtenerDepartamentos(codigo);
        }
        //this.isEnableProyectos = true;
        this.busquedaCargos.idProyecto = null;
        this.proyectos =null;


    }

    actualizarProyecto(value): void {
        let codigo: any = value;
        this.busquedaCargos.idProyecto = null;
        this.obtenerProyecto(codigo);

    }

    @ViewChild(ConfirmDialogComponent) private confirmDialogComponent: ConfirmDialogComponent;

    public confirm(dataItem:Cargo): void {
        this.confirmDialogComponent.titulo="Eliminar Cargo"
        this.confirmDialogComponent.dataItem=dataItem;
        this.confirmDialogComponent.onShow();

    }


}