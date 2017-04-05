import { Component, Input,  Output, EventEmitter, ViewChild} from '@angular/core';

import {ModalDirective} from "ng2-bootstrap";
import {Calendario} from "../../+dto/maintenance/calendario";

declare var $: any;

@Component({
  selector: 'calendario-edit-dialog-form',
  template: `
        <kendo-dialog *ngIf="active" (close)="onClose()" >
    
            <kendo-dialog-titlebar style="background-color: #275b89;">
                {{titulo}}
            </kendo-dialog-titlebar>
        <div class="modal-body">
                <div class="smart-form" style="width: 900px;">
                
                  <div class="row">
                       <section class="col col-md-4">
                          <label class="control-label">Fecha</label>
                          <label class="input"> 
                                <input type="text" [(ngModel)]="fecha"/>
                          </label>
                       </section>
                  </div>
                  
                  <div class="row">
                      
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
export class CalendarioEditDialogFormComponent {

  //@Input() public calendarioEditDetail: CalendarioResult[];
  private active:boolean=false;

  public fecha: Date;

  @Input() public set model(dto: Calendario) {
    //dto === undefined ? this.lgModal.hide(): this.lgModal.show();
    if(this.fecha != null){
      dto === undefined ? this.active=false: this.active=true;
    }

  }

  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Output() save: EventEmitter<any> = new EventEmitter();

  errorMessage: string;
  public titulo:string="";
  
  constructor() {



  }




  public onSave(e): void {
    e.preventDefault();

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


  @ViewChild('lgModal') public lgModal:ModalDirective;

  public showChildModal():void {
    this.lgModal.show();
  }

  public hideChildModal():void {
    this.lgModal.hide();
  }

}