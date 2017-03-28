/**
 * Created by javier.cuicapuza on 1/3/2017.
 */
import {Component, OnInit, ViewChild} from "@angular/core";
import {GridDataResult, PageChangeEvent} from "@progress/kendo-angular-grid";

import {Router} from "@angular/router";

import {CompleterService} from "ng2-completer";
import {CargoService} from "../../+common/service/cargo.service";
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {Subscription} from "rxjs";
import {LocalStorageGlobal} from "../../+dto/localStorageDto";
import {EnumRolEmpleado} from "../../+enums/enumRolEmpleado";
import {Alerta} from "../../+dto/maintenance/alerta";
import {AlertaFilter} from "../../+dto/alertaFilter";
import {AlertaResult} from "../../+dto/alertaResult";
import {StoreSessionFilter} from "../../+dto/storeSessionFilter";
import {StorageResult} from "../../+dto/storageResult";
import {TipoLicenciaService} from "../../+common/service/tipolicencia.service";
import {TipoLicenciaFilter} from "../../+dto/tipoLicenciaFilter";
import {TipoLicenciaResult} from "../../+dto/tipoLicenciaResult";
import {TipoLicencia} from "../../+dto/maintenance/tipoLicencia";
import {ComponentBase} from "../../+common/service/componentBase";
import {Http} from "@angular/http";
import {BackendService} from "../../+rest/backend.service";
import {ConfirmDialogComponent} from "../../shared/confirm/confirmDialogBase";

declare var $: any;

@Component({
    selector: 'busqueda-tiposlicencias',
    templateUrl: 'busqueda.tiposlicencias.component.html',
    providers: [ TipoLicenciaService]
})
export class BusquedaTiposLicenciasComponent extends ComponentBase implements OnInit {

    busquedaTipoLicencia: TipoLicenciaFilter  = new TipoLicenciaFilter();
    storeSessionFilter: StoreSessionFilter = new StoreSessionFilter();
    //public storageCommomnValueResult: StorageResult = new StorageResult();
    public estados:TablaGeneralResult[];
    public estadosSelect: TablaGeneralResult;
    public defaultItemEstados: TablaGeneralResult = {codigo: null, nombre: 'Todos'};

    tipoLicencia: TipoLicencia[] = [];
    tipoLicenciaResult: TipoLicenciaResult[] = [];

    private gridView: GridDataResult;
    private pageSize: number = 10;
    private data: Object[];
    private skip: number = 0;
    public isEmpty:boolean = true;
    public isSearch: boolean = false;
    busy: Subscription;

    constructor(private empleadoService: EmpleadoService,
                private _router: Router,
                public backendService: BackendService,
                private tipoLicenciaService: TipoLicenciaService){
        super(backendService,'MA005');
        //this.storageCommomnValueResult = JSON.parse(localStorage.getItem('localStorageCommonsValues'));

        //this.getTipoNotificacion();
        this.getEstados();
        this.onSubmit();
    }
    ngOnInit() {
    }
    /*onAgregarNuevaAlerta(){
     this.empleadoService.storeSessionStorage('isNewAlerta', true);
     this.empleadoService.storeSessionStorage('addAlerta',new Alerta());
     this._router.navigate(['/mantenimientos/administrarAlertas']);
     }*/

    public onEdit(dataItem: any): void {
        this.storeSessionFilter.isNew = false;
        this.storeSessionFilter.idTableFilter = dataItem.idTipoLicencia;
        this.empleadoService.storeSessionStorage('editTipoLicenciaResult',this.storeSessionFilter);
        this._router.navigate(['/mantenimientos/administrarTiposLicencias']);
    }
    /* CARGAR COMBO*/

    private getEstados() {
        this.estados = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Estado' === grupo.grupo);
    }

    onSubmit(){
        this.validarValoresSeleccionados();
        this.getTiposLicencias();
    }

    private validarValoresSeleccionados(){

        (this.busquedaTipoLicencia.codigo === undefined || this.busquedaTipoLicencia.codigo == null) ? this.busquedaTipoLicencia.codigo = '':
            this.busquedaTipoLicencia.codigo=this.busquedaTipoLicencia.codigo;

        (this.busquedaTipoLicencia.nombre === undefined || this.busquedaTipoLicencia.nombre == null) ? this.busquedaTipoLicencia.nombre = '':
            this.busquedaTipoLicencia.nombre=this.busquedaTipoLicencia.nombre;

        (this.estadosSelect === undefined || this.estadosSelect == null) ? this.busquedaTipoLicencia.estado = ''
            : this.busquedaTipoLicencia.estado = (this.estadosSelect.codigo == null ?  '': this.estadosSelect.codigo.toString());

    }

    private getTiposLicencias(){
        this.blockedUI=true;
        this.busy = this.tipoLicenciaService.obtenerTiposLicencias(this.busquedaTipoLicencia).subscribe(
            data => {
                this.isSearch = true;
                this.tipoLicenciaResult = data;
                this.skip = 0;
                this.obtenerTiposLicencias()
                this.blockedUI=false;
            },
            error => {
                this.blockedUI=false;
                this.errorMessage = <any>error
            }
        );
    }

    private obtenerTiposLicencias(): void {
        if(this.tipoLicenciaResult.length>0){
            this.isEmpty=false;
            this.gridView = {
                data: this.tipoLicenciaResult.slice(this.skip, this.skip + this.pageSize),
                total: this.tipoLicenciaResult.length
            };
        }else{
            this.isEmpty=true;

            this.gridView = {
                data: [],
                total: 0
            };
        }
    }

    public onDelete(dataItem: TipoLicencia): void {
        /*this.tipoLicenciaService.eliminarTipoLicencia(dataItem).subscribe(
            data => {
                this.getTiposLicencias();
            },
            error => this.errorMessage = <any>error
        );*/



        this.tipoLicenciaService.eliminarTipoLicencia(dataItem).subscribe(

            data => {

                this.backendService.notification(this.msgs, data);

                if (data.codigo == 1) {
                    this.getTiposLicencias();
                }

            },
            error => {

                this.backendService.notification(this.msgs, error);
            }
        );
    }

    onLimpiar(){

        this.busquedaTipoLicencia.estado = null;
        this.busquedaTipoLicencia.nombre="";
        this.busquedaTipoLicencia.codigo="";


        this.gridView = {
            data: [],
            total: 0
        };
    }

    onAgregarTipoLicencia(){
        this._router.navigate(['/mantenimientos/administrarTiposLicencias']);
    }

    protected pageChange(event: PageChangeEvent): void {
        this.skip = event.skip;
        this.obtenerTiposLicencias();

    }
    @ViewChild(ConfirmDialogComponent) private confirmDialogComponent: ConfirmDialogComponent;
    public confirm(dataItem:TipoLicencia): void {
        this.confirmDialogComponent.titulo="Eliminar Tipo Licencia"
        this.confirmDialogComponent.dataItem=dataItem;
        this.confirmDialogComponent.onShow();

    }
}