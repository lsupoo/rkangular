import {Component, OnInit} from "@angular/core";
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {Http} from "@angular/http";
import {ComponentBase} from "../../+common/service/componentBase";
import {StoreSessionFilter} from "../../+dto/storeSessionFilter";
import {PieChartDataResult} from "../../+dto/pieChartDataResult";
import {MarcacionDashboardResult} from "../../+dto/marcacionDashboardResult";
import {GridDataResult, PageChangeEvent} from "@progress/kendo-angular-grid";
import {VacacionResult} from "../../+dto/vacacionResult";
import {PermisoEmpleadoResult} from "../../+dto/permisoEmpleadoResult";
import {Subscription, Observable} from "rxjs";
import {DashBoardService} from "../../+common/service/dashboard.service";
import {Router} from "@angular/router";
import {HorasExtraResult} from "../../+dto/horasExtraResult";
import {Color} from "ng2-charts";
import {MarcacionDashboardEmpleadoFilter} from "../../+dto/marcacionDashboardEmpleadoFilter";
import {PermisoService} from "../../+common/service/permiso.service";
import {Message} from "primeng/components/common/api";
import {ExpressionRegularValidate} from "../../+common/Utils/expressionRegularValidate";
import {Empleado} from "../../+dto/maintenance/empleado";
import {Vacacion} from "../../+dto/maintenance/vacacion";
import {IndicadorRRHHResultViewModel} from "../../+dto/indicadorRRHHResultViewModel";
import {BackendService} from "../../+rest/backend.service";
import 'chart.js'
declare var $: any;
var moment = require('moment');

@Component({
    selector: 'dashboard-empleado',
    templateUrl: 'principal.empleado.component.html'
})
export class DashboardEmpleadoComponent extends ComponentBase implements OnInit {

    busy: Subscription;
    msgs: Message[] = [];

    public tipoMarcacion: TablaGeneralResult[];

    public selectedPrimitive: string = 'E';
    public permisos: PermisoEmpleadoResult[] = [];
    public vacacion: VacacionResult[] = [];
    public horasExtras: HorasExtraResult[] = [];

    busquedaMarcacionEmpleado: MarcacionDashboardEmpleadoFilter = new MarcacionDashboardEmpleadoFilter();
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

    public isEmpty: boolean = true;

    public marcaciones: MarcacionDashboardResult[] = [];
    public pieChartDataResult: PieChartDataResult = new PieChartDataResult();

    public pieChartLabels: string[] = ['Empleados sin tardanza',
        'Empleados con tardanza',
        'Empleados sin marcaci&oacute;n'];

    public pieChartData: number[] = [this.pieChartDataResult.nroEmpleadosMarcacionTiempo,
        this.pieChartDataResult.nroEmpleadosMarcacionFueraTiempo,
        this.pieChartDataResult.nroEmpleadosSinMarcacion];


    storeSessionFilter: StoreSessionFilter = new StoreSessionFilter();
    //Tardanza
    private isTemprano: boolean;
    private marcaste: boolean;
    private esPersonalConfianza: boolean = false;
    private tardanzasXmes: number;
    private inasistenciasXmes: number;
    private horasPendientesPorCompensar: number;
    private minutosTardanzaXdia: number;
    private minutosTardanzaXmes: number;
    private agendarVacacion: Vacacion = new Vacacion();
    private empleado:Empleado = new Empleado();

    private isVacacion: boolean;
    private isLicencia: boolean;
    private isInasistencia: boolean;
    private isSinMarcacion: boolean;

    constructor(public backendService: BackendService,
                private dashBoardService: DashBoardService,
                private permisoService: PermisoService,
                private _router: Router,
                private empleadoService: EmpleadoService) {
        super(backendService, 'DA001');

        this.currentUser = JSON.parse(sessionStorage.getItem("authenticatedUser") || '{}');
        this.busquedaMarcacionEmpleado.idEmpleado = this.currentUser.idEmpleado;
        /*this.busquedaMarcacionEmpleado.desde = moment().subtract(7, 'days').format('DD/MM/YYYY');
         this.busquedaMarcacionEmpleado.hasta = moment().format('DD/MM/YYYY');*/

        this.getPermisos();
        this.getVacaciones();
        this.getHorasExtras();
        this.getIndicadorEmpleado();
        this.empleado.idEmpleado = this.currentUser.idEmpleado;
        this.obtenerDiasDisponibles(this.empleado);
    }

