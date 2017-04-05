import {Component, OnInit, ViewChild} from "@angular/core";
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {VacacionFilter} from "../../+dto/vacacionFilter";
import {Vacacion} from "../../+dto/maintenance/vacacion";
import {GridDataResult, PageChangeEvent} from "@progress/kendo-angular-grid";
import {EmpleadoService} from "../../+common/service/empleado.service";

import {Router} from "@angular/router";
import {environment} from "../../../environments/environment";
import {CompleterData, CompleterService} from "ng2-completer";
import {Empleado} from "../../+dto/maintenance/empleado";
import {EnumRolEmpleado} from "../../+enums/EnumRolEmpleado";
import {LocalStorageGlobal} from "../../+dto/localStorageDto";
import {Subscription} from "rxjs";
import {VacacionResult} from "../../+dto/vacacionResult";
import {DepartamentoAreaCombo} from "../../+dto/departamentoAreaCombo";
import {StoreSessionFilter} from "../../+dto/storeSessionFilter";
import {VacacionService} from "../../+common/service/vacacion.service";
import {UnidadDeNegocioCombo} from "../../+dto/unidadDeNegocioCombo";
import {StorageResult} from "../../+dto/storageResult";
import {ProyectoCombo} from "../../+dto/proyectoCombo";
import {Http} from "@angular/http";
import {ComponentBase} from "../../+common/service/componentBase";
import {VacacionQuickFilter} from "../../+dto/vacacionQuickFilter";
import {MotivoRechazoVacacionBusquedaComponent} from "./motivoRechazoVacacionDesdeBusqueda";
import {BackendService} from "../../+rest/backend.service";
import {ConfirmDialogComponent} from "../../shared/confirm/confirmDialogBase";

@Component({
    selector: 'busqueda-vacacion',
    templateUrl: 'busqueda.vacacion.component.html'
})
export class BusquedaVacacionesComponent extends ComponentBase implements OnInit {

    busy: Subscription;
    public unidadDeNegocio: UnidadDeNegocioCombo[];
    public proyecto: ProyectoCombo[];
    public departamentoArea: DepartamentoAreaCombo[];
    public unidadNegocioSelect: UnidadDeNegocioCombo;
    public departamentoSelect: DepartamentoAreaCombo;
    public proyectoSelect: ProyectoCombo;
    public estadosSelect: TablaGeneralResult;
    public defaultItem: UnidadDeNegocioCombo = {idUnidadDeNegocio: null, nombre: 'Todos'};

    public defaultItemTablaGeneral: TablaGeneralResult = {codigo: null, nombre: 'Todos', grupo:null};

    public defaultItemDepartamento: DepartamentoAreaCombo = {idDepartamentoArea: null,idUnidadDeNegocio: null, nombre: 'Todos'};
    public defaultItemProyecto: ProyectoCombo = {idProyecto: null,idDepartamentoArea:null, nombre: 'Todos'};

    busquedaVacaciones: VacacionFilter = new VacacionFilter();
    public vacacion: VacacionResult[] = [];
    public estados:TablaGeneralResult[];

    private gridView: GridDataResult;
    private pageSize: number = 10;
    private data: Object[];
    private skip: number = 0;

    dataItem: Vacacion;
    public isEmpty:boolean = true;
    public isSearch: boolean = false;
    public isJefe : boolean=false;
    public isRhana:boolean= false;

    quickFilter:VacacionQuickFilter = new VacacionQuickFilter();

    //Autocomplete

    private dataServiceEmpleado:CompleterData;

    private dataServiceJefeInmediato:CompleterData;

    localhost:  String = environment.backend;
    port: String = environment.port;

    //localStorageValue: LocalStorageGlobal = new LocalStorageGlobal();
    storeSessionFilter: StoreSessionFilter = new StoreSessionFilter();

    urlBusquedaCodigoPermiso: string = 'http://'+this.localhost+':'+ this.port +'/empleado/busquedaCodigoPermiso?codigo=';
    @ViewChild(MotivoRechazoVacacionBusquedaComponent) protected motivoRechazoComponent: MotivoRechazoVacacionBusquedaComponent;

