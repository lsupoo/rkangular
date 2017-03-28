import { Component, Input,  Output, EventEmitter, ViewChild} from '@angular/core';
import {ModalDirective} from "ng2-bootstrap";
import {HorarioEmpleadoDia} from "../../+dto/maintenance/horarioEmpleadoDia";

declare var $: any;

@Component({
  selector: 'horario-empleado-dia-dialog-form',
  template: `

    <div bsModal #lgModal="bs-modal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" (click)="onClose()" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 class="modal-title">{{tituloCabecera}}</h4>
        </div>
        <div class="modal-body">
          <div class="smart-form">
            
            <div class="row">
            <div class="col-md-12">
                <section class="col col-md-4">
                  <label>Dia de la Semana</label>
                  <label class="input state-disabled"> 
                        <input type="text" [(ngModel)]="nombreDiaSemana" disabled="disabled" />
                  </label>
                 </section>
            
                <section class="col col-md-4">
                  <label>Laboral</label>
                  <label class="input"> 
                       <kendo-dropdownlist [data]="laborales" id="codigo" [textField]="'nombre'" 
														[valueField]="'codigo'" [defaultItem]="defaultItemLaboral" [(value)]="laboral"
														[valuePrimitive]="true" style="width: 100%;"  (selectionChange)="onChangeLaboral($event)">
														</kendo-dropdownlist>
                  </label>
                 </section>
             </div>
              
                 
                <section class="col col-md-4">
                  <label>Entrada</label>
                  <label [class]="noLaboralClass"> 
                  
                        <p-inputMask mask="99:99" [(ngModel)]="entrada" placeholder="00:00" [disabled]="isNoLaboral" (onComplete)="calcularHoraSalida()"></p-inputMask>
                        <!--i class="icon-append fa fa-clock-o"></i>
						<input type="text" [(ngModel)]="entrada" 
							smartClockpicker data-autoclose="true" (change)="onChangeHoraEntrada($event)" [disabled]="isNoLaboral" readonly="readonly"/-->
                  </label>
                 </section>
                                
                <section class="col col-md-4">
                  <label>Salida</label>
                  <label [class]="noLaboralClass"> 
                        <p-inputMask mask="99:99" [(ngModel)]="salida" placeholder="00:00" [disabled]="isNoLaboral"></p-inputMask>
                        <!--i class="icon-append fa fa-clock-o"></i>
						<input type="text" [(ngModel)]="salida" 
							smartClockpicker data-autoclose="true" (change)="onChangeHoraSalida($event)"[disabled]="isNoLaboral" readonly="readonly"-->
                  </label>
                 </section>
                 
                 <section class="col col-md-4">
                  <label>Tiempo de Almuerzo</label>
                  <label class="input state-disabled"> 
                       <input type="text" [(ngModel)]="tiempoAlmuerzo" disabled="disabled" />
                  </label>
                 </section>
                 
                
              </div>
              
              <div id="dialog-message-horario-empleado-dia" [saJquiDialog]="{
								autoOpen: false,
								modal: true,
								resizable: false
							  }">
						<!-- dialog header // removing on compile-->
						<div data-dialog-title="">
							<div class="widget-header"><h4><i class="icon-ok"></i> Informacion</h4></div>
						</div>
						
						<p>
							{{mensaje}}
						</p>

						<div class="hr hr-12 hr-double"></div>

						<div data-dialog-buttons="">
							<button class="btn btn-primary" (click)="cerrarDialogPermiso()"><i class="fa fa-check"></i>&nbsp;OK</button>
						</div>

					</div>
          </div>
          
          </div>
               
          <div class="modal-footer">
                <a (click)="onActualizarHorarioDia($event)" class="btn btn-primary"><i class="fa  fa-sign-out"></i> Guardar</a>
				<a (click)="onCancel($event)" class="btn btn-default"><i class="fa fa-arrow-circle-left"></i> Cancelar</a>
          </div>
          
          </div>
    </div>
  </div>
    `
})
export class HorarioEmpleadoDiaDialogFormComponent {


