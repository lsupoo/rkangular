import {Component, Input, Output, EventEmitter} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import {SuccessEvent, FileRestrictions} from "@progress/kendo-angular-upload";
import {Adjunto} from "./adjunto";
import {ComponentBase} from "../../+common/service/componentBase";
import {BackendService} from "../../+rest/backend.service";

@Component({
  selector: 'foto-form',
  template:`

     <kendo-dialog *ngIf="active" (close)="onClose()" >
    
            <kendo-dialog-titlebar>
                {{titulo}}
            </kendo-dialog-titlebar>
        <div class="modal-body">
            <div class="smart-form" style="width: 600px;">
                
            <div class="row">
            
                 
                 <section class="col col-md-12">
                  <label for="Imagen">Imagen</label>
                  <label class="input"> 
                        <kendo-upload [saveUrl]="uploadSaveUrl" [removeUrl]="uploadRemoveUrl" [multiple]="false" [restrictions]="uploadValidation" (success)="onSuccessUpload($event)"></kendo-upload>
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
export class FotoFormComponent extends ComponentBase{


  public uploadSaveUrl:string = this.urlUploadFile;
  public uploadRemoveUrl:string = this.urlRemoveFile;

  public uploadValidation:FileRestrictions = {allowedExtensions:[".jpg",".png"], maxFileSize: 8388608};

  public file:Adjunto;
  editForm;


  @Input() public set model(dto: Adjunto) {
    this.file = dto;
    dto === undefined ? this.active=false: this.active=true;
  }

  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Output() save: EventEmitter<any> = new EventEmitter();

  constructor(public backendService: BackendService) {
    super(backendService,'');
    this.editForm = new FormGroup({
      'Imagen': new FormControl()
    })
  }

  public active: boolean = false;

  public titulo:string="Foto Empleado";

  public onSuccessUpload(event:SuccessEvent){

    this.file = event.response.json();
  }

  public onSave(e): void {
    e.preventDefault();

    this.save.emit(this.file);
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

  public subirImagen() {
    this.model = new Adjunto();
    this.active = true;
  }

}