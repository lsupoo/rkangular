import { Component, Input,  Output, EventEmitter, ViewChild} from '@angular/core';
import {EmpleadoService} from '../../+common/service/empleado.service';

import {ModalDirective} from "ng2-bootstrap";
import {NotificationsService} from "angular2-notifications/src/notifications.service";
import {StorageResult} from "../../+dto/storageResult";
import {Moneda} from "../../+dto/maintenance/moneda";
import {DepartamentoArea} from "../../+dto/maintenance/departamentoArea";
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {CompleterData, CompleterService} from "ng2-completer";
import {environment} from "../../../environments/environment";
import {ComponentBase} from "../../+common/service/componentBase";
import {Http} from "@angular/http";
import {BackendService} from "../../+rest/backend.service";

declare var $: any;

@Component({
  selector: 'departamentoArea-dialog-form',
  template: `
        <kendo-dialog *ngIf="active" (close)="onClose()">
    
            <kendo-dialog-titlebar>
                {{titulo}}
            </kendo-dialog-titlebar>
        <div class="modal-body">
                <div class="smart-form" style="width: 900px;">
                
                <div class="row">
                    <section class="col col-md-4">
                      <label class="control-label">Nombre</label>
                      <label class="input"> 
                            <input type="text" [(ngModel)]="nombre"/>
                      </label>
                     </section>
                    <section class="col col-md-4">
                      <label>Estado</label>
                      <label class="input"> 
                            <kendo-dropdownlist [data]="estados" [(value)]="estado" [valuePrimitive]="true" [defaultItem]="defaultItemEstado" [textField]="'nombre'" [valueField]="'codigo'" style="width: 100%;"></kendo-dropdownlist>
                      </label>
                     </section> 
                </div>
                
                <div class="row">
                    <section class="col col-md-4">
                      <label>Jefe</label>
                      <label class="input"> 
                            <i class="icon-append fa fa-search"></i>
                            <ng2-completer [(ngModel)]="jefe" [dataService]="dataServiceJefeDptoArea" [minSearchLength]="0" (selected)="selectJefeDptoArea($event)"></ng2-completer>
                      </label>
                     </section>
                    <section class="col col-md-4">
                      <label>Jefe No Disponible</label>
                      <label class="select"> 
                            <input type="checkbox" [(ngModel)]="jefeNoDisponible"/>
                      </label>
                     </section>
                      <section class="col col-md-4">
                      <label>Jefe Reemplazo</label>
                      <label class="input"> 
                            <i class="icon-append fa fa-search"></i>
                            <ng2-completer [(ngModel)]="jefeReemplazo" [dataService]="dataServiceJefeReemplazoDptoArea" [minSearchLength]="0" (selected)="selectJefeReemplazoDptoArea($event)"></ng2-completer>
                      </label>
                     </section> 
                </div>
             
              </div>  
           </div>     
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" (click)="onSave($event)"> Agregar
            </button>
            <button type="button" class="btn btn-default" (click)="onCancel($event)"> Cancelar
            </button>
          </div>
          
  </kendo-dialog>
    `
})
export class DepartamentoAreaDialogFormComponent extends ComponentBase{

  //agrega
  private active:boolean=false;

  localhost:  String = environment.backend;
  port: String = environment.port;

  public defaultItemEstado:TablaGeneralResult={codigo:null,nombre:'Seleccionar',grupo:null};
  public estados: TablaGeneralResult[]=[];

  public nombre: string;
  public estado: string;
  public jefe:string;
  public idJefe:number;
  public jefeReemplazo:string;
  public idJefeReemplazo:number;
  public jefeNoDisponible:boolean=false;

  public nombreEstado:string;

  private dataServiceJefeDptoArea:CompleterData;
  private dataServiceJefeReemplazoDptoArea:CompleterData;


