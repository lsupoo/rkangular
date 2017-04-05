import {Component, Input, Output, EventEmitter, ViewChild, OnInit} from '@angular/core';

import {PageChangeEvent, GridDataResult} from "@progress/kendo-angular-grid";
import {Observable} from "rxjs";
import {DepartamentoArea} from "../../+dto/maintenance/departamentoArea";
import {DepartamentoAreaDialogFormComponent} from "./departamento.area.dialog.component";


declare var $: any;

@Component({
  selector: 'departamento-area-detail',
  template: `
        <div>
		<legend>Departamento Area</legend>
		<div class="widget-body">

        <fieldset>
			<div class="col-12 text-right padding-bottom-10">
				<button (click)="agregarDepartamentoArea()" class="btn btn-default">Agregar
				</button>
			</div>
		</fieldset>
		<fieldset>
          <kendo-grid
          [data]="gridViewDepartamentoArea"
          [pageSize]="pageSizeDepartamentoArea"
          [skip]="skipDepartamentoArea"
          [pageable]="true"
          (pageChange)="pageChangeDepartamentoArea($event)">
              <kendo-grid-column field="idDepartamentoArea" title=" " width="40px">
                  <template kendoGridCellTemplate let-dataItemDepartamentoArea>
                      <div class="text-center">
                          <a href="javascript:void(0)" class="link" (click)="onEditarDepartamentoArea(dataItemDepartamentoArea)">
                              <span class="fa fa-pencil"></span></a>
                      </div>
  
                  </template>
              </kendo-grid-column>
              <kendo-grid-column field="idDepartamentoArea" title=" " width="40px" >
                  <template kendoGridCellTemplate let-dataItemDepartamentoArea>
                      <div class="text-center">
                          <a href="javascript:void(0)" class="link" (click)="(null)">
                              <span class="fa fa-trash"></span></a>
                      </div>
                  </template>
              </kendo-grid-column>
          
              <kendo-grid-column field="nombre" title="Nombre"></kendo-grid-column>
              <kendo-grid-column field="jefe" title="Jefe"></kendo-grid-column>
              <kendo-grid-column field="jefeReemplazo" title="Jefe Reemplazo"></kendo-grid-column>
              <kendo-grid-column field="nombreEstado" title="Estado"></kendo-grid-column>   
          </kendo-grid>
          <departamentoArea-dialog-form [model]="dataItemDepartamentoArea" (cancel)="onCancelarDepartamentoArea()" (save)="onGuardarDepartamentoArea($event)"></departamentoArea-dialog-form>
        </fieldset>
        
        </div>
        </div>
    `
})
export class DepartamentoAreaDetailFormComponent implements OnInit{


  @Input() public departamentosAreaDetail:DepartamentoArea[];

  private departamentosArea:DepartamentoArea[];

  public ngOnInit():void{
    this.departamentosArea = this.departamentosAreaDetail;
    this.viewDepartamentoArea = this.departamentosAreaDetail;
    this.obtenerGridDepartamentoArea();
  }

  //departamento area

  protected pageChangeDepartamentoArea(event: PageChangeEvent): void {
    this.skipDepartamentoArea = event.skip;

    this.obtenerGridDepartamentoArea();
  }

  private gridViewDepartamentoArea: GridDataResult;


  private pageSizeDepartamentoArea: number = 10;
  private skipDepartamentoArea: number = 0;


  public dataItemDepartamentoArea: DepartamentoArea;

  @ViewChild(DepartamentoAreaDialogFormComponent) protected departamentoAreaDialogComponent: DepartamentoAreaDialogFormComponent;

  private viewDepartamentoArea:Array<DepartamentoArea>=[];

  public agregarDepartamentoArea(): void {
    this.departamentoAreaDialogComponent.titulo = "Agregar";
    this.departamentoAreaDialogComponent.agregarDepartamentoArea();

  }

