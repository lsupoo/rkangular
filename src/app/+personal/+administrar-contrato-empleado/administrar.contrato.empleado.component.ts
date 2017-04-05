import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {Empleado} from "../../+dto/maintenance/empleado";
import {NotificacionResult} from "../../+dto/NotificacionResult";
import {PermisoService} from "../../+common/service/permiso.service";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {NotificationsService} from "angular2-notifications/src/notifications.service";
import {Moneda} from "../../+dto/maintenance/moneda";
import {Contrato} from "../../+dto/maintenance/contrato";
import {environment} from "../../../environments/environment";
import {ContratoService} from "../../+common/service/contrato.service";
import {StorageResult} from "../../+dto/storageResult";
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {HistorialLaboral} from "../../+dto/maintenance/historialLaboral";
import {ComponentBase} from "../../+common/service/componentBase";
import {GeneralTextMask} from "../../+common/Utils/generalTextMask";
import {BackendService} from "../../+rest/backend.service";

declare var $: any;

@Component({
  selector: 'sa-administrar-contrato-empleado',
  templateUrl: 'administrar.contrato.empleado.component.html',
  providers: [PermisoService, ContratoService, NotificationsService]
})
export class AdministrarContratoEmpleadoComponent extends ComponentBase{

    public mensaje:string;

    private idEmpleadoTemp:number = 0;

    public defaultItemMoneda:Moneda={idMoneda:null,nombre:'Seleccionar'};

    private monedas:Moneda[]=[];

    private contrato:Contrato = new Contrato();

    private isEdit:boolean=false;

    private isPendiente:boolean=false;



    private classEdit:string='input';

    public contratosTrabajo:TablaGeneralResult[];

    public empleado:Empleado = new Empleado();
    public currencyMask = GeneralTextMask.currencyMask;
    //NotificacionResult
    public options = {
        timeOut: 3000,
        lastOnBottom: true,
        clickToClose: true,
        maxLength: 0,
        maxStack: 7,
        showProgressBar: false,
        pauseOnHover: true,
        preventDuplicates: false,
        preventLastDuplicates: 'visible',
        rtl: false,
        animate: 'scale',
        position: ['right', 'top']
    };

    private fotoEmpleado:string = '';
    private nombreCompletoEmpleado:string = '';

    constructor(private _service: NotificationsService,
                public backendService:BackendService,
                private route:ActivatedRoute,
                private _router: Router,
                private empleadoService:EmpleadoService,
                private permisoService:PermisoService,
                private contratoService:ContratoService) {

        super(backendService, '');


        let isNewContrato:boolean = this.empleadoService.retrieveSessionStorage('isNewContrato');

        let idEmpleado:number = this.empleadoService.retrieveSessionStorage('idEmpleado');

        this.idEmpleadoTemp = idEmpleado;

        this.obtenerEmpleadoCabecera(idEmpleado);
         this.obtenerMonedas();

        if(isNewContrato){

            this.isPendiente = true;
             this.isEdit = false;
            this.obtenerEmpleado(idEmpleado);
            this.obtenerHistorialLaboralContratoEmpleado(idEmpleado);

        }else{
            let idContrato:number = this.empleadoService.retrieveSessionStorage('idContrato');
            this.obtenerContratoEmpleado(idContrato);


        }
        this.getContratosTrabajo();
    }

    obtenerEmpleadoCabecera(idEmpleado: number){
        this.empleadoService.obtenerEmpleadoCabecera(idEmpleado).subscribe(
            data => this.cargarEmpleadoCabecera(data),
            error => this.errorMessage = <any>error
        );
    }

    cargarEmpleadoCabecera(data:Empleado){

        this.nombreCompletoEmpleado = data.nombreCompletoEmpleado;

        if(data.fotoPerfil != null) {
            this.fotoEmpleado = "data:image/jpeg;base64," +  data.fotoPerfil.contenidoArchivo;
            $('#fotoEmpleado').prop("style","display: block; border-radius: 4px 4px; height: 100px");
            $('#iconPerson').prop("class","");
        }
    }

    private getContratosTrabajo() {
        this.contratosTrabajo = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Empleado.ContratoTrabajo' === grupo.grupo);
    }

    obtenerEmpleado(idEmpleado: number){
        this.empleadoService.obtenerEmpleado(idEmpleado).subscribe(
            data => this.cargarDatosEmpleado(data),
            error => this.errorMessage = <any>error
        );
    }

    obtenerHistorialLaboralContratoEmpleado(idEmpleado: number){
        this.contratoService.obtenerHistorialLaboralPorContratoEmpleado(idEmpleado).subscribe(
            data => this.cargarDatosHistorialEmpleado(data),
            error => this.errorMessage = <any>error
        );
    }

    cargarDatosHistorialEmpleado(data:HistorialLaboral){
        this.contrato.idMoneda = data.idMoneda;
        this.contrato.salario = data.salario;
    }

