import {Component, EventEmitter, Output, ViewChild, Input} from "@angular/core";
import {environment} from "../../../environments/environment";
import {ModalDirective} from "ng2-bootstrap";
import {LicenciaResult} from "../../+dto/licenciaResult";
import {Licencia} from "../../+dto/maintenance/licencia";
import {ComponentBase} from "../../+common/service/componentBase";
import {LicenciaFilter} from "../../+dto/licenciaFilter";
import {PermisoEmpleado} from "../../+dto/maintenance/permisoEmpleado";
import {Vacacion} from "../../+dto/maintenance/vacacion";
import {EquipoEntregado} from "../../+dto/maintenance/equipoEntregado";

/**
 * Created by oscar.castillo on 28/02/2017.
 */
declare var $: any;
@Component({
    selector: 'equipos-pendientes-messagebox',
    template: `
        <kendo-dialog *ngIf="active" (close)="onClose()" >
    
            <kendo-dialog-titlebar style="background-color: #E5702A;">
                {{titulo}}
            </kendo-dialog-titlebar>
        <div class="modal-body">
             <div class="smart-form" style="width: 900px;">
                
                <div class="row">
                    <section class="col col-md-6">
                      <label class="control-label">El empleado tiene quipos pendientes de entregar</label>
                     </section>
                </div>
             </div>  
           </div>     
          <div class="modal-footer">
            <button type="button" class="btn btn-default" (click)="onCancel($event)"> Ok
            </button>
          </div>
    </kendo-dialog>
    `
})
export class EquiposPendientesComponent  {

    public titulo :String ="";
    @Output() cancel: EventEmitter<any> = new EventEmitter();
    @Output() save: EventEmitter<any> = new EventEmitter();
    private active:boolean=false;
    localhost:  String = environment.backend;
    port: String = environment.port;
    public name:String;

    dataItem;
    @Input() public set model(dto: EquipoEntregado) {

        this.dataItem= dto;
        dto === undefined ? this.active=false: this.active=true;
    }

    public onClose() {
        this.closeForm();
    }
    public onCancel(e) {
        e.preventDefault();
        this.closeForm();
    }

    public onShow(){
        this.active=true;
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
