import {Component, OnInit, ViewChild} from "@angular/core";
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {PermisoFilter} from "../../+dto/permisoFilter";
import {GridDataResult, PageChangeEvent} from "@progress/kendo-angular-grid";
import {CargoService} from "../../+common/service/cargo.service";
import {EmpleadoService} from "../../+common/service/empleado.service";

import {Router} from "@angular/router";

import {environment} from "../../../environments/environment";
import {CompleterData, CompleterService} from "ng2-completer";
import {Empleado} from "../../+dto/maintenance/empleado";
import {EnumRolEmpleado} from "../../+enums/EnumRolEmpleado";
import {LocalStorageGlobal} from "../../+dto/localStorageDto";
import {Subscription} from "rxjs";
import {DepartamentoAreaCombo} from "../../+dto/departamentoAreaCombo";
import {StoreSessionFilter} from "../../+dto/storeSessionFilter";
import {PermisoEmpleadoResult} from "../../+dto/permisoEmpleadoResult";
import {PermisoEmpleado} from "../../+dto/maintenance/permisoEmpleado";
import {PermisoService} from "../../+common/service/permiso.service";
import {UnidadDeNegocioCombo} from "../../+dto/unidadDeNegocioCombo";
import {StorageResult} from "../../+dto/storageResult";
import {ProyectoCombo} from "../../+dto/proyectoCombo";
import {Http} from "@angular/http";
import {ComponentBase} from "../../+common/service/componentBase";
import {PermisoEmpleadoQuickFilter} from "../../+dto/permisoEmpleadoQuickFilter";
import {MotivoRechazoComponent} from "../+administrar-permisos/motivoRechazo";
import {MotivoRechazoBusquedaComponent} from "./motivoRechazoDesdeBusqueda";
import {AssignedRole} from "../../+dto/assignedRole";
import {BackendService} from "../../+rest/backend.service";
import {ConfirmDialogComponent} from "../../shared/confirm/confirmDialogBase";


@Component({
    selector: 'busqueda-permisos',
    templateUrl: 'busqueda.permisos.component.html'
})
export class BusquedaPermisosComponent extends ComponentBase implements OnInit {

    busy: Subscription;
    public unidadDeNegocio: UnidadDeNegocioCombo[];
    public proyecto: ProyectoCombo[];
    public departamentoArea: DepartamentoAreaCombo[];
    public unidadNegocioSelect: UnidadDeNegocioCombo;
    public departamentoSelect: DepartamentoAreaCombo;
    public proyectoSelect: ProyectoCombo;
    public estadosSelect: TablaGeneralResult;
    public defaultItemUndNegocio: UnidadDeNegocioCombo = {idUnidadDeNegocio: null, nombre: 'Todos'};

    public defaultItemTablaGeneral: TablaGeneralResult = {codigo: null, nombre: 'Todos', grupo:null};

    public defaultItemDepartamento: DepartamentoAreaCombo = {idDepartamentoArea: null,idUnidadDeNegocio: null, nombre: 'Todos'};
    public defaultItemProyecto: ProyectoCombo = {idProyecto: null,idDepartamentoArea:null, nombre: 'Todos'};

    busquedaPermisos: PermisoFilter = new PermisoFilter();
    storeSessionFilter: StoreSessionFilter = new StoreSessionFilter();
    public permisos: PermisoEmpleadoResult[] = [];
    public estados:TablaGeneralResult[];

    private gridView: GridDataResult;
    private pageSize: number = 10;
    private data: Object[];
    private skip: number = 0;

    //dataItem: PermisoE;
    public isEmpty:boolean = true;
    public isSearch: boolean = false;
    public isJefe : boolean=false;
    public isRhana:boolean= false;

    quickFilter: PermisoEmpleadoQuickFilter = new PermisoEmpleadoQuickFilter();
    //Autocomplete

    private dataServiceEmpleado:CompleterData;

    private dataServiceJefeInmediato:CompleterData;

    localhost:  String = environment.backend;
    port: String = environment.port;
    @ViewChild(MotivoRechazoBusquedaComponent) protected motivoRechazoComponent: MotivoRechazoBusquedaComponent;

