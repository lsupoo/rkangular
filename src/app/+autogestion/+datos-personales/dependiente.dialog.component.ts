import { Component, Input,  Output, EventEmitter, ViewChild} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import {ModalDirective} from "ng2-bootstrap";
import {Dependiente} from "../../+dto/maintenance/dependiente";
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {NotificationsService} from "angular2-notifications/src/notifications.service";
import {StorageResult} from "../../+dto/storageResult";
import {ComponentBase} from "../../+common/service/componentBase";
import {BackendService} from "../../+rest/backend.service";

declare var $: any;

@Component({
  selector: 'dependiente-dialog-form',
  template: `
    <kendo-dialog *ngIf="active" (close)="onClose()" >
            <kendo-dialog-titlebar>
                {{tituloCabecera}}
            </kendo-dialog-titlebar>
        <div class="modal-body">
            <div class="smart-form" style="width: 900px;">
                
               <div class="row">
            
                <section class="col col-md-12">
                  <label>Nombre<span style="color: red">*</span></label>
                  <label class="input"> 
                        <input type="text" id="nombreDependiente" [(ngModel)]="nombreDependiente" (keyup)="ingresaNombre()"/>
                  </label>
                 </section>
              
                <section class="col col-md-6">
                  <label>Apellido Paterno<span style="color: red">*</span></label>
                  <label class="input"> 
                        <input type="text" id="apellidoPaternoDependiente" [(ngModel)]="apellidoPaternoDependiente" (keyup)="ingresaApelPaterno()"/>
                  </label>
                 </section>
                
                <section class="col col-md-6">
                  <label>Apellido Materno<span style="color: red">*</span></label>
                  <label class="input"> 
                        <input type="text" id="apellidoMaternoDependiente" [(ngModel)]="apellidoMaternoDependiente" (keyup)="ingresaApelMaterno()"/>
                  </label>
                 </section>
                 
                 <section class="col col-md-6">
                  <label>Tipo Documento</label>
                  <label class="input"> 
                        <kendo-dropdownlist id="tipoDocumentoDependiente" [data]="tiposDocumento" [(value)]="tipoDocumentoDependiente" [valuePrimitive]="true" [defaultItem]="defaultItem" [textField]="'nombre'" [valueField]="'codigo'" style="width: 100%;"></kendo-dropdownlist>
                  </label>
                 </section>
                
                <section class="col col-md-6">
                  <label>Numero Documento</label>
                  <label class="input"> 
                        <input type="text" id="numeroDocumentoDependiente" [(ngModel)]="numeroDocumentoDependiente"/>
                  </label>
                 </section>
             </div>    
             <div class="row">                   
                <section class="col col-md-6">
                  <label>Relacion<span style="color: red">*</span></label>
                  <label class="input"> 
                        <kendo-dropdownlist id="relacionDependiente" [data]="relacionesDependiente" [(value)]="relacionDependiente" [valuePrimitive]="true" [defaultItem]="defaultItem" [textField]="'nombre'" [valueField]="'codigo'" style="width: 100%;"></kendo-dropdownlist>
                  </label>
                 </section>
                 <section class="col col-md-6">
                  <label>Fecha Nacimiento</label>
                  <label class="input"> <i class="icon-append fa fa-calendar"></i>
                        <input type="text" id="idFechaNacimientoDependiente"
                            placeholder="Seleccionar una Fecha"
                            [textMask]="{mask: dateTimeMask,guide:false}"
                            [(ngModel)]="fechaNacimientoDepediente" 
                            (change)="onChangeDateNacimiento($event)"
                            (keyup)="keyUpLenghtInput($event)"
                            (ngModelChange)="onModelChangeDatePickerInput($event,'idFechaNacimientoDependiente')"
                            saUiDatepicker />
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
export class DependienteDialogFormComponent extends ComponentBase{

  public nombreDependiente:string;
  public apellidoPaternoDependiente:string;
  public apellidoMaternoDependiente:string;
  public tipoDocumentoDependiente:string;
  public nombreTipoDocumentoDependiente:string;
  public numeroDocumentoDependiente:string;
  public fechaNacimientoDepediente:string;
  public relacionDependiente:string;
  public nombreRelacionDepediente:string;

  public mensaje:string;
  public storageCommomnValueResult: StorageResult = new StorageResult();

  dataItem;
  editForm;
  @Input() public set model(dto: Dependiente) {
    this.dataItem = dto;
    dto === undefined ? this.active=false: this.active=true;
  }

  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Output() save: EventEmitter<any> = new EventEmitter();


  public tiposDocumento:TablaGeneralResult[];

  public relacionesDependiente:TablaGeneralResult[];
  errorMessage: string;

  private defaultItem:TablaGeneralResult = {codigo:null,nombre:'Seleccionar',grupo:null};
  
  constructor(private empleadoService:EmpleadoService, private _service: NotificationsService, public backendService: BackendService) {

    super(backendService, '');
    this.storageCommomnValueResult = JSON.parse(localStorage.getItem('localStorageCommonsValues'));
  }

  public active: boolean = false;

  public tituloCabecera:string="";
  public tituloBoton:string="";

  public onSave(e): void {
    e.preventDefault();

    for(var item in this.tiposDocumento){
      var data = this.tiposDocumento[item];
      if(this.tipoDocumentoDependiente===data.codigo){
        this.nombreTipoDocumentoDependiente = data.nombre;
        break;
      }
    }

    for(var item in this.relacionesDependiente){
      var data = this.relacionesDependiente[item];
      if(this.relacionDependiente===data.codigo){
        this.nombreRelacionDepediente = data.nombre;
        break;
      }
    }

    if (this.dataItem === undefined)
      this.dataItem = new Dependiente(undefined,this.nombreDependiente,this.apellidoPaternoDependiente,this.apellidoMaternoDependiente, this.relacionDependiente, this.tipoDocumentoDependiente,
                                      this.numeroDocumentoDependiente, this.fechaNacimientoDepediente,this.nombreRelacionDepediente, this.nombreTipoDocumentoDependiente);
    else {
      this.dataItem.nombre = this.nombreDependiente;
      this.dataItem.apellidoPaterno = this.apellidoPaternoDependiente;
      this.dataItem.apellidoMaterno = this.apellidoMaternoDependiente;
      this.dataItem.relacion = this.relacionDependiente;
      this.dataItem.tipoDocumento = this.tipoDocumentoDependiente;
      this.dataItem.numeroDocumento = this.numeroDocumentoDependiente;
      this.dataItem.fechaNacimiento = this.fechaNacimientoDepediente;
      this.dataItem.nombreRelacion = this.nombreRelacionDepediente;
      this.dataItem.nombreTipoDocumento = this.nombreTipoDocumentoDependiente;
    }

    if(this.validarRequerido()){
      this._service.error("Error", 'Ingrese los campos obligatorios.');
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

  public agregarDependiente() {

    this.obtenerTipoDocumento();
    this.obtenerRelacionDependiente();

    this.model = new Dependiente();
    this.nombreDependiente = "";
    this.apellidoPaternoDependiente = "";
    this.apellidoMaternoDependiente = "";
    this.relacionDependiente = null;
    this.tipoDocumentoDependiente = null;
    this.numeroDocumentoDependiente = "";
    this.fechaNacimientoDepediente = "";
    this.nombreRelacionDepediente = "";
    this.nombreTipoDocumentoDependiente = "";

    $('#nombreDependiente').parent().removeClass('state-error');
    $('#apellidoPaternoDependiente').parent().removeClass('state-error');
    $('#apellidoMaternoDependiente').parent().removeClass('state-error');
    $('#tipoDocumentoDependiente').parent().removeClass('state-error');
    $('#numeroDocumentoDependiente').parent().removeClass('state-error');
    $('#relacionDependiente').parent().removeClass('state-error');

    this.active = true;
  }

  ingresaNombre(){
    $('#nombreDependiente').removeClass('state-error');
  }
  ingresaApelPaterno(){
    $('#apellidoPaternoDependiente').removeClass('state-error');
  }
  ingresaApelMaterno(){
    $('#apellidoMaternoDependiente').removeClass('state-error');
  }

  validarRequerido():boolean{
    let validacion = false;

    if(this.nombreDependiente === undefined || this.nombreDependiente == null || this.nombreDependiente=='' ){
      $('#nombreDependiente').parent().addClass('state-error').removeClass('state-success');
      validacion = true;
    }
    if(this.apellidoPaternoDependiente === undefined || this.apellidoPaternoDependiente == null || this.apellidoPaternoDependiente==''){
      $('#apellidoPaternoDependiente').parent().addClass('state-error').removeClass('state-success');
      validacion = true;
    }
    if(this.apellidoMaternoDependiente === undefined || this.apellidoMaternoDependiente == null || this.apellidoMaternoDependiente==''){
      $('#apellidoMaternoDependiente').parent().addClass('state-error').removeClass('state-success');
      validacion = true;
    }
    if(this.relacionDependiente === undefined || this.relacionDependiente == null || this.relacionDependiente==''){
      $('#relacionDependiente').parent().addClass('state-error').removeClass('state-success');
      validacion = true;
    }

    return validacion;
  }

  public obtenerTipoDocumento() {
    this.tiposDocumento = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Empleado.TipoDocumento' === grupo.grupo);
  }

  public obtenerRelacionDependiente() {
    this.relacionesDependiente = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Empleado.RelacionDependiente' === grupo.grupo);
  }

  onChangeDateNacimiento(value){
    if(value.type == 'change'){
      return;
    }
    this.fechaNacimientoDepediente = value;
  }


}