import {Component, OnInit} from "@angular/core";
import {GridDataResult, PageChangeEvent} from "@progress/kendo-angular-grid";
import {Router} from "@angular/router";
import {environment} from "../../../environments/environment";
import {CompleterData, CompleterService} from "ng2-completer";
import {CargoService} from "../../+common/service/cargo.service";
import {DepartamentoAreaCombo} from "../../+dto/departamentoAreaCombo";
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {Permiso} from "../../+dto/maintenance/permiso";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {Marcacion} from "../../+dto/maintenance/marcacion";
import {Subscription} from "rxjs";
import {MarcacionFilter} from "../../+dto/marcacionFilter";
import {UnidadDeNegocioCombo} from "../../+dto/unidadDeNegocioCombo";
import {StorageResult} from "../../+dto/storageResult";
import {ProyectoCombo} from "../../+dto/proyectoCombo";
import {ComponentBase} from "../../+common/service/componentBase";
import {Http} from "@angular/http";
import {MarcacionQuickFilter} from "../../+dto/marcacionQuickFilter";
import {StoreSessionFilter} from "../../+dto/storeSessionFilter";
import {MarcacionResult} from "../../+dto/marcacionResult";
import {BackendService} from "../../+rest/backend.service";

declare var $: any;

@Component({
    selector: 'busqueda-marcacion',
    templateUrl: 'busqueda.marcacion.component.html',
    providers: [ CargoService]
})
export class BusquedaMarcacionComponent extends ComponentBase implements OnInit {

    busy: Subscription;
    storeSessionFilter: StoreSessionFilter = new StoreSessionFilter();
    public unidadDeNegocio: UnidadDeNegocioCombo[];
    public proyecto: ProyectoCombo[];
    public departamentoArea: DepartamentoAreaCombo[];
    public unidadNegocioSelect: UnidadDeNegocioCombo;
    public departamentoSelect: DepartamentoAreaCombo;
    public proyectoSelect: ProyectoCombo;
    public estadosSelect: TablaGeneralResult;
    public defaultItem: UnidadDeNegocioCombo = {idUnidadDeNegocio: null, nombre: 'Todos'};

    public defaultItemTablaGeneral: TablaGeneralResult = {codigo: null, nombre: 'Todos', grupo:null};

    public defaultItemTardanzaInasistencia: TablaGeneralResult[] = [{codigo: 'TA', nombre: 'Tardanzas',grupo:null},{codigo: 'IN', nombre: 'Inasistencias',grupo:null}];

    public defaultItemDepartamento: DepartamentoAreaCombo = {idDepartamentoArea: null,idUnidadDeNegocio: null, nombre: 'Todos'};
    public defaultItemProyecto: ProyectoCombo = {idProyecto: null,idDepartamentoArea:null, nombre: 'Todos'};

    busquedaMarcaciones: MarcacionFilter = new MarcacionFilter();
    public permisos: Permiso[] = [];

    public marcaciones: MarcacionResult[] = [];

    public estados:TablaGeneralResult[];

    private gridView: GridDataResult;
    private pageSize: number = 10;
    private skip: number = 0;

    dataItem: Permiso;
    public isEmpty:boolean = true;
    public isSearch: boolean = false;

    public noItems: boolean = false;

    quickFilter:MarcacionQuickFilter = new MarcacionQuickFilter();

    //Autocomplete

    private dataServiceEmpleado:CompleterData;

    private dataServiceJefeInmediato:CompleterData;

    localhost:  String = environment.backend;
    port: String = environment.port;

    urlBusquedaCodigoPermiso: string = 'http://'+this.localhost+':'+ this.port +'/empleado/busquedaCodigoPermiso?codigo=';

    constructor(private empleadoService: EmpleadoService,
                private _router: Router,
                public backendService: BackendService,
                private completerService: CompleterService){

        super(backendService, 'GT005');

        this.dataServiceEmpleado = completerService.remote(this.urlAutocompleteEmpleado,'nombreEmpleado','nombreEmpleado');

        this.dataServiceJefeInmediato = completerService.remote(this.urlAutocompleteEmpleado,'nombreEmpleado','nombreEmpleado');
        this.onSubmit();
    }