  public diaSemana:string;
  public nombreDiaSemana:string;
  public laboral:string;
  public tiempoAlmuerzo:number;
  public entrada:string;
  public salida:string;

  public totalHoras:number;

  public laborales:any=[{codigo:'Si',nombre:'Si'},{codigo:'No',nombre:'No'}];
  public defaultItemLaboral:any={codigo:null,nombre:'Seleccionar'};

  public mensaje:string;

  public isNoLaboral:boolean=false;
  public noLaboralClass:string='input';

  dataItemHorarioDia:HorarioEmpleadoDia;

  @Input() public set model(dto: HorarioEmpleadoDia) {
    this.dataItemHorarioDia = dto;
    dto === undefined ?  this.lgModal.hide():  this.lgModal.show();
  }

  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Output() save: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  public active: boolean = false;

  public tituloCabecera:string="";

  public onCancel(e): void {
    e.preventDefault();
    this.active = false;
    this.lgModal.hide();
    this.cancel.emit(undefined);
  }

  public onClose(): void {
    this.active = false;
    this.lgModal.hide();
    this.cancel.emit(undefined);
  }

  onActualizarHorarioDia(e){

    e.preventDefault();

    this.dataItemHorarioDia.diaSemana = this.diaSemana;
    this.dataItemHorarioDia.nombreDiaSemana = this.nombreDiaSemana;
    this.dataItemHorarioDia.entrada = this.entrada;
    this.dataItemHorarioDia.salida = this.salida;
    this.dataItemHorarioDia.laboral = this.laboral;
    this.dataItemHorarioDia.tiempoAlmuerzo = this.tiempoAlmuerzo;

    this.save.emit(this.dataItemHorarioDia);
    this.active = false;
    this.lgModal.hide();

  }

  onChangeLaboral(value){
    if(value == 'No'){
    this.isNoLaboral=true;
    this.noLaboralClass='input state-disabled';
      this.tiempoAlmuerzo=undefined;
      this.entrada=undefined;
      this.salida=undefined;
    }else{
      this.isNoLaboral=false;
      this.noLaboralClass='input';
      this.tiempoAlmuerzo=1;
    }
  }

  onChangeHoraEntrada(value){
    this.entrada = value;
  }

  onChangeHoraSalida(value){
    this.salida = value;
  }

  @ViewChild('lgModal') public lgModal:ModalDirective;

  public showChildModal():void {
    this.lgModal.show();
  }

  public hideChildModal():void {
    this.lgModal.hide();
  }

  cerrarDialogPermiso(){
    this.mensaje = '';
    $( '#dialog-message-horario-empleado-dia' ).dialog( "close");

  }

  calcularHoras(){

    let horaIni:string[] = this.entrada.split(':');
    let horaFin:string[] = this.salida.split(':');

    let fechaIni:Date= new Date( 2017,0,1,parseInt(horaIni[0]),parseInt(horaIni[1]));

    let fechaFin:Date= new Date( 2017,0,1,parseInt(horaFin[0]),parseInt(horaFin[1]));

    let interval= fechaFin.getTime()- fechaIni.getTime();
    let hours:number = interval / (1000*60*60);

    this.totalHoras = parseFloat(hours.toFixed(2));

  }

  public calcularHoraSalida(){

    let horaIni:string[] = this.entrada.split(':');

    let fechaFin:Date= new Date( 2017,0,1,parseInt(horaIni[0]),parseInt(horaIni[1]));

    fechaFin.setMinutes(fechaFin.getMinutes()+this.totalHoras*60);

    let horaFin:string = this.autocompleteOneZeroLeft(fechaFin.getHours())+':'+this.autocompleteOneZeroLeft(fechaFin.getMinutes());

    this.salida = horaFin;

  }

  autocompleteOneZeroLeft(value:number):string{
    let val:string = value.toString();

    if(val.length == 1){
      val = '0' + val;
    }
    return val;
  }

}