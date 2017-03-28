import {OnInit, Component} from "@angular/core";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {Router} from "@angular/router";
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {Subscription} from "rxjs";
import {StoreSessionFilter} from "../../+dto/storeSessionFilter";
import {RolResult} from "../../+dto/rolResult";
import {RolFilter} from "../../+dto/rolFilter";
import {GridDataResult} from "@progress/kendo-angular-grid";
import {RolService} from "../../+common/service/rol.service";
import {ComponentBase} from "../../+common/service/componentBase";
import {Http} from "@angular/http";
import {BackendService} from "../../+rest/backend.service";
declare var $: any;
@Component({
    selector: 'busqueda-roles',
    templateUrl: 'busqueda.roles.component.html'
})
export class BusquedaRolesComponent extends ComponentBase implements OnInit {

    public estados:TablaGeneralResult[];
    public defaultItemEstados: TablaGeneralResult = {codigo: null, nombre: 'Todos'};
    public estadosSelect: TablaGeneralResult;

    busy: Subscription;

    private rolFilter: RolFilter = new RolFilter();
    storeSessionFilter: StoreSessionFilter = new StoreSessionFilter();
    rolResult: RolResult[] = [];
    private gridView: GridDataResult;
    private pageSize: number = 10;
    private skip: number = 0;
    public isSearch: boolean = false;

    constructor(private empleadoService: EmpleadoService,
                private rolService: RolService,
                public backendService: BackendService,
                private _router: Router){
        super(backendService, 'SE002');

        this.onSubmit();
    }
    ngOnInit() {
        this.getEstados();
    }

    onAgregarRol(){
        this.storeSessionFilter.isNew = true;
        this.empleadoService.storeSessionStorage('editRolResult',this.storeSessionFilter);

        this._router.navigate(['/seguridad/administrarRoles']);
    }
    onSubmit(){
        this.validarValoresSeleccionados();
        this.getRoles();
    }
    private validarValoresSeleccionados(){


        if (this.rolFilter.nombre === undefined || this.rolFilter.nombre == null) this.rolFilter.nombre = '';
        if (this.rolFilter.descripcion === undefined || this.rolFilter.descripcion == null) this.rolFilter.descripcion = '';

        (this.estadosSelect === undefined || this.rolFilter.estado == null) ? this.rolFilter.estado = ''
            : this.rolFilter.estado = (this.estadosSelect.codigo == null ?  '': this.estadosSelect.codigo.toString());

    }
    private getRoles(){

        this.busy = this.rolService.buscarRolEmpleado(this.rolFilter).subscribe(
            data => {
                this.isSearch = true;
                this.rolResult = data;
                this.skip = 0;

                this.obtenerRol()
            },
            error => this.errorMessage = <any>error
        );
    }
    private obtenerRol(): void {

        if(this.rolResult.length>0){
            this.gridView = {
                data: this.rolResult.slice(this.skip, this.skip + this.pageSize),
                total: this.rolResult.length
            };
        }else{
            this.gridView = {
                data: [],
                total: 0
            };
        }


    }
    onLimpiar(){


        this.rolFilter.descripcion = undefined;
        this.rolFilter.nombre = undefined;
        this.estadosSelect = null;

        this.gridView = {
            data: [],
            total: 0
        };
    }


    private getEstados() {
        this.estados = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Estado' === grupo.grupo);
    }
    public onEdit(dataItem: any): void {

        this.storeSessionFilter.isNew = false;
        this.storeSessionFilter.idTableFilter = dataItem.idRol;
        this.empleadoService.storeSessionStorage('editRolResult',this.storeSessionFilter);

        this._router.navigate(['/seguridad/administrarRoles']);

    }

    onDelete(dataItem: RolResult): void {

        this.rolService.eliminarRolEmpleado(dataItem.idRol).subscribe(
            data => {
                this.getRoles();
            },
            error => this.errorMessage = <any>error
        );
    }

}