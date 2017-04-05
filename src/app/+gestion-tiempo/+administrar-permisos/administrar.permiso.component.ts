import {Component, OnInit, EventEmitter,ViewChild} from '@angular/core';
import { Location } from '@angular/common';
import {EmpleadoService} from "../../+common/service/empleado.service";
import {Permiso} from "../../+dto/maintenance/permiso";

import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {PermisoService} from "../../+common/service/permiso.service";
import {PeriodoEmpleado} from "../../+dto/maintenance/periodoEmpleado";
import {Empleado} from "../../+dto/maintenance/empleado";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {EnumRolEmpleado} from "../../+enums/EnumRolEmpleado";
import {EnumEstados} from "../../+enums/EnumEstados";
import {LocalStorageGlobal} from "../../+dto/localStorageDto";
import {HistorialLaboral} from "../../+dto/maintenance/historialLaboral";
import {StoreSessionFilter} from "../../+dto/storeSessionFilter";
import {PermisoEmpleado} from "../../+dto/maintenance/permisoEmpleado";
import {Http} from "@angular/http";
import {ComponentBase} from "../../+common/service/componentBase";
import {MotivoDevolucionComponent} from "./motivoDevolucion";
import {Router} from "@angular/router";
import {MotivoRechazoComponent} from "./motivoRechazo";
import {Message} from "primeng/components/common/api";
import {BackendService} from "../../+rest/backend.service";

declare var $: any;

@Component({
  selector: 'sa-adm-permiso',
  templateUrl: 'administrar.permiso.component.html',
  providers: []
})
export class AdministrarPermisoComponent extends ComponentBase implements OnInit {

  public defaultItemMotivo:TablaGeneralResult={codigo:null,nombre:'Seleccionar', grupo:null};
  public permisos:PermisoEmpleado= new PermisoEmpleado();
  private motivos:TablaGeneralResult[];

  private periodoEmpleadoActual: PeriodoEmpleado = new PeriodoEmpleado();
  private empleado:Empleado = new Empleado();

  public isCompensarhoras:boolean=true;

  private historiaLaboralActual: HistorialLaboral = new HistorialLaboral();
  storeSessionFilter: StoreSessionFilter = new StoreSessionFilter();
  authorizedButton : boolean;

    @ViewChild(MotivoDevolucionComponent) protected motivoDevolucionComponent: MotivoDevolucionComponent;
    @ViewChild(MotivoRechazoComponent) protected motivoRechazoComponent: MotivoRechazoComponent;

    msgs: Message[] = [];

    constructor(private empleadoService: EmpleadoService,
                public backendService: BackendService,
                private permisoService:PermisoService,
                private _router: Router,
                private location: Location) {
      super(backendService,'GT001');
        this.storeSessionFilter = this.empleadoService.retrieveSessionStorage('editPermisoEmpleadoResult');
        if(this.storeSessionFilter.isNew == false) {
            this.obtenerPermisoEmpleadoById(this.storeSessionFilter.idTableFilter);
        }

    }

    private obtenerPermisoEmpleadoById(idPermisoEmpleado: any): void{

        this.permisoService.obtenerPermisoEmpleadoById(idPermisoEmpleado).subscribe(
            data => this.showDetail(data),
            error => this.errorMessage = <any>error
        );
    }
    showDetail(data:PermisoEmpleado){

        this.permisos = data;
        this.empleado.idEmpleado = this.permisos.idEmpleado;
        if(this.permisos.idAtendidoPor!=null && this.permisos.idAtendidoPor == this.currentUser.idEmpleado && this.permisos.estado=='E'){
            this.authorizedButton = true;
        }
        this.obtenerHistoriaLaboralActual(this.empleado);
        this.obtenerPeriodoEmpleadoActual(this.empleado);
        this.getMotivosPermiso();
        let tipoFormulario=this.permisos.motivo;
        if(tipoFormulario=='P'){
            this.isCompensarhoras=false;
        }

    }

    ngOnInit() {
    }

    private obtenerPeriodoEmpleadoActual(empleado: Empleado) {
        this.permisoService.obtenerPeriodoEmpleadoActual(empleado).subscribe(
            periodoEmpleado => this.periodoEmpleadoActual = periodoEmpleado,
            error =>  this.errorMessage = <any>error);
    }

    private getMotivosPermiso() {
        this.permisoService.completarComboBox('obtenerMotivosPermiso').subscribe(
            TablaGeneralResult => this.motivos = TablaGeneralResult,
            error =>  this.errorMessage = <any>error);
    }

    cargarMotivo(value){

        if(value == EnumEstados[EnumEstados.P]){
            this.isCompensarhoras=false;
            $('#fechaRecuperacion').removeClass('state-error');
            $('#fechaRecuperacion').parent().removeClass('state-error');

            $('#horaDesdeRecuperacion').removeClass('state-error');
            $('#horaDesdeRecuperacion').parent().removeClass('state-error');

            $('#horaHastaRecuperacion').removeClass('state-error');
            $('#horaHastaRecuperacion').parent().removeClass('state-error');

        }else{
            this.isCompensarhoras=true;
        }
    }

