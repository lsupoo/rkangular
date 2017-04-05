import {Component, OnInit} from "@angular/core";
import {GridDataResult, PageChangeEvent} from "@progress/kendo-angular-grid";

import {Router} from "@angular/router";

import {environment} from "../../../environments/environment";
import {CompleterService, CompleterData} from "ng2-completer";
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
import {CompensacionFilter} from "../../+dto/compensacionFilter";
import {CompensacionResult} from "../../+dto/compensacionResult";
import {CompensacionService} from "../../+common/service/compensacion.service";
import {CompensacionQuickFilter} from "../../+dto/compensacionQuickFilter";
import {BackendService} from "../../+rest/backend.service";

declare var $: any;

@Component({
    selector: 'busqueda-compensacion',
    templateUrl: 'busqueda.compensacion.component.html',
    providers : [CompensacionService]
})
export class BusquedaCompensacionComponent extends ComponentBase implements OnInit {

    busy: Subscription;
    public undnegocios: UnidadDeNegocioCombo[];
    public proyectos: ProyectoCombo[];
    public departamentos: DepartamentoAreaCombo[];

    public estadosSelect: TablaGeneralResult;
    public defaultItem: UnidadDeNegocioCombo = {idUnidadDeNegocio: null, nombre: 'Todos'};

    public defaultItemTablaGeneral: TablaGeneralResult = {codigo: null, nombre: 'Todos',grupo: null};

    public defaultItemDepartamento: DepartamentoAreaCombo = {idDepartamentoArea: null,idUnidadDeNegocio: null, nombre: 'Todos'};
    public defaultItemProyecto: ProyectoCombo = {idProyecto: null,idDepartamentoArea: null, nombre: 'Todos'};
    //public storageCommomnValueResult: StorageResult = new StorageResult();

    public defaultItemMes: {mes:number,nombre:string} = {mes: null, nombre: 'Todos'};

    public meses: {mes:number,nombre:string}[] = [];

    public compensaciones:CompensacionResult[]=[];

    quickFilter: CompensacionQuickFilter = new CompensacionQuickFilter();
    busquedaCompensacion: CompensacionFilter = new CompensacionFilter();

    public marcaciones: Marcacion[] = [];

    public cargos: CargoResult[] = [];

    public estados:TablaGeneralResult[];

    public isJefe : boolean=false;
    public isRhana:boolean= false;

    private gridView: GridDataResult;
    private pageSize: number = 10;
    private data: Object[];
    private skip: number = 0;

    private dataServiceEmpleado:CompleterData;
    private dataServiceJefeInmediato:CompleterData;

    dataItem: Permiso;
    public isEmpty:boolean = true;
    public isSearch: boolean = false;

    public noItems: boolean = false;

    localhost:  String = environment.backend;
    port: String = environment.port;

    constructor(private empleadoService: EmpleadoService,
                private _router: Router,
                public backendService: BackendService,
                private completerService: CompleterService,
                private compensacionService : CompensacionService){

        super(backendService,'OR005');




        this.dataServiceEmpleado = completerService.remote(this.urlAutocompleteEmpleado,'nombreEmpleado','nombreEmpleado');
        this.dataServiceJefeInmediato = completerService.remote(this.urlAutocompleteEmpleado,'nombreEmpleado','nombreEmpleado');
        this.meses = this.obtenterComboMeses();

        this.esJefe();
        this.esRhana();
        this.onSubmit();

    }

    selectEmpleado(e){
        if(e !=null)
            this.busquedaCompensacion.idEmpleado = e.originalObject.idEmpleado;
        else
            this.busquedaCompensacion.idEmpleado = null;
    }

    selectJefeInmediato(e){
        if(e !=null)
            this.busquedaCompensacion.idJefeInmediato = e.originalObject.idEmpleado;
        else
            this.busquedaCompensacion.idJefeInmediato = null;
    }

    onLimpiar(){

        this.busquedaCompensacion.idProyecto = null;
        this.busquedaCompensacion.idDepartamentoArea = null;
        this.busquedaCompensacion.idUnidadDeNegocio = null;


        this.compensaciones = [];

        this.gridView = {
            data: [],
            total: 0
        };

        this.skip = 0;
    }

    esJefe() {

        this.currentUser  = JSON.parse(sessionStorage.getItem("authenticatedUser") || '{}');

        var index;
        for(index=0;index<this.currentUser.assignedRoles.length;index++) {
            var r=this.currentUser.assignedRoles[index]
            if(r.assigned && r.roleName=='GEREN' && r.roleDefault){
                this.isJefe=true;
            }
        }
    }
    esRhana() {
        this.currentUser  = JSON.parse(sessionStorage.getItem("authenticatedUser") || '{}');
        var index;
        for(index=0;index<this.currentUser.assignedRoles.length;index++) {
            var r=this.currentUser.assignedRoles[index]
            if(r.assigned && r.roleName=='RHANA' && r.roleDefault){
                this.isRhana=true;
            }
        }
    }

