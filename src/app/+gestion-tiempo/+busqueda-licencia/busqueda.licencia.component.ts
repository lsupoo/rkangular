import {Component, OnInit, ViewChild} from "@angular/core";
import {GridDataResult} from "@progress/kendo-angular-grid";
import {Router} from "@angular/router";
import {environment} from "../../../environments/environment";
import {CompleterData, CompleterService} from "ng2-completer";
import {DepartamentoAreaCombo} from "../../+dto/departamentoAreaCombo";
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {Subscription} from "rxjs";
import {TipoLicencia} from "../../+dto/maintenance/tipoLicencia";
import {Vacacion} from "../../+dto/maintenance/vacacion";
import {Licencia} from "../../+dto/maintenance/licencia";
import {LicenciaFilter} from "../../+dto/licenciaFilter";
import {LicenciaService} from "../../+common/service/licencia.service";
import {LicenciaResult} from "../../+dto/licenciaResult";
import {StoreSessionFilter} from "../../+dto/storeSessionFilter";
import {UnidadDeNegocioCombo} from "../../+dto/unidadDeNegocioCombo";
import {ProyectoCombo} from "../../+dto/proyectoCombo";
import {ComponentBase} from "../../+common/service/componentBase";
import {LicenciaQuickFilter} from "../../+dto/licenciaQuickFilter";
import {ConfirmDialogComponent} from "../../shared/confirm/confirmDialogBase";
import {Empleado} from "../../+dto/maintenance/empleado";
import {BackendService} from "../../+rest/backend.service";


declare var $: any;

@Component({
    selector: 'busqueda-licencia',
    templateUrl: 'busqueda.licencia.component.html'
})
export class BusquedaLicenciaComponent extends ComponentBase implements OnInit {

    busy: Subscription;
    public estados:TablaGeneralResult[];
    public unidadDeNegocio: UnidadDeNegocioCombo[];
    public tipoLicencia: TipoLicencia[];
    public estadosSelect: TablaGeneralResult;
    public tipoLicenciasSelect: TipoLicencia;
    public defaultItemTablaGeneral: TablaGeneralResult = {codigo: null, nombre: 'Todos', grupo:null};
    public defaultItemTipoLicencia: TipoLicencia = new TipoLicencia();

    public defaultItemDepartamento: DepartamentoAreaCombo = {idDepartamentoArea: null,idUnidadDeNegocio: null, nombre: 'Todos'};
    public defaultItemProyecto: ProyectoCombo = {idProyecto: null,idDepartamentoArea:null, nombre: 'Todos'};

    public proyecto: ProyectoCombo[];
    public departamentoArea: DepartamentoAreaCombo[];
    public unidadNegocioSelect: UnidadDeNegocioCombo;
    public departamentoSelect: DepartamentoAreaCombo;
    public proyectoSelect: ProyectoCombo;
    public defaultItem: UnidadDeNegocioCombo = {idUnidadDeNegocio: null, nombre: 'Todos'};

    busquedaLicencias: LicenciaFilter = new LicenciaFilter();

    private gridView: GridDataResult;
    private pageSize: number = 10;
    private data: Object[];
    private skip: number = 0;

    dataItem: Vacacion;
    public isEmpty:boolean = true;
    public isSearch: boolean = false;
    licencia: LicenciaResult[] = [];
    public isRhana:boolean= false;

    quickFilter:LicenciaQuickFilter = new LicenciaQuickFilter();

    //Autocomplete

    private dataServiceEmpleado:CompleterData;

    private dataServiceJefeInmediato:CompleterData;

    localhost:  String = environment.backend;
    port: String = environment.port;
    public dataItemLicencia: Licencia;
    private showAdvanceBusquedaLicencia: boolean = false;

    storeSessionFilter: StoreSessionFilter = new StoreSessionFilter();

    @ViewChild(ConfirmDialogComponent) private confirmDialogComponent: ConfirmDialogComponent;

