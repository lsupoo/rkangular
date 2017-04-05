import { Component, Input,  Output, EventEmitter, ViewChild} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import {ModalDirective} from "ng2-bootstrap";
import {ExperienciaLaboral} from "../../+dto/maintenance/experienciaLaboral";
import {NotificationsService} from "angular2-notifications/src/notifications.service";
import {ComponentBase} from "../../+common/service/componentBase";
import {BackendService} from "../../+rest/backend.service";

declare var $: any;

@Component({
  selector: 'experiencialaboral-datos-personales-dialog-form',
  template: `
        <kendo-dialog *ngIf="active" (close)="onClose()" >
            <kendo-dialog-titlebar>
                {{titulo}}
            </kendo-dialog-titlebar>
        <div class="modal-body">
            <div class="smart-form" style="width: 900px;">
                
               <div class="row">
              
                <section class="col col-md-12">
                  <label>Empresa</label>
                  <label class="input"> 
                        <input type="text" id="empresa" [(ngModel)]="razonSocial" (keyup)="ingresaEmpresa()"/>
                  </label>
                 </section>
                
                <section class="col col-md-6">
                  <label>Departamento</label>
                  <label class="input"> 
                        <input type="text" id="departamento" [(ngModel)]="departamento" (keyup)="ingresaDepartamento()"/>
                  </label>
                 </section>
                
                <section class="col col-md-6">
                  <label>Cargo</label>
                  <label class="input"> 
                        <input type="text" id="cargo" [(ngModel)]="cargo" (keyup)="ingresaCargo()"/>
                  </label>
                 </section>
                <section class="col col-md-12">
                  <label>Descripcion</label>
                  <label class="input"> 
                        <input type="text" [(ngModel)]="descripcion"/>
                  </label>
                 </section>
                
                <section class="col col-md-4">
                  <label>Fecha Inicio</label>
                  <label class="input"> <i class="icon-append fa fa-calendar"></i>
                        <input type="text" id="fechaInicioExperiencia" 
                            [textMask]="{mask: dateTimeMask,guide:false}"
                            placeholder="Seleccionar una Fecha" 
                            [(ngModel)]="fechaInicio" 
                            (change)="onChangeDateInicio($event)"
                            (keyup)="keyUpLenghtInput($event)"
                            (ngModelChange)="onModelChangeDatePickerInput($event,'fechaInicioExperiencia')"
                            saUiDatepicker />
                  </label>
                 </section>
                 <section class="col col-md-4">
                  <label>Fecha Fin</label>
                  <label class="input"> <i class="icon-append fa fa-calendar"></i>
                        <input type="text" id="fechaFinExperiencia" 
                            [textMask]="{mask: dateTimeMask,guide:false}"
                            placeholder="Seleccionar una Fecha" 
                            [(ngModel)]="fechaFin" 
                            (change)="onChangeDateFin($event)"
                            (keyup)="keyUpLenghtInput($event)"
                            (ngModelChange)="onModelChangeDatePickerInput($event,'fechaFinExperiencia')"
                               saUiDatepicker/>
                  </label>
                 </section>
                
              </div>
             
            </div>  
           </div>     
          <div class="modal-footer">
			<button type="button" class="btn btn-default" (click)="onCancel($event)"> Cancelar
            </button>
            <button type="button" class="btn btn-primary" (click)="onSave($event)"> {{tituloBoton}}
            </button>
          </div>
    </kendo-dialog>
    `
})
export class ExperienciaLaboralDatosPersonalesDialogFormComponent extends ComponentBase{

  public razonSocial:string;
  public departamento:string;
  public cargo:string;
  public fechaInicio:string;
  public fechaFin:string;
  public descripcion:string;

  dataItem;
  editForm;
  @Input() public set model(dto: ExperienciaLaboral) {
    this.dataItem = dto;
    dto === undefined ? this.active=false: this.active=true;
  }

  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Output() save: EventEmitter<any> = new EventEmitter();


  constructor(public backendService: BackendService) {
    super(backendService, '');
  }

  public active: boolean = false;

  public titulo:string="";
  public tituloBoton:string="";

  public mensaje:string;

  public onSave(e): void {
    e.preventDefault();

    if (this.dataItem === undefined)
      this.dataItem = new ExperienciaLaboral(undefined,this.razonSocial,this.departamento,this.cargo, this.descripcion, this.fechaInicio,this.fechaFin);
    else {
      this.dataItem.razonSocial = this.razonSocial;
      this.dataItem.departamento = this.departamento;
      this.dataItem.cargo = this.cargo;
      this.dataItem.descripcion = this.descripcion;
      this.dataItem.fechaInicio = this.fechaInicio;
      this.dataItem.fechaFin = this.fechaFin;

    }

    //validar
    if(this.validarRequerido()){
      return;
    }

    this.save.emit(this.dataItem);
    this.active = false;
  }

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

  public agregarExperienciaLaboral() {
    this.model = new ExperienciaLaboral();
    this.razonSocial = "";
    this.departamento = "";
    this.cargo = "";
    this.descripcion = "";
    this.fechaInicio = "";
    this.fechaFin = "";

    $('#empresa').parent().removeClass('state-error');
    $('#departamento').parent().removeClass('state-error');
    $('#cargo').parent().removeClass('state-error');
    $('#fechaInicioExperiencia').parent().removeClass('state-error');

    this.active= true;
  }

  onChangeDateInicio(value){

    if(value.type == 'change'){
      return;
    }
    this.fechaInicio = value;
    $('#fechaInicio').parent().removeClass('state-error');
  }

  onChangeDateFin(value){
    if(value.type == 'change'){
      return;
    }

    this.fechaFin = value;

  }

  ingresaEmpresa(){
    $('#empresa').parent().removeClass('state-error');
  }

  ingresaDepartamento(){
    $('#departamento').parent().removeClass('state-error');
  }

  ingresaCargo(){
    $('#cargo').parent().removeClass('state-error');
  }

  validarRequerido():boolean{
    let validacion = false;

    if(this.razonSocial === undefined || this.razonSocial == null || this.razonSocial=='' ){
      $('#empresa').parent().addClass('state-error').removeClass('state-success');
      validacion = true;
    }
    if(this.departamento === undefined || this.departamento == null || this.departamento==''){
      $('#departamento').parent().addClass('state-error').removeClass('state-success');
      validacion = true;
    }

    if(this.cargo === undefined || this.cargo == null || this.cargo==''){
      $('#cargo').parent().addClass('state-error').removeClass('state-success');
      validacion = true;
    }

    if(this.fechaInicio === undefined || this.fechaInicio == null || this.fechaInicio==''){
      $('#fechaInicioExperiencia').parent().addClass('state-error').removeClass('state-success');
      validacion = true;
    }

    return validacion;
  }

}