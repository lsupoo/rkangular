import {Component} from "@angular/core";
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {CompleterData, CompleterService} from "ng2-completer";
import {environment} from "../../../environments/environment";
import {NotificationsService} from "angular2-notifications/src/notifications.service";
import {Router} from "@angular/router";
import {CargoService} from "../../+common/service/cargo.service";
import {NotificacionResult} from "../../+dto/NotificacionResult";
import {ProyectoService} from "../../+common/service/proyecto.service";
import {UnidadDeNegocioCombo} from "../../+dto/unidadDeNegocioCombo";
import {DepartamentoAreaCombo} from "../../+dto/departamentoAreaCombo";
import {Proyecto} from "../../+dto/maintenance/proyecto";
import {ComponentBase} from "../../+common/service/componentBase";
import {Http} from "@angular/http";
import {BackendService} from "../../+rest/backend.service";
import {Message} from "primeng/components/common/api";

declare var $: any;

@Component({
    selector: 'administrar-proyecto',
    templateUrl: 'administrar.proyecto.component.html',
    providers: [ProyectoService, CargoService, NotificationsService]
})
export class AdministrarProyectoComponent extends ComponentBase {

    public defaultItemUnd: UnidadDeNegocioCombo = {idUnidadDeNegocio: null, nombre: 'Seleccionar'};
    public defaultItemEstado: TablaGeneralResult = {codigo: null, nombre: 'Seleccionar', grupo: null};
    public defaultItemDepartamento: any = {idDepartamentoArea: null, idUnidadDeNegocio: null, nombre: 'Seleccionar'};

    public undnegocios: UnidadDeNegocioCombo[];
    public departamentos: DepartamentoAreaCombo[];

    public estados: TablaGeneralResult[];

    private dataServiceJefeProyecto: CompleterData;
    private dataServiceJefeProyectoReempleazo: CompleterData;
    localhost: String = environment.backend;
    port: String = environment.port;

    private proyecto: Proyecto = new Proyecto();
    msgs: Message[] = [];


    constructor(public backendService: BackendService,
                private empleadoService: EmpleadoService,
                private _service: NotificationsService,
                private _router: Router,
                private completerService: CompleterService,
                private proyectoService: ProyectoService,
                private cargoService: CargoService) {

        super(backendService, 'OR003');

        this.dataServiceJefeProyecto = completerService.remote(this.urlAutocompleteEmpleado, 'nombreEmpleado', 'nombreEmpleado');

        this.dataServiceJefeProyectoReempleazo = completerService.remote(this.urlAutocompleteEmpleado, 'nombreEmpleado', 'nombreEmpleado');

        let isNewProyecto: boolean = this.empleadoService.retrieveSessionStorage('isNewProyecto');

        //let cargo: Cargo = this.empleadoService.retrieveDataCargo();
        this.getUndNegocio();
        this.getProyectoEstados();



        if (isNewProyecto) {


        } else {
            let idProyecto: number = this.empleadoService.retrieveSessionStorage('idProyecto');
            this.verProyecto(idProyecto);
        }

    }

    private getUndNegocio() {
        this.undnegocios = this.storageCommomnValueResult.unidadDeNegocio;
    }

    private obtenerDepartamentos(idUndNegocio: number) {
        this.departamentos = this.storageCommomnValueResult.departamentoArea.filter(depa => idUndNegocio === depa.idUnidadDeNegocio);
    }

    private getProyectoEstados() {
        this.estados = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Proyecto.Estado' === grupo.grupo);
    }

    verProyecto(idProyecto: number) {
        this.proyectoService.verProyecto(idProyecto).subscribe(
            data => this.cargarProyecto(data),
            error => this.errorMessage = <any>error
        );
    }

    private cargarProyecto(data: Proyecto) {

        this.actualizarDpto(data.idUnidadDeNegocio);

        this.proyecto = data;
        //this.proyecto.nombreJefeProyecto= "DANTE";

    }

    actualizarDpto(value): void {
        let codigo: any = value;
        this.proyecto.idDepartamentoArea = null;
        if (value == null) {
            this.departamentos = null;
        } else {
            this.obtenerDepartamentos(codigo);
        }

    }


    onChangeFechaInicio(value) {
        this.proyecto.fechaInicio = value;
    }

    onChangeFechaFin(value) {
        this.proyecto.fechaFin = value;
    }


    selectJefeProyecto(e) {
        if (e != null)
            this.proyecto.idJefeProyecto = e.originalObject.idEmpleado;
        else
            this.proyecto.idJefeProyecto = null;
    }

    selectJefeProyectoReemplazo(e) {
        if (e != null)
            this.proyecto.idJefeProyectoReemplazo = e.originalObject.idEmpleado;
        else
            this.proyecto.idJefeProyectoReemplazo = null;
    }