  public onEditarDepartamentoArea(dataItem: DepartamentoArea): void {
    this.departamentoAreaDialogComponent.titulo = "Editar";
    this.departamentoAreaDialogComponent.obtenerEstados();
    this.departamentoAreaDialogComponent.cargarAutocomplete();
    this.dataItemDepartamentoArea = dataItem;
    this.departamentoAreaDialogComponent.nombre = this.dataItemDepartamentoArea.nombre;
    this.departamentoAreaDialogComponent.estado = this.dataItemDepartamentoArea.estado;
    this.departamentoAreaDialogComponent.jefe = this.dataItemDepartamentoArea.jefe;
    this.departamentoAreaDialogComponent.idJefe = this.dataItemDepartamentoArea.idJefe;
    this.departamentoAreaDialogComponent.jefeReemplazo = this.dataItemDepartamentoArea.jefeReemplazo;
    this.departamentoAreaDialogComponent.idJefeReemplazo = this.dataItemDepartamentoArea.idJefeReemplazo;
    this.departamentoAreaDialogComponent.jefeNoDisponible = this.dataItemDepartamentoArea.jefeNoDisponible;
    this.departamentoAreaDialogComponent.nombreEstado = this.dataItemDepartamentoArea.nombreEstado;
  }

  public onGuardarDepartamentoArea(dto: DepartamentoArea): void {

    const operation = (dto.idDepartamentoArea === undefined || dto.idDepartamentoArea== null) ?
        this.crearDepartamentoArea(dto) :
        this.editarDepartamentoArea(dto);

    this.obtenerGridDepartamentoArea();

  }

  public onEliminarDepartamentoArea(e: DepartamentoArea): void {
    const operation = this.eliminarDepartamentoArea(e);
    this.obtenerGridDepartamentoArea();
  }

  public onCancelarDepartamentoArea(): void {
    this.dataItemDepartamentoArea = undefined;
  }

  public obtenerDepartamentoArea(): Observable<DepartamentoArea[]> {
    return this.fetchDepartamentoArea();
  }

  public editarDepartamentoArea(data: DepartamentoArea): Observable<DepartamentoArea[]> {
    return this.fetchDepartamentoArea("update", data);
  }

  public crearDepartamentoArea(data: DepartamentoArea): Observable<DepartamentoArea[]> {
    data.idDepartamentoArea = this.generarIdDepartamentoAreaTemporal();
    return this.fetchDepartamentoArea("create", data);

  }

  public eliminarDepartamentoArea(data: DepartamentoArea): Observable<DepartamentoArea[]> {
    return this.fetchDepartamentoArea("destroy", data);
  }

  private fetchDepartamentoArea(action: string = "", data?: DepartamentoArea): Observable<DepartamentoArea[]>  {

    if(action=="create"){
      let departamentoArea : DepartamentoArea = (JSON.parse(JSON.stringify(data)));
      this.viewDepartamentoArea.push(departamentoArea);
    }else if(action=="update"){
      let indice = this.viewDepartamentoArea.indexOf(data);
      if(indice>=0)
        this.viewDepartamentoArea[indice]  = (JSON.parse(JSON.stringify(data)));
    }else if(action=="destroy"){
      let indice = this.viewDepartamentoArea.indexOf(data);

      if(indice>=0)
        this.viewDepartamentoArea.splice(indice, 1);

    }

    return Observable.of(this.viewDepartamentoArea);
  }

  obtenerGridDepartamentoArea():void{
    if(this.viewDepartamentoArea.length>0){
      //this.isEmpty=false;
      this.gridViewDepartamentoArea = {
        data: this.viewDepartamentoArea.slice(this.skipDepartamentoArea, this.skipDepartamentoArea + this.pageSizeDepartamentoArea),
        total: this.viewDepartamentoArea.length
      };
    }else{
      //this.isEmpty=true;
      this.gridViewDepartamentoArea = {
        data: [],
        total: 0
      };
    }
  }

  generarIdDepartamentoAreaTemporal():number {
    if (this.viewDepartamentoArea != null)
      return (this.viewDepartamentoArea.length + 2)* -1;
    else
      return-1;
  }

}