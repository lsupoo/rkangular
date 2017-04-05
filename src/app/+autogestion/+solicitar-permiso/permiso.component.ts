import {Component, OnInit,NgZone, Renderer, ElementRef, ViewChild} from "@angular/core";
import {PermisoEmpleado} from "../../+dto/maintenance/permisoEmpleado";
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {PermisoService} from "../../+common/service/permiso.service";
import {Empleado} from "../../+dto/maintenance/empleado";
import {HistorialLaboral} from "../../+dto/maintenance/historialLaboral";
import {PeriodoEmpleado} from "../../+dto/maintenance/periodoEmpleado";
import {NotificationsService} from "angular2-notifications/src/notifications.service";
import {ComponentBase} from "../../+common/service/componentBase";
import {Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError,Event as RouterEvent} from "@angular/router";
import {BackendService} from "../../+rest/backend.service";

declare var $: any;

@Component({
    selector: 'solicitar-permiso',
    templateUrl: 'solicitar.permiso.component.html',
    providers: [NotificationsService],
})
export class PermisoComponent extends ComponentBase implements OnInit {

    public defaultItem:TablaGeneralResult={codigo:null,nombre:'Seleccionar', grupo:null};

    private motivos:TablaGeneralResult[];

    private permisoEmpleado:PermisoEmpleado = new PermisoEmpleado();

    private isCompensarhoras:boolean=false;
    private isPersonal:boolean=false;

    private empleado:Empleado = new Empleado();

    private historiaLaboralActual: HistorialLaboral = new HistorialLaboral();
    private periodoEmpleadoActual: PeriodoEmpleado = new PeriodoEmpleado();

    private historiasLaboralesActuales: HistorialLaboral[] = [];
    private jefeInmediatoCombo:boolean = true;
    private messageValidation:string;

    private defaultItemHistoriaLaboral: any = {idJefeInmendiato:null, jefeInmediato:'Seleccionar'};

    es:any  = {firstDayOfWeek: 1,
        dayNames:["Domingo","Lunes","Martes","Miercoles","Jueves","Viernes","Sabado"],
        dayNamesShort:["Dom","Lun","Mar","Mie","Jue","Vie","Sab"],
        dayNamesMin:["Do","Lu","Ma","Mi","Ju","Vi","Sa"],
        monthNames:["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Setiembre","Octubre","Noviembre","Diciembre"],
        monthNamesShort:["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Set","Oct","Nov","Dic"]
    };

    // Instead of holding a boolean value for whether the spinner
    // should show or not, we store a reference to the spinner element,
    // see template snippet below this script
    @ViewChild('spinnerElement') spinnerElement: ElementRef;

    private confirmActive=false;
    constructor(public backendService: BackendService,
                private _router: Router,
                private permisoService:PermisoService,
                private ngZone: NgZone,
                private renderer: Renderer) {
        super(backendService,'AU002');
        this.empleado.idEmpleado = this.currentUser.idEmpleado;

        let idEmpleado = this.currentUser.idEmpleado;

        this.obtenerHistoriaLaborales(idEmpleado);
        this.obtenerPeriodoEmpleadoActual(this.empleado);
        this.getMotivosPermiso();

    }

    // Shows and hides the loading spinner during RouterEvent changes
    navigationInterceptor(event: RouterEvent): void {

        if (event instanceof NavigationStart) {

            // We wanna run this function outside of Angular's zone to
            // bypass change detection
            this.ngZone.runOutsideAngular(() => {

                // For simplicity we are going to turn opacity on / off
                // you could add/remove a class for more advanced styling
                // and enter/leave animation of the spinner
                this.renderer.setElementStyle(
                    this.spinnerElement.nativeElement,
                    'opacity',
                    '1'
                );
            });
        }
        if (event instanceof NavigationEnd) {
            this._hideSpinner();
        }

        // Set loading state to false in both of the below events to
        // hide the spinner in case a request fails
        if (event instanceof NavigationCancel) {
            this._hideSpinner
        }
        if (event instanceof NavigationError) {
            this._hideSpinner();
        }
    }

