import { Component, Input,  Output, EventEmitter, ViewChild} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';


import {ModalDirective} from "ng2-bootstrap";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {PermisoService} from "../../+common/service/permiso.service";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {Marcacion} from "../../+dto/maintenance/marcacion";
import {SolicitudCambioMarcacion} from "../../+dto/maintenance/solicitudCambioMarcacion";
import {Empleado} from "../../+dto/maintenance/empleado";
import {HistorialLaboral} from "../../+dto/maintenance/historialLaboral";

declare var $: any;

@Component({
  selector: 'marcacion-dialog-form',
  template: `
<kendo-dialog *ngIf="active" (close)="onClose()" >
            <kendo-dialog-titlebar>
                {{tituloCabecera}}
            </kendo-dialog-titlebar>
        <div class="modal-body">
            <div class="smart-form" style="width: 900px;">
                
                <div class="row">
               
                <div class="col-md-12">
                
                    <section class="col col-md-3">
                      <label>Fecha</label>
                      <label class="input state-disabled"> 
                             <i class="icon-append fa fa-calendar"></i>
                             <input type="text"   [(ngModel)]="fechaMarcacion" saUiDatepicker date-format="dd/MM/yy" disabled="disabled"/>
                      </label>
                     </section>
                     
                </div>
                <div class="col-md-12">
                    <section class="col col-md-3">
                      <label>Hora Ingreso</label>
                      <label class="input state-disabled"> 
                            <input type="text" [(ngModel)]="horaIngreso" disabled="disabled"/>
                      </label>
                    </section>
                    <section class="col col-md-3">
                      <label>Hora Inicio Almuerzo</label>
                      <label class="input state-disabled"> 
                            <input type="text" [(ngModel)]="horaInicioAlmuerzo" disabled="disabled"/>
                      </label>
                    </section>
                    <section class="col col-md-3">
                      <label>Hora Fin Almuerzo</label>
                      <label class="input state-disabled"> 
                            <input type="text" [(ngModel)]="horaFinAlmuerzo" disabled="disabled"/>
                      </label>
                    </section>
                    <section class="col col-md-3">
                      <label>Hora Salida</label>
                      <label class="input state-disabled"> 
                            <input type="text" [(ngModel)]="horaSalida" disabled="disabled"/>
                      </label>
                    </section>
                </div>
              
                <div class="col-md-12">
                                        <section class="col col-md-2">
                                            <label>Cambiar</label>
                                            <label class="select">
                                                <input type="checkbox" [(ngModel)]="cambiarIngreso" (change)="cambiarHoraIngreso($event)"/>
                                            </label>
                                        </section>
                                        <section class="col col-md-3">
                                            <label>Hora Ingreso</label>
                                            <label [class]="!isCheckedHoraIngreso?'input state-disabled':'input'">
                                                <p-inputMask mask="99:99" [(ngModel)]="horaIngresoSolicitud" placeholder="00:00" [disabled]="!isCheckedHoraIngreso"></p-inputMask>	
                                                
                                            </label>
                                        </section>
                                        <section class="col col-md-7">
                                            <label>Razon de Cambio</label>
                                            <label [class]="!isCheckedHoraIngreso?'input state-disabled':'input'">
                                                <input type="text" [(ngModel)]="razonCambioHoraIngreso" [disabled]="!isCheckedHoraIngreso"/>
                                            </label>
                                        </section>

                                    </div>

                                    <div class="col-md-12">
                                        <section class="col col-md-2">
                                            <label>Cambiar</label>
                                            <label class="select">
                                                <input type="checkbox" [(ngModel)]="cambiarInicioAlmuerzo" (change)="cambiarHoraIniAlmuerzo($event)"/>
                                            </label>
                                        </section>
                                        <section class="col col-md-3">
                                            <label>Hora Inicio Almuerzo</label>
                                            <label [class]="!isCheckedHoraIniAlmuerzo?'input state-disabled':'input'">
                                                <p-inputMask mask="99:99" [(ngModel)]="horaInicioAlmuerzoSolicitud" placeholder="00:00" [disabled]="!isCheckedHoraIniAlmuerzo"></p-inputMask>	
                                            </label>
                                        </section>
                                        <section class="col col-md-7">
                                            <label>Razon de Cambio</label>
                                            <label [class]="!isCheckedHoraIniAlmuerzo?'input state-disabled':'input'">
                                                <input type="text" [(ngModel)]="razonCambioHoraInicioAlmuerzo"  [disabled]="!isCheckedHoraIniAlmuerzo"/>
                                            </label>
                                        </section>

                                    </div>

                                    <div class="col-md-12">
                                        <section class="col col-md-2">
                                            <label>Cambiar</label>
                                            <label class="select">
                                                <input type="checkbox" [(ngModel)]="cambiarFinAlmuerzo" (change)="cambiarHoraFinAlmuerzo($event)"/>
                                            </label>
                                        </section>
                                        <section class="col col-md-3">
                                            <label>Hora Fin Almuerzo</label>
                                            <label [class]="!isCheckedHoraFinAlmuerzo?'input state-disabled':'input'">
                                                <p-inputMask mask="99:99" [(ngModel)]="horaFinAlmuerzoSolicitud" placeholder="00:00" [disabled]="!isCheckedHoraFinAlmuerzo"></p-inputMask>
                                            </label>
                                        </section>
                                        <section class="col col-md-7">
                                            <label>Razon de Cambio</label>
                                            <label [class]="!isCheckedHoraFinAlmuerzo?'input state-disabled':'input'">
                                                <input type="text" [(ngModel)]="razonCambioHoraFinAlmuerzo" [disabled]="!isCheckedHoraFinAlmuerzo"/>
                                            </label>
                                        </section>

                                    </div>

                                    <div class="col-md-12">
                                        <section class="col col-md-2">
                                            <label>Cambiar</label>
                                            <label class="select">
                                                <input type="checkbox" [(ngModel)]="cambiarSalida" (change)="cambiarHoraSalida($event)"/>
                                            </label>
                                        </section>
                                        <section class="col col-md-3">
                                            <label>Hora Salida</label>
                                            <label [class]="!isCheckedHoraSalida?'input state-disabled':'input'">
                                                <p-inputMask mask="99:99" [(ngModel)]="horaSalidaSolicitud" placeholder="00:00" [disabled]="!isCheckedHoraSalida"></p-inputMask>
                                            </label>
                                        </section>
                                        <section class="col col-md-7">
                                            <label>Razon de Cambio</label>
                                            <label [class]="!isCheckedHoraSalida?'input state-disabled':'input'">
                                                <input type="text" [(ngModel)]="razonCambioHoraSalida" [disabled]="!isCheckedHoraSalida"/>
                                            </label>
                                        </section>

                                    </div>
              
            </div>
             
            </div>  
           </div>     
          <div class="modal-footer">
            <a (click)="onSolicitarCambioMarcacion($event)" class="btn btn-primary"> Guardar</a>
			<a (click)="onCancel($event)" class="btn btn-default"> Cancelar</a>
          </div>
    </kendo-dialog>
    `
})
export class MarcacionesDialogFormComponent {

