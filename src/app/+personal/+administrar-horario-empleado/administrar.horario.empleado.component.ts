import {Component, OnInit, EventEmitter,ViewChild} from '@angular/core';
import { Observable } from 'rxjs/Rx';
import {Router, ActivatedRoute} from "@angular/router";
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {Empleado} from "../../+dto/maintenance/empleado";
import {HistorialLaboral} from "../../+dto/maintenance/historialLaboral";
import {NotificacionResult} from "../../+dto/NotificacionResult";
import {PermisoService} from "../../+common/service/permiso.service";
import {HorarioDia} from "../../+dto/maintenance/horarioDia";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {HorarioEmpleado} from "../../+dto/maintenance/horarioEmpleado";
import {Horario} from "../../+dto/maintenance/horario";
import {HorarioEmpleadoDia} from "../../+dto/maintenance/horarioEmpleadoDia";
import {HorarioEmpleadoDiaDialogFormComponent} from "./horario.empleado.dia.dialog.component";
import {NotificationsService} from "angular2-notifications/src/notifications.service";
import {HorarioEmpleadoService} from "../../+common/service/horario.empleado.service";
import {StorageResult} from "../../+dto/storageResult";
import {HorarioService} from "../../+common/service/horario.service";
import {ComponentBase} from "../../+common/service/componentBase";
import {BackendService} from "../../+rest/backend.service";


declare var $: any;

@Component({
  selector: 'sa-administrar-horario-empleado',
  templateUrl: 'administrar.horario.empleado.component.html',
  providers: [PermisoService, HorarioEmpleadoService, HorarioService,NotificationsService]
})
export class AdministrarHorarioEmpleadoComponent extends ComponentBase implements OnInit {

    public defaultItem:TablaGeneralResult={codigo:null,nombre:'Seleccionar', grupo:null};

    public defaultItemHorario:any={idHorario:null,nombre:'Seleccionar'};

    public mensaje:string;

    public horarioDias:HorarioDia[]=[];

    public horarioEmpleadoDias:HorarioEmpleadoDia[]=[];

    private idEmpleadoTemp:number = 0;

    private horariosEmpleado:HorarioEmpleado[]=[];

    private horarioEmpleado:HorarioEmpleado= new HorarioEmpleado();

    private tiposhorario:TablaGeneralResult[]=[];


    private horarios:Horario[]=[];

    private horarioDefecto:Horario=new Horario();

    private horariosEmpleadoDia:HorarioEmpleadoDia[]=[];

    private historiaLaboralActual: HistorialLaboral = new HistorialLaboral();

    private empleado : Empleado = new Empleado();

    private isPersonalizado:boolean=false;
    private isEdit:boolean=false;
    private classEdit:string='input';

    //NotificacionResult
    public options = {
        timeOut: 5000,
        lastOnBottom: true,
        clickToClose: true,
        maxLength: 0,
        maxStack: 7,
        showProgressBar: true,
        pauseOnHover: true,
        preventDuplicates: false,
        preventLastDuplicates: 'visible',
        rtl: false,
        animate: 'scale',
        position: ['right', 'top']
    };

    private fotoEmpleado:string = '';
    private nombreCompletoEmpleado:string = '';

    //public storageCommomnValueResult: StorageResult = new StorageResult();

