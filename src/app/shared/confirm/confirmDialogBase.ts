import {Component, EventEmitter, Output, ViewChild, Input} from "@angular/core";
import {ModalDirective} from "ng2-bootstrap";
import {Licencia} from "../../+dto/maintenance/licencia";
/**
 * Created by oscar.castillo on 28/02/2017.
 */

@Component({
    selector: 'confirm-dialog-form',
    template: `

        
            <kendo-dialog *ngIf="active" (close)="onClose()" >
        
                <kendo-dialog-titlebar>
                    {{titulo}}
                </kendo-dialog-titlebar>
            <div class="modal-body">
                    <div class="smart-form">
                    
                    <div class="row">
                        <section class="col col-md-12">
                          <label class="control-label">¿Esta seguro que desea eliminar {{titulo}}?</label>
                          
                         </section>
                       
                    </div>
                    
                    </div>  
               </div>     
              <div class="modal-footer">
                <button type="button" class="btn btn-primary" (click)="onAccept($event)"> Si
                </button>
                <button type="button" class="btn btn-default" (click)="onCancel($event)"> No
                </button>
                
              </div>
        </kendo-dialog>
    

    `
})
export class ConfirmDialogComponent {
    public status = "open";
    public titulo = "";
    @Output() cancel: EventEmitter<any> = new EventEmitter();
    @Output() accept: EventEmitter<any> = new EventEmitter();


    private active: boolean = false;

    dataItem;

    @Input()
    public set model(dto: any) {
        this.dataItem = dto;
        dto === undefined ? this.active = false : this.active = true;
    }

    public onClose() {
        this.status = "closed";
        this.closeForm();
    }

    public onAccept(e) {
        e.preventDefault();
        this.status = "accepted";
        this.accept.emit(this.dataItem);
        this.active = false;

    }

    public onCancel(e) {
        e.preventDefault();
        this.status = "declined";
        this.closeForm();
    }

    public onShow() {
        this.active = true;
    }

    public closeForm() {
        this.active = false;
        this.cancel.emit();
    }
}