    selectEmpleado(e){
        if(e !=null)
            this.busquedaMarcaciones.idEmpleado = e.originalObject.idEmpleado;
        else
            this.busquedaMarcaciones.idEmpleado = null;
    }

    selectJefeInmediato(e){
        if(e !=null)
            this.busquedaMarcaciones.idJefeInmediato = e.originalObject.idEmpleado;
        else
            this.busquedaMarcaciones.idJefeInmediato = null;
    }

    onLimpiar(){
        this.busquedaMarcaciones.nombreEmpleado = undefined;
        this.busquedaMarcaciones.desde = undefined;
        this.busquedaMarcaciones.hasta = undefined;
        this.busquedaMarcaciones.jefeInmediato = undefined;
        this.busquedaMarcaciones.codigoPermiso = undefined;

        this.busquedaMarcaciones.idJefeInmediato = null;
        this.busquedaMarcaciones.idEmpleado = null;

        this.unidadNegocioSelect = this.defaultItem;
        this.departamentoSelect = this.defaultItemDepartamento;
        this.departamentoArea = null;
        this.proyectoSelect = this.defaultItemProyecto;
        this.proyecto= null;

        this.estadosSelect = this.defaultItemTablaGeneral;

        this.marcaciones = [];

        this.gridView = {
            data: [],
            total: 0
        };

        this.skip = 0;
    }

    onSubmit(){

        this.validarValoresSeleccionados();
        this.getMarcaciones();

    }

    onExportar(){
        if(this.marcaciones.length==0){
            this.noItems = true;
        }else {
            this.noItems = false;

            if ($("#export_file").length > 0) {
                $("#export_file").remove();
            }
            if ($("#export_file").length === 0) {
                var iframe = $("<iframe src='' name='export_file' id='export_file'></iframe>");
                iframe.appendTo("body");

                var form = $("<form action='"+this.urlExportMarcacion +"' method='post' target='export_file'></form>");
                form.append($("<input type='hidden' name='idEmpleado' id='idEmpleado' />").attr("value",this.busquedaMarcaciones.idEmpleado));
                form.append($("<input type='hidden' name='desde' id='desde' />").attr("value",this.busquedaMarcaciones.desde));
                form.append($("<input type='hidden' name='hasta' id='hasta' />").attr("value",this.busquedaMarcaciones.hasta));
                form.append($("<input type='hidden' name='unidadNegocio' id='unidadNegocio' />").attr("value",this.busquedaMarcaciones.unidadNegocio));
                form.append($("<input type='hidden' name='departamento' id='departamento' />").attr("value",this.busquedaMarcaciones.departamento));
                form.append($("<input type='hidden' name='proyecto' id='proyecto' />").attr("value",this.busquedaMarcaciones.proyecto));
                form.append($("<input type='hidden' name='idJefeInmediato' id='idJefeInmediato' />").attr("value",this.busquedaMarcaciones.idJefeInmediato));
                form.appendTo("body");

                form.submit();
            }
        }
    }

    onQuickSearck() {
        this.busquedaRapidaMarcaciones();
    }

    private busquedaRapidaMarcaciones() {
        this.busy = this.empleadoService.busquedaRapidaMarcaciones(this.quickFilter).subscribe(
            data => {
                this.isSearch = true;
                this.marcaciones = data;
                this.skip = 0;

                this.obtenerMarcaciones()
            },
            error => this.errorMessage = <any>error
        );
    }

    private getMarcaciones() {
        this.busy = this.empleadoService.buscarMarcacionesEmpleado(this.busquedaMarcaciones).subscribe(
            data => {
                this.isSearch = true;
                this.marcaciones = data;
                this.skip = 0;

                this.obtenerMarcaciones()
            },
            error => this.errorMessage = <any>error
        );
    }

    public onEdit(data: any): void {
        this.empleadoService.storeSessionStorage('isNewMarcacion',false);
        this.empleadoService.storeSessionStorage('idMarcacion',data.idMarcacion);
        this._router.navigate(['/gestionTiempo/administrarMarcacion']);


    }