    cargarDatosEmpleado(empleado:Empleado){

        this.contrato.direccion = empleado.direccionDomicilio;
        this.contrato.tipoDocumento = empleado.tipoDocumentoString;
        this.contrato.numeroDocumento = empleado.numeroDocumento;

        this.contrato.nombreCompletoEmpleado = empleado.nombre+' '+empleado.apellidoPaterno+' '+empleado.apellidoMaterno;

        this.contrato.tipoContrato = empleado.contratoTrabajo;
        this.contrato.tipoContratoString = empleado.contratoTrabajoString;
    }

    obtenerContratoEmpleado(idContrato:number){

        this.contratoService.obtenerContratoEmpleado(idContrato).subscribe(
            data => this.cargarContratoEmpleado(data),
            error => error
        );

    }

    cargarContratoEmpleado(contrato:Contrato){
        if(contrato.estado == 'P'){
            this.isPendiente = true;
        }else{
            this.isPendiente = false;
        }
        this.isEdit = true;
        this.idEmpleadoTemp = contrato.idEmpleado;
        this.contrato = contrato;

    }

    obtenerMonedas() {

        this.monedas = this.storageCommomnValueResult.moneda;
    }

    onRegresarContratoEmpleado(){
        this.empleadoService.storeSessionStorage('isNewContrato',true);
        this.empleadoService.storeSessionStorage('idContrato',undefined);
        this._router.navigate(['/personal/contratoEmpleado']);
    }

    onChangeFechaInicio(value){
        this.contrato.fechaInicio= value;

        $('#fechaInicio').parent().removeClass('state-error');

        this.contrato.fechaFin= undefined;

        this.contrato.duracion = 'Indeterminado';
    }

    onChangeFechaFin(value){
        this.contrato.fechaFin= value;

        if(this.contrato.fechaInicio === undefined || this.contrato.fechaInicio == null || this.contrato.fechaInicio=='' ){
            return;
        }

        let fechaInicioCadena:string[] = this.contrato.fechaInicio.split('/');
        let fechaFinCadena:string[] = this.contrato.fechaFin.split('/');

        let fechaIni:Date= new Date( parseInt(fechaInicioCadena[2]),parseInt(fechaInicioCadena[1])-1,parseInt(fechaInicioCadena[0]));

        let fechaFin:Date= new Date( parseInt(fechaFinCadena[2]),parseInt(fechaFinCadena[1])-1,parseInt(fechaFinCadena[0]));

        fechaFin.setDate(fechaFin.getDate()+1);
        this.duration(fechaIni, fechaFin);
    }

    ingresaCargo(){
        $('#cargo').parent().removeClass('state-error');
    }

    ingresaSalario(){
        $('#salario').parent().removeClass('state-error');
    }

