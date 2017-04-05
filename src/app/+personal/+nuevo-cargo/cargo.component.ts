import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from "ng2-bootstrap";
import {HttpModule} from '@angular/http';
import { Location } from '@angular/common';

import {DepartamentoAreaCombo} from '../../+dto/departamentoAreaCombo';
import {UnidadDeNegocioCombo} from '../../+dto/unidadDeNegocioCombo';
import {Moneda} from '../../+dto/maintenance/moneda';
import {Horario} from '../../+dto/maintenance/horario';
import {Dias} from './dias';
import {TablaGeneralResult} from '../../+dto/tablaGeneralResult';
import { HorarioDialogFormComponent } from './horario.dialog.component';
import { CargoService } from '../../+common/service/cargo.service';

//Empleado
import {EmpleadoService} from "../../+common/service/empleado.service";
import {Empleado} from "../../+dto/maintenance/empleado";
import {HorarioEmpleado} from "../../+dto/maintenance/horarioEmpleado";
import {NotificacionResult} from "../../+dto/NotificacionResult";
import {HorarioEmpleadoDia} from "../../+dto/maintenance/horarioEmpleadoDia";
import {HorarioDia} from "../../+dto/maintenance/horarioDia";
import {Observable} from "rxjs";
import {EnumRolEmpleado} from "../../+enums/enumRolEmpleado";
import {LocalStorageGlobal} from "../../+dto/localStorageDto";
import {HistorialLaboral} from "../../+dto/maintenance/historialLaboral";
import {StorageResult} from "../../+dto/storageResult";
import {CargoCombo} from "../../+dto/cargoCombo";
import {ProyectoCombo} from "../../+dto/proyectoCombo";
import {NotificationsService} from "angular2-notifications/lib/notifications.service";
import {Message} from "primeng/components/common/api";
import {GeneralTextMask} from "../../+common/Utils/generalTextMask";

declare var $: any;

@Component({
    selector: 'sa-empleado-cargo',
    templateUrl: 'cargo.component.html',
    providers: [HttpModule,NotificationsService]
})
export class CargoComponent implements OnInit {

    msgs: Message[] = [];

    @ViewChild(HorarioDialogFormComponent) protected horarioDialogFormComponent: HorarioDialogFormComponent;

    public defaultItem:UnidadDeNegocioCombo={idUnidadDeNegocio:null,nombre:'Seleccionar'};
    public departamentoArea : DepartamentoAreaCombo[];
    public unidadDeNegocio : UnidadDeNegocioCombo[];
    public proyecto : ProyectoCombo[];
    public cargos : CargoCombo[];
    public historialLaboral: HistorialLaboral = new HistorialLaboral();
    public monedas : Moneda[];
    public tipoHorarios : TablaGeneralResult[];
    public dias : Dias[];
    public horarios : Horario[];

    public empleado:Empleado= new Empleado();
    private horariosEmpleado:HorarioEmpleado=new HorarioEmpleado();


    public isEnableUndNegocio:boolean;
    public isEnableProyectos:boolean;
    public isEnableCargos:boolean;
    public isHorarioSelectec:boolean = false;

    public errorMessage: string;
    public mensaje:string;

    public horarioEmpleado:HorarioEmpleado= new HorarioEmpleado();
    private tiposhorario:TablaGeneralResult[]=[];
    public horarioEmpleadoDias:HorarioEmpleadoDia[]=[];
    private isPersonalizado:boolean=false;

    public storageCommomnValueResult: StorageResult = new StorageResult();
    localStorageValue: LocalStorageGlobal = new LocalStorageGlobal();

    public selectedValue: number = 1;
    public currencyMask = GeneralTextMask.currencyMask;

    public fotoEmpleado: string = '';
    public nombreCompletoEmpleado:string = '';

