import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Rx';
import {HttpModule, Http} from '@angular/http';
import { Moneda } from '../../+dto/maintenance/moneda';
import { CargoService } from '../../+common/service/cargo.service';
import { HistorialLaboral } from '../../+dto/maintenance/historialLaboral';
import { HistoriaLaboralService } from '../../+common/service/historialLaboral.service';
import {EmpleadoService} from "../../+common/service/empleado.service";
import {NotificacionResult} from "../../+dto/NotificacionResult";
import {StorageResult} from "../../+dto/storageResult";
import {UnidadDeNegocioCombo} from "../../+dto/unidadDeNegocioCombo";
import {ComponentBase} from "../../+common/service/componentBase";
import {ProyectoCombo} from "../../+dto/proyectoCombo";
import {DepartamentoAreaCombo} from "../../+dto/departamentoAreaCombo";
import {CargoCombo} from "../../+dto/cargoCombo";
import {Message} from "primeng/components/common/api";
import {Empleado} from "../../+dto/maintenance/empleado";
import {GeneralTextMask} from "../../+common/Utils/generalTextMask";
import {BackendService} from "../../+rest/backend.service";
import {NotificationsService} from "angular2-notifications/src/notifications.service";

declare var $: any;

@Component({
  selector: 'sa-empleado-cargo-detail',
  templateUrl: 'cargo-edit.component.html',
  providers: [HttpModule, CargoService,NotificationsService]
})
export class EditCargoComponent extends ComponentBase implements OnInit {

  public empleado:Empleado= new Empleado();
  public historiaLaboral:HistorialLaboral= new HistorialLaboral();
  public errorMessage: string;
    public mensaje:string;
  public monedas: Moneda[];
  @Output() close = new EventEmitter();
  private view: Array<HistorialLaboral>=[];
  public estadoTiempo: string;

    public unidadDeNegocio : UnidadDeNegocioCombo[];
    public defaultItem:UnidadDeNegocioCombo={idUnidadDeNegocio:null,nombre:'Seleccionar'};

  error: any;
  msgs: Message[] = [];

    public isEnableUndNegocio:boolean;
    public isEnableProyectos:boolean;
    public isEnableCargos:boolean;

    public proyecto : ProyectoCombo[];
    public defaultItemProyecto: ProyectoCombo = {idProyecto: null,idDepartamentoArea: null, nombre: 'Seleccionar'};
    public departamentos : DepartamentoAreaCombo[];
    public defaultItemDepartamento: DepartamentoAreaCombo = {idDepartamentoArea: null,idUnidadDeNegocio: null, nombre: 'Seleccionar'};
    public cargos : CargoCombo[];
    public currencyMask = GeneralTextMask.currencyMask;

    public fotoEmpleado: string = '';
    public nombreCompletoEmpleado:string = '';

