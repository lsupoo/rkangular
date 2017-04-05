import {Component, OnInit, ViewChild} from "@angular/core";
import {GridDataResult, PageChangeEvent} from "@progress/kendo-angular-grid";
import {Router} from "@angular/router";
import {environment} from "../../../environments/environment";
import {CompleterData, CompleterService} from "ng2-completer";
import {DepartamentoAreaCombo} from "../../+dto/departamentoAreaCombo";
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {Permiso} from "../../+dto/maintenance/permiso";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {Subscription} from "rxjs";
import {ProyectoFilter} from "../../+dto/proyectoFilter";
import {ProyectoResult} from "../../+dto/proyectoResult";
import {UnidadDeNegocioCombo} from "../../+dto/unidadDeNegocioCombo";
import {ProyectoCombo} from "../../+dto/proyectoCombo";
import {ComponentBase} from "../../+common/service/componentBase";
import {ProyectoService} from "../../+common/service/proyecto.service";
import {ProyectoQuickFilter} from "../../+dto/proyectoQuickFilter";
import {Message} from "primeng/primeng";
import {BackendService} from "../../+rest/backend.service";
import {ConfirmDialogComponent} from "../../shared/confirm/confirmDialogBase";
import {Proyecto} from "../../+dto/maintenance/proyecto";

declare var $: any;

@Component({
    selector: 'busqueda-proyecto',
    templateUrl: 'busqueda.proyecto.component.html',
    providers: [ProyectoService]
})
export class BusquedaProyectoComponent extends ComponentBase implements OnInit {

    busy: Subscription;
    public undnegocios: UnidadDeNegocioCombo[];
    public departamentos: DepartamentoAreaCombo[];
    public unidadNegocioSelect: UnidadDeNegocioCombo;
    public departamentoSelect: DepartamentoAreaCombo;
    public proyectoSelect: ProyectoCombo;
    public estadosSelect: TablaGeneralResult;
    public defaultItem: UnidadDeNegocioCombo = {idUnidadDeNegocio: null, nombre: 'Todos'};

    public defaultItemTablaGeneral: TablaGeneralResult = {codigo: null, nombre: 'Todos', grupo:null};

    public defaultItemDepartamento: DepartamentoAreaCombo = {idDepartamentoArea: null,idUnidadDeNegocio: null, nombre: 'Todos'};
    public defaultItemProyecto: ProyectoCombo = {idProyecto: null,idDepartamentoArea:null, nombre: 'Todos'};

    busquedaProyectos: ProyectoFilter = new ProyectoFilter();
    public permisos: Permiso[] = [];

    public proyectos:ProyectoResult[] = [];

    public estados:TablaGeneralResult[];

    private gridView: GridDataResult;
    private pageSize: number = 10;
    private data: Object[];
    private skip: number = 0;

    public isEmpty:boolean = true;
    public isSearch: boolean = false;

    public noItems: boolean = false;

    quickFilter: ProyectoQuickFilter = new ProyectoQuickFilter();


    dataItem: Proyecto;

    //Autocomplete


    private dataServiceJefeInmediato:CompleterData;

    localhost:  String = environment.backend;
    port: String = environment.port;
    //public storageCommomnValueResult: StorageResult = new StorageResult();

    urlBusquedaCodigoPermiso: string = 'http://'+this.localhost+':'+ this.port +'/empleado/busquedaCodigoPermiso?codigo=';


    msgs: Message[] = [];

    @ViewChild(ConfirmDialogComponent) private confirmDialogComponent: ConfirmDialogComponent;

    constructor(public backendService: BackendService,
                private empleadoService: EmpleadoService,
                private _router: Router,
                private completerService: CompleterService,
                private proyectoService: ProyectoService) {

        super(backendService,'OR003');

        this.dataServiceJefeInmediato = completerService.remote(this.urlAutocompleteEmpleado, 'nombreEmpleado', 'nombreEmpleado');

        this.getUndNegocio();
        this.getProyectoEstados();
        this.onSubmit();
    }

    private getProyectoEstados() {
        this.estados = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Estado' === grupo.grupo);
    }


    public confirm(dataItem:Proyecto): void {
        this.confirmDialogComponent.titulo="Eliminar Proyecto"
        this.confirmDialogComponent.dataItem=dataItem;
        this.confirmDialogComponent.onShow();

    }


    onLimpiar(){
        this.busquedaProyectos.nombre = undefined;
        this.busquedaProyectos.fechaInicioDesde = undefined;
        this.busquedaProyectos.fechaFinDesde = undefined;
        this.busquedaProyectos.fechaInicioHasta = undefined;
        this.busquedaProyectos.fechaFinHasta = undefined;
        this.busquedaProyectos.nombreJefeProyecto = undefined;

        $('#datepickerDesde').val("");
        $('#datepickerDesdeAdvance').val("");
        $('#datepickerHasta').val("");
        $('#datepickerHastaAdvance').val("");

        this.busquedaProyectos.idJefeProyecto = null;

        //this.unidadNegocioSelect = this.defaultItem;

        this.busquedaProyectos.idUnidadDeNegocio=null;

        this.departamentoSelect = this.defaultItemDepartamento;
        this.departamentos = null;

        //this.estadosSelect = this.defaultItemTablaGeneral;
        this.busquedaProyectos.estado=null;

        this.proyectos = [];

        this.gridView = {
            data: [],
            total: 0
        };

        this.skip = 0;
    }

