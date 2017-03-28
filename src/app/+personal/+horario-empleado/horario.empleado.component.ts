import {Component} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {PermisoEmpleado} from "../../+dto/maintenance/permisoEmpleado";
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {Empleado} from "../../+dto/maintenance/empleado";
import {GridDataResult, PageChangeEvent} from "@progress/kendo-angular-grid";
import {HorarioDia} from "../../+dto/maintenance/horarioDia";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {HorarioEmpleado} from "../../+dto/maintenance/horarioEmpleado";
import {HorarioEmpleadoResult} from "../../+dto/horarioEmpleadoResult";
import {HorarioEmpleadoService} from "../../+common/service/horario.empleado.service";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {NotificationsService} from "angular2-notifications/src/notifications.service";
import {ComponentBase} from "../../+common/service/componentBase";
import {BackendService} from "../../+rest/backend.service";
import {ConfirmDialogComponent} from "../../shared/confirm/confirmDialogBase";
import {ViewChild} from "@angular/core/src/metadata/di";

declare var $: any;

@Component({
  selector: 'sa-horario-empleado',
  templateUrl: 'horario.empleado.component.html',
  providers: [HorarioEmpleadoService,NotificationsService]
})
export class HorarioEmpleadoComponent extends ComponentBase{

    public defaultItem:TablaGeneralResult={codigo:null,nombre:'Seleccionar', grupo:null};
    private skip: number = 0;

    public mensaje:string;

    public empleado:Empleado = new Empleado();

    private idEmpleadoTemp:number = 0;

    private horariosEmpleado:HorarioEmpleadoResult[]=[];

    private fotoEmpleado:string = '';
    private nombreCompletoEmpleado:string = '';

    private dateNow:Date = new Date();

     constructor(private route:ActivatedRoute, private _router: Router,public backendService: BackendService, private empleadoService:EmpleadoService, private horarioEmpleadoService:HorarioEmpleadoService) {

         super(backendService, '');

        let idEmpleado:number = this.empleadoService.retrieveSessionStorage('idEmpleado');

        this.idEmpleadoTemp = idEmpleado;
        //this.empleado = this.empleadoService.retrieveSessionStorage('entityEmpleadoHorario');

         this.obtenerEmpleado(idEmpleado);

         this.verHorarioEmpleado(idEmpleado);

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
        this.empleadoService.storeSessionStorage('isNewHorarioEmpleado',true);
        this.empleadoService.storeSessionStorage('idHorarioEmpleado',undefined);
        this.empleadoService.storeSessionStorage('entityEmpleadoHorario',null);

        this._router.navigate(['/personal/verEmpleado']);
    }

    onNuevoHorarioEmpleado(){
        this.empleadoService.storeSessionStorage('isNewHorarioEmpleado',true);
        this.empleadoService.storeSessionStorage('idHorarioEmpleado',undefined);
        this._router.navigate(['/personal/administrarHorarioEmpleado']);
    }


    onEditarHorarioEmpleado(dataItem:HorarioEmpleado){
        this.empleadoService.storeSessionStorage('isNewHorarioEmpleado',false);
        this.empleadoService.storeSessionStorage('idHorarioEmpleado',dataItem.idHorarioEmpleado);
        this._router.navigate(['/personal/administrarHorarioEmpleado']);
    }



    verHorarioEmpleado(idEmpleado: number){
        this.horarioEmpleadoService.obtenerBusquedaHorariosEmpleado(idEmpleado).subscribe(
            data => this.horariosEmpleado = data,
            error => this.errorMessage = <any>error
        );
    }

    protected pageChangeMarcaciones(event: PageChangeEvent): void {
        this.skip = event.skip;
        //this.obtenerHorarios();

    }

    public onEliminarHorarioEmpleado(data:HorarioEmpleadoResult): void {

        this.horarioEmpleadoService.eliminarHorarioEmpleado(data.idHorarioEmpleado).subscribe(

            data => {

                this.backendService.notification(this.msgs, data);

                if (data.codigo == 1) {
                    this.verHorarioEmpleado(this.idEmpleadoTemp);
                }

            },
            error => {

                this.backendService.notification(this.msgs, error);
            }
        );

    }

    stringToDate(dateCadena:string):Date{

        let fecha:string[] = dateCadena.split('/');

        let fechaFormat:Date= new Date( parseInt(fecha[2]),parseInt(fecha[1])-1,parseInt(fecha[0]));

        return fechaFormat;
    }

    @ViewChild(ConfirmDialogComponent) private confirmDialogComponent: ConfirmDialogComponent;

    public confirm(dataItem:HorarioEmpleado): void {
        this.confirmDialogComponent.titulo="Eliminar Horario Empleado"
        this.confirmDialogComponent.dataItem=dataItem;
        this.confirmDialogComponent.onShow();

    }

}