  dataItemDepartamentoArea;
  @Input() public set model(dto: DepartamentoArea) {
    this.dataItemDepartamentoArea = dto;
    //dto === undefined ? this.lgModal.hide(): this.lgModal.show();
    dto === undefined ? this.active=false: this.active=true;
  }

  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Output() save: EventEmitter<any> = new EventEmitter();

  errorMessage: string;

  public defaultItem:Moneda={idMoneda:null,nombre:'Seleccionar'};
  public storageCommomnValueResult: StorageResult = new StorageResult();
  
  constructor(private empleadoService:EmpleadoService,private _service: NotificationsService,
              private completerService:CompleterService,public backendService: BackendService) {
    super(backendService,'OR001');
    this.storageCommomnValueResult = JSON.parse(localStorage.getItem('localStorageCommonsValues'));

  }

  public titulo:string="";

  selectJefeDptoArea(e){
    if(e !=null)
      this.idJefe = e.originalObject.idEmpleado;
    else
      this.idJefe = null;
  }

  selectJefeReemplazoDptoArea(e){
    if(e !=null)
      this.idJefeReemplazo = e.originalObject.idEmpleado;
    else
      this.idJefeReemplazo = null;
  }

  public onSave(e): void {
    e.preventDefault();

    for(var item in this.estados){
      var data = this.estados[item];
      if(this.estado===data.codigo){
        this.nombreEstado = data.nombre;
        break;
      }
    }

    if (this.dataItemDepartamentoArea === undefined || this.dataItemDepartamentoArea.idDepartamentoArea === undefined || this.dataItemDepartamentoArea.idDepartamentoArea == null)

      this.dataItemDepartamentoArea = new DepartamentoArea(undefined,undefined,this.nombre, this.estado, this.nombreEstado, this.idJefe,this.idJefeReemplazo,this.jefe, this.jefeNoDisponible, this.jefeReemplazo);
    else {
      this.dataItemDepartamentoArea.nombre = this.nombre;
      this.dataItemDepartamentoArea.estado = this.estado;
      this.dataItemDepartamentoArea.nombreEstado = this.nombreEstado;
      this.dataItemDepartamentoArea.idJefe = this.idJefe;
      this.dataItemDepartamentoArea.idJefeReemplazo = this.idJefeReemplazo;
      this.dataItemDepartamentoArea.jefe = this.jefe;
      this.dataItemDepartamentoArea.jefeReemplazo = this.jefeReemplazo;
      this.dataItemDepartamentoArea.jefeNoDisponible = this.jefeNoDisponible;

    }

    this.save.emit(this.dataItemDepartamentoArea);
    //this.lgModal.hide();
    this.active = false;
  }

  public onCancel(e): void {
    e.preventDefault();
    //this.lgModal.hide();
    //this.cancel.emit(undefined);
    this.closeForm();
  }

  public onClose(): void {
    this.closeForm();
  }

  public agregarDepartamentoArea() {

    this.obtenerEstados();
    this.cargarAutocomplete();

    this.model = new DepartamentoArea();

    this.nombre = undefined;
    this.estado = undefined;
    this.nombreEstado = undefined;
    this.idJefe = undefined;
    this.idJefeReemplazo = undefined;
    this.jefe = undefined;
    this.jefeReemplazo = undefined;
    this.jefeNoDisponible = false;

    this.active = true;
    //this.lgModal.show();
  }

  public closeForm(){
    this.active = false;
    this.cancel.emit();
  }

  public obtenerEstados() {
    this.estados = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Estado' === grupo.grupo);
  }

  public cargarAutocomplete() {
    this.dataServiceJefeDptoArea = this.completerService.remote(this.urlAutocompleteEmpleado,'nombreEmpleado','nombreEmpleado');
    this.dataServiceJefeReemplazoDptoArea = this.completerService.remote(this.urlAutocompleteEmpleado,'nombreEmpleado','nombreEmpleado');
  }

  @ViewChild('lgModal') public lgModal:ModalDirective;

  public showChildModal():void {
    this.lgModal.show();
  }

  public hideChildModal():void {
    this.lgModal.hide();
  }

}