import {Component, OnInit, ViewChild} from "@angular/core";
import {Observable} from "rxjs/Rx";
import {DocumentoDialogFormComponent} from "./documento.dialog.component";
import {EducacionDialogFormComponent} from "./educacion.dialog.component";
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {CentroCostoDto} from "./centroCostoDto";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {PaisDto} from "./paisDto";
import {DepartamentoDto} from "./departamentoDto";
import {PaisService} from "../../+common/service/pais.service";
import {PageChangeEvent} from "@progress/kendo-angular-grid";
import {DocumentoEmpleado} from "../../+dto/maintenance/documentoEmpleado";
import {Educacion} from "../../+dto/maintenance/educacion";
import {Empleado} from "../../+dto/maintenance/empleado";
import {ExperienciaLaboral} from "../../+dto/maintenance/experienciaLaboral";
import {ExperienciaLaboralDialogFormComponent} from "./experienciaLaboral.dialog.component";
import {EquipoEntregado} from "../../+dto/maintenance/equipoEntregado";
import {EquipoEntregadoDialogFormComponent} from "./equipoEntregado.dialog.component";
import {Adjunto} from "./adjunto";
import {FotoFormComponent} from "./foto.form.component";
import {Router} from "@angular/router";
import {DatePipe} from "@angular/common";
import {NotificacionResult} from "../../+dto/NotificacionResult";
import {environment} from "../../../environments/environment";
import {NotificationsService} from "angular2-notifications/src/notifications.service";
import {StorageResult} from "../../+dto/storageResult";
import {Http} from "@angular/http";
import {ComponentBase} from "../../+common/service/componentBase";
import {CurrentUser} from "../../+dto/currentUser";
import {Dependiente} from "../../+dto/maintenance/dependiente";
import {BackendService} from "../../+rest/backend.service";


declare var $: any;

@Component({
    selector: 'sa-empleado',
    templateUrl: 'empleado.component.html',
    providers: [PaisService,NotificationsService ,DatePipe]
})
export class EmpleadoComponent extends ComponentBase implements OnInit {

    localhost:  String = environment.backend;
    port: String = environment.port;

    public fotoEmpleado:DocumentoEmpleado;

    //foto
    public dataItemFoto: Adjunto;

    public isDisabledCodigo:boolean=false;

    public edad:number;

    public classCodigo:string='input';

    public disabledEdad:boolean=true;

    public empleado:Empleado= new Empleado();

    public defaultItem:TablaGeneralResult={codigo:null,nombre:'Seleccionar',grupo:null};

    public defaultItemPais:PaisDto={codigo:null,nombre:'Seleccionar'};

    public defaultItemDepartamento:DepartamentoDto={codigo:null,nombre:'Seleccionar'};

    public defaultItemCentroCosto:CentroCostoDto={idCentroCosto:null,nombre:'Seleccionar'};

    public tiposDocumento:TablaGeneralResult[];

    public estadosCivil:TablaGeneralResult[];

    public gruposSanguineo:TablaGeneralResult[];

    public generos:TablaGeneralResult[];

    public contratosTrabajo:TablaGeneralResult[];

    public tiposTrabajo:TablaGeneralResult[];

    public regimenesHorario:TablaGeneralResult[];

    public regimenesLaboral:TablaGeneralResult[];

    public tiposDomicilio:TablaGeneralResult[];

    public relacionesContacto:TablaGeneralResult[];

    public entidadesFinancieras:TablaGeneralResult[];

    public afps:TablaGeneralResult[];

    public eps:TablaGeneralResult[];

    public paises:PaisDto[];

    public departamentos:DepartamentoDto[];

    public provincias:DepartamentoDto[];

    public distritos:DepartamentoDto[];

    public paisesDomicilio:PaisDto[];

    public paisDomicilio;

    public departamentosDomicilio:DepartamentoDto[];

    public provinciasDomicilio:DepartamentoDto[];

    public distritosDomicilio:DepartamentoDto[];

    public centrosCosto:CentroCostoDto[];

    public isEnableDepartamento:boolean;

    public isEnableProvincia:boolean;

    public isEnableDistrito:boolean;

    public isEnableDepartamentoDomicilio:boolean;

    public isEnableProvinciaDomicilio:boolean;

    public isEnableDistritoDomicilio:boolean;

    public tituloCabecera:string[]=[];

    protected currentUser:CurrentUser;

