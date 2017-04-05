import {Component, OnInit, EventEmitter, Output, ViewChild} from '@angular/core';
import { Location } from '@angular/common';
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {NotificationsService} from "angular2-notifications/src/notifications.service";
import {StoreSessionFilter} from "../../+dto/storeSessionFilter";
import {ComponentBase} from "../../+common/service/componentBase";
import {Http} from "@angular/http";
import {RolService} from "../../+common/service/rol.service";
import {Rol} from "../../+dto/maintenance/rol";
import {SortDescriptor} from "@progress/kendo-data-query";
import {GridDataResult, DataStateChangeEvent, GridComponent} from "@progress/kendo-angular-grid";
import {Modulo} from "../../+dto/maintenance/modulo";
import {BackendService} from "../../+rest/backend.service";

declare var $: any;
@Component({
    selector: 'administrar-roles',
    templateUrl: 'administrar.roles.component.html',
    providers: [NotificationsService]
})
export class AdministrarRolesComponent extends ComponentBase implements OnInit {

    @Output() save: EventEmitter<any> = new EventEmitter();

    public estados:TablaGeneralResult[];
    public estadosSelect: TablaGeneralResult;
    public defaultItemEstados: TablaGeneralResult = {codigo: null, nombre: 'Todos'};
    storeSessionFilter: StoreSessionFilter = new StoreSessionFilter();

    rol: Rol = new Rol();
    private sort:Array<SortDescriptor>=[];
    private gridViewSubModulo: GridDataResult;
    private viewSubModulo: Array<Modulo>=[];
    private pageSizeRol: number = 10;
    private skipRol: number = 0;

    @ViewChild(GridComponent) grid: GridComponent;
    public dataItemSubModulo: Modulo;

    constructor(private _service: NotificationsService,
                private empleadoService: EmpleadoService,
                public backendService: BackendService,
                private rolService: RolService,
                private location: Location) {
        super(backendService,'SE002');

        this.storeSessionFilter = this.empleadoService.retrieveSessionStorage('editRolResult');
        if(this.storeSessionFilter.isNew == false){
            this.obtenerRolById(this.storeSessionFilter.idTableFilter);

        }else{
            this.obtenerSubModuleAccion();
        }
    }

    private obtenerRolById(idRol: any): void{
        this.rolService.obtenerRolById(idRol).subscribe(
            data => this.showDetail(data),
            error => this.errorMessage = <any>error
        );
    }

    private obtenerSubModuleAccion(): void{
        this.rolService.obtenerSubModuleAccion().subscribe(
            data => this.showDetailNewRol(data),
            error => this.errorMessage = <any>error
        );
    }

    ngOnInit() {

    }
    showDetail(data:Rol){
        this.getEstados();

        this.rol = data;
        this.viewSubModulo = data.modulo;
        this.obtenerGridSubModulo();
    }

    showDetailNewRol(data:Rol){
        this.getEstados();

        this.rol = data;
        this.viewSubModulo = data.modulo;
        this.obtenerGridSubModulo();
    }

    onRegresarBusquedaAlertas(){
        this.location.back();
    }
    onGuardarRol(){
        if(this.validarRequerido()){
            this._service.error("Error", 'Ingrese el campos obligatorio.');
            return;
        }

        this.rolService.guardarRol(this.rol).subscribe(
            data => {
                this.navegarDashboard(data);
            },
            error => error

        );
    }

    obtenerGridSubModulo():void{
        if(this.viewSubModulo.length>0){
            this.gridViewSubModulo = {
                data: this.viewSubModulo.slice(this.skipRol, this.skipRol + this.pageSizeRol),
                total: this.viewSubModulo.length
            };
        }else{
            //this.isEmpty=true;
            this.gridViewSubModulo = {
                data: [],
                total: 0
            };
        }
    }

    navegarDashboard(data:NotificacionResult){

        if(data.codigo == 1){
            this.mensaje = data.mensaje;
            this._service.success("Correcto", this.mensaje);
            this.rol = new Rol();
            this.goBack();
        }

        else if(data.codigo == 0){
            this.mensaje = data.mensaje;
            this._service.error("Error", this.mensaje);

        }

    }
    private validarRequerido():boolean{
        let validacion = false;
        if(this.rol.estado=== undefined || this.rol.estado == null || this.estados === undefined || this.estados == null){
            $('#estados').addClass('invalid').removeClass('required');
            $('#estados').parent().addClass('state-error').removeClass('state-success');
            $('#estados').css('border','2px solid red');
            validacion = true;
        }
        return validacion;
    }
    goBack(): void {
        this.location.back();
    }

    public changeEstado(value): void {
        let estadoVal: any = value;
        this.rol.estado = estadoVal;
        $('#estados').css('border','none');

    }

    /* CARGAR COMBO*/
    private getEstados() {
        this.estados = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Estado' === grupo.grupo);
    }

    protected pageChangeRol({skip, take, sort}: DataStateChangeEvent): void {
        this.skipRol = skip;
        this.sort = sort;
        this.pageSizeRol = take;

        this.obtenerGridSubModulo();
    }

    onRegresarBusquedaRoles(){
      this.location.back();
    }

}