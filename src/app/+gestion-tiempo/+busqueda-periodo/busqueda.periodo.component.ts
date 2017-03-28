import {Component, OnInit} from "@angular/core";
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {GridDataResult, PageChangeEvent} from "@progress/kendo-angular-grid";
import {EmpleadoService} from "../../+common/service/empleado.service";

import {Router} from "@angular/router";

import {environment} from "../../../environments/environment";
import {CompleterData, CompleterService} from "ng2-completer";
import {Subscription} from "rxjs";
import {DepartamentoAreaCombo} from "../../+dto/departamentoAreaCombo";
import {StoreSessionFilter} from "../../+dto/storeSessionFilter";
import {PermisoService} from "../../+common/service/permiso.service";
import {UnidadDeNegocioCombo} from "../../+dto/unidadDeNegocioCombo";
import {ProyectoCombo} from "../../+dto/proyectoCombo";
import {Http} from "@angular/http";
import {ComponentBase} from "../../+common/service/componentBase";
import {PeriodoEmpleadoFilter} from "../../+dto/periodoEmpleadoFilter";
import {PeriodoEmpleadoResult} from "../../+dto/PeriodoEmpleadoResult";
import {PeriodoEmpleadoService} from "../../+common/service/periodoEmpleado.service";
import {BackendService} from "../../+rest/backend.service";

declare var $: any;

@Component({
    selector: 'busqueda-periodo',
    templateUrl: 'busqueda.periodo.component.html'
})
export class BusquedaPeriodoComponent extends ComponentBase implements OnInit {

    busy: Subscription;
    public unidadDeNegocio: UnidadDeNegocioCombo[];
    public proyecto: ProyectoCombo[];
    public departamentoArea: DepartamentoAreaCombo[];
    public unidadNegocioSelect: UnidadDeNegocioCombo;
    public departamentoSelect: DepartamentoAreaCombo;
    public proyectoSelect: ProyectoCombo;
    public defaultItemUndNegocio: UnidadDeNegocioCombo = {idUnidadDeNegocio: null, nombre: 'Todos'};

    public defaultItemTablaGeneral: TablaGeneralResult = {codigo: null, nombre: 'Todos', grupo:null};

    public defaultItemDepartamento: DepartamentoAreaCombo = {idDepartamentoArea: null,idUnidadDeNegocio: null, nombre: 'Todos'};
    public defaultItemProyecto: ProyectoCombo = {idProyecto: null,idDepartamentoArea:null, nombre: 'Todos'};

    busquedaPeriodoEmpleado: PeriodoEmpleadoFilter = new PeriodoEmpleadoFilter();
    storeSessionFilter: StoreSessionFilter = new StoreSessionFilter();
    public noItems: boolean = false;
    public periodoEmpleadoResult: PeriodoEmpleadoResult[] = [];

    private gridView: GridDataResult;
    private pageSize: number = 10;
    private data: Object[];
    private skip: number = 0;

    public isEmpty:boolean = true;
    public isSearch: boolean = false;

    //Autocomplete

    private dataServiceEmpleado:CompleterData;

    private dataServiceJefeInmediato:CompleterData;

    localhost:  String = environment.backend;
    port: String = environment.port;

    constructor(private empleadoService: EmpleadoService,
                private permisoService:PermisoService,
                private periodoEmpleadoService: PeriodoEmpleadoService,
                public backendService: BackendService,
                private _router: Router,
                private completerService: CompleterService){
        super(backendService,'GT008');

        this.dataServiceEmpleado = completerService.remote(this.urlAutocompleteEmpleado,'nombreEmpleado','nombreEmpleado');

        this.dataServiceJefeInmediato = completerService.remote(this.urlAutocompleteEmpleado,'nombreEmpleado','nombreEmpleado');


        if(this.busquedaPeriodoEmpleado.idEmpleado === undefined || this.busquedaPeriodoEmpleado.idEmpleado == null || this.busquedaPeriodoEmpleado.idEmpleado == null){
            this.busquedaPeriodoEmpleado.idEmpleado = null;
        }else{
            this.onSubmit();
        }
        this.getUnidadDeNegocio();
        //FALTA CARGAR DEPA Y PROYECTO
        this.busquedaPeriodoEmpleado.vigente = true;
        this.onSubmit();

    }

    selectEmpleado(e){
        if(e !=null)
            this.busquedaPeriodoEmpleado.idEmpleado = e.originalObject.idEmpleado;
        else
            this.busquedaPeriodoEmpleado.idEmpleado = null;
    }

    selectIsVigente(value){

        let isChecked:boolean = value.target.checked;
        this.busquedaPeriodoEmpleado.vigente = isChecked;
    }

    selectJefeInmediato(e){
        if(e !=null)
            this.busquedaPeriodoEmpleado.idJefeInmediato = e.originalObject.idEmpleado;
        else
            this.busquedaPeriodoEmpleado.idJefeInmediato = null;
    }

    onLimpiar(){
        this.busquedaPeriodoEmpleado.nombreEmpleado = undefined;
        this.busquedaPeriodoEmpleado.jefeInmediato = undefined;

        this.busquedaPeriodoEmpleado.idJefeInmediato = null;
        this.busquedaPeriodoEmpleado.idEmpleado = null;

        this.unidadNegocioSelect = this.defaultItemUndNegocio;
        this.departamentoSelect = this.defaultItemDepartamento;
        this.departamentoArea = null;
        this.proyectoSelect = this.defaultItemProyecto;
        this.proyecto= null;


        this.gridView = {
            data: [],
            total: 0
        };
    }