    public myDatePickerOptions = {
        todayBtnTxt:'Hoy',
        dateFormat:'dd/mm/yyyy',
        firstDayOfWeek:'mo',
        sunHighlight:true,
        height:'34px',
        width:'260px',
        inline:false,
        selectionTxtFontSize:'12px',
        //editableDateField:false,
        alignSelectorRight:true,
        dayLabels:{su:'Dom',mo:'Lun',tu:'Mar',we:'Mie',th:'Jue',fr:'Vie',sa:'Sab'},
        monthLabels:{1:'Ene',2:'Feb',3:'Mar',4:'Abr',5:'May',6:'Jun',7:'Jul',8:'Ago',9:'Set',10:'Oct',11:'Nov',12:'Dic'}
    }

    private dependientes:Dependiente[]= [];

    @ViewChild(FotoFormComponent) protected fotoFormComponent: FotoFormComponent;


    private imagenEmpleado:string = '';
    private nombreCompletoEmpleado:string = '';
    private tituloBotonEmpleado:string = '';

    constructor(public backendService: BackendService,
                private empleadoService:EmpleadoService,
                private paisService:PaisService,
                private _router: Router) {

        super(backendService,'EM001');

        let isNewEmpleado:boolean = this.empleadoService.retrieveSessionStorage('isNewEmpleado');

        this.getTiposDocumento();
        this.getEstadosCivil();
        this.getGruposSanguineo();
        this.getGeneros();
        this.obtenerPaises();
        this.obtenerPaisesDomicilio();

        this.isEnableDepartamento=true;
        this.isEnableProvincia=true;
        this.isEnableDistrito=true;

        this.isEnableDepartamentoDomicilio=true;
        this.isEnableProvinciaDomicilio=true;
        this.isEnableDistritoDomicilio=true;

        this.obtenerCentrosCosto();
        this.getContratosTrabajo();
        this.getTiposTrabajo();
        this.getRegimenesHorario();
        this.getRegimenesLaboral();
        this.getTiposDomicilio();
        this.getRelacionesContacto();

        this.getEntidadFinanciera();
        this.getAFP();
        this.getEPS();

        if(isNewEmpleado){
            this.tituloBotonEmpleado = "Registrar";
            this.tituloCabecera = ['Empleado'];
            this.isDisabledCodigo = false;
            this.classCodigo = 'input';
            this.flagTieneEps = false;

        }else{
            this.tituloBotonEmpleado = "Actualizar";
            let idEmpleado:number = this.empleadoService.retrieveSessionStorage('idEmpleado');

            this.isDisabledCodigo = true;
            this.classCodigo = 'input state-disabled';

            this.obtenerEmpleado(idEmpleado);

            this.verDocumentos(idEmpleado);
            this.verEducacion(idEmpleado);
            this.verExperienciaLaboral(idEmpleado);
            this.verEquipoEntregado(idEmpleado);
            this.verDependiente(idEmpleado);
        }

    }

    verDependiente(idEmpleado: number){
        this.empleadoService.verDependiente(idEmpleado).subscribe(
            data => this.dependientes = data,
            error => this.errorMessage = <any>error
        );
    }

    public cambio(value){
    }

    public changeMyDate(value){

        let fecha = value.formatted;

        if(fecha === undefined || fecha == null || fecha==''){
            this.empleado.fechaNacimiento = undefined;
            this.edad = undefined;
            return;
        }

        this.empleado.fechaNacimiento = fecha;

        let fechaNac:string[]=this.empleado.fechaNacimiento.split('/');

        let birthday:Date = new Date(parseInt(fechaNac[2]),parseInt(fechaNac[1])-1,parseInt(fechaNac[0]));

        let today:Date = new Date();

        this.edad = today.getFullYear() - birthday.getFullYear();

    }

    public onCancelarImagen(): void {
        this.dataItemFoto = undefined;
    }

    public subirImagen(): void {
        this.fotoFormComponent.subirImagen();
    }

    public onAceptarImagen(dto: Adjunto): void {

        if(this.fotoEmpleado!= undefined && this.fotoEmpleado.idDocumentoEmpleado!=undefined && this.fotoEmpleado.idDocumentoEmpleado!=null) {
            this.fotoEmpleado.contenidoArchivo = dto.content;
            this.fotoEmpleado.tipoArchivo = dto.contentType;
            this.fotoEmpleado.nombreArchivo = dto.name;
            this.fotoEmpleado.tipoDocumento = 'FO';
        }else {
            this.fotoEmpleado = new DocumentoEmpleado(-100, 'Foto Empleado', dto.content, dto.contentType, dto.name, 'FO');
        }

        $("#imgLogo1Subido").css("background-image", "url('data:image/jpeg;base64," + dto.content + "')");

    }

