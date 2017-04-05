import {Component, OnInit} from '@angular/core';
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {Http} from "@angular/http";
import {ComponentBase} from "../../+common/service/componentBase";
import {StoreSessionFilter} from "../../+dto/storeSessionFilter";
import {PieChartDataResult} from "../../+dto/pieChartDataResult";
import {MarcacionDashboardResult} from "../../+dto/marcacionDashboardResult";
import {GridDataResult, PageChangeEvent} from "@progress/kendo-angular-grid";
import {MarcacionDashboardFilter} from "../../+dto/marcacionDashboardFilter";
import {VacacionResult} from "../../+dto/vacacionResult";
import {PermisoEmpleadoResult} from "../../+dto/permisoEmpleadoResult";
import {ProyectoCombo} from "../../+dto/proyectoCombo";
import {Subscription, Observable} from "rxjs";
import {DashBoardService} from "../../+common/service/dashboard.service";
import {Router} from "@angular/router";
import {HorasExtraResult} from "../../+dto/horasExtraResult";
import {Color} from "ng2-charts";
import {UnidadDeNegocioCombo} from "../../+dto/unidadDeNegocioCombo";
import {DepartamentoAreaCombo} from "../../+dto/departamentoAreaCombo";
import {PermisoEmpleado} from "../../+dto/maintenance/permisoEmpleado";
import {Vacacion} from "../../+dto/maintenance/vacacion";
import {HorasExtra} from "../../+dto/maintenance/horasExtra";
import {ExpressionRegularValidate} from "../../+common/Utils/expressionRegularValidate";
import {Message} from "primeng/components/common/api";
import {BackendService} from "../../+rest/backend.service";
import 'chart.js'

declare var $: any;
var moment = require('moment');

@Component({
    selector: 'dashboard-jefe',
    templateUrl: 'principal.jefe.component.html'
})
export class DashboardJefeComponent extends ComponentBase implements OnInit {

    busy: Subscription;
    msgs: Message[] = [];

    public unidadDeNegocio: Array<UnidadDeNegocioCombo>=[];
    public unidadNegocioSelect: UnidadDeNegocioCombo;
    public proyecto: Array<ProyectoCombo>=[];
    public proyectoSelect: ProyectoCombo;
    public departamentoArea: Array<DepartamentoAreaCombo>=[];
    public departamentoSelect: DepartamentoAreaCombo;
    public tipoMarcacion: TablaGeneralResult[];
    public defaultItemUndNegocio: UnidadDeNegocioCombo = {idUnidadDeNegocio: null, nombre: 'Todos'};
    public defaultItemDepartamento: DepartamentoAreaCombo = {idDepartamentoArea: null,idUnidadDeNegocio: null, nombre: 'Todos'};
    public defaultItemProyecto: ProyectoCombo = {idProyecto: null, nombre: 'Todos'};

    public selectedPrimitive: string = 'E';
    public permisos: PermisoEmpleadoResult[] = [];
    public vacacion: VacacionResult[] = [];
    public horasExtras: HorasExtraResult[] = [];

    busquedaMarcacionesJefe: MarcacionDashboardFilter = new MarcacionDashboardFilter();
    private skip: number = 0;
    public isSearch: boolean = false;
    private pageSize: number = 10;
    private gridView: GridDataResult;
    private skipPermiso: number = 0;
    public isSearchPermiso: boolean = false;
    private gridViewPermiso: GridDataResult;
    private pageSizePermiso: number = 10;
    private skipVacacion: number = 0;
    public isSearchVacacion: boolean = false;
    private gridViewVacacion: GridDataResult;
    private pageSizeVacacion: number = 10;
    //Horas Extras
    private skipHorasExtras: number = 0;
    public isSearchHorasExtras: boolean = false;
    private gridViewHorasExtras: GridDataResult;
    private pageSizeHorasExtras: number = 10;

    public isEmpty:boolean = true;

    public marcaciones: MarcacionDashboardResult[] = [];
    public pieChartDataResult: PieChartDataResult = new PieChartDataResult();


    public pieChartLabels:string[] = ['Empleados sin tardanza',
        'Empleados con tardanza',
        'Empleados sin marcación'];

    public pieChartData:number[] = [this.pieChartDataResult.nroEmpleadosMarcacionTiempo,
        this.pieChartDataResult.nroEmpleadosMarcacionFueraTiempo,
        this.pieChartDataResult.nroEmpleadosSinMarcacion];
    public pieChartType:string = 'pie';

    colorsEmptyObject: Array<Color> = [{
        backgroundColor: [
            "#00174f",
            "#a10d00",
            "#ffda74"
        ],
        hoverBackgroundColor: [
            "#000b21",
            "#510800",
            "#bda454"
        ]
    }];

