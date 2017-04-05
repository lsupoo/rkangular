import { Component, Input,  Output, EventEmitter, ViewChild} from '@angular/core';
import {ModalDirective} from "ng2-bootstrap";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {PermisoService} from "../../+common/service/permiso.service";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {PeriodoEmpleado} from "../../+dto/maintenance/periodoEmpleado";
import {Vacacion} from "../../+dto/maintenance/vacacion";
import {HorasExtra} from "../../+dto/maintenance/horasExtra";
import {Licencia} from "../../+dto/maintenance/licencia";
import {LicenciaService} from "../../+common/service/licencia.service";
import {StorageResult} from "../../+dto/storageResult";
import {TipoLicencia} from "../../+dto/maintenance/tipoLicencia";
//import {DocumentoEmpleado} from "../../+dto/maintenance/documentoEmpleado";
import {environment} from "../../../environments/environment";
import {DocumentoEmpleado} from "../../+dto/maintenance/documentoEmpleado";
import {ComponentBase} from "../../+common/service/componentBase";
import {BackendService} from "../../+rest/backend.service";

declare var $: any;

@Component({
  selector: 'licencia-dialog-form',
  template: `

    <kendo-dialog *ngIf="active" (close)="onClose()" >
            <kendo-dialog-titlebar>
                {{tituloCabecera}}
            </kendo-dialog-titlebar>
        <div class="modal-body">
            <div class="smart-form" style="width: 900px;">
                
              <div class="row">
                <section class="col col-md-3">
                  <label>Jefe Inmediato</label>
                  <label class="input state-disabled"> 
                        <input type="text" [(ngModel)]="jefeInmediato" disabled="disabled" />
                  </label>
                 </section>
            
                <section class="col col-md-3">
                  <label>Periodo</label>
                  <label class="input state-disabled"> 
                    <input type="text" [(ngModel)]="periodo" disabled="disabled" />
                  </label>
                 </section>
              </div>
              
              <div class="row">
                <section class="col col-md-3">
                  <label>Tipo Licencia</label>
                  <label class="input"> 
                       <kendo-dropdownlist
							[data]="tiposLicencia"
							[textField]="'nombre'"
							[defaultItem]="defaultItemTipoLicencia"
							[valuePrimitive] = "true"
							[valueField]="'idTipoLicencia'" style="width: 100%;"
							[(value)]="idTipoLicencia" [disabled]="isEnviado">
					    </kendo-dropdownlist>
                  </label>
                 </section>
                
                <section class="col col-md-6">
                  <label>Comentario</label>
                  <label [class]="enviadoClass"> 
                        <input type="text" [(ngModel)]="comentario" [disabled]="isEnviado"/>
                  </label>
                 </section>
              </div>
                 
              <div class="row">                                                 
                <section class="col col-md-3">
                  <label>Fecha Inicio</label>
                  <label [class]="enviadoClass"> 
						 <i class="icon-append fa fa-calendar"></i>
						<input type="text" saUiDatepicker date-format="dd/MM/yy" 
						    placeholder="Seleccionar una Fecha" 
						    [(ngModel)]="fechaInicio" (change)="onChangeFechaInicio($event)" readonly="readonly" [disabled]="isEnviado"/>
                  </label>
                 </section>
                 <section class="col col-md-3">
                  <label>Fecha Fin</label>
                  <label [class]="enviadoClass"> 
						 <i class="icon-append fa fa-calendar"></i>
						<input type="text" saUiDatepicker date-format="dd/MM/yy" 
						    placeholder="Seleccionar una Fecha" 
						    [(ngModel)]="fechaFin" (change)="onChangeFechaFin($event)" readonly="readonly" [disabled]="isEnviado"/>
                  </label>
                 </section>
                 <section class="col col-md-3">
                  <label>Dias de Licencia</label>
                  <label [class]="enviadoClass"> 
						<input type="text" [(ngModel)]="dias" [disabled]="isEnviado"/>
                  </label>
                 </section>
                 <section class="col col-md-3">
                  <label>Todo el Dia</label>
                  <label class="select"> 
						<input type="checkbox" [(ngModel)]="diaEntero" (change)="cambiarTodoDia($event)" [disabled]="isEnviado"/>
                  </label>
                 </section>
                 
              </div>
              
              <div class="row" *ngIf="!isCheckedTodoDia">
                <section class="col col-md-3">
                  <label>Hora Inicio</label>
                  <label [class]="enviadoClass"> 
                        <input type="text" [(ngModel)]="horaInicio" [disabled]="isEnviado"/>
                  </label>
                 </section>
                
                <section class="col col-md-3">
                  <label>Hora Fin</label>
                  <label [class]="enviadoClass"> 
                        <input type="text" [(ngModel)]="horaFin" [disabled]="isEnviado"/>
                  </label>
                 </section>
              </div>
                 
              <div class="row">
              <fieldset>
              <legend>Documentos</legend>
              
                <kendo-grid [data]="documentos">
  
                     <kendo-grid-column field="nombre" title="Nombre"></kendo-grid-column>
                      <kendo-grid-column field="idDocumentoEmpleado" title="Archivo">
                          <template kendoGridCellTemplate let-dataItem>
                              <div class="text-center">
                                  <a href="javascript:void(0)" class="link" (click)="onDescargarDocumento(dataItem)">
                                      <span class="fa fa-download"></span> Descargar</a>
                              </div>
  
                          </template>
                      </kendo-grid-column>
              </kendo-grid>
              </fieldset>
              </div> 
                              
            </div>  
           </div>     
          <div class="modal-footer">
            <a (click)="onActualizarLicencias($event)" class="btn btn-primary" *ngIf="!isEnviado"> Guardar</a>
			<a (click)="onEnviarLicencias($event)" class="btn btn-primary" *ngIf="!isEnviado"> Enviar</a>
			<a (click)="onCancel($event)" class="btn btn-default"> Cancelar</a>
          </div>
    </kendo-dialog>
    `
})
export class LicenciaDialogFormComponent extends ComponentBase{