    onSubmit(){
        this.validarValoresSeleccionados();
        this.getCompensaciones();
    }

    onQuickSearck(){
        this.busquedaRapidaCompensaciones();
    }

    onView(dto : CompensacionResult){

        this.empleadoService.storeSessionStorage('isNewCompensacion',false);
        this.empleadoService.storeSessionStorage('idEmpleadoCompensacion',dto.idEmpleadoCompensacion);
        this._router.navigate(['/gestionTiempo/administrarCompensacion']);
    }

    onRecuperar(dto : CompensacionResult){
        this.empleadoService.storeSessionStorage('isNewCompensacion',false);
        this.empleadoService.storeSessionStorage('idEmpleadoCompensacion',dto.idEmpleadoCompensacion);
        this._router.navigate(['/gestionTiempo/recuperarHoras']);
    }

    private getCompensaciones() {

        this.currentUser  = JSON.parse(sessionStorage.getItem("authenticatedUser") || '{}');
        if(this.isJefe && !this.isRhana) {
            this.busquedaCompensacion.idJefe = this.currentUser.idEmpleado;
        }

        this.busy = this.compensacionService.buscarCompensaciones(this.busquedaCompensacion).subscribe(
            data => {
                this.isSearch = true;
                this.compensaciones = data;
                this.skip = 0;

                this.obtenerCompensaciones()
            },
            error => this.errorMessage = <any>error
        );
    }

    private busquedaRapidaCompensaciones() {

        this.currentUser  = JSON.parse(sessionStorage.getItem("authenticatedUser") || '{}');
        if(this.isJefe && !this.isRhana) {
            this.quickFilter.idJefe = this.currentUser.idEmpleado;
        }

        this.busy = this.compensacionService.busquedaRapidaMarcaciones(this.quickFilter).subscribe(
            data => {
                this.isSearch = true;
                this.compensaciones = data;
                this.skip = 0;

                this.obtenerCompensaciones()
            },
            error => this.errorMessage = <any>error
        );
    }

    onChangeQuickSearhFechaDesde(value){
        this.quickFilter.fechaInicio = value;
    }

    onChangeQuickSearhFechaHasta(value){
        this.quickFilter.fechaFin = value;
    }

    private obtenerCompensaciones(): void {

        if(this.compensaciones.length>0){
            this.isEmpty=false;
            this.gridView = {
                data: this.compensaciones.slice(this.skip, this.skip + this.pageSize),
                total: this.compensaciones.length
            };
        }else{
            this.isEmpty=true;

            this.gridView = {
                data: [],
                total: 0
            };
        }


    }

    protected pageChangeCompensaciones(event: PageChangeEvent): void {
        this.skip = event.skip;
        this.obtenerCompensaciones();

    }


    ngOnInit() {
        this.getUndNegocio();
        this.getProyectoEstados();
    }


    private validarValoresSeleccionados() {

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
        this.busquedaCompensacion.idDepartamentoArea = null;
        if(value == null){
            this.departamentos = null;
        }else {
            this.obtenerDepartamentos(codigo);
        }
        //this.isEnableProyectos = true;
        this.busquedaCompensacion.idProyecto = null;
        this.proyectos =null;


    }

    actualizarProyecto(value): void {
        let codigo: any = value;
        this.busquedaCompensacion.idProyecto = null;
        this.obtenerProyecto(codigo);

    }

    obtenterComboMeses():{mes:number,nombre:string}[]{
        let meses:{mes:number,nombre:string}[]=[
            {mes:1,nombre:'Enero'},
            {mes:2,nombre:'Febrero'},
            {mes:3,nombre:'Marzo'},
            {mes:4,nombre:'Abril'},
            {mes:5,nombre:'Mayo'},
            {mes:6,nombre:'Junio'},
            {mes:7,nombre:'Julio'},
            {mes:8,nombre:'Agosto'},
            {mes:9,nombre:'Setiembre'},
            {mes:10,nombre:'Octubre'},
            {mes:11,nombre:'Noviembre'},
            {mes:12,nombre:'Diciembre'}
        ];

        return meses;

    }

    validateFilterEmptyEmpleado(e){
        if ((e.which && e.which == 8) || (e.which && e.which == 46) || (e.keyCode && e.keyCode == 8) || (e.keyCode && e.keyCode == 46)) {
            if(e.srcElement.value == ''){
                this.busquedaCompensacion.idEmpleado = null;
                this.busquedaCompensacion.empleado = undefined;
            }
        }
        return true;
    }

    validateFilterEmptyJefeInmediato(e){
        if ((e.which && e.which == 8) || (e.which && e.which == 46) || (e.keyCode && e.keyCode == 8) || (e.keyCode && e.keyCode == 46)) {
            if(e.srcElement.value == ''){
                this.busquedaCompensacion.idJefeInmediato = null;
                this.busquedaCompensacion.jefeInmediato = undefined;
            }
        }
        return true;
    }

}