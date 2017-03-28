import {Component, OnInit, ViewChild} from "@angular/core";
import {Observable} from "rxjs/Rx";
import {ActivatedRoute, Router} from "@angular/router";
import {PermisoEmpleado} from "../../+dto/maintenance/permisoEmpleado";
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {Empleado} from "../../+dto/maintenance/empleado";
import {PeriodoEmpleado} from "../../+dto/maintenance/periodoEmpleado";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {PaisService} from "../../+common/service/pais.service";
import {PaisDto} from "../../+personal/+empleado/paisDto";
import {DepartamentoDto} from "../../+personal/+empleado/departamentoDto";
import {Dependiente} from "../../+dto/maintenance/dependiente";
import {GridDataResult, PageChangeEvent} from "@progress/kendo-angular-grid";
import {ExperienciaLaboral} from "../../+dto/maintenance/experienciaLaboral";
import {HorarioEmpleado} from "../../+dto/maintenance/horarioEmpleado";
import {DependienteDialogFormComponent} from "./dependiente.dialog.component";
import {ExperienciaLaboralDatosPersonalesDialogFormComponent} from "./experienciaLaboralDatosPersonales.dialog.component";
import {PermisosDialogFormComponent} from "./permisos.dialog.component";
import {VacacionesDialogFormComponent} from "./vacaciones.dialog.component";
import {Marcacion} from "../../+dto/maintenance/marcacion";
import {MarcacionesDialogFormComponent} from "./marcaciones.dialog.component";
import {Vacacion} from "../../+dto/maintenance/vacacion";
import {StorageResult} from "../../+dto/storageResult";
import {ComponentBase} from "../../+common/service/componentBase";
import {VacacionService} from "../../+common/service/vacacion.service";
import {Educacion} from "../../+dto/maintenance/educacion";
import {EducacionDatosPersonalesDialogFormComponent} from "./educacionDatosPersonales.dialog.component";
import {HorasExtra} from "../../+dto/maintenance/horasExtra";
import {HorasExtrasDialogFormComponent} from "./horasExtras.dialog.component";
import {HorasExtraService} from "../../+common/service/horasExtra.service";
import {LicenciaService} from "../../+common/service/licencia.service";
import {Licencia} from "../../+dto/maintenance/licencia";
import {LicenciaDialogFormComponent} from "./licencia.dialog.component";
import {MarcacionFilter} from "../../+dto/marcacionFilter";

import {ExpressionRegularValidate} from "../../+common/Utils/expressionRegularValidate";
import {BackendService} from "../../+rest/backend.service";
import {DocumentoEmpleado} from "../../+dto/maintenance/documentoEmpleado";
import {EquipoEntregado} from "../../+dto/maintenance/equipoEntregado";

declare var $: any;

var moment = require('moment');

@Component({
  selector: 'sa-datos-personales',
  templateUrl: 'datos.personales.component.html',
  providers: [PaisService,VacacionService,HorasExtraService,LicenciaService],
})
export class DatosPersonalesComponent extends ComponentBase implements OnInit {

    public state: any = {
        tabs: {
            tabdatosPersonales: 'tab-active-1',
        }
    };

    public isEnableDepartamentoDomicilio:boolean;
    public isEnableProvinciaDomicilio:boolean;
    public isEnableDistritoDomicilio:boolean;

    public defaultItem:TablaGeneralResult={codigo:null,nombre:'Seleccionar', grupo:null};

    public defaultItemPais:PaisDto={codigo:null,nombre:'Seleccionar'};

    public defaultItemDepartamento:DepartamentoDto={codigo:null,nombre:'Seleccionar'};

    public defaultItemPeriodo={idPeriodoEmpleado:null,periodo:'Todos'};

    public storageCommomnValueResult: StorageResult = new StorageResult();
    public tiposDomicilio:TablaGeneralResult[];
    public relacionesContacto:TablaGeneralResult[];
    public paisesDomicilio:PaisDto[];
    public departamentosDomicilio:DepartamentoDto[];
    public provinciasDomicilio:DepartamentoDto[];
    public distritosDomicilio:DepartamentoDto[];

    private empleado:Empleado = new Empleado();
    private dependientes: Dependiente[]=[];
    private experienciasLaborales: ExperienciaLaboral[]=[];
    private educaciones: Educacion[]=[];
    private permisosEmpleados:PermisoEmpleado[]=[];
    private equiposEntregados: EquipoEntregado[]=[];


    private vacaciones:Vacacion[]=[];
    private horasExtras:HorasExtra[]=[];
    private licencias:Licencia[]=[];

    private documentos: DocumentoEmpleado[]=[];

    private marcaciones:Marcacion[]=[];

    private horariosEmpleado:HorarioEmpleado=new HorarioEmpleado();

    private periodoEmpleadoHorasExtra:PeriodoEmpleado = new PeriodoEmpleado();
    private periodoEmpleadoPermiso:PeriodoEmpleado = new PeriodoEmpleado();
    private periodoEmpleadoLicencia:PeriodoEmpleado = new PeriodoEmpleado();
    private periodoEmpleadoVacaciones:PeriodoEmpleado = new PeriodoEmpleado();

    private periodosEmpleados:PeriodoEmpleado[]=[];

    private fechaDesde:string;
    private fechaHasta:string;

    private marcacionFilter: MarcacionFilter = new MarcacionFilter();

    private pageSize: number = 10;
    private skip: number = 0;

    private tiempoTrabajado:string;

    errorMessage: string;

    mensaje: string;

    private idPeriodoEmpleadoPermiso:number;
    private idPeriodoEmpleadoVacaciones:number;
    private idPeriodoEmpleadoHorasExtra:number;
    private idPeriodoEmpleadoLicencia:number;
    private diasDisponibles:number;

    private fotoEmpleado:string = '';
    private nombreCompletoEmpleado:string = '';

    private gridViewDependiente: GridDataResult;
    private gridViewExperienciaLaboral: GridDataResult;
    private gridViewEducacion: GridDataResult;

    private pageSizeExperienciaLaboral: number = 10;
    private skipExperienciaLaboral: number = 0;

    private pageSizeDependiente: number = 10;
    private skipDependiente: number = 0;

    private pageSizeEducacion: number = 10;
    private skipEducacion: number = 0;

    constructor(private route:ActivatedRoute,
                private empleadoService:EmpleadoService,public backendService: BackendService,
                private vacacionService: VacacionService,
                private paisService:PaisService, private _router: Router, private horasExtraService:HorasExtraService, private licenciaService:LicenciaService) {

        super(backendService,'AU001');
        let idEmpleado = this.currentUser.idEmpleado;
        this.storageCommomnValueResult = JSON.parse(localStorage.getItem('localStorageCommonsValues'));


        let tabActive=localStorage.getItem('tabActive');
        if (tabActive!=null && tabActive!='') {
            this.state.tabs.tabdatosPersonales=tabActive;
        }else{
            this.state.tabs.tabdatosPersonales='tab-active-1';
        }

        this.inicializarCampos();

        this.isEnableDepartamentoDomicilio=true;
        this.isEnableProvinciaDomicilio=true;
        this.isEnableDistritoDomicilio=true;

        this.obtenerPaisesDomicilio();
        this.getTiposDomicilio();
        this.getRelacionesContacto();

        this.cargarInformacion(idEmpleado);


    }

