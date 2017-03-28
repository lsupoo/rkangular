import {Component, OnInit} from "@angular/core";

import {Router} from "@angular/router";

import {environment} from "../../../environments/environment";
import {Permiso} from "../../+dto/maintenance/permiso";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {Subscription} from "rxjs";
import {CargoFilter} from "../../+dto/cargoFilter";
import {ComponentBase} from "../../+common/service/componentBase";
import {Http} from "@angular/http";
import {CompensacionFilter} from "../../+dto/compensacionFilter";
import {CompensacionResult} from "../../+dto/compensacionResult";
import {CompensacionService} from "../../+common/service/compensacion.service";
import {NotificationsService} from "angular2-notifications/src/notifications.service";
import {Compensacion} from "../../+dto/maintenance/compensacion";
import {CompensacionDetalle} from "../../+dto/maintenance/compensacionDetalle";
import {GridDataResult, PageChangeEvent} from "@progress/kendo-angular-grid";
import {PermisoEmpleado} from "../../+dto/maintenance/permisoEmpleado";
import {HorasExtra} from "../../+dto/maintenance/horasExtra";
import {BackendService} from "../../+rest/backend.service";

declare var $: any;

@Component({
    selector: 'administrar-compensacion',
    templateUrl: 'administrar.compensacion.component.html',
    providers : [CompensacionService,NotificationsService]
})
export class AdministrarCompensacionComponent extends ComponentBase {

    busy: Subscription;

    public compensacion:Compensacion = new Compensacion();
    public permisos:PermisoEmpleado[] = [];
    public horasExtras:HorasExtra[] = [];

    public isEmpty:boolean = true;
    public isSearch: boolean = false;

    public noItems: boolean = false;

    localhost:  String = environment.backend;
    port: String = environment.port;

    constructor(private empleadoService: EmpleadoService,
                private _router: Router,
                public backendService: BackendService,
                private compensacionService : CompensacionService){

        super(backendService,'OR005');

        let isNewEmpresa:boolean = this.empleadoService.retrieveSessionStorage('isNewCompensacion');
        if(isNewEmpresa){

        }else{
            let idEmpleadoCompensacion:number = this.empleadoService.retrieveSessionStorage('idEmpleadoCompensacion');
            this.obtenerCompensacionDetalle(idEmpleadoCompensacion);
        }
    }

    private obtenerCompensacion(idEmpleadoCompensacion:number){
        this.compensacionService.obtenerCompensacion(idEmpleadoCompensacion).subscribe(
            data => this.cargarCompensacion(data),
            error => this.errorMessage = <any>error
        );
    }

    private obtenerCompensacionDetalle(idEmpleadoCompensacion:number){
        this.compensacionService.obtenerCompensacionDetalle(idEmpleadoCompensacion).subscribe(
            data => this.cargarCompensacionDetalle(data),
            error => this.errorMessage = <any>error
        );
    }

    private onRegresarBusquedaCompensacion(){
        this.empleadoService.storeSessionStorage('isNewCompensacion',true);
        this.empleadoService.storeSessionStorage('idEmpleadoCompensacion',undefined);
        this._router.navigate(['/gestionTiempo/busquedaCompensacion']);
    }


    private cargarCompensacion(data:Compensacion){
        this.compensacion = data;
    }

    private cargarCompensacionDetalle(data:CompensacionDetalle){

        this.compensacion = data.compensacion;
        this.permisos = data.permisosEmpleado;
        this.horasExtras = data.horasExtras;
        this.skip = 0;
        this.skipHorasExtras = 0;
        this.cargarPermisos();
        this.cargarHorasExtras();
    }

    private gridView: GridDataResult;
    private pageSize: number = 5;
    private skip: number = 0;


    private cargarPermisos(): void {

        if(this.permisos.length>0){
            this.gridView = {
                data: this.permisos.slice(this.skip, this.skip + this.pageSize),
                total: this.permisos.length
            };
        }else{

            this.gridView = {
                data: [],
                total: 0
            };
        }


    }

    protected pageChangePermisos(event: PageChangeEvent): void {
        this.skip = event.skip;
        this.cargarPermisos();

    }

    private gridViewHorasExtras: GridDataResult;
    private pageSizeHorasExtras: number = 5;
    private skipHorasExtras: number = 0;


    private cargarHorasExtras(): void {

        if(this.horasExtras.length>0){
            this.gridViewHorasExtras = {
                data: this.horasExtras.slice(this.skipHorasExtras, this.skipHorasExtras + this.pageSizeHorasExtras),
                total: this.horasExtras.length
            };
        }else{

            this.gridViewHorasExtras = {
                data: [],
                total: 0
            };
        }


    }

    protected pageChangeHorasExtras(event: PageChangeEvent): void {
        this.skipHorasExtras = event.skip;
        this.cargarHorasExtras();

    }




}