    constructor(private _service: NotificationsService,
                private route:ActivatedRoute,
                private _router: Router,
                private empleadoService:EmpleadoService,
                private permisoService:PermisoService,
                private horarioEmpleadoService:HorarioEmpleadoService,
                private horarioService:HorarioService, public backendService: BackendService) {

        super(backendService, '');


        let idEmpleado:number = this.empleadoService.retrieveSessionStorage('idEmpleado');

        this.idEmpleadoTemp = idEmpleado;
        this.obtenerEmpleado(idEmpleado);

        let isNewHorarioEmpleado:boolean = this.empleadoService.retrieveSessionStorage('isNewHorarioEmpleado');

        this.horarioEmpleadoDias=[];

        let empleado:Empleado = new Empleado();

        empleado.idEmpleado = idEmpleado;

        this.getTiposHorario();
        this.verHorarioEmpleado(idEmpleado);
        this.obtenerHistoriaLaboralActual(empleado);
        this.isPersonalizado = true;


        if(isNewHorarioEmpleado){
            this.isEdit=false;
            this.classEdit='input';
        }else{

            let idHorarioEmpleado:number = this.empleadoService.retrieveSessionStorage('idHorarioEmpleado');

            this.isEdit=true;
            this.classEdit='input state-disabled';

            this.obtenerHorarios();

            this.obtenerHorarioEmpleadoDiaPorHorarioEmpleado(idHorarioEmpleado);
        }

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
            $('#fotoEmpleado').prop("style","display: block; border-radius: 4px 4px 0 0; height: 100px");
            $('#iconPerson').prop("class","");
        }
    }

    private obtenerHorarioPorTipoHorarioEmpresa(horarioTemp:Horario) {

        this.empleadoService.obtenerHorariosPorTipoHorario(horarioTemp).subscribe(
            horario => this.horarios = horario,
            error =>  this.errorMessage = <any>error);
    }

    private obtenerHorarios() {

        this.empleadoService.obtenerHorarios().subscribe(
            horario => this.horarios = horario,
            error =>  this.errorMessage = <any>error);
    }

    private obtenerHorarioEmpleadoDiaPorHorarioEmpleado(idHorario:number){

        this.horarioEmpleadoService.obtenerHorarioEmpleado(idHorario).subscribe(
            data => this.cargarHorarioEmpleado(data),
            error =>  this.errorMessage = <any>error);
    }

    cargarHorarioEmpleado(data:HorarioEmpleado){

        if(data.tipoHorario == 'PE'){
         this.horarios = [];
         }

        this.horarioEmpleadoDias = data.horariosEmpleadoDia;
        this.horarioEmpleado = data;

    }

    private obtenerHistoriaLaboralActual(empleado: Empleado) {
        this.permisoService.obtenerHistoriaLaboralActual(empleado).subscribe(
            historiaLaboral => this.historiaLaboralActual = historiaLaboral,
            error =>  this.errorMessage = <any>error);
    }

    private getTiposHorario() {
        this.tiposhorario = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Horario.TipoHorario' === grupo.grupo);
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

    generarIdHorarioEmpleadoDiaTemporal():number {
        if (this.horarioEmpleadoDias != null)
            return (this.horarioEmpleadoDias.length + 2)* -1;
        else
            return-1;
    }

    onRegresarHorarioEmpleado(){
        this.empleadoService.storeSessionStorage('isNewHorarioEmpleado',true);
        this.empleadoService.storeSessionStorage('idHorarioEmpleado',undefined);
        this._router.navigate(['/personal/horarioEmpleado']);
    }

    onChangeInicioVigencia(value){
        this.horarioEmpleado.inicioVigencia= value;
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
            if(this.historiaLaboralActual.idProyecto === undefined || this.historiaLaboralActual.idProyecto == null){
                this.horarioEmpleadoDias=[];
            }else {
                horarioTemp.tipoHorario = value;
                horarioTemp.idProyecto = this.historiaLaboralActual.idProyecto;
                this.obtenerHorariosPorTipoHorario(horarioTemp);
            }
        }else{
            this.horarioEmpleadoDias=[];
            this.isPersonalizado = true;
        }

    }

    onChangeHorarioDia(value){

        if(value == null){
            this.horarioEmpleadoDias=[];
        }else{
            //let horario:Horario = new Horario();
            //horario.idHorario = value;
            this.horarioService.obtenerHorarioDiaPorHorario(value).subscribe(
                horario => this.homologarHorarioDias(horario),
                error =>  this.errorMessage = <any>error);
        }

    }

    horariosDiaPorPersonalizado():HorarioEmpleadoDia[]{
        return [new HorarioEmpleadoDia(-1,'LU','08:00','17:30',1,'Lunes','Si'),
            new HorarioEmpleadoDia(-2,'MA','08:00','17:30',1,'Martes','Si'),
            new HorarioEmpleadoDia(-3,'MI','08:00','17:30',1,'Miercoles','Si'),
            new HorarioEmpleadoDia(-4,'JU','08:00','17:30',1,'Jueves','Si'),
            new HorarioEmpleadoDia(-5,'VI','08:00','17:30',1,'Viernes','Si'),
            new HorarioEmpleadoDia(-6,'SA',null,null,null,'Sabado','No'),
            new HorarioEmpleadoDia(-7,'DO',null,null,null,'Domingo','No')];
    }

    ngOnInit() {
    }

    onRegistrarHorarioEmpleado(){


        this.horarioEmpleado.horariosEmpleadoDia = this.horarioEmpleadoDias;

        this.horarioEmpleado.idEmpleado = this.idEmpleadoTemp;

        //validacion


        let cadena:string[] = this.horarioEmpleado.inicioVigencia.split('/');
        let fechaIni:Date= new Date( parseInt(cadena[2]),parseInt(cadena[1])-1,parseInt(cadena[0]));

        let fechaAct:Date = new Date();


        /*if(this.horarioEmpleado.idHorarioEmpleado === undefined || this.horarioEmpleado.idHorarioEmpleado == null) {
            if (fechaIni < fechaAct) {
                this._service.error("Error", 'La fecha del Horario empleado debe ser mayor a la fecha de hoy.');
                return;
            }
        }*/

        this.horarioEmpleadoService.registrarHorarioEmpleado(this.horarioEmpleado).subscribe(
            data => {
                this.navegarHorarioEmpleado(data);
            },
            error => error
        );

    }
    navegarHorarioEmpleado(data:NotificacionResult){
        if(data.codigo == 1){
            this.empleadoService.storeSessionStorage('isNewHorarioEmpleado',true);
            this.empleadoService.storeSessionStorage('idHorarioEmpleado',undefined);
            this._router.navigate(['/personal/horarioEmpleado']);
        }
        else if(data.codigo == 0){
            this._service.error("Error", data.mensaje);
        }
    }


    verHorarioEmpleado(idEmpleado: number){
        this.empleadoService.verHorariosEmpleado(idEmpleado).subscribe(
            data => this.horariosEmpleado = data,
            error => this.errorMessage = <any>error
        );
    }


    //popup horario empleado dia
    public dataItemHorarioDia: HorarioEmpleadoDia;


    @ViewChild(HorarioEmpleadoDiaDialogFormComponent) protected editHorarioEmpleadoDiaFormComponent: HorarioEmpleadoDiaDialogFormComponent;

    public onEditarHorarioDia(dataItem: any): void {
        this.editHorarioEmpleadoDiaFormComponent.tituloCabecera = "Editar Horario Dia";

        this.dataItemHorarioDia = dataItem;

        this.editHorarioEmpleadoDiaFormComponent.diaSemana = this.dataItemHorarioDia.diaSemana;
        this.editHorarioEmpleadoDiaFormComponent.nombreDiaSemana = this.dataItemHorarioDia.nombreDiaSemana;
        this.editHorarioEmpleadoDiaFormComponent.entrada = this.dataItemHorarioDia.entrada;
        this.editHorarioEmpleadoDiaFormComponent.salida = this.dataItemHorarioDia.salida;
        this.editHorarioEmpleadoDiaFormComponent.laboral = this.dataItemHorarioDia.laboral;
        this.editHorarioEmpleadoDiaFormComponent.tiempoAlmuerzo = this.dataItemHorarioDia.tiempoAlmuerzo;
        this.editHorarioEmpleadoDiaFormComponent.calcularHoras();

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

}