    inicializarCampos(){
        this.fechaDesde = moment().subtract(7, 'days').format('DD/MM/YYYY');
        this.fechaHasta = moment().format('DD/MM/YYYY');

    }

    cargarInformacion(idEmpleado:number){

        this.cargarinformacionEmpelado(idEmpleado);

        this.verPeriodoEmpleado(idEmpleado);

        this.verMarcaciones(idEmpleado);
        this.verHorarioEmpleado(idEmpleado);
        localStorage.setItem('tabActive','');

    }

    cargarinformacionEmpelado(idEmpleado:number){

        this.verEmpleado(idEmpleado);

        this.verDependiente(idEmpleado);
        this.verExperienciaLaboral(idEmpleado);
        this.verEducacion(idEmpleado);
        this.verDocumentos(idEmpleado);
        this.verEquipoEntregado(idEmpleado);
    }

    verEmpleado(idEmpleado: number){
        this.empleadoService.obtenerEmpleado(idEmpleado).subscribe(
            data => this.cargarEmpleado(data),
            error => this.errorMessage = <any>error
        );
    }

    verDocumentos(idEmpleado: number){
        this.empleadoService.verDocumentos(idEmpleado).subscribe(
            data => this.documentos = data,
            error => this.errorMessage = <any>error
        );
    }

    verEducacion(idEmpleado: number){
        this.empleadoService.verEducacion(idEmpleado).subscribe(
            data =>{
                this.educaciones = data;
                this.obtenerGridEducacion();
            } ,
            error => this.errorMessage = <any>error
        );
    }

    obtenerGridEducacion():void{

        if(this.educaciones.length>0){
            this.gridViewEducacion = {
                data: this.educaciones.slice(this.skipEducacion, this.skipEducacion + this.pageSizeEducacion),
                total: this.educaciones.length
            };
        }else{
            this.gridViewEducacion = {
                data: [],
                total: 0
            };
        }
    }

    verEquipoEntregado(idEmpleado: number){
        this.empleadoService.verEquipoEntregado(idEmpleado).subscribe(
            data => this.equiposEntregados = data,
            error => this.errorMessage = <any>error
        );
    }

    verPeriodoEmpleado(idEmpleado: number){
        this.empleadoService.verPeriodoEmpleado(idEmpleado).subscribe(
            data => {
                this.periodosEmpleados = data;

                if(this.periodosEmpleados != null && this.periodosEmpleados.length>0){
                    let periodoEmpleado: PeriodoEmpleado = new PeriodoEmpleado();
                    periodoEmpleado.idEmpleado = idEmpleado;
                    periodoEmpleado.idPeriodoEmpleado = this.periodosEmpleados[0].idPeriodoEmpleado;
                    periodoEmpleado.diasVacacionesDisponibles = this.periodosEmpleados[0].diasVacacionesDisponibles;

                    this.cargarPermisoEmpleado(periodoEmpleado);
                    this.cargarVacaciones(periodoEmpleado);
                    this.cargarHorasExtras(periodoEmpleado);
                    this.cargarLicencias(periodoEmpleado);
                }

            },
            error => this.errorMessage = <any>error
        );
    }

    verMarcaciones(idEmpleado: number){
        this.marcacionFilter.idEmpleado = idEmpleado;
        this.marcacionFilter.desde = this.fechaDesde;
        this.marcacionFilter.hasta = this.fechaHasta;
        this.cargarMarcacion(this.marcacionFilter);

    }
    verHorarioEmpleado(idEmpleado: number){
        this.empleadoService.verHorarioEmpleado(idEmpleado).subscribe(
            data => this.horariosEmpleado = data,
            error => this.errorMessage = <any>error
        );
    }

    cargarMarcacion(filter:MarcacionFilter){

        this.empleadoService.getMarcacionesByFiltro(filter).subscribe(
            data => {this.marcaciones = data;
                this.obtenerGridMarcaciones()},
            error => this.errorMessage = <any>error
        );
    }

    cargarPermisoEmpleado(periodoEmpleado: PeriodoEmpleado){
        this.idPeriodoEmpleadoPermiso = periodoEmpleado.idPeriodoEmpleado;
        this.empleadoService.verPermisoEmpleado(periodoEmpleado).subscribe(
            data => {this.permisosEmpleados = data;
                this.obtenerGridPermisoEmpleado()},
            error => this.errorMessage = <any>error
        );
    }

    cargarVacaciones(periodoEmpleado: PeriodoEmpleado){
        this.idPeriodoEmpleadoVacaciones = periodoEmpleado.idPeriodoEmpleado;
        this.diasDisponibles = periodoEmpleado.diasVacacionesDisponibles;
        this.vacacionService.verVacaciones(periodoEmpleado).subscribe(
            data => {this.vacaciones = data;
                    this.obtenerGridVacaciones()},
            error => this.errorMessage = <any>error
        );
    }

    cargarHorasExtras(periodoEmpleado: PeriodoEmpleado){
        this.idPeriodoEmpleadoHorasExtra = periodoEmpleado.idPeriodoEmpleado;
        this.horasExtraService.verHorasExtras(periodoEmpleado).subscribe(
            data => {this.horasExtras = data;
                this.obtenerGridHorasExtras()},
            error => this.errorMessage = <any>error
        );
    }

    cargarLicencias(periodoEmpleado: PeriodoEmpleado){
        this.idPeriodoEmpleadoLicencia = periodoEmpleado.idPeriodoEmpleado;
        this.licenciaService.verLicencias(periodoEmpleado).subscribe(
            data => {this.licencias = data;
                this.obtenerGridLicencias()},
            error => this.errorMessage = <any>error
        );
    }

    onChangePermisoEmpleadoPorPeriodo(value){
        this.periodoEmpleadoPermiso.idEmpleado = this.empleado.idEmpleado;
        this.periodoEmpleadoPermiso.idPeriodoEmpleado = value;
        this.cargarPermisoEmpleado(this.periodoEmpleadoPermiso);

    }

    onChangeVacacionesPorPeriodo(value){
        this.periodoEmpleadoVacaciones.idEmpleado = this.empleado.idEmpleado;
        this.periodoEmpleadoVacaciones.idPeriodoEmpleado = value;

        for(var item in this.periodosEmpleados){
            var data = this.periodosEmpleados[item];
            if(data.idPeriodoEmpleado == value){
                this.periodoEmpleadoVacaciones.diasVacacionesDisponibles = data.diasVacacionesDisponibles;
                break;
            }
        }

        this.cargarVacaciones(this.periodoEmpleadoVacaciones);

    }

    onChangeHorasExtrasPorPeriodo(value){
        this.periodoEmpleadoHorasExtra.idEmpleado = this.empleado.idEmpleado;
        this.periodoEmpleadoHorasExtra.idPeriodoEmpleado = value;
        this.cargarHorasExtras(this.periodoEmpleadoHorasExtra);

    }