    storeSessionFilter: StoreSessionFilter = new StoreSessionFilter();

    constructor(public backendService: BackendService,
                private dashBoardService: DashBoardService,
                private _router: Router,
                private empleadoService: EmpleadoService) {
        super(backendService,'DA002');
        this.currentUser  = JSON.parse(sessionStorage.getItem("authenticatedUser") || '{}');
        this.busquedaMarcacionesJefe.idEmpleado = this.currentUser.idEmpleado;

        this.getUnidadDeNegocio();
        this.getTipoMarcacion();
        //TABS
        this.getPermisos();
        this.getVacaciones();
        this.getHorasExtras();

        //current date
        this.busquedaMarcacionesJefe.tipoMarcacion = 'E';

        this.busquedaMarcacionesJefe.fecha = moment().format('DD/MM/YYYY');
        this.getDashboardPrincipal();
    }

    ngOnInit() {
    }

    /* TAB PERMISO*/
    private getPermisos() {
        this.busy = this.dashBoardService.buscarPermisoDashboardJefe(this.busquedaMarcacionesJefe).subscribe(
            data => {
                this.isSearchPermiso = true;
                this.permisos = data;
                this.skipPermiso = 0;

                this.obtenerPermisos()
            },
            error => this.errorMessage = <any>error
        );
    }
    private obtenerPermisos(): void {

        if(this.permisos.length>0){
            this.gridViewPermiso = {
                data: this.permisos.slice(this.skipPermiso, this.skipPermiso + this.pageSizePermiso),
                total: this.permisos.length
            };

        }else{

            this.gridViewPermiso = {
                data: [],
                total: 0
            };
        }

    }
    /*TAB VACACION*/
    private getVacaciones() {
        this.busy = this.dashBoardService.buscarVacacionesDashboardJefe(this.busquedaMarcacionesJefe).subscribe(
            data => {
                this.isSearchVacacion = true;
                this.vacacion = data;
                this.skipVacacion = 0;

                this.obtenerVacaciones()
            },
            error => this.errorMessage = <any>error
        );
    }
    private obtenerVacaciones(): void {

        if(this.vacacion.length>0){
            this.gridViewVacacion = {
                data: this.vacacion.slice(this.skipVacacion, this.skipVacacion + this.pageSizeVacacion),
                total: this.vacacion.length
            };
        }else{

            this.gridViewVacacion = {
                data: [],
                total: 0
            };
        }

    }
    /*TAB HORASEXTRAS*/
    private getHorasExtras() {
        this.busy = this.dashBoardService.buscarHorasExtrasDashboardJefe(this.busquedaMarcacionesJefe).subscribe(
            data => {
                this.isSearchHorasExtras = true;
                this.horasExtras = data;
                this.skipHorasExtras = 0;

                this.obtenerHorasExtras()
            },
            error => this.errorMessage = <any>error
        );
    }
    private obtenerHorasExtras(): void {

        if(this.horasExtras.length>0){
            this.gridViewHorasExtras = {
                data: this.horasExtras.slice(this.skipHorasExtras, this.skipHorasExtras + this.pageSizeHorasExtras),
                total: this.horasExtras.length
            };
        }else{

            this.gridViewHorasExtras = {
                data: [],
                total: 0
            };
        }

    }
    selectTipoMarcacion(value): void {

        let tipoMarcacionVal: any = value;
        this.busquedaMarcacionesJefe.tipoMarcacion = tipoMarcacionVal;
        if(this.busquedaMarcacionesJefe.tipoMarcacion == null || this.busquedaMarcacionesJefe.tipoMarcacion === undefined){
            this.busquedaMarcacionesJefe.tipoMarcacion = 'E';
        }
        this.getDashboardPrincipal();
    }
    actualizarDpto(value): void {
        let codigo: any = value.idUnidadDeNegocio;
        this.departamentoSelect = this.defaultItemDepartamento;
        if(value.idUnidadDeNegocio == null){
            this.departamentoArea = null;
            this.busquedaMarcacionesJefe.unidadNegocio = '';
            this.busquedaMarcacionesJefe.departamento = '';
            this.busquedaMarcacionesJefe.proyecto = '';
        }else {
            this.obtenerDepartamentos(codigo);
        }
        this.proyectoSelect = this.defaultItemProyecto;
        this.proyecto =null;
        this.busquedaMarcacionesJefe.unidadNegocio = value.idUnidadDeNegocio;
        if(this.busquedaMarcacionesJefe.tipoMarcacion == null || this.busquedaMarcacionesJefe.tipoMarcacion === undefined){
            this.busquedaMarcacionesJefe.tipoMarcacion = 'E';
        }
        this.getDashboardPrincipal();

    }
    actualizarProyecto(value): void {
        let codigo: any = value.idDepartamentoArea;
        if(value == null){
            this.proyecto = null;
        }else {
            this.obtenerProyecto(codigo);
        }
        this.proyectoSelect = this.defaultItemProyecto;
        this.busquedaMarcacionesJefe.departamento = value.idDepartamentoArea;
        if(this.busquedaMarcacionesJefe.tipoMarcacion == null || this.busquedaMarcacionesJefe.tipoMarcacion === undefined){
            this.busquedaMarcacionesJefe.tipoMarcacion = 'E';
        }
        this.getDashboardPrincipal();

    }
    selectProyecto(value): void {
        let codigo: any = value.idProyecto;
        this.busquedaMarcacionesJefe.proyecto = codigo;
        if(this.busquedaMarcacionesJefe.tipoMarcacion == null || this.busquedaMarcacionesJefe.tipoMarcacion === undefined){
            this.busquedaMarcacionesJefe.tipoMarcacion = 'E';
        }
        this.getDashboardPrincipal();

    }

