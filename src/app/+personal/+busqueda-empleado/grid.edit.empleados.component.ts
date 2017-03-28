/**
 * Created by josediaz on 31/10/2016.
 */
import {Component, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import {ModalDirective} from "ng2-bootstrap";

import {ImportEmpleado} from "./importEmpleado";
import {SuccessEvent, FileRestrictions} from "@progress/kendo-angular-upload";
import {Adjunto} from "../+empleado/adjunto";
import {environment} from "../../../environments/environment";
import {ComponentBase} from "../../+common/service/componentBase";
import {BackendService} from "../../+rest/backend.service";

declare var $: any;


@Component({
    selector: 'kendo-grid-empleados-form',
    template: `
    <div bsModal #lgModal="bs-modal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel"
       aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" (click)="onClose()" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 class="modal-title">Importar Empleados</h4>
        </div>
        <div class="modal-body">
        
            <section class="col-12 text-center"> 
                <button (click)="descargarTemplateFormat()" class="btn btn-primary"><i class="fa fa-plus"></i>
                    Descargar Formato
                </button>
            </section>
       
          <form [formGroup]="editForm" class="smart-form" >
            
            <div class="row">
                
                 <section class="col col-md-12">
                  <label for="Nombre">Archivo</label>
                  <label class="input"> 
                        <kendo-upload [saveUrl]="uploadSaveUrl" [removeUrl]="uploadRemoveUrl" [multiple]="false"  [restrictions]="uploadValidation" (success)="onSuccessUpload($event)"></kendo-upload>
                  </label>
                 </section>
            </div>
          </form>
          
          </div>
               
          <div class="modal-footer">
            <button type="button" id="importCloseWnd" class="btn btn-default" (click)="onCancel($event)"> Cancelar
            </button>
          </div>
          
          </div>
    </div>
  </div>
    `
})
export class GridEditFormComponent extends ComponentBase{

    public uploadSaveUrl:string = this.urlUploadImportEmpleado;
    public uploadRemoveUrl:string = this.urlRemoveImportEmpleado;

    public uploadValidation:FileRestrictions = {allowedExtensions:[".xls",".xlsx"]};

    public importEmpleado: ImportEmpleado;
    editForm;
    contenidoArchivo: string;
    contentTypeArchivo:string;


    @Input()
    public set model(dto: ImportEmpleado) {
        this.importEmpleado = dto;
        dto === undefined ? this.lgModal.hide() : this.lgModal.show();
    }

    @Output() cancel: EventEmitter<any> = new EventEmitter();
    @Output() save: EventEmitter<any> = new EventEmitter();

    constructor(public backendService: BackendService) {
        super(backendService,'');
        this.contenidoArchivo = "";
        this.contentTypeArchivo = "";

        this.editForm = new FormGroup({
            'Archivo': new FormControl()
        })
    }

    public active: boolean = false;

    public titulo: string = "";

    public onSuccessUpload(event: SuccessEvent) {

        let file: Adjunto = event.response.json();

        let fileName:string = file.fileDocName;

        let url: string  = this.urlTemplateEmpleado;

        url = url + '?docname=' + fileName;

        if ($("#export_file").length > 0) {
            $("#export_file").remove();
        }
        if ($("#export_file").length === 0) {
            var el = document.createElement("iframe");
            document.body.appendChild(el);
            $(el).hide();
            $(el).attr("id", "export_file");
            $(el).attr("src", url);
        }


        $("#importCloseWnd").trigger("click");
    }

    public onSave(e): void {
        e.preventDefault();

        if (this.importEmpleado === undefined)
            this.importEmpleado = new ImportEmpleado(this.contenidoArchivo, '', '');
        else {
            this.importEmpleado.contenidoArchivo = this.contenidoArchivo;
            this.importEmpleado.tipoArchivo = this.contentTypeArchivo;
        }
        this.save.emit(this.importEmpleado);
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

    public importarArchivoEmpleados() {
        this.model = new ImportEmpleado();
        this.contenidoArchivo = "";
        this.contentTypeArchivo = "";
        this.active = true;
        this.lgModal.show();
    }

    @ViewChild('lgModal') public lgModal: ModalDirective;

    public showChildModal(): void {
        this.lgModal.show();
    }

    public hideChildModal(): void {
        this.lgModal.hide();
    }


    public descargarTemplateFormat() {
        let url:string = this.urlDowloadTemplateEmpleado;

        if ($("#export_file").length > 0) {
            $("#export_file").remove();
        }
        if ($("#export_file").length === 0) {
            var el = document.createElement("iframe");
            document.body.appendChild(el);
            $(el).hide();
            $(el).attr("id", "export_file");
            $(el).attr("src", url);
        }

    }
}