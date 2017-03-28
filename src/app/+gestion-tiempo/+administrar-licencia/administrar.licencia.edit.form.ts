import {Component, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import {ModalDirective} from "ng2-bootstrap";

import {SuccessEvent, FileRestrictions} from "@progress/kendo-angular-upload";
import {environment} from "../../../environments/environment";
import {DocumentoEmpleado} from "../../+dto/maintenance/documentoEmpleado";
import {Adjunto} from "../../+personal/+empleado/adjunto";
import {ComponentBase} from "../../+common/service/componentBase";
import {BackendService} from "../../+rest/backend.service";

declare var $: any;

@Component({
    selector: 'administrar-licencia-edit-form',
    template:`
    <div bsModal #lgModal="bs-modal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel"
       aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" (click)="onClose()" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 class="modal-title">{{titulo}}</h4>
        </div>
        <div class="modal-body">
        
          <form [formGroup]="editForm" class="smart-form">
            
            <div class="row">
            
                <section class="col col-md-12">
                  <label for="Nombre">Nombre</label>
                  <label class="input"> 
                        <input type="text" id="documento" formControlName="Nombre" [(ngModel)]="nombreDocumento" (keyup)="ingresaDocumento()" />
                  </label>
                 </section>
                 
                 <section class="col col-md-12">
                  <label for="Nombre">Archivo</label>
                  <label class="input"> 

                        <kendo-upload [saveUrl]="uploadSaveUrl" [removeUrl]="uploadRemoveUrl" [multiple]="false" [restrictions]="uploadValidation" (success)="onSuccessUpload($event)"></kendo-upload>

                  </label>
                 </section>
            
            </div>
            
            <div id="dialog-message-documentos" [saJquiDialog]="{
								autoOpen: false,
								modal: true,
								resizable: false
							  }">
						<!-- dialog header // removing on compile-->
						<div data-dialog-title="">
							<div class="widget-header"><h4><i class="icon-ok"></i> Informacion</h4></div>
						</div>


						<p>
							{{mensaje}}
						</p>

						<div class="hr hr-12 hr-double"></div>

						<div data-dialog-buttons="">
							<button class="btn btn-primary" (click)="cerrarDialogDocumento()"><i class="fa fa-check"></i>&nbsp;OK</button>
						</div>

					</div>

            
          </form>
          
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
export class AdministrarLicenciaDocumentComponent extends ComponentBase{

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
        dto === undefined ? this.lgModal.hide(): this.lgModal.show();
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

    public active: boolean = false;

    public titulo:string="";

    public onSuccessUpload(event:SuccessEvent){
        let file: Adjunto = event.response.json();
        this.contenidoArchivo = file.content;
        this.nombreArchivo = file.name;
        this.contentTypeArchivo = file.contentType;
    }

    ingresaDocumento(){
        $('#documento').parent().removeClass('state-error');
    }

    validarRequerido():boolean{
        let validacion = false;

        if(this.nombreDocumento === undefined || this.nombreDocumento == null || this.nombreDocumento==''){
            $('#documento').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        return validacion;
    }

    public onSave(e): void {
        e.preventDefault();

        if (this.documentoEmpleado === undefined)
            this.documentoEmpleado = new DocumentoEmpleado(undefined,this.nombreDocumento, this.contenidoArchivo,'','','PE');
        else {
            this.documentoEmpleado.nombre = this.nombreDocumento;
            this.documentoEmpleado.contenidoArchivo = this.contenidoArchivo;
            this.documentoEmpleado.nombreArchivo = this.nombreArchivo;
            this.documentoEmpleado.tipoArchivo = this.contentTypeArchivo;
            this.documentoEmpleado.tipoDocumento = 'PE';
        }

        if(this.validarRequerido()){
            this.mensaje = 'Ingrese los campos obligatorios';
            $( '#dialog-message-documentos' ).dialog( "open" );
            return;
        }



        this.save.emit(this.documentoEmpleado);
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

    public agregarDocumento() {
        this.model = new DocumentoEmpleado();
        this.nombreDocumento = "";
        this.contenidoArchivo = "";
        this.nombreArchivo = "";
        this.contentTypeArchivo = "";
        $('#documento').parent().removeClass('state-error');
        this.active = true;
        this.lgModal.show();
    }

    @ViewChild('lgModal') public lgModal:ModalDirective;

    public showChildModal():void {
        this.lgModal.show();
    }

    public hideChildModal():void {
        this.lgModal.hide();
    }

    cerrarDialogDocumento(){
        this.mensaje = '';
        $( '#dialog-message-documentos' ).dialog( "close");

    }

}