    onChangeFecha(value){
        if(value.type == 'change'){
            return;
        }
        this.busquedaMarcacionesJefe.fecha = value;
        if(this.busquedaMarcacionesJefe.tipoMarcacion == null || this.busquedaMarcacionesJefe.tipoMarcacion === undefined){
            this.busquedaMarcacionesJefe.tipoMarcacion = 'E';
        }
        this.getDashboardPrincipal();
    }

    cleanGridView(){
        this.gridView = {
            data: [],
            total: 0
        };
    }

    searchDateParameter(){
        if (!this.isValidadCharacterDate)
            return;
        if(this.busquedaMarcacionesJefe.fecha == null || this.busquedaMarcacionesJefe.fecha === undefined){
            this.busquedaMarcacionesJefe.fecha = this.inputDatePickerFecha;
        }

        $('#datepickerFecha').removeClass('state-error');
        $('#datepickerFecha').parent().removeClass('state-error');
        if(this.busquedaMarcacionesJefe.tipoMarcacion == null || this.busquedaMarcacionesJefe.tipoMarcacion === undefined){
            this.busquedaMarcacionesJefe.tipoMarcacion = 'E';
        }
        this.getDashboardPrincipal();
        this.isValidadCharacterDate = false;
    }

    private getUnidadDeNegocio() {
        this.unidadDeNegocio = this.storageCommomnValueResult.unidadDeNegocio;
    }
    private getTipoMarcacion() {
        this.tipoMarcacion = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Dashboard.TipoMarcacion' === grupo.grupo);
    }

    private obtenerDepartamentos(idUndNegocio: number) {
        this.departamentoArea = this.storageCommomnValueResult.departamentoArea.filter(depa => idUndNegocio === depa.idUnidadDeNegocio);
    }

    private obtenerProyecto(idDepartamentoArea: number) {
        this.proyecto = this.storageCommomnValueResult.proyecto.filter(proyect => idDepartamentoArea === proyect.idDepartamentoArea);
    }

    private getMarcaciones() {
        this.busy = this.dashBoardService.buscarMarcacionesDashboard(this.busquedaMarcacionesJefe).subscribe(
            data => {
                this.isSearch = true;
                this.marcaciones = data;
                this.skip = 0;

                this.obtenerMarcaciones();
            },
            error => this.errorMessage = <any>error
        );
    }

    private getDashboardPrincipal(){
        Observable.forkJoin(
            this.dashBoardService.buscarMarcacionesDashboardJefe(this.busquedaMarcacionesJefe),
            this.dashBoardService.buscarMarcacionPieChartJefe(this.busquedaMarcacionesJefe)
        ).subscribe(
            data => {
                this.marcaciones = data[0];
                this.obtenerMarcaciones();

                this.navegarPieChart(data[1]);
            },
            error => {
                this.errorMessage = 'Service error';
            });
    }

    private onSeriesClick(e): void {
        this.getDashboardPrincipal();
    }


    navegarPieChart(data: PieChartDataResult[]){

        if(data == undefined || data == null || data.length<=0){
            this.pieChartData = [0,0,0];
        }else{
            this.pieChartDataResult = data;
            this.pieChartData = [this.pieChartDataResult[0].nroEmpleadosMarcacionTiempo,
                this.pieChartDataResult[0].nroEmpleadosMarcacionFueraTiempo,
                this.pieChartDataResult[0].nroEmpleadosSinMarcacion];
        }
    }

