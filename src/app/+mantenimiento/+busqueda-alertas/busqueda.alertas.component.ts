/**
 * Created by javier.cuicapuza on 1/3/2017.
 */
import {Component, OnInit, ChangeDetectionStrategy} from "@angular/core";
import {GridDataResult, PageChangeEvent} from "@progress/kendo-angular-grid";

import {Router} from "@angular/router";

import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {Subscription} from "rxjs";
import {Alerta} from "../../+dto/maintenance/alerta";
import {AlertaFilter} from "../../+dto/alertaFilter";
import {AlertaResult} from "../../+dto/alertaResult";
import {StoreSessionFilter} from "../../+dto/storeSessionFilter";
import {StorageResult} from "../../+dto/storageResult";
import {ComponentBase} from "../../+common/service/componentBase";
import {Http} from "@angular/http";
import {BackendService} from "../../+rest/backend.service";

declare var $: any;

@Component({
    selector: 'busqueda-alertas',
    templateUrl: 'busqueda.alertas.component.html'
})
export class BusquedaAlertasComponent extends ComponentBase implements OnInit {



    busquedaAlertas: AlertaFilter = new AlertaFilter();
    storeSessionFilter: StoreSessionFilter = new StoreSessionFilter();
    public tipoNotificacion:TablaGeneralResult[];
    public tipoNotificacionSelect: TablaGeneralResult;
    public estados:TablaGeneralResult[];
    public estadosSelect: TablaGeneralResult;
    public defaultItemTipoNotificacion: TablaGeneralResult = {codigo: null, nombre: 'Todos', grupo:null};
    public defaultItemEstados: TablaGeneralResult = {codigo: null, nombre: 'Todos',grupo:null};

    alertas: Alerta[] = [];
    alertaResult: AlertaResult[] = [];

    private gridView: GridDataResult;
    private pageSize: number = 10;
    private data: Object[];
    private skip: number = 0;

    public isEmpty:boolean = true;
    public isSearch: boolean = false;

    busy: Subscription;


    constructor(public empleadoService: EmpleadoService,
                private _router: Router,
                public backendService: BackendService){

        super(backendService,'MA003');

        this.getTipoNotificacion();
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
        this.storeSessionFilter.idTableFilter = dataItem.idAlerta;
        this.empleadoService.storeSessionStorage('editAlertaResult',this.storeSessionFilter);
        this._router.navigate(['/mantenimientos/administrarAlertas']);
    }
    /* CARGAR COMBO*/
    private getTipoNotificacion() {
        this.tipoNotificacion = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Alerta.TipoNotificacion' === grupo.grupo);
    }
    private getEstados() {
        this.estados = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Estado' === grupo.grupo);
    }

    onSubmit(){
        this.validarValoresSeleccionados();
        this.getAlertas();
    }

    private validarValoresSeleccionados(){

        (this.tipoNotificacionSelect === undefined || this.tipoNotificacionSelect == null) ? this.busquedaAlertas.tipoNotificacion = ''
            : this.busquedaAlertas.tipoNotificacion = (this.tipoNotificacionSelect.codigo == null ?  '': this.tipoNotificacionSelect.codigo.toString());

        (this.estadosSelect === undefined || this.estadosSelect == null) ? this.busquedaAlertas.estado = ''
            : this.busquedaAlertas.estado = (this.estadosSelect.codigo == null ?  '': this.estadosSelect.codigo.toString());

    }

    private getAlertas(){
        this.busy = this.empleadoService.buscarAlertas(this.busquedaAlertas).subscribe(
            data => {
                this.isSearch = true;
                this.alertaResult = data;
                this.skip = 0;

                this.obtenerAlertas()
            },
            error => this.errorMessage = <any>error
        );
    }

    private obtenerAlertas(): void {
        if(this.alertaResult.length>0){
            this.isEmpty=false;
            this.gridView = {
                data: this.alertaResult.slice(this.skip, this.skip + this.pageSize),
                total: this.alertaResult.length
            };
        }else{
            this.isEmpty=true;

            this.gridView = {
                data: [],
                total: 0
            };
        }
    }
    protected pageChange(event: PageChangeEvent): void {
        this.skip = event.skip;
        this.obtenerAlertas();

    }

    onLimpiar(){

        this.busquedaAlertas.tipoNotificacion = null;
        this.busquedaAlertas.estado = null;

        this.estadosSelect = this.defaultItemEstados;
        this.tipoNotificacionSelect = this.defaultItemTipoNotificacion;

        this.gridView = {
            data: [],
            total: 0
        };
    }
}