    obtenerEmpleado(idEmpleado: number){

        this.empleadoService.obtenerEmpleado(idEmpleado).subscribe(
            data => this.cargarEmpleado(data),
            error => this.errorMessage = <any>error
        );
    }

    //documentos
    public dataItem: DocumentoEmpleado;

    cargarEmpleado(data:Empleado){

        this.nombreCompletoEmpleado = data.nombreCompletoEmpleado;

        this.actualizarDpto(data.paisNacimiento);

        if(data.departamentoNacimiento != null && data.departamentoNacimiento!= ''){
            this.actualizarProvincia(data.departamentoNacimiento);

            if(data.provinciaNacimiento != null && data.provinciaNacimiento!= ''){
                this.actualizarDistrito(data.provinciaNacimiento);
            }
        }

        this.actualizarDptoDomicilio(data.paisDomicilio);

        if(data.departamentoDomicilio != null && data.departamentoDomicilio!= ''){
            this.actualizarProvinciaDomicilio(data.departamentoDomicilio);

            if(data.provinciaDomicilio != null && data.provinciaDomicilio!= ''){
                this.actualizarDistritoDomicilio(data.provinciaDomicilio);
            }
        }

         if(data.fotoPerfil != null){
              this.fotoEmpleado = new DocumentoEmpleado(data.fotoPerfil.idDocumentoEmpleado,data.fotoPerfil.nombre,data.fotoPerfil.contenidoArchivo,data.fotoPerfil.tipoArchivo,data.fotoPerfil.nombreArchivo,'FO');
              this.fotoEmpleado.creador=data.fotoPerfil.creador;
              this.fotoEmpleado.fechaCreacion=data.fotoPerfil.fechaCreacion;
              this.fotoEmpleado.actualizador=data.fotoPerfil.actualizador;
              this.fotoEmpleado.fechaActualizacion=data.fotoPerfil.fechaActualizacion;
              this.fotoEmpleado.rowVersion=data.fotoPerfil.rowVersion;
              $("#imgLogo1Subido").css("background-image", "url('data:image/jpeg;base64," + data.fotoPerfil.contenidoArchivo + "')");

             this.imagenEmpleado = "data:image/jpeg;base64," +  data.fotoPerfil.contenidoArchivo;
             $('#fotoEmpleado').prop("style","display: block; border-radius: 4px 4px; height: 100px");
             $('#iconPerson').prop("class","");

         }

        this.paisDomicilio=this.empleado.paisDomicilio;
        this.empleado = data;
        this.empleado.paisDomicilio=this.paisDomicilio;
        this.flagTieneEps = this.isAuthorized('Editar');

        this.empleado.edad = this.calculateAge(this.empleado.fechaNacimiento);


    }



    verDocumentos(idEmpleado: number){
        this.empleadoService.verDocumentos(idEmpleado).subscribe(
            data => this.view = data,
            error => this.errorMessage = <any>error
        );
    }

    verEducacion(idEmpleado: number){
        this.empleadoService.verEducacion(idEmpleado).subscribe(
            data => this.viewEducacion = data,
            error => this.errorMessage = <any>error
        );
    }

    verExperienciaLaboral(idEmpleado: number){
        this.empleadoService.verExperienciaLaboral(idEmpleado).subscribe(
            data => this.viewExperienciaLaboral = data,
            error => this.errorMessage = <any>error
        );
    }

    verEquipoEntregado(idEmpleado: number){
        this.empleadoService.verEquipoEntregado(idEmpleado).subscribe(
            data => this.viewEquipoEntregado = data,
            error => this.errorMessage = <any>error
        );
    }


    cargarDocumentosSF(data:DocumentoEmpleado[]){
        this.view = data;
    }

    @ViewChild(DocumentoDialogFormComponent) protected editFormComponent: DocumentoDialogFormComponent;

    private view: Array<DocumentoEmpleado>=[];

