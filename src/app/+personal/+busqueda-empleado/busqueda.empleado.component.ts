/**
 * Created by josediaz on 28/10/2016.
 */
import {Component, OnInit, ViewChild} from "@angular/core";
import {GridEditFormComponent} from "./grid.edit.empleados.component";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {UnidadDeNegocioCombo} from "../../+dto/unidadDeNegocioCombo";
import {DepartamentoAreaCombo} from "../../+dto/departamentoAreaCombo";
import {CentroCostoDto} from "../+empleado/centroCostoDto";
import {EmpleadoFilter} from "../../+dto/empleadoFilter";
import {Empleado} from "../../+dto/maintenance/empleado";
import {ImportEmpleado} from "./importEmpleado";
import {PageChangeEvent, GridDataResult} from "@progress/kendo-angular-grid";
import {Router} from "@angular/router";
import {CompleterData, CompleterService} from "ng2-completer";
import {environment} from "../../../environments/environment";
import {Subscription} from "rxjs";
import {NotificationsService} from "angular2-notifications/src/notifications.service";
import {EmpleadoResult} from "../../+dto/empleadoResult";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {ProyectoCombo} from "../../+dto/proyectoCombo";
import {Http} from "@angular/http";
import {ComponentBase} from "../../+common/service/componentBase";
import {EmpleadoQuickFilter} from "../../+dto/empleadoQuickFilter";
import {BackendService} from "../../+rest/backend.service";


declare var $: any;


@Component({
    selector: 'busqueda-empleado',
    templateUrl: 'busqueda.empleado.component.html',
    providers: [NotificationsService]
})
export class BusquedaEmpleadoComponent extends ComponentBase implements OnInit {

    busy: Subscription;

    public unidadDeNegocio: UnidadDeNegocioCombo[];
    public proyecto: ProyectoCombo[];
    public departamentoArea: DepartamentoAreaCombo[];
    public tiposDocumento: TablaGeneralResult[];
    public centrosCosto: CentroCostoDto[];

    errorMessage: string;


    //import empleados
    public dataItem: ImportEmpleado;

    public tipoDocumentoSelect: TablaGeneralResult;
    public unidadNegocioSelect: UnidadDeNegocioCombo;
    public departamentoSelect: DepartamentoAreaCombo;
    public proyectoSelect: ProyectoCombo;
    public centroCostoSelect: CentroCostoDto;
    public estadosSelect: TablaGeneralResult;

    public defaultItem: UnidadDeNegocioCombo = {idUnidadDeNegocio: null, nombre: 'Todos'};

    public defaultItemCentroCosto: CentroCostoDto = {idCentroCosto: null, nombre: 'Todos'};

    public defaultItemTablaGeneral: TablaGeneralResult = {codigo: null, nombre: 'Todos', grupo:null};

    public defaultItemDepartamento: DepartamentoAreaCombo = {
        idDepartamentoArea: null,
        idUnidadDeNegocio: null,
        nombre: 'Todos'
    };
    public defaultItemProyecto: ProyectoCombo = {idProyecto: null,idDepartamentoArea:null, nombre: 'Todos'};

    public noItems: boolean = false;

    busquedaEmpleado: EmpleadoFilter = new EmpleadoFilter();

    public empleados: EmpleadoResult[] = [];

    public estados: TablaGeneralResult[];

    public isSearch: boolean = false;

    public isEmpty: boolean = true;

    private dataServiceJefeInmediato: CompleterData;

    quickFilter: EmpleadoQuickFilter = new EmpleadoQuickFilter();

    public isJefe : boolean=false;
    public isRhana:boolean= false;
    public options = {
        timeOut: 5000,
        lastOnBottom: true,
        clickToClose: true,
        maxLength: 0,
        maxStack: 7,
        showProgressBar: true,
        pauseOnHover: true,
        preventDuplicates: false,
        preventLastDuplicates: 'visible',
        rtl: false,
        animate: 'scale',
        position: ['right', 'top']
    };

    @ViewChild(GridEditFormComponent) protected editFormComponent: GridEditFormComponent;

