import {Component, OnInit, EventEmitter,ViewChild} from '@angular/core';
import { Location } from '@angular/common';
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {PermisoService} from "../../+common/service/permiso.service";
import {PeriodoEmpleado} from "../../+dto/maintenance/periodoEmpleado";
import {Empleado} from "../../+dto/maintenance/empleado";
import {HistorialLaboral} from "../../+dto/maintenance/historialLaboral";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {Licencia} from "../../+dto/maintenance/licencia";
import {LicenciaFilter} from "../../+dto/licenciaFilter";
import {CompleterData, CompleterService} from "ng2-completer";
import {TipoLicencia} from "../../+dto/maintenance/tipoLicencia";
import {DocumentoEmpleado} from "../../+dto/maintenance/documentoEmpleado";
import {Observable} from "rxjs";
import {LicenciaDocumentEditComponent} from "./solicitar.licencia.edit.form";
import {NotificationsService} from "angular2-notifications/src/notifications.service";
import {Router} from "@angular/router";
import {StoreSessionFilter} from "../../+dto/storeSessionFilter";
import {LicenciaService} from "../../+common/service/licencia.service";
import {ComponentBase} from "../../+common/service/componentBase";
import {Message} from "primeng/components/common/api";
import {BackendService} from "../../+rest/backend.service";
import {PageChangeEvent} from "@progress/kendo-angular-grid";

declare var $: any;
var moment = require('moment');

@Component({
    selector: 'administrar-licencia',
    templateUrl: 'solicitar.licencia.component.html',
    providers: [NotificationsService]
})
export class SolicitarLicenciaComponent extends ComponentBase implements OnInit {

    public defaultItem:TablaGeneralResult={codigo:null,nombre:'Seleccionar',grupo:null};
    public licencia:Licencia= new Licencia();
    msgs: Message[] = [];
    private confirmActive=false;

    private periodoEmpleadoActual: PeriodoEmpleado = new PeriodoEmpleado();
    public empleado:Empleado = new Empleado();

    public historiaLaboralActual: HistorialLaboral = new HistorialLaboral();
    storeSessionFilter: StoreSessionFilter = new StoreSessionFilter();

    busquedaLicencias: LicenciaFilter = new LicenciaFilter();
    public tipoLicencia: TipoLicencia[];

    private historiasLaboralesActuales: HistorialLaboral[] = [];

    private defaultItemHistoriaLaboral: HistorialLaboral = new HistorialLaboral();

    private dataServiceEmpleado:CompleterData;

    private showHoraInicioFin: boolean = true;

    public isCheckedTodoDia:boolean=true;

    private idJefeInmediatoDefault:number;

    //Document
    private skip: number = 0;
    private pageSize: number = 10;
    private view: Array<DocumentoEmpleado>=[];
    public dataItem: DocumentoEmpleado;
    @ViewChild(LicenciaDocumentEditComponent) protected editFormComponent: LicenciaDocumentEditComponent;

    constructor(private empleadoService: EmpleadoService,
                private licenciaService: LicenciaService,
                private _router: Router,
                public backendService: BackendService,
                private permisoService:PermisoService,
                private completerService: CompleterService,
                private location: Location) {

        super(backendService,'AU005');

        this.dataServiceEmpleado = completerService.remote(this.urlAutocompleteEmpleado,'nombreEmpleado','nombreEmpleado');

        this.defaultItemHistoriaLaboral.idJefeInmediato = null;
        this.defaultItemHistoriaLaboral.jefeInmediato = 'Seleccionar';

        this.isCheckedTodoDia = true;

        this.licencia.diaEntero = true;

        this.empleado.idEmpleado = this.currentUser.idEmpleado;

        let idEmpleado = this.currentUser.idEmpleado;

        this.obtenerHistoriaLaborales(idEmpleado);

        this.obtenerPeriodoEmpleadoActual(this.empleado);

        this.getTipoLicencias();
    }
    private obtenerLicenciaById(idLicencia: any): void{
        this.licenciaService.obtenerLicenciaById(idLicencia).subscribe(
            data => this.showDetail(data),
            error => this.errorMessage = <any>error
        );
    }
    showDetail(data:Licencia){

        this.licencia = data;
        this.empleado.idEmpleado = this.licencia.idEmpleado;
        this.obtenerHistoriaLaborales(this.empleado.idEmpleado);
        this.obtenerHistoriaLaboralActual(this.empleado);
        this.obtenerPeriodoEmpleadoActual(this.empleado);

    }

    private obtenerHistoriaLaborales(idEmpleado: number) {
        this.permisoService.obtenerHistoriasLaboralesPorEmpleado(idEmpleado).subscribe(
            historiaLaboral => this.validateDataJefeInmediato(historiaLaboral),
            error =>  this.errorMessage = <any>error);
    }