  public jefeInmediato: string;
  public periodo: string;

  public idTipoLicencia: number;
  public nombreTipoLicencia: string;
  public comentario: string;
  public fechaInicio:string;
  public fechaFin: string;
  public dias: number;
  public diaEntero: boolean;

  public documentos: DocumentoEmpleado[]=[];

  public horaInicio: string;
  public horaFin: string;

  public mensaje:string;

  public isCheckedTodoDia:boolean=false;

  public isEnviado:boolean=true;
  public enviadoClass:string='input';

  public tiposLicencia: TipoLicencia[]=[];

  public defaultItemTipoLicencia:TipoLicencia=new TipoLicencia();

  public storageCommomnValueResult: StorageResult = new StorageResult();

  dataItemLicencia:Licencia;
  editForm;

  @Input() public set model(dto: Licencia) {
    this.dataItemLicencia = dto;
    dto === undefined ? this.active=false: this.active=true;
  }

  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Output() save: EventEmitter<any> = new EventEmitter();

  errorMessage: string;

  constructor(private licenciaService:LicenciaService, private permisoService:PermisoService, public backendService: BackendService) {
    super(backendService, '');
    this.storageCommomnValueResult = JSON.parse(localStorage.getItem('localStorageCommonsValues'));
    this.defaultItemTipoLicencia.nombre = 'Seleccionar';
    this.defaultItemTipoLicencia.idTipoLicencia = null;
  }

  public active: boolean = false;

  public tituloCabecera:string="";


  public onCancel(e): void {
    e.preventDefault();
    this.closeForm();
  }

  public onClose(): void {
    this.closeForm();
  }

  public closeForm(){
    this.active = false;
    this.cancel.emit();
  }

  cambiarTodoDia(value){
    let isChecked:boolean = value.target.checked;
    this.isCheckedTodoDia = isChecked;
  }

