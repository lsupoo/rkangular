import { Component, Input,  Output, EventEmitter, ViewChild} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import {EmpleadoService} from '../../+common/service/empleado.service';

import {TablaGeneralResult} from '../../+dto/tablaGeneralResult';
import {EquipoEntregado} from "../../+dto/maintenance/equipoEntregado";
import {ModalDirective} from "ng2-bootstrap";
import {NotificationsService} from "angular2-notifications/src/notifications.service";
import {StorageResult} from "../../+dto/storageResult";

declare var $: any;

@Component({
  selector: 'equipoentregado-dialog-form',
  template: `
    <kendo-dialog *ngIf="active" (close)="onClose()" >
    
            <kendo-dialog-titlebar>
                {{titulo}}
            </kendo-dialog-titlebar>
        <div class="modal-body">
            <div class="smart-form" style="width: 900px;">
                
               <div class="row">
              
                <section class="col col-md-6">
                  <label>Tipo Equipo<span style="color: red">*</span></label>
                  <label class="input"> 
                        <kendo-dropdownlist id="tipoEquipo" [data]="tiposEquipo" [(value)]="tipoEquipo" [valuePrimitive]="true" [defaultItem]="defaultItem" [textField]="'nombre'" [valueField]="'codigo'" style="width: 100%;"></kendo-dropdownlist>
                  </label>
                 </section>
                
                <section class="col col-md-6">
                  <label>Estado<span style="color: red">*</span></label>
                  <label class="input"> 
                        <kendo-dropdownlist id="equipoEstado" [data]="estados" [(value)]="estado" [valuePrimitive]="true" [defaultItem]="defaultItem" [textField]="'nombre'" [valueField]="'codigo'" style="width: 100%;"></kendo-dropdownlist>
                  </label>
                 </section>
                
                <section class="col col-md-12">
                  <label>Descripcion<span style="color: red">*</span></label>
                  <label class="input"> 
                        <input type="text" id="descripcion" [(ngModel)]="descripcion" (keyup)="ingresaDescripcion()"/>
                  </label>
                 </section>
                
                <section class="col col-md-4">
                  <label>Fecha Entrega<span style="color: red">*</span></label>
                  <label class="input"> <i class="icon-append fa fa-calendar"></i>
                        <input type="text" id="fechaEntrega" placeholder="Seleccionar una Fecha" [(ngModel)]="fechaEntrega" (change)="onChangeDateInicio($event)"
                               saUiDatepicker date-format="dd/mm/yy" />
                  </label>
                 </section>
                 <section class="col col-md-4">
                  <label>Fecha Devolucion</label>
                  <label class="input"> <i class="icon-append fa fa-calendar"></i>
                        <input type="text" placeholder="Seleccionar una Fecha" [(ngModel)]="fechaDevolucion" (change)="onChangeDateFin($event)"
                               saUiDatepicker date-format="dd/mm/yy" />
                  </label>
                 </section>
                
              </div>
             
            </div>  
           </div>     
          <div class="modal-footer">
			<button type="button" class="btn btn-default" (click)="onCancel($event)"> Cancelar
            </button>
            <button type="button" class="btn btn-primary" (click)="onSave($event)"> Agregar
            </button>
          </div>
    </kendo-dialog>
    `
})
export class EquipoEntregadoDialogFormComponent {

  public tipoEquipo:string;
  public nombreTipoEquipo:string;
  public estado:string;
  public fechaEntrega:string;
  public fechaDevolucion:string;
  public nombreEstado:string;
  public descripcion:string;

  public mensaje:string;

  public mostrarAlertaEquipo:boolean=false;

  dataItem;
  editForm;
  @Input() public set model(dto: EquipoEntregado) {
    this.dataItem = dto;
    dto === undefined ? this.active=false: this.active=true;
  }

  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Output() save: EventEmitter<any> = new EventEmitter();


  public tiposEquipo:TablaGeneralResult[];
  public estados:TablaGeneralResult[];
  errorMessage: string;

  public defaultItem:TablaGeneralResult={codigo:null,nombre:'Seleccionar', grupo:null};
  public storageCommomnValueResult: StorageResult = new StorageResult();
  