    validateDataJefeInmediato(historialLaboral: HistorialLaboral[]){
        if(historialLaboral.length!=0){
            this.historiasLaboralesActuales = historialLaboral;
            if(historialLaboral.length == 1){
                this.historiaLaboralActual.idJefeInmediato = historialLaboral[0].idJefeInmediato;
                this.idJefeInmediatoDefault = historialLaboral[0].idJefeInmediato;
            }
        }else{
            this.historiasLaboralesActuales = historialLaboral;
        }
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

    public onCancel(e): void {
        e.preventDefault();
        this.closeForm();
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
        }else
            this.busquedaLicencias.idEmpleado = null;
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
    selectDiaEntero(value){
        if(value){
            this.showHoraInicioFin = false;
        }else{
            this.showHoraInicioFin = true;
        }
    }

    cambiarTodoDia(value){
        let isChecked:boolean = value.target.checked;
        this.isCheckedTodoDia = isChecked;
    }

    onGuardarLicenciaEmpleado(){
        this.licencia.documentos = this.view;

        this.licencia.idEmpleado=this.empleado.idEmpleado;
        this.empleadoService.guardarLicenciaEmpleado(this.licencia).subscribe(
            data => {
                this.confirmActive = false;
                this.backendService.notification(this.msgs, data);
                if (data.codigo == 1) {
                    $('#btnGuardar').prop("disabled", true);
                }

            },
            error =>{
                this.confirmActive=false;
                this.backendService.notification(this.msgs, error);
            }
        );
    }
    onActualizarLicenciaEmpleado(){
        this.licencia.periodoEmpleado = this.periodoEmpleadoActual;
        this.licencia.documentos = this.view;
        this.licencia.idEmpleado = this.empleado.idEmpleado;
        this.licencia.idAtendidoPor = this.historiaLaboralActual.idJefeInmediato;

        this.blockedUI  = true;
        this.empleadoService.guardarLicenciaEmpleado(this.licencia).subscribe(
            data => {
                this.confirmActive=false;
                this.backendService.notification(this.msgs, data);
                if (data.codigo == 1) {
                    $('#btnGuardar').prop("disabled",true);
                }
                this.blockedUI  = false;
            },
            error =>{
                this.confirmActive=false;
                this.backendService.notification(this.msgs, error);
                this.blockedUI  = false;
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



    onRegresarBusquedaLicencia(){
        this.location.back();
    }
    onAprobarLicenciaEmpleado(){

    }


    private obtenerHistoriaLaboralActual(empleado: Empleado) {
        this.permisoService.obtenerHistoriaLaboralActual(empleado).subscribe(
            historiaLaboral => this.historiaLaboralActual = historiaLaboral,
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
            this.mensaje = 'No esta asignado a un Jefe Inmediato';
            this.historiaLaboralActual.jefeInmediato == null;
        }

        else if(data.jefeInmediato != null){
            this.mensaje = 'Jefe Inmediato es'+data.jefeInmediato;

        }

    }

    selectJefeInmediato(value){
        $('#idJefeInmediatoReq').css('border','none');

    }

    changeComentario(){
        $('#comentarioReq').parent().removeClass('state-error');
    }

    onChangeHoraInicio(value){
        this.licencia.horaInicio = value;
    }

    onChangeHoraFin(value){
        this.licencia.horaFin = value;
    }

    public showMessageLicencia(){
        if(this.validarRequerido()){
            this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'Ingrese los campos obligatorios.'});
            return;
        }else{
            this.confirmActive= true;
        }
    }

    public limpiarDatosLicencia(){
        this.historiaLaboralActual.idJefeInmediato = this.idJefeInmediatoDefault;
        this.licencia.idTipoLicencia=null;
        this.licencia.comentario="";
        this.licencia.horaFin="";
        this.licencia.fechaInicio=null;
        this.licencia.fechaFin=null;
        this.licencia.dias=null;
        this.licencia.diaEntero = true;
        this.licencia.documentos = null;
        this.view = new Array<DocumentoEmpleado>();
        $('#btnGuardar').prop("disabled",false);

    }
    public verSolicitudLicencia() {
        localStorage.setItem('tabActive','tab-active-9');
        this._router.navigate(['/autogestion/actualizarDatosPersonales']);
    }

    public onCloseLicencia() {
        this.closeForm();
    }
    public closeForm(){
        this.confirmActive= false;
    }

    protected pageChangeSolicitudLicencia(event: PageChangeEvent): void {
        this.skip = event.skip;

    }

}