  public nombreEmpleado:string;
  public nombreProyecto:string;
  public fechaMarcacion:string;
  public horaIngreso:string;
  public horaInicioAlmuerzo:string;
  public horaFinAlmuerzo:string;
  public horaSalida:string;

  public mensaje:string;

  public idAtendidoPor:number;

  public isCheckedHoraIngreso:boolean=false;
  public isCheckedHoraIniAlmuerzo:boolean=false;
  public isCheckedHoraFinAlmuerzo:boolean=false;
  public isCheckedHoraSalida:boolean=false;

  public cambiarIngreso: boolean=false;
  public cambiarInicioAlmuerzo: boolean=false;
  public cambiarFinAlmuerzo: boolean=false;
  public cambiarSalida: boolean=false;

  public horaIngresoSolicitud: string;
  public horaInicioAlmuerzoSolicitud: string;
  public horaFinAlmuerzoSolicitud: string;
  public horaSalidaSolicitud: string;

  public razonCambioHoraIngreso: string;
  public razonCambioHoraInicioAlmuerzo: string;
  public razonCambioHoraFinAlmuerzo: string;
  public razonCambioHoraSalida: string;

  public idEmpleado:number;

  private historiasLaboralesActuales: HistorialLaboral[] = [];

  private defaultItemHistoriaLaboral: any = {idJefeInmendiato:null, jefeInmediato:'Seleccionar'};

