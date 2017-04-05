import { Component, Input,  Output, EventEmitter, ViewChild} from '@angular/core';
import {ModalDirective} from "ng2-bootstrap";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {PermisoService} from "../../+common/service/permiso.service";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {PeriodoEmpleado} from "../../+dto/maintenance/periodoEmpleado";
import {Vacacion} from "../../+dto/maintenance/vacacion";
import {HorasExtra} from "../../+dto/maintenance/horasExtra";

declare var $: any;

@Component({
  selector: 'horas-extras-dialog-form',
  template: `

    <kendo-dialog *ngIf="active" (close)="onClose()" >
            <kendo-dialog-titlebar>
                {{tituloCabecera}}
            </kendo-dialog-titlebar>
        <div class="modal-body">
            <div class="smart-form" style="width: 900px;">
                
              <div class="row">
                <section class="col col-md-4">
                  <label>Jefe Inmediato</label>
                  <label class="input state-disabled"> 
                        <input type="text" [(ngModel)]="jefeInmediato" disabled="disabled" />
                  </label>
                 </section>
            
                <section class="col col-md-4">
                  <label>Fecha</label>
                  <label class="input state-disabled"> 
                       <i class="icon-append fa fa-calendar"></i>
						<input type="text" saUiDatepicker date-format="dd/MM/yy" 
						    placeholder="Seleccionar una Fecha" 
						    [(ngModel)]="fecha" (change)="onChangeFecha($event)" readonly="readonly" disabled="disabled"/>
                  </label>
                 </section>
              </div>
              
              <div class="row">
                <section class="col col-md-4">
                  <label>Horas Adicionales</label>
                  <label class="input state-disabled"> 
                        <input type="text" [(ngModel)]="horasAdicionales" disabled="disabled" (blur)="calcularHoraSalidaSolicitado()"/>
                  </label>
                 </section>
                
                <section class="col col-md-8">
                  <label>Motivo</label>
                  <label class="input state-disabled"> 
                        <input type="text" [(ngModel)]="motivo" disabled="disabled"/>
                  </label>
                 </section>
              </div>
                 
              <div class="row">                                                 
                <section class="col col-md-4">
                  <label>Estado</label>
                  <label class="input state-disabled"> 
						<input type="text" [(ngModel)]="nombreEstado" disabled="disabled">
                  </label>
                 </section>
                 
              </div>
              
              <div class="row">
                <section class="col col-md-4">
                  <label>Hora de Salida</label>
                  <label class="input state-disabled"> 
                        <input type="text" [(ngModel)]="horaSalidaHorario" disabled="disabled"/>
                  </label>
                 </section>
                
                <section class="col col-md-4">
                  <label>Hora de Salida Solicitado</label>
                  <label class="input state-disabled"> 
                        <input type="text" [(ngModel)]="horaSalidaSolicitado" disabled="disabled"/>
                  </label>
                 </section>
              </div>
                 
              <div class="row">
                 <section class="col col-md-4">
                  <label>Horas Semanales Pendientes</label>
                  <label class="input state-disabled"> 
                        <input type="text" [(ngModel)]="horasNoCompensables" disabled="disabled"/>
                  </label>
                 </section>
                
                <section class="col col-md-4">
                  <label>Total de Horas Extras</label>
                  <label class="input state-disabled"> 
                        <input type="text" [(ngModel)]="horas" disabled="disabled"/>
                  </label>
                 </section>
                 
              </div>
              
              <div class="row">
                <section class="col col-md-8">
                  <label>Comentario Resolucion</label>
                  <label class="input state-disabled"> 
                        <input type="text" [(ngModel)]="comentarioResolucion" disabled="disabled"/>
                  </label>
                 </section>
                
              
              </div>
             
            </div>  
           </div>     
          <div class="modal-footer">
            <!--a (click)="onActualizarHorasExtras($event)" class="btn btn-primary" *ngIf="!isEnviado"><i class="fa  fa-sign-out"></i> Guardar</a>
			<a (click)="onEnviarHorasExtras($event)" class="btn btn-primary" *ngIf="!isEnviado"><i class="fa fa-pencil"></i> Enviar</a-->
			<a (click)="onCancel($event)" class="btn btn-default"> Cancelar</a>
          </div>
    </kendo-dialog>
    `
})
export class HorasExtrasDialogFormComponent {

