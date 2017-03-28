import {Component, EventEmitter, Output, ViewChild, Input} from "@angular/core";
import {environment} from "../../../environments/environment";
import {ModalDirective} from "ng2-bootstrap";
import {HorasExtra} from "../../+dto/maintenance/horasExtra";

/**
 * Created by oscar.castillo on 28/02/2017.
 */
declare var $: any;
@Component({
    selector: 'motivo-rechazohorasextra-form',
    template: `
        <kendo-dialog *ngIf="active" (close)="onClose()" >
    
            <kendo-dialog-titlebar style="background-color: #E5702A;">
                {{titulo}}
            </kendo-dialog-titlebar>
        <div class="modal-body">
                <div class="smart-form">
                
                <div class="row">
                    <section class="col col-md-12">
                      <label class="control-label">Ingrese Motivo de Denegacion</label>
                      <label class="input"> 
                            <input type="text" id="motivo" [(ngModel)]="motivo" />
                      </label>
                     </section>
                     
                   
                </div>
                
                </div>  
           </div>     
          <div class="modal-footer">
            <button type="button" class="btn btn-lg bg-color-orange txt-color-white" (click)="onAccept($event)"> Denegar
            </button>
            <button type="button" class="btn btn-default" (click)="onCancel($event)"> Cancelar
            </button>
            
          </div>
    </kendo-dialog>
    `
})
export class MotivoRechazoHorasExtraComponent  {

    public titulo ="";
    @Output() cancel: EventEmitter<any> = new EventEmitter();
    @Output() save: EventEmitter<any> = new EventEmitter();
    private active:boolean=false;
    localhost:  String = environment.backend;
    port: String = environment.port;
    public motivo: String;
    public mensaje:string;

    dataItem;
    @Input() public set model(dto: HorasExtra) {
        this.dataItem= dto;
        dto === undefined ? this.active=false: this.active=true;
    }

    public onClose() {
        this.closeForm();
    }
    public onAccept(e) {
        e.preventDefault();
        if(this.validarRequerido()){
            this.mensaje = 'Ingrese los campos obligatorios';
            //$( '#dialog-message-documentos' ).dialog( "open" );
            return;
        }
        this.dataItem.comentarioResolucion=this.motivo;
        this.save.emit(this.dataItem);
        this.active = false;

    }
    public onCancel(e) {
        e.preventDefault();
        this.closeForm();
    }

    @ViewChild('lgModal') public lgModal:ModalDirective;

    public onShow(){
        this.active=true;
    }

    public showChildModal():void {
        this.lgModal.show();
    }

    public hideChildModal():void {
        this.lgModal.hide();
    }
    public closeForm(){
        this.active = false;
        this.cancel.emit();
    }

    validarRequerido():boolean {
        let validacion = false;

        if(this.motivo === undefined || this.motivo == null || this.motivo==''){
            $('#motivo').addClass('invalid').removeClass('required');
            $('#motivo').parent().addClass('state-error').removeClass('state-success');
            validacion = true;


        }

        return validacion;
    }
}