    constructor(private empleadoService: EmpleadoService,
                public backendService: BackendService,
                private vacacionService: VacacionService,
                private _router: Router, private completerService: CompleterService){
        super(backendService,'GT002');
        this.dataServiceEmpleado = completerService.remote(this.urlAutocompleteEmpleado,'nombreEmpleado','nombreEmpleado');

        this.dataServiceJefeInmediato = completerService.remote(this.urlAutocompleteEmpleado,'nombreEmpleado','nombreEmpleado');

        let empleado: Empleado = this.empleadoService.retrieveSessionStorage('entityGestionarVacacion');

        if(empleado === undefined || empleado == null || empleado.idEmpleado == null){
            this.busquedaVacaciones.idEmpleado = null;
        }else{
            this.busquedaVacaciones.idEmpleado = this.currentUser.idEmpleado;
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
            this.busquedaVacaciones.idEmpleado = e.originalObject.idEmpleado;
        else
            this.busquedaVacaciones.idEmpleado = null;
    }

    selectJefeInmediato(e){
        if(e !=null)
            this.busquedaVacaciones.idJefeInmediato = e.originalObject.idEmpleado;
        else
            this.busquedaVacaciones.idJefeInmediato = null;
    }

    onLimpiar(){
        this.busquedaVacaciones.nombreEmpleado = undefined;
        this.busquedaVacaciones.fechaInicio = undefined;
        this.busquedaVacaciones.fechaFin = undefined;
        this.busquedaVacaciones.jefeInmediato = undefined;
        this.busquedaVacaciones.idVacacion = undefined;

        this.busquedaVacaciones.idJefeInmediato = null;
        this.busquedaVacaciones.idEmpleado = null;

        this.unidadNegocioSelect = this.defaultItem;
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
        this.getVacaciones();
    }

    onQuickSearck() {
        this.busquedaRapidaVacaciones();
    }

    private getVacaciones() {

        this.currentUser  = JSON.parse(sessionStorage.getItem("authenticatedUser") || '{}');
        if(this.isJefe && !this.isRhana) {
            this.busquedaVacaciones.idJefe = this.currentUser.idEmpleado;
        }

        this.busy = this.vacacionService.buscarVacacionesEmpleado(this.busquedaVacaciones).subscribe(
            data => {
                this.isSearch = true;
                this.vacacion = data;
                this.skip = 0;

                this.obtenerVacaciones()
            },
            error => this.errorMessage = <any>error
        );
    }

    private busquedaRapidaVacaciones() {
        this.currentUser  = JSON.parse(sessionStorage.getItem("authenticatedUser") || '{}');
        if(this.isJefe && !this.isRhana) {
            this.quickFilter.idEmpleado = this.currentUser.idEmpleado;
        }

        this.busy = this.vacacionService.busquedaRapidaVacaciones(this.quickFilter).subscribe(
            data => {
                this.isSearch = true;
                this.vacacion = data;
                this.skip = 0;

                this.obtenerVacaciones()
            },
            error => this.errorMessage = <any>error
        );
    }

    public onRegularizarVacacion(): void{
        this.storeSessionFilter.isNew = true;
        this.storeSessionFilter.editByRRHH = true;
        this.empleadoService.storeSessionStorage('editVacacionResult',this.storeSessionFilter);
        this._router.navigate(['/gestionTiempo/regularizarVacaciones']);
    }

    public onEdit(dataItem: any): void {

        this.storeSessionFilter.isNew = false;
        this.storeSessionFilter.idTableFilter = dataItem.idVacacion;
        this.empleadoService.storeSessionStorage('editVacacionResult',this.storeSessionFilter);
        this._router.navigate(['/gestionTiempo/administrarVacaciones']);
    }

    onDelete(dataItem: Vacacion): void {

        //VERIFICAR ELIMINAR, APROBAR Y RECHAZAR VACACION

        this.empleadoService.eliminarVacacionEmpleado(dataItem).subscribe(

            data => {

                this.backendService.notification(this.msgs, data);

                if (data.codigo == 1) {
                    this.getVacaciones();
                }

            },
            error => {
                this.backendService.notification(this.msgs, error);
            }
        );
    }
    onAprobar(dataItem: Vacacion): void {
        this.empleadoService.aprobarVacacionEmpleado(dataItem).subscribe(
            data => {
                this.getVacaciones();
            },
            error => this.errorMessage = <any>error
        );
    }

    onRechazar(dataItem: Vacacion): void {

        this.empleadoService.rechazarVacacionEmpleado(dataItem).subscribe(
            data => {
                this.getVacaciones();
            },
            error => this.errorMessage = <any>error
        );
    }

    private obtenerVacaciones(): void {
        if(this.vacacion.length>0){
            this.isEmpty=false;
            this.gridView = {
                data: this.vacacion.slice(this.skip, this.skip + this.pageSize),
                total: this.vacacion.length
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

        if (this.busquedaVacaciones.nombreEmpleado === undefined) this.busquedaVacaciones.nombreEmpleado = '';
        if (this.busquedaVacaciones.fechaInicio === undefined) this.busquedaVacaciones.fechaInicio = '';
        if (this.busquedaVacaciones.fechaInicio === undefined) this.busquedaVacaciones.fechaFin = '';
        if (this.busquedaVacaciones.jefeInmediato === undefined) this.busquedaVacaciones.jefeInmediato = '';

        this.unidadNegocioSelect === undefined ? this.busquedaVacaciones.unidadNegocio = ''
            : this.busquedaVacaciones.unidadNegocio = (this.unidadNegocioSelect.idUnidadDeNegocio == null ?  '': this.unidadNegocioSelect.idUnidadDeNegocio.toString());;

        this.departamentoSelect === undefined ? this.busquedaVacaciones.departamento = ''
            : this.busquedaVacaciones.departamento = (this.departamentoSelect.idDepartamentoArea == null ?  '': this.departamentoSelect.idDepartamentoArea.toString());

        this.proyectoSelect === undefined ? this.busquedaVacaciones.proyecto = ''
            : this.busquedaVacaciones.proyecto = (this.proyectoSelect.idProyecto == null ?  '': this.proyectoSelect.idProyecto.toString());
    }

    onChangeFechaDesde(value){
        if(value.type == 'change'){
            return;
        }
        this.busquedaVacaciones.fechaInicio = value;
    }

    onChangeFechaHasta(value){
        if(value.type == 'change'){
            return;
        }
        this.busquedaVacaciones.fechaFin = value;
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
        /*this.empleadoService.completarComboBox('obtenerVacacionesEstados').subscribe(
         TablaGeneralResult => this.estados = TablaGeneralResult,
         error =>  this.errorMessage = <any>error);*/

        this.estados = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Vacaciones.Estado' === grupo.grupo);
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

    protected pageChangeVacacion(event: PageChangeEvent): void {
        this.skip = event.skip;
        this.obtenerVacaciones();
    }

    public cargarMotivoRechazo(vacacion:Vacacion): void {
        this.motivoRechazoComponent.titulo="Denegacion"
        this.motivoRechazoComponent.dataItem=vacacion;
        this.motivoRechazoComponent.onShow();
    }

    @ViewChild(ConfirmDialogComponent) private confirmDialogComponent: ConfirmDialogComponent;

    public confirm(dataItem:Vacacion): void {
        this.confirmDialogComponent.titulo="Eliminar Vacaciones"
        this.confirmDialogComponent.dataItem=dataItem;
        this.confirmDialogComponent.onShow();

    }

    validateFilterEmptyEmpleado(e){
        if ((e.which && e.which == 8) || (e.which && e.which == 46) || (e.keyCode && e.keyCode == 8) || (e.keyCode && e.keyCode == 46)) {
            if(e.srcElement.value == ''){
                this.busquedaVacaciones.idEmpleado = null;
                this.busquedaVacaciones.nombreEmpleado = undefined;
            }
        }
        return true;
    }

    validateFilterEmptyJefeInmediato(e){
        if ((e.which && e.which == 8) || (e.which && e.which == 46) || (e.keyCode && e.keyCode == 8) || (e.keyCode && e.keyCode == 46)) {
            if(e.srcElement.value == ''){
                this.busquedaVacaciones.idJefeInmediato = null;
                this.busquedaVacaciones.jefeInmediato = undefined;
            }
        }
        return true;
    }

}