    private _hideSpinner(): void {

        // We wanna run this function outside of Angular's zone to
        // bypass change detection,
        this.ngZone.runOutsideAngular(() => {

            // For simplicity we are going to turn opacity on / off
            // you could add/remove a class for more advanced styling
            // and enter/leave animation of the spinner
            this.renderer.setElementStyle(
                this.spinnerElement.nativeElement,
                'opacity',
                '0'
            );
        });
    }

    ngOnInit() {
    }

    private getMotivosPermiso() {
        this.permisoService.completarComboBox('obtenerMotivosPermiso').subscribe(
            tablaGeneralDto => this.motivos = tablaGeneralDto,
            error =>  this.errorMessage = <any>error);
    }

    private obtenerHistoriaLaborales(idEmpleado: number) {
        this.permisoService.obtenerHistoriasLaboralesPorEmpleado(idEmpleado).subscribe(
            historiaLaboral => {this.validateDataJefeInmediato(historiaLaboral)},
            error =>  this.errorMessage = <any>error);
    }

    validateDataJefeInmediato(historialLaboral: HistorialLaboral[]){

        if(historialLaboral.length!=0){
            this.historiasLaboralesActuales = historialLaboral;
            if(historialLaboral.length == 1){
                this.permisoEmpleado.idAtendidoPor = historialLaboral[0].idJefeInmediato;
            }
        }else{
            this.jefeInmediatoCombo = false;
            this.messageValidation = "No se podra registrar la solicitud";
        }
    }

    private obtenerPeriodoEmpleadoActual(empleado: Empleado) {
        this.permisoService.obtenerPeriodoEmpleadoActual(empleado).subscribe(
            periodoEmpleado => this.periodoEmpleadoActual = periodoEmpleado,
            error =>  this.errorMessage = <any>error);
    }

    selectJefeInmediato(){
        $('#idAtendidoPor').css('border','none');
    }

    cargarTipoPermiso(value){
        $('#motivo').css('border','none');
        if(value == 'P'){
            this.isCompensarhoras=false;
            this.isPersonal=true;
        }else if(value == 'C'){
            this.isCompensarhoras=true;
            this.isPersonal=false;
            this.permisoEmpleado.fechaRecuperacion=undefined;
            this.permisoEmpleado.horaInicioRecuperacion=undefined;
            this.permisoEmpleado.horaFinRecuperacion=undefined;

            $('#datepickerHasta').removeClass('state-error');
            $('#datepickerHasta').parent().removeClass('state-error');

            $('#horaDesdeRecuperacion').removeClass('state-error');
            $('#horaDesdeRecuperacion').parent().removeClass('state-error');

            $('#horaHastaRecuperacion').removeClass('state-error');
            $('#horaHastaRecuperacion').parent().removeClass('state-error');
        } else {
            this.isCompensarhoras=false;
            this.isPersonal=false;
        }
    }

    onChangeHoraInicio(){
        $('#horaDesde').removeClass('state-error');
        $('#horaDesde').parent().removeClass('state-error');
    }

    onChangeHoraFin(){
        //this.permisoEmpleado.horaFin = value;
        $('#horaHasta').removeClass('state-error');
        $('#horaHasta').parent().removeClass('state-error');
    }

    onChangeFecha(value){
        this.permisoEmpleado.fecha = value;
        $('#datepickerDesde').removeClass('state-error');
        $('#datepickerDesde').parent().removeClass('state-error');
    }

    onChangeFechaRecuperacion(value){
        this.permisoEmpleado.fechaRecuperacion = value;
        $('#datepickerHasta').removeClass('state-error');
        $('#datepickerHasta').parent().removeClass('state-error');
    }

