import { Component, Input,  Output, EventEmitter, ViewChild} from '@angular/core';

import {ModalDirective} from "ng2-bootstrap";
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {PermisoEmpleado} from "../../+dto/maintenance/permisoEmpleado";
import {PermisoService} from "../../+common/service/permiso.service";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {PeriodoEmpleado} from "../../+dto/maintenance/periodoEmpleado";
import {StorageResult} from "../../+dto/storageResult";

declare var $: any;

@Component({
  selector: 'permiso-dialog-form',
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
            
                <section class="col col-md-8">
                  <label>Periodo</label>
                  <label class="input state-disabled"> 
                        <input type="text" [(ngModel)]="periodo" disabled="disabled"/>
                  </label>
                 </section>
              
                <section class="col col-md-4">
                  <label>Motivo</label>
                  <label class="input"> 
                        <kendo-dropdownlist [data]="motivos" id="motivo" [textField]="'nombre'" 
														[valueField]="'codigo'" [defaultItem]="defaultItem" [(value)]="motivo"
														[valuePrimitive]="true" style="width: 100%;"  (selectionChange)="cargarMotivo($event)" [disabled]="isEnviado">
														</kendo-dropdownlist>
                  </label>
                 </section>
                
                <section class="col col-md-8">
                  <label>Razon</label>
                  <label [class]="enviadoClass"> 
                        <input type="text" [(ngModel)]="razon" [disabled]="isEnviado"> 
                  </label>
                 </section>
                 <div class="col-md-12">
                   <section class="col col-md-4">
                    <label>Fecha Permiso</label>
                    <label [class]="enviadoClass"> 
                         <i class="icon-append fa fa-calendar"></i>
                          <input type="text" saUiDatepicker date-format="dd/MM/yy" 
                              placeholder="Seleccionar una Fecha" 
                              [(ngModel)]="fechaPermiso" (change)="onChangeFecha($event)" readonly="readonly" [disabled]="isEnviado"/>
                    </label>
                   </section>
                  
                  <section class="col col-md-2">
                    <label>Desde</label>
                    <label [class]="enviadoClass"> 
                          <p-inputMask mask="99:99" [(ngModel)]="horaDesdePermiso" placeholder="00:00" [disabled]="isEnviado"></p-inputMask>
                    </label>
                   </section>
                                  
                  <section class="col col-md-2">
                    <label>Hasta</label>
                    <label [class]="enviadoClass"> 
                          <p-inputMask mask="99:99" [(ngModel)]="horaHastaPermiso" placeholder="00:00" [disabled]="isEnviado"></p-inputMask>
                    </label>
                   </section>
                 </div>
                 <div class="col-md-12" *ngIf="!isCompensarhoras">

					<section class="col col-md-4">
						<label>Fecha de Recuperacion</label>
						<label [class]="enviadoClass">
							<i class="icon-append fa fa-calendar"></i>
							<input type="text"  saUiDatepicker date-format="dd/MM/yy" 
								placeholder="Seleccionar una Fecha" [(ngModel)]="fechaRecuperacion" 
								(change)="onChangeFechaRecuperacion($event)" readonly="readonly" [disabled]="isEnviado"/>
						</label>
					</section>

					<section class="col col-md-2">
						<label>Desde</label>
						<label [class]="enviadoClass">
							<p-inputMask mask="99:99" [(ngModel)]="horaDesdeRecuperacion" placeholder="00:00" [disabled]="isEnviado"></p-inputMask>	
						</label>
					</section>
					<section class="col col-md-2">
						<label>Hasta</label>
						<label [class]="enviadoClass">
							<p-inputMask mask="99:99" [(ngModel)]="horaHastaRecuperacion" placeholder="00:00" [disabled]="isEnviado"></p-inputMask>	
						</label>
					</section>
				</div>
				
				<div class="col-md-12" *ngIf="isCompensarhoras">
					<section class="col col-md-4">
						<label>Horas por Compensar</label>
						<label class="input state-disabled">
							<input type="text" disabled="disabled"/>
						</label>
    				</section>
				</div>
				
				<div class="col-md-12">
					<section class="col col-md-4">
						<label>Estado</label>
						<label class="input state-disabled">
							<input type="text" [(ngModel)]="nombreEstado" disabled="disabled">
						</label>
					</section>
					<section class="col col-md-8">
						<label>Comentario Jefe Inmediato</label>
						<label class="input state-disabled">
							<input type="text" disabled="disabled">
						</label>
					</section>
				</div>
                
              </div>
             
            </div>  
           </div>     
          <div class="modal-footer">
            
            <a (click)="onActualizarPermisoEmpleado($event)" class="btn btn-primary" *ngIf="!isEnviado"> Guardar</a>
			<a (click)="onEnviarPermisoEmpleado($event)" class="btn btn-primary" *ngIf="!isEnviado"> Enviar</a>
			<a (click)="(null)" class="btn btn-primary" *ngIf="!isEnviado"> Eliminar</a>
			<a (click)="onCancel($event)" class="btn btn-default"> Cancelar</a>
          </div>
    </kendo-dialog>

    `
})
export class PermisosDialogFormComponent {


  public jefeInmediato:string;
  public periodo:string;
  public nombreMotivo:string;
  public motivo:string;
  public razon:string;
  public fechaPermiso:string;
  public horaDesdePermiso:string;
  public horaHastaPermiso:string;
  public fechaRecuperacion:string;
  public horaDesdeRecuperacion:string;
  public horaHastaRecuperacion:string;
  public horasPorCompensar:string;
  public estado:string;
  public nombreEstado:string;
  public comentarioJefeInmediato:string;

  public mensaje:string;

  private motivos:TablaGeneralResult[];
  public isCompensarhoras:boolean=true;
  public isEnviado:boolean=true;
  public enviadoClass:string='input';

  dataItemPermisoEmpleado:PermisoEmpleado;
  editForm;

  @Input() public set model(dto: PermisoEmpleado) {
    this.obtenerMotivo();
    this.dataItemPermisoEmpleado = dto;
    //dto === undefined ?  this.lgModal.hide():  this.lgModal.show();
    dto === undefined ? this.active=false: this.active=true;
  }

  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Output() save: EventEmitter<any> = new EventEmitter();


  errorMessage: string;

  public defaultItem:TablaGeneralResult={codigo:null,nombre:'Seleccionar',grupo:null};
  public storageCommomnValueResult: StorageResult = new StorageResult();
  
  constructor(private empleadoService:EmpleadoService,
              private permisoService:PermisoService) {
    this.storageCommomnValueResult = JSON.parse(localStorage.getItem('localStorageCommonsValues'));

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

  onActualizarPermisoEmpleado(e){
    e.preventDefault();

    for(var item in this.motivos){
      var data = this.motivos[item];
      if(this.motivo===data.codigo){
        this.nombreMotivo = data.nombre;
        break;
      }
    }

    this.dataItemPermisoEmpleado.motivo = this.motivo;
    this.dataItemPermisoEmpleado.razon = this.razon;
    this.dataItemPermisoEmpleado.fecha = this.fechaPermiso;
    this.dataItemPermisoEmpleado.horaInicio = this.horaDesdePermiso;
    this.dataItemPermisoEmpleado.horaFin = this.horaHastaPermiso;
    this.dataItemPermisoEmpleado.fechaRecuperacion = this.fechaRecuperacion;
    this.dataItemPermisoEmpleado.horaInicioRecuperacion = this.horaDesdeRecuperacion;
    this.dataItemPermisoEmpleado.horaFinRecuperacion = this.horaHastaRecuperacion;
    this.dataItemPermisoEmpleado.estado = this.estado;

    let periodoEmpleado:PeriodoEmpleado = new PeriodoEmpleado();
    periodoEmpleado.idPeriodoEmpleado = this.dataItemPermisoEmpleado.idPeriodoEmpleado;

    this.dataItemPermisoEmpleado.periodoEmpleado = periodoEmpleado;

    let fechaAct:Date = new Date();

    if(this.validarRequerido()){
      this.mensaje = 'Ingrese los campos obligatorios';
      $( '#dialog-message-permiso' ).dialog( "open" );
      return;
    }

    let cadena:string[] = this.fechaPermiso.split('/');
    let horaIni:string[] = this.horaDesdePermiso.split(':');
    let horaFin:string[] = this.horaHastaPermiso.split(':');

    let fechaIni:Date= new Date( parseInt(cadena[2]),parseInt(cadena[1])-1,parseInt(cadena[0]),parseInt(horaIni[0]),parseInt(horaIni[1]));

    let fechaFin:Date= new Date( parseInt(cadena[2]),parseInt(cadena[1])-1,parseInt(cadena[0]),parseInt(horaFin[0]),parseInt(horaFin[1]));

    let fechaPerm:Date= new Date( parseInt(cadena[2]),parseInt(cadena[1])-1,parseInt(cadena[0]));


    if(fechaPerm<fechaAct){
      this.mensaje = 'La fecha del permiso debe ser mayor a la fecha de hoy.';
      $( '#dialog-message-permiso' ).dialog( "open" );
      return;
    }

    if(fechaFin.getTime()<fechaIni.getTime()){
      this.mensaje = 'La hora final del permiso debe ser mayor a la hora inicial del permiso.';
      $( '#dialog-message-permiso' ).dialog( "open" );
      return;
    }

    let interval= fechaFin.getTime()- fechaIni.getTime();
    let hours:number = interval / (1000*60*60);
    this.dataItemPermisoEmpleado.horas = parseFloat(hours.toFixed(2));

    if( this.motivo == 'P'){
      if(this.validarRequeridoFechaRecuperacion()){
        this.mensaje = 'Ingrese los campos obligatorios de la Fecha de Recuperacion.';
        $( '#dialog-message-permiso' ).dialog( "open" );
        return;
      }

      let cadenaRecuperacion:string[] = this.fechaRecuperacion.split('/');
      let horaIniRecuperacion:string[] = this.horaDesdeRecuperacion.split(':');
      let horaFinRecuperacion:string[] = this.horaHastaRecuperacion.split(':');

      let fechaIniRecuperacion:Date= new Date( parseInt(cadenaRecuperacion[2]),parseInt(cadenaRecuperacion[1])-1,parseInt(cadenaRecuperacion[0]),parseInt(horaIniRecuperacion[0]),parseInt(horaIniRecuperacion[1]));

      let fechaFinRecuperacion:Date= new Date( parseInt(cadenaRecuperacion[2]),parseInt(cadenaRecuperacion[1])-1,parseInt(cadenaRecuperacion[0]),parseInt(horaFinRecuperacion[0]),parseInt(horaFinRecuperacion[1]));

      let fechaRec:Date= new Date( parseInt(cadenaRecuperacion[2]),parseInt(cadenaRecuperacion[1])-1,parseInt(cadenaRecuperacion[0]));


      if(fechaRec<fechaAct){
        this.mensaje = 'La fecha de recuperacion debe ser mayor a la fecha de hoy.';
        $( '#dialog-message-permiso' ).dialog( "open" );
        return;
      }

      if(fechaFinRecuperacion.getTime()<fechaIniRecuperacion.getTime()){
        this.mensaje = 'La hora final de recuperacion debe ser mayor a la hora inicial de recuperacion.';
        $( '#dialog-message-permiso' ).dialog( "open" );
        return;
      }
    }
    this.permisoService.actualizarPermisoEmpleadoDatosPersonales(this.dataItemPermisoEmpleado).subscribe(
        data => {
          this.guardarFilaGrilla(data);
        },
        error => error

    );

  }

  guardarFilaGrilla(notificacion:NotificacionResult){
    if(notificacion.codigo == 1){
      this.save.emit(this.dataItemPermisoEmpleado);
      this.active = false;
    }else{
      this.closeForm();

    }
  }

  public closeForm(){
    this.active = false;
    this.cancel.emit();
  }

  onEnviarPermisoEmpleado(e){

    e.preventDefault();

    for(var item in this.motivos){
      var data = this.motivos[item];
      if(this.motivo===data.codigo){
        this.nombreMotivo = data.nombre;
        break;
      }
    }

    this.dataItemPermisoEmpleado.motivo = this.motivo;
    this.dataItemPermisoEmpleado.razon = this.razon;
    this.dataItemPermisoEmpleado.fecha = this.fechaPermiso;
    this.dataItemPermisoEmpleado.horaInicio = this.horaDesdePermiso;
    this.dataItemPermisoEmpleado.horaFin = this.horaHastaPermiso;
    this.dataItemPermisoEmpleado.fechaRecuperacion = this.fechaRecuperacion;
    this.dataItemPermisoEmpleado.horaInicioRecuperacion = this.horaDesdeRecuperacion;
    this.dataItemPermisoEmpleado.horaFinRecuperacion = this.horaHastaRecuperacion;
    this.dataItemPermisoEmpleado.estado = 'E';
    this.dataItemPermisoEmpleado.nombreEstado = 'Enviado';

    let periodoEmpleado:PeriodoEmpleado = new PeriodoEmpleado();
    periodoEmpleado.idPeriodoEmpleado = this.dataItemPermisoEmpleado.idPeriodoEmpleado;

    this.dataItemPermisoEmpleado.periodoEmpleado = periodoEmpleado;

    let fechaAct:Date = new Date();

    if(this.validarRequerido()){
      this.mensaje = 'Ingrese los campos obligatorios';
      $( '#dialog-message-permiso' ).dialog( "open" );
      return;
    }

    let cadena:string[] = this.fechaPermiso.split('/');
    let horaIni:string[] = this.horaDesdePermiso.split(':');
    let horaFin:string[] = this.horaHastaPermiso.split(':');

    let fechaIni:Date= new Date( parseInt(cadena[2]),parseInt(cadena[1])-1,parseInt(cadena[0]),parseInt(horaIni[0]),parseInt(horaIni[1]));

    let fechaFin:Date= new Date( parseInt(cadena[2]),parseInt(cadena[1])-1,parseInt(cadena[0]),parseInt(horaFin[0]),parseInt(horaFin[1]));

    let fechaPerm:Date= new Date( parseInt(cadena[2]),parseInt(cadena[1])-1,parseInt(cadena[0]));


    if(fechaPerm<fechaAct){
      this.mensaje = 'La fecha del permiso debe ser mayor a la fecha de hoy.';
      $( '#dialog-message-permiso' ).dialog( "open" );
      return;
    }

    if(fechaFin.getTime()<fechaIni.getTime()){
      this.mensaje = 'La hora final del permiso debe ser mayor a la hora inicial del permiso.';
      $( '#dialog-message-permiso' ).dialog( "open" );
      return;
    }

    let interval= fechaFin.getTime()- fechaIni.getTime();
    let hours:number = interval / (1000*60*60);
    this.dataItemPermisoEmpleado.horas = parseFloat(hours.toFixed(2));

    if( this.motivo == 'P'){
      if(this.validarRequeridoFechaRecuperacion()){
        this.mensaje = 'Ingrese los campos obligatorios de la Fecha de Recuperacion.';
        $( '#dialog-message-permiso' ).dialog( "open" );
        return;
      }

      let cadenaRecuperacion:string[] = this.fechaRecuperacion.split('/');
      let horaIniRecuperacion:string[] = this.horaDesdeRecuperacion.split(':');
      let horaFinRecuperacion:string[] = this.horaHastaRecuperacion.split(':');

      let fechaIniRecuperacion:Date= new Date( parseInt(cadenaRecuperacion[2]),parseInt(cadenaRecuperacion[1])-1,parseInt(cadenaRecuperacion[0]),parseInt(horaIniRecuperacion[0]),parseInt(horaIniRecuperacion[1]));

      let fechaFinRecuperacion:Date= new Date( parseInt(cadenaRecuperacion[2]),parseInt(cadenaRecuperacion[1])-1,parseInt(cadenaRecuperacion[0]),parseInt(horaFinRecuperacion[0]),parseInt(horaFinRecuperacion[1]));

      let fechaRec:Date= new Date( parseInt(cadenaRecuperacion[2]),parseInt(cadenaRecuperacion[1])-1,parseInt(cadenaRecuperacion[0]));


      if(fechaRec<fechaAct){
        this.mensaje = 'La fecha de recuperacion debe ser mayor a la fecha de hoy.';
        $( '#dialog-message-permiso' ).dialog( "open" );
        return;
      }

      if(fechaFinRecuperacion.getTime()<fechaIniRecuperacion.getTime()){
        this.mensaje = 'La hora final de recuperacion debe ser mayor a la hora inicial de recuperacion.';
        $( '#dialog-message-permiso' ).dialog( "open" );
        return;
      }
    }


    this.permisoService.enviarPermisoEmpleadoDatosPersonales(this.dataItemPermisoEmpleado).subscribe(
        data => {
          this.guardarFilaGrilla(data);

        },
        error => error
    );
  }

  cargarMotivo(value){
    if(value == 'P'){
      this.isCompensarhoras=false;
      /*$('#fechaRecuperacion').removeClass('state-error');
      $('#fechaRecuperacion').parent().removeClass('state-error');

      $('#horaDesdeRecuperacion').removeClass('state-error');
      $('#horaDesdeRecuperacion').parent().removeClass('state-error');

      $('#horaHastaRecuperacion').removeClass('state-error');
      $('#horaHastaRecuperacion').parent().removeClass('state-error');*/

    }else{
      this.isCompensarhoras=true;
    }
  }

  ingresaInstitucion(){
    /*$('#institucion').removeClass('state-error');
    $('#institucion').parent().removeClass('state-error');*/
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

  validarRequeridoFechaRecuperacion():boolean{
    let validacion = false;

    /*if(this.permisos.fechaRecuperacion === undefined || this.permisos.fechaRecuperacion == null || this.permisos.fechaRecuperacion==''){
      $('#fechaRecuperacion').addClass('invalid').removeClass('required');
      $('#fechaRecuperacion').parent().addClass('state-error').removeClass('state-success');
      validacion = true;
    }

    if(this.permisos.horaInicioRecuperacion === undefined || this.permisos.horaInicioRecuperacion == null || this.permisos.horaInicioRecuperacion==''){
      $('#horaDesdeRecuperacion').addClass('invalid').removeClass('required');
      $('#horaDesdeRecuperacion').parent().addClass('state-error').removeClass('state-success');
      validacion = true;
    }

    if(this.permisos.horaFinRecuperacion === undefined || this.permisos.horaFinRecuperacion == null || this.permisos.horaFinRecuperacion==''){
      $('#horaHastaRecuperacion').addClass('invalid').removeClass('required');
      $('#horaHastaRecuperacion').parent().addClass('state-error').removeClass('state-success');
      validacion = true;
    }*/

    return validacion;
  }

  public obtenerMotivo() {
    this.motivos = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Permiso.Motivo' === grupo.grupo);
  }

  onChangeFecha(value){
    this.fechaPermiso = value;
  }

  onChangeHoraInicio(value){
    this.horaDesdePermiso = value;
  }

  onChangeHoraFin(value){
    this.horaHastaPermiso = value;
  }

  onChangeFechaRecuperacion(value){
    this.fechaRecuperacion = value;
  }
  onChangeHoraInicioRecuperacion(value){
    this.horaDesdeRecuperacion = value;
  }

  onChangeHoraFinRecuperacion(value){
    this.horaHastaRecuperacion = value;
  }

}