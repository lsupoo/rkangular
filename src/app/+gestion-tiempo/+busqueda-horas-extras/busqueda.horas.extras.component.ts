import {Component, OnInit} from "@angular/core";
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {HorasExtraFilter} from "../../+dto/horasExtraFilter";
import {Vacacion} from "../../+dto/maintenance/vacacion";
import {GridDataResult} from "@progress/kendo-angular-grid";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {Router} from "@angular/router";
import {environment} from "../../../environments/environment";
import {CompleterData, CompleterService} from "ng2-completer";
import {LocalStorageGlobal} from "../../+dto/localStorageDto";
import {Subscription} from "rxjs";
import {DepartamentoAreaCombo} from "../../+dto/departamentoAreaCombo";
import {HorasExtraResult} from "../../+dto/horasExtraResult";
import {HorasExtra} from "../../+dto/maintenance/horasExtra";
import {StoreSessionFilter} from "../../+dto/storeSessionFilter";
import {HorasExtraService} from "../../+common/service/horasExtra.service";
import {UnidadDeNegocioCombo} from "../../+dto/unidadDeNegocioCombo";
import {StorageResult} from "../../+dto/storageResult";
import {ProyectoCombo} from "../../+dto/proyectoCombo";
import {ComponentBase} from "../../+common/service/componentBase";
import {Http} from "@angular/http";
import {HorasExtraQuickFilter} from "../../+dto/horasExtraQuickFilter";
import {BackendService} from "../../+rest/backend.service";
import {ConfirmDialogComponent} from "../../shared/confirm/confirmDialogBase";
import {ViewChild} from "@angular/core/src/metadata/di";

@Component({
    selector: 'busqueda-horas-extras',
    templateUrl: 'busqueda.horas.extras.component.html'
})
export class BusquedaHorasExtrasComponent extends ComponentBase implements OnInit {

    busy: Subscription;
    public unidadDeNegocio: UnidadDeNegocioCombo[];
    public proyecto: ProyectoCombo[];
    public departamentoArea: DepartamentoAreaCombo[];
    public unidadNegocioSelect: UnidadDeNegocioCombo;
    public departamentoSelect: DepartamentoAreaCombo;
    public proyectoSelect: ProyectoCombo;
    public estadosSelect: TablaGeneralResult;
    public defaultItem: UnidadDeNegocioCombo = {idUnidadDeNegocio: null, nombre: 'Todos'};

    public defaultItemTablaGeneral: TablaGeneralResult = {codigo: null, nombre: 'Todos',grupo:null};

    public defaultItemDepartamento: DepartamentoAreaCombo = {idDepartamentoArea: null,idUnidadDeNegocio: null, nombre: 'Todos'};
    public defaultItemProyecto: ProyectoCombo = {idProyecto: null, idDepartamentoArea:null, nombre: 'Todos'};

    busquedaHorasExtras: HorasExtraFilter = new HorasExtraFilter();
    public horasExtraResult: HorasExtraResult[] = [];
    public estados:TablaGeneralResult[];

    private gridView: GridDataResult;
    private pageSize: number = 10;
    private data: Object[];
    private skip: number = 0;

    dataItem: Vacacion;
    public isEmpty:boolean = true;
    public isSearch: boolean = false;
    public isRhana:boolean= false;
    private dataServiceEmpleado:CompleterData;

    private dataServiceJefeInmediato:CompleterData;

    localhost:  String = environment.backend;
    port: String = environment.port;

    quickFilter: HorasExtraQuickFilter = new HorasExtraQuickFilter();

    //localStorageValue: LocalStorageGlobal = new LocalStorageGlobal();
    storeSessionFilter: StoreSessionFilter = new StoreSessionFilter();
    //public storageCommomnValueResult: StorageResult = new StorageResult();

    urlBusquedaCodigoPermiso: string = 'http://'+this.localhost+':'+ this.port +'/empleado/busquedaCodigoPermiso?codigo=';

    constructor(private empleadoService: EmpleadoService,
                public backendService: BackendService,
                private horasExtraService: HorasExtraService,
                private _router: Router,
                private completerService: CompleterService){
        super(backendService,'GT006');
        this.dataServiceEmpleado = completerService.remote(this.urlAutocompleteEmpleado,'nombreEmpleado','nombreEmpleado');

        this.dataServiceJefeInmediato = completerService.remote(this.urlAutocompleteEmpleado,'nombreEmpleado','nombreEmpleado');

        let empleado: number = this.currentUser.idEmpleado;

        if(empleado === undefined || empleado == null){
            this.busquedaHorasExtras.idEmpleado = null;
        }/*else{
         this.busquedaHorasExtras.idEmpleado = this.currentUser.idEmpleado;
         }*/
        this.esRhana();
        this.onSubmit();
    }
    esRhana() {
        this.currentUser  = JSON.parse(sessionStorage.getItem("authenticatedUser") || '{}');
        var index;
        for(index=0;index<this.currentUser.assignedRoles.length;index++) {
            var r=this.currentUser.assignedRoles[index]
            if(r.assigned && r.roleName=='RHANA'){
                this.isRhana=true;
            }
        }
    }

