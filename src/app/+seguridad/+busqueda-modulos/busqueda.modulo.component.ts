import {Component, OnInit} from "@angular/core";
import {GridDataResult, PageChangeEvent} from "@progress/kendo-angular-grid";

import {Router} from "@angular/router";

import {environment} from "../../../environments/environment";
import {CompleterService} from "ng2-completer";
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {Subscription} from "rxjs";
import {StorageResult} from "../../+dto/storageResult";
import {Http} from "@angular/http";
import { ModuloAccionFilter} from "../../+dto/moduloAccionFilter";
import {ModuloService} from "../../shared/layout/navigation/http-modulo-service";
import {ModuloAccionResult} from "../../+dto/moduloAccionResult";
import {ComponentBase} from "../../+common/service/componentBase";
import {BackendService} from "../../+rest/backend.service";


declare var $: any;

@Component({
    selector: 'busqueda-modulo',
    templateUrl: 'busqueda.modulo.component.html'
})
export class BusquedaModuloComponent extends ComponentBase implements OnInit {

    busy: Subscription;
    public defaultItemTablaGeneral: TablaGeneralResult = {codigo: null, nombre: 'Todos', grupo:null};
    //public storageCommomnValueResult: StorageResult = new StorageResult();
    public visibleItems: Array<{ text: string, value: number }> = [
        { text: "Si", value: 1 },
        { text: "No", value: 0 }
    ];

    busquedaModulos: ModuloAccionFilter = new ModuloAccionFilter();
    public modulosResult: ModuloAccionResult[] = [];
    public estados:TablaGeneralResult[];
    private gridView: GridDataResult;
    private pageSize: number = 10;
    private data: Object[];
    private skip: number = 0;


    public isEmpty:boolean = true;
    public isSearch: boolean = false;

    public noItems: boolean = false;


    localhost:  String = environment.backend;
    port: String = environment.port;

    constructor(private empleadoService: EmpleadoService,
                private _router: Router,
                public backendService: BackendService,
                public moduloService: ModuloService){

        super(backendService,'SE003');
        this.onSubmit();
    }

    onLimpiar(){
       this.busquedaModulos.nombre = undefined;
        this.busquedaModulos.codigo= undefined;

        this.modulosResult = [];

        this.gridView = {
            data: [],
            total: 0
        };

        this.skip = 0;
    }

    onSubmit(){
        this.validarValoresSeleccionados();
        this.getModulos();
    }

    private getModulos() {

        this.busy = this.moduloService.buscarModulos(this.busquedaModulos).subscribe(
            data => {
                this.isSearch = true;
                this.modulosResult = data;
                this.skip = 0;

                this.obtenerModulos()
            },
            error => this.errorMessage = <any>error
        );
    }

    public onActualizarModulo(data: ModuloAccionResult): void {


        this.empleadoService.storeSessionStorage('isNewModulo',false);
        this.empleadoService.storeSessionStorage('idModulo',data.idModulo);
        this._router.navigate(['/seguridad/administrarModulo']);

    }


    private obtenerModulos(): void {

        if(this.modulosResult.length>0){
            this.isEmpty=false;
            this.gridView = {
                data: this.modulosResult.slice(this.skip, this.skip + this.pageSize),
                total: this.modulosResult.length
            };
        }else{
            this.isEmpty=true;

            this.gridView = {
                data: [],
                total: 0
            };
        }


    }

    protected pageChangeModulos(event: PageChangeEvent): void {
        this.skip = event.skip;
        this.obtenerModulos();

    }


    ngOnInit() {
        //this.getUndNegocio();
        //this.getProyectoEstados();
    }


    private validarValoresSeleccionados() {

        if (this.busquedaModulos.nombre === undefined) this.busquedaModulos.nombre = '';
        if (this.busquedaModulos.codigo === undefined) this.busquedaModulos.codigo = '';

    }


    /*private getUndNegocio() {
        this.undnegocios = this.storageCommomnValueResult.unidadDeNegocio;
    }

    private obtenerDepartamentos(idUndNegocio: number) {
        this.departamentos = this.storageCommomnValueResult.departamentoArea.filter(depa => idUndNegocio === depa.idUnidadDeNegocio);
    }

    private obtenerProyecto(idDepartamentoArea: number) {
        this.proyectos = this.storageCommomnValueResult.proyecto.filter(proyect => idDepartamentoArea === proyect.idDepartamentoArea);
    }


    private getProyectoEstados() {
        this.estados = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Estado' === grupo.grupo);
    }

    actualizarDpto(value): void {

        let codigo: any = value;
        this.departamentoSelect = this.defaultItemDepartamento;
        if(value == null){
            this.departamentos = null;
        }else {
            this.obtenerDepartamentos(codigo);
        }
        //this.isEnableProyectos = true;
        this.proyectoSelect = this.defaultItemProyecto;
        this.proyectos =null;


    }


    actualizarProyecto(value): void {
        let codigo: any = value;
        this.proyectoSelect = this.defaultItemProyecto;
        this.obtenerProyecto(codigo);

    }*/


}