import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {HttpModule, Http} from '@angular/http';

import { Location } from '@angular/common';

import { HistoriaLaboralService } from '../../+common/service/historialLaboral.service';
import { HistorialLaboral } from '../../+dto/maintenance/historialLaboral';
//Empleado
import {EmpleadoService} from "../../+common/service/empleado.service";
import {Empleado} from "../../+dto/maintenance/empleado";
import {ComponentBase} from "../../+common/service/componentBase";
import {PageChangeEvent, GridDataResult} from "@progress/kendo-angular-grid";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {Message} from "primeng/components/common/api";
import {Subscription} from "rxjs";
import {HistorialLaboralResult} from "../../+dto/historialLaboralResult";
import {BackendService} from "../../+rest/backend.service";
import {ConfirmDialogComponent} from "../../shared/confirm/confirmDialogBase";
import {ViewChild} from "@angular/core/src/metadata/di";

declare var $: any;

@Component({
  selector: 'sa-empleado-historiaLaboral',
  templateUrl: 'historiaLaboral.component.html',
  providers: [HttpModule]
})
export class HistoriaLaboralComponent extends ComponentBase implements OnInit {

  busy: Subscription;
  public empleado:Empleado= new Empleado();
  public estadoTiempo: string;

  historiaLaboral: HistorialLaboralResult[] =[];
  private gridView: GridDataResult;
  /*dataItemHistorial: HistorialLaboralResult;*/
  private pageSize: number = 10;
  private skip: number = 0;
  public isEmpty:boolean = true;
  msgs: Message[] = [];

  public fotoEmpleado: string = '';
  public nombreCompletoEmpleado:string = '';

  constructor(private router: Router,
              public backendService: BackendService,
              private empleadoService:EmpleadoService,
              private location: Location,
              private historiaLaboralService: HistoriaLaboralService) {
    super(backendService,'EM001');
    this.empleado = this.empleadoService.retrieveSessionStorage('entityHistorialTrabajo');
  }

  onRegresarVerEmpleado(){
    this.location.back();
  }
  public onEdit(dataItem: any): void {

    let fechaAct:Date = new Date();
    let fechaDesde = dataItem.fechaInicio;
    let fechaHasta = dataItem.fechaFin;
    let cadenaInicio:string[] = fechaDesde.split('/');
    let fechaInicio:Date = new Date( parseInt(cadenaInicio[2]),parseInt(cadenaInicio[1])-1,parseInt(cadenaInicio[0]));

    let fechaFin:Date;
    if(fechaHasta!=null){
      let cadenaFin:string[] = fechaHasta.split('/');
      fechaFin = new Date( parseInt(cadenaFin[2]),parseInt(cadenaFin[1])-1,parseInt(cadenaFin[0]));
    }

    if(fechaInicio>fechaAct){
      this.estadoTiempo = 'CF';
      this.empleadoService.storeSessionStorage('entityIdEmpleadoHistoriaLaboral',this.empleado);
      this.empleadoService.storeSessionStorage('entityEditHistoriaLaboral',dataItem.idHistorialLaboral);
      this.empleadoService.storeSessionStorage('stateEditHistoriaLaboral',this.estadoTiempo);
      this.router.navigate(['/personal/editarCargo']);
    }else if(fechaFin<fechaAct && fechaInicio<fechaAct && fechaFin!=null){
      this.estadoTiempo = 'CP';
      this.empleadoService.storeSessionStorage('entityIdEmpleadoHistoriaLaboral',this.empleado);
      this.empleadoService.storeSessionStorage('entityEditHistoriaLaboral',dataItem.idHistorialLaboral);
      this.empleadoService.storeSessionStorage('stateEditHistoriaLaboral',this.estadoTiempo);
      this.router.navigate(['/personal/editarCargo']);
    }else if(fechaInicio<fechaAct || fechaFin == null || fechaFin>fechaAct){
      this.estadoTiempo = 'CA';
      this.empleadoService.storeSessionStorage('entityIdEmpleadoHistoriaLaboral',this.empleado);
      this.empleadoService.storeSessionStorage('entityEditHistoriaLaboral',dataItem.idHistorialLaboral);
      this.empleadoService.storeSessionStorage('stateEditHistoriaLaboral',this.estadoTiempo);
      this.router.navigate(['/personal/editarCargo']);
    }
  }
  onDelete(dataItem: any): void {

    this.historiaLaboralService.eliminarHistorialLaboral(dataItem.idHistorialLaboral).subscribe(
        data => {

          this.backendService.notification(this.msgs, data);

          if (data.codigo == 1) {
            this.getGrid_HistoriaLaboral();
          }

        },
        error => {

          this.backendService.notification(this.msgs, error);
        }

    );
  }



  public onNuevoCargo(): void {
    this.empleadoService.storeSessionStorage('entityNewHistoriaLaboral',this.empleado);
    this.router.navigate(['/personal/nuevoCargo'])
  }

  ngOnInit() {
    this.getGrid_HistoriaLaboral();

  }

  private getGrid_HistoriaLaboral() {

    let idEmpleado = this.empleado.idEmpleado;
    this.obtenerEmpleado(idEmpleado);
    this.busy = this.historiaLaboralService.completar_Grid_Historia_Laboral(idEmpleado).subscribe(
        data => {
          this.historiaLaboral = data;
          this.obtenerHistorialLaboral();
        },
        error => this.errorMessage = <any>error
    );

  }

  obtenerEmpleado(idEmpleado: number){
    this.empleadoService.obtenerEmpleadoCabecera(idEmpleado).subscribe(
        data => this.cargarEmpleado(data),
        error => this.errorMessage = <any>error
    );
  }

  cargarEmpleado(data:Empleado){

    this.nombreCompletoEmpleado = data.nombreCompletoEmpleado;

    if(data.fotoPerfil != null) {
      this.fotoEmpleado = "data:image/jpeg;base64," +  data.fotoPerfil.contenidoArchivo;
      $('#fotoEmpleado').prop("style","display: block; border-radius: 4px 4px; height: 100px");
      $('#iconPerson').prop("class","");
    }
  }

  private obtenerHistorialLaboral(): void {
    if(this.historiaLaboral.length>0){
      this.isEmpty=false;
      this.gridView = {
        data: this.historiaLaboral.slice(this.skip, this.skip + this.pageSize),
        total: this.historiaLaboral.length
      };
    }else{
      this.isEmpty=true;

      this.gridView = {
        data: [],
        total: 0
      };
    }

  }

  /*getGrid_HistoriaLaboral2(): void {
   let idEmpleado = this.empleado.idEmpleado;


   this.historiaLaboralService.completar_Grid_Historia_Laboral2(idEmpleado).then(
   historiaLaboralDto => this.historiaLaboral = historiaLaboralDto,
   error => this.errorMessage = <any>error
   );

   }*/
  protected pageChangeHistorialLaboral(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.obtenerHistorialLaboral();
  }

  @ViewChild(ConfirmDialogComponent) private confirmDialogComponent: ConfirmDialogComponent;

  public confirm(dataItem:HistorialLaboral): void {
    this.confirmDialogComponent.titulo="Eliminar Cargo"
    this.confirmDialogComponent.dataItem=dataItem;
    this.confirmDialogComponent.onShow();

  }
}