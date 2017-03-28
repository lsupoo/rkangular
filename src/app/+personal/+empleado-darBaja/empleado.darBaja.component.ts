import {Component, OnInit, EventEmitter, Output, ViewChild} from "@angular/core";
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {Empleado} from "../../+dto/maintenance/empleado";
import {SuccessEvent, FileRestrictions, UploadLocalization} from "@progress/kendo-angular-upload";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {EquipoEntregado} from "../../+dto/maintenance/equipoEntregado";
import {Router} from "@angular/router";
import {environment} from "../../../environments/environment";
import {Adjunto} from "../+empleado/adjunto";
import {NotificacionResult} from "../../+dto/NotificacionResult";
import {DocumentoEmpleado} from "../../+dto/maintenance/documentoEmpleado";
import {StorageResult} from "../../+dto/storageResult";
import {Http} from "@angular/http";
import {ComponentBase} from "../../+common/service/componentBase";
import {EquiposPendientesComponent} from "./equipos.pendientes";
import {BackendService} from "../../+rest/backend.service";
declare var $: any;

/**
 * Created by josediaz on 8/11/2016.
 */

@Component({
    selector: 'darBaja',
    templateUrl: 'empleado.darBaja.component.html'
})
export class DarbajaComponent extends ComponentBase implements OnInit {

    public empleadoDarBaja: Empleado = new Empleado();
    public idEmpleado:Empleado= new Empleado();
    public motivoRenunciaSelect: TablaGeneralResult;
    public motivoRenuncia:TablaGeneralResult[];
    equiposPendientesDevo: EquipoEntregado[];
    public defaultItemTablaGeneral: TablaGeneralResult = new TablaGeneralResult(null,'Todos');

    public showWidget: boolean;

    @Output() cancel: EventEmitter<any> = new EventEmitter();
    @Output() save: EventEmitter<any> = new EventEmitter();

    nombreDocumento:string;
    contenidoArchivo:string;
    nombreArchivo:string;
    contentTypeArchivo:string;

    private view: Array<DocumentoEmpleado>=[];

    uploadLocalization: UploadLocalization = {
        select: "Cargar"
    }

    public uploadSaveUrl:string = this.urlUploadFile;
    public uploadRemoveUrl:string = this.urlRemoveFile;

    public fotoEmpleado: string = '';
    public nombreCompletoEmpleado:string = '';

