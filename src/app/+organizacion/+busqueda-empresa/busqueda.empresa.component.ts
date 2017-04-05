import {Component, OnInit} from "@angular/core";
import {GridDataResult, PageChangeEvent} from "@progress/kendo-angular-grid";

import {Router} from "@angular/router";

import {environment} from "../../../environments/environment";
import {CompleterService, CompleterData} from "ng2-completer";
import {UnidadDeNegocioCombo} from "../../+dto/unidadDeNegocioCombo";
import {DepartamentoAreaCombo} from "../../+dto/departamentoAreaCombo";
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {Permiso} from "../../+dto/maintenance/permiso";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {Marcacion} from "../../+dto/maintenance/marcacion";
import {Subscription} from "rxjs";
import {CargoFilter} from "../../+dto/cargoFilter";
import {ProyectoCombo} from "../../+dto/proyectoCombo";
import {StorageResult} from "../../+dto/storageResult";
import {ComponentBase} from "../../+common/service/componentBase";
import {Http} from "@angular/http";
import {CargoResult} from "../../+dto/cargoResult";
import {EmpresaResult} from "../../+dto/empresaResult";
import {EmpresaFilter} from "../../+dto/empresaFilter";
import {EmpresaService} from "../../+common/service/empresa.service";
import {BackendService} from "../../+rest/backend.service";

declare var $: any;

@Component({
    selector: 'busqueda-empresa',
    templateUrl: 'busqueda.empresa.component.html',
    providers: [EmpresaService],
    //styles: [require('@progress/kendo-theme-default/dist/all.css')]
})
export class BusquedaEmpresaComponent extends ComponentBase implements OnInit {

    busy: Subscription;
    public undnegocios: UnidadDeNegocioCombo[];
    public proyectos: ProyectoCombo[];
    public departamentos: DepartamentoAreaCombo[];
    public unidadNegocioSelect: UnidadDeNegocioCombo;
    public departamentoSelect: DepartamentoAreaCombo;
    public proyectoSelect: ProyectoCombo;
    public estadosSelect: TablaGeneralResult;
    public defaultItem: UnidadDeNegocioCombo = {idUnidadDeNegocio: null, nombre: 'Todos'};

    public defaultItemEstado: TablaGeneralResult = {codigo: null, nombre: 'Todos',grupo: null};

    public defaultItemDepartamento: DepartamentoAreaCombo = {idDepartamentoArea: null,idUnidadDeNegocio: null, nombre: 'Todos'};
    public defaultItemProyecto: ProyectoCombo = {idProyecto: null,idDepartamentoArea: null, nombre: 'Todos'};

    public busquedaEmpresa: EmpresaFilter = new EmpresaFilter();

    public empresas: EmpresaResult[] = [];

    public estados:TablaGeneralResult[];

    private gridView: GridDataResult;
    private pageSize: number = 10;
    private data: Object[];
    private skip: number = 0;

    dataItem: Permiso;
    public isEmpty:boolean = true;
    public isSearch: boolean = false;

    public noItems: boolean = false;

    private dataServiceJefe:CompleterData;

    localhost:  String = environment.backend;
    port: String = environment.port;

    public sourceAut :Array<{name,value}>=[
        {name:"juan",value:1},
        {name:"julio",value:2},
        {name:"junior",value:3},
        {name:"jose",value:4}
    ];

    public dataAut :Array<{name,value}>=[];


    constructor(private empleadoService: EmpleadoService,
                private _router: Router,
                public backendService: BackendService,
                private completerService: CompleterService,
                private empresaService: EmpresaService){

        super(backendService,'OR001');

        this.dataServiceJefe = completerService.remote(this.urlAutocompleteEmpleado,'nombreEmpleado','nombreEmpleado');

        this.dataAut = this.sourceAut;
        this.onSubmit();

        //this.dataAut = this.sourceAut;

    }

    filterAut(value){
        this.dataAut = this.sourceAut.filter((s)=> s.name.toLowerCase().indexOf(value.toLowerCase())!==-1);
    }

    onLimpiar(){

        this.busquedaEmpresa.jefe='';
        this.busquedaEmpresa.razonSocial='';
        this.busquedaEmpresa.ruc='';
        this.busquedaEmpresa.codigo='';

        this.busquedaEmpresa.estado=this.defaultItemEstado.codigo;

        //this.busquedaEmpresa.estado=this.estadosSelect.codigo;
        this.empresas = [];

        this.gridView = {
            data: [],
            total: 0
        };

        this.skip = 0;
    }

    onSubmit(){
        this.validarValoresSeleccionados();


        this.getEmpresas();
    }

    onNuevaEmpresa(){
        this.empleadoService.storeSessionStorage('isNewEmpresa',true);
        this.empleadoService.storeSessionStorage('idEmpresa',undefined);
        this._router.navigate(['/organizacion/administrarEmpresa']);
    }

    private getEmpresas() {
        this.busy = this.empresaService.buscarEmpresa(this.busquedaEmpresa).subscribe(
            data => {
                this.isSearch = true;
                this.empresas = data;
                this.skip = 0;

                this.obtenerEmpresas()
            },
            error => this.errorMessage = <any>error
        );
    }

    public onActualizarEmpresa(data: EmpresaResult): void {


        this.empleadoService.storeSessionStorage('isNewEmpresa',false);
        this.empleadoService.storeSessionStorage('idEmpresa',data.idEmpresa);
        this._router.navigate(['/organizacion/administrarEmpresa']);

    }

    selectJefe(e){
        if(e !=null)
            this.busquedaEmpresa.idJefe = e.originalObject.idEmpleado;
        else
            this.busquedaEmpresa.idJefe = null;
    }

    private obtenerEmpresas(): void {

        if(this.empresas.length>0){
            this.isEmpty=false;
            this.gridView = {
                data: this.empresas.slice(this.skip, this.skip + this.pageSize),
                total: this.empresas.length
            };
        }else{
            this.isEmpty=true;

            this.gridView = {
                data: [],
                total: 0
            };
        }


    }

    protected pageChangeEmpresa(event: PageChangeEvent): void {
        this.skip = event.skip;
        this.obtenerEmpresas();

    }


    ngOnInit() {
        this.getEstados();
    }


    private validarValoresSeleccionados() {

        if (this.busquedaEmpresa.codigo === undefined) this.busquedaEmpresa.codigo = '';

        if (this.busquedaEmpresa.razonSocial === undefined) this.busquedaEmpresa.razonSocial = '';

        if (this.busquedaEmpresa.ruc === undefined) this.busquedaEmpresa.ruc = '';

    }

    private getEstados() {
        this.estados = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Estado' === grupo.grupo);
    }

    validateFilterEmptyJefe(e){
        if ((e.which && e.which == 8) || (e.which && e.which == 46) || (e.keyCode && e.keyCode == 8) || (e.keyCode && e.keyCode == 46)) {
            if(e.srcElement.value == ''){
                this.busquedaEmpresa.idJefe = null;
                this.busquedaEmpresa.jefe = undefined;
            }
        }
        return true;
    }


}