import {Component, OnInit, EventEmitter,ViewChild} from '@angular/core';
import { Location } from '@angular/common';
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {PermisoService} from "../../+common/service/permiso.service";
import {PeriodoEmpleado} from "../../+dto/maintenance/periodoEmpleado";
import {Empleado} from "../../+dto/maintenance/empleado";

import {NotificacionResult} from "../../+dto/NotificacionResult";
import {LocalStorageGlobal} from "../../+dto/localStorageDto";
import {HistorialLaboral} from "../../+dto/maintenance/historialLaboral";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {Licencia} from "../../+dto/maintenance/licencia";
import {LicenciaFilter} from "../../+dto/licenciaFilter";
import {CompleterData, CompleterService} from "ng2-completer";
import {environment} from "../../../environments/environment";
import {TipoLicencia} from "../../+dto/maintenance/tipoLicencia";
import {DocumentoEmpleado} from "../../+dto/maintenance/documentoEmpleado";
import {Observable} from "rxjs";
import {AdministrarLicenciaDocumentComponent} from "./administrar.licencia.edit.form";
import {NotificationsService} from "angular2-notifications/src/notifications.service";
import {Router} from "@angular/router";
import {EnumRolEmpleado} from "../../+enums/enumRolEmpleado";
import {StoreSessionFilter} from "../../+dto/storeSessionFilter";
import {LicenciaService} from "../../+common/service/licencia.service";
import {StorageResult} from "../../+dto/storageResult";
import {ComponentBase} from "../../+common/service/componentBase";
import {Http} from "@angular/http";
import {Message} from "primeng/components/common/api";
import {setTimeout} from "timers";
import {BackendService} from "../../+rest/backend.service";
import {MotivoLicenciaRechazoComponent} from "./motivoLicenciaRechazo";

declare var $: any;
var moment = require('moment');

@Component({
    selector: 'administrar-licencia',
    templateUrl: 'administrar.licencia.component.html',
    providers: [NotificationsService]
})
export class AdministrarLicenciaComponent extends ComponentBase implements OnInit {

    public defaultItem:TablaGeneralResult={codigo:null,nombre:'Seleccionar',grupo:null};
    public licencia:Licencia= new Licencia();

    private periodoEmpleadoActual: PeriodoEmpleado = new PeriodoEmpleado();
    public empleado:Empleado = new Empleado();

    public historiaLaboralActual: HistorialLaboral = new HistorialLaboral();
    storeSessionFilter: StoreSessionFilter = new StoreSessionFilter();

    busquedaLicencias: LicenciaFilter = new LicenciaFilter();
    public tipoLicencia: TipoLicencia[];

    private historiasLaboralesActuales: HistorialLaboral[] = [];

    public isCheckedTodoDia:boolean=true;

    private defaultItemHistoriaLaboral: any = {idJefeInmendiato:null, jefeInmediato:'Seleccionar'};

    private dataServiceEmpleado:CompleterData;
    localhost:  String = environment.backend;
    port: String = environment.port;

    msgs: Message[] = [];

    //Document
    private view: Array<DocumentoEmpleado>=[];
    public dataItem: DocumentoEmpleado;
    @ViewChild(AdministrarLicenciaDocumentComponent) protected editFormComponent: AdministrarLicenciaDocumentComponent;
    @ViewChild(MotivoLicenciaRechazoComponent) protected motivoLicenciaRechazoComponent: MotivoLicenciaRechazoComponent;
    public isRhana:boolean= false;

    constructor(private empleadoService: EmpleadoService,
                private licenciaService: LicenciaService,
                private _router: Router,
                public backendService: BackendService,
                private permisoService:PermisoService,
                private completerService: CompleterService,
                private location: Location) {
        super(backendService,'GT003');
        this.dataServiceEmpleado = completerService.remote(this.urlAutocompleteEmpleado,'nombreEmpleado','nombreEmpleado');

        this.storeSessionFilter = this.empleadoService.retrieveSessionStorage('editLicenciaResult');

        if(!this.storeSessionFilter.isNew){
            this.obtenerLicenciaById(this.storeSessionFilter.idTableFilter);
        }else{
            this.licencia = new Licencia();
            this.licencia.diaEntero = true;
            this.isCheckedTodoDia = true;
        }

        this.esRhana();
        this.getTipoLicencias();
    }
    esRhana() {
        this.currentUser  = JSON.parse(sessionStorage.getItem("authenticatedUser") || '{}');
        var index;
        for(index=0;index<this.currentUser.assignedRoles.length;index++) {
            var r=this.currentUser.assignedRoles[index]
            if(r.roleDefault && r.roleName=='RHANA'){
                this.isRhana=true;
            }
        }
    }