    onSubmit(){
        this.validarValoresSeleccionados();

        this.getProyectos();

    }

    onQuickSearck() {
        this.busquedaRapidaProyectos();
    }

    onNuevoProyecto(){
        this.empleadoService.storeSessionStorage('isNewProyecto',true);
        this.empleadoService.storeSessionStorage('idProyecto',undefined);
        this._router.navigate(['/organizacion/administrarProyecto']);
    }

    private busquedaRapidaProyectos() {
        this.busy = this.proyectoService.busquedaRapidaProyecto(this.quickFilter).subscribe(
            data => {
                this.isSearch = true;
                this.proyectos = data;
                this.skip = 0;

                this.obtenerProyectos()
            },
            error => this.errorMessage = <any>error
        );
    }

    private getProyectos() {
        this.busy = this.proyectoService.buscarProyectos(this.busquedaProyectos).subscribe(
            data => {
                this.isSearch = true;
                this.proyectos = data;
                this.skip = 0;

                this.obtenerProyectos()
            },
            error => this.errorMessage = <any>error
        );
    }

    public onEdit(data: ProyectoResult): void {

        this.empleadoService.storeSessionStorage('isNewProyecto',false);
        this.empleadoService.storeSessionStorage('idProyecto',data.idProyecto);
        this._router.navigate(['/organizacion/administrarProyecto']);


    }

    public onDelete(dataItem: ProyectoResult): void {

        this.proyectoService.eliminarProyecto(dataItem.idProyecto).subscribe(

            data => {

                this.backendService.notification(this.msgs, data);

                if (data.codigo == 1) {
                    this.getProyectos();
                }

            },
                error => {

                    this.backendService.notification(this.msgs, error);
                }
        );
    }

    private obtenerProyectos(): void {

        if(this.proyectos.length>0){
            this.isEmpty=false;
            this.gridView = {
                data: this.proyectos.slice(this.skip, this.skip + this.pageSize),
                total: this.proyectos.length
            };
        }else{
            this.isEmpty=true;

            this.gridView = {
                data: [],
                total: 0
            };
        }


    }

    protected pageChangeProyectos(event: PageChangeEvent): void {
        this.skip = event.skip;
        this.obtenerProyectos();

    }

    selectJefeProyecto(e){
        if(e !=null)
            this.busquedaProyectos.idJefeProyecto = e.originalObject.idEmpleado;
        else
            this.busquedaProyectos.idJefeProyecto = null;
    }

    ngOnInit() {
        this.getUndNegocio();
    }


    private validarValoresSeleccionados() {

        if (this.busquedaProyectos.fechaInicioDesde === undefined) this.busquedaProyectos.fechaInicioDesde = '';
        if (this.busquedaProyectos.fechaInicioHasta === undefined) this.busquedaProyectos.fechaInicioHasta = '';

        if (this.busquedaProyectos.fechaFinDesde === undefined) this.busquedaProyectos.fechaFinDesde = '';
        if (this.busquedaProyectos.fechaFinHasta === undefined) this.busquedaProyectos.fechaFinHasta = '';

    }

    onChangeFechaIniDesde(value){
        if(value.type == 'change'){
            return;
        }
        this.busquedaProyectos.fechaInicioDesde = value;
    }

    onChangeFechaIniHasta(value){
        if(value.type == 'change'){
            return;
        }
        this.busquedaProyectos.fechaInicioHasta = value;
    }

    onChangeFechaFinDesde(value){
        if(value.type == 'change'){
            return;
        }
        this.busquedaProyectos.fechaFinDesde = value;
    }

    onChangeFechaFinHasta(value){
        if(value.type == 'change'){
            return;
        }
        this.busquedaProyectos.fechaFinHasta = value;
    }

    private getUndNegocio() {
        this.undnegocios = this.storageCommomnValueResult.unidadDeNegocio;
    }

    private obtenerDepartamentos(idUndNegocio: number) {
        this.departamentos = this.storageCommomnValueResult.departamentoArea.filter(depa => idUndNegocio === depa.idUnidadDeNegocio);
    }

    actualizarDpto(value): void {
        let codigo: any = value;
        this.busquedaProyectos.idDepartamentoArea = null;
        if(value == null){
            this.departamentos = null;
        }else {
            this.obtenerDepartamentos(codigo);
        }
    }

    validateFilterEmptyJefeInmediato(e){
        if ((e.which && e.which == 8) || (e.which && e.which == 46) || (e.keyCode && e.keyCode == 8) || (e.keyCode && e.keyCode == 46)) {
            if(e.srcElement.value == ''){
                this.busquedaProyectos.idJefeProyecto = null;
                this.busquedaProyectos.nombreJefeProyecto = undefined;
            }
        }
        return true;
    }

}