    constructor(
        private _service: NotificationsService,
        private empleadoService: EmpleadoService,
        private _router: Router,
        public backendService: BackendService,
        private completerService: CompleterService) {

        super(backendService,'EM001');

        this.dataServiceJefeInmediato = completerService.remote(this.urlAutocompleteEmpleado, 'nombreEmpleado', 'nombreEmpleado');
        this.esJefe();
        this.esRhana();
        this.onSubmit();
    }

    onChangeFechaIngresoDesde(value){
        if(value.type == 'change'){
            return;
        }
        this.busquedaEmpleado.fechaIngresoDesde = value;
    }
    onChangeFechaIngresoHasta(value){
        if(value.type == 'change'){
            return;
        }
        this.busquedaEmpleado.fechaIngresoHasta = value;
    }
    onChangeFechaCeseDesde(value){
        if(value.type == 'change'){
            return;
        }
        this.busquedaEmpleado.fechaCeseDesde = value;
    }
    onChangeFechaCeseHasta(value){
        if(value.type == 'change'){
            return;
        }
        this.busquedaEmpleado.fechaCeseHasta = value;
    }

    selectJefeInmediato(e) {
        if (e != null)
            this.busquedaEmpleado.idJefeInmediato = e.originalObject.idEmpleado;
        else
            this.busquedaEmpleado.idJefeInmediato = null;
    }

    onSubmit() {

        this.validarValoresSeleccionados();

        this.busquedaEmpleados();

    }

    onQuickSearck() {


        this.busquedaRapidaEmpleados();

    }

