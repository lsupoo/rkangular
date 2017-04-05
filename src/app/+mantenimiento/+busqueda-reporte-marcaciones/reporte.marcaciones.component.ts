/**
 * Created by javier.cuicapuza on 12/23/2016.
 */

import {Component, OnInit, ViewChild} from "@angular/core";
import {GridDataResult, PageChangeEvent} from "@progress/kendo-angular-grid";
import {Router} from "@angular/router";
import {environment} from "../../../environments/environment";
import {CompleterData, CompleterService} from "ng2-completer";
import {UnidadDeNegocioCombo} from "../../+dto/unidadDeNegocioCombo";
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {Marcacion} from "../../+dto/maintenance/marcacion";
import {Subscription} from "rxjs";
import {ReporteMarcacion} from "../../+dto/maintenance/reporteMarcacion";
import {ReporteMarcacionResult} from "../../+dto/reporteMarcacionResult";
import {StoreSessionFilter} from "../../+dto/storeSessionFilter";
import {ReporteMarcacionFilter} from "../../+dto/reporteMarcacionFilter";
import {StorageResult} from "../../+dto/storageResult";
import {Http} from "@angular/http";
import {ComponentBase} from "../../+common/service/componentBase";
import {BackendService} from "../../+rest/backend.service";
import {ConfirmDialogComponent} from "../../shared/confirm/confirmDialogBase";

declare var $: any;

@Component({
    selector: 'busqueda-reporte-marcacion',
    templateUrl: 'reporte.marcaciones.component.html'
})
export class ReporteMarcacionComponent extends ComponentBase implements OnInit {

    //public storageCommomnValueResult: StorageResult = new StorageResult();
    private marcacionFilter: ReporteMarcacionFilter = new ReporteMarcacionFilter();
    storeSessionFilter: StoreSessionFilter = new StoreSessionFilter();
    marcacion: Marcacion[] = [];
    marcacionResult: ReporteMarcacionResult[] = [];
    public tipoReporte:TablaGeneralResult[];
    public estados:TablaGeneralResult[];

    busy: Subscription;
    public undnegocios: UnidadDeNegocioCombo[];
    public estadosSelect: TablaGeneralResult;

    private gridView: GridDataResult;
    private pageSize: number = 10;
    private data: Object[];
    private skip: number = 0;

    public isEmpty:boolean = true;
    public isSearch: boolean = false;

    private dataServiceEmpleado:CompleterData;

    localhost:  String = environment.backend;
    port: String = environment.port;
    public defaultItemTipoReporteMarcacion: TablaGeneralResult = {codigo: null, nombre: 'Todos', grupo:null};
    public defaultItemEstados: TablaGeneralResult = {codigo: null, nombre: 'Todos',grupo:null};
    public reporteMarcacionSelect: TablaGeneralResult;

    constructor(private empleadoService: EmpleadoService,
                private _router: Router,
                public backendService: BackendService,
                private completerService: CompleterService){
        super(backendService,'MA004');
        this.dataServiceEmpleado = completerService.remote(this.urlAutocompleteEmpleado,'nombreEmpleado','nombreEmpleado');

        this.getTipoReporte();
        this.getEstados();
        this.onSubmit();
    }

    ngOnInit() {
    }

    onAgregarNuevoReporteMarcacion(){
        this._router.navigate(['/mantenimientos/administrarReporteMarcaciones']);
    }

    public onEdit(dataItem: any): void {
        this.storeSessionFilter.isNew = false;
        this.storeSessionFilter.idTableFilter = dataItem.idReporteMarcacion;
        this.empleadoService.storeSessionStorage('editReporteMarcacionResult',this.storeSessionFilter);
        this._router.navigate(['/mantenimientos/administrarReporteMarcaciones']);


    }
    onDelete(dataItem: ReporteMarcacion): void {
        this.empleadoService.eliminarReporteMarcacion(dataItem).subscribe(
            data => {
                this.backendService.notification(this.msgs, data);
                this.getReporteMarcaciones();
            },
            error => {

                this.backendService.notification(this.msgs, error);
            }
        );
    }

    selectEmpleado(e){
        if(e !=null)
            this.marcacionFilter.idEmpleado = e.originalObject.idEmpleado;
        else
            this.marcacionFilter.idEmpleado = null;
    }

    private getTipoReporte() {
        this.tipoReporte = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'ReporteMarcaciones.TipoReporte' === grupo.grupo);
    }
    private getEstados() {
        this.estados = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Estado' === grupo.grupo);
    }
    onSubmit(){
        this.validarValoresSeleccionados();
        this.getReporteMarcaciones();
    }
    private getReporteMarcaciones(){
        this.busy = this.empleadoService.buscarReporteMarcaciones(this.marcacionFilter).subscribe(
            data => {
                this.isSearch = true;
                this.marcacionResult = data;
                this.skip = 0;

                this.obtenerReportes()
            },
            error => {

                this.backendService.notification(this.msgs, error);
            }
        );
    }

    private obtenerReportes(): void {

        if(this.marcacionResult.length>0){
            this.isEmpty=false;
            this.gridView = {
                data: this.marcacionResult.slice(this.skip, this.skip + this.pageSize),
                total: this.marcacionResult.length
            };
        }else{
            this.isEmpty=true;

            this.gridView = {
                data: [],
                total: 0
            };
        }


    }

    private validarValoresSeleccionados(){

        if (this.marcacionFilter.idEmpleado === undefined) this.marcacionFilter.idEmpleado = null;

        (this.reporteMarcacionSelect === undefined || this.marcacionFilter.tipoReporte == null) ? this.marcacionFilter.tipoReporte = ''
            : this.marcacionFilter.tipoReporte = (this.reporteMarcacionSelect.codigo == null ?  '': this.reporteMarcacionSelect.codigo.toString());

        (this.estadosSelect === undefined || this.marcacionFilter.estado == null) ? this.marcacionFilter.estado = ''
            : this.marcacionFilter.estado = (this.estadosSelect.codigo == null ?  '': this.estadosSelect.codigo.toString());

    }

    onLimpiar(){

        this.marcacionFilter.tipoReporte = null;
        this.marcacionFilter.estado = null;
        this.marcacionFilter.idEmpleado = null;
        this.marcacionFilter.subscriptor=null;

        //this.estadosSelect = this.defaultItemEstados;
        //this.reporteMarcacionSelect = this.defaultItemTipoReporteMarcacion;

        this.gridView = {
            data: [],
            total: 0
        };
    }

    @ViewChild(ConfirmDialogComponent) private confirmDialogComponent: ConfirmDialogComponent;
    public confirm(dataItem:ReporteMarcacion): void {
        this.confirmDialogComponent.titulo="Eliminar Reporte Marcacion"
        this.confirmDialogComponent.dataItem=dataItem;
        this.confirmDialogComponent.onShow();

    }
}