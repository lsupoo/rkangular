/**
 * Created by javier.cuicapuza on 1/3/2017.
 */
import {Component, OnInit} from "@angular/core";
import {GridDataResult, PageChangeEvent} from "@progress/kendo-angular-grid";

import {Router} from "@angular/router";

import {CompleterService} from "ng2-completer";
import {CargoService} from "../../+common/service/cargo.service";
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {Subscription} from "rxjs";
import {LocalStorageGlobal} from "../../+dto/localStorageDto";
import {EnumRolEmpleado} from "../../+enums/enumRolEmpleado";
import {StoreSessionFilter} from "../../+dto/storeSessionFilter";
import {StorageResult} from "../../+dto/storageResult";
import {ComponentBase} from "../../+common/service/componentBase";
import {Http} from "@angular/http";
import {ConfiguracionSistemaFilter} from "../../+dto/configuracionSistemaFilter";
import {ConfiguracionSistemaService} from "../../+common/service/configuracionsistema.service";
import {ConfiguracionSistema} from "../../+dto/maintenance/configuracionSistema";
import {ConfiguracionSistemaResult} from "../../+dto/configuracionSistemaResult";
import {BackendService} from "../../+rest/backend.service";

declare var $: any;

@Component({
    selector: 'busqueda-configuracionsistema',
    templateUrl: 'busqueda.configuracionsistema.component.html',
    providers: [ ConfiguracionSistemaService]
})
export class BusquedaConfiguracionSistemaComponent extends ComponentBase implements OnInit {

    busquedaConfiguracionSistema: ConfiguracionSistemaFilter  = new ConfiguracionSistemaFilter();
    storeSessionFilter: StoreSessionFilter = new StoreSessionFilter();

    configuracionSistema: ConfiguracionSistema[] = [];
    configuracionSistemaResult: ConfiguracionSistemaResult[] = [];

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
                private configuracionSistemaService: ConfiguracionSistemaService){
        super(backendService,'MA002');
        this.onSubmit();
    }
    ngOnInit() {
    }


    public onEdit(dataItem: any): void {
        this.storeSessionFilter.isNew = false;
        this.storeSessionFilter.idTableFilter = dataItem.idConfiguracionSistema;
        this.empleadoService.storeSessionStorage('editConfiguracionSistemaResult',this.storeSessionFilter);
        this._router.navigate(['/mantenimientos/administrarConfiguracionSistema']);
    }


    onSubmit(){
        this.validarValoresSeleccionados();
        this.getConfiguracionesSistema();
    }

    private validarValoresSeleccionados(){

        (this.busquedaConfiguracionSistema.codigo === undefined || this.busquedaConfiguracionSistema.codigo == null) ? this.busquedaConfiguracionSistema.codigo = '':
            this.busquedaConfiguracionSistema.codigo=this.busquedaConfiguracionSistema.codigo;

        (this.busquedaConfiguracionSistema.descripcion === undefined || this.busquedaConfiguracionSistema.descripcion == null) ? this.busquedaConfiguracionSistema.descripcion = '':
            this.busquedaConfiguracionSistema.descripcion=this.busquedaConfiguracionSistema.descripcion;

    }

    private getConfiguracionesSistema(){
        this.busy = this.configuracionSistemaService.obtenerConfiguracionesSistema(this.busquedaConfiguracionSistema).subscribe(
            data => {
                this.isSearch = true;
                this.configuracionSistemaResult = data;
                this.skip = 0;

                this.obtenerConfiguracionesSistema()
            },
            error => this.errorMessage = <any>error
        );
    }

    private obtenerConfiguracionesSistema(): void {
        if(this.configuracionSistemaResult.length>0){
            this.isEmpty=false;
            this.gridView = {
                data: this.configuracionSistemaResult.slice(this.skip, this.skip + this.pageSize),
                total: this.configuracionSistemaResult.length
            };
        }else{
            this.isEmpty=true;

            this.gridView = {
                data: [],
                total: 0
            };
        }
    }

    onLimpiar(){
        this.busquedaConfiguracionSistema.codigo="";
        this.busquedaConfiguracionSistema.descripcion="";
        this.gridView = {
            data: [],
            total: 0
        };
    }

    onAgregarTipoLicencia(){
        this._router.navigate(['/mantenimientos/administrarConfiguracionSistema']);
    }

    protected pageChange(event: PageChangeEvent): void {
        this.skip = event.skip;
        this.obtenerConfiguracionesSistema();

    }
}