/**
 * Created by javier.cuicapuza on 2/15/2017.
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
import {TablaGeneralService} from "../../+common/service/tablaGeneral.service";
import {TablaGeneralFilter} from "../../+common/TablaGeneralFilter";
import {TablaGeneralResultViewModel} from "../../+dto/tablaGeneralResultViewModel";
import {BackendService} from "../../+rest/backend.service";
declare var $: any;

@Component({
    selector: 'busqueda-configuraciones',
    templateUrl: 'busqueda.codigos.component.html'
})
export class BusquedaCodigosComponent extends ComponentBase implements OnInit {

    public grupoTablaGeneral:TablaGeneralResult[];
    public defaultItemGrupo: TablaGeneralResult = {codigo: null, nombre: null, grupo:'Todos'};
    public grupoTablaGeneralSelect: TablaGeneralResult = new TablaGeneralResult();

    public busquedaTablaGeneral: TablaGeneralFilter = new TablaGeneralFilter();
    tablaGeneralResultViewModel: TablaGeneralResultViewModel[] = [];
    private gridView: GridDataResult;
    public isEmpty:boolean = true;
    private pageSize: number = 10;
    private skip: number = 0;
    busy: Subscription;

    storeSessionFilter: StoreSessionFilter = new StoreSessionFilter();

    constructor(private empleadoService: EmpleadoService,
                private _router: Router,
                private tablaGeneralService: TablaGeneralService,
                public backendService: BackendService){

        super(backendService,'MA001');
        this.getGrupoTablaGeneral();
        this.onSubmit();

    }
    ngOnInit(): void {
    }
    onSubmit(){
        this.validarValoresSeleccionados();
        this.getCodigos();
    }
    onLimpiar(){

        this.busquedaTablaGeneral.nombre='';
        this.grupoTablaGeneralSelect.grupo=null;
    }

    private validarValoresSeleccionados(){

        (this.grupoTablaGeneralSelect.grupo === undefined || this.grupoTablaGeneralSelect.grupo == null || this.grupoTablaGeneralSelect.grupo == 'Todos') ? this.busquedaTablaGeneral.grupo = ''
            : this.busquedaTablaGeneral.grupo = (this.grupoTablaGeneralSelect.grupo == null ?  '': this.grupoTablaGeneralSelect.grupo);

        (this.busquedaTablaGeneral.nombre === undefined || this.busquedaTablaGeneral.nombre == null) ? this.busquedaTablaGeneral.nombre = ''
            : this.busquedaTablaGeneral.nombre = (this.busquedaTablaGeneral.nombre == null ?  '': this.busquedaTablaGeneral.nombre);

    }

    private getCodigos(){

        this.busy = this.tablaGeneralService.buscarCodigos(this.busquedaTablaGeneral).subscribe(
            data => {
                this.tablaGeneralResultViewModel = data;
                this.skip = 0;

                this.obtenerTablaGeneral()
            },
            error => this.errorMessage = <any>error
        );
    }

    public onEdit(dataItem: any): void {
        this.storeSessionFilter.isNew = false;
        this.storeSessionFilter.idTableFilter = dataItem.idTablaGeneral;
        this.empleadoService.storeSessionStorage('editTablaGeneralResult',this.storeSessionFilter);
        this._router.navigate(['/mantenimientos/administrarCodigos']);
    }

    private obtenerTablaGeneral(): void{
        if(this.tablaGeneralResultViewModel.length>0){
            this.isEmpty=false;
            this.gridView = {
                data: this.tablaGeneralResultViewModel.slice(this.skip, this.skip + this.pageSize),
                total: this.tablaGeneralResultViewModel.length
            };
        }else{
            this.isEmpty=true;

            this.gridView = {
                data: [],
                total: 0
            };
        }
    }

    /* CARGAR COMBO*/
    private getGrupoTablaGeneral() {
        this.tablaGeneralService.buscarGrupoTablaGeneral().subscribe(
            data => {

                this.grupoTablaGeneral = data;

            },
            error => this.errorMessage = <any>error
        );
    }

    private pageChange(event: PageChangeEvent): void {
        this.skip = event.skip;
        this.obtenerTablaGeneral();

    }

}