    /*public onEdit(dataItem: any): void {
        this.editFormComponent.titulo = "Editar";
        this.dataItem = dataItem;
        this.editFormComponent.nombreDocumento = this.dataItem.nombre;
        this.editFormComponent.contenidoArchivo = this.dataItem.contenidoArchivo;
        this.editFormComponent.contentTypeArchivo = this.dataItem.tipoArchivo;
        this.editFormComponent.nombreArchivo = this.dataItem.nombreArchivo;


    }*/

    public onCancel(): void {
        this.dataItem = undefined;
    }

    public agregarDocumento(): void {
        this.editFormComponent.titulo = "Agregar";
        this.editFormComponent.agregarDocumento();
    }

    public onSave(dto: DocumentoEmpleado): void {

        const operation = dto.idDocumentoEmpleado === undefined ?
            this.crearDocumento(dto) :
            this.editarDocumento(dto);

    }

    public onViewDocument(dto: DocumentoEmpleado): void {

        //let url:string = 'http://localhost:7999/empleado/descargarArchivoDocumento?archivo='+ ;

        if ($("#export_file").length > 0) {
            $("#export_file").remove();
        }
        if ($("#export_file").length === 0) {
            var iframe = $("<iframe src='' name='export_file' id='export_file'></iframe>");
            iframe.appendTo("body");

            var form = $("<form action='"+this.urlDowloadFile +"' method='post' target='export_file'></form>");
            form.append($("<input type='hidden' name='contenidoArchivo' id='contenidoArchivo' />").attr("value",dto.contenidoArchivo));
            form.append($("<input type='hidden' name='tipoArchivo' id='tipoArchivo' />").attr("value",dto.tipoArchivo));
            form.append($("<input type='hidden' name='nombre' id='nombre' />").attr("value",dto.nombre));
            form.append($("<input type='hidden' name='nombreArchivo' id='nombreArchivo' />").attr("value",dto.nombreArchivo));
            form.appendTo("body");

            form.submit();
        }

    }

    public onDelete(e: DocumentoEmpleado): void {
        const operation = this.eliminarDocumento(e);
    }

    public obtenerDocumentos(): Observable<DocumentoEmpleado[]> {
        return this.fetch();
    }

    public editarDocumento(data: DocumentoEmpleado): Observable<DocumentoEmpleado[]> {
        return this.fetch("update", data);
    }

    public crearDocumento(data: DocumentoEmpleado): Observable<DocumentoEmpleado[]> {
        data.idDocumentoEmpleado = this.generarIdDocumentoTemporal();
        return this.fetch("create", data);

    }

    public eliminarDocumento(data: DocumentoEmpleado): Observable<DocumentoEmpleado[]> {
        return this.fetch("destroy", data);
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

    generarIdDocumentoTemporal():number {
        if (this.view != null)
            return (this.view.length + 2)* -1;
        else
            return-1;
    }


    protected pageChange(event: PageChangeEvent): void {
        this.skip = event.skip;
        this.obtenerDocumentos().subscribe(data => this.view = data);
    }

    //Experiencia Laboral

    public dataItemExperienciaLaboral: ExperienciaLaboral;

    @ViewChild(ExperienciaLaboralDialogFormComponent) protected editExperienciaLaboralFormComponent: ExperienciaLaboralDialogFormComponent;

    private viewExperienciaLaboral: Array<ExperienciaLaboral>=[];

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

    }

    public onEliminarExperienciaLaboral(e: ExperienciaLaboral): void {
        const operation = this.eliminarExperienciaLaboral(e);
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
            this.viewExperienciaLaboral.push(model);
        }else if(action=="update"){
            var indice = this.viewExperienciaLaboral.indexOf(data);
            if(indice>=0)
                this.viewExperienciaLaboral[indice]  = (JSON.parse(JSON.stringify(data)));
        }else if(action=="destroy"){
            var indice = this.viewExperienciaLaboral.indexOf(data);

            if(indice>=0)
                this.viewExperienciaLaboral.splice(indice, 1);

        }

        this.viewExperienciaLaboral.sort((a,b)=>this.stringToDate(a.fechaInicio).getTime()-this.stringToDate(b.fechaInicio).getTime());

        return Observable.of(this.viewExperienciaLaboral);
    }

    generarIdExperienciaLaboralTemporal():number {
        if (this.viewExperienciaLaboral != null)
            return (this.viewExperienciaLaboral.length + 2)* -1;
        else
            return-1;
    }


    protected pageChangeExperienciaLaboral(event: PageChangeEvent): void {
        //this.skip = event.skip;
        //this.obtenerDocumentos().subscribe(data => this.view = data);
    }


