import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {PermisoEmpleado} from "../../+dto/maintenance/permisoEmpleado";
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {Empleado} from "../../+dto/maintenance/empleado";
import {GridDataResult, PageChangeEvent} from "@progress/kendo-angular-grid";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {ContratoService} from "../../+common/service/contrato.service";
import {ContratoResult} from "../../+dto/contratoResult";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {NotificationsService} from "angular2-notifications/src/notifications.service";
import {ConfirmDialogComponent} from "../../shared/confirm/confirmDialogBase";
import {ViewChild} from "@angular/core/src/metadata/di";
import {Contrato} from "../../+dto/maintenance/contrato";
import {BackendService} from "../../+rest/backend.service";
import {ComponentBase} from "../../+common/service/componentBase";

declare var $: any;

@Component({
  selector: 'sa-contrato-empleado',
  templateUrl: 'contrato.empleado.component.html',
  providers: [ContratoService]
})
export class ContratoEmpleadoComponent extends ComponentBase{

    public defaultItem:TablaGeneralResult={codigo:null,nombre:'Seleccionar', grupo:null};


    private skip: number = 0;

    private idEmpleadoTemp:number = 0;

    public mensaje:string;

    private empleado:Empleado = new Empleado();

    private contratos:ContratoResult[]=[];

    private fotoEmpleado:string = '';
    private nombreCompletoEmpleado:string = '';

    constructor(private route:ActivatedRoute,
                private _router: Router,
                public backendService: BackendService,
                private empleadoService:EmpleadoService,
                private contratoService:ContratoService) {
        super(backendService, '');

        let idEmpleado:number = this.empleadoService.retrieveSessionStorage('idEmpleado');

        this.idEmpleadoTemp = idEmpleado;

        this.obtenerEmpleado(idEmpleado);
        this.verContratosEmpleado(idEmpleado);


    }

    obtenerEmpleado(idEmpleado: number){
        this.empleadoService.obtenerEmpleadoCabecera(idEmpleado).subscribe(
            data => this.cargarEmpleado(data),
            error => this.errorMessage = <any>error
        );
    }

    cargarEmpleado(data:Empleado){

        this.nombreCompletoEmpleado = data.nombreCompletoEmpleado;

        if(data.fotoPerfil != null) {
            this.fotoEmpleado = "data:image/jpeg;base64," +  data.fotoPerfil.contenidoArchivo;
            $('#fotoEmpleado').prop("style","display: block; border-radius: 4px 4px; height: 100px");
            $('#iconPerson').prop("class","");
        }
    }

    onRegresarVerEmpleado(){
        this.empleadoService.storeSessionStorage('isNewContrato',true);
        this.empleadoService.storeSessionStorage('idContrato',undefined);
        this.empleadoService.storeSessionStorage('entityEmpleadoContrato',null);
        this._router.navigate(['/personal/verEmpleado']);
    }

    onNuevoContratoEmpleado(){

        this.empleadoService.storeSessionStorage('isNewContrato',true);
        this.empleadoService.storeSessionStorage('idContrato',undefined);

        this._router.navigate(['/personal/administrarContratoEmpleado']);
    }


    onEditarContratoEmpleado(data:ContratoResult){
        this.empleadoService.storeSessionStorage('isNewContrato',false);
        this.empleadoService.storeSessionStorage('idContrato',data.idContrato);
        this._router.navigate(['/personal/administrarContratoEmpleado']);
    }

    verContratosEmpleado(idEmpleado: number){
        this.contratoService.busquedaContratosEmpleado(idEmpleado).subscribe(
            data => this.contratos = data,
            error => this.errorMessage = <any>error
        );
    }

    public onEliminarContrato(data:ContratoResult): void {

        this.contratoService.eliminarContrato(data.idContrato).subscribe(
            data => {

                this.backendService.notification(this.msgs, data);

                if (data.codigo == 1) {
                    this.verContratosEmpleado(this.idEmpleadoTemp);
                }

            },
            error => {
                this.backendService.notification(this.msgs, error);
            }
        );

    }


    protected pageChangeMarcaciones(event: PageChangeEvent): void {
        this.skip = event.skip;
        //this.obtenerHorarios();

    }

    @ViewChild(ConfirmDialogComponent) private confirmDialogComponent: ConfirmDialogComponent;

    public confirm(dataItem:Contrato): void {
        this.confirmDialogComponent.titulo="Eliminar Contrato Empleado"
        this.confirmDialogComponent.dataItem=dataItem;
        this.confirmDialogComponent.onShow();

    }

}
