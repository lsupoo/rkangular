import {Component, OnInit} from "@angular/core";
import {PageChangeEvent} from "@progress/kendo-angular-grid";
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {CentroCostoDto} from "../+empleado/centroCostoDto";
import {PaisDto} from "../+empleado/paisDto";
import {DepartamentoDto} from "../+empleado/departamentoDto";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {PaisService} from "../../+common/service/pais.service";
import {Empleado} from "../../+dto/maintenance/empleado";
import {DocumentoEmpleado} from "../../+dto/maintenance/documentoEmpleado";
import {ActivatedRoute, Router} from "@angular/router";
import {Educacion} from "../../+dto/maintenance/educacion";
import {ExperienciaLaboral} from "../../+dto/maintenance/experienciaLaboral";
import {EquipoEntregado} from "../../+dto/maintenance/equipoEntregado";
import {Dependiente} from "../../+dto/maintenance/dependiente";
import {Licencia} from "../../+dto/maintenance/licencia";
import {HorarioEmpleado} from "../../+dto/maintenance/horarioEmpleado";
import {HistorialLaboral} from "../../+dto/maintenance/historialLaboral";
import {PeriodoEmpleado} from "../../+dto/maintenance/periodoEmpleado";
import {PermisoEmpleado} from "../../+dto/maintenance/permisoEmpleado";
import {Contrato} from "../../+dto/maintenance/contrato";
import {Vacacion} from "../../+dto/maintenance/vacacion";
import {ComponentBase} from "../../+common/service/componentBase";
import {Http} from "@angular/http";
import {BackendService} from "../../+rest/backend.service";

declare var $: any;

@Component({
  selector: 'sa-ver-empleado',
  templateUrl: 'ver.empleado.component.html',
  providers: [PaisService]
})
export class VerEmpleadoComponent extends ComponentBase implements OnInit {

    public empleado:Empleado= new Empleado();

    public defaultItem={idPeriodoEmpleado:null,periodo:'Todos'};

    public departamentos:DepartamentoDto[];

    errorMessage: string;

    private documentos: DocumentoEmpleado[]=[];

    private educaciones: Educacion[]=[];

    private experienciasLaborales: ExperienciaLaboral[]=[];

    private equiposEntregados: EquipoEntregado[]=[];

    private dependientes: Dependiente[]=[];

    private licencias: Licencia[]=[];

    private horariosEmpleado:HorarioEmpleado=new HorarioEmpleado();

    private historiasLaborales:HistorialLaboral[]=[];

    private periodosEmpleados:PeriodoEmpleado[]=[];

    private permisosEmpleados:PermisoEmpleado[]=[];

    private vacaciones:Vacacion[]=[];

    private contratos:Contrato[]=[];

    private periodoEmpleado:PeriodoEmpleado = new PeriodoEmpleado();

    private periodoEmpleadoPermiso:PeriodoEmpleado = new PeriodoEmpleado();
    private periodoEmpleadoVacaciones:PeriodoEmpleado = new PeriodoEmpleado();

    private pageSize: number = 10;
    private skip: number = 0;

    private tiempoTrabajado:string;

    private idPeriodoEmpleadoPermiso:number;
    private idPeriodoEmpleadoVacaciones:number;
    private diasDisponibles:number;
    private permisosDisponibles:number;

    protected pageChange(event: PageChangeEvent): void {
        this.skip = event.skip;
    }


    fotoEmpleado: string = "";

    public dataItem: DocumentoEmpleado;

    constructor(private route:ActivatedRoute,private empleadoService:EmpleadoService,
                public backendService: BackendService,
                private paisService:PaisService,private _router: Router) {

        super(backendService,'EM001');
        this.storeAuthorizationByModuleCode('GT003');
        this.storeAuthorizationByModuleCode('GT002');
        this.storeAuthorizationByModuleCode('GT001');

        let idEmpleado:number = this.empleadoService.retrieveSessionStorage('idEmpleado');


        this.obtenerEmpleado(idEmpleado);

        this.verDocumentos(idEmpleado);
        this.verEducacion(idEmpleado);
        this.verExperienciaLaboral(idEmpleado);
        this.verEquipoEntregado(idEmpleado);


        this.verDependiente(idEmpleado);
        //this.verLicencia(idEmpleado);
        //this.verHorarioEmpleado(idEmpleado);
        //this.verHistoriaLaboral(idEmpleado);
        //this.verPeriodoEmpleado(idEmpleado);


        //this.verContratos(idEmpleado);

    }

