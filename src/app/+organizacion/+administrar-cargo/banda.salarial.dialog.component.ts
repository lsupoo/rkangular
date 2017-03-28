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
import {GeneralTextMask} from "../../+common/Utils/generalTextMask";

declare var $: any;

@Component({
  selector: 'bandaSalarial-dialog-form',
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
                  <label>Moneda</label>
                  <label class="input"> 
                        <kendo-dropdownlist [data]="monedas" [(value)]="idMoneda" [valuePrimitive]="true" [defaultItem]="defaultItem" [textField]="'nombre'" [valueField]="'idMoneda'" style="width: 100%;"></kendo-dropdownlist>
                  </label>
                 </section>
            </div>
            
            <div class="row">
              
                <section class="col col-md-4">
                  <label>Limite Inferior</label>
                  <label class="input"> 
                        <input type="text" [(ngModel)]="limiteInferior" [textMask]="{mask: currencyMask,guide:false}"/>
                  </label>
                 </section>
                 
                 <section class="col col-md-4">
                  <label>Limite Medio</label>
                  <label class="input"> 
                        <input type="text" [(ngModel)]="limiteMedio" [textMask]="{mask: currencyMask,guide:false}"/>
                  </label>
                 </section>
                
                <section class="col col-md-4">
                  <label>Limite Superior</label>
                  <label class="input"> 
                        <input type="text" [(ngModel)]="limiteSuperior" [textMask]="{mask: currencyMask,guide:false}"/>
                  </label>
                 </section>
                
                
              </div>  
              <div class="row">   
                <section class="col col-md-4">
                  <label>Fecha Inicio Vigencia</label>
                  <label class="input"> <i class="icon-append fa fa-calendar"></i>
                        <input type="text" placeholder="Seleccionar una Fecha" [(ngModel)]="inicioVigencia" (change)="onChangeInicioVigencia($event)"
                               saUiDatepicker date-format="dd/mm/yy" readonly="readonly" />
                  </label>
                 </section>
                 <section class="col col-md-4">
                  <label>Fecha Fin Vigencia</label>
                  <label class="input"> <i class="icon-append fa fa-calendar"></i>
                        <input type="text" placeholder="Seleccionar una Fecha" [(ngModel)]="finVigencia" (change)="onChangeFinVigencia($event)"
                               saUiDatepicker date-format="dd/mm/yy" readonly="readonly" />
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
          
          </div>
    </div>
  </div>
    `
})
export class BandaSalarialDialogFormComponent {

  public idMoneda: number;
  public idCargo: number;
  public limiteSuperior: number;
  public limiteMedio: number;
  public limiteInferior: number;
  public nombreMoneda:string;
  public inicioVigencia:string;
  public finVigencia:string;
  public currencyMask = GeneralTextMask.currencyMask;

  dataItem;
  @Input() public set model(dto: BandaSalarial) {
    this.dataItem = dto;
    dto === undefined ? this.lgModal.hide(): this.lgModal.show();
  }

  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Output() save: EventEmitter<any> = new EventEmitter();

  public monedas: Moneda[]=[];

  errorMessage: string;

  public defaultItem:Moneda={idMoneda:null,nombre:'Seleccionar'};
  public storageCommomnValueResult: StorageResult = new StorageResult();
  
  constructor(private empleadoService:EmpleadoService,private _service: NotificationsService) {
    this.storageCommomnValueResult = JSON.parse(localStorage.getItem('localStorageCommonsValues'));

  }

  public active: boolean = false;

  public titulo:string="";

  public onSave(e): void {
    e.preventDefault();

    for(var item in this.monedas){
      var data = this.monedas[item];
      if(this.idMoneda===data.idMoneda){
        this.nombreMoneda = data.nombre;
        break;
      }
    }



    if (this.dataItem === undefined || this.dataItem.idBandaSalarial === undefined || this.dataItem.idBandaSalarial == null)

      this.dataItem = new BandaSalarial(undefined,undefined,this.idMoneda, this.limiteSuperior, this.limiteMedio, this.limiteInferior, this.nombreMoneda, this.inicioVigencia, this.finVigencia);
    else {
      this.dataItem.idMoneda = this.idMoneda;
      this.dataItem.limiteSuperior = this.limiteSuperior;
      this.dataItem.limiteMedio = this.limiteMedio;
      this.dataItem.limiteInferior = this.limiteInferior;
      this.dataItem.nombreMoneda = this.nombreMoneda;
      this.dataItem.inicioVigencia = this.inicioVigencia;
      this.dataItem.finVigencia = this.finVigencia;

    }

    this.save.emit(this.dataItem);
    this.lgModal.hide();
  }

  public onCancel(e): void {
    e.preventDefault();
    this.lgModal.hide();
    this.cancel.emit(undefined);
  }

  public onClose(): void {
    this.lgModal.hide();
    this.cancel.emit(undefined);
  }

  public agregarBandaSalarial() {

    this.obtenerMonedas();

    this.model = new BandaSalarial();

    this.idMoneda = undefined;
    //this.idCargo =null;
    this.limiteSuperior = undefined;
    this.limiteMedio = undefined;
    this.limiteInferior = undefined;
    this.nombreMoneda = "";
    this.inicioVigencia = "";
    this.finVigencia = "";

    this.lgModal.show();
  }

  public obtenerMonedas() {
    this.monedas = this.storageCommomnValueResult.moneda;
  }

  onChangeInicioVigencia(value){
    this.inicioVigencia = value;
  }

  onChangeFinVigencia(value){
    this.finVigencia = value;
  }

  @ViewChild('lgModal') public lgModal:ModalDirective;

  public showChildModal():void {
    this.lgModal.show();
  }

  public hideChildModal():void {
    this.lgModal.hide();
  }

}