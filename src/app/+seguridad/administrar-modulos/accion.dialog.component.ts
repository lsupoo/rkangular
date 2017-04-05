import { Component, Input,  Output, EventEmitter, ViewChild} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import {EmpleadoService} from '../../+common/service/empleado.service';

import {TablaGeneralResult} from '../../+dto/tablaGeneralResult';
import {EquipoEntregado} from "../../+dto/maintenance/equipoEntregado";
import {ModalDirective} from "ng2-bootstrap";
import {NotificationsService} from "angular2-notifications/src/notifications.service";
import {StorageResult} from "../../+dto/storageResult";
import {BandaSalarial} from "../../+dto/maintenance/bandaSalarial";
import {Moneda} from "../../+dto/maintenance/moneda";
import {Accion} from "../../+dto/maintenance/accion";

declare var $: any;

@Component({
  selector: 'accion-dialog-form',
  template: `
        <div bsModal #lgModal="bs-modal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" (click)="onClose()" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 class="modal-title">{{titulo}}</h4>
        </div>
        <div class="modal-body">
        
            <div class="smart-form">
            
            
            
            <div class="row">
                <section class="col col-md-4">
                  <label>Etiqueta Menu</label>
                  <label class="input"> 
                        <input type="text" [(ngModel)]="etiqueta"/>
                  </label>
                 </section>
              </div>  
          </div>
        
          </div>
               
          <div class="modal-footer">
            <button type="button" class="btn btn-default" (click)="onCancel($event)"> Cancelar
            </button>
            <button type="button" class="btn btn-primary" (click)="onSave($event)"> Guardar
            </button>
          </div>
          
          </div>
    </div>
  </div>
    `
})
export class AccionDialogFormComponent {

  public idModulo: number;
  public idAccion: number;
  public etiqueta: string;


  dataItem;
  @Input() public set model(dto: Accion) {
    this.dataItem = dto;
    dto === undefined ? this.lgModal.hide(): this.lgModal.show();
  }

  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Output() save: EventEmitter<any> = new EventEmitter();

  public storageCommomnValueResult: StorageResult = new StorageResult();
  
  constructor(private empleadoService:EmpleadoService,
              private _service: NotificationsService) {
    this.storageCommomnValueResult = JSON.parse(localStorage.getItem('localStorageCommonsValues'));
}

  public active: boolean = false;

  public titulo:string="";

  public onSave(e): void {
    e.preventDefault();

    if (this.dataItem === undefined)

      this.dataItem = new Accion();
    else {
      this.dataItem.idModulo = this.idModulo;
      this.dataItem.idAccion = this.idAccion;
      this.dataItem.etiqueta = this.etiqueta;
    }

    this.save.emit(this.dataItem);
    this.active = false;
    this.lgModal.hide();
  }

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


  @ViewChild('lgModal') public lgModal:ModalDirective;

  public showChildModal():void {
    this.lgModal.show();
  }

  public hideChildModal():void {
    this.lgModal.hide();
  }

}