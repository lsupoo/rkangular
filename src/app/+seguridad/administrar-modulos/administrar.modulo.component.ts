import {Component} from '@angular/core';
import {Observable} from "rxjs";
import {AccionDialogFormComponent} from "./accion.dialog.component";
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {PermisoService} from "../../+common/service/permiso.service";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {Licencia} from "../../+dto/maintenance/licencia";
import {CompleterData, CompleterService} from "ng2-completer";
import {environment} from "../../../environments/environment";
import {NotificationsService} from "angular2-notifications/src/notifications.service";
import {Router} from "@angular/router";
import {BandaSalarial} from "../../+dto/maintenance/bandaSalarial";
import {DepartamentoArea} from "../../+dto/maintenance/departamentoArea";
import {CargoService} from "../../+common/service/cargo.service";
import {Cargo} from "../../+dto/maintenance/cargo";
import {NotificacionResult} from "../../+dto/NotificacionResult";
import {UnidadDeNegocio} from "../../+dto/maintenance/unidadDeNegocio";
import {ProyectoCombo} from "../../+dto/proyectoCombo";
import {StorageResult} from "../../+dto/storageResult";

import {ViewChild} from "@angular/core/src/metadata/di";
import {Http} from "@angular/http";
import {ServiceBase} from "../../+common/service/serviceBase";
import {ModuloService} from "../../shared/layout/navigation/http-modulo-service";
import {ModuloAccion} from "../../+dto/maintenance/moduloAccion";
import {Accion} from "../../+dto/maintenance/accion";
import {ComponentBase} from "../../+common/service/componentBase";
import {GridDataResult, PageChangeEvent} from "@progress/kendo-angular-grid";
import {BackendService} from "../../+rest/backend.service";


declare var $: any;

@Component({
    selector: 'administrar-modulo',
    templateUrl: 'administrar.modulo.component.html',
    providers: [ModuloService,NotificationsService]
})
export class AdministrarModuloComponent extends ComponentBase {

    localhost:  String = environment.backend;
    port: String = environment.port;

    private pageSize: number = 10;
    private skip: number = 0;

    public moduloAccion:ModuloAccion=new ModuloAccion();

    private acciones:Array<Accion>=[];

    private dataServiceEmpleado:CompleterData;

    private gridViewAcciones: GridDataResult;

    constructor(private empleadoService: EmpleadoService,
                private _service: NotificationsService,
                private _router: Router,
                public backendService: BackendService,
                private permisoService:PermisoService,
                private completerService: CompleterService,
                private moduloService: ModuloService
    ) {

        super(backendService,'SE003');

        this.dataServiceEmpleado = completerService.remote(this.urlAutocompleteEmpleado,'nombreEmpleado','nombreEmpleado');

        let isNewModulo:boolean = this.empleadoService.retrieveSessionStorage('isNewModulo');

        if(!isNewModulo){
            let idModulo:number = this.empleadoService.retrieveSessionStorage('idModulo');
            this.verCargo(idModulo);
        }

    }

    verCargo(idModulo: number){

        this.moduloService.buscarModuloDetalle(idModulo).subscribe(
            data => this.cargarModulo(data),
            error => this.errorMessage = <any>error
        );
    }

    private cargarModulo(data:ModuloAccion){

        this.moduloAccion = data;
        this.acciones = this.moduloAccion.acciones;
        this.cargarGridAcciones();
    }

    private cargarGridAcciones () {
        this.gridViewAcciones = {
            data: this.acciones.slice(this.skip, this.skip + this.pageSize),
            total: this.acciones.length
        };
    }


    validarRequerido():boolean{
        let validacion = false;
        if(this.moduloAccion.nombre=== undefined || this.moduloAccion.nombre == null || this.moduloAccion.nombre == ''){
            $('#nombre').addClass('invalid').removeClass('required');
            $('#nombre').parent().addClass('state-error').removeClass('state-success');
            $('#nombre').css('border','2px solid red');
            validacion = true;
        }

        if(this.moduloAccion.etiquetaMenu=== undefined || this.moduloAccion.etiquetaMenu == null || this.moduloAccion.etiquetaMenu == ''){
            $('#etiqueta').addClass('invalid').removeClass('required');
            $('#etiqueta').parent().addClass('state-error').removeClass('state-success');
            $('#etiqueta').css('border','2px solid red');
            validacion = true;
        }

        if(this.moduloAccion.orden=== undefined || this.moduloAccion.orden == null ){
            $('#orden').addClass('invalid').removeClass('required');
            $('#orden').parent().addClass('state-error').removeClass('state-success');
            $('#orden').css('border','2px solid red');
            validacion = true;
        }
        return validacion;
    }

    onRegresarBusquedaModulo(){
        this.empleadoService.storeSessionStorage('isNewModulo',true);
        this.empleadoService.storeSessionStorage('idModulo',undefined);
        this._router.navigate(['/seguridad/busquedaModulos']);
    }

    onRegistrarModulo(){

        if(this.validarRequerido()){
            this._service.error("Error", 'Ingrese el/los campos obligatorio.');
            return;
        }

        this.moduloAccion.acciones= this.acciones;
        this.moduloService.registrarModulo(this.moduloAccion).subscribe(
            data => {
                this.navegarBusquedaModulo(data);
            },
            error => error
        );


    }

    navegarBusquedaModulo(data:NotificacionResult){

        if(data.codigo == 1){
            this.moduloAccion = new ModuloAccion();
            this._service.success("Success", data.mensaje);
            this.empleadoService.storeSessionStorage('isNewModulo',true);
            this.empleadoService.storeSessionStorage('idModulo',undefined);
            this._router.navigate(['/seguridad/busquedaModulos']);
        }
        else if(data.codigo == 0){
            this.mensaje = data.mensaje;
            this._service.error("Error", data.mensaje);
        }

    }

    //banda salarial
    public dataItemAccion: Accion;

    @ViewChild(AccionDialogFormComponent) protected accionDialogComponent: AccionDialogFormComponent;

    public onEditarAccion(dataItem: Accion): void {
        this.accionDialogComponent.titulo = "Editar";
        this.dataItemAccion = dataItem;

        this.accionDialogComponent.idModulo = this.dataItemAccion.idModulo;
        this.accionDialogComponent.idAccion = this.dataItemAccion.idAccion;
        this.accionDialogComponent.etiqueta= this.dataItemAccion.etiqueta;

    }

    public onGuardarAccion(dto: Accion): void {
        this.editarBandaSalarial(dto);
    }


    public onCancelarAccion(): void {
        this.dataItemAccion = undefined;
    }

    public obtenerAccion(): Observable<Accion[]> {
        return this.fetchBandaSalarial();
    }

    public editarBandaSalarial(data: Accion): Observable<Accion[]> {
        return this.fetchBandaSalarial("update", data);
    }

    private fetchBandaSalarial(action: string = "", data?: Accion): Observable<Accion[]>  {


        if(action=="update"){
            let indice = this.acciones.indexOf(data);
            if(indice>=0)
                this.acciones[indice]  = (JSON.parse(JSON.stringify(data)));
        }

        return Observable.of(this.acciones);
    }

    protected pageChangeAcciones(event: PageChangeEvent): void {
        this.skip = event.skip;
        this.cargarGridAcciones();

    }

}