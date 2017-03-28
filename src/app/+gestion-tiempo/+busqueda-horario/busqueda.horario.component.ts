import {Component, OnInit} from "@angular/core";
import {GridDataResult, PageChangeEvent} from "@progress/kendo-angular-grid";

import {Router} from "@angular/router";

import {environment} from "../../../environments/environment";
import {CargoService} from "../../+common/service/cargo.service";
import {DepartamentoAreaCombo} from "../../+dto/departamentoAreaCombo";
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {Permiso} from "../../+dto/maintenance/permiso";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {HorarioFilter} from "../../+dto/horarioFilter";
import {Horario} from "../../+dto/maintenance/horario";
import {Subscription} from "rxjs";
import {HorarioService} from "../../+common/service/horario.service";
import {HorarioResult} from "../../+dto/horarioResult";
import {UnidadDeNegocioCombo} from "../../+dto/unidadDeNegocioCombo";
import {StorageResult} from "../../+dto/storageResult";
import {ProyectoCombo} from "../../+dto/proyectoCombo";
import {ComponentBase} from "../../+common/service/componentBase";
import {Http} from "@angular/http";
import {BackendService} from "../../+rest/backend.service";
import {ConfirmDialogComponent} from "../../shared/confirm/confirmDialogBase";
import {ViewChild} from "@angular/core/src/metadata/di";

declare var $: any;

@Component({
    selector: 'busqueda-horario',
    templateUrl: 'busqueda.horario.component.html',
    providers: [CargoService, HorarioService]
})
export class BusquedaHorarioComponent extends ComponentBase implements OnInit {

    busy: Subscription;
    public unidadDeNegocio: UnidadDeNegocioCombo[];
    public proyecto: ProyectoCombo[];
    public departamentos: DepartamentoAreaCombo[];
    public unidadNegocioSelect: UnidadDeNegocioCombo;
    public departamentoSelect: DepartamentoAreaCombo;
    public proyectoSelect: ProyectoCombo;
    public estadosSelect: TablaGeneralResult;

    public tipoHorarioSelect: TablaGeneralResult;

    public porDefectoSelect: {defecto: number,nombre: string};

    public defaultItemUnidadNegocio: UnidadDeNegocioCombo = {idUnidadDeNegocio: null, nombre: 'Todos'};
    public defaultItemTablaGeneral: TablaGeneralResult = {codigo: null, nombre: 'Todos',grupo:null};
    public defaultItemDepartamento: DepartamentoAreaCombo = {
        idDepartamentoArea: null,
        idUnidadDeNegocio: null,
        nombre: 'Todos'
    };
    public defaultItemProyecto: ProyectoCombo = {idProyecto: null,idDepartamentoArea:null, nombre: 'Todos'};

    public porDefecto: any = [{defecto: 1, nombre: 'Si'}, {defecto: 0, nombre: 'No'}];

    public defaultItemPorDefecto: any = {defecto: null, nombre: 'Todos'};

    horarioFilter: HorarioFilter = new HorarioFilter();
    public permisos: Permiso[] = [];

    public horarios: HorarioResult[] = [];

    public estados: TablaGeneralResult[];

    private gridView: GridDataResult;
    private pageSize: number = 10;
    private data: Object[];
    private skip: number = 0;

    dataItem: Permiso;
    public isEmpty: boolean = true;
    public isSearch: boolean = false;

    public noItems: boolean = false;

    private tiposhorario: TablaGeneralResult[] = [];

    localhost: String = environment.backend;
    port: String = environment.port;

    constructor(private empleadoService: EmpleadoService,
                public backendService: BackendService,
                private horarioService:HorarioService,
                private _router: Router) {

        super(backendService, 'GT004');
        this.onSubmit();
    }

    onEliminarHorario(dataItem: Horario): void {

        this.horarioService.eliminarHorario(dataItem.idHorario).subscribe(

            data => {

                this.backendService.notification(this.msgs, data);

                if (data.codigo == 1) {
                    this.getHorarios();
                }

            },
            error => {

                this.backendService.notification(this.msgs, error);
            }


        );
    }

    onLimpiar() {

        this.unidadNegocioSelect = this.defaultItemUnidadNegocio;
        this.departamentoSelect = this.defaultItemDepartamento;
        this.departamentos = null;
        this.proyectoSelect = this.defaultItemProyecto;
        this.proyecto = null;

        this.estadosSelect = this.defaultItemTablaGeneral;

        this.horarios = [];

        this.gridView = {
            data: [],
            total: 0
        };

        this.skip = 0;
    }

    onSubmit() {
        this.validarValoresSeleccionados();
        this.getHorarios();

    }

    private getHorarios() {
        this.busy = this.horarioService.buscarHorarios(this.horarioFilter).subscribe(
            data => {
                this.isSearch = true;
                this.horarios = data;
                this.skip = 0;

                this.obtenerHorarios()
            },
            error => this.errorMessage = <any>error
        );
    }

    public onNew(): void {
        this.empleadoService.storeSessionStorage('isNewHorario',true);
        this.empleadoService.storeSessionStorage('idHorario',undefined);

        this._router.navigate(['/gestionTiempo/administrarHorario']);
    }

    public onEdit(horario: HorarioResult): void {

        this.empleadoService.storeSessionStorage('isNewHorario',false);
        this.empleadoService.storeSessionStorage('idHorario',horario.idHorario);
        this._router.navigate(['/gestionTiempo/administrarHorario']);

    }

    private obtenerHorarios(): void {

        if (this.horarios.length > 0) {
            this.isEmpty = false;
            this.gridView = {
                data: this.horarios.slice(this.skip, this.skip + this.pageSize),
                total: this.horarios.length
            };
        } else {
            this.isEmpty = true;

            this.gridView = {
                data: [],
                total: 0
            };
        }

    }

    protected pageChangeMarcaciones(event: PageChangeEvent): void {
        this.skip = event.skip;
        this.obtenerHorarios();

    }
    private validarValoresSeleccionados() {

        (this.estadosSelect === undefined || this.estadosSelect == null) ? this.horarioFilter.estado = null
            : this.horarioFilter.estado = this.estadosSelect.codigo;

        (this.tipoHorarioSelect === undefined || this.tipoHorarioSelect == null) ? this.horarioFilter.tipoHorario = null
            : this.horarioFilter.tipoHorario = this.tipoHorarioSelect.codigo;

        this.porDefectoSelect === undefined ? this.horarioFilter.porDefecto = null
            : this.horarioFilter.porDefecto = this.porDefectoSelect.defecto;


        this.proyectoSelect === undefined ? this.horarioFilter.proyecto = ''
            : this.horarioFilter.proyecto = (this.proyectoSelect.idProyecto == null ? '' : this.proyectoSelect.idProyecto.toString());

    }

    ngOnInit() {
        this.getTiposHorario();
        this.obtenerProyectos();
        this.getEstados();
    }

    private obtenerProyectos() {
        this.proyecto = this.storageCommomnValueResult.proyecto;
    }
    private getTiposHorario() {
        this.tiposhorario = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Horario.TipoHorario' === grupo.grupo);
    }

    private getEstados() {
        this.estados = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Estado' === grupo.grupo);
    }

    @ViewChild(ConfirmDialogComponent) private confirmDialogComponent: ConfirmDialogComponent;

    public confirm(dataItem:Horario): void {
        this.confirmDialogComponent.titulo="Eliminar Horario"
        this.confirmDialogComponent.dataItem=dataItem;
        this.confirmDialogComponent.onShow();

    }


}