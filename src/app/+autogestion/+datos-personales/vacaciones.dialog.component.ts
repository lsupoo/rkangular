import { Component, Input,  Output, EventEmitter, ViewChild} from '@angular/core';
import {ModalDirective} from "ng2-bootstrap";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {PermisoService} from "../../+common/service/permiso.service";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {PeriodoEmpleado} from "../../+dto/maintenance/periodoEmpleado";
import {Vacacion} from "../../+dto/maintenance/vacacion";

declare var $: any;

@Component({
  selector: 'vacacion-dialog-form',
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
                  <label>Periodo</label>
                  <label class="input state-disabled"> 
                        <input type="text" [(ngModel)]="periodo" disabled="disabled"/>
                  </label>
                 </section>
              
                <section class="col col-md-4">
                  <label>Dias Disponibles</label>
                  <label class="input state-disabled"> 
                        <input type="text" [(ngModel)]="diasVacacionesDisponibles" disabled="disabled"/>
                  </label>
                 </section>
                
                <section class="col col-md-4">
                  <label>Desde</label>
                  <label [class]="enviadoClass"> 
                        <i class="icon-append fa fa-calendar"></i>
						<input type="text" saUiDatepicker date-format="dd/MM/yy" 
						    placeholder="Seleccionar una Fecha" 
						    [(ngModel)]="fechaDesde" (change)="onChangeFechaDesde($event)" readonly="readonly" [disabled]="isEnviado"/>
                  </label>
                 </section>
                 
                 <section class="col col-md-4">
                  <label>Dias Calendarios</label>
                  <label class="input state-disabled">
						<input [(ngModel)]="diasCalendarios" disabled="disabled"/>
                  </label>
                 </section>
                                
                <section class="col col-md-4">
                  <label>Estado</label>
                  <label class="input state-disabled"> 
						<input type="text" [(ngModel)]="nombreEstado" disabled="disabled">
                  </label>
                 </section>
                 
                 <section class="col col-md-4">
                  <label>Hasta</label>
                  <label [class]="enviadoClass"> 
                       <i class="icon-append fa fa-calendar"></i>
						<input type="text" saUiDatepicker date-format="dd/MM/yy" 
						    placeholder="Seleccionar una Fecha" 
						    [(ngModel)]="fechaHasta" (change)="onChangeFechaHasta($event)" readonly="readonly" [disabled]="isEnviado"/>
                  </label>
                 </section>
                
                <section class="col col-md-4">
                  <label>Dias Habiles</label>
                  <label class="input state-disabled"> 
						<input type="text" [(ngModel)]="diasHabiles" disabled="disabled"/>
                  </label>
                 </section>
                             
                 
                 <div class="col-md-12">

					<section class="col col-md-8">
						<label>Comentario del Jefe Inmediato</label>
						<label class="input state-disabled">
							<input type="text" [(ngModel)]="comentarioJefeInmediato"  disabled="disabled"/>
						</label>
					</section>
				</div>
				
                
              </div>
             
            </div>  
           </div>     
          <div class="modal-footer">
            <a (click)="onActualizarVacaciones($event)" class="btn btn-primary" *ngIf="!isEnviado"> Guardar</a>
			<a (click)="onEnviarVacaciones($event)" class="btn btn-primary" *ngIf="!isEnviado"> Enviar</a>
			<a (click)="(null)" class="btn btn-primary" *ngIf="!isEnviado"> Eliminar</a>
			<a (click)="onCancel($event)" class="btn btn-default"> Cancelar</a>
          </div>
    </kendo-dialog>
    `
})
export class VacacionesDialogFormComponent {


  public jefeInmediato:string;
  public periodo:string;
  public diasDisponibles:number;
  public diasCalendarios:number;
  public diasHabiles:number;
  public fechaDesde:string;
  public fechaHasta:string;
  public estado:string;
  public nombreEstado:string;
  public comentarioJefeInmediato:string;
  public diasVacacionesDisponibles:string;

  public mensaje:string;

  public isEnviado:boolean=true;
  public enviadoClass:string='input';

  dataItemVacacion:Vacacion;
  editForm;

  @Input() public set model(dto: Vacacion) {
    this.dataItemVacacion = dto;
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

  onActualizarVacaciones(e){

    this.dataItemVacacion.fechaInicio = this.fechaDesde;
    this.dataItemVacacion.fechaFin = this.fechaHasta;
    this.dataItemVacacion.diasCalendarios = this.diasCalendarios;
    this.dataItemVacacion.diasHabiles = this.diasHabiles;
    this.dataItemVacacion.estado = this.estado;

    let periodoEmpleado:PeriodoEmpleado = new PeriodoEmpleado();
    periodoEmpleado.idPeriodoEmpleado = this.dataItemVacacion.idPeriodoEmpleado;

    this.dataItemVacacion.periodoEmpleado = periodoEmpleado;


    this.empleadoService.actualizarDatosPersonalesVacaciones(this.dataItemVacacion).subscribe(
        data => {
          this.guardarFilaGrilla(data);
        },
        error => error
    );

  }

  guardarFilaGrilla(notificacion:NotificacionResult){
    if(notificacion.codigo == 1){
      this.save.emit(this.dataItemVacacion);
      this.active = false;
    }else{
      this.closeForm();

    }
  }

  onEnviarVacaciones(e){

    e.preventDefault();

    this.dataItemVacacion.fechaInicio = this.fechaDesde;
    this.dataItemVacacion.fechaFin = this.fechaHasta;
    this.dataItemVacacion.diasCalendarios = this.diasCalendarios;
    this.dataItemVacacion.diasHabiles = this.diasHabiles;
    this.dataItemVacacion.estado = 'E';
    this.dataItemVacacion.nombreEstado = 'Enviado';

    let periodoEmpleado:PeriodoEmpleado = new PeriodoEmpleado();
    periodoEmpleado.idPeriodoEmpleado = this.dataItemVacacion.idPeriodoEmpleado;

    this.dataItemVacacion.periodoEmpleado = periodoEmpleado;

    this.empleadoService.enviarDatosPersonalesVacaciones(this.dataItemVacacion).subscribe(
        data => {
          this.guardarFilaGrilla(data);

        },
        error => error
    );
  }


  validarRequerido():boolean{
    let validacion = false;

    /*if(this.nivelEducacion === undefined || this.nivelEducacion == null || this.nivelEducacion=='' ){
      $('#nivelEducacion').parent().addClass('state-error').removeClass('state-success');
      validacion = true;
    }
    if(this.institucion === undefined || this.institucion == null || this.institucion==''){
      $('#institucion').parent().addClass('state-error').removeClass('state-success');
      validacion = true;
    }
    if(this.fechaInicio === undefined || this.fechaInicio == null || this.fechaInicio==''){
      $('#fechaInicio').parent().addClass('state-error').removeClass('state-success');
      validacion = true;
    }*/

    return validacion;
  }


  onChangeFechaDesde(value){
    this.fechaDesde = value;
    if(this.fechaHasta != null){
      this.onDiasCalendarios();
    }
  }

  onChangeFechaHasta(value){
    this.fechaHasta = value;
    this.onDiasCalendarios();
  }


  onDiasCalendarios(){

    let cadenaFInicio:string[] = this.fechaDesde.split('/');
    let cadenaFFin:string[] = this.fechaHasta.split('/');

    let fechaIni:Date= new Date( parseInt(cadenaFInicio[2]),parseInt(cadenaFInicio[1])-1,parseInt(cadenaFInicio[0]));

    let fechaFin:Date= new Date( parseInt(cadenaFFin[2]),parseInt(cadenaFFin[1])-1,parseInt(cadenaFFin[0]));

    let interval= fechaFin.getTime()- fechaIni.getTime();

    let diasCalendariosVal:number = interval / (1000 * 60 * 60 * 24);


    let millisecondsPerDay = 86400 * 1000; // Day in milliseconds
    fechaIni.setHours(0,0,0,1);  // Start just after midnight
    fechaFin.setHours(23,59,59,999);  // End just before midnight
    let diff = fechaFin.getTime() - fechaIni.getTime();  // Milliseconds between datetime objects
    let dias = Math.ceil(diff / millisecondsPerDay);

    this.diasCalendarios = dias;

    //Dias Habiles
    //Restar dos semanas por cada semana
    let weeks = Math.floor(dias / 7);

    //dias = dias - (weeks * 2);
    dias -= weeks * 2;

    //Manejar casos especiales
    let startDay = fechaIni.getDay();
    let endDay = fechaFin.getDay();
    //Eliminar el fin de semana no eliminado previamente
    if(startDay - endDay > 1)
    //dias = dias -2;
      dias -= 2;

    //Eliminar el día de inicio si el período comienza el domingo
    //pero finaliza antes del sábado
    if(startDay == 0 && endDay != 6)
      dias = dias -1;

    //Eliminar el día final si el período termina el sábado
    //pero empieza después del domingo
    if(endDay == 6 && startDay != 0)
    //dias = dias -1
      dias--;
    // Remove end day if span ends on Saturday but starts after Sunday
    /*if (endDay == 6 && startDay != 0) {
     dias--;
     }*/

    this.diasHabiles = dias;
  }

}