    onChangeLicenciaPorPeriodo(value){
        this.periodoEmpleadoLicencia.idEmpleado = this.empleado.idEmpleado;
        this.periodoEmpleadoLicencia.idPeriodoEmpleado = value;
        this.cargarLicencias(this.periodoEmpleadoLicencia);

    }

    onChangeDateDesde(value){
        if(value.type == 'change'){
            return;
        }
        let validateFormat = value ===undefined ? true : ExpressionRegularValidate.isValidateDateInput(value);
        if(validateFormat){
            this.marcacionFilter.desde = value;
            this.cargarMarcacion(this.marcacionFilter);
        }else{
            this.msgs.push({severity:'error', summary:'Ingrese una Fecha Inicio valida', detail:'Runakuna Error'});
            return;
        }
    }

    onChangeDateHasta(value){
        if(value.type == 'change'){
            return;
        }
        let validateFormat = value ===undefined ? true : ExpressionRegularValidate.isValidateDateInput(value);
        if(validateFormat){
            this.marcacionFilter.hasta = value;
            this.cargarMarcacion(this.marcacionFilter);
        }else{
            this.msgs.push({severity:'error', summary:'Ingrese una Fecha Inicio valida', detail:'Runakuna Error'});
            $('#datepickerHasta').addClass('invalid').removeClass('required');
            $('#datepickerHasta').parent().addClass('state-error').removeClass('state-success');
            return;
        }
    }

    cargarEmpleado(data:Empleado){

        this.actualizarDptoDomicilio(data.paisDomicilio);

        if(data.departamentoDomicilio != null && data.departamentoDomicilio!= ''){
            this.actualizarProvinciaDomicilio(data.departamentoDomicilio);

            if(data.provinciaDomicilio != null && data.provinciaDomicilio!= ''){
                this.actualizarDistritoDomicilio(data.provinciaDomicilio);
            }
        }

        this.nombreCompletoEmpleado = data.nombreCompletoEmpleado;
        if(data.fotoPerfil != null) {
            //$("#imgLogo1Subido").css("background-image", "url('data:image/jpeg;base64," + data.fotoPerfil.contenidoArchivo + "')");
            this.fotoEmpleado = "data:image/jpeg;base64," +  data.fotoPerfil.contenidoArchivo;
            $('#fotoEmpleado').prop("style","display: block; border-radius: 4px 4px; height: 100px");
            $('#iconPerson').prop("class","");
        }

        this.empleado = data;

        if(data.fechaIngreso != null && data.fechaIngreso != '') {

            let fechaInicioCadena: string[] = data.fechaIngreso.split('/');
            let fechaIni: Date = new Date(parseInt(fechaInicioCadena[2]), parseInt(fechaInicioCadena[1]) - 1, parseInt(fechaInicioCadena[0]));

            let fechaFin: Date = new Date();

            this.duration(fechaIni, fechaFin);
        }

        this.empleado.edad = this.calculateAge(this.empleado.fechaNacimiento);


    }

    ngOnInit() {
    }

    private getTiposDomicilio() {
        this.tiposDomicilio = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Empleado.TipoDomicilio' === grupo.grupo);
    }

    private getRelacionesContacto() {
        this.relacionesContacto = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Empleado.RelacionContacto' === grupo.grupo);
    }

    private obtenerPaisesDomicilio() {
        this.paisService.completarComboPais().subscribe(
            paisDto => this.paisesDomicilio = paisDto,
            error =>  this.errorMessage = <any>error);
    }

    private obtenerDepartamentosDomicilio(codigoPais:string) {
        this.paisService.completarComboDepartamento(codigoPais).subscribe(
            departamentoDto => this.departamentosDomicilio = departamentoDto,
            error =>  this.errorMessage = <any>error);
    }

    private obtenerProvinciasDomicilio(codigoDpto:string) {
        this.paisService.completarComboProvincia(codigoDpto).subscribe(
            provinciasDto => this.provinciasDomicilio = provinciasDto,
            error =>  this.errorMessage = <any>error);
    }

    private obtenerDistritosDomicilio(codigoProvincia:string) {
        this.paisService.completarComboDistrito(codigoProvincia).subscribe(
            distritosDto => this.distritosDomicilio = distritosDto,
            error =>  this.errorMessage = <any>error);
    }

    actualizarDptoDomicilio(value):void{
        this.isEnableDepartamentoDomicilio=false;

        let codigo:string = value;// (<HTMLSelectElement>event.srcElement).value;
        this.empleado.departamentoDomicilio = null;
        if(value == null) {
            this.departamentosDomicilio = null;
        }else {
            this.obtenerDepartamentosDomicilio(codigo);
        }

        this.empleado.provinciaDomicilio = null;
        this.empleado.distritoDomicilio = null;

        this.provinciasDomicilio = null;
        this.distritosDomicilio = null;

        this.isEnableProvinciaDomicilio=true;
        this.isEnableDistritoDomicilio=true;

    }

    actualizarProvinciaDomicilio(value):void{
        this.isEnableProvinciaDomicilio=false;

        let codigo:string = value;//(<HTMLSelectElement>event.srcElement).value;
        this.empleado.provinciaDomicilio = null;
        if(value == null) {
            this.provinciasDomicilio = null;
        }else {
            this.obtenerProvinciasDomicilio(codigo);
        }

        this.empleado.distritoDomicilio = null;
        this.distritosDomicilio = null;
        this.isEnableDistritoDomicilio=true;

    }

    actualizarDistritoDomicilio(value):void{
        this.isEnableDistritoDomicilio=false;

        let codigo:string = value;//(<HTMLSelectElement>event.srcElement).value;
        this.empleado.distritoDomicilio = null;
        if(value == null) {
            this.distritosDomicilio = null;
        }else {
            this.obtenerDistritosDomicilio(codigo);
        }

    }

    verDependiente(idEmpleado: number){
        this.empleadoService.verDependiente(idEmpleado).subscribe(
            data => {
                this.dependientes = data;
                this.obtenerGridDependiente();
            },
            error => this.errorMessage = <any>error
        );
    }

    obtenerGridDependiente():void{

        if(this.dependientes.length>0){
            this.gridViewDependiente = {
                data: this.dependientes.slice(this.skipDependiente, this.skipDependiente + this.pageSizeDependiente),
                total: this.dependientes.length
            };
        }else{
            this.gridViewDependiente = {
                data: [],
                total: 0
            };
        }
    }

    verExperienciaLaboral(idEmpleado: number){
        this.empleadoService.verExperienciaLaboral(idEmpleado).subscribe(
            data => {
                this.experienciasLaborales = data;
                this.obtenerGridExperienciaLaboral();
            },
            error => this.errorMessage = <any>error
        );
    }

    obtenerGridExperienciaLaboral():void{

        if(this.experienciasLaborales.length>0){
            this.gridViewExperienciaLaboral = {
                data: this.experienciasLaborales.slice(this.skipExperienciaLaboral, this.skipExperienciaLaboral + this.pageSizeExperienciaLaboral),
                total: this.experienciasLaborales.length
            };
        }else{
            this.gridViewExperienciaLaboral = {
                data: [],
                total: 0
            };
        }
    }