    constructor(private empleadoService: EmpleadoService,
                public backendService: BackendService,
                private licenciaService: LicenciaService,
                private _router: Router,
                private completerService: CompleterService){
        super(backendService,'GT003');

        this.dataServiceEmpleado = completerService.remote(this.urlAutocompleteEmpleado,'nombreEmpleado','nombreEmpleado');
        this.dataServiceJefeInmediato = completerService.remote(this.urlAutocompleteEmpleado,'nombreEmpleado','nombreEmpleado');

        this.defaultItemTipoLicencia.idTipoLicencia = null;
        this.defaultItemTipoLicencia.nombre = 'Todos';


        let empleado: Empleado = this.empleadoService.retrieveSessionStorage('entityGestionarLicencia');
        if(empleado === undefined || empleado == null || empleado.idEmpleado == null){
            this.busquedaLicencias.idEmpleado = null;
            this.showAdvanceBusquedaLicencia = false;
        }else{
            this.busquedaLicencias.idEmpleado = this.currentUser.idEmpleado;
            this.busquedaLicencias.nombreEmpleado = empleado.apellidoPaterno+' '+empleado.apellidoMaterno+', '+empleado.nombre;
            this.showAdvanceBusquedaLicencia = true;
            //this.onSubmit();
        }
        this.esRhana();
        this.onSubmit();
        //this.confirmDialogComponent.status="Open";
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

    ngOnInit() {
        this.getUnidadDeNegocio();
        this.getTipoLicencias();
        this.getLicenciaEstados();
    }

    public confirm(dataItem:Licencia): void {
        this.confirmDialogComponent.titulo="Eliminar Licencias"
        this.confirmDialogComponent.dataItem=dataItem;
        this.confirmDialogComponent.onShow();

    }

    selectJefeInmediato(e){
        if(e !=null)
            this.busquedaLicencias.idJefeInmediato = e.originalObject.idEmpleado;
        else
            this.busquedaLicencias.idJefeInmediato = null;
    }

    selectEmpleado(e){
        if(e !=null)
            this.busquedaLicencias.idEmpleado = e.originalObject.idEmpleado;
        else
            this.busquedaLicencias.idEmpleado = null;
    }

    onChangeFechaDesde(value){
        if(value.type == 'change'){
            return;
        }
        this.busquedaLicencias.fechaInicio = value;
    }

    onChangeFechaHasta(value){
        if(value.type == 'change'){
            return;
        }
        this.busquedaLicencias.fechaFin = value;
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

    onQuickSearck() {
        this.busquedaRapidaLicencias();
    }

    private busquedaRapidaLicencias() {
        this.busy = this.licenciaService.busquedaRapidaLicenciaEmpleado(this.quickFilter).subscribe(
            data => {
                this.isSearch = true;
                this.licencia = data;
                this.skip = 0;

                this.obtenerLicencias()
            },
            error => this.errorMessage = <any>error
        );
    }

    onLimpiar(){
        this.busquedaLicencias.nombreEmpleado = undefined;
        this.busquedaLicencias.fechaInicio = undefined;
        this.busquedaLicencias.fechaFin = undefined;
        this.busquedaLicencias.jefeInmediato = undefined;
        this.busquedaLicencias.tipoLicencia = undefined;

        this.busquedaLicencias.idJefeInmediato = null;
        this.busquedaLicencias.idEmpleado = null;

        this.unidadNegocioSelect = this.defaultItem;
        this.departamentoSelect = this.defaultItemDepartamento;
        this.departamentoArea = null;
        this.proyectoSelect = this.defaultItemProyecto;
        this.proyecto = null;

        this.estadosSelect = this.defaultItemTablaGeneral;
        this.tipoLicenciasSelect = this.defaultItemTipoLicencia;

        this.gridView = {
            data: [],
            total: 0
        };
    }
    onSubmit(){

        this.validarValoresSeleccionados();
        this.getLicencias();

    }
    private validarValoresSeleccionados() {



        if (this.busquedaLicencias.nombreEmpleado === undefined) this.busquedaLicencias.nombreEmpleado = '';
        if (this.busquedaLicencias.fechaInicio === undefined) this.busquedaLicencias.fechaInicio = '';
        if (this.busquedaLicencias.fechaInicio === undefined) this.busquedaLicencias.fechaFin = '';
        if (this.busquedaLicencias.tipoLicencia === undefined) this.busquedaLicencias.tipoLicencia = '';
        if (this.busquedaLicencias.jefeInmediato === undefined) this.busquedaLicencias.jefeInmediato = '';


        (this.estadosSelect === undefined || this.estadosSelect == null) ? this.busquedaLicencias.estado = ''
            : this.busquedaLicencias.estado = this.estadosSelect.codigo;
        (this.tipoLicenciasSelect === undefined || this.tipoLicenciasSelect == null) ? this.busquedaLicencias.tipoLicencia = ''
            : this.busquedaLicencias.idTipoLicencia = this.tipoLicenciasSelect.idTipoLicencia;


        this.unidadNegocioSelect === undefined ? this.busquedaLicencias.idUnidadDeNegocio = ''
            : this.busquedaLicencias.idUnidadDeNegocio = (this.unidadNegocioSelect.idUnidadDeNegocio == null ?  '': this.unidadNegocioSelect.idUnidadDeNegocio.toString());

        this.departamentoSelect === undefined ? this.busquedaLicencias.idDepartamentoArea = ''
            : this.busquedaLicencias.idDepartamentoArea = (this.departamentoSelect.idDepartamentoArea == null ?  '': this.departamentoSelect.idDepartamentoArea.toString());

        this.proyectoSelect === undefined ? this.busquedaLicencias.idProyecto = ''
            : this.busquedaLicencias.idProyecto = (this.proyectoSelect.idProyecto == null ?  '': this.proyectoSelect.idProyecto.toString());

    }
    public onAgregarLicencia(): void{
        this.storeSessionFilter.isNew = true;
        this.empleadoService.storeSessionStorage('editLicenciaResult',this.storeSessionFilter);
        this._router.navigate(['/gestionTiempo/administrarLicencias']);
    }

    public onEdit(dataItem: any): void {

        this.storeSessionFilter.isNew = false;
        this.storeSessionFilter.idTableFilter = dataItem.idLicencia;
        this.empleadoService.storeSessionStorage('editLicenciaResult',this.storeSessionFilter);
        this._router.navigate(['/gestionTiempo/administrarLicencias']);

    }
    onDelete(dataItem:Licencia): void {

        this.empleadoService.eliminarLicenciaEmpleado(dataItem.idLicencia).subscribe(

            data => {

                this.backendService.notification(this.msgs, data);

                if (data.codigo == 1) {
                    this.getLicencias();
                }

            },
            error => {
                this.backendService.notification(this.msgs, error);
            }

        );
    }

    private getLicencias() {
        this.busy = this.licenciaService.buscarLicenciaEmpleado(this.busquedaLicencias).subscribe(
            data => {
                this.isSearch = true;
                this.licencia = data;
                this.skip = 0;

                this.obtenerLicencias()
            },
            error => this.errorMessage = <any>error
        );
    }
    private obtenerLicencias(): void {

        if(this.licencia.length>0){
            this.isEmpty=false;
            this.gridView = {
                data: this.licencia.slice(this.skip, this.skip + this.pageSize),
                total: this.licencia.length
            };
        }else{
            this.isEmpty=true;

            this.gridView = {
                data: [],
                total: 0
            };
        }


    }

    private getLicenciaEstados() {
        this.estados = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Licencia.Estado' === grupo.grupo);
    }
    private getUnidadDeNegocio() {
        this.unidadDeNegocio = this.storageCommomnValueResult.unidadDeNegocio;
    }
    private getTipoLicencias(){
        this.tipoLicencia = this.storageCommomnValueResult.tipoLicencia;
    }

    private obtenerDepartamentos(idUndNegocio: number) {
        this.departamentoArea = this.storageCommomnValueResult.departamentoArea.filter(depa => idUndNegocio === depa.idUnidadDeNegocio);
    }

    private obtenerProyecto(idDepartamentoArea: number) {
        this.proyecto = this.storageCommomnValueResult.proyecto.filter(proyect => idDepartamentoArea === proyect.idDepartamentoArea);
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

    validateFilterEmptyEmpleado(e){
        if ((e.which && e.which == 8) || (e.which && e.which == 46) || (e.keyCode && e.keyCode == 8) || (e.keyCode && e.keyCode == 46)) {
            if(e.srcElement.value == ''){
                this.busquedaLicencias.idEmpleado = null;
                this.busquedaLicencias.nombreEmpleado = undefined;
            }
        }
        return true;
    }

    validateFilterEmptyJefeInmediato(e){
        if ((e.which && e.which == 8) || (e.which && e.which == 46) || (e.keyCode && e.keyCode == 8) || (e.keyCode && e.keyCode == 46)) {
            if(e.srcElement.value == ''){
                this.busquedaLicencias.idJefeInmediato = null;
                this.busquedaLicencias.jefeInmediato = undefined;
            }
        }
        return true;
    }

}