    protected pageChangeMarcaciones(event: PageChangeEvent): void {
        this.skip = event.skip;
        this.obtenerMarcaciones();

    }
    protected pageChangePermiso(event: PageChangeEvent): void {
        this.skipPermiso = event.skip;
        this.obtenerPermisos();

    }
    protected pageChangeVacacion(event: PageChangeEvent): void {
        this.skipVacacion = event.skip;
        this.obtenerVacaciones();

    }
    protected pageChangeHorasExtras(event: PageChangeEvent): void {
        this.skipHorasExtras = event.skip;
        this.obtenerHorasExtras();

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

    public onEditPermiso(dataItem: any): void {
        this.storeSessionFilter.isNew = false;
        this.storeSessionFilter.idTableFilter = dataItem.idPermisoEmpleado;
        this.empleadoService.storeSessionStorage('editPermisoEmpleadoResult',this.storeSessionFilter);
        this._router.navigate(['/gestionTiempo/administrarPermiso']);

    }
    public onEditVacacion(dataItem: any): void {
        this.storeSessionFilter.isNew = false;
        this.storeSessionFilter.idTableFilter = dataItem.idVacacion;
        this.empleadoService.storeSessionStorage('editVacacionResult',this.storeSessionFilter);
        this._router.navigate(['/gestionTiempo/administrarVacaciones']);
    }
    public onEditHorasExtras(dataItem: any): void {
        this.storeSessionFilter.isNew = false;
        this.storeSessionFilter.idTableFilter = dataItem.idHorasExtra;
        this.empleadoService.storeSessionStorage('editHorasExtraResult',this.storeSessionFilter);
        this._router.navigate(['/gestionTiempo/administrarHorasExtra']);
    }

    onAprobarPermiso(dataItem: PermisoEmpleado): void {

        this.empleadoService.aprobarPermisoEmpleado(dataItem).subscribe(
            data => {
                this.getPermisos();
            },
            error => this.errorMessage = <any>error
        );
    }
    onRechazarPermiso(dataItem: PermisoEmpleado): void {

        this.empleadoService.rechazarPermisoEmpleado(dataItem).subscribe(
            data => {
                this.getPermisos();
            },
            error => this.errorMessage = <any>error
        );
    }
    onAprobarVacacion(dataItem: Vacacion): void {
        this.empleadoService.aprobarVacacionEmpleado(dataItem).subscribe(
            data => {
                this.getVacaciones();
            },
            error => this.errorMessage = <any>error
        );
    }
    onRechazarVacacion(dataItem: Vacacion): void {

        this.empleadoService.rechazarVacacionEmpleado(dataItem).subscribe(
            data => {
                this.getVacaciones();
            },
            error => this.errorMessage = <any>error
        );
    }
    onAprobarHorasExtras(dataItem: HorasExtra): void{
        this.empleadoService.aprobarHorasExtraEmpleado(dataItem).subscribe(
            data => {
                this.getHorasExtras();
            },
            error => error
        );
    }
    onRechazarHorasExtras(dataItem: HorasExtra): void{
        this.empleadoService.rechazarHorasExtraEmpleado(dataItem).subscribe(
            data => {
                this.getHorasExtras();
            },
            error => error
        );
    }

    public chartClicked(eve:any):void {
        //this.getDashboardPrincipal();
        if(eve.active.length != 0) {
            let indexPieChartData = eve.active[0]._index;
            /*
             0 = Nro. De Empleados que marcaron a tiempo',
             1 = 'Nro. De Empleados que marcaron fuera de tiempo',
             2 = 'Nro. De Empleados sin marcaciones'];
             */
            //let valIndexSelected = eve.active[0]._chart.config.data.datasets[0].data[indexPieChartData];
            this.busquedaMarcacionesJefe.tipoMarcacion = indexPieChartData;
            this.dashBoardService.buscarMarcacionesDashboardJefe(this.busquedaMarcacionesJefe)
                .subscribe(
                    data => {
                        this.marcaciones = data;
                        this.busquedaMarcacionesJefe.tipoMarcacion = 'E';
                        this.obtenerMarcaciones();
                    },
                    error => {
                        this.errorMessage = 'Service error';
                    });
        }
    }

    private onRefreshFiltro(){
        this.departamentoSelect = this.defaultItemDepartamento;
        this.departamentoArea = null;
        this.busquedaMarcacionesJefe.unidadNegocio = '';
        this.busquedaMarcacionesJefe.departamento = '';
        this.busquedaMarcacionesJefe.proyecto = '';

        this.proyectoSelect = this.defaultItemProyecto;
        this.proyecto =null;

        this.busquedaMarcacionesJefe.unidadNegocio = null;
        if(this.busquedaMarcacionesJefe.tipoMarcacion == null || this.busquedaMarcacionesJefe.tipoMarcacion === undefined){
            this.busquedaMarcacionesJefe.tipoMarcacion = 'E';
        }
        this.getDashboardPrincipal();

    }

}
