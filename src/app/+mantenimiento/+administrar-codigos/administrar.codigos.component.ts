    /**
 * Created by javier.cuicapuza on 1/3/2017.
 */
import {Component, OnInit, EventEmitter,Output} from '@angular/core';
import { Location } from '@angular/common';
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {NotificationsService} from "angular2-notifications/src/notifications.service";
import {StoreSessionFilter} from "../../+dto/storeSessionFilter";
import {ComponentBase} from "../../+common/service/componentBase";
import {Http} from "@angular/http";
import {TablaGeneral} from "../../+dto/maintenance/tablaGeneral";
import {TablaGeneralService} from "../../+common/service/tablaGeneral.service";
    import {BackendService} from "../../+rest/backend.service";
    import {Router} from "@angular/router";

declare var $: any;

@Component({
    selector: 'administrar-codigos',
    templateUrl: 'administrar.codigos.component.html',
    providers: [NotificationsService]
})
export class AdministrarCodigosComponent extends ComponentBase implements OnInit {

    @Output() save: EventEmitter<any> = new EventEmitter();
    //notificacion
    public options = {
        timeOut: 2500,
        lastOnBottom: true,
        clickToClose: true,
        maxLength: 0,
        maxStack: 7,
        showProgressBar: false,
        pauseOnHover: true,
        preventDuplicates: false,
        preventLastDuplicates: 'visible',
        rtl: false,
        animate: 'scale',
        position: ['right', 'top']
    };
    //Combos
    public grupoTablaGeneral:TablaGeneralResult[];
    public tablaGeneral: TablaGeneral = new TablaGeneral();

    public estados:TablaGeneralResult[];
    public estadosSelect: TablaGeneralResult;

    public defaultItemEstados: TablaGeneralResult = {codigo: null, nombre: 'Todos'};

    storeSessionFilter: StoreSessionFilter = new StoreSessionFilter();

    constructor(private _service: NotificationsService,
                private empleadoService: EmpleadoService,
                private tablaGeneralService: TablaGeneralService,
                public backendService: BackendService,
                private _router: Router,
                private location: Location) {
        super(backendService,'MA001');
        this.getGrupoTablaGeneral();
        this.getEstados();

        this.storeSessionFilter = this.empleadoService.retrieveSessionStorage('editTablaGeneralResult');
        if(this.storeSessionFilter.isNew == false){
            this.obtenerTablaGeneralById(this.storeSessionFilter.idTableFilter);

        }
    }

    private obtenerTablaGeneralById(idTablaGeneral: any): void{
        this.tablaGeneralService.obtenerTablaGeneralById(idTablaGeneral).subscribe(
            data => this.showDetail(data),
            error => this.errorMessage = <any>error
        );
    }

    ngOnInit() {

    }

    onRegresarBusquedaCodigos(){
        this.location.back();
    }
    onGuardarCodigoTablaGeneral(){

        if(this.validarRequerido()){
            this._service.error("Error", 'Ingrese el campos obligatorio.');
            return;
        }

        this.tablaGeneralService.guardarCodigoTablaGeneral(this.tablaGeneral).subscribe(
            data => {
                this.backendService.notification(this.msgs, data);
                if (data.codigo == 1) {
                    setTimeout(() => {
                        this.navegarDashboard(data);
                    }, 3000);
                }

            },
            error => {

                this.backendService.notification(this.msgs, error);
            }

        );
    }
    showDetail(data: TablaGeneral){
        this.tablaGeneral = data;

    }
    navegarDashboard(data:NotificacionResult){

        if(data.codigo == 1){
            this.mensaje = data.mensaje;
            this._service.success("Correcto", this.mensaje);
            this.tablaGeneral = new TablaGeneral();
            //this.goBack();
            this._router.navigate(['/mantenimientos/busquedaCodigos']);
        }

        else if(data.codigo == 0){
            this.mensaje = data.mensaje;
            this._service.error("Error", this.mensaje);

        }

    }
    private validarRequerido():boolean{
        let validacion = false;
        if(this.tablaGeneral.estado=== undefined || this.tablaGeneral.estado == null || this.estados === undefined || this.estados == null){
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
        this.tablaGeneral.estado = value;
        $('#estados').css('border','none');

    }

    /* CARGAR COMBO*/

    private getEstados() {
        this.estados = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Estado' === grupo.grupo);
    }

    private getGrupoTablaGeneral() {
        this.tablaGeneralService.buscarGrupoTablaGeneral().subscribe(
            data => {

                this.grupoTablaGeneral = data;

            },
            error => this.errorMessage = <any>error
        );
    }
}