    busquedaRapidaEmpleados(){
        this.currentUser  = JSON.parse(sessionStorage.getItem("authenticatedUser") || '{}');
        if(this.isJefe && !this.isRhana) {
            this.quickFilter.idEmpleado = this.currentUser.idEmpleado;
        }

        this.blockedUI = true;

        this.busy = this.empleadoService.busquedaRapidaEmpleado(this.quickFilter).subscribe(
            data => {
                this.blockedUI = false;
                this.isSearch = true;
                this.empleados = data;
                this.skip = 0;

                this.obtenerEmpleados();

            },
            error => {
                this.blockedUI = false;
                this.errorMessage = <any>error;

            }
        );
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

    busquedaEmpleados(){

        this.currentUser  = JSON.parse(sessionStorage.getItem("authenticatedUser") || '{}');
        if(this.isJefe && !this.isRhana) {
            this.busquedaEmpleado.idEmpleado = this.currentUser.idEmpleado;
        }

        this.blockedUI = true;

        this.busy = this.empleadoService.buscarEmpleado(this.busquedaEmpleado).subscribe(
            data => {
                this.blockedUI = false;
                this.isSearch = true;
                this.empleados = data;
                this.skip = 0;

                this.obtenerEmpleados();

            },
            error => {
                this.blockedUI = false;
                this.errorMessage = <any>error;

            }
        );
    }

    onLimpiar() {

        this.busquedaEmpleado.codigo = '';
        this.busquedaEmpleado.nombres = '';
        this.busquedaEmpleado.apePaterno = '';
        this.busquedaEmpleado.apeMaterno = '';
        this.busquedaEmpleado.numeroDocumento = '';
        this.busquedaEmpleado.jefeInmediato = '';
        this.busquedaEmpleado.idJefeInmediato = null;
        this.busquedaEmpleado.correoElectronico = '';
        this.busquedaEmpleado.fechaIngresoDesde=null;
        this.busquedaEmpleado.fechaIngresoHasta=null;
        this.busquedaEmpleado.fechaCeseDesde=null;
        this.busquedaEmpleado.fechaCeseHasta=null;
        this.centroCostoSelect = this.defaultItemCentroCosto;

        this.tipoDocumentoSelect = this.defaultItemTablaGeneral;
        this.estadosSelect = this.defaultItemTablaGeneral;

        this.unidadNegocioSelect = this.defaultItem;
        this.departamentoSelect = this.defaultItemDepartamento;
        this.departamentoArea = null;
        this.proyectoSelect = this.defaultItemProyecto;
        this.proyecto = null;

        this.isEmpty = true;
        this.gridView = {
            data: [],
            total: 0
        };

    }

    private validarValoresSeleccionados() {

        if (this.busquedaEmpleado.codigo === undefined) this.busquedaEmpleado.codigo = '';
        if (this.busquedaEmpleado.nombres === undefined) this.busquedaEmpleado.nombres = '';
        if (this.busquedaEmpleado.apePaterno === undefined) this.busquedaEmpleado.apePaterno = '';
        if (this.busquedaEmpleado.apeMaterno === undefined) this.busquedaEmpleado.apeMaterno = '';
        if (this.busquedaEmpleado.numeroDocumento === undefined) this.busquedaEmpleado.numeroDocumento = '';
        if (this.busquedaEmpleado.jefeInmediato === undefined) this.busquedaEmpleado.jefeInmediato = '';
        if (this.busquedaEmpleado.correoElectronico === undefined) this.busquedaEmpleado.correoElectronico = '';

        this.estadosSelect === undefined ? this.busquedaEmpleado.estado = ''
            : this.busquedaEmpleado.estado = this.estadosSelect.codigo;


        this.tipoDocumentoSelect === undefined ? this.busquedaEmpleado.tipoDocumento = ''
            : this.busquedaEmpleado.tipoDocumento = this.tipoDocumentoSelect.codigo;


        this.unidadNegocioSelect === undefined ? this.busquedaEmpleado.unidadNegocio = ''
            : this.busquedaEmpleado.unidadNegocio = (this.unidadNegocioSelect.idUnidadDeNegocio == null ? '' : this.unidadNegocioSelect.idUnidadDeNegocio.toString());
        ;

        this.departamentoSelect === undefined ? this.busquedaEmpleado.departamento = ''
            : this.busquedaEmpleado.departamento = (this.departamentoSelect.idDepartamentoArea == null ? '' : this.departamentoSelect.idDepartamentoArea.toString());

        this.proyectoSelect === undefined ? this.busquedaEmpleado.proyecto = ''
            : this.busquedaEmpleado.proyecto = (this.proyectoSelect.idProyecto == null ? '' : this.proyectoSelect.idProyecto.toString());

        this.centroCostoSelect === undefined ? this.busquedaEmpleado.centroCosto = ''
            : this.busquedaEmpleado.centroCosto = (this.centroCostoSelect.idCentroCosto == null ? '' : this.centroCostoSelect.idCentroCosto.toString());
    }

    private gridView: GridDataResult;
    private pageSize: number = 10;
    private data: Object[];
    private skip: number = 0;

    ngOnInit() {

        this.getTiposDocumento();
        this.getUnidadDeNegocio();
        this.obtenerCentrosCosto();
        this.getEmpleadoEstados();

    }

    protected pageChange(event: PageChangeEvent): void {
        this.skip = event.skip;
        this.obtenerEmpleados();
    }

    private obtenerEmpleados(): void {

        if (this.empleados.length > 0) {
            this.isEmpty = false;
            this.gridView = {
                data: this.empleados.slice(this.skip, this.skip + this.pageSize),
                total: this.empleados.length
            };
        } else {
            this.isEmpty = true;
            this.gridView = {
                data: [],
                total: 0
            };
        }

    }

    public onDelete(empleadoResult: EmpleadoResult): void {

        this.empleadoService.eliminarEmpleado(empleadoResult.idEmpleado).subscribe(
            data => {
                this.notificacionDelete(data)
            },
            error => this.errorMessage = <any>error
        );

    }

    public notificacionDelete(data:NotificacionResult){
        if(data.codigo == 1){
            this.busquedaEmpleados();
            this._service.success("Success", data.mensaje);
        }
        else if(data.codigo == 0){
            this._service.error("Error", data.mensaje);
        }

    }

    public onEdit(empleadoResult: EmpleadoResult): void {
        this.empleadoService.storeSessionStorage('isNewEmpleado',false);
        this.empleadoService.storeSessionStorage('idEmpleado',empleadoResult.idEmpleado);
        this._router.navigate(['/personal/empleado']);
    }

    public onView(empleadoResult: EmpleadoResult): void {
        this.empleadoService.storeSessionStorage('idEmpleado',empleadoResult.idEmpleado);
        this._router.navigate(['/personal/verEmpleado']);
    }

    public onCancel(): void {
        this.dataItem = undefined;
    }

    /* Fill combos */
    private getEmpleadoEstados() {
        this.estados = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Empleado.Estado' === grupo.grupo);
    }

    private obtenerCentrosCosto() {
        this.empleadoService.obtenerComboCentroCosto().subscribe(
            centroCostoDto => this.centrosCosto = centroCostoDto,
            error => this.errorMessage = <any>error);
    }


    private getTiposDocumento() {
        this.tiposDocumento = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Empleado.TipoDocumento' === grupo.grupo);
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

    actualizarDpto(value): void {
        //this.isEnableUndNegocio = false;
        let codigo: any = value.idUnidadDeNegocio;
        this.departamentoSelect = this.defaultItemDepartamento;
        if (value == null) {

            this.departamentoArea = null;
        } else {
            this.obtenerDepartamentos(codigo);
        }
        //this.isEnableProyectos = true;
        this.proyectoSelect = this.defaultItemProyecto;
        this.proyecto = null;


    }

    actualizarProyecto(value): void {
        let codigo: any = value.idDepartamentoArea;
        this.proyectoSelect = this.defaultItemProyecto;
        this.obtenerProyecto(codigo);

    }

    exportarEmpleados() {
        if (this.empleados.length == 0) {
            this.noItems = true;
        } else {

            this.noItems = false;

            if ($("#export_file").length > 0) {
                $("#export_file").remove();
            }
            if ($("#export_file").length === 0) {

                var iframe = $("<iframe src='' name='export_file' id='export_file'></iframe>");
                iframe.appendTo("body");

                var form = $("<form action='" + this.urlExportEmpleado + "' method='post' target='export_file'></form>");
                form.append($("<input type='hidden' name='nombres' id='nombres' />").attr("value", this.busquedaEmpleado.nombres));
                form.append($("<input type='hidden' name='apellidoPaterno' id='apellidoPaterno' />").attr("value", this.busquedaEmpleado.apePaterno));
                form.append($("<input type='hidden' name='apellidoMaterno' id='apellidoMaterno' />").attr("value", this.busquedaEmpleado.apeMaterno));
                form.append($("<input type='hidden' name='codigo' id='codigo' />").attr("value", this.busquedaEmpleado.codigo));
                form.append($("<input type='hidden' name='tipoDocumento' id='tipoDocumento' />").attr("value", this.busquedaEmpleado.tipoDocumento));
                form.append($("<input type='hidden' name='numeroDocumento' id='numeroDocumento' />").attr("value", this.busquedaEmpleado.numeroDocumento));
                form.append($("<input type='hidden' name='unidadNegocio' id='unidadNegocio' />").attr("value", this.busquedaEmpleado.unidadNegocio));
                form.append($("<input type='hidden' name='departamento' id='departamento' />").attr("value", this.busquedaEmpleado.departamento));
                form.append($("<input type='hidden' name='proyecto' id='proyecto' />").attr("value", this.busquedaEmpleado.proyecto));
                form.append($("<input type='hidden' name='jefeInmediato' id='jefeInmediato' />").attr("value", this.busquedaEmpleado.jefeInmediato));
                form.append($("<input type='hidden' name='centroCosto' id='centroCosto' />").attr("value", this.busquedaEmpleado.centroCosto));
                form.append($("<input type='hidden' name='correoElectronico' id='correoElectronico' />").attr("value", this.busquedaEmpleado.correoElectronico));
                form.append($("<input type='hidden' name='estado' id='estado' />").attr("value", this.busquedaEmpleado.estado));
                form.append($("<input type='hidden' name='isSearch' id='isSearch' />").attr("value", this.isSearch));
                form.append($("<input type='hidden' name='isEmpty' id='isEmpty' />").attr("value", false));
                form.appendTo("body");

                form.submit();
            }

        }
    }

    importar() {

        this.editFormComponent.titulo = "Importar";
        this.editFormComponent.importarArchivoEmpleados();
    }

    altaDeEmpleado() {
        this.empleadoService.storeSessionStorage('isNewEmpleado',true);
        this.empleadoService.storeSessionStorage('idEmpleado',undefined);
        this._router.navigate(['/personal/empleado']);
    }

    validateFilterEmptyJefeInmediato(e){
        if ((e.which && e.which == 8) || (e.which && e.which == 46) || (e.keyCode && e.keyCode == 8) || (e.keyCode && e.keyCode == 46)) {
            if(e.srcElement.value == ''){
                this.busquedaEmpleado.idJefeInmediato = null;
                this.busquedaEmpleado.jefeInmediato = undefined;
            }
        }
        return true;
    }

}