    //dependiente

    public dataItemDependiente: Dependiente;

    @ViewChild(DependienteDialogFormComponent) protected dependienteDialogComponent: DependienteDialogFormComponent;

    public agregarDependiente(): void {
        this.dependienteDialogComponent.tituloCabecera = "Agregar";
        this.dependienteDialogComponent.tituloBoton = "Agregar";
        this.dependienteDialogComponent.agregarDependiente();

    }

    public onEditarDependiente(dataItem: any): void {
        this.dependienteDialogComponent.tituloCabecera = "Editar";
        this.dependienteDialogComponent.tituloBoton = "Actualizar";
        this.dependienteDialogComponent.obtenerTipoDocumento();
        this.dependienteDialogComponent.obtenerRelacionDependiente();

        this.dataItemDependiente = dataItem;

        this.dependienteDialogComponent.nombreDependiente = this.dataItemDependiente.nombre;
        this.dependienteDialogComponent.apellidoPaternoDependiente = this.dataItemDependiente.apellidoPaterno;
        this.dependienteDialogComponent.apellidoMaternoDependiente = this.dataItemDependiente.apellidoMaterno;
        this.dependienteDialogComponent.tipoDocumentoDependiente = this.dataItemDependiente.tipoDocumento;
        this.dependienteDialogComponent.numeroDocumentoDependiente = this.dataItemDependiente.numeroDocumento;
        this.dependienteDialogComponent.relacionDependiente = this.dataItemDependiente.relacion;
        this.dependienteDialogComponent.fechaNacimientoDepediente = this.dataItemDependiente.fechaNacimiento;
        this.dependienteDialogComponent.nombreRelacionDepediente = this.dataItemDependiente.nombreRelacion;
        this.dependienteDialogComponent.nombreTipoDocumentoDependiente = this.dataItemDependiente.nombreTipoDocumento;

    }

    public onGuardarDependiente(dto: Dependiente): void {

        const operation = dto.idDependiente === undefined ?
            this.crearDependiente(dto) :
            this.editarDependiente(dto);

        this.obtenerGridDependiente();

    }

    public onEliminarDependiente(e: Dependiente): void {
        const operation = this.eliminarDependiente(e);
        this.obtenerGridDependiente();
    }

    public onCancelarDependiente(): void {
        this.dataItemDependiente = undefined;
    }

    public obtenerDependiente(): Observable<Dependiente[]> {
        return this.fetchDependiente();
    }

    public editarDependiente(data: Dependiente): Observable<Dependiente[]> {
        return this.fetchDependiente("update", data);
    }

    public crearDependiente(data: Dependiente): Observable<Dependiente[]> {
        data.idDependiente = this.generarIdDependienteTemporal();
        return this.fetchDependiente("create", data);

    }

    public eliminarDependiente(data: Dependiente): Observable<Dependiente[]> {
        return this.fetchDependiente("destroy", data);
    }

    private fetchDependiente(action: string = "", data?: Dependiente): Observable<Dependiente[]>  {

        if(action=="create"){
            var documento : Dependiente = (JSON.parse(JSON.stringify(data)));
            this.dependientes.push(documento);
        }else if(action=="update"){
            var indice = this.dependientes.indexOf(data);
            if(indice>=0)
                this.dependientes[indice]  = (JSON.parse(JSON.stringify(data)));
        }else if(action=="destroy"){
            var indice = this.dependientes.indexOf(data);

            if(indice>=0)
                this.dependientes.splice(indice, 1);

        }

        return Observable.of(this.dependientes);
    }

    generarIdDependienteTemporal():number {
        if (this.dependientes != null)
            return (this.dependientes.length + 2)* -1;
        else
            return-1;
    }

    protected pageChangeDependiente(event: PageChangeEvent): void {
        this.skipDependiente = event.skip;
        this.obtenerGridDependiente();

    }

    //experiencia Laboral

    public dataItemExperienciaLaboral: ExperienciaLaboral;

    @ViewChild(ExperienciaLaboralDatosPersonalesDialogFormComponent) protected editExperienciaLaboralFormComponent: ExperienciaLaboralDatosPersonalesDialogFormComponent;

    public onEditarExperienciaLaboral(dataItem: any): void {
        this.editExperienciaLaboralFormComponent.titulo = "Editar";
        this.editExperienciaLaboralFormComponent.tituloBoton = "Actualizar";
        this.dataItemExperienciaLaboral = dataItem;
        this.editExperienciaLaboralFormComponent.razonSocial = this.dataItemExperienciaLaboral.razonSocial;
        this.editExperienciaLaboralFormComponent.departamento = this.dataItemExperienciaLaboral.departamento;
        this.editExperienciaLaboralFormComponent.cargo = this.dataItemExperienciaLaboral.cargo;
        this.editExperienciaLaboralFormComponent.descripcion = this.dataItemExperienciaLaboral.descripcion;
        this.editExperienciaLaboralFormComponent.fechaInicio = this.dataItemExperienciaLaboral.fechaInicio;
        this.editExperienciaLaboralFormComponent.fechaFin = this.dataItemExperienciaLaboral.fechaFin;
    }

    public onCancelarExperienciaLaboral(): void {
        this.dataItemExperienciaLaboral = undefined;
    }

    public onAgregarExperienciaLaboral(dto: ExperienciaLaboral): void {

        const operation = dto.idExperienciaLaboral === undefined ?
            this.crearExperienciaLaboral(dto) :
            this.editarExperienciaLaboral(dto);

        this.obtenerGridExperienciaLaboral();

    }

    public onEliminarExperienciaLaboral(e: ExperienciaLaboral): void {
        const operation = this.eliminarExperienciaLaboral(e);
        this.obtenerGridExperienciaLaboral();
    }

    public agregarExperienciaLaboral(): void {
        this.editExperienciaLaboralFormComponent.titulo = "Agregar";
        this.editExperienciaLaboralFormComponent.tituloBoton = "Agregar";
        this.editExperienciaLaboralFormComponent.agregarExperienciaLaboral();
    }

    public obtenerExperienciasLaborales(): Observable<ExperienciaLaboral[]> {
        return this.fetchExperienciaLaboral();
    }

    public editarExperienciaLaboral(data: ExperienciaLaboral): Observable<ExperienciaLaboral[]> {
        return this.fetchExperienciaLaboral("update", data);
    }

    public crearExperienciaLaboral(data: ExperienciaLaboral): Observable<ExperienciaLaboral[]> {
        data.idExperienciaLaboral = this.generarIdExperienciaLaboralTemporal();
        return this.fetchExperienciaLaboral("create", data);

    }

    public eliminarExperienciaLaboral(data: ExperienciaLaboral): Observable<ExperienciaLaboral[]> {
        return this.fetchExperienciaLaboral("destroy", data);
    }