    cambiarTodoDia(value){
        let isChecked:boolean = value.target.checked;
        this.isCheckedTodoDia = isChecked;
    }

    private obtenerLicenciaById(idLicencia: any): void{
        this.licenciaService.obtenerLicenciaById(idLicencia).subscribe(
            data => this.showDetail(data),
            error => this.errorMessage = <any>error
        );
    }
    showDetail(data:Licencia){

        this.isCheckedTodoDia = data.diaEntero;
        this.licencia = data;
        this.empleado.idEmpleado = this.licencia.idEmpleado;


        this.obtenerHistoriaLaborales(this.empleado.idEmpleado);
        this.obtenerHistoriaLaboralActual(this.empleado);
        this.obtenerPeriodoEmpleadoActual(this.empleado);

    }

    private obtenerHistoriaLaborales(idEmpleado: number) {
        this.permisoService.obtenerHistoriasLaboralesPorEmpleado(idEmpleado).subscribe(
            historiaLaboral => {this.historiasLaboralesActuales = historiaLaboral},
            error =>  this.errorMessage = <any>error);
    }

    ngOnInit() {

    }

    public eliminarDocumento(data: DocumentoEmpleado): Observable<DocumentoEmpleado[]> {
        return this.fetch("destroy", data);
    }

    public onDelete(e: DocumentoEmpleado): void {
        const operation = this.eliminarDocumento(e);
    }

    private fetch(action: string = "", data?: DocumentoEmpleado): Observable<DocumentoEmpleado[]>  {
        if(action=="create"){
            var documento : DocumentoEmpleado = (JSON.parse(JSON.stringify(data)));
            this.view.push(documento);
        }else if(action=="update"){
            var indice = this.view.indexOf(data);
            if(indice>=0)
                this.view[indice]  = (JSON.parse(JSON.stringify(data)));
        }else if(action=="destroy"){
            var indice = this.view.indexOf(data);

            if(indice>=0)
                this.view.splice(indice, 1);

        }

        return Observable.of(this.view);
    }
    public onViewDocument(dto: DocumentoEmpleado): void {

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

    public onSave(dto: DocumentoEmpleado): void {

        const operation = dto.idDocumentoEmpleado === undefined ?
            this.crearDocumento(dto) :
            this.editarDocumento(dto);

    }



    public onCancel(): void {
        this.dataItem = undefined;
    }

    generarIdDocumentoTemporal():number {
        if (this.view != null)
            return (this.view.length + 2)* -1;
        else
            return-1;
    }

    public crearDocumento(data: DocumentoEmpleado): Observable<DocumentoEmpleado[]> {
        data.idDocumentoEmpleado = this.generarIdDocumentoTemporal();
        return this.fetch("create", data);

    }
    public editarDocumento(data: DocumentoEmpleado): Observable<DocumentoEmpleado[]> {
        return this.fetch("update", data);
    }

    public agregarDocumento(): void{
        this.editFormComponent.titulo = "Agregar";
        this.editFormComponent.agregarDocumento();
    }
    cargarTipoLicencia(value){
        $('#idTipoLicenciaReq').css('border','none');
        this.licencia.idTipoLicencia = value;
    }

    selectJefeInmediato(value){
        $('#idJefeInmediatoReq').css('border','none');
    }
    changeComentario(){
        $('#comentarioReq').parent().removeClass('state-error');
    }

    private getTipoLicencias(){
        this.tipoLicencia = this.storageCommomnValueResult.tipoLicencia;
    }

    selectEmpleado(e){

        if(e !=null) {
            this.busquedaLicencias.idEmpleado = e.originalObject.idEmpleado;
            this.obtenerHistoriaLaboralLicencia(this.busquedaLicencias);
            this.empleado.idEmpleado = this.busquedaLicencias.idEmpleado;
            this.obtenerPeriodoEmpleadoActual(this.empleado);
            this.obtenerHistoriaLaborales(this.empleado.idEmpleado);
        }else{
            this.busquedaLicencias.idEmpleado = null;
        }
    }

    onChangeFechaInicio(value){
        this.licencia.fechaInicio = value;
        if(this.licencia.fechaFin){
            this.validateDaysBetweenTwoDays(this.licencia.fechaFin,this.licencia.fechaInicio);
        }
    }
    onChangeFechaFin(value){
        this.licencia.fechaFin = value;
        if(this.licencia.fechaInicio){
            this.validateDaysBetweenTwoDays(this.licencia.fechaFin,this.licencia.fechaInicio);
        }
    }

    private validateDaysBetweenTwoDays(dateFin, dateIni){
        let var1 = dateIni.split('/');
        let varYearIni = var1[2];
        let varMonthIni = var1[1];
        let varDayIni = var1[0];

        let var2    = dateFin.split('/');
        let varYearFin = var2[2];
        let varMonthFin = var2[1];
        let varDayFin = var2[0];

        var IniDiff = moment([varYearIni, varMonthIni, varDayIni]);
        var FinDiff = moment([varYearFin, varMonthFin, varDayFin]);
        if(FinDiff>=IniDiff){
            let resultDiff = Math.abs(FinDiff.diff(IniDiff, 'days'))+1;
            this.licencia.dias = resultDiff;
            $('#fechaInicioReq').removeClass('state-error');
            $('#fechaInicioReq').parent().removeClass('state-error');
            $('#fechaFinReq').removeClass('state-error');
            $('#fechaFinReq').parent().removeClass('state-error');
        }else{
            this.msgs.push({severity:'error', summary:'Ingrese una fecha menor a la Fecha Fin', detail:'Runakuna Error'});
            $('#fechaInicioReq').addClass('invalid').removeClass('required');
            $('#fechaInicioReq').parent().addClass('state-error').removeClass('state-success');
        }
    }

    onActualizarLicenciaEmpleado(){

        if(this.licencia.nombreEmpleado === undefined || this.licencia.nombreEmpleado == null || this.licencia.nombreEmpleado==''){
            this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'Ingrese el nombre del Empleado.'});
            return;
        }