    constructor(private empleadoService: EmpleadoService,
                private permisoService:PermisoService,
                public backendService: BackendService,
                private _router: Router,
                private completerService: CompleterService){
        super(backendService,'GT001');

        this.dataServiceEmpleado = completerService.remote(this.urlAutocompleteEmpleado,'nombreEmpleado','nombreEmpleado');

        this.dataServiceJefeInmediato = completerService.remote(this.urlAutocompleteEmpleado,'nombreEmpleado','nombreEmpleado');

        let empleado: Empleado = this.empleadoService.retrieveSessionStorage('entityGestionarPermiso');

        if(empleado === undefined || empleado == null || empleado.idEmpleado == null){
            this.busquedaPermisos.idEmpleado = null;
        }else{
            this.busquedaPermisos.idEmpleado = empleado.idEmpleado;
        }

        this.esJefe();
        this.esRhana();
        this.onSubmit();
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

    selectEmpleado(e){
        if(e !=null)
            this.busquedaPermisos.idEmpleado = e.originalObject.idEmpleado;
        else
            this.busquedaPermisos.idEmpleado = null;
    }

    selectJefeInmediato(e){
        if(e !=null)
            this.busquedaPermisos.idJefeInmediato = e.originalObject.idEmpleado;
        else
            this.busquedaPermisos.idJefeInmediato = null;
    }

    onLimpiar(){
        this.busquedaPermisos.nombreEmpleado = undefined;
        this.busquedaPermisos.desde = undefined;
        this.busquedaPermisos.hasta = undefined;
        this.busquedaPermisos.jefeInmediato = undefined;
        this.busquedaPermisos.codigoPermiso = undefined;

        this.busquedaPermisos.idJefeInmediato = null;
        this.busquedaPermisos.idEmpleado = null;

        this.unidadNegocioSelect = this.defaultItemUndNegocio;
        this.departamentoSelect = this.defaultItemDepartamento;
        this.departamentoArea = null;
        this.proyectoSelect = this.defaultItemProyecto;
        this.proyecto= null;

        this.estadosSelect = this.defaultItemTablaGeneral;

        this.gridView = {
            data: [],
            total: 0
        };
    }



    onSubmit(){

        this.validarValoresSeleccionados();
        this.getPermisos();

    }

    onQuickSearck() {
        this.busquedaRapidaPermiso();
    }

    private busquedaRapidaPermiso() {

        this.currentUser  = JSON.parse(sessionStorage.getItem("authenticatedUser") || '{}');
        if(this.isJefe && !this.isRhana) {
            this.quickFilter.idEmpleado = this.currentUser.idEmpleado;

        }

        this.busy = this.permisoService.busquedaRapidaPermisoEmpleado(this.quickFilter).subscribe(
            data => {
                this.isSearch = true;
                this.permisos = data;
                this.skip = 0;

                this.obtenerPermisos()
            },
            error => this.errorMessage = <any>error
        );
    }

    private getPermisos() {


        this.currentUser  = JSON.parse(sessionStorage.getItem("authenticatedUser") || '{}');
        if(this.isJefe && !this.isRhana) {
            this.busquedaPermisos.idJefe = this.currentUser.idEmpleado;
        }

        this.busy = this.permisoService.buscarPermisoEmpleado(this.busquedaPermisos).subscribe(
            data => {
                this.isSearch = true;
                this.permisos = data;
                this.skip = 0;

                this.obtenerPermisos()
            },
            error => this.errorMessage = <any>error
        );
    }

    public onEdit(dataItem: any): void {
        this.storeSessionFilter.isNew = false;
        this.storeSessionFilter.idTableFilter = dataItem.idPermisoEmpleado;
        this.empleadoService.storeSessionStorage('editPermisoEmpleadoResult',this.storeSessionFilter);

        this._router.navigate(['/gestionTiempo/administrarPermiso']);

    }

    onDelete(dataItem: PermisoEmpleado): void {

        this.empleadoService.eliminarPermisoEmpleado(dataItem).subscribe(
            data => {

            this.backendService.notification(this.msgs, data);

            if (data.codigo == 1) {
                this.getPermisos();
            }

        },
            error => {
                this.backendService.notification(this.msgs, error);
            }
        );
    }
    onAprobar(dataItem: PermisoEmpleado): void {

        this.empleadoService.aprobarPermisoEmpleado(dataItem).subscribe(
            data => {
                this.getPermisos();
            },
            error => this.errorMessage = <any>error
        );
    }
    onRechazar(dataItem: PermisoEmpleado): void {

        this.empleadoService.rechazarPermisoEmpleado(dataItem).subscribe(
            data => {
                this.getPermisos();
            },
            error => this.errorMessage = <any>error
        );
    }

    private obtenerPermisos(): void {
        if(this.permisos.length>0){
            this.isEmpty=false;
            this.gridView = {
                data: this.permisos.slice(this.skip, this.skip + this.pageSize),
                total: this.permisos.length
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

        if (this.busquedaPermisos.nombreEmpleado === undefined) this.busquedaPermisos.nombreEmpleado = '';
        if (this.busquedaPermisos.desde === undefined) this.busquedaPermisos.desde = '';
        if (this.busquedaPermisos.hasta === undefined) this.busquedaPermisos.hasta = '';
        if (this.busquedaPermisos.codigoPermiso === undefined) this.busquedaPermisos.codigoPermiso = '';
        if (this.busquedaPermisos.jefeInmediato === undefined) this.busquedaPermisos.jefeInmediato = '';

        this.unidadNegocioSelect === undefined ? this.busquedaPermisos.unidadNegocio = ''
            : this.busquedaPermisos.unidadNegocio = (this.unidadNegocioSelect.idUnidadDeNegocio == null ?  '': this.unidadNegocioSelect.idUnidadDeNegocio.toString());;

        this.departamentoSelect === undefined ? this.busquedaPermisos.departamento = ''
            : this.busquedaPermisos.departamento = (this.departamentoSelect.idDepartamentoArea == null ?  '': this.departamentoSelect.idDepartamentoArea.toString());

        this.proyectoSelect === undefined ? this.busquedaPermisos.proyecto = ''
            : this.busquedaPermisos.proyecto = (this.proyectoSelect.idProyecto == null ?  '': this.proyectoSelect.idProyecto.toString());
    }

    onChangeFechaDesde(value){
        if(value.type == 'change'){
            return;
        }
        this.busquedaPermisos.desde = value;
    }

    onChangeFechaHasta(value){
        if(value.type == 'change'){
            return;
        }
        this.busquedaPermisos.hasta = value;
    }

    onChangeQuickSearhFechaDesde(value){
        if(value.type == 'change'){
            return;
        }
        this.quickFilter.desde = value;
    }

    onChangeQuickSearhFechaHasta(value){
        if(value.type == 'change'){
            return;
        }
        this.quickFilter.hasta = value;
    }

    private getUnidadDeNegocio() {
        /*this.cargoService.completarComboUndNegocio().subscribe(
         undnegocios => this.undnegocios = undnegocios,
         error => this.errorMessage = <any>error
         );*/
        this.unidadDeNegocio = this.storageCommomnValueResult.unidadDeNegocio;
    }

    private obtenerDepartamentos(idUndNegocio: number) {
        /*this.cargoService.completarComboDepa(idUndNegocio).subscribe(
         departamentoDto => this.departamentos = departamentoDto,
         error => this.errorMessage = <any>error);*/
        this.departamentoArea = this.storageCommomnValueResult.departamentoArea.filter(depa => idUndNegocio === depa.idUnidadDeNegocio);
    }

    private obtenerProyecto(idDepartamentoArea: number) {
        /*this.cargoService.completarComboProyecto(idDepartamentoArea).subscribe(
         proyectoDto => this.proyectos = proyectoDto,
         error => this.errorMessage = <any>error);*/
        this.proyecto = this.storageCommomnValueResult.proyecto.filter(proyect => idDepartamentoArea === proyect.idDepartamentoArea);
    }

    private getEmpleadoEstados() {
        this.estados = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Permiso.Estado' === grupo.grupo);
    }

    actualizarDpto(value): void {

        let codigo: any = value.idUnidadDeNegocio;
        this.departamentoSelect = this.defaultItemDepartamento;
        if(value == null){
            this.departamentoArea = null;
        }else {
            this.obtenerDepartamentos(codigo);
        }
        this.proyectoSelect = this.defaultItemProyecto;
        this.proyecto =null;

    }

    actualizarProyecto(value): void {
        let codigo: any = value.idDepartamentoArea;
        this.obtenerProyecto(codigo);
        this.proyectoSelect = this.defaultItemProyecto;
    }
    protected pageChangePermisos(event: PageChangeEvent): void {
        this.skip = event.skip;
        this.obtenerPermisos();

    }
    public cargarMotivoRechazo(permisoEmpleado:PermisoEmpleado): void {
        this.motivoRechazoComponent.titulo="Denegacion"
        this.motivoRechazoComponent.dataItem=permisoEmpleado;
        this.motivoRechazoComponent.onShow();

    }

    @ViewChild(ConfirmDialogComponent) private confirmDialogComponent: ConfirmDialogComponent;

    public confirm(dataItem:PermisoEmpleado): void {
        this.confirmDialogComponent.titulo="Eliminar Permiso";
        this.confirmDialogComponent.dataItem=dataItem;
        this.confirmDialogComponent.onShow();

    }

    validateFilterEmptyEmpleado(e){
        if ((e.which && e.which == 8) || (e.which && e.which == 46) || (e.keyCode && e.keyCode == 8) || (e.keyCode && e.keyCode == 46)) {
            if(e.srcElement.value == ''){
                this.busquedaPermisos.idEmpleado = null;
                this.busquedaPermisos.nombreEmpleado = undefined;
            }
        }
        return true;
    }

    validateFilterEmptyJefeInmediato(e){
        if ((e.which && e.which == 8) || (e.which && e.which == 46) || (e.keyCode && e.keyCode == 8) || (e.keyCode && e.keyCode == 46)) {
            if(e.srcElement.value == ''){
                this.busquedaPermisos.idJefeInmediato = null;
                this.busquedaPermisos.jefeInmediato = undefined;
            }
        }
        return true;
    }

}