  dataItemMarcacion:Marcacion;
  editForm;

  @Input() public set model(dto: Marcacion) {
    this.dataItemMarcacion = dto;
    //dto === undefined ?  this.lgModal.hide():  this.lgModal.show();
    dto === undefined ? this.active=false: this.active=true;
  }

  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Output() save: EventEmitter<any> = new EventEmitter();


  errorMessage: string;

  constructor(private empleadoService:EmpleadoService, private permisoService:PermisoService) {

  }

  public active: boolean = false;

  public tituloCabecera:string="Solicitar Cambio Marcacion";


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

  public obtenerJefeInmediatoMarcaciones() {
    let empleado:Empleado= new Empleado();
    empleado.idEmpleado=this.idEmpleado;

    this.permisoService.obtenerHistoriasLaboralesActualPorEmpleado(empleado).subscribe(
        historiaLaboral => this.historiasLaboralesActuales = historiaLaboral,
        error =>  this.errorMessage = <any>error);
  }

  onSolicitarCambioMarcacion(e){

    let solicitudCambioMarcacion:SolicitudCambioMarcacion = new SolicitudCambioMarcacion();

    solicitudCambioMarcacion.idMarcacion = this.dataItemMarcacion.idMarcacion;

    //solicitudCambioMarcacion.idAtendidoPor = this.idAtendidoPor;

    solicitudCambioMarcacion.horaIngreso = this.horaIngresoSolicitud;
    solicitudCambioMarcacion.horaInicioAlmuerzo = this.horaInicioAlmuerzoSolicitud;
    solicitudCambioMarcacion.horaFinAlmuerzo = this.horaFinAlmuerzoSolicitud;
    solicitudCambioMarcacion.horaSalida = this.horaSalidaSolicitud;

    solicitudCambioMarcacion.cambiarIngreso = this.cambiarIngreso;
    solicitudCambioMarcacion.cambiarInicioAlmuerzo = this.cambiarInicioAlmuerzo;
    solicitudCambioMarcacion.cambiarFinAlmuerzo = this.cambiarFinAlmuerzo;
    solicitudCambioMarcacion.cambiarSalida = this.cambiarSalida;

    solicitudCambioMarcacion.razonCambioHoraIngreso = this.razonCambioHoraIngreso;
    solicitudCambioMarcacion.razonCambioHoraInicioAlmuerzo = this.razonCambioHoraInicioAlmuerzo;
    solicitudCambioMarcacion.razonCambioHoraFinAlmuerzo = this.razonCambioHoraFinAlmuerzo;
    solicitudCambioMarcacion.razonCambioHoraSalida = this.razonCambioHoraSalida;

    this.dataItemMarcacion.solicitudCambio = 'Si';

    this.empleadoService.registrarCorreccionMarcacion(solicitudCambioMarcacion).subscribe(
        data => {
          this.guardarFilaGrilla(data);
        },
        error => error
    );

  }

  guardarFilaGrilla(notificacion:NotificacionResult){
    if(notificacion.codigo == 1){
      this.save.emit(this.dataItemMarcacion);
      this.active = false;
    }else{
      this.closeForm();

    }
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

  cambiarHoraIngreso(value){
    let isChecked:boolean = value.target.checked;
    this.isCheckedHoraIngreso = isChecked;
  }

  cambiarHoraIniAlmuerzo(value){
    let isChecked:boolean = value.target.checked;
    this.isCheckedHoraIniAlmuerzo = isChecked;
  }

  cambiarHoraFinAlmuerzo(value){
    let isChecked:boolean = value.target.checked;
    this.isCheckedHoraFinAlmuerzo = isChecked;
  }

  cambiarHoraSalida(value){
    let isChecked:boolean = value.target.checked;
    this.isCheckedHoraSalida = isChecked;
  }

  onChangeHoraIngreso(value){
    this.horaIngresoSolicitud = value;
  }

  onChangeHoraInicioAlmuerzo(value){
    this.horaInicioAlmuerzoSolicitud = value;
  }

  onChangeHoraFinAlmuerzo(value){
    this.horaFinAlmuerzoSolicitud = value;
  }

  onChangeHoraSalida(value){
    this.horaSalidaSolicitud = value;
  }

}