  public fecha: string;
  public horaSalidaHorario: string;
  public horaSalidaSolicitado: string;
  public horas:number;
  public horasNoCompensables:number;
  public motivo: string;
  public estado: string;
  public nombreEstado: string;
  public jefeInmediato: string;
  public horasCompensadas: string;
  public horasSemanalesPendientes: number;
  public horasAdicionales: number;

  public comentarioResolucion:string;

  public mensaje:string;

  public isEnviado:boolean=true;
  public enviadoClass:string='input';

  dataItemHoraExtra:HorasExtra;
  editForm;

  @Input() public set model(dto: HorasExtra) {
    this.dataItemHoraExtra = dto;
    //dto === undefined ?  this.lgModal.hide():  this.lgModal.show();
    dto === undefined ? this.active=false: this.active=true;
  }

  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Output() save: EventEmitter<any> = new EventEmitter();


  errorMessage: string;

  constructor(private empleadoService:EmpleadoService, private permisoService:PermisoService) {

  }

  public active: boolean = false;

  public tituloCabecera:string="";


  public onCancel(e): void {
    e.preventDefault();
    this.closeForm();
  }

  public onClose(): void {
    this.closeForm();
  }

  public closeForm(){
    this.active = false;
    this.cancel.emit();
  }

  onActualizarHorasExtras(e){

    this.dataItemHoraExtra.fecha = this.fecha;
    this.dataItemHoraExtra.horaSalidaHorario = this.horaSalidaHorario;
    this.dataItemHoraExtra.horaSalidaSolicitado = this.horaSalidaSolicitado;
    this.dataItemHoraExtra.horas = this.horas;

    this.dataItemHoraExtra.motivo = this.motivo;
    this.dataItemHoraExtra.jefeInmediato = this.jefeInmediato;
    this.dataItemHoraExtra.horasCompensadas = this.horasCompensadas;
    this.dataItemHoraExtra.horasSemanalesPendientes = this.horasSemanalesPendientes;
    this.dataItemHoraExtra.horasNoCompensables = this.horasNoCompensables;


    this.dataItemHoraExtra.estado = this.estado;


    this.empleadoService.actualizarDatosPersonalesHorasExtras(this.dataItemHoraExtra).subscribe(
        data => {
          this.guardarFilaGrilla(data);
        },
        error => error
    );

  }

  guardarFilaGrilla(notificacion:NotificacionResult){
    if(notificacion.codigo == 1){
      this.save.emit(this.dataItemHoraExtra);
      this.active = false;
    }else{
      this.closeForm();

    }
  }

  onEnviarHorasExtras(e){

    e.preventDefault();

    this.dataItemHoraExtra.fecha = this.fecha;
    this.dataItemHoraExtra.horaSalidaHorario = this.horaSalidaHorario;
    this.dataItemHoraExtra.horaSalidaSolicitado = this.horaSalidaSolicitado;
    this.dataItemHoraExtra.horas = this.horas;

    this.dataItemHoraExtra.motivo = this.motivo;
    this.dataItemHoraExtra.jefeInmediato = this.jefeInmediato;
    this.dataItemHoraExtra.horasCompensadas = this.horasCompensadas;
    this.dataItemHoraExtra.horasSemanalesPendientes = this.horasSemanalesPendientes;

    this.dataItemHoraExtra.estado = 'E';
    this.dataItemHoraExtra.nombreEstado = 'Enviado';

    this.empleadoService.actualizarDatosPersonalesHorasExtras(this.dataItemHoraExtra).subscribe(
        data => {
          this.guardarFilaGrilla(data);

        },
        error => error
    );
  }


  validarRequerido():boolean{
    let validacion = false;



    return validacion;
  }

  onChangeFecha(value){
    this.fecha = value;
  }

  calcularHoraSalidaSolicitado(){

    let horaIni:string[] = this.horaSalidaHorario.split(':');

    let fechaFin:Date= new Date( 2017,0,1,parseInt(horaIni[0]),parseInt(horaIni[1]));

    fechaFin.setMinutes(fechaFin.getMinutes()+this.horas*60);

    let horaFin:string = this.autocompleteOneZeroLeft(fechaFin.getHours())+':'+this.autocompleteOneZeroLeft(fechaFin.getMinutes());

    this.horaSalidaSolicitado = horaFin;
  }

  autocompleteOneZeroLeft(value:number):string{
    let val:string = value.toString();

    if(val.length == 1){
      val = '0' + val;
    }
    return val;
  }


}