    constructor(private cargoService: CargoService,
                private empleadoService:EmpleadoService,
                private location: Location) {

        this.isPersonalizado=true;
        this.empleado = this.empleadoService.retrieveSessionStorage('entityNewHistoriaLaboral');
        this.storageCommomnValueResult = JSON.parse(localStorage.getItem('localStorageCommonsValues'));


        this.obtenerEmpleado(this.empleado.idEmpleado);
        //this.localStorageValue = this.empleadoService.retrieveDataLocalStorage();currentUser

        if(this.localStorageValue.rolName == EnumRolEmpleado[EnumRolEmpleado.RHANA] || this.localStorageValue.rolName == EnumRolEmpleado[EnumRolEmpleado.ADMIN]){
            this.localStorageValue.mostrarBoton = true;
        }
        this.historialLaboral.idMoneda = this.selectedValue;

    }

    ngOnInit() {
        this.getUnidadDeNegocio(),this.getMonedas(),this.getTipoHorario(),this.getListCargos();
        this.getTiposHorario();
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

    onchangeHorario(value){

        let horarioTemp:Horario = new Horario();

        this.horarioEmpleado.idHorario = null;

        if(value == 'PE'){
            this.horarioEmpleadoDias = this.horariosDiaPorPersonalizado();
            this.horarioEmpleado.idHorario = null;
            this.isPersonalizado = true;
            this.horarios=[];


        }else if(value == 'EM'){
            this.isPersonalizado = false;
            horarioTemp.tipoHorario = value;
            this.obtenerHorariosPorTipoHorario(horarioTemp);
        }

        else if(value == 'PR'){
            this.isPersonalizado = false;
            if(this.historialLaboral.idProyecto === undefined || this.historialLaboral.idProyecto == null){
                this.horarioEmpleadoDias=[];
            }else {
                horarioTemp.tipoHorario = value;
                horarioTemp.idProyecto = this.historialLaboral.idProyecto;//this.historiaLaboralActual.idProyecto;
                this.obtenerHorariosPorTipoHorario(horarioTemp);
            }
        }else{
            this.horarioEmpleadoDias=[];
            this.isPersonalizado = true;
        }

    }

    private getTiposHorario() {
        this.tiposhorario = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Horario.TipoHorario' === grupo.grupo);
    }

    horariosDiaPorPersonalizado():HorarioEmpleadoDia[]{
        return [new HorarioEmpleadoDia(-1,'LU','08:00','17:30',1,'Lunes','Si'),
            new HorarioEmpleadoDia(-2,'MA','08:00','17:30',1,'Lunes','Si'),
            new HorarioEmpleadoDia(-3,'MI','08:00','17:30',1,'Lunes','Si'),
            new HorarioEmpleadoDia(-4,'JU','08:00','17:30',1,'Lunes','Si'),
            new HorarioEmpleadoDia(-5,'VI','08:00','17:30',1,'Lunes','Si'),
            new HorarioEmpleadoDia(-6,'SA',null,null,null,'Sabado','No'),
            new HorarioEmpleadoDia(-7,'DO',null,null,null,'Domingo','No')];
    }

    private obtenerHorariosPorTipoHorario(horarioTemp:Horario) {

        this.empleadoService.obtenerHorariosPorTipoHorario(horarioTemp).subscribe(
            horario => this.cargarHorarios(horario,horarioTemp),
            error =>  this.errorMessage = <any>error);
    }

    private cargarHorarios(horarios:Horario[], horario:Horario){
        this.horarios = horarios;
        this.obtenerHorarioPorTipoHorarioPorDefecto(horario);
    }

    private obtenerHorarioPorTipoHorarioPorDefecto(horarioTemp:Horario){
        this.empleadoService.obtenerHorarioPorTipoHorarioPorDefecto(horarioTemp).subscribe(
            horario => this.cargarHorariosDias(horario),
            error =>  this.errorMessage = <any>error);
    }

    private obtenerHorarioDiaPorHorario(horarioTemp:Horario){
        this.empleadoService.obtenerHorarioDiaPorHorario(horarioTemp).subscribe(
            horario => this.homologarHorarioDias(horario),
            error =>  this.errorMessage = <any>error);
    }

    private cargarHorariosDias(horario:Horario){
        this.horarioEmpleado.idHorario = horario.idHorario;
        this.horarioEmpleado.horasSemanal = horario.horasSemanal;

        this.homologarHorarioDias(horario.horarioDias);
    }

    homologarHorarioDias(horarioDias:HorarioDia[]){
        let horarioEmpleadoDiastemp:HorarioEmpleadoDia[] =[];

        for(var item in horarioDias){
            var data = horarioDias[item];
            let horarioEmpleadoDia:HorarioEmpleadoDia = new HorarioEmpleadoDia();
            horarioEmpleadoDia=(JSON.parse(JSON.stringify(data)));
            horarioEmpleadoDiastemp.push(horarioEmpleadoDia);
        }
        this.horarioEmpleadoDias=horarioEmpleadoDiastemp;
    }

    onChangeHorarioDia(value){

        if(value == null){
            this.horarioEmpleadoDias=[];
        }else{
            let horario:Horario = new Horario();
            horario.idHorario = value;
            this.obtenerHorarioDiaPorHorario(horario);
        }

    }

    generarIdHorarioEmpleadoDiaTemporal():number {
        if (this.horarioEmpleadoDias != null)
            return (this.horarioEmpleadoDias.length + 2)* -1;
        else
            return-1;
    }
    //popup

    editable: boolean = true;
    public dataItemHorarioDia: HorarioEmpleadoDia;


    @ViewChild(HorarioDialogFormComponent) protected editHorarioEmpleadoDiaFormComponent: HorarioDialogFormComponent;

    public onEditarHorarioDia(dataItem: any): void {
        this.editHorarioEmpleadoDiaFormComponent.tituloCabecera = "Editar Horario Dia";

        this.dataItemHorarioDia = dataItem;

        this.editHorarioEmpleadoDiaFormComponent.diaSemana = this.dataItemHorarioDia.diaSemana;
        this.editHorarioEmpleadoDiaFormComponent.nombreDiaSemana = this.dataItemHorarioDia.nombreDiaSemana;
        this.editHorarioEmpleadoDiaFormComponent.entrada = this.dataItemHorarioDia.entrada;
        this.editHorarioEmpleadoDiaFormComponent.salida = this.dataItemHorarioDia.salida;
        this.editHorarioEmpleadoDiaFormComponent.laboral = this.dataItemHorarioDia.laboral;
        this.editHorarioEmpleadoDiaFormComponent.tiempoAlmuerzo = this.dataItemHorarioDia.tiempoAlmuerzo;

    }

    public onCancelarHorarioDia(): void {
        this.dataItemHorarioDia = undefined;
    }

    public onAgregarHorarioDia(dto: HorarioEmpleadoDia): void {

        this.editarHorarioDia(dto);
    }


    public editarHorarioDia(data: HorarioEmpleadoDia): Observable<HorarioEmpleadoDia[]> {
        return this.fetchHorarioDia("update", data);
    }

    private fetchHorarioDia(action: string = "", data?: HorarioEmpleadoDia): Observable<HorarioEmpleadoDia[]>  {

        if(action=="update"){
            var indice = this.horarioEmpleadoDias.indexOf(data);
            if(indice>=0)
                this.horarioEmpleadoDias[indice]  = (JSON.parse(JSON.stringify(data)));
        }else if(action=="destroy"){
            var indice = this.horarioEmpleadoDias.indexOf(data);

            if(indice>=0)
                this.horarioEmpleadoDias.splice(indice, 1);

        }

        return Observable.of(this.horarioEmpleadoDias);
    }

    //fin popup

    rows = [];
    editing = {};

    getMonedas() {
        this.monedas = this.storageCommomnValueResult.moneda;
    }
    getTipoHorario() {
        this.tipoHorarios = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Horario.TipoHorario' === grupo.grupo);
    }
    getHorarioPersonalizado() {
        this.cargoService.completarFilaDia().subscribe(
            diaDto => this.dias = diaDto,
            error => this.errorMessage = <any>error
        );
    }
    getUnidadDeNegocio() {
        this.unidadDeNegocio = this.storageCommomnValueResult.unidadDeNegocio;
    }

    getListCargos() {
        this.cargos = this.storageCommomnValueResult.cargo;
    }

    private cargarHorarioSeleccionado() {

        this.cargoService.cargarComboHorario().subscribe(
            horarioDto => this.horarios = horarioDto,
            error =>  this.errorMessage = <any>error);
    }

    private obtenerDepartamentos(idUndNegocio:number) {
        this.departamentoArea = this.storageCommomnValueResult.departamentoArea.filter(depa => idUndNegocio === depa.idUnidadDeNegocio);
    }

    private obtenerProyecto(idDepartamentoArea:number) {
        this.proyecto = this.storageCommomnValueResult.proyecto.filter(proyect => idDepartamentoArea === proyect.idDepartamentoArea);
    }

    onEstadoHorario(value:boolean){
        return value;
    }

    onChangeMoneda(value):void{
        this.historialLaboral.idMoneda = value;
    }
    onChangeCargo(value):void{
        $('#idCargo').css('border','none');
    }
    actualizarDpto(value):void{
        $('#unidadNegocio').css('border','none');
        this.isEnableUndNegocio=false;
        let codigo:any = value;
        this.obtenerDepartamentos(codigo);

        this.isEnableProyectos=true;
        this.isEnableCargos=true;
        this.proyecto = null;


    }

    actualizarProyecto(value):void{
        let codigo:any = value;
        this.obtenerProyecto(codigo);

    }
    //Grid
    actualizarRowLunes(event:Event):void{
        let codigo:any = (<HTMLSelectElement>event.srcElement).value;
        this.dias = null;
    }

    onChangeIniDate(e) {
        this.historialLaboral.fechaInicio = e;
        $('#desdeFecha').removeClass('state-error');
        $('#desdeFecha').parent().removeClass('state-error');
    }

    onChangeFinDate(e) {

        this.historialLaboral.fechaFin = e;

    }

    verHorarioEmpleado(empleado: number){
        this.empleadoService.verHorarioEmpleado(empleado).subscribe(
            data => this.horariosEmpleado = data,
            error => this.errorMessage = <any>error
        );
    }

    goBack(): void {

        this.location.back();
    }

    public onRegistrarCargo(): void{

        if(this.validarRequerido()){
            this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'Ingrese los campos obligatorios.'});
            return;

        }
        this.historialLaboral.idEmpleado = this.empleado.idEmpleado;

