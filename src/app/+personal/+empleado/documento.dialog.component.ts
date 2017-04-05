import {Component, Input, Output, EventEmitter} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import {DocumentoEmpleado} from "../../+dto/maintenance/documentoEmpleado";
import {SuccessEvent, FileRestrictions} from "@progress/kendo-angular-upload";
import {Adjunto} from "./adjunto";
import {ComponentBase} from "../../+common/service/componentBase";
import {BackendService} from "../../+rest/backend.service";

declare var $: any;

@Component({
  selector: 'documento-dialog-form',
  template: `
        <kendo-dialog *ngIf="active" (close)="onClose()" >
    
            <kendo-dialog-titlebar>
                {{titulo}}
            </kendo-dialog-titlebar>
        <div class="modal-body">
            <div class="smart-form" style="width: 600px;">
                
                <div class="row">
                  <section class="col col-md-12">
                  <label>Nombre</label>
                  <label class="input"> 
                     <input type="text" id="nombreDocumento" [(ngModel)]="nombreDocumento" (keyup)="ingresaDocumento()" />
                  </label>
                  </section>
                </div>
                
                <div class="row">
                  <section class="col col-md-12">
                  <label for="Nombre">Archivo</label>
                  <label class="input"> 
                        <kendo-upload [saveUrl]="uploadSaveUrl" [multiple]="false" [restrictions]="uploadValidation" (success)="onSuccessUpload($event)"></kendo-upload>
                        <p style="color: red; font-size: 13px; margin-top: .5em;" *ngIf="!isValidUploadDocument" >Elige un archivo.</p>
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
export class DocumentoDialogFormComponent extends ComponentBase{

  private active:boolean=false;

  public uploadSaveUrl:string = this.urlUploadFile;
  public uploadRemoveUrl:string = this.urlRemoveFile;

  public uploadValidation:FileRestrictions = {allowedExtensions:[".doc",".docx",".pdf",".jpg",".png"]};

  public documentoEmpleado:DocumentoEmpleado;
  editForm;
  nombreDocumento:string;
  contenidoArchivo:string;
  nombreArchivo:string;
  contentTypeArchivo:string;

  public mensaje:string;

  @Input() public set model(dto: DocumentoEmpleado) {
    this.documentoEmpleado = dto;
    //dto === undefined ? this.lgModal.hide(): this.lgModal.show();
    dto === undefined ? this.active=false: this.active=true;
  }

  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Output() save: EventEmitter<any> = new EventEmitter();

  constructor(public backendService: BackendService) {
    super(backendService,'');

    this.nombreDocumento = "";
    this.contenidoArchivo = "";
    this.nombreArchivo = "";
    this.contentTypeArchivo = "";

    this.editForm = new FormGroup({
      'Nombre': new FormControl(),
      'Archivo': new FormControl()
    })
  }

  public titulo:string="";
  private isValidUploadDocument:boolean = true;

  public onSuccessUpload(event:SuccessEvent){
    this.isValidUploadDocument = true;
    let file: Adjunto = event.response.json();
    this.contenidoArchivo = file.content;
    this.nombreArchivo = file.name;
    this.contentTypeArchivo = file.contentType;
  }

  ingresaDocumento(){
    $('#nombreDocumento').parent().removeClass('state-error');
  }

  validarRequerido():boolean{
    let validacion = false;

    if(this.nombreDocumento === undefined || this.nombreDocumento == null || this.nombreDocumento==''){
      $('#nombreDocumento').addClass('invalid').removeClass('required');
      $('#nombreDocumento').parent().addClass('state-error').removeClass('state-success');
      this.isValidUploadDocument = false;
      validacion = true;
    }
    if(this.contenidoArchivo === undefined || this.contenidoArchivo == null || this.contenidoArchivo==''){
      this.isValidUploadDocument = false;
      validacion = true;
    }

    return validacion;
  }

  public onSave(e): void {
    //e.preventDefault();
    if(this.validarRequerido()){
      return;
    }
    /*if (this.documentoEmpleado === undefined)
      this.documentoEmpleado = new DocumentoEmpleado(undefined,this.nombreDocumento, this.contenidoArchivo,'','','PE');
    else {*/
      this.documentoEmpleado.nombre = this.nombreDocumento;
      this.documentoEmpleado.contenidoArchivo = this.contenidoArchivo;
      this.documentoEmpleado.nombreArchivo = this.nombreArchivo;
      this.documentoEmpleado.tipoArchivo = this.contentTypeArchivo;
      this.documentoEmpleado.tipoDocumento = 'PE';
    //}

    this.save.emit(this.documentoEmpleado);
    this.active = false;
  }
  public onCancel(e): void {
    //e.preventDefault();
    this.closeForm();
  }

  public onClose(): void {
    this.closeForm();
  }
  public closeForm(){
    this.active = false;
    this.cancel.emit();
  }


  public agregarDocumento() {
    this.model = new DocumentoEmpleado();
    this.nombreDocumento = "";
    this.contenidoArchivo = "";
    this.nombreArchivo = "";
    this.contentTypeArchivo = "";
    this.active = true;
  }



}