    onRegresarBusquedaProyecto() {
        this.empleadoService.storeSessionStorage('isNewProyecto', true);
        this.empleadoService.storeSessionStorage('idProyecto', undefined);
        this._router.navigate(['/organizacion/busquedaProyecto']);
    }

    onRegistrarProyecto() {

        if (this.validarRequerido()) {
            this.msgs.push({severity: 'error', summary: 'Runakuna Error', detail:'Ingrese los campos obligatorios.'});
            return;
        }

        this.proyectoService.registrarProyecto(this.proyecto).subscribe(
            data => {

                this.backendService.notification(this.msgs, data);

                if (data.codigo == 1) {
                    this.empleadoService.storeSessionStorage('isNewProyecto', true);
                    this.empleadoService.storeSessionStorage('idProyecto', undefined);
                    setTimeout(() => {
                        this.navegarBusquedaProyecto(data);
                    }, 3000);
                }

            },
            error => {

                this.backendService.notification(this.msgs, error);
            }
        );


    }

    navegarBusquedaProyecto(data: NotificacionResult) {
        this._router.navigate(['/organizacion/busquedaProyecto']);

    }

    ingresaNombre(){
        $('#nombre').parent().removeClass('state-error');
    }

    ingresaCodigo(){
        $('#codigo').parent().removeClass('state-error');
    }

    ingresaCliente(){
        $('#cliente').parent().removeClass('state-error');
    }

    private validarRequerido(): boolean {
        let validacion = false;
        if (this.proyecto.idUnidadDeNegocio === undefined || this.proyecto.idUnidadDeNegocio == null) {
            $('#unidadNegocio').parent().addClass('state-error').removeClass('state-success');
            $('#unidadNegocio').css('border', '2px solid red');
            validacion = true;
        }

        if (this.proyecto.idDepartamentoArea === undefined || this.proyecto.idDepartamentoArea == null) {
            $('#departamentoArea').parent().addClass('state-error').removeClass('state-success');
            $('#departamentoArea').css('border', '2px solid red');
            validacion = true;
        }

        if (this.proyecto.estado === undefined || this.proyecto.estado == null || this.proyecto.estado == '') {
            $('#estado').parent().addClass('state-error').removeClass('state-success');
            $('#estado').css('border', '2px solid red');
            validacion = true;
        }

        if (this.proyecto.nombre === undefined || this.proyecto.nombre == null || this.proyecto.nombre == '') {
            $('#nombre').addClass('invalid').removeClass('required');
            $('#nombre').parent().addClass('state-error').removeClass('state-success');

            validacion = true;
        }
        if (this.proyecto.codigo === undefined || this.proyecto.codigo == null || this.proyecto.codigo == "") {
            $('#codigo').addClass('invalid').removeClass('required');
            $('#codigo').parent().addClass('state-error').removeClass('state-success');

            validacion = true;
        }

        if (this.proyecto.cliente === undefined || this.proyecto.cliente == null || this.proyecto.cliente == "") {
            $('#cliente').addClass('invalid').removeClass('required');
            $('#cliente').parent().addClass('state-error').removeClass('state-success');

            validacion = true;
        }

        if (this.proyecto.fechaInicio === undefined || this.proyecto.fechaInicio == null || this.proyecto.fechaInicio == "") {
            $('#fechaInicio').addClass('invalid').removeClass('required');
            $('#fechaInicio').parent().addClass('state-error').removeClass('state-success');

            validacion = true;
        }

        if (this.proyecto.idJefeProyecto === undefined || this.proyecto.idJefeProyecto == null) {
            $('#jefe').addClass('invalid').removeClass('required');
            $('#jefe').parent().addClass('state-error').removeClass('state-success');

            validacion = true;
        }
        return validacion;
    }

    validateFilterEmptyJefe(e){
        if ((e.which && e.which == 8) || (e.which && e.which == 46) || (e.keyCode && e.keyCode == 8) || (e.keyCode && e.keyCode == 46)) {
            if(e.srcElement.value == ''){
                this.proyecto.idJefeProyecto = null;
                this.proyecto.nombreJefeProyecto = undefined;
            }
        }
        return true;
    }

    validateFilterEmptyJefeReemplazo(e){
        if ((e.which && e.which == 8) || (e.which && e.which == 46) || (e.keyCode && e.keyCode == 8) || (e.keyCode && e.keyCode == 46)) {
            if(e.srcElement.value == ''){
                this.proyecto.idJefeProyectoReemplazo = null;
                this.proyecto.nombreJefeProyectoReemplazo = undefined;
            }
        }
        return true;
    }

}