        this.cargoService.registrarCargo(this.historialLaboral).subscribe(
            data => {
                this.navegarDashboard(data);
            }
        );

    }
    validarRequerido():boolean{

        let validacion = false;
        if(this.historialLaboral.fechaInicio === undefined || this.historialLaboral.fechaInicio == null || this.historialLaboral.fechaInicio=='' ){
            $('#desdeFecha').addClass('invalid').removeClass('required');
            $('#desdeFecha').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }
        if(this.historialLaboral.idUnidadDeNegocio === undefined || this.historialLaboral.idUnidadDeNegocio == null){
            $('#unidadNegocio').addClass('invalid').removeClass('required');
            $('#unidadNegocio').parent().addClass('state-error').removeClass('state-success');
            $('#unidadNegocio').css('border','2px solid red');
            validacion = true;
        }
        if(this.historialLaboral.idCargo === undefined || this.historialLaboral.idCargo == null ){
            $('#idCargo').addClass('invalid').removeClass('required');
            $('#idCargo').parent().addClass('state-error').removeClass('state-success');
            $('#idCargo').css('border','2px solid red');
            validacion = true;
        }
        if(this.historialLaboral.salario === undefined || this.historialLaboral.salario == null ){
            $('#salario').addClass('invalid').removeClass('required');
            $('#salario').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }
        if(this.historialLaboral.idMoneda === undefined || this.historialLaboral.idMoneda == null ){
            $('#idMoneda').addClass('invalid').removeClass('required');
            $('#idMoneda').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        return validacion;
    }

    navegarDashboard(data:NotificacionResult){

        if(data.codigo == 1){
            this.msgs.push({severity:'Success', summary:'Runakuna Success', detail:data.detail});
            this.goBack();
        }

        else if(data.codigo == 0){
            this.mensaje = data.mensaje;
            this.msgs.push({severity:'error', summary:'Runakuna Error', detail:data.detail});
            return;
        }

    }


    @ViewChild('lgModal') public lgModal:ModalDirective;

    public showChildModal():void {
        this.lgModal.show();
    }

    public hideChildModal():void {
        this.lgModal.hide();
    }

}