    onChangeFecha(value){
        this.permisos.fecha = value;
        $('#fechaPermiso').removeClass('state-error');
        $('#fechaPermiso').parent().removeClass('state-error');
    }

    onChangeHoraInicio(value){
        this.permisos.horaInicio = value;
        $('#horaDesde').removeClass('state-error');
        $('#horaDesde').parent().removeClass('state-error');
    }

    onChangeHoraFin(value){
        this.permisos.horaFin = value;
        $('#horaHasta').removeClass('state-error');
        $('#horaHasta').parent().removeClass('state-error');
    }

    onChangeFechaRecuperacion(value){
        this.permisos.fechaRecuperacion = value;
        $('#horaHasta').removeClass('state-error');
        $('#horaHasta').parent().removeClass('state-error');
    }
    onChangeHoraInicioRecuperacion(value){
        this.permisos.horaInicioRecuperacion = value;
        $('#horaHasta').removeClass('state-error');
        $('#horaHasta').parent().removeClass('state-error');
    }

    onChangeHoraFinRecuperacion(value){
        this.permisos.horaFinRecuperacion = value;
        $('#horaHasta').removeClass('state-error');
        $('#horaHasta').parent().removeClass('state-error');
    }

    onActualizarPermisoEmpleado(){

      let fechaAct:Date = new Date();

      this.permisos.periodoEmpleado = this.periodoEmpleadoActual;

      if(this.validarRequerido()){
            this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'Ingrese los campos obligatorios.'});
            return;
      }

        let cadena:string[] = this.permisos.fecha.split('/');
        let horaIni:string[] = this.permisos.horaInicio.split(':');
        let horaFin:string[] = this.permisos.horaFin.split(':');

        let fechaIni:Date= new Date( parseInt(cadena[2]),parseInt(cadena[1])-1,parseInt(cadena[0]),parseInt(horaIni[0]),parseInt(horaIni[1]));

        let fechaFin:Date= new Date( parseInt(cadena[2]),parseInt(cadena[1])-1,parseInt(cadena[0]),parseInt(horaFin[0]),parseInt(horaFin[1]));

        let fechaPerm:Date= new Date( parseInt(cadena[2]),parseInt(cadena[1])-1,parseInt(cadena[0]));


        if(fechaPerm<fechaAct){
            this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'La fecha del permiso debe ser mayor a la fecha de hoy.'});
            return;
        }

        if(fechaFin.getTime()<fechaIni.getTime()){
            this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'La hora final del permiso debe ser mayor a la hora inicial del permiso.'});
            return;
        }

        let interval= fechaFin.getTime()- fechaIni.getTime();
        let hours:number = interval / (1000*60*60);
        this.permisos.horas = parseFloat(hours.toFixed(2));

        if( this.permisos.motivo == EnumEstados[EnumEstados.P]){
            if(this.validarRequeridoFechaRecuperacion()){
                this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'Ingrese los campos obligatorios de la Fecha de Recuperacion.'});
                return;
            }

            let cadenaRecuperacion:string[] = this.permisos.fechaRecuperacion.split('/');
            let horaIniRecuperacion:string[] = this.permisos.horaInicioRecuperacion.split(':');
            let horaFinRecuperacion:string[] = this.permisos.horaFinRecuperacion.split(':');

            let fechaIniRecuperacion:Date= new Date( parseInt(cadenaRecuperacion[2]),parseInt(cadenaRecuperacion[1])-1,parseInt(cadenaRecuperacion[0]),parseInt(horaIniRecuperacion[0]),parseInt(horaIniRecuperacion[1]));

            let fechaFinRecuperacion:Date= new Date( parseInt(cadenaRecuperacion[2]),parseInt(cadenaRecuperacion[1])-1,parseInt(cadenaRecuperacion[0]),parseInt(horaFinRecuperacion[0]),parseInt(horaFinRecuperacion[1]));

            let fechaRec:Date= new Date( parseInt(cadenaRecuperacion[2]),parseInt(cadenaRecuperacion[1])-1,parseInt(cadenaRecuperacion[0]));


            if(fechaRec<fechaAct){
                this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'La fecha de recuperacion debe ser mayor a la fecha de hoy.'});
                return;
            }

            if(fechaFinRecuperacion.getTime()<fechaIniRecuperacion.getTime()){
                this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'La hora final de recuperacion debe ser mayor a la hora inicial de recuperacion.'});
                return;
            }
        }

        this.permisoService.actualizarPermisoEmpleado(this.permisos).subscribe(
            data => {

                this.backendService.notification(this.msgs, data);

                if (data.codigo == 1) {
                    setTimeout(() => {
                        this.navegarBusquedaPermiso(data);
                    }, 3000);
                }

            },
            error => {
                this.backendService.notification(this.msgs, error);
            }

        );

    }

    navegarBusquedaPermiso(data:NotificacionResult) {
        this._router.navigate(['/gestionTiempo/busquedaPermisos']);
    }

    onEnviarPermisoEmpleado(){
        this.permisoService.enviarPermisoEmpleado(this.permisos).subscribe(
            data => {
                this.backendService.notification(this.msgs, data);

                if (data.codigo == 1) {
                    setTimeout(() => {
                        this.navegarBusquedaPermiso(data);
                    }, 3000);
                }

            },
            error => {
                this.backendService.notification(this.msgs, error);
            }
        );
    }

    onAprobarPermisoEmpleado(){
        this.permisoService.aprobarPermisoEmpleado(this.permisos).subscribe(
            data => {
                this.backendService.notification(this.msgs, data);

                if (data.codigo == 1) {
                    setTimeout(() => {
                        this.navegarBusquedaPermiso(data);
                    }, 3000);
                }

            },
            error => {
                this.backendService.notification(this.msgs, error);
            }
        );
    }


    onRechazarPermisoEmpleado(): void{
        this.permisoService.rechazarPermisoEmpleado(this.permisos).subscribe(
            data => {
                this.backendService.notification(this.msgs, data);

                if (data.codigo == 1) {
                    setTimeout(() => {
                        this.navegarBusquedaPermiso(data);
                    }, 3000);
                }

            },
            error => {
                this.backendService.notification(this.msgs, error);
            }
        );
    }

    onEliminarPermisoEmpleado(): void {


        this.empleadoService.eliminarPermisoEmpleado(this.permisos).subscribe(
            data => {
                this.backendService.notification(this.msgs, data);

                if (data.codigo == 1) {
                    setTimeout(() => {
                        this.navegarBusquedaPermiso(data);
                    }, 3000);
                }
            },
            error => {
                this.backendService.notification(this.msgs, error);
            }
        );
    }

    onDevolverPermisoEmpleado(permiso:PermisoEmpleado){

        this.permisoService.devolverPermisoEmpleado(permiso).subscribe(
            data => {
                this.backendService.notification(this.msgs, data);

                if (data.codigo == 1) {
                    setTimeout(() => {
                        this.navegarBusquedaPermiso(data);
                    }, 3000);
                }

            },
            error => {
                this.backendService.notification(this.msgs, error);
            }
        );
    }

    validarRequerido():boolean{

        let validacion = false;

        if(this.permisos.motivo === undefined || this.permisos.motivo == null || this.permisos.motivo=='' ){
            $('#motivo').addClass('invalid').removeClass('required');
            $('#motivo').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }
        if(this.permisos.fecha === undefined || this.permisos.fecha == null || this.permisos.fecha==''){
            $('#fechaPermiso').addClass('invalid').removeClass('required');
            $('#fechaPermiso').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        if(this.permisos.horaInicio === undefined || this.permisos.horaInicio == null || this.permisos.horaInicio==''){
            $('#horaDesde').addClass('invalid').removeClass('required');
            $('#horaDesde').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        if(this.permisos.horaFin === undefined || this.permisos.horaFin == null || this.permisos.horaFin==''){
            $('#horaHasta').addClass('invalid').removeClass('required');
            $('#horaHasta').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        return validacion;
    }

    validarRequeridoFechaRecuperacion():boolean{
        let validacion = false;

        if(this.permisos.fechaRecuperacion === undefined || this.permisos.fechaRecuperacion == null || this.permisos.fechaRecuperacion==''){
            $('#fechaRecuperacion').addClass('invalid').removeClass('required');
            $('#fechaRecuperacion').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        if(this.permisos.horaInicioRecuperacion === undefined || this.permisos.horaInicioRecuperacion == null || this.permisos.horaInicioRecuperacion==''){
            $('#horaDesdeRecuperacion').addClass('invalid').removeClass('required');
            $('#horaDesdeRecuperacion').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        if(this.permisos.horaFinRecuperacion === undefined || this.permisos.horaFinRecuperacion == null || this.permisos.horaFinRecuperacion==''){
            $('#horaHastaRecuperacion').addClass('invalid').removeClass('required');
            $('#horaHastaRecuperacion').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        return validacion;
    }

    onRegresarBusquedaEmpleado(){
      this.location.back();
    }

    private obtenerHistoriaLaboralActual(empleado: Empleado) {
        this.permisoService.obtenerHistoriaLaboralActual(empleado).subscribe(
            historiaLaboral => this.historiaLaboralActual = historiaLaboral,
            error =>  this.errorMessage = <any>error);
    }

    goBack(): void {

        this.location.back();
    }

    public cargarMotivoDevolucion(): void {
        this.motivoDevolucionComponent.titulo="Devolucion"
        this.motivoDevolucionComponent.dataItem=this.permisos;
        this.motivoDevolucionComponent.onShow();

    }

    public cargarMotivoRechazo(): void {
        this.motivoRechazoComponent.titulo="Denegacion"
        this.motivoRechazoComponent.dataItem=this.permisos;
        this.motivoRechazoComponent.onShow();

    }



}