    onRegresarBusquedaEmpleado(){
        this._router.navigate(['/personal/busquedaEmpleado']);
    }

    obtenerEmpleado(idEmpleado: number){
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
            data => this.educaciones = data,
            error => this.errorMessage = <any>error
        );
    }

    verExperienciaLaboral(idEmpleado: number){
        this.empleadoService.verExperienciaLaboral(idEmpleado).subscribe(
            data => this.experienciasLaborales = data,
            error => this.errorMessage = <any>error
        );
    }

    verEquipoEntregado(idEmpleado: number){
        this.empleadoService.verEquipoEntregado(idEmpleado).subscribe(
            data => this.equiposEntregados = data,
            error => this.errorMessage = <any>error
        );
    }

    verDependiente(idEmpleado: number){
        this.empleadoService.verDependiente(idEmpleado).subscribe(
            data => this.dependientes = data,
            error => this.errorMessage = <any>error
        );
    }

    verLicencia(idEmpleado: number){
        this.periodoEmpleado.idEmpleado = idEmpleado;
        this.periodoEmpleado.idPeriodoEmpleado = null;
        this.cargarLicencia(this.periodoEmpleado);
    }

    verHorarioEmpleado(idEmpleado: number){
        this.empleadoService.verHorarioEmpleado(idEmpleado).subscribe(
            data => this.horariosEmpleado = data,
            error => this.errorMessage = <any>error
        );
    }

    verHistoriaLaboral(idEmpleado: number){
        this.empleadoService.verHistoriaLaboral(idEmpleado).subscribe(
            data => this.historiasLaborales = data,
            error => this.errorMessage = <any>error
        );
    }

    /*verPeriodoEmpleado(idEmpleado: number){
        this.empleadoService.verPeriodoEmpleado(idEmpleado).subscribe(
            data => this.periodosEmpleados = data,
            error => this.errorMessage = <any>error
        );
    }*/

    verPeriodoEmpleado(idEmpleado: number){
        this.empleadoService.verPeriodoEmpleado(idEmpleado).subscribe(
            data => {
                this.periodosEmpleados = data;

                if(this.periodosEmpleados != null && this.periodosEmpleados.length>0){
                    let periodoEmpleado: PeriodoEmpleado = new PeriodoEmpleado();
                    periodoEmpleado.idEmpleado = idEmpleado;
                    periodoEmpleado.idPeriodoEmpleado = this.periodosEmpleados[0].idPeriodoEmpleado;
                    periodoEmpleado.diasVacacionesDisponibles = this.periodosEmpleados[0].diasVacacionesDisponibles;
                    periodoEmpleado.permisosDisponibles = this.periodosEmpleados[0].permisosDisponibles;
                    this.cargarPermisoEmpleado(periodoEmpleado);
                    this.cargarVacaciones(periodoEmpleado);
                }

            },
            error => this.errorMessage = <any>error
        );
    }

    verPermisoEmpleado(idEmpleado: number){
        this.periodoEmpleado.idEmpleado = idEmpleado;
        this.periodoEmpleado.idPeriodoEmpleado = null;
        this.cargarPermisoEmpleado(this.periodoEmpleado);
    }

    verVacaciones(idEmpleado: number){
        this.periodoEmpleado.idEmpleado = idEmpleado;
        this.periodoEmpleado.idPeriodoEmpleado = null;
        this.cargarVacaciones(this.periodoEmpleado);
    }

    verContratos(idEmpleado: number){
        this.empleadoService.verContratosEmpleado(idEmpleado).subscribe(
            data => this.contratos = data,
            error => this.errorMessage = <any>error
        );
    }

    onChangeLicenciaPorPeriodo(value){
        this.periodoEmpleado.idEmpleado = this.empleado.idEmpleado;
        this.periodoEmpleado.idPeriodoEmpleado = value;
        this.cargarLicencia(this.periodoEmpleado);

    }

    onChangePermisoEmpleadoPorPeriodo(value){
        this.periodoEmpleadoPermiso.idEmpleado = this.empleado.idEmpleado;
        this.periodoEmpleadoPermiso.idPeriodoEmpleado = value;

        for(var item in this.periodosEmpleados){
            var data = this.periodosEmpleados[item];
            if(data.idPeriodoEmpleado == value){
                this.periodoEmpleadoPermiso.permisosDisponibles = data.permisosDisponibles;
                break;
            }
        }

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

    cargarLicencia(periodoEmpleado: PeriodoEmpleado){
        this.empleadoService.verLicencia(periodoEmpleado).subscribe(
            data => this.licencias = data,
            error => this.errorMessage = <any>error
        );
    }

    cargarPermisoEmpleado(periodoEmpleado: PeriodoEmpleado){

        this.idPeriodoEmpleadoPermiso = periodoEmpleado.idPeriodoEmpleado;
        this.permisosDisponibles = periodoEmpleado.permisosDisponibles;

        this.empleadoService.verPermisoEmpleado(periodoEmpleado).subscribe(
            data => this.permisosEmpleados = data,
            error => this.errorMessage = <any>error
        );
    }

    cargarVacaciones(periodoEmpleado: PeriodoEmpleado){
        this.idPeriodoEmpleadoVacaciones = periodoEmpleado.idPeriodoEmpleado;
        this.diasDisponibles = periodoEmpleado.diasVacacionesDisponibles;

        this.empleadoService.verVacaciones(periodoEmpleado).subscribe(
            data => this.vacaciones = data,
            error => this.errorMessage = <any>error
        );
    }



    cargarEmpleado(data:Empleado){

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

    onIrHistorialTrabajo(){
        let empleadoContrato:Empleado = new Empleado();

        empleadoContrato.idEmpleado = this.empleado.idEmpleado;
        empleadoContrato.codigo = this.empleado.codigo;
        empleadoContrato.nombre = this.empleado.nombre;
        empleadoContrato.apellidoPaterno = this.empleado.apellidoPaterno;
        empleadoContrato.apellidoMaterno = this.empleado.apellidoMaterno;

        this.empleadoService.storeSessionStorage('entityHistorialTrabajo',empleadoContrato);
        this._router.navigate(['/personal/historiaLaboral']);
    }
    onIrDarBajaEmpleado(){
        sessionStorage.setItem('darBajaEmpleadoSessionData',JSON.stringify(this.empleado));
        this._router.navigate(['/personal/darDeBaja']);
    }

    public onViewDocument(dto: DocumentoEmpleado): void {

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

    ngOnInit() {
    }

    public onEdit(): void {
        this.empleadoService.storeSessionStorage('isNewEmpleado',false);
        this._router.navigate(['/personal/empleado']);
    }

    public onGestionarIrLicencia(){
        this.empleadoService.storeSessionStorage('entityGestionarLicencia',this.empleado);
        this._router.navigate(['/gestionTiempo/busquedaLicencias']);
    }

    public onIrGestionarVacacion(){
        this.empleadoService.storeSessionStorage('entityGestionarVacacion',this.empleado);
        this._router.navigate(['/gestionTiempo/busquedaVacaciones']);
    }
    public onIrGestionarPermiso(){
        this.empleadoService.storeSessionStorage('entityGestionarPermiso',this.empleado);
        this._router.navigate(['/gestionTiempo/busquedaPermisos']);
    }

    public onIrHorarioEmpleado(){
        let empleadoHorario:Empleado = new Empleado();

        this._router.navigate(['/personal/horarioEmpleado']);
    }

    public onIrContratoEmpleado(){

        let empleadoContrato:Empleado = new Empleado();

        empleadoContrato.idEmpleado = this.empleado.idEmpleado;
        empleadoContrato.codigo = this.empleado.codigo;
        empleadoContrato.nombre = this.empleado.nombre;
        empleadoContrato.apellidoPaterno = this.empleado.apellidoPaterno;
        empleadoContrato.apellidoMaterno = this.empleado.apellidoMaterno;

        this.empleadoService.storeSessionStorage('entityEmpleadoContrato',empleadoContrato);
        this._router.navigate(['/personal/contratoEmpleado']);
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