    validarRequerido(){
        let validacion = false;

        if(this.contrato.fechaInicio === undefined || this.contrato.fechaInicio == null || this.contrato.fechaInicio=='' ){
            $('#fechaInicio').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        if(this.contrato.fechaFin === undefined || this.contrato.fechaFin == null || this.contrato.fechaFin=='' ){
            $('#fechaFin').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        if(this.contrato.cargo === undefined || this.contrato.cargo == null  || this.contrato.cargo=='' ){
            $('#cargo').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        if(this.contrato.idMoneda === undefined || this.contrato.idMoneda == null){

            validacion = true;
        }

        if(this.contrato.salario === undefined || this.contrato.salario == null ){
            $('#salario').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        return validacion;
    }

    onRegistrarContratoEmpleado(){

        this.contrato.idEmpleado = this.idEmpleadoTemp;

        if(this.validarRequerido()){
            this._service.error("Error", 'Ingrese los campos obligatorios.');
            return;
        }

        this.contratoService.registrarContratoEmpleado(this.contrato).subscribe(
            data => {
                this.navegarContratoEmpleado(data);
            },
            error => error
        );

    }

    onAprobarContratoEmpleado(){

        this.contrato.idEmpleado = this.idEmpleadoTemp;

        if(this.validarRequerido()){
            this._service.error("Error", 'Ingrese los campos obligatorios.');
            return;
        }

        this.empleadoService.aprobarContratoEmpleado(this.contrato).subscribe(
            data => {
                this.navegarContratoEmpleado(data);
            },
            error => error
        );

    }

    public onEliminarContrato(): void {

        this.contratoService.eliminarContrato(this.contrato.idContrato).subscribe(
            data => {
                this.notificacionEliminar(data)
            },
            error => this.errorMessage = <any>error
        );

    }

    public notificacionEliminar(data:NotificacionResult){
        if(data.codigo == 1){
            this.empleadoService.storeSessionStorage('isNewContrato',true);
            this.empleadoService.storeSessionStorage('idContrato',undefined);
            this._router.navigate(['/personal/contratoEmpleado']);
        }
        else if(data.codigo == 0){
            this._service.error("Error", data.mensaje);
        }

    }

    public onDescargarContrato(): void {

        if(this.validarRequerido()){
            this._service.error("Error", 'Ingrese los campos obligatorios.');
            return;
        }

        if ($("#export_file").length > 0) {
            $("#export_file").remove();
        }
        if ($("#export_file").length === 0) {
            var iframe = $("<iframe src='' name='export_file' id='export_file'></iframe>");
            iframe.appendTo("body");

            var form = $("<form action='"+this.urlDowloadFileJasper +"' method='post' target='export_file'></form>");
            form.append($("<input type='hidden' name='nombre' id='nombre' />").attr("value",this.contrato.nombreCompletoEmpleado));
            form.append($("<input type='hidden' name='domicilio' id='domicilio' />").attr("value",this.contrato.direccion));
            form.append($("<input type='hidden' name='cargo' id='cargo' />").attr("value",this.contrato.cargo));
            form.append($("<input type='hidden' name='dni' id='dni' />").attr("value",this.contrato.numeroDocumento));
            form.append($("<input type='hidden' name='sueldo' id='sueldo' />").attr("value",this.contrato.salario));
            form.append($("<input type='hidden' name='fechaInicio' id='fechaInicio' />").attr("value",this.contrato.fechaInicio));
            form.append($("<input type='hidden' name='fechaFin' id='fechaFin' />").attr("value",this.contrato.fechaFin));
            form.append($("<input type='hidden' name='plazo' id='plazo' />").attr("value",this.contrato.duracion));


            form.appendTo("body");

            form.submit();
        }

    }

    navegarContratoEmpleado(data:NotificacionResult){
        if(data.codigo == 1){
            this.empleadoService.storeSessionStorage('isNewContrato',true);
            this.empleadoService.storeSessionStorage('idContrato',undefined);
            this._router.navigate(['/personal/contratoEmpleado']);
        }
        else if(data.codigo == 0){
            this._service.error("Error", data.mensaje);
        }
    }

    private duration(fechaInicio:Date, fechaFin:Date) {

        let years:number=0;
        let months:number=0;
        let days:number=0;


        if (fechaInicio >= fechaFin) {
            this.contrato.duracion = undefined;
           return;
        }

        //anios
        if(fechaFin.getFullYear() > fechaInicio.getFullYear()){
            years = (fechaFin.getFullYear() - fechaInicio.getFullYear());
        }

        if(fechaInicio.getMonth() == fechaFin.getMonth()){
            if(fechaInicio.getDate()> fechaFin.getDate()){
                years = years - 1;
            }
        }

        if(fechaInicio.getMonth() > fechaFin.getMonth()){
            years = (years - 1);
        }

        //Meses

         if(fechaInicio.getFullYear() == fechaFin.getFullYear()) {
             if(fechaFin.getMonth() > fechaInicio.getMonth()){
                 months = fechaFin.getMonth() - fechaInicio.getMonth();
                 if(fechaFin.getDate() < fechaInicio.getDate()){
                     months = months -1;
                 }

             }
         }else{

             if(fechaFin.getMonth() > fechaInicio.getMonth()){
                 months = fechaFin.getMonth() - fechaInicio.getMonth();
             }else if(fechaFin.getMonth() == fechaInicio.getMonth()){
                 if(fechaFin.getDate() >= fechaInicio.getDate()){
                     months = fechaFin.getMonth() - fechaInicio.getMonth();
                 }else {
                     months = 11;
                 }
             }else {
                months = 12 - fechaInicio.getMonth() + fechaFin.getMonth();
                 if(fechaFin.getDate() < fechaInicio.getDate()){
                     months = months -1;
                 }
            }
         }

         //dias
         if(fechaFin.getMonth() == fechaInicio.getMonth()){
                if(fechaFin.getDate() > fechaInicio.getDate()){
                    days = fechaFin.getDate() - fechaInicio.getDate();
                }

         }else if(fechaFin.getDate() < fechaInicio.getDate()){
            let fechaCal:Date= new Date(fechaInicio.getFullYear(),fechaInicio.getMonth(),fechaInicio.getDate());
            fechaCal.setMonth(fechaCal.getMonth() + months);
            fechaCal.setDate(fechaCal.getDate()+1);

            //if(fechaFin.getDate() < fechaInicio.getDate()) {

                let interval = fechaFin.getTime() - fechaCal.getTime();
                days = interval / (1000 * 60 * 60 * 24);
            //}
        }else{
             days = fechaFin.getDate() - fechaInicio.getDate();
         }

        months = months + (years*12);

        let duracion:string='';
        let concat:string='';

        if(months == 1){
            duracion = months+' mes';
            concat=' y ';
        }else if(months > 1){
            duracion = months+' meses';
            concat=' y ';
        }

        if(days == 1){
            duracion = duracion + concat +days+' día';
        }else if(days > 1){
            duracion = duracion + concat +days+' días';
        }

        this.contrato.duracion = duracion;

    }

}