//educacion

    public dataItemEducacion: Educacion;

    @ViewChild(EducacionDialogFormComponent) protected educacionDialogComponent: EducacionDialogFormComponent;

    private viewEducacion: Array<Educacion>=[];

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

    }

    public onEliminarEducacion(e: Educacion): void {
        const operation = this.eliminarEducacion(e);
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
            this.viewEducacion.push(documento);
        }else if(action=="update"){
            var indice = this.viewEducacion.indexOf(data);
            if(indice>=0)
                this.viewEducacion[indice]  = (JSON.parse(JSON.stringify(data)));
        }else if(action=="destroy"){
            var indice = this.viewEducacion.indexOf(data);

            if(indice>=0)
                this.viewEducacion.splice(indice, 1);

        }

        return Observable.of(this.viewEducacion);
    }

    generarIdEducacionTemporal():number {
        if (this.viewEducacion != null)
            return (this.viewEducacion.length + 2)* -1;
        else
            return-1;
    }

//equipo entregado

    public dataItemEquipoEntregado: EquipoEntregado;

    @ViewChild(EquipoEntregadoDialogFormComponent) protected equipoEntregadoDialogComponent: EquipoEntregadoDialogFormComponent;

    private viewEquipoEntregado: Array<EquipoEntregado>=[];

    public agregarEquipoEntregado(): void {
        this.equipoEntregadoDialogComponent.titulo = "Agregar";
        this.equipoEntregadoDialogComponent.tituloBoton = "Agregar";
        this.equipoEntregadoDialogComponent.agregarEquipoEntregado();


    }

    public onEditarEquipoEntregado(dataItem: any): void {
        this.equipoEntregadoDialogComponent.titulo = "Editar";
        this.equipoEntregadoDialogComponent.tituloBoton = "Actualizar";
        this.equipoEntregadoDialogComponent.obtenerTipoEquipo();
        this.equipoEntregadoDialogComponent.obtenerEstadoTipoEquipo();
        this.dataItemEquipoEntregado = dataItem;

        this.equipoEntregadoDialogComponent.tipoEquipo = this.dataItemEquipoEntregado.tipoEquipo;
        this.equipoEntregadoDialogComponent.estado = this.dataItemEquipoEntregado.estado;
        this.equipoEntregadoDialogComponent.nombreTipoEquipo = this.dataItemEquipoEntregado.nombreTipoEquipo;
        this.equipoEntregadoDialogComponent.nombreEstado = this.dataItemEquipoEntregado.nombreEstado;
        this.equipoEntregadoDialogComponent.fechaEntrega = this.dataItemEquipoEntregado.fechaEntrega;
        this.equipoEntregadoDialogComponent.fechaDevolucion = this.dataItemEquipoEntregado.fechaDevolucion;
        this.equipoEntregadoDialogComponent.descripcion = this.dataItemEquipoEntregado.descripcion;
    }

    public onGuardarEquipoEntregado(dto: EquipoEntregado): void {

        const operation = dto.idEquipoEntregado === undefined ?
            this.crearEquipoEntregado(dto) :
            this.editarEquipoEntregado(dto);

    }

    public onEliminarEquipoEntregado(e: EquipoEntregado): void {
        const operation = this.eliminarEquipoEntregado(e);
    }

    public onCancelarEquipoEntregado(): void {
        this.dataItemEquipoEntregado = undefined;
    }

    public obtenerEquipoEntregado(): Observable<EquipoEntregado[]> {
        return this.fetchEquipoEntregado();
    }

    public editarEquipoEntregado(data: EquipoEntregado): Observable<EquipoEntregado[]> {
        return this.fetchEquipoEntregado("update", data);
    }

    public crearEquipoEntregado(data: EquipoEntregado): Observable<EquipoEntregado[]> {
        data.idEquipoEntregado = this.generarIdEquipoEntregadoTemporal();
        return this.fetchEquipoEntregado("create", data);

    }

    public eliminarEquipoEntregado(data: EquipoEntregado): Observable<EquipoEntregado[]> {
        return this.fetchEquipoEntregado("destroy", data);
    }

    private fetchEquipoEntregado(action: string = "", data?: EquipoEntregado): Observable<EquipoEntregado[]>  {

        if(action=="create"){
            var documento : EquipoEntregado = (JSON.parse(JSON.stringify(data)));
            this.viewEquipoEntregado.push(documento);
        }else if(action=="update"){
            var indice = this.viewEquipoEntregado.indexOf(data);
            if(indice>=0)
                this.viewEquipoEntregado[indice]  = (JSON.parse(JSON.stringify(data)));
        }else if(action=="destroy"){
            var indice = this.viewEquipoEntregado.indexOf(data);

            if(indice>=0)
                this.viewEquipoEntregado.splice(indice, 1);

        }

        return Observable.of(this.viewEquipoEntregado);
    }

    generarIdEquipoEntregadoTemporal():number {
        if (this.viewEquipoEntregado != null)
            return (this.viewEquipoEntregado.length + 2)* -1;
        else
            return-1;
    }