  constructor(
            private historiaLaboralService: HistoriaLaboralService,
            private cargoService: CargoService,
            public backendService: BackendService,
            private _service: NotificationsService,
            private empleadoService:EmpleadoService,
            private location: Location) {

    super(backendService,'');

    this.estadoTiempo = this.empleadoService.retrieveSessionStorage('stateEditHistoriaLaboral');
    this.empleado = this.empleadoService.retrieveSessionStorage('entityIdEmpleadoHistoriaLaboral');

      this.obtenerEmpleado(this.empleado.idEmpleado);

    this.getUnidadDeNegocio();
    this.getMonedas();
    this.getListCargos();
    let idHistorialLaboralEdit = this.empleadoService.retrieveSessionStorage('entityEditHistoriaLaboral');
    this.verHistorialLaboral(idHistorialLaboralEdit);

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

  verHistorialLaboral(idHistorialLaboralEdit: number){
      this.historiaLaboralService.obtenerHistorialLaboralById(idHistorialLaboralEdit).subscribe(
        data => this.cargarHistorialLaboral(data),
          error => this.errorMessage = <any>error
      );

  }
  private cargarHistorialLaboral(data: HistorialLaboral){

      this.actualizarDpto(data.idUnidadDeNegocio);
      if(data.idDepartamentoArea != null) {
          this.actualizarProyecto(data.idDepartamentoArea);
      }
      this.historiaLaboral = data;
  }

  ngOnInit() {

  }

    getUnidadDeNegocio() {
          this.unidadDeNegocio = this.storageCommomnValueResult.unidadDeNegocio;
    }
    private obtenerDepartamentos(idUndNegocio:number) {
        this.departamentos = this.storageCommomnValueResult.departamentoArea.filter(depa => idUndNegocio === depa.idUnidadDeNegocio);
    }

    private obtenerProyecto(idDepartamentoArea: number) {
        this.proyecto = this.storageCommomnValueResult.proyecto.filter(proyect => idDepartamentoArea === proyect.idDepartamentoArea);
    }

    actualizarDpto(value):void{
        $('#unidadNegocio').css('border','none');
        this.isEnableUndNegocio=false;
        let codigo:any = value;
        this.historiaLaboral.idDepartamentoArea = null;
        if(value == null){
            this.departamentos = null;
        }else {
            this.obtenerDepartamentos(codigo);
        }

        this.historiaLaboral.idProyecto = null;
        this.proyecto = null;
    }
    actualizarProyecto(value): void {
        let codigo:any = value;
        this.historiaLaboral.idProyecto = null;
        if(value == null) {
            this.proyecto = null;
        }else {
            this.obtenerProyecto(codigo);
        }

    }

    onChangeCargo(value):void{
        $('#idCargo').css('border','none');
    }

    cargarMoneda(value){
        this.historiaLaboral.idMoneda = value;
    }

    public getMonedas() {
       this.monedas = this.storageCommomnValueResult.moneda;
    }
    getListCargos() {
        this.cargos = this.storageCommomnValueResult.cargo;
    }

    onChangeIniDate(e) {
        this.historiaLaboral.fechaInicio = e;
    }

      onChangeFinDate(e) {

        this.historiaLaboral.fechaFin = e;

      }

        validarRequerido():boolean{

            let validacion = false;
            if(this.historiaLaboral.fechaInicio === undefined || this.historiaLaboral.fechaInicio == null || this.historiaLaboral.fechaInicio=='' ){
                $('#desdeFecha').addClass('invalid').removeClass('required');
                $('#desdeFecha').parent().addClass('state-error').removeClass('state-success');
                validacion = true;
            }
            if(this.historiaLaboral.idUnidadDeNegocio === undefined || this.historiaLaboral.idUnidadDeNegocio == null){
                $('#unidadNegocio').addClass('invalid').removeClass('required');
                $('#unidadNegocio').parent().addClass('state-error').removeClass('state-success');
                $('#unidadNegocio').css('border','2px solid red');
                validacion = true;
            }
            if(this.historiaLaboral.idCargo === undefined || this.historiaLaboral.idCargo == null ){
                $('#idCargo').addClass('invalid').removeClass('required');
                $('#idCargo').parent().addClass('state-error').removeClass('state-success');
                $('#idCargo').css('border','2px solid red');
                validacion = true;
            }
            if(this.historiaLaboral.salario === undefined || this.historiaLaboral.salario == null ){
                $('#salario').addClass('invalid').removeClass('required');
                $('#salario').parent().addClass('state-error').removeClass('state-success');
                validacion = true;
            }
            if(this.historiaLaboral.idMoneda === undefined || this.historiaLaboral.idMoneda == null ){
                $('#idMoneda').addClass('invalid').removeClass('required');
                $('#idMoneda').parent().addClass('state-error').removeClass('state-success');
                validacion = true;
            }

            return validacion;
        }

      public onGuardarCargo(): void{

        if(this.validarRequerido()){
            this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'Ingrese los campos obligatorios.'});
            return;
        }
          this.historiaLaboral.idEmpleado = this.empleado.idEmpleado;
        this.historiaLaboralService.updateCargo(this.historiaLaboral).subscribe(
          data => {
              this.navegarDashboard(data);
          },
          error => error
        );
      }

    navegarDashboard(data:NotificacionResult){

        if(data.codigo == 1){
            this.msgs.push({severity:'Success', summary:'Runakuna Success', detail:data.detail});
            this.goBack();
        }

        else if(data.codigo == 0){
            this.msgs.push({severity:'error', summary:'Runakuna Error', detail:data.detail});
            return;
        }
    }

  public crearCargo(data: HistorialLaboral): Observable<HistorialLaboral[]>{

    return this.fetch("create", data);
  }

  public editarCargo(data: HistorialLaboral): Observable<HistorialLaboral[]>{
    return this.fetch("update", data);
  }

  private fetch(action: string = "", data?: HistorialLaboral): Observable<HistorialLaboral[]>  {

        if(action=="create"){
            var documento : HistorialLaboral = (JSON.parse(JSON.stringify(data)));
            this.view.push(documento);
        }else if(action=="update"){
            var indice = this.view.indexOf(data);
            if(indice>=0)
                this.view[indice]  = (JSON.parse(JSON.stringify(data)));
        }

        return Observable.of(this.view);
    }


  goBack(): void {
    this.location.back();
  }

}