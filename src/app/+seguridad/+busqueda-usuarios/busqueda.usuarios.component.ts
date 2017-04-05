import {OnInit, Component} from "@angular/core";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {Router} from "@angular/router";
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {Subscription} from "rxjs";
import {StoreSessionFilter} from "../../+dto/storeSessionFilter";
import {GridDataResult, PageChangeEvent} from "@progress/kendo-angular-grid";
import {UsuarioFilter} from "../../+dto/usuarioFilter";
import {CompleterData, CompleterService} from "ng2-completer";
import {environment} from "../../../environments/environment";
import {UsuarioResult} from "../../+dto/usuarioResult";
import {UsuarioService} from "../../+common/service/usuario.service";
import {ComponentBase} from "../../+common/service/componentBase";
import {Http} from "@angular/http";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {NotificationsService} from "angular2-notifications/src/notifications.service";
import {UsuarioQuickFilter} from "../../+dto/usuarioQuickFilter";
import {BackendService} from "../../+rest/backend.service";
import {ConfirmDialogComponent} from "../../shared/confirm/confirmDialogBase";
import {ViewChild} from "@angular/core/src/metadata/di";
import {Usuario} from "../../+dto/maintenance/usuario";
declare var $: any;
@Component({
    selector: 'busqueda-usuarios',
    templateUrl: 'busqueda.usuarios.component.html',
    providers: [NotificationsService]
})
export class BusquedaUsuariosComponent extends ComponentBase implements OnInit {

    public estados:TablaGeneralResult[];
    public defaultItemEstados: TablaGeneralResult = {codigo: null, nombre: 'Todos', grupo:null};
    public estadosSelect: TablaGeneralResult;

    busy: Subscription;
    private dataServiceEmpleado:CompleterData;
    localhost:  String = environment.backend;
    port: String = environment.port;

    private usuarioFilter: UsuarioFilter = new UsuarioFilter();
    storeSessionFilter: StoreSessionFilter = new StoreSessionFilter();
    usuarioResult: UsuarioResult[] = [];
    private gridView: GridDataResult;
    private pageSize: number = 10;
    private skip: number = 0;
    public isSearch: boolean = false;

    quickFilter:UsuarioQuickFilter = new UsuarioQuickFilter();

    public options = {
        timeOut: 2500,
        lastOnBottom: true,
        clickToClose: true,
        maxLength: 0,
        maxStack: 7,
        showProgressBar: false,
        pauseOnHover: true,
        preventDuplicates: false,
        preventLastDuplicates: 'visible',
        rtl: false,
        animate: 'scale',
        position: ['right', 'top']
    };

    constructor(private empleadoService: EmpleadoService,
                private _router: Router,
                private _service: NotificationsService,
                private usuarioService: UsuarioService,
                public backendService: BackendService,
                private completerService: CompleterService){
        super(backendService,'SE001');
        this.dataServiceEmpleado = completerService.remote(this.urlAutocompleteEmpleado,'nombreEmpleado','nombreEmpleado');
        this.onSubmit();
    }
    ngOnInit() {
        this.getEstados();
    }

    selectEmpleado(e){

        if(e !=null)
            this.usuarioFilter.idEmpleado = e.originalObject.idEmpleado;
        else
            this.usuarioFilter.idEmpleado = null;
    }
    protected pageChange(event: PageChangeEvent): void {
        this.skip = event.skip;
        this.obtenerUsuarios();
    }

    public onEdit(dataItem: any): void {
        this.storeSessionFilter.isNew = false;
        this.storeSessionFilter.idTableFilter = dataItem.idUsuario;
        this.empleadoService.storeSessionStorage('editUsuarioResult',this.storeSessionFilter);
        this._router.navigate(['/seguridad/administrarUsuarios']);
    }

    public onDelete(dataItem: any): void {
        this.usuarioService.eliminarUsuarioEmpleado(dataItem.idUsuario).subscribe(
            data => {

                this.backendService.notification(this.msgs, data);

                if (data.codigo == 1) {
                    this.getUsuarios();
                }

            },
            error => {

                this.backendService.notification(this.msgs, error);
            }
        );
    }

    onAgregarUsuario(){
        this.storeSessionFilter.isNew = true;
        this.empleadoService.storeSessionStorage('editUsuarioResult',this.storeSessionFilter);
        this._router.navigate(['/seguridad/administrarUsuarios']);
    }
    onSubmit(){
        this.validarValoresSeleccionados();
        this.getUsuarios();
    }

    onQuickSearck(){
        this.busquedaRapidaUsuarios();
    }

    private validarValoresSeleccionados(){


        if (this.usuarioFilter.cuentaUsuario === undefined) this.usuarioFilter.cuentaUsuario = null;

        (this.estadosSelect === undefined || this.usuarioFilter.estado == null) ? this.usuarioFilter.estado = ''
            : this.usuarioFilter.estado = (this.estadosSelect.codigo == null ?  '': this.estadosSelect.codigo.toString());

    }
    private getUsuarios(){

        this.busy = this.usuarioService.buscarUsuarioEmpleado(this.usuarioFilter).subscribe(
            data => {
                this.isSearch = true;
                this.usuarioResult = data;
                this.skip = 0;

                this.obtenerUsuarios()
            },
            error => this.errorMessage = <any>error
        );
    }

    private busquedaRapidaUsuarios(){

        this.busy = this.usuarioService.busquedaRapidaUsuarios(this.quickFilter).subscribe(
            data => {
                this.isSearch = true;
                this.usuarioResult = data;
                this.skip = 0;

                this.obtenerUsuarios()
            },
            error => this.errorMessage = <any>error
        );
    }

    private obtenerUsuarios(): void {

        if(this.usuarioResult.length>0){
            this.gridView = {
                data: this.usuarioResult.slice(this.skip, this.skip + this.pageSize),
                total: this.usuarioResult.length
            };
        }else{
            this.gridView = {
                data: [],
                total: 0
            };
        }


    }
    onLimpiar(){


        this.usuarioFilter.cuentaUsuario = undefined;
        this.usuarioFilter.email = undefined;
        this.usuarioFilter.nombre = undefined;
        this.usuarioFilter.apellidoPaterno = undefined;
        this.usuarioFilter.apellidoMaterno = undefined;
        this.usuarioFilter.nombreEmpleado = undefined;

        this.estadosSelect = this.defaultItemEstados;

        this.gridView = {
            data: [],
            total: 0
        };
    }


    private getEstados() {
        this.estados = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Usuario.Estado' === grupo.grupo);
    }

    @ViewChild(ConfirmDialogComponent) private confirmDialogComponent: ConfirmDialogComponent;

    public confirm(dataItem:Usuario): void {
        this.confirmDialogComponent.titulo="Eliminar Usuario"
        this.confirmDialogComponent.dataItem=dataItem;
        this.confirmDialogComponent.onShow();

    }

}