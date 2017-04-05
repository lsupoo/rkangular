import { Component, Input,  Output, EventEmitter, ViewChild} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import {EmpleadoService} from '../../+common/service/empleado.service';

import {TablaGeneralResult} from '../../+dto/tablaGeneralResult';
import {Educacion} from "../../+dto/maintenance/educacion";

import {ModalDirective} from "ng2-bootstrap";
import {NotificationsService} from "angular2-notifications/src/notifications.service";
import {StorageResult} from "../../+dto/storageResult";
import {Message} from "primeng/components/common/api";

declare var $: any;

@Component({
  selector: 'educacion-dialog-form',
  template: `
    
    <kendo-dialog *ngIf="active" (close)="onClose()" >
    
            <kendo-dialog-titlebar>
                {{tituloCabecera}}
            </kendo-dialog-titlebar>
        <div class="modal-body">
            <div class="smart-form" style="width: 900px;">
                
               <div class="row">
              
                <section class="col col-md-6">
                  <label>Nivel Educacion<span style="color: red">*</span></label>
                  <label class="input"> 
                        <kendo-dropdownlist id="nivelEducacion" [data]="nivelesEducacion" [(value)]="nivelEducacion" [valuePrimitive]="true" [defaultItem]="defaultItem" [textField]="'nombre'" [valueField]="'codigo'" style="width: 100%;"></kendo-dropdownlist>
                  </label>
                 </section>
                
                <section class="col col-md-6">
                  <label>Institucion<span style="color: red">*</span></label>
                  <label class="input"> 
                        <input type="text" id="institucion" [(ngModel)]="institucion" (keyup)="ingresaInstitucion()"/>
                  </label>
                 </section>
                
                <section class="col col-md-12">
                  <label>Titulo</label>
                  <label class="input"> 
                        <input type="text" [(ngModel)]="titulo"/>
                  </label>
                 </section>
                <section class="col col-md-12">
                  <label>Descripcion</label>
                  <label class="input"> 
                        <input type="text" [(ngModel)]="descripcion"/>
                  </label>
                 </section>
                
                <section class="col col-md-4">
                  <label>Fecha Inicio<span style="color: red">*</span></label>
                  <label class="input"> <i class="icon-append fa fa-calendar"></i>
                        <input type="text" id="fechaInicio" placeholder="Seleccionar una Fecha" [(ngModel)]="fechaInicio" (change)="onChangeDateInicio($event)"
                               saUiDatepicker date-format="dd/mm/yy" />
                  </label>
                 </section>
                 <section class="col col-md-4">
                  <label>Fecha Fin</label>
                  <label class="input"> <i class="icon-append fa fa-calendar"></i>
                        <input type="text" placeholder="Seleccionar una Fecha" [(ngModel)]="fechaFin" (change)="onChangeDateFin($event)"
                               saUiDatepicker date-format="dd/mm/yy" />
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
export class EducacionDialogFormComponent {

  public nivelEducacion:string;
  public nombreNivelEducacion:string;
  public institucion:string;
  public fechaInicio:string;
  public fechaFin:string;
  public titulo:string;
  public descripcion:string;

  public mensaje:string;

  public mostrarAlertaEducacion:boolean=false;

  dataItem;
  editForm;
  @Input() public set model(dto: Educacion) {
    this.dataItem = dto;
    dto === undefined ? this.active=false: this.active=true;
  }

  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Output() save: EventEmitter<any> = new EventEmitter();

  public nivelesEducacion:TablaGeneralResult[];
  errorMessage: string;

  public defaultItem:TablaGeneralResult={codigo:null,nombre:'Seleccionar', grupo:null};
  public storageCommomnValueResult: StorageResult = new StorageResult();
  
  constructor(private empleadoService:EmpleadoService,private _service: NotificationsService) {
    this.storageCommomnValueResult = JSON.parse(localStorage.getItem('localStorageCommonsValues'));

  }

  public active: boolean = false;

  public tituloCabecera:string="";
  public tituloBoton:string="";

  private msgs: Message[] = [];

  public onSave(e): void {
    e.preventDefault();

    this.mostrarAlertaEducacion=false;

    for(var item in this.nivelesEducacion){
      var data = this.nivelesEducacion[item];
      if(this.nivelEducacion===data.codigo){
        this.nombreNivelEducacion = data.nombre;
        break;
      }
    }

    if (this.dataItem === undefined)
      this.dataItem = new Educacion(undefined,this.nivelEducacion,this.institucion,this.titulo, this.descripcion, this.fechaInicio,this.fechaFin, this.nombreNivelEducacion);
    else {
      this.dataItem.nivelEducacion = this.nivelEducacion;
      this.dataItem.institucion = this.institucion;
      this.dataItem.titulo = this.titulo;
      this.dataItem.descripcion = this.descripcion;
      this.dataItem.fechaInicio = this.fechaInicio;
      this.dataItem.fechaFin = this.fechaFin;
      this.dataItem.nombreNivelEducacion = this.nombreNivelEducacion;

    }

    if(this.validarRequerido()){
      this.msgs.push({severity: 'error', summary: 'Runakuna Error', detail:'Ingrese los campos obligatorios.'});
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

  public agregarEducacion() {
    this.obtenerNivelEducacion();
    this.model = new Educacion();
    this.nivelEducacion = null;
    this.institucion = "";
    this.titulo = "";
    this.descripcion = "";
    this.fechaInicio = "";
    this.fechaFin = "";
    this.nombreNivelEducacion = "";

    $('#empresa').parent().removeClass('state-error');
    $('#departamento').parent().removeClass('state-error');
    $('#fechaInicio').parent().removeClass('state-error');

    this.active = true;
  }

  ingresaInstitucion(){
    $('#institucion').removeClass('state-error');
    $('#institucion').parent().removeClass('state-error');
  }

  validarRequerido():boolean{
    let validacion = false;

    if(this.nivelEducacion === undefined || this.nivelEducacion == null || this.nivelEducacion=='' ){
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
    }

    return validacion;
  }

  public obtenerNivelEducacion() {
    this.nivelesEducacion = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Empleado.NivelEducacion' === grupo.grupo);
  }

  onChangeDateInicio(value){
    this.fechaInicio = value;
    $('#fechaInicio').removeClass('state-error');
    $('#fechaInicio').parent().removeClass('state-error');

  }

  onChangeDateFin(value){
    this.fechaFin = value;

  }

}