  onActualizarLicencias(e){

    for(var item in this.tiposLicencia){
      var data = this.tiposLicencia[item];
      if(this.idTipoLicencia===data.idTipoLicencia){
        this.nombreTipoLicencia = data.nombre;
        break;
      }
    }

    this.dataItemLicencia.periodo = this.periodo;
    this.dataItemLicencia.jefeInmediato = this.jefeInmediato;
    this.dataItemLicencia.idTipoLicencia = this.idTipoLicencia;
    this.dataItemLicencia.nombreTipoLicencia = this.nombreTipoLicencia;
    this.dataItemLicencia.comentario = this.comentario;
    this.dataItemLicencia.fechaInicio = this.fechaInicio;
    this.dataItemLicencia.fechaFin = this.fechaFin;
    this.dataItemLicencia.dias = this.dias;
    this.dataItemLicencia.diaEntero = this.diaEntero;
    this.dataItemLicencia.horaInicio = this.horaInicio;

    this.dataItemLicencia.horaFin = this.horaFin;

    this.licenciaService.actualizarLicencia(this.dataItemLicencia).subscribe(
        data => {
          this.guardarFilaGrilla(data);
        },
        error => error
    );

  }

  guardarFilaGrilla(notificacion:NotificacionResult){
    if(notificacion.codigo == 1){
      this.save.emit(this.dataItemLicencia);
      this.active = false;
    }else{
      this.closeForm();

    }
  }

  onEnviarLicencias(e){

    e.preventDefault();

    for(var item in this.tiposLicencia){
      var data = this.tiposLicencia[item];
      if(this.idTipoLicencia===data.idTipoLicencia){
        this.nombreTipoLicencia = data.nombre;
        break;
      }
    }

    this.dataItemLicencia.periodo = this.periodo;
    this.dataItemLicencia.jefeInmediato = this.jefeInmediato;
    this.dataItemLicencia.idTipoLicencia = this.idTipoLicencia;
    this.dataItemLicencia.nombreTipoLicencia = this.nombreTipoLicencia;
    this.dataItemLicencia.comentario = this.comentario;
    this.dataItemLicencia.fechaInicio = this.fechaInicio;
    this.dataItemLicencia.fechaFin = this.fechaFin;
    this.dataItemLicencia.dias = this.dias;
    this.dataItemLicencia.diaEntero = this.diaEntero;
    this.dataItemLicencia.horaInicio = this.horaInicio;

    this.dataItemLicencia.horaFin = this.horaFin;


    this.dataItemLicencia.estado = 'E';
    this.dataItemLicencia.nombreEstado = 'Enviado';

    this.licenciaService.actualizarLicencia(this.dataItemLicencia).subscribe(
        data => {
          this.guardarFilaGrilla(data);

        },
        error => error
    );
  }


  validarRequerido():boolean{
    let validacion = false;
    return validacion;
  }

  onChangeFechaInicio(value){
    this.fechaInicio = value;
  }

  onChangeFechaFin(value){
    this.fechaFin = value;
  }
  public obtenerTipoLicencia() {
    this.tiposLicencia = this.storageCommomnValueResult.tipoLicencia;
  }


  public onDescargarDocumento(dto: DocumentoEmpleado): void {

    //let url:string = 'http://localhost:7999/empleado/descargarArchivoDocumento?archivo='+ ;

    if ($("#export_file").length > 0) {
      $("#export_file").remove();
    }
    if ($("#export_file").length === 0) {
      var iframe = $("<iframe src='' name='export_file' id='export_file'></iframe>");
      iframe.appendTo("body");

      var form = $("<form action='"+this.urlDowloadFile+"' method='post' target='export_file'></form>");
      form.append($("<input type='hidden' name='contenidoArchivo' id='contenidoArchivo' />").attr("value",dto.contenidoArchivo));
      form.append($("<input type='hidden' name='tipoArchivo' id='tipoArchivo' />").attr("value",dto.tipoArchivo));
      form.append($("<input type='hidden' name='nombre' id='nombre' />").attr("value",dto.nombre));
      form.append($("<input type='hidden' name='nombreArchivo' id='nombreArchivo' />").attr("value",dto.nombreArchivo));
      form.appendTo("body");

      form.submit();
    }

  }


}