    ngOnInit() {
    }

    /* TAB PERMISO*/
    private getPermisos() {
        this.busy = this.dashBoardService.buscarPermisoDashboardEmpleado(this.busquedaMarcacionEmpleado).subscribe(
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

        if (this.permisos.length > 0) {
            this.gridViewPermiso = {
                data: this.permisos.slice(this.skipPermiso, this.skipPermiso + this.pageSizePermiso),
                total: this.permisos.length
            };

        } else {

            this.gridViewPermiso = {
                data: [],
                total: 0
            };
        }

    }

    /*TAB VACACION*/
    private getVacaciones() {
        this.busy = this.dashBoardService.buscarVacacionesDashboardEmpleado(this.busquedaMarcacionEmpleado).subscribe(
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

        if (this.vacacion.length > 0) {
            this.gridViewVacacion = {
                data: this.vacacion.slice(this.skipVacacion, this.skipVacacion + this.pageSizeVacacion),
                total: this.vacacion.length
            };
        } else {

            this.gridViewVacacion = {
                data: [],
                total: 0
            };
        }

    }

    /*TAB HORASEXTRAS*/
    private getHorasExtras() {
        this.busy = this.dashBoardService.buscarHorasExtrasDashboardEmpleado(this.busquedaMarcacionEmpleado).subscribe(
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

        if (this.horasExtras.length > 0) {
            this.gridViewHorasExtras = {
                data: this.horasExtras.slice(this.skipHorasExtras, this.skipHorasExtras + this.pageSizeHorasExtras),
                total: this.horasExtras.length
            };
        } else {

            this.gridViewHorasExtras = {
                data: [],
                total: 0
            };
        }

    }

    cleanGridView() {
        this.gridView = {
            data: [],
            total: 0
        };
    }

    private getIndicadorEmpleado() {
        this.dashBoardService.buscarEmpleadoIndicadorDashBoardEmpleado(this.busquedaMarcacionEmpleado).subscribe(
            data => {
                this.loadIndicadorEmpleado(data);
            },
            error => {
                this.errorMessage = 'Service error';
            }
        );
    }

    private loadIndicadorEmpleado(data: PieChartDataResult[]){

        this.pieChartDataResult = data;
        if(this.pieChartDataResult[0].isPersonalConfianza > 0){
            this.esPersonalConfianza = true;
            if(this.pieChartDataResult[0].countIsVacacion>0){
                this.isVacacion = true;
                return;
            }
            if(this.pieChartDataResult[0].countIsLicencia>0){
                this.isLicencia = true;
                return;
            }
            if(this.pieChartDataResult[0].countIsInasistencia>0){
                this.isInasistencia = true;
                return;
            }
            this.inasistenciasXmes = this.pieChartDataResult[0].nroEmpleadosSinMarcacion;
            if(this.pieChartDataResult[0].nroEmpleadosMarcacionTiempo > 0 && this.pieChartDataResult[0].nroEmpleadosMarcacionFueraTiempo > 0){
                //marcaste
                this.marcaste = true;
            }else{
                this.marcaste = false;
            }

        }else{
            /*Si tiene el flag Vacaciones marcado: se muestra "Vacaciones".
              Si tiene el flag Licencia marcado: se muestra "Licencia".
              Si tiene el flag Inasistencia marcado: se muestra "Inasistencia".
              Si tiene la marcacion de entrada y el flag de Tardanza no esta marcado: se muestra el cuadro azul con el texto "Llegaste temprano"
              Si tiene la marcacion de entrada y el flag de Tardanza esta marcado: se muestra el cuadro rojo con el texto "Llegaste tarde X minutos"*/
            if(this.pieChartDataResult[0].countIsVacacion>0){
                this.isVacacion = true;
                return;
            }
            if(this.pieChartDataResult[0].countIsLicencia>0){
                this.isLicencia = true;
                return;
            }
            if(this.pieChartDataResult[0].countIsInasistencia>0){
                this.isInasistencia = true;
                return;
            }
            this.tardanzasXmes = this.pieChartDataResult[0].nroEmpleadosMarcacionFueraTiempo;
            this.minutosTardanzaXmes = this.pieChartDataResult[0].minutosTardanzaXmes;
            this.inasistenciasXmes = this.pieChartDataResult[0].nroEmpleadosSinMarcacion;
            this.horasPendientesPorCompensar = this.pieChartDataResult[0].horasPendientesCompensar;

            if(this.pieChartDataResult[0].nroEmpleadosMarcacionTiempo > 0){
                this.isTemprano = true;
            }else{
                if(this.pieChartDataResult[0].minutosTardanzaXdia > 0){
                    this.isTemprano = false;
                    this.minutosTardanzaXdia = this.pieChartDataResult[0].minutosTardanzaXdia;
                }else{
                    this.marcaste = false;
                }
            }

        }
    }

    private obtenerDiasDisponibles(empleado: Empleado) {
        this.permisoService.obtenerDiasDisponiblesDeVacacion(empleado).subscribe(
            diasDisponibles => this.agendarVacacion.diasVacacionesDisponibles = diasDisponibles.diasVacacionesDisponibles,
            error =>  this.errorMessage = <any>error);
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

    private onEditPermiso(dataItem: any): void {
        this.storeSessionFilter.isNew = false;
        this.storeSessionFilter.idTableFilter = dataItem.idPermisoEmpleado;
        this.empleadoService.storeSessionStorage('editPermisoEmpleadoResult',this.storeSessionFilter);

        this._router.navigate(['/gestionTiempo/administrarPermiso']);


    }
    private onDeletePermiso(dataItem: PermisoEmpleadoResult): void {

        this.dashBoardService.eliminarPermisoEmpleado(dataItem).subscribe(
            data => {
                this.getPermisos();
            },
            error => this.errorMessage = <any>error
        );
    }
    private onSendPermiso(dataItem: any): void {
        this.permisoService.enviarPermisoEmpleado(dataItem).subscribe(
            data => {
                this.getPermisos();

            },
            error => error
        );
    }

    private onEditVacacion(dataItem: any): void {

        this.storeSessionFilter.isNew = false;
        this.storeSessionFilter.idTableFilter = dataItem.idVacacion;
        this.empleadoService.storeSessionStorage('editVacacionResult',this.storeSessionFilter);
        if(dataItem.estado == 'Pendiente'){
            this._router.navigate(['/gestionTiempo/administrarVacaciones']);

        }else if(dataItem.estado == 'Enviado'){
            this._router.navigate(['/gestionTiempo/administrarVacaciones']);

        }else if(dataItem.estado == 'Aprobado'){
            this._router.navigate(['/gestionTiempo/administrarVacaciones']);

        }else if(dataItem.estado == 'Rechazado'){
            this._router.navigate(['/gestionTiempo/administrarVacaciones']);
        }
    }

    private onDeleteVacacion(dataItem: any): void {
        this.empleadoService.eliminarVacacionEmpleado(dataItem).subscribe(
            data => {
                this.getVacaciones();
            },
            error => this.errorMessage = <any>error
        );
    }

    private onSendVacacion(dataItem: any): void {
        this.empleadoService.enviarVacacionEmpleado(dataItem).subscribe(
            data => {
                this.getVacaciones();

            },
            error => error
        );
    }

    private onViewHorasExtras(dataItem: any): void {
        this.storeSessionFilter.isNew = false;
        this.storeSessionFilter.idTableFilter = dataItem.idHorasExtra;
        this.empleadoService.storeSessionStorage('editHorasExtraResult',this.storeSessionFilter);
        this._router.navigate(['/gestionTiempo/administrarHorasExtra']);
    }

    // events
    public chartClicked(eve:any):void {

        let indexPieChartData = eve.active[0]._index;
        /*
         0 = Nro. De Empleados que marcaron a tiempo',
         1 = 'Nro. De Empleados que marcaron fuera de tiempo',
         2 = 'Nro. De Empleados sin marcaciones'];
         */
        //let valIndexSelected = eve.active[0]._chart.config.data.datasets[0].data[indexPieChartData];
        this.busquedaMarcacionEmpleado.tipoMarcacion = indexPieChartData;
        this.dashBoardService.buscarMarcacionesDashboardEmpleado(this.busquedaMarcacionEmpleado)
            .subscribe(
                data => {
                    this.marcaciones = data;
                    this.busquedaMarcacionEmpleado.tipoMarcacion = 'E';
                    this.obtenerMarcaciones();
                },
                error => {
                    this.errorMessage = 'Service error';
                });
    }

    /*searchDateParameter() {

     if (!this.isValidadCharacterDate)
     return;
     if (this.busquedaMarcacionEmpleado.desde == null || this.busquedaMarcacionEmpleado.desde === undefined) {
     this.busquedaMarcacionEmpleado.desde = this.inputDateInicioDatePicker;
     }
     if (this.busquedaMarcacionEmpleado.hasta == null || this.busquedaMarcacionEmpleado.hasta === undefined) {
     this.busquedaMarcacionEmpleado.hasta = this.inputDateFinDatePicker;
     }
     $('#datepickerDesde').removeClass('state-error');
     $('#datepickerDesde').parent().removeClass('state-error');
     $('#datepickerHasta').removeClass('state-error');
     $('#datepickerHasta').parent().removeClass('state-error');
     if (this.busquedaMarcacionEmpleado.tipoMarcacion == null || this.busquedaMarcacionEmpleado.tipoMarcacion === undefined) {
     this.busquedaMarcacionEmpleado.tipoMarcacion = 'E';
     }
     this.getDashboardPrincipal();

     }*/

    /*onChangeFechaDesde(value) {

     if (value.type == 'change') {
     return;
     }
     let validateFormat = value === undefined ? true : ExpressionRegularValidate.isValidateDateInput(value);
     if (validateFormat) {
     this.busquedaMarcacionEmpleado.desde = value;
     if (this.busquedaMarcacionEmpleado.tipoMarcacion == null || this.busquedaMarcacionEmpleado.tipoMarcacion === undefined) {
     this.busquedaMarcacionEmpleado.tipoMarcacion = 'E';
     }
     this.getDashboardPrincipal();
     } else {
     this.msgs.push({severity: 'error', summary: 'Ingrese una Fecha Inicio valida', detail: 'Runakuna Error'});
     $('#datepickerDesde').addClass('invalid').removeClass('required');
     $('#datepickerDesde').parent().addClass('state-error').removeClass('state-success');
     return;
     }
     }*/

    /*onChangeFechaHasta(value) {

     if (value.type == 'change') {
     return;
     }
     let validateFormat = value === undefined ? true : ExpressionRegularValidate.isValidateDateInput(value);
     if (validateFormat) {
     this.busquedaMarcacionEmpleado.hasta = value;
     if (this.busquedaMarcacionEmpleado.tipoMarcacion == null || this.busquedaMarcacionEmpleado.tipoMarcacion === undefined) {
     this.busquedaMarcacionEmpleado.tipoMarcacion = 'E';
     }
     this.getDashboardPrincipal();
     } else {
     this.msgs.push({severity: 'error', summary: 'Ingrese una Fecha Inicio valida', detail: 'Runakuna Error'});
     $('#datepickerHasta').addClass('invalid').removeClass('required');
     $('#datepickerHasta').parent().addClass('state-error').removeClass('state-success');
     return;
     }

     }*/

    /*private getTipoMarcacion() {
     this.tipoMarcacion = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Dashboard.TipoMarcacion' === grupo.grupo);
     }*/

    /*private getMarcaciones() {
     this.busy = this.dashBoardService.buscarMarcacionesDashboardEmpleado(this.busquedaMarcacionEmpleado).subscribe(
     data => {
     this.isSearch = true;
     this.marcaciones = data;
     this.skip = 0;

     this.obtenerMarcaciones();
     },
     error => this.errorMessage = <any>error
     );
     }*/

    /*private getDashboardPrincipal(){
     Observable.forkJoin(
     this.dashBoardService.buscarMarcacionesDashboardEmpleado(this.busquedaMarcacionEmpleado),
     this.dashBoardService.buscarMarcacionEmpleadoPieChartEmpleado(this.busquedaMarcacionEmpleado)
     ).subscribe(
     data => {
     this.marcaciones = data[0];
     this.obtenerMarcaciones();

     this.navegarPieChart(data[1]);
     this.isValidadCharacterDate = false;
     },
     error => {
     this.errorMessage = 'Service error';
     });
     }*/

    /*selectTipoMarcacion(value): void {

     let tipoMarcacionVal: any = value;
     this.busquedaMarcacionEmpleado.tipoMarcacion = tipoMarcacionVal;
     if (this.busquedaMarcacionEmpleado.tipoMarcacion == null || this.busquedaMarcacionEmpleado.tipoMarcacion === undefined) {
     this.busquedaMarcacionEmpleado.tipoMarcacion = 'E';
     }
     this.getDashboardPrincipal();
     }*/

}
