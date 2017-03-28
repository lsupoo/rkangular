/**
 * Created by javier.cuicapuza on 1/3/2017.
 */
import {Component, OnInit, EventEmitter,Output} from '@angular/core';
import { Location } from '@angular/common';
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {CompleterData} from "ng2-completer";
import {environment} from "../../../environments/environment";
import {NotificationsService} from "angular2-notifications/src/notifications.service";
import {AlertaSubscriptor} from "../../+dto/maintenance/alertaSubscriptor";
import {StoreSessionFilter} from "../../+dto/storeSessionFilter";
import {StorageResult} from "../../+dto/storageResult";
import {TipoLicencia} from "../../+dto/maintenance/tipoLicencia";
import {TipoLicenciaService} from "../../+common/service/tipolicencia.service";
import {ComponentBase} from "../../+common/service/componentBase";
import {Http} from "@angular/http";
import {ConfiguracionSistema} from "../../+dto/maintenance/configuracionSistema";
import {ConfiguracionSistemaService} from "../../+common/service/configuracionsistema.service";
import {BackendService} from "../../+rest/backend.service";
import {Router} from "@angular/router";

declare var $: any;

@Component({
    selector: 'administrar-configuracionsistema',
    templateUrl: 'administrar.configuracionsistema.component.html',
    providers: [NotificationsService]
})
export class AdministrarConfiguracionSistemaComponent extends ComponentBase implements OnInit {

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

    errorMessage: string;
    public mensaje:string;
    storeSessionFilter: StoreSessionFilter = new StoreSessionFilter();

    localhost:  String = environment.backend;
    port: String = environment.port;
    configuracionSistema: ConfiguracionSistema = new ConfiguracionSistema();

    constructor(private _service: NotificationsService,
                private empleadoService: EmpleadoService,
                public backendService: BackendService,
                private _router: Router,
                private location: Location,
                private configuracionSistemaService: ConfiguracionSistemaService ) {

        super(backendService,'MA002');
        this.storeSessionFilter = this.empleadoService.retrieveSessionStorage('editConfiguracionSistemaResult');
        if(this.storeSessionFilter.isNew == false){
            this.obtenerConfiguracionSistemaDetalle(this.storeSessionFilter.idTableFilter);
            //this.view = this.alerta.subscriptores;
        }
    }

    private obtenerConfiguracionSistemaDetalle(idConfiguracionSistema: any): void{
        this.configuracionSistemaService.obtenerConfiguracionSistemaDetalle(idConfiguracionSistema).subscribe(
            data => this.showDetail(data),
            error => this.errorMessage = <any>error
        );
    }

    ngOnInit() {

    }

    onRegresarBusquedaConfiguracionesSistema(){
        this.location.back();
    }
    onGuardarConfiguracionSistema(){
        if(this.validarRequerido()){
            this._service.error("Error", 'Ingrese el campos obligatorio.');
            return;
        }

        //this.alerta.subscriptores = this.view;
        this.configuracionSistemaService.registrarConfiguracionSistema(this.configuracionSistema).subscribe(
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
    showDetail(data:ConfiguracionSistema){
        this.configuracionSistema= data;
        //this.view = data.subscriptores;
    }
    navegarDashboard(data:NotificacionResult){

        if(data.codigo == 1){
            this.mensaje = data.mensaje;
            this._service.success("Correcto", this.mensaje);
            this.configuracionSistema = new ConfiguracionSistema();
            //this.goBack();
            this._router.navigate(['/mantenimientos/busquedaConfiguracionSistema']);
        }

        else if(data.codigo == 0){
            this.mensaje = data.mensaje;
            this._service.error("Error", this.mensaje);

        }

    }
    private validarRequerido():boolean{
        let validacion = false;
        if(this.configuracionSistema.descripcion=== undefined || this.configuracionSistema.descripcion == null || this.configuracionSistema.descripcion === '' ){
            $('#descripcion').addClass('invalid').removeClass('required');
            $('#descripcion').parent().addClass('state-error').removeClass('state-success');
            $('#descripcion').css('border','2px solid red');
            validacion = true;
        }

        if(this.configuracionSistema.valor=== undefined || this.configuracionSistema.valor == null || this.configuracionSistema.valor === '' ){
            $('#valor').addClass('invalid').removeClass('required');
            $('#valor').parent().addClass('state-error').removeClass('state-success');
            $('#valor').css('border','2px solid red');
            validacion = true;
        }
        return validacion;
    }

    goBack(): void {
        this.location.back();
    }

}