    searchDateParameter(){

        if (!this.isValidadCharacterDate)
            return;
        if(this.permisoEmpleado.fecha == null || this.permisoEmpleado.fecha === undefined){
            this.permisoEmpleado.fecha = this.inputDateInicioDatePicker;
        }
        if(this.permisoEmpleado.fechaRecuperacion == null || this.permisoEmpleado.fechaRecuperacion === undefined){
            this.permisoEmpleado.fechaRecuperacion = this.inputDateFinDatePicker;
        }
        $('#datepickerDesde').removeClass('state-error');
        $('#datepickerDesde').parent().removeClass('state-error');
        $('#datepickerHasta').removeClass('state-error');
        $('#datepickerHasta').parent().removeClass('state-error');


    }

    onChangeHoraInicioRecuperacion(){
        $('#horaDesdeRecuperacion').removeClass('state-error');
        $('#horaDesdeRecuperacion').parent().removeClass('state-error');
    }

    onChangeHoraFinRecuperacion(){
        $('#horaHastaRecuperacion').removeClass('state-error');
        $('#horaHastaRecuperacion').parent().removeClass('state-error');
    }

    validateValuesRequired(){
        let fechaAct:Date = new Date();
        this.periodoEmpleadoActual.idEmpleado = this.empleado.idEmpleado;
        this.permisoEmpleado.periodoEmpleado = this.periodoEmpleadoActual;
        if(this.validarRequerido()){
            this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'Ingrese los campos obligatorios.'});
            return;
        }

        let cadena:string[] = this.permisoEmpleado.fecha.split('/');
        let horaIni:string[] = this.permisoEmpleado.horaInicio.split(':');
        let horaFin:string[] = this.permisoEmpleado.horaFin.split(':');

        let fechaIni:Date= new Date( parseInt(cadena[2]),parseInt(cadena[1])-1,parseInt(cadena[0]),parseInt(horaIni[0]),parseInt(horaIni[1]));

        let fechaFin:Date= new Date( parseInt(cadena[2]),parseInt(cadena[1])-1,parseInt(cadena[0]),parseInt(horaFin[0]),parseInt(horaFin[1]));

        let fechaPerm:Date= new Date( parseInt(cadena[2]),parseInt(cadena[1])-1,parseInt(cadena[0]));


        if(fechaPerm<fechaAct){
            this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'La fecha del permiso debe ser mayor o igual a la fecha de hoy.'});
            return;
        }

        if(fechaFin.getTime()<fechaIni.getTime()){
            this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'La hora final del permiso debe ser mayor a la hora inicial del permiso.'});
            return;
        }

        let interval= fechaFin.getTime()- fechaIni.getTime();
        let hours:number = interval / (1000*60*60);
        this.permisoEmpleado.horas = parseFloat(hours.toFixed(2));

        if( this.permisoEmpleado.motivo == 'P'){

            if(this.validarRequeridoFechaRecuperacion()){
                this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'Ingrese los campos obligatorios de la Fecha de Recuperacion.'});
                return;
            }

            let cadenaRecuperacion:string[] = this.permisoEmpleado.fechaRecuperacion.split('/');
            let horaIniRecuperacion:string[] = this.permisoEmpleado.horaInicioRecuperacion.split(':');
            let horaFinRecuperacion:string[] = this.permisoEmpleado.horaFinRecuperacion.split(':');

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
        this.confirmActive= true;
    }

    onRegistrarPermisoEmpleado(){

        this.blockedUI  = true;
        this.permisoService.registrarPermisoEmpleado(this.permisoEmpleado).subscribe(
            data => {
                this.confirmActive=false;
                this.backendService.notification(this.msgs, data);
                if (data.codigo == 1) {
                    $('#btnGuardar').prop("disabled",true);
                }
                this.blockedUI  = false;
            },
            error => {
                this.confirmActive=false;
                this.backendService.notification(this.msgs, error);
                this.blockedUI  = false;
            }
        );

    }

    hide() {
        this.msgs = [];
    }

    cerrarDialog(){
        this.mensaje = '';
        $( '#dialog-message' ).dialog( "close" );
    }

    validarRequerido():boolean{

        let validacion = false;

        if(this.permisoEmpleado.idAtendidoPor === undefined || this.permisoEmpleado.idAtendidoPor == null){
            $('#idAtendidoPor').addClass('invalid').removeClass('required');
            $('#idAtendidoPor').parent().addClass('state-error').removeClass('state-success');
            $('#idAtendidoPor').addClass('input-error');
            validacion = true;
        }

        if(this.permisoEmpleado.motivo === undefined || this.permisoEmpleado.motivo == null || this.permisoEmpleado.motivo=='' ){
            $('#motivo').addClass('invalid').removeClass('required');
            $('#motivo').parent().addClass('state-error').removeClass('state-success');
            $('#motivo').addClass('input-error');
            validacion = true;
        }
        if(this.permisoEmpleado.fecha === undefined || this.permisoEmpleado.fecha == null || this.permisoEmpleado.fecha==''){
            $('#datepickerDesde').addClass('invalid').removeClass('required');
            $('#datepickerDesde').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        if( this.permisoEmpleado.horaInicio === undefined || this.permisoEmpleado.horaInicio == null || this.permisoEmpleado.horaInicio==''){
            $('#horaDesde').addClass('invalid').removeClass('required');
            $('#horaDesde').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        if(this.permisoEmpleado.horaFin === undefined || this.permisoEmpleado.horaFin == null || this.permisoEmpleado.horaFin==''){
            $('#horaHasta').addClass('invalid').removeClass('required');
            $('#horaHasta').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        return validacion;
    }

    validarRequeridoFechaRecuperacion():boolean{

        let validacion = false;
        if(this.permisoEmpleado.fechaRecuperacion === undefined || this.permisoEmpleado.fechaRecuperacion == null || this.permisoEmpleado.fechaRecuperacion==''){
            $('#datepickerHasta').addClass('invalid').removeClass('required');
            $('#datepickerHasta').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        if(this.permisoEmpleado.horaInicioRecuperacion === undefined || this.permisoEmpleado.horaInicioRecuperacion == null || this.permisoEmpleado.horaInicioRecuperacion==''){
            $('#horaDesdeRecuperacion').addClass('invalid').removeClass('required');
            $('#horaDesdeRecuperacion').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        if(this.permisoEmpleado.horaFinRecuperacion === undefined || this.permisoEmpleado.horaFinRecuperacion == null || this.permisoEmpleado.horaFinRecuperacion==''){
            $('#horaHastaRecuperacion').addClass('invalid').removeClass('required');
            $('#horaHastaRecuperacion').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        return validacion;
    }
    public onClosePermiso() {
        this.closeForm();
    }
    public onCancelPermiso(e) {
        e.preventDefault();
        this.closeForm();
    }
    public closeForm(){
        this.confirmActive= false;
        //this.cancel.emit();
    }
    public showMessagePermiso(){
        this.validateValuesRequired();

    }
    public limpiarDatosPermiso(){
        this.permisoEmpleado.idAtendidoPor=null;
        this.permisoEmpleado.motivo=null;
        this.permisoEmpleado.razon=null;
        this.permisoEmpleado.fecha=null;
        this.permisoEmpleado.horaInicio="";
        this.permisoEmpleado.horaFin="";
        this.permisoEmpleado.fechaRecuperacion=null;
        this.permisoEmpleado.horaInicioRecuperacion="";
        this.permisoEmpleado.horaFinRecuperacion="";
        this.isPersonal = false;
        $('#btnGuardar').prop("disabled",false);

    }
    public verSolicitudesPermiso() {
        localStorage.setItem('tabActive','tab-active-6');
        this._router.navigate(['/autogestion/actualizarDatosPersonales']);
    }
}