    selectEmpleado(e){
        if(e !=null)
            this.busquedaHorasExtras.idEmpleado = e.originalObject.idEmpleado;
        else
            this.busquedaHorasExtras.idEmpleado = null;
    }

    selectJefeInmediato(e){
        if(e !=null)
            this.busquedaHorasExtras.idJefeInmediato = e.originalObject.idEmpleado;
        else
            this.busquedaHorasExtras.idJefeInmediato = null;
    }

    onLimpiar(){
        this.busquedaHorasExtras.nombreEmpleado = undefined;
        this.busquedaHorasExtras.fechaInicio = undefined;
        this.busquedaHorasExtras.fechaFin = undefined;
        this.busquedaHorasExtras.jefeInmediato = undefined;
        this.busquedaHorasExtras.idHorasExtra = undefined;

        this.busquedaHorasExtras.idJefeInmediato = null;
        this.busquedaHorasExtras.idEmpleado = null;

        this.unidadNegocioSelect = this.defaultItem;
        this.departamentoSelect = this.defaultItemDepartamento;
        this.departamentoArea = null;
        this.proyectoSelect = this.defaultItemProyecto;
        this.proyecto = null;

        this.estadosSelect = this.defaultItemTablaGeneral;


        this.gridView = {
            data: [],
            total: 0
        };
    }

    onSubmit(){
        this.validarValoresSeleccionados();
        this.getHorasExtra();

    }

    onQuickSearck(){
        this.busquedaRapidaHorasExtras();
    }

    private busquedaRapidaHorasExtras() {
        this.currentUser  = JSON.parse(sessionStorage.getItem("authenticatedUser") || '{}');
        var index;
        var esSoloJefe=true;

        for(index=0;index<this.currentUser.assignedRoles.length;index++) {
            var r=this.currentUser.assignedRoles[index]
            if(r.assigned && r.roleName=='RHANA'){
                esSoloJefe=false;
            }
        }
        if(esSoloJefe) {
            this.quickFilter.idJefeInmediato=this.currentUser.idEmpleado;
        }

        this.busy = this.horasExtraService.busquedaRapidaHorasExtrasEmpleado(this.quickFilter).subscribe(
            data => {
                this.isSearch = true;
                this.horasExtraResult = data;
                this.skip = 0;

                this.obtenerHorasExtra()
            },
            error => this.errorMessage = <any>error
        );
    }

    private getHorasExtra() {
        this.currentUser  = JSON.parse(sessionStorage.getItem("authenticatedUser") || '{}');
        var index;
        var esSoloJefe=true;

        for(index=0;index<this.currentUser.assignedRoles.length;index++) {
            var r=this.currentUser.assignedRoles[index]
            if(r.assigned && r.roleName=='RHANA'){
                esSoloJefe=false;
            }
        }
        if(esSoloJefe) {
            this.busquedaHorasExtras.idJefeInmediato=this.currentUser.idEmpleado;
        }

        this.busy = this.horasExtraService.buscarHorasExtrasEmpleado(this.busquedaHorasExtras).subscribe(
            data => {
                this.isSearch = true;
                this.horasExtraResult = data;
                this.skip = 0;

                this.obtenerHorasExtra()
            },
            error => this.errorMessage = <any>error
        );
    }

    public onEdit(dataItem: any): void {
        this.storeSessionFilter.isNew = false;
        this.storeSessionFilter.idTableFilter = dataItem.idHorasExtra;
        this.empleadoService.storeSessionStorage('editHorasExtraResult',this.storeSessionFilter);
        if(dataItem.estado == 'Pendiente'){
            this._router.navigate(['/gestionTiempo/administrarHorasExtra']);
        }else if(dataItem.estado == 'Aprobado'){
            this._router.navigate(['/gestionTiempo/administrarHorasExtra']);
        }else if(dataItem.estado == 'Denegado'){
            this._router.navigate(['/gestionTiempo/administrarHorasExtra']);
        }

    }

