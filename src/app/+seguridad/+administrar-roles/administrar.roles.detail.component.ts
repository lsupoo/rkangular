import {Component, Input, OnInit, ViewChild} from '@angular/core';

import {PageChangeEvent, GridDataResult} from "@progress/kendo-angular-grid";
import {Accion} from "../../+dto/maintenance/accion";
import {State} from "@progress/kendo-data-query";
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {RolService} from "../../+common/service/rol.service";
import {NotificacionResult} from "../../+dto/notificacionResult";


declare var $: any;

@Component({
  selector: 'administrar-rol-detail',
  template: `
        <div>
		<div class="widget-body">
		<fieldset>
          <kendo-grid
          [data]="gridViewAccion"
          [pageSize]="gridState.take" [skip]="gridState.skip" [sort]="gridState.sort"
          [sortable]="true"
          [pageable]="true"
          (dataStateChange)="onStateChange($event)"
          (edit)="editHandler($event)" (cancel)="cancelHandler($event)"
          (save)="saveHandler($event)" (add)="addHandler($event)"
          (pageChange)="pageChangeAccion($event)">
              <kendo-grid-column field="nombre" title="Accion" [width]="40"></kendo-grid-column>
              <kendo-grid-column field="tipoAccion" title="Tipo Accion" [width]="30"></kendo-grid-column>
              <kendo-grid-column field="autorizado" title="Autorizado" width="120">
                <template kendoGridCellTemplate let-dataItemSubModulo>
                    <input type="checkbox" [(ngModel)]="dataItemSubModulo.autorizado" />
                </template>
              </kendo-grid-column>
          </kendo-grid>
        </fieldset>

        </div>
        </div>
    `
})
export class AdministrarRolDetailFormComponent implements OnInit{


  @Input() public accionDetail:Accion[];
  private accionViewDetail:Accion[];

  private viewAccion:Array<Accion>=[];

  private gridViewAccion: GridDataResult;
  private pageSizeAccion: number = 10;
  private skipAccion: number = 0;

  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10
  };

  private editedRowIndex: number;
  public formGroup: FormGroup;

  constructor(private rolService: RolService){

  }

  public ngOnInit():void{

    this.accionViewDetail = this.accionDetail;
    this.viewAccion = this.accionDetail;
    this.obtenerGridAccion();
  }

  public onStateChange(state: State) {
    this.gridState = state;
  }

  protected editHandler({sender, rowIndex, dataItem}) {

    this.closeEditor(sender);

    this.formGroup = new FormGroup({
      'idAutorizacion': new FormControl(dataItem.idAutorizacion),
      'autorizado': new FormControl(dataItem.autorizado)
    });

    this.editedRowIndex = rowIndex;

    sender.editRow(rowIndex, this.formGroup);
  }

  protected changeSelected({sender, rowIndex, dataItem}) {

    this.closeEditor(sender);

    this.formGroup = new FormGroup({
      'idAutorizacion': new FormControl(dataItem.idAutorizacion),
      'autorizado': new FormControl(dataItem.autorizado)
    });

    this.editedRowIndex = rowIndex;

    sender.editRow(rowIndex, this.formGroup);
  }

  protected cancelHandler({sender, rowIndex}) {
    this.closeEditor(sender, rowIndex);
  }

  protected saveHandler({sender, rowIndex, formGroup, isNew}) {

    const accion: Accion = formGroup.value;

    this.rolService.updateAutorizacion(accion).subscribe(
        data => {
          this.notification(data);
        },
        error => error

    );

    sender.closeRow(rowIndex);
  }

  private notification(data: NotificacionResult){
    this.obtenerGridAccion();
  }

  protected addHandler({sender}) {
    /*this.closeEditor(sender);

    this.formGroup = new FormGroup({
      'ProductID': new FormControl(),
      'ProductName': new FormControl("", Validators.required),
      'UnitPrice': new FormControl(0),
      'UnitsInStock': new FormControl("", Validators.compose([Validators.required, Validators.pattern('^[0-9]{1,2}')])),
      'Discontinued': new FormControl(false)
    });

    sender.addRow(this.formGroup);*/
  }

  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }

  protected pageChangeAccion(event: PageChangeEvent): void {
    this.skipAccion = event.skip;
    this.obtenerGridAccion();
  }


  obtenerGridAccion():void{

    if(this.viewAccion.length>0){
      this.gridViewAccion = {
        data: this.viewAccion.slice(this.skipAccion, this.skipAccion + this.pageSizeAccion),
        total: this.viewAccion.length
      };
    }else{
      //this.isEmpty=true;
      this.gridViewAccion = {
        data: [],
        total: 0
      };
    }
  }

}