    onSubmit(){
        this.validarValoresSeleccionados();
        this.getPermisos();
    }

    onExportar(){

        if(this.periodoEmpleadoResult.length==0){
            this.noItems = true;
        }else{
            this.noItems = false;

            if ($("#export_file").length > 0) {
                $("#export_file").remove();
            }
            if ($("#export_file").length === 0) {
                var iframe = $("<iframe src='' name='export_file' id='export_file'></iframe>");
                iframe.appendTo("body");

                var form = $("<form action='http://"+this.localhost+":"+ this.port +"/periodoEmpleado/exportarPeriodoEmpleado' method='post' target='export_file'></form>");
                form.append($("<input type='hidden' name='idEmpleado' id='idEmpleado' />").attr("value",this.busquedaPeriodoEmpleado.idEmpleado));
                form.append($("<input type='hidden' name='unidadNegocio' id='unidadNegocio' />").attr("value",this.busquedaPeriodoEmpleado.unidadNegocio));
                form.append($("<input type='hidden' name='departamento' id='departamento' />").attr("value",this.busquedaPeriodoEmpleado.departamento));
                form.append($("<input type='hidden' name='proyecto' id='proyecto' />").attr("value",this.busquedaPeriodoEmpleado.proyecto));
                form.append($("<input type='hidden' name='idJefeInmediato' id='idJefeInmediato' />").attr("value",this.busquedaPeriodoEmpleado.idJefeInmediato));
                form.append($("<input type='hidden' name='vigente' id='vigente' />").attr("value",this.busquedaPeriodoEmpleado.vigente));
                form.appendTo("body");

                form.submit();
            }
        }
    }

    private getPermisos() {

        this.busy = this.periodoEmpleadoService.buscarPeriodoEmpleado(this.busquedaPeriodoEmpleado).subscribe(
            data => {
                this.isSearch = true;
                this.periodoEmpleadoResult = data;
                this.skip = 0;

                this.obtenerPeriodoEmpleado()
            },
            error => this.errorMessage = <any>error
        );
    }

    private obtenerPeriodoEmpleado(): void {
        if(this.periodoEmpleadoResult.length>0){
            this.isEmpty=false;
            this.gridView = {
                data: this.periodoEmpleadoResult.slice(this.skip, this.skip + this.pageSize),
                total: this.periodoEmpleadoResult.length
            };

        }else{
            this.isEmpty=true;

            this.gridView = {
                data: [],
                total: 0
            };
        }

    }

    ngOnInit() {

    }

    private validarValoresSeleccionados() {

        if (this.busquedaPeriodoEmpleado.nombreEmpleado === undefined) this.busquedaPeriodoEmpleado.nombreEmpleado = '';
        if (this.busquedaPeriodoEmpleado.jefeInmediato === undefined) this.busquedaPeriodoEmpleado.jefeInmediato = '';

        this.unidadNegocioSelect === undefined ? this.busquedaPeriodoEmpleado.unidadNegocio = ''
            : this.busquedaPeriodoEmpleado.unidadNegocio = (this.unidadNegocioSelect.idUnidadDeNegocio == null ?  '': this.unidadNegocioSelect.idUnidadDeNegocio.toString());;

        this.departamentoSelect === undefined ? this.busquedaPeriodoEmpleado.departamento = ''
            : this.busquedaPeriodoEmpleado.departamento = (this.departamentoSelect.idDepartamentoArea == null ?  '': this.departamentoSelect.idDepartamentoArea.toString());

        this.proyectoSelect === undefined ? this.busquedaPeriodoEmpleado.proyecto = ''
            : this.busquedaPeriodoEmpleado.proyecto = (this.proyectoSelect.idProyecto == null ?  '': this.proyectoSelect.idProyecto.toString());
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

        let codigo: any = value.idUnidadDeNegocio;
        this.departamentoSelect = this.defaultItemDepartamento;
        if(value == null){
            this.departamentoArea = null;
        }else {
            this.obtenerDepartamentos(codigo);
        }
        this.proyectoSelect = this.defaultItemProyecto;
        this.proyecto =null;

    }

    actualizarProyecto(value): void {
        let codigo: any = value.idDepartamentoArea;
        this.obtenerProyecto(codigo);
        this.proyectoSelect = this.defaultItemProyecto;
    }
    protected pageChangePermisos(event: PageChangeEvent): void {
        this.skip = event.skip;
        this.obtenerPeriodoEmpleado();

    }

    validateFilterEmptyEmpleado(e){
        if ((e.which && e.which == 8) || (e.which && e.which == 46) || (e.keyCode && e.keyCode == 8) || (e.keyCode && e.keyCode == 46)) {
            if(e.srcElement.value == ''){
                this.busquedaPeriodoEmpleado.idEmpleado = null;
                this.busquedaPeriodoEmpleado.nombreEmpleado = undefined;
            }
        }
        return true;
    }

    validateFilterEmptyJefeInmediato(e){
        if ((e.which && e.which == 8) || (e.which && e.which == 46) || (e.keyCode && e.keyCode == 8) || (e.keyCode && e.keyCode == 46)) {
            if(e.srcElement.value == ''){
                this.busquedaPeriodoEmpleado.idJefeInmediato = null;
                this.busquedaPeriodoEmpleado.jefeInmediato = undefined;
            }
        }
        return true;
    }
}