        if(this.validarRequerido()){
            this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'Ingrese los campos obligatorios.'});
            return;
        }
        this.licencia.documentos = this.view;
        this.licencia.periodoEmpleado = this.periodoEmpleadoActual;
        this.licencia.idEmpleado = this.empleado.idEmpleado;
        this.licencia.idAtendidoPor = this.historiaLaboralActual.idJefeInmediato;

        this.empleadoService.guardarLicenciaEmpleado(this.licencia).subscribe(
            data => {

                this.backendService.notification(this.msgs, data);

                if (data.codigo == 1) {
                    setTimeout(() => {
                        this.navegarBusquedaLicencias(data);
                    }, 3000);
                }

            },
            error => {
                this.backendService.notification(this.msgs, error);
            }

        );

    }

    onAprobarLicenciaEmpleado(){
        this.licencia.estado='A';
        if(this.licencia.nombreEmpleado === undefined || this.licencia.nombreEmpleado == null || this.licencia.nombreEmpleado==''){
            this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'Ingrese el nombre del Empleado.'});
            return;
        }

        if(this.validarRequerido()){
            this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'Ingrese los campos obligatorios.'});
            return;
        }
        this.licencia.documentos = this.view;
        this.licencia.periodoEmpleado = this.periodoEmpleadoActual;
        this.licencia.idEmpleado = this.empleado.idEmpleado;
        this.licencia.idAtendidoPor = this.historiaLaboralActual.idJefeInmediato;

        this.empleadoService.aprobarLicenciaEmpleado(this.licencia).subscribe(
            data => {

                this.backendService.notification(this.msgs, data);

                if (data.codigo == 1) {
                    setTimeout(() => {
                        this.navegarBusquedaLicencias(data);
                    }, 3000);
                }

            },
            error => {
                this.backendService.notification(this.msgs, error);
            }

        );

    }

    onValidarLicenciaEmpleado(){
        this.licencia.estado='V';
        if(this.licencia.nombreEmpleado === undefined || this.licencia.nombreEmpleado == null || this.licencia.nombreEmpleado==''){
            this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'Ingrese el nombre del Empleado.'});
            return;
        }

        if(this.validarRequerido()){
            this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'Ingrese los campos obligatorios.'});
            return;
        }
        this.licencia.documentos = this.view;
        this.licencia.periodoEmpleado = this.periodoEmpleadoActual;
        this.licencia.idEmpleado = this.empleado.idEmpleado;
        this.licencia.idAtendidoPor = this.historiaLaboralActual.idJefeInmediato;

        this.empleadoService.validarLicenciaEmpleado(this.licencia).subscribe(
            data => {

                this.backendService.notification(this.msgs, data);

                if (data.codigo == 1) {
                    setTimeout(() => {
                        this.navegarBusquedaLicencias(data);
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

        if(this.historiaLaboralActual.idJefeInmediato === undefined || this.historiaLaboralActual.idJefeInmediato == null){
            $('#idJefeInmediatoReq').addClass('invalid').removeClass('required');
            $('#idJefeInmediatoReq').parent().addClass('state-error').removeClass('state-success');
            $('#idJefeInmediatoReq').css('border','2px solid red');
            validacion = true;
        }
        if(this.licencia.idTipoLicencia === undefined || this.licencia.idTipoLicencia == null){
            $('#idTipoLicenciaReq').addClass('invalid').removeClass('required');
            $('#idTipoLicenciaReq').parent().addClass('state-error').removeClass('state-success');
            $('#idTipoLicenciaReq').css('border','2px solid red');
            validacion = true;
        }

        if(this.licencia.comentario=== undefined || this.licencia.comentario == null || this.licencia.comentario==''){
            $('#comentarioReq').addClass('invalid').removeClass('required');
            $('#comentarioReq').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        if(this.licencia.fechaInicio === undefined || this.licencia.fechaInicio == null || this.licencia.fechaInicio==''){
            $('#fechaInicioReq').addClass('invalid').removeClass('required');
            $('#fechaInicioReq').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        if(this.licencia.fechaFin === undefined || this.licencia.fechaFin == null || this.licencia.fechaFin==''){
            $('#fechaFinReq').addClass('invalid').removeClass('required');
            $('#fechaFinReq').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        return validacion;
    }

    navegarBusquedaLicencias(data:NotificacionResult){
        this.location.back();
    }

    onRegresarBusquedaLicencia(){
        this._router.navigate(['/gestionTiempo/busquedaLicencias']);
    }
    /*onAprobarLicenciaEmpleado(){
        this.licencia.estado='A';
        this.onActualizarLicenciaEmpleado();
    }*/

    /*onValidarLicencia() {
        this.licencia.estado='V';
        this.onActualizarLicenciaEmpleado();
    }*/

    onRechazar() {
        this.licencia.estado='R';
        this.onActualizarLicenciaEmpleado();
    }

    public cargarMotivoRechazo(): void {
        this.motivoLicenciaRechazoComponent.titulo="Denegacion"
        this.motivoLicenciaRechazoComponent.dataItem=this.licencia;
        this.motivoLicenciaRechazoComponent.onShow();

    }

    private obtenerHistoriaLaboralActual(empleado: Empleado) {
        this.permisoService.obtenerHistoriaLaboralActual(empleado).subscribe(
            historiaLaboral => {this.historiaLaboralActual = historiaLaboral;this.historiaLaboralActual.idJefeInmediato = this.licencia.idAtendidoPor;},
            error =>  this.errorMessage = <any>error);
    }

    private obtenerHistoriaLaboralLicencia(busquedaLicencia: LicenciaFilter) {
        this.permisoService.obtenerHistoriaLaboralLicencia(busquedaLicencia).subscribe(
            historiaLaboral => this.navegarDashboardLicencia(historiaLaboral),
            error =>  this.errorMessage = <any>error);
    }
    private obtenerPeriodoEmpleadoActual(empleado: Empleado) {
        this.permisoService.obtenerPeriodoEmpleadoActual(empleado).subscribe(
            periodoEmpleado => this.periodoEmpleadoActual = periodoEmpleado,
            error =>  this.errorMessage = <any>error);
    }

    goBack(): void {

        this.location.back();
    }

    /* NOTIFICATION */
    navegarDashboardLicencia(data:HistorialLaboral){

        this.historiaLaboralActual.jefeInmediato = data.jefeInmediato;
        if(data.jefeInmediato == null){
            this.mensaje = 'No estÃƒÂ¡ asignado a un Jefe Inmediato';
            this.historiaLaboralActual.jefeInmediato == null;
            //this.licencia = new Licencia();

        }

        else if(data.jefeInmediato != null){
            this.mensaje = 'Jefe Inmediato es'+data.jefeInmediato;

        }


    }

    onChangeHoraInicio(value){
        this.licencia.horaInicio = value;
        $('#horaInicio').removeClass('state-error');
        $('#horaInicio').parent().removeClass('state-error');
    }

    onChangeHoraFin(value){
        this.licencia.horaFin = value;
        $('#horaFin').removeClass('state-error');
        $('#horaFin').parent().removeClass('state-error');
    }


}