  constructor(private empleadoService:EmpleadoService,private _service: NotificationsService) {
    this.storageCommomnValueResult = JSON.parse(localStorage.getItem('localStorageCommonsValues'));

  }

  public active: boolean = false;

  public titulo:string="";
  public tituloBoton:string="";

  public onSave(e): void {
    e.preventDefault();
    this.mostrarAlertaEquipo = false;

    for(var item in this.tiposEquipo){
      var data = this.tiposEquipo[item];
      if(this.tipoEquipo===data.codigo){
        this.nombreTipoEquipo = data.nombre;
        break;
      }
    }

    for(var item in this.estados){
      var data = this.estados[item];
      if(this.estado===data.codigo){
        this.nombreEstado = data.nombre;
        break;
      }
    }

    if (this.dataItem === undefined)
      this.dataItem = new EquipoEntregado(undefined,this.tipoEquipo,this.estado, this.descripcion, this.nombreTipoEquipo,this.nombreEstado, this.fechaEntrega, this.fechaDevolucion);
    else {
      this.dataItem.tipoEquipo = this.tipoEquipo;
      this.dataItem.estado = this.estado;
      this.dataItem.nombreTipoEquipo = this.nombreTipoEquipo;
      this.dataItem.nombreEstado = this.nombreEstado;
      this.dataItem.fechaEntrega = this.fechaEntrega;
      this.dataItem.fechaDevolucion = this.fechaDevolucion;
      this.dataItem.descripcion = this.descripcion;

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

  public closeAlertEquipo(value){
    this.mostrarAlertaEquipo = false;
  }

  public agregarEquipoEntregado() {
    this.obtenerTipoEquipo();
    this.obtenerEstadoTipoEquipo();
    this.model = new EquipoEntregado();
    this.tipoEquipo = null;
    this.estado = null;
    this.nombreTipoEquipo = "";
    this.nombreEstado = "";
    this.fechaEntrega = "";
    this.fechaDevolucion = "";

    $('#tipoEquipo').parent().removeClass('state-error');
    $('#equipoEstado').parent().removeClass('state-error');
    $('#descripcion').parent().removeClass('state-error');
    $('#fechaEntrega').parent().removeClass('state-error');

    this.active = true;
  }

  public obtenerTipoEquipo() {
    this.tiposEquipo = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'EquiposEntregados.TipoEquipo' === grupo.grupo);
  }

  public obtenerEstadoTipoEquipo() {
    this.estados = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'EquiposEntregados.Estado' === grupo.grupo);
  }

  onChangeDateInicio(value){
    this.fechaEntrega = value;
    $('#fechaEntrega').removeClass('state-error');
    $('#fechaEntrega').parent().removeClass('state-error');

  }

  onChangeDateFin(value){
    this.fechaDevolucion = value;

  }

  ingresaDescripcion(){
    $('#descripcion').removeClass('state-error');
    $('#descripcion').parent().removeClass('state-error');
  }

  validarRequerido():boolean{
    let validacion = false;

    if(this.tipoEquipo === undefined || this.tipoEquipo == null || this.tipoEquipo=='' ){
      $('#tipoEquipo').addClass('invalid').removeClass('required');
      $('#tipoEquipo').parent().addClass('state-error').removeClass('state-success');
      validacion = true;
    }
    if(this.estado === undefined || this.estado == null || this.estado==''){
      $('#equipoEstado').addClass('invalid').removeClass('required');
      $('#equipoEstado').parent().addClass('state-error').removeClass('state-success');
      validacion = true;
    }

    if(this.descripcion === undefined || this.descripcion == null || this.descripcion==''){
      $('#descripcion').addClass('invalid').removeClass('required');
      $('#descripcion').parent().addClass('state-error').removeClass('state-success');
      validacion = true;
    }

    if(this.fechaEntrega === undefined || this.fechaEntrega == null || this.fechaEntrega==''){
      $('#fechaEntrega').addClass('invalid').removeClass('required');
      $('#fechaEntrega').parent().addClass('state-error').removeClass('state-success');
      validacion = true;
    }

    return validacion;
  }

}