import { Component, Input,  Output, EventEmitter} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import {ExperienciaLaboral} from "../../+dto/maintenance/experienciaLaboral";

@Component({
  selector: 'permisopermitido-dialog-form',
  template: `
        <kendo-dialog *ngIf="active" title="{{titulo}}" (onClose)="onClose()">
            <form [formGroup]="editForm">
                <div>
                    <label for="RazonSocial">Empresa</label>
                    <input type="text" formControlName="RazonSocial" [(ngModel)]="dataItem.razonSocial"/>
                </div>
                <div>
                    <label for="Departamento">Departamento</label>
                    <input type="text" formControlName="Departamento" [(ngModel)]="dataItem.departamento"/>
                </div>
                <div>
                    <label for="Cargo">Cargo</label>
                    <input type="text" formControlName="Cargo" [(ngModel)]="dataItem.cargo"/>
                </div>
            </form>

            <kendo-dialog-actions>
                <button class="k-button" (click)="onCancel($event)">Cancelar</button>
                <button class="k-button k-primary" (click)="onSave($event)">Guardar</button>
            </kendo-dialog-actions>
        </kendo-dialog>
    `
})
export class ExperienciaLaboralDialogFormComponent {

  dataItem;
  editForm;
  @Input() public set model(dto: ExperienciaLaboral) {
    this.dataItem = dto;
    dto === undefined ? this.active = false: this.active = true;
  }

  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Output() save: EventEmitter<any> = new EventEmitter();


  constructor() {

    this.editForm = new FormGroup({
      'RazonSocial': new FormControl(),
      'Departamento': new FormControl(),
      'Cargo': new FormControl()
    })

  }

  public active: boolean = false;

  public titulo:string="";

  public onSave(e): void {
    e.preventDefault();
    this.save.emit(this.dataItem);
    this.active = false;
  }
  public onCancel(e): void {
    e.preventDefault();
    this.active = false;
    this.cancel.emit(undefined);
  }

  public onClose(): void {
    this.active = false;
    this.cancel.emit(undefined);
  }

  public agregarExperienciaLaboral() {
    this.model = new ExperienciaLaboral();
    this.active = true;
  }

}