    onDelete(dataItem: HorasExtra): void {
        this.empleadoService.eliminarHorasExtraEmpleado(dataItem.idHorasExtra).subscribe(

            data => {

                this.backendService.notification(this.msgs, data);

                if (data.codigo == 1) {
                    this.getHorasExtra();
                }

            },
            error => {

                this.backendService.notification(this.msgs, error);
            }
        );
    }
    onAprobar(dataItem: HorasExtra): void{
        this.empleadoService.aprobarHorasExtraEmpleado(dataItem).subscribe(
            data => {
                this.getHorasExtra();
            },
            error => error
        );
    }
    onRechazar(dataItem: HorasExtra): void{
        this.empleadoService.rechazarHorasExtraEmpleado(dataItem).subscribe(
            data => {
                this.getHorasExtra();
            },
            error => error
        );
    }

    private obtenerHorasExtra(): void {

        if(this.horasExtraResult.length>0){
            this.isEmpty=false;
            this.gridView = {
                data: this.horasExtraResult.slice(this.skip, this.skip + this.pageSize),
                total: this.horasExtraResult.length
            };
        }else{
            this.isEmpty=true;

            this.gridView = {
                data: [],
                total: 0
            };
        }


    }


    ngOnInit() {
        this.getUnidadDeNegocio();
        this.getEmpleadoEstados();
    }


    private validarValoresSeleccionados() {

        if (this.busquedaHorasExtras.nombreEmpleado === undefined) this.busquedaHorasExtras.nombreEmpleado = '';
        if (this.busquedaHorasExtras.fechaInicio === undefined) this.busquedaHorasExtras.fechaInicio = '';
        if (this.busquedaHorasExtras.fechaInicio === undefined) this.busquedaHorasExtras.fechaFin = '';
        //if (this.busquedaHorasExtras.idHorasExtra === undefined) this.busquedaHorasExtras.idHorasExtra = '';
        if (this.busquedaHorasExtras.jefeInmediato === undefined) this.busquedaHorasExtras.jefeInmediato = '';


        (this.estadosSelect === undefined || this.estadosSelect == null) ? this.busquedaHorasExtras.estado = ''
            : this.busquedaHorasExtras.estado = this.estadosSelect.codigo;


        this.unidadNegocioSelect === undefined ? this.busquedaHorasExtras.unidadNegocio = ''
            : this.busquedaHorasExtras.unidadNegocio = (this.unidadNegocioSelect.idUnidadDeNegocio == null ?  '': this.unidadNegocioSelect.idUnidadDeNegocio.toString());;

        this.departamentoSelect === undefined ? this.busquedaHorasExtras.departamento = ''
            : this.busquedaHorasExtras.departamento = (this.departamentoSelect.idDepartamentoArea == null ?  '': this.departamentoSelect.idDepartamentoArea.toString());

        this.proyectoSelect === undefined ? this.busquedaHorasExtras.proyecto = ''
            : this.busquedaHorasExtras.proyecto = (this.proyectoSelect.idProyecto == null ?  '': this.proyectoSelect.idProyecto.toString());

    }


    onChangeFechaDesde(value){
        if(value.type == 'change'){
            return;
        }
        this.busquedaHorasExtras.fechaInicio = value;
    }

    onChangeFechaHasta(value){
        if(value.type == 'change'){
            return;
        }
        this.busquedaHorasExtras.fechaFin = value;
    }

    onChangeQuickSearhFechaDesde(value){
        if(value.type == 'change'){
            return;
        }
        this.quickFilter.fechaInicio = value;
    }

    onChangeQuickSearhFechaHasta(value){
        if(value.type == 'change'){
            return;
        }
        this.quickFilter.fechaFin = value;
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
        this.obtenerProyecto(codigo);

    }

    @ViewChild(ConfirmDialogComponent) private confirmDialogComponent: ConfirmDialogComponent;

    public confirm(dataItem:HorasExtra): void {
        this.confirmDialogComponent.titulo="Eliminar Horas Extra"
        this.confirmDialogComponent.dataItem=dataItem;
        this.confirmDialogComponent.onShow();

    }

    validateFilterEmptyEmpleado(e){
        if ((e.which && e.which == 8) || (e.which && e.which == 46) || (e.keyCode && e.keyCode == 8) || (e.keyCode && e.keyCode == 46)) {
            if(e.srcElement.value == ''){
                this.busquedaHorasExtras.idEmpleado = null;
                this.busquedaHorasExtras.nombreEmpleado = undefined;
            }
        }
        return true;
    }

    validateFilterEmptyJefeInmediato(e){
        if ((e.which && e.which == 8) || (e.which && e.which == 46) || (e.keyCode && e.keyCode == 8) || (e.keyCode && e.keyCode == 46)) {
            if(e.srcElement.value == ''){
                this.busquedaHorasExtras.idJefeInmediato = null;
                this.busquedaHorasExtras.jefeInmediato = undefined;
            }
        }
        return true;
    }
}