    private obtenerMarcaciones(): void {

        if(this.marcaciones.length>0){
            this.isEmpty=false;
            this.gridView = {
                data: this.marcaciones.slice(this.skip, this.skip + this.pageSize),
                total: this.marcaciones.length
            };
        }else{
            this.isEmpty=true;

            this.gridView = {
                data: [],
                total: 0
            };
        }


    }

    protected pageChangeMarcaciones(event: PageChangeEvent): void {
        this.skip = event.skip;
        this.obtenerMarcaciones();

    }

    ngOnInit() {
        this.getUnidadDeNegocio();
        this.getEmpleadoEstados();
    }

    private validarValoresSeleccionados() {

        if (this.busquedaMarcaciones.desde === undefined) this.busquedaMarcaciones.desde = '';
        if (this.busquedaMarcaciones.hasta === undefined) this.busquedaMarcaciones.hasta = '';

        this.unidadNegocioSelect === undefined ? this.busquedaMarcaciones.unidadNegocio = ''
            : this.busquedaMarcaciones.unidadNegocio = (this.unidadNegocioSelect.idUnidadDeNegocio == null ?  '': this.unidadNegocioSelect.idUnidadDeNegocio.toString());

        this.departamentoSelect === undefined ? this.busquedaMarcaciones.departamento = ''
            : this.busquedaMarcaciones.departamento = (this.departamentoSelect.idDepartamentoArea == null ?  '': this.departamentoSelect.idDepartamentoArea.toString());

        this.proyectoSelect === undefined ? this.busquedaMarcaciones.proyecto = ''
            : this.busquedaMarcaciones.proyecto = (this.proyectoSelect.idProyecto == null ?  '': this.proyectoSelect.idProyecto.toString());

    }

    onChangeFechaDesde(value){
        if(value.type == 'change'){
            return;
        }
        this.busquedaMarcaciones.desde = value;
    }

    onChangeFechaHasta(value){
        if(value.type == 'change'){
            return;
        }
        this.busquedaMarcaciones.hasta = value;
    }

    onChangeQuickSearhFechaDesde(value){
        if(value.type == 'change'){
            return;
        }
        this.quickFilter.fechaDesde = value;
    }

    onChangeQuickSearhFechaHasta(value){
        if(value.type == 'change'){
            return;
        }
        this.quickFilter.fechaHasta = value;
    }

    private getUnidadDeNegocio() {
        this.unidadDeNegocio = this.storageCommomnValueResult.unidadDeNegocio;
    }

    private obtenerDepartamentos(idUndNegocio: number) {
        this.departamentoArea = this.storageCommomnValueResult.departamentoArea.filter(depa => idUndNegocio === depa.idUnidadDeNegocio);
    }

    private obtenerProyecto(idDepartamentoArea: number) {
        this.proyecto = this.storageCommomnValueResult.proyecto.filter(proyect => idDepartamentoArea === proyect.idDepartamentoArea);
    }


    private getEmpleadoEstados() {
        this.estados = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Estado' === grupo.grupo);
    }

    actualizarDpto(value): void {
        //this.isEnableUndNegocio = false;

        let codigo: any = value.idUnidadDeNegocio;
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

    actualizarProyecto(value): void {
        let codigo: any = value.idDepartamentoArea;
        this.proyectoSelect = this.defaultItemProyecto;
        this.obtenerProyecto(codigo);

    }

    validateFilterEmptyEmpleado(e){
        if ((e.which && e.which == 8) || (e.which && e.which == 46) || (e.keyCode && e.keyCode == 8) || (e.keyCode && e.keyCode == 46)) {
            if(e.srcElement.value == ''){
                this.busquedaMarcaciones.idEmpleado = null;
                this.busquedaMarcaciones.nombreEmpleado = undefined;
            }
        }
        return true;
    }

    validateFilterEmptyJefeInmediato(e){
        if ((e.which && e.which == 8) || (e.which && e.which == 46) || (e.keyCode && e.keyCode == 8) || (e.keyCode && e.keyCode == 46)) {
            if(e.srcElement.value == ''){
                this.busquedaMarcaciones.idJefeInmediato = null;
                this.busquedaMarcaciones.jefeInmediato = undefined;
            }
        }
        return true;
    }
}