    public uploadValidation: FileRestrictions = {
        allowedExtensions:[".doc",".docx",".pdf",".xlsx",".xls"]
    };
    @ViewChild(EquiposPendientesComponent) protected equiposPendientesComponent: EquiposPendientesComponent;
    private messageActive=false;
    constructor(private empleadoService: EmpleadoService,
                public backendService: BackendService,
                private _router: Router){

        super(backendService,'AU003');
        //this.storageCommomnValueResult = JSON.parse(localStorage.getItem('localStorageCommonsValues'));
        this.nombreDocumento = "";
        this.contenidoArchivo = "";
        this.nombreArchivo = "";
        this.contentTypeArchivo = "";
        
        this.idEmpleado = JSON.parse(sessionStorage.getItem("darBajaEmpleadoSessionData") || '{}');

        this.empleadoDarBaja.idEmpleado = this.idEmpleado.idEmpleado;

        this.obtenerEmpleado(this.idEmpleado.idEmpleado);

        this.getMotivoRenuncia();
        this.getEquiposPendientesDevolucion();
        this.countEquiposPendientes();
        
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

    public onSuccessUpload(event:SuccessEvent){
        let file: Adjunto = event.response.json();
        this.contenidoArchivo = file.content;
        this.nombreArchivo = file.name;
        this.contentTypeArchivo = file.contentType;
    }

    public onEdit(dataItem: any): void {

        if(dataItem.estado == 'P'){
            this.empleadoService.storeDataHorasExtra(dataItem);
            this._router.navigate(['/personal/administrarHorasExtra']);
        }else if(dataItem.estado == 'A'){
            this.empleadoService.storeDataHorasExtra(dataItem);
            this._router.navigate(['/personal/administrarHorasExtra']);
        }else if(dataItem.estado == 'R'){
            this.empleadoService.storeDataHorasExtra(dataItem);
            this._router.navigate(['/personal/administrarHorasExtra']);
        }
        
    }

    ngOnInit() {


    }

    /* VALIDACIONES */
    validarRequerido():boolean{

        let validacion = false;
        if(this.empleadoDarBaja.fechaRenuncia === undefined || this.empleadoDarBaja.fechaRenuncia == null || this.empleadoDarBaja.fechaRenuncia=='' ){
            $('#fechaRenuncia').addClass('invalid').removeClass('required');
            $('#fechaRenuncia').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }
        if(this.empleadoDarBaja.fechaCese === undefined || this.empleadoDarBaja.fechaCese == null || this.empleadoDarBaja.fechaCese=='' ){
            $('#fechaCese').addClass('invalid').removeClass('required');
            $('#fechaCese').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }
        if(this.motivoRenunciaSelect === undefined || this.motivoRenunciaSelect == null ){
            $('#motivoRenuncia').addClass('invalid').removeClass('required');
            $('#motivoRenuncia').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        return validacion;
    }
    private validarValoresSeleccionados() {

        if (this.empleadoDarBaja.fechaRenuncia === undefined) this.empleadoDarBaja.fechaRenuncia = '';
        if (this.empleadoDarBaja.fechaCese === undefined) this.empleadoDarBaja.fechaCese = '';
        

        (this.motivoRenunciaSelect === undefined || this.motivoRenunciaSelect == null) ? this.empleadoDarBaja.motivoRenuncia = ''
            : this.empleadoDarBaja.motivoRenuncia = this.empleadoDarBaja.codigo;

    }

    onChangeFechaRenuncia(value){
        this.empleadoDarBaja.fechaRenuncia = value;
    }

    onChangeFechaCese(value){
        this.empleadoDarBaja.fechaCese = value;
    }

    private getMotivoRenuncia() {
        this.motivoRenuncia = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'BajaDeEmpleado.Motivo' === grupo.grupo);
    }

    private getEquiposPendientesDevolucion(){
        this.empleadoService.obtenerEquiposPendientesDevolucion(this.empleadoDarBaja.idEmpleado).subscribe(
            equiposPendientesDevo =>

                    this.equiposPendientesDevo = equiposPendientesDevo

            ,
            error => this.errorMessage = <any>error
        );
    }
    private countEquiposPendientes() {
        this.empleadoService.countEquiposPendientes(this.empleadoDarBaja).subscribe(
            data => {
                this.navegarDashboard(data);
            }
        )
    }

    onRegresarVerEmpleado(){
        this._router.navigate(['/personal/verEmpleado']);
    }

    onRegresarBusquedaEmpleado(){
        this._router.navigate(['/personal/busquedaEmpleado']);
    }

    public onRegistrarDarBajaEmpleado(e): void {
        e.preventDefault();

        if(this.validarRequerido()){
            this.mensaje = 'Ingrese los campos obligatorios';
            $( '#dialog-message' ).dialog( {
                modal: true,
                buttons: {
                    Ok: function() {
                        $( this ).dialog( "close" );
                    }
                }
            } );
            return;
        }

        this.empleadoDarBaja.documentos = this.view;
        this.empleadoDarBaja.idEmpleado = this.idEmpleado.idEmpleado;
        this.empleadoService.registrarDarBajaEmpleado(this.empleadoDarBaja).subscribe(
                data => {
                    this.navegarDashboard(data)
                }
        );

    }

    /* NOTIFICATION */
    navegarDashboard(data:NotificacionResult){

        if(data.codigo == 1){
            this.mensaje = data.mensaje;
            this.showWidget = true;
            this.empleadoDarBaja = new Empleado();
            /*$( '#dialog-message' ).dialog( {
                modal: true,
                buttons: {
                    Ok: function() {
                        $( this ).dialog( "close" );
                    }
                }
            } );*/
            //this.cargarMensajeEquiposPendientes();
            this.messageActive=true;

        }

        else if(data.codigo == 0){
            this.mensaje = data.mensaje;
            /*$( '#dialog-message' ).dialog( {
                modal: true,
                buttons: {
                    Ok: function() {
                        $( this ).dialog( "close" );
                    }
                }
            } );*/
        }

    }
    backBusquedaEmpleadoDashboard(data:NotificacionResult){

        if(data.codigo == 1){
            this.mensaje = data.mensaje;
            this.onRegresarBusquedaEmpleado();
            this.empleadoDarBaja = new Empleado();
            $( '#dialog-message' ).dialog( {
                modal: true,
                buttons: {
                    Ok: function() {
                        $( this ).dialog( "close" );
                    }
                }
            } );

        }

        else if(data.codigo == 0){
            this.mensaje = data.mensaje;
            $( '#dialog-message' ).dialog( {
                modal: true,
                buttons: {
                    Ok: function() {
                        $( this ).dialog( "close" );
                    }
                }
            } );
        }

    }

    public onClose() {
        this.closeForm();
    }
    public onCancel(e) {
        e.preventDefault();
        this.closeForm();
    }
    public closeForm(){
        this.messageActive = false;
        //this.cancel.emit();
    }

}