    private fetchExperienciaLaboral(action: string = "", data?: ExperienciaLaboral): Observable<ExperienciaLaboral[]>  {

        if(action=="create"){
            var model : ExperienciaLaboral = (JSON.parse(JSON.stringify(data)));
            this.experienciasLaborales.push(model);
        }else if(action=="update"){
            var indice = this.experienciasLaborales.indexOf(data);
            if(indice>=0)
                this.experienciasLaborales[indice]  = (JSON.parse(JSON.stringify(data)));
        }else if(action=="destroy"){
            var indice = this.experienciasLaborales.indexOf(data);

            if(indice>=0)
                this.experienciasLaborales.splice(indice, 1);

        }

        return Observable.of(this.experienciasLaborales);
    }

    generarIdExperienciaLaboralTemporal():number {
        if (this.experienciasLaborales != null)
            return (this.experienciasLaborales.length + 2)* -1;
        else
            return-1;
    }

    protected pageChangeExperienciaLaboral(event: PageChangeEvent): void {
        this.skipExperienciaLaboral = event.skip;
        this.obtenerGridExperienciaLaboral();

    }


    //educacion

    public dataItemEducacion: Educacion;

    @ViewChild(EducacionDatosPersonalesDialogFormComponent) protected educacionDialogComponent: EducacionDatosPersonalesDialogFormComponent;

    public agregarEducacion(): void {
        this.educacionDialogComponent.tituloCabecera = "Agregar";
        this.educacionDialogComponent.tituloBoton = "Agregar";
        this.educacionDialogComponent.agregarEducacion();

    }

    public onEditarEducacion(dataItem: any): void {
        this.educacionDialogComponent.tituloCabecera = "Editar";
        this.educacionDialogComponent.tituloBoton = "Actualizar";
        this.educacionDialogComponent.obtenerNivelEducacion();
        this.dataItemEducacion = dataItem;
        this.educacionDialogComponent.nivelEducacion = this.dataItemEducacion.nivelEducacion;
        this.educacionDialogComponent.institucion = this.dataItemEducacion.institucion;
        this.educacionDialogComponent.titulo = this.dataItemEducacion.titulo;
        this.educacionDialogComponent.descripcion = this.dataItemEducacion.descripcion;
        this.educacionDialogComponent.fechaInicio = this.dataItemEducacion.fechaInicio;
        this.educacionDialogComponent.fechaFin = this.dataItemEducacion.fechaFin;
        this.educacionDialogComponent.nombreNivelEducacion = this.dataItemEducacion.nombreNivelEducacion;
    }

    public onGuardarEducacion(dto: Educacion): void {

        const operation = dto.idEducacion === undefined ?
            this.crearEducacion(dto) :
            this.editarEducacion(dto);

        this.obtenerGridEducacion();

    }

    public onEliminarEducacion(e: Educacion): void {
        const operation = this.eliminarEducacion(e);

        this.obtenerGridEducacion();
    }

    public onCancelarEducacion(): void {
        this.dataItemEducacion = undefined;
    }

    public obtenerEducacion(): Observable<Educacion[]> {
        return this.fetchEducacion();
    }

    public editarEducacion(data: Educacion): Observable<Educacion[]> {
        return this.fetchEducacion("update", data);
    }

    public crearEducacion(data: Educacion): Observable<Educacion[]> {
        data.idEducacion = this.generarIdEducacionTemporal();
        return this.fetchEducacion("create", data);

    }

    public eliminarEducacion(data: Educacion): Observable<Educacion[]> {
        return this.fetchEducacion("destroy", data);
    }

    private fetchEducacion(action: string = "", data?: Educacion): Observable<Educacion[]>  {

        if(action=="create"){
            var documento : Educacion = (JSON.parse(JSON.stringify(data)));
            this.educaciones.push(documento);
        }else if(action=="update"){
            var indice = this.educaciones.indexOf(data);
            if(indice>=0)
                this.educaciones[indice]  = (JSON.parse(JSON.stringify(data)));
        }else if(action=="destroy"){
            var indice = this.educaciones.indexOf(data);

            if(indice>=0)
                this.educaciones.splice(indice, 1);

        }

        return Observable.of(this.educaciones);
    }

    generarIdEducacionTemporal():number {
        if (this.educaciones != null)
            return (this.educaciones.length + 2)* -1;
        else
            return-1;
    }

    protected pageChangeEducacion(event: PageChangeEvent): void {
        this.skipEducacion = event.skip;
        this.obtenerGridEducacion();

    }

    //permiso empleado
    public dataItemPermisoEmpleado: PermisoEmpleado;

    private gridViewPermisoEmpleado: GridDataResult;

    private pageSizePermisoEmpleado: number = 10;
    private skipPermisoEmpleado: number = 0;

    @ViewChild(PermisosDialogFormComponent) protected editPermisosFormComponent: PermisosDialogFormComponent;

    public onEditarPermisoEmpleado(dataItem: any): void {

        this.editPermisosFormComponent.tituloCabecera = "Editar";

        this.dataItemPermisoEmpleado = dataItem;

        if(this.dataItemPermisoEmpleado.estado == 'P'){
            this.editPermisosFormComponent.isEnviado=false;
            this.editPermisosFormComponent.enviadoClass='input';
        }else {
            this.editPermisosFormComponent.isEnviado=true;
            this.editPermisosFormComponent.enviadoClass='input state-disabled';
        }

        if(this.dataItemPermisoEmpleado.motivo == 'P'){
            this.editPermisosFormComponent.isCompensarhoras=false;
        }else{
            this.editPermisosFormComponent.isCompensarhoras=true;
        }

        this.editPermisosFormComponent.motivo = this.dataItemPermisoEmpleado.motivo;
        this.editPermisosFormComponent.razon = this.dataItemPermisoEmpleado.razon;
        this.editPermisosFormComponent.fechaPermiso = this.dataItemPermisoEmpleado.fecha;
        this.editPermisosFormComponent.horaDesdePermiso = this.dataItemPermisoEmpleado.horaInicio;
        this.editPermisosFormComponent.horaHastaPermiso = this.dataItemPermisoEmpleado.horaFin;
        this.editPermisosFormComponent.fechaRecuperacion = this.dataItemPermisoEmpleado.fechaRecuperacion;
        this.editPermisosFormComponent.horaDesdeRecuperacion = this.dataItemPermisoEmpleado.horaInicioRecuperacion== null ? '' : this.dataItemPermisoEmpleado.horaInicioRecuperacion;
        this.editPermisosFormComponent.horaHastaRecuperacion = this.dataItemPermisoEmpleado.horaFinRecuperacion== null ? '' :  this.dataItemPermisoEmpleado.horaFinRecuperacion;
        this.editPermisosFormComponent.nombreEstado = this.dataItemPermisoEmpleado.nombreEstado;
        this.editPermisosFormComponent.estado = this.dataItemPermisoEmpleado.estado;
        this.editPermisosFormComponent.jefeInmediato = this.dataItemPermisoEmpleado.jefeInmediato;
        this.editPermisosFormComponent.periodo = this.dataItemPermisoEmpleado.periodo;

    }

    public onCancelarPermisoEmpleado(): void {
        this.dataItemPermisoEmpleado = undefined;
    }

    public onAgregarPermisoEmpleado(dto: PermisoEmpleado): void {
        this.cargarPermisoEmpleado(this.periodoEmpleadoPermiso);
        //this.editarPermisoEmpleado(dto);
        //this.obtenerGridPermisoEmpleado();
    }

    public onEliminarPermisoEmpleado(e: PermisoEmpleado): void {
        const operation = this.eliminarPermisoEmpleado(e);
        this.obtenerGridPermisoEmpleado();
    }

    public editarPermisoEmpleado(data: PermisoEmpleado): Observable<PermisoEmpleado[]> {
        return this.fetchPermisoEmpleado("update", data);
    }


    public eliminarPermisoEmpleado(data: PermisoEmpleado): Observable<PermisoEmpleado[]> {
        return this.fetchPermisoEmpleado("destroy", data);
    }

    private fetchPermisoEmpleado(action: string = "", data?: PermisoEmpleado): Observable<PermisoEmpleado[]>  {

        if(action=="update"){
            var indice = this.permisosEmpleados.indexOf(data);
            if(indice>=0)
                this.permisosEmpleados[indice]  = (JSON.parse(JSON.stringify(data)));
        }else if(action=="destroy"){
            var indice = this.permisosEmpleados.indexOf(data);

            if(indice>=0)
                this.permisosEmpleados.splice(indice, 1);

        }

        return Observable.of(this.permisosEmpleados);
    }

    obtenerGridPermisoEmpleado():void{
        if(this.permisosEmpleados.length>0){
            //this.isEmpty=false;
            this.gridViewPermisoEmpleado = {
                data: this.permisosEmpleados.slice(this.skipPermisoEmpleado, this.skipPermisoEmpleado + this.pageSizePermisoEmpleado),
                total: this.permisosEmpleados.length
            };
        }else{
            //this.isEmpty=true;
            this.gridViewPermisoEmpleado = {
                data: [],
                total: 0
            };
        }
    }

    protected pageChangePermisoEmpleado(event: PageChangeEvent): void {
        this.skipPermisoEmpleado = event.skip;
        this.obtenerGridPermisoEmpleado();

    }

    //horas extras empleado

    public dataItemHoraExtra: HorasExtra;

    private gridViewHorasExtras: GridDataResult;

    private pageSizeHorasExtras: number = 10;
    private skipHorasExtras: number = 0;

    @ViewChild(HorasExtrasDialogFormComponent) protected editHorasExtrasFormComponent: HorasExtrasDialogFormComponent;

    public onEditarhorasExtras(dataItem: any): void {

        this.editHorasExtrasFormComponent.tituloCabecera = "Editar";

        this.dataItemHoraExtra = dataItem;

        if(this.dataItemHoraExtra.estado == 'P'){
            this.editHorasExtrasFormComponent.isEnviado=false;
            this.editHorasExtrasFormComponent.enviadoClass='input';
        }else {
            this.editHorasExtrasFormComponent.isEnviado=true;
            this.editHorasExtrasFormComponent.enviadoClass='input state-disabled';
        }

        this.editHorasExtrasFormComponent.fecha = this.dataItemHoraExtra.fecha;
        this.editHorasExtrasFormComponent.jefeInmediato = this.dataItemHoraExtra.jefeInmediato;
        this.editHorasExtrasFormComponent.horaSalidaHorario = this.dataItemHoraExtra.horaSalidaHorario;
        this.editHorasExtrasFormComponent.horaSalidaSolicitado = this.dataItemHoraExtra.horaSalidaSolicitado;
        this.editHorasExtrasFormComponent.horas = this.dataItemHoraExtra.horas;
        this.editHorasExtrasFormComponent.motivo = this.dataItemHoraExtra.motivo;
        this.editHorasExtrasFormComponent.horasCompensadas = this.dataItemHoraExtra.horasCompensadas;
        this.editHorasExtrasFormComponent.horasSemanalesPendientes = this.dataItemHoraExtra.horasSemanalesPendientes;

        this.editHorasExtrasFormComponent.comentarioResolucion = this.dataItemHoraExtra.comentarioResolucion;
        this.editHorasExtrasFormComponent.horasNoCompensables = this.dataItemHoraExtra.horasNoCompensables;
        this.editHorasExtrasFormComponent.horasAdicionales = this.dataItemHoraExtra.horasNoCompensables + parseFloat(this.dataItemHoraExtra.horas.toString());
        this.editHorasExtrasFormComponent.estado = this.dataItemHoraExtra.estado;
        this.editHorasExtrasFormComponent.nombreEstado = this.dataItemHoraExtra.nombreEstado;

    }


    public onCancelarHorasExtras(): void {
        this.dataItemHoraExtra = undefined;
    }

    public onAgregarHorasExtras(dto: HorasExtra): void {

        this.editarHorasExtras(dto);
        this.obtenerGridHorasExtras();

    }

    public onEliminarHorasExtras(e: HorasExtra): void {
        const operation = this.eliminarHorasExtras(e);
        this.obtenerGridHorasExtras();
    }


    public editarHorasExtras(data: HorasExtra): Observable<HorasExtra[]> {
        return this.fetchHorasExtras("update", data);
    }


    public eliminarHorasExtras(data: HorasExtra): Observable<HorasExtra[]> {
        return this.fetchHorasExtras("destroy", data);
    }

    private fetchHorasExtras(action: string = "", data?: HorasExtra): Observable<HorasExtra[]>  {

        if(action=="update"){
            var indice = this.horasExtras.indexOf(data);
            if(indice>=0)
                this.horasExtras[indice]  = (JSON.parse(JSON.stringify(data)));
        }else if(action=="destroy"){
            var indice = this.horasExtras.indexOf(data);

            if(indice>=0)
                this.horasExtras.splice(indice, 1);

        }

        return Observable.of(this.horasExtras);
    }

    obtenerGridHorasExtras():void{
        if(this.horasExtras.length>0){
            this.gridViewHorasExtras = {
                data: this.horasExtras.slice(this.skipHorasExtras, this.skipHorasExtras + this.pageSizeHorasExtras),
                total: this.horasExtras.length
            };
        }else{
            this.gridViewHorasExtras = {
                data: [],
                total: 0
            };
        }
    }

    protected pageChangeHorasExtras(event: PageChangeEvent): void {
        this.skipHorasExtras = event.skip;
        this.obtenerGridHorasExtras();

    }


    //Licencia empleado

    public dataItemLicencia: Licencia;

    private gridViewLicencias: GridDataResult;

    private pageSizeLicencias: number = 10;
    private skipLicencias: number = 0;

    @ViewChild(LicenciaDialogFormComponent) protected editLicenciaFormComponent: LicenciaDialogFormComponent;

    public onEditarLicencias(dataItem: any): void {

        this.editLicenciaFormComponent.tituloCabecera = "Editar";
        this.editLicenciaFormComponent.obtenerTipoLicencia();
        this.dataItemLicencia = dataItem;

        if(this.dataItemLicencia.estado == 'P'){
            this.editLicenciaFormComponent.isEnviado=false;
            this.editLicenciaFormComponent.enviadoClass='input';
        }else {
            this.editLicenciaFormComponent.isEnviado=true;
            this.editLicenciaFormComponent.enviadoClass='input state-disabled';
        }

        this.editLicenciaFormComponent.periodo = this.dataItemLicencia.periodo;
        this.editLicenciaFormComponent.jefeInmediato = this.dataItemLicencia.jefeInmediato;
        this.editLicenciaFormComponent.idTipoLicencia = this.dataItemLicencia.idTipoLicencia;
        this.editLicenciaFormComponent.nombreTipoLicencia = this.dataItemLicencia.nombreTipoLicencia;
        this.editLicenciaFormComponent.comentario = this.dataItemLicencia.comentario;
        this.editLicenciaFormComponent.fechaInicio = this.dataItemLicencia.fechaInicio;
        this.editLicenciaFormComponent.fechaFin = this.dataItemLicencia.fechaFin;
        this.editLicenciaFormComponent.dias = this.dataItemLicencia.dias;
        this.editLicenciaFormComponent.diaEntero = this.dataItemLicencia.diaEntero;
        this.editLicenciaFormComponent.horaInicio = this.dataItemLicencia.horaInicio;

        this.editLicenciaFormComponent.horaFin = this.dataItemLicencia.horaFin;

        this.editLicenciaFormComponent.isCheckedTodoDia = this.dataItemLicencia.diaEntero;

        this.editLicenciaFormComponent.documentos = this.dataItemLicencia.documentos;

    }

    public onCancelarLicencias(): void {
        this.dataItemLicencia = undefined;
    }

    public onAgregarLicencias(dto: Licencia): void {
        this.cargarLicencias(this.periodoEmpleadoLicencia);
        //this.editarLicencias(dto);
        //this.obtenerGridLicencias();

    }

    public onEliminarLicencias(e: Licencia): void {
        const operation = this.eliminarLicencias(e);
        this.obtenerGridLicencias();
    }


    public editarLicencias(data: Licencia): Observable<Licencia[]> {
        return this.fetchLicencias("update", data);
    }


    public eliminarLicencias(data: Licencia): Observable<Licencia[]> {
        return this.fetchLicencias("destroy", data);
    }

    private fetchLicencias(action: string = "", data?: Licencia): Observable<Licencia[]>  {

        if(action=="update"){
            var indice = this.licencias.indexOf(data);
            if(indice>=0)
                this.licencias[indice]  = (JSON.parse(JSON.stringify(data)));
        }else if(action=="destroy"){
            var indice = this.licencias.indexOf(data);

            if(indice>=0)
                this.licencias.splice(indice, 1);

        }

        return Observable.of(this.licencias);
    }

    obtenerGridLicencias():void{
        if(this.licencias.length>0){
            this.gridViewLicencias = {
                data: this.licencias.slice(this.skipLicencias, this.skipLicencias + this.pageSizeLicencias),
                total: this.licencias.length
            };
        }else{
            this.gridViewLicencias = {
                data: [],
                total: 0
            };
        }
    }

    protected pageChangeLicencias(event: PageChangeEvent): void {
        this.skipLicencias = event.skip;
        this.obtenerGridLicencias();

    }

    //vacaciones empleado

    public dataItemVacacion: Vacacion;

    private gridViewVacaciones: GridDataResult;

    private pageSizeVacaciones: number = 10;
    private skipVacaciones: number = 0;

    @ViewChild(VacacionesDialogFormComponent) protected editVacacionesFormComponent: VacacionesDialogFormComponent;

    public onEditarVacaciones(dataItem: any): void {

        this.editVacacionesFormComponent.tituloCabecera = "Editar";

        this.dataItemVacacion = dataItem;

        if(this.dataItemVacacion.estado == 'P'){
            this.editVacacionesFormComponent.isEnviado=false;
            this.editVacacionesFormComponent.enviadoClass='input';
        }else {
            this.editVacacionesFormComponent.isEnviado=true;
            this.editVacacionesFormComponent.enviadoClass='input state-disabled';
        }


        this.editVacacionesFormComponent.periodo = this.dataItemVacacion.periodo;
        this.editVacacionesFormComponent.jefeInmediato = this.dataItemVacacion.jefeInmediato;
        this.editVacacionesFormComponent.fechaDesde = this.dataItemVacacion.fechaInicio;
        this.editVacacionesFormComponent.fechaHasta = this.dataItemVacacion.fechaFin;
        this.editVacacionesFormComponent.diasCalendarios = this.dataItemVacacion.diasCalendarios;
        this.editVacacionesFormComponent.diasHabiles = this.dataItemVacacion.diasHabiles;
        this.editVacacionesFormComponent.jefeInmediato = this.dataItemVacacion.jefeInmediato;
        this.editVacacionesFormComponent.periodo = this.dataItemVacacion.periodo;
        this.editVacacionesFormComponent.estado = this.dataItemVacacion.estado;
        this.editVacacionesFormComponent.nombreEstado = this.dataItemVacacion.nombreEstado;
        this.editVacacionesFormComponent.estado = this.dataItemVacacion.estado;
        this.editVacacionesFormComponent.diasVacacionesDisponibles=this.dataItemVacacion.diasVacacionesDisponibles;

    }

    public onCancelarVacaciones(): void {
        this.dataItemVacacion = undefined;
    }

    public onAgregarVacaciones(dto: Vacacion): void {
        this.cargarVacaciones(this.periodoEmpleadoVacaciones);
        //this.editarVacaciones(dto);
        //this.obtenerGridVacaciones();

    }

    public onEliminarVacaciones(e: Vacacion): void {
        const operation = this.eliminarVacaciones(e);
        this.obtenerGridVacaciones();
    }


    public editarVacaciones(data: Vacacion): Observable<Vacacion[]> {
        return this.fetchVacaciones("update", data);
    }


    public eliminarVacaciones(data: Vacacion): Observable<Vacacion[]> {
        return this.fetchVacaciones("destroy", data);
    }

    private fetchVacaciones(action: string = "", data?: Vacacion): Observable<Vacacion[]>  {

        if(action=="update"){
            var indice = this.vacaciones.indexOf(data);
            if(indice>=0)
                this.vacaciones[indice]  = (JSON.parse(JSON.stringify(data)));
        }else if(action=="destroy"){
            var indice = this.vacaciones.indexOf(data);

            if(indice>=0)
                this.vacaciones.splice(indice, 1);

        }

        return Observable.of(this.vacaciones);
    }

    obtenerGridVacaciones():void{
        if(this.vacaciones.length>0){
            //this.isEmpty=false;
            this.gridViewVacaciones = {
                data: this.vacaciones.slice(this.skipVacaciones, this.skipVacaciones + this.pageSizeVacaciones),
                total: this.vacaciones.length
            };
        }else{
            //this.isEmpty=true;
            this.gridViewVacaciones = {
                data: [],
                total: 0
            };
        }
    }

    protected pageChangeVacaciones(event: PageChangeEvent): void {
        this.skipVacaciones = event.skip;
        this.obtenerGridVacaciones();

    }

    //marcacion
    public dataItemMarcacion: Marcacion;

    private gridViewMarcaciones: GridDataResult;

    private pageSizeMarcaciones: number = 10;
    private skipMarcaciones: number = 0;

    @ViewChild(MarcacionesDialogFormComponent) protected editMarcacionesFormComponent: MarcacionesDialogFormComponent;

    public onEditarMarcaciones(dataItem: any): void {

        this.dataItemMarcacion = dataItem;

        this.editMarcacionesFormComponent.nombreEmpleado = this.dataItemMarcacion.nombreCompletoEmpleado;
        this.editMarcacionesFormComponent.fechaMarcacion = this.dataItemMarcacion.fecha;
        this.editMarcacionesFormComponent.horaIngreso = this.dataItemMarcacion.horaIngreso;
        this.editMarcacionesFormComponent.horaInicioAlmuerzo = this.dataItemMarcacion.horaInicioAlmuerzo;
        this.editMarcacionesFormComponent.horaFinAlmuerzo = this.dataItemMarcacion.horaFinAlmuerzo;
        this.editMarcacionesFormComponent.horaSalida = this.dataItemMarcacion.horaSalida;

        this.editMarcacionesFormComponent.horaIngresoSolicitud = this.dataItemMarcacion.horaIngreso;
        this.editMarcacionesFormComponent.horaInicioAlmuerzoSolicitud = this.dataItemMarcacion.horaInicioAlmuerzo;
        this.editMarcacionesFormComponent.horaFinAlmuerzoSolicitud = this.dataItemMarcacion.horaFinAlmuerzo;
        this.editMarcacionesFormComponent.horaSalidaSolicitud = this.dataItemMarcacion.horaSalida;

        this.editMarcacionesFormComponent.idEmpleado = this.dataItemMarcacion.idEmpleado;

        this.editMarcacionesFormComponent.obtenerJefeInmediatoMarcaciones();

    }

    public onCancelaSolicitudCambio(): void {
        this.dataItemMarcacion = undefined;
    }

    public onAgregarSolicitudCambio(dto: Marcacion): void {

        this.editarMarcaciones(dto);
        this.obtenerGridMarcaciones();

    }

    public onEliminarMarcacion(e: Marcacion): void {
        const operation = this.eliminarMarcaciones(e);
        this.obtenerGridMarcaciones();
    }


    public editarMarcaciones(data: Marcacion): Observable<Marcacion[]> {
        return this.fetchMarcaciones("update", data);
    }


    public eliminarMarcaciones(data: Marcacion): Observable<Marcacion[]> {
        return this.fetchMarcaciones("destroy", data);
    }

    private fetchMarcaciones(action: string = "", data?: Marcacion): Observable<Marcacion[]>  {

        if(action=="update"){
            var indice = this.marcaciones.indexOf(data);
            if(indice>=0)
                this.marcaciones[indice]  = (JSON.parse(JSON.stringify(data)));
        }else if(action=="destroy"){
            var indice = this.marcaciones.indexOf(data);

            if(indice>=0)
                this.marcaciones.splice(indice, 1);

        }

        return Observable.of(this.marcaciones);
    }

    obtenerGridMarcaciones():void{
        if(this.marcaciones.length>0){
            //this.isEmpty=false;
            this.gridViewMarcaciones = {
                data: this.marcaciones.slice(this.skipMarcaciones, this.skipMarcaciones + this.pageSizeMarcaciones),
                total: this.marcaciones.length
            };
        }else{
            //this.isEmpty=true;
            this.gridViewMarcaciones = {
                data: [],
                total: 0
            };
        }
    }

    protected pageChangeMarcaciones(event: PageChangeEvent): void {
        this.skipMarcaciones = event.skip;
        this.obtenerGridMarcaciones();

    }

    //datos persona

    validarRequerido(){
        let validacion = false;


        if(this.empleado.direccionDomicilio === undefined || this.empleado.direccionDomicilio == null || this.empleado.direccionDomicilio==''){
            $('#direccion').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        if(this.empleado.tipoDomicilio === undefined || this.empleado.tipoDomicilio == null || this.empleado.tipoDomicilio==''){
            validacion = true;
        }

        if(this.empleado.paisDomicilio === undefined || this.empleado.paisDomicilio == null || this.empleado.paisDomicilio==''){
            validacion = true;
        }

        if(this.empleado.telefonoCelular === undefined || this.empleado.telefonoCelular == null || this.empleado.telefonoCelular==''){
            $('#celular').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        return validacion;
    }

    ingresaDireccion(){
        $('#direccion').parent().removeClass('state-error');
    }

    ingresaCelular(){
        $('#celular').parent().removeClass('state-error');
    }

    onActualizarDatosPersonales(){
        this.empleado.dependientes = this.dependientes;
        this.empleado.experienciasLaborales = this.experienciasLaborales;
        this.empleado.educaciones = this.educaciones;
        this.empleado.documentos = this.documentos;
        this.empleado.equiposEntregados = this.equiposEntregados;


        if(this.validarRequerido()){
            this.msgs.push({severity: 'error', summary: 'Runakuna Error', detail:'Ingrese los campos obligatorios.'});
            return;
        }
        this.currentUser  = JSON.parse(sessionStorage.getItem("authenticatedUser"));
        this.empleado.idEmpresa=this.currentUser.idEmpresa;

        this.blockedUI  = true;

        this.empleadoService.actualizarDatosPersonalesEmpleado(this.empleado).subscribe(
            data => {
                this.blockedUI  = false;
                this.backendService.notification(this.msgs, data);

                if (data.codigo == 1) {
                    this.cargarinformacionEmpelado(this.empleado.idEmpleado);
                    this.navegarDatosPersonalesEmpleado(data);
                }
            },
                error => {
                    this.blockedUI  = false;
                    this.backendService.notification(this.msgs, error);
                }
        );

    }

    navegarDatosPersonalesEmpleado(data:NotificacionResult){
        this.state.tabs.tabdatosPersonales=='tab-active-1';
    }

    //calculo tiempo en letras
    private duration(fechaInicio:Date, fechaFin:Date) {

        let years:number=0;
        let months:number=0;
        let days:number=0;


        if (fechaInicio >= fechaFin) {
            this.tiempoTrabajado = undefined;
            return;
        }

        fechaFin.setHours(0);
        fechaFin.setMinutes(0);
        fechaFin.setSeconds(0);

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

        let duracion:string='';
        let concat:string='';



        if(years == 1){
            duracion = years+' año ';
        }else if(years > 1){
            duracion = years+' años ';
        }

        if(months == 1){
            duracion = duracion+months+' mes ';
        }else if(months > 1){
            duracion = duracion+months+' meses ';
        }

        if(days == 1){
            duracion = duracion + parseInt(days.toString()) + ' día';
        }else if(days > 1){
            duracion = duracion + parseInt(days.toString()) + ' días';
        }

        this.tiempoTrabajado = duracion;

    }



}