//empleado
    public state: any = {
        tabs: {
            tabEmpleado: 'tab-active-1',
        }

    };

    public codigoPais:string;

    //public documentoEmpleado : DocumentoEmpleadoDto = {idDocumentoEmpleado:1,nombre:'Archivo 1',archivo:'Archivo'};


    private pageSize: number = 10;
    private skip: number = 0;

    ngOnInit() {
    }


    private getTiposDocumento() {
        this.tiposDocumento = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Empleado.TipoDocumento' === grupo.grupo);
        this.empleado.tipoDocumento = 'DI';
    }
    /*cargarTipoDocumentoDefecto(documentos:TablaGeneralResult[]){
     this.tiposDocumento = documentos;
     this.empleado.tipoDocumento = 'DI';
     }*/

    private getEntidadFinanciera() {
        this.entidadesFinancieras = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Entidad Financiera' === grupo.grupo);
    }

    private getAFP() {
        this.afps = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'AFP' === grupo.grupo);
    }

    private getEPS() {
        this.eps = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'EPS' === grupo.grupo);
    }

    private getRelacionesContacto() {
        this.relacionesContacto = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Empleado.RelacionContacto' === grupo.grupo);
    }

    private getEstadosCivil() {
        this.estadosCivil = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Empleado.EstadoCivil' === grupo.grupo);
    }

    private getGruposSanguineo() {
        this.gruposSanguineo = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Empleado.GrupoSanguineo' === grupo.grupo);
    }

    private getGeneros() {
        this.generos = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Empleado.Generico' === grupo.grupo);
    }

    private getContratosTrabajo() {
        this.contratosTrabajo = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Empleado.ContratoTrabajo' === grupo.grupo);
    }

    private getTiposTrabajo() {
        this.tiposTrabajo = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Empleado.TipoTrabajo' === grupo.grupo);
    }

    private getRegimenesHorario() {
        this.regimenesHorario = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Empleado.RegimenHorario' === grupo.grupo);
    }

    private getRegimenesLaboral() {
        this.regimenesLaboral = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Empleado.RegimenLaboral' === grupo.grupo);
    }

    private getTiposDomicilio() {
        this.tiposDomicilio = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Empleado.TipoDomicilio' === grupo.grupo);
    }

    private obtenerPaises() {
        this.paisService.completarComboPais().subscribe(
            paisDto => this.cargarPaisNacimientoDefecto(paisDto),
            error =>  this.errorMessage = <any>error);
    }

    cargarPaisNacimientoDefecto(paises:PaisDto[]){
        this.paises = paises;
        this.empleado.paisNacimiento = 'PE';
        this.actualizarDpto(this.empleado.paisNacimiento);
    }

    private obtenerDepartamentos(codigoPais:string) {
        this.paisService.completarComboDepartamento(codigoPais).subscribe(
            departamentoDto => this.departamentos = departamentoDto,
            error =>  this.errorMessage = <any>error);
    }

    private obtenerProvincias(codigoDpto:string) {
        this.paisService.completarComboProvincia(codigoDpto).subscribe(
            provinciasDto => this.provincias = provinciasDto,
            error =>  this.errorMessage = <any>error);
    }

    private obtenerDistritos(codigoProvincia:string) {
        this.paisService.completarComboDistrito(codigoProvincia).subscribe(
            distritosDto => this.distritos = distritosDto,
            error =>  this.errorMessage = <any>error);
    }

    private obtenerCentrosCosto() {
        this.empleadoService.obtenerComboCentroCosto().subscribe(
            centroCostoDto => this.centrosCosto = centroCostoDto,
            error =>  this.errorMessage = <any>error);
    }


    actualizarDpto(value):void{
        this.isEnableDepartamento=false;

        let codigo:string = value;// (<HTMLSelectElement>event.srcElement).value;
        this.empleado.departamentoNacimiento = null;
        if(value == null) {
            this.departamentos = null;
        }else {
            this.obtenerDepartamentos(codigo);
        }

        this.empleado.provinciaNacimiento = null;
        this.empleado.distritoNacimiento = null;

        this.provincias = null;
        this.distritos = null;

        this.isEnableProvincia=true;
        this.isEnableDistrito=true;

    }

    actualizarProvincia(value):void{
        this.isEnableProvincia=false;

        let codigo:string = value;//(<HTMLSelectElement>event.srcElement).value;
        this.empleado.provinciaNacimiento = null;
        if(value == null) {
            this.provincias = null;
        }else {
            this.obtenerProvincias(codigo);
        }

        this.empleado.distritoNacimiento = null;
        this.distritos = null;
        this.isEnableDistrito=true;

    }

    actualizarDistrito(value):void{
        this.isEnableDistrito=false;

        let codigo:string = value;//(<HTMLSelectElement>event.srcElement).value;
        this.empleado.distritoNacimiento = null;
        if(value == null) {
            this.distritos = null;
        }else {
            this.obtenerDistritos(codigo);
        }

    }

    //domicilio

    private obtenerPaisesDomicilio() {

        this.paisService.completarComboPais().subscribe(
            paisDto => this.cargarPaisDomicilioDefecto(paisDto),
            error =>  this.errorMessage = <any>error);
    }

    cargarPaisDomicilioDefecto(paises:PaisDto[]){

        this.paisesDomicilio = paises;
        this.empleado.paisDomicilio = 'PE';
        this.actualizarDptoDomicilio(this.empleado.paisDomicilio);
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

    onChangeDate(value){

        if(value.type == 'change'){
            return;
        }

        $('#fechaNacimiento').parent().removeClass('state-error');

        this.empleado.fechaNacimiento = value;

        this.empleado.edad = this.calculateAge(this.empleado.fechaNacimiento);


    }

    onChangeDateIngreso(value){
        $('#fechaIngreso').parent().removeClass('state-error');
        this.empleado.fechaIngreso = value;

    }


    onChangeTieneEps(value){

        if(this.empleado.tieneEps){
            this.flagTieneEps=true;
        }else{
            this.flagTieneEps = false;
        }

        this.empleado.eps = null;
    }

    flagTieneEps:boolean=false;

    onRegresarBusquedaEmpleado(){

        let isNewEmpleado:boolean = this.empleadoService.retrieveSessionStorage('isNewEmpleado');

        if(isNewEmpleado) {
            this.empleadoService.storeSessionStorage('isNewEmpleado', true);
            this.empleadoService.storeSessionStorage('idEmpleado', undefined);
            this._router.navigate(['/personal/busquedaEmpleado']);
        }else {
            this._router.navigate(['/personal/verEmpleado']);
        }
    }

    ingresaNombre(){
        $('#nombre').parent().removeClass('state-error');
    }

    ingresaApellidoPaterno(){
        $('#apellidoPaterno').parent().removeClass('state-error');
    }

    ingresaApellidoMaterno(){
        $('#apellidoMaterno').parent().removeClass('state-error');
    }

    ingresaNumeroDocumento(){
        $('#numeroDocumento').parent().removeClass('state-error');
    }

    ingresaCodigo(){
        $('#codigo').parent().removeClass('state-error');
    }

    ingresaDireccion(){
        $('#direccion').parent().removeClass('state-error');
    }

    ingresaCelular(){
        $('#celular').parent().removeClass('state-error');
    }

    validarRequerido(){
        let validacion = false;

        if(this.empleado.nombre === undefined || this.empleado.nombre == null || this.empleado.nombre=='' ){
            $('#nombre').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }
        if(this.empleado.apellidoPaterno === undefined || this.empleado.apellidoPaterno == null || this.empleado.apellidoPaterno==''){
            $('#apellidoPaterno').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        if(this.empleado.apellidoMaterno === undefined || this.empleado.apellidoMaterno == null || this.empleado.apellidoMaterno==''){
            $('#apellidoMaterno').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        if(this.empleado.tipoDocumento === undefined || this.empleado.tipoDocumento == null || this.empleado.tipoDocumento==''){
            $('#tipoDocumento').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        if(this.empleado.numeroDocumento === undefined || this.empleado.numeroDocumento == null || this.empleado.numeroDocumento==''){
            $('#numeroDocumento').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        if(this.empleado.genero === undefined || this.empleado.genero == null || this.empleado.genero==''){
            $('#genero').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        if(this.empleado.estadoCivil === undefined || this.empleado.estadoCivil == null || this.empleado.estadoCivil==''){
            $('#estadoCivil').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        if(this.empleado.grupoSangre === undefined || this.empleado.grupoSangre == null || this.empleado.grupoSangre==''){
            $('#grupoSanguineo').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        if(this.empleado.genero === undefined || this.empleado.genero == null || this.empleado.genero==''){
            $('#genero').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        if(this.empleado.fechaNacimiento === undefined || this.empleado.fechaNacimiento == null || this.empleado.fechaNacimiento==''){
            $('#fechaNacimiento').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        if(this.empleado.fechaIngreso === undefined || this.empleado.fechaIngreso == null || this.empleado.fechaIngreso==''){
            $('#fechaIngreso').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        if(this.empleado.paisNacimiento === undefined || this.empleado.paisNacimiento == null || this.empleado.paisNacimiento==''){
            $('#paisNacimiento').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        if(this.empleado.codigo === undefined || this.empleado.codigo == null || this.empleado.codigo==''){
            $('#codigo').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        if(this.empleado.tipoTrabajador === undefined || this.empleado.tipoTrabajador == null || this.empleado.tipoTrabajador==''){
            $('#tipotrabajador').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        if(this.empleado.direccionDomicilio === undefined || this.empleado.direccionDomicilio == null || this.empleado.direccionDomicilio==''){
            $('#direccion').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        if(this.empleado.tipoDomicilio === undefined || this.empleado.tipoDomicilio == null || this.empleado.tipoDomicilio==''){
            $('#tipodomicilio').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        if(this.empleado.paisDomicilio === undefined || this.empleado.paisDomicilio == null || this.empleado.paisDomicilio==''){
            $('#paisDomicilio').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        if(this.empleado.telefonoCelular === undefined || this.empleado.telefonoCelular == null || this.empleado.telefonoCelular==''){
            $('#celular').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        return validacion;
    }

    onRegistrarEmpleado(){

        if(this.validarRequerido()){
            this.msgs.push({severity: 'error', summary: 'Runakuna Error', detail:'Ingrese los campos obligatorios.'});
            return;
        }

        this.empleado.documentos = this.view;
        this.empleado.educaciones = this.viewEducacion;
        this.empleado.experienciasLaborales = this.viewExperienciaLaboral;
        this.empleado.equiposEntregados = this.viewEquipoEntregado;
        this.empleado.dependientes = this.dependientes;

        this.empleado.fotoPerfil = this.fotoEmpleado;

        this.currentUser  = JSON.parse(sessionStorage.getItem("authenticatedUser"));
        this.empleado.idEmpresa=this.currentUser.idEmpresa;
        this.view=null;


        this.blockedUI = true;

        this.empleadoService.registrarEmpleado(this.empleado).subscribe(
            data => {
                this.blockedUI = false;
                this.backendService.notification(this.msgs, data);

                if (data.codigo == 1) {
                    this.navegarBusquedaEmpleado(data);
                }

            },
                error => {
                    this.blockedUI = false;
                    this.backendService.notification(this.msgs, error);
                }
        );


    }

    navegarBusquedaEmpleado(data:NotificacionResult){

        if(this.empleado.idEmpleado != undefined && this.empleado.idEmpleado != null){
            this.obtenerEmpleado(this.empleado.idEmpleado);
            this.verDocumentos(this.empleado.idEmpleado);
            this.verEducacion(this.empleado.idEmpleado);
            this.verExperienciaLaboral(this.empleado.idEmpleado);
            this.verEquipoEntregado(this.empleado.idEmpleado);

        }
    }

    stringToDate(dateCadena:string):Date{

        let fecha:string[] = dateCadena.split('/');

        let fechaFormat:Date= new Date( parseInt(fecha[2]),parseInt(fecha[1])-1,parseInt(fecha[0]));

        return fechaFormat;
    }

}
