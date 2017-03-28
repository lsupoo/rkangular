import {Injectable} from "@angular/core";
import {Http, Response, Headers, Jsonp} from "@angular/http";
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {CentroCostoDto} from "../../+personal/+empleado/centroCostoDto";
import {Observable} from "rxjs/Observable";
import {Empleado} from "../../+dto/maintenance/empleado";
import {EmpleadoFilter} from "../../+dto/empleadoFilter";
import "rxjs/Rx";
import {PermisoFilter} from "../../+dto/permisoFilter";
import {Permiso} from "../../+dto/maintenance/permiso";
import {DocumentoEmpleado} from "../../+dto/maintenance/documentoEmpleado";
import {Educacion} from "../../+dto/maintenance/educacion";
import {ExperienciaLaboral} from "../../+dto/maintenance/experienciaLaboral";
import {EquipoEntregado} from "../../+dto/maintenance/equipoEntregado";
import {Dependiente} from "../../+dto/maintenance/dependiente";
import {Licencia} from "../../+dto/maintenance/licencia";
import {HorarioEmpleado} from "../../+dto/maintenance/horarioEmpleado";
import {HistorialLaboral} from "../../+dto/maintenance/historialLaboral";
import {PeriodoEmpleado} from "../../+dto/maintenance/periodoEmpleado";
import {PermisoEmpleado} from "../../+dto/maintenance/permisoEmpleado";

import {environment} from "../../../environments/environment";
import {NotificacionResult} from "../../+dto/NotificacionResult";
import {VacacionFilter} from "../../+dto/vacacionFilter";
import {HorasExtraFilter} from "../../+dto/horasExtraFilter";
import {HorasExtra} from "../../+dto/maintenance/horasExtra";
import 'rxjs/add/operator/toPromise';
import {Marcacion} from "../../+dto/maintenance/marcacion";
import {MarcacionFilter} from "../../+dto/marcacionFilter";
import {HorarioFilter} from "../../+dto/horarioFilter";
import {Horario} from "../../+dto/maintenance/horario";
import {HorarioDia} from "../../+dto/maintenance/horarioDia";
import {Vacacion} from "../../+dto/maintenance/vacacion";
import {HorarioEmpleadoDia} from "../../+dto/maintenance/horarioEmpleadoDia";
import {LocalStorageGlobal} from "../../+dto/localStorageDto";
import {SolicitudCambioMarcacion} from "../../+dto/maintenance/solicitudCambioMarcacion";
import {TipoLicencia} from "../../+dto/maintenance/tipoLicencia";
import {LicenciaFilter} from "../../+dto/licenciaFilter";
import {AlertaEmpleado} from "../../+dto/maintenance/alertaEmpleado";
import {Moneda} from "../../+dto/maintenance/moneda";
import {Contrato} from "../../+dto/maintenance/contrato";
import {ProyectoFilter} from "../../+dto/proyectoFilter";
import {Proyecto} from "../../+dto/maintenance/proyecto";
import {CargoFilter} from "../../+dto/cargoFilter";
import {Cargo} from "../../+dto/maintenance/cargo";
import {ReporteMarcacion} from "../../+dto/maintenance/reporteMarcacion";
import {AlertaFilter} from "../../+dto/alertaFilter";
import {Alerta} from "../../+dto/maintenance/alerta";
import {AlertaResult} from "../../+dto/alertaResult";
import {ReporteMarcacionFilter} from "../../+dto/reporteMarcacionFilter";
import {ReporteMarcacionResult} from "../../+dto/reporteMarcacionResult";
import {HorarioEmpleadoResult} from "../../+dto/horarioEmpleadoResult";
import {ProyectoResult} from "../../+dto/proyectoResult";
import {EmpleadoResult} from "../../+dto/empleadoResult";
import {EmpleadoQuickFilter} from "../../+dto/empleadoQuickFilter";
import {MarcacionQuickFilter} from "../../+dto/marcacionQuickFilter";
import {IUrlOptions, RequestTypes} from "../../+rest/backend.model";
import {BackendService} from "../../+rest/backend.service";
import {CurrentUser} from "../../+dto/currentUser";
import {MarcacionResult} from "../../+dto/marcacionResult";

@Injectable()
export class EmpleadoService {


    private tablaGeneralUrl: string = '/api/tablaGeneral/';
    private tipoLicenciaUrl = '/api/licenciaEmpleado/obtenerTipoLicencia';

    empleado: Empleado = new Empleado();
    permisos: Permiso = new Permiso();
    vacacion: Vacacion = new Vacacion();
    horasExtra: HorasExtra = new HorasExtra();
    //private rolNames: Array<RoleNameDto> = [];

    horario:Horario = new Horario();

    marcacion:Marcacion = new Marcacion();

    cargo:Cargo = new Cargo();

    horarioEmpleado:HorarioEmpleado = new HorarioEmpleado();
    contrato:Contrato = new Contrato();


    localStorageValue: LocalStorageGlobal = new LocalStorageGlobal();
    private registrarCargoUrl = '/api/cargo/registrarCargo';
    private eliminarCargoUrl = '/api/cargo/eliminarCargo';
    protected currentUser: CurrentUser;

    constructor(private backendService: BackendService) {
    }



    private handleError(error: Response) {
        return Observable.throw(error.json().error || 'Server error');
    }

    obtenerHorasSemanalesPendientes(idEmpleado: number) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/horasExtra/obtenerHorasSemanalesPendientes';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idEmpleado)).map(res => <HorasExtra> res)
            .catch(this.handleError);


    }

    obtenerComboCentroCosto() {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/centroCosto/obtenerCentrosCosto';
        return this.backendService.AuthRequest(RequestTypes.get, urlOptions).map(res => <CentroCostoDto[]> res)
            .catch(this.handleError);
    }

    buscarEmpleado(busquedaEmpleado: EmpleadoFilter) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/busquedaEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaEmpleado)).map(res => <EmpleadoResult[]> res)
            .catch(this.handleError);
    }

    busquedaRapidaEmpleado(quickFilter: EmpleadoQuickFilter) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/busquedaRapidaEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(quickFilter)).map(res => <NotificacionResult> res)
            .catch(this.handleError);
    }



    registrarEmpleado(empleado: Empleado) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/registrarEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(empleado)).map(res => <NotificacionResult> res)
            .catch(this.handleError);

    }

    registrarFotoEmpleado(empleado: Empleado) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/registrarFotoEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(empleado)).map(res => <NotificacionResult> res)
            .catch(this.handleError);

    }

    eliminarEmpleado(idEmpleado: number) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/eliminarEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idEmpleado)).map(res => <NotificacionResult> res)
            .catch(this.handleError);

    }

    registrarHorario(horario: Horario) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/horario/registrarHorario';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(horario)).map(res => <NotificacionResult> res)
            .catch(this.handleError);

    }

    registrarCargo(cargo: Cargo) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.registrarCargoUrl;
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(cargo)).map(res => <NotificacionResult> res)
            .catch(this.handleError);

    }

    eliminarHorario(horario: Horario) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/horario/eliminarHorario';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(horario)).map(res => <String> res)
            .catch(this.handleError);

    }

    eliminarCargo(idCargo: number) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.eliminarCargoUrl;
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idCargo)).map(res => <NotificacionResult> res)
            .catch(this.handleError);


    }

    registrarCorreccionMarcacion(solicitudCambioMarcacion: SolicitudCambioMarcacion) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/marcacion/registrarCorreccionMarcacion';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(solicitudCambioMarcacion))
            .map(res => <NotificacionResult> res)
            .catch(this.handleError);

    }

    aprobarCorreccionMarcacion(solicitudCambioMarcacion: SolicitudCambioMarcacion) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/marcacion/aprobarSolicitud';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(solicitudCambioMarcacion))
            .map(res => <NotificacionResult> res)
            .catch(this.handleError);

    }

    rechazarCorreccionMarcacion(solicitudCambioMarcacion: SolicitudCambioMarcacion) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/marcacion/rechazarSolicitud';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(solicitudCambioMarcacion))
            .map(res => <NotificacionResult> res)
            .catch(this.handleError);

    }

    obtenerHorario(horario: Horario) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/horario/obtenerHorario';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(horario)).map(res => <Horario> res)
            .catch(this.handleError);

    }

    obtenerContratoEmpleado(contrato: Contrato) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/contrato/obtenerContrato';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(contrato)).map(res => <NotificacionResult> res)
            .catch(this.handleError);

    }

    registrarHorarioEmpleado(horarioEmpleado: HorarioEmpleado) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/registrarHorarioEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(horarioEmpleado)).map(res => <NotificacionResult> res)
            .catch(this.handleError);

    }

    registrarContratoEmpleado(contrato: Contrato) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/contrato/registrarContrato';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(contrato)).map(res => <NotificacionResult> res)
            .catch(this.handleError);

    }

    aprobarContratoEmpleado(contrato: Contrato) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/contrato/aprobarContrato';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(contrato)).map(res => <NotificacionResult> res)
            .catch(this.handleError);

    }

    actualizarDatosPersonalesEmpleado(empleado: Empleado) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/actualizarDatosPersonales';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(empleado)).map(res => <NotificacionResult> res)
            .catch(this.handleError);

    }

    obtenerEmpleado(idEmpleado: number) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/obtenerEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idEmpleado)).map(res => <Empleado> res)
            .catch(this.handleError);

    }

    obtenerEmpleadoCabecera(idEmpleado: number) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/obtenerEmpleadoCabecera';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idEmpleado)).map(res => <Empleado> res)
            .catch(this.handleError);

    }

    verEmpleado(empleado: Empleado) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/verEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(empleado)).map(res => <Empleado> res)
            .catch(this.handleError);

    }

    verDocumentos(idEmpleado: number) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/verDocumentos';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idEmpleado)).map(res => <DocumentoEmpleado[]> res)
            .catch(this.handleError);

    }

    verDocumentosSF(idEmpleado: number) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/verDocumentosSF';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idEmpleado)).map(res => <DocumentoEmpleado[]> res)
            .catch(this.handleError);

    }

    verEducacion(idEmpleado: number) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/verEducacion';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idEmpleado)).map(res => <Educacion[]> res)
            .catch(this.handleError);

    }

    verExperienciaLaboral(idEmpleado: number) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/verExperienciaLaboral';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idEmpleado)).map(res => <ExperienciaLaboral[]> res)
            .catch(this.handleError);

    }

    verEquipoEntregado(idEmpleado: number) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/verEquipoEntregado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idEmpleado)).map(res => <EquipoEntregado[]> res)
            .catch(this.handleError);

    }

    verDependiente(idEmpleado: number) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/verDependiente';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idEmpleado)).map(res => <Dependiente[]> res)
            .catch(this.handleError);

    }

    verLicencia(periodoEmpleado: PeriodoEmpleado) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/verLicencia';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(periodoEmpleado)).map(res => <Licencia[]> res)
            .catch(this.handleError);

    }

    verMarcaciones(idEmpleado: number) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/verMarcaciones';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idEmpleado)).map(res => <Marcacion[]> res)
            .catch(this.handleError);


    }

    getMarcacionesByFiltro(filter: MarcacionFilter) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/marcacion/getMarcacionesByFiltro';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(filter)).map(res => <Marcacion[]> res)
            .catch(this.handleError);


    }

    verHorarioEmpleado(idEmpleado: number) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/verHorarioEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idEmpleado)).map(res => <HorarioEmpleado> res)
            .catch(this.handleError);

    }

    verHorariosEmpleado(idEmpleado: number) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/verHorariosEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idEmpleado)).map(res => <HorarioEmpleadoResult[]> res)
            .catch(this.handleError);

    }

    verContratosEmpleado(idEmpleado: number) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/contrato/obtenerContratosPorEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idEmpleado)).map(res => <Contrato[]> res)
            .catch(this.handleError);

    }

    verHistoriaLaboral(idEmpleado: number) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/verHistoriaLaboral';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idEmpleado)).map(res => <HistorialLaboral[]> res)
            .catch(this.handleError);

    }

    verPeriodoEmpleado(idEmpleado: number) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/verPeriodoEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idEmpleado)).map(res => <PeriodoEmpleado[]> res)
            .catch(this.handleError);

    }

    verPermisoEmpleado(periodoEmpleado: PeriodoEmpleado) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/verPermisoEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(periodoEmpleado)).map(res => <PermisoEmpleado[]> res)
            .catch(this.handleError);

    }

    verVacaciones(periodoEmpleado: PeriodoEmpleado) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/verVacaciones';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(periodoEmpleado)).map(res => <Vacacion[]> res)
            .catch(this.handleError);

    }

    verCargo(cargo: Cargo) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/cargo/obtenerCargoDetalle';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(cargo)).map(res => <Cargo> res)
            .catch(this.handleError);

    }

    obtenerHorariosPorTipoHorario(horario: Horario) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/horario/obtenerHorariosPorTipoHorario';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(horario)).map(res => <Horario[]> res)
            .catch(this.handleError);

    }

    obtenerHorarios() {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/horario/obtenerHorarios';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions).map(res => <Horario[]> res)
            .catch(this.handleError);

    }

    obtenerHorarioPorTipoHorarioPorDefecto(horario: Horario) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/horario/obtenerHorarioPorTipoHorarioPorDefecto';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(horario))
            .map(res => <Horario> res)
            .catch(this.handleError);


    }

    obtenerHorarioDiaPorHorario(horario: Horario) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/horario/obtenerHorarioDiaPorHorario';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(horario))
            .map(res => <HorarioDia[]> res)
            .catch(this.handleError);


    }

    obtenerHorarioEmpleadoDiaPorHorarioEmpleado(horarioEmpleado: HorarioEmpleado) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/obtenerHorarioEmpleadoDiasPorHorarioEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(horarioEmpleado))
            .map(res => <HorarioEmpleadoDia[]> res)
            .catch(this.handleError);

    }

    obtenerMoneda(){

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/obtenerHorarioEmpleadoDiasPorHorarioEmpleado';
        return this.backendService.AuthRequest(RequestTypes.get, urlOptions)
            .map(res => <Moneda[]> res)
            .catch(this.handleError);
    }

    storeData(empleado: Empleado){
        this.empleado = empleado;
    }
    storeDataPermiso(permisos: Permiso){
        this.permisos = permisos;
    }

    storeDataHorario(horario: Horario){
        this.horario = horario;
    }

    storeDataMarcacion(marcacion: Marcacion){
        this.marcacion = marcacion;
    }

    storeDataCargo(cargo: Cargo){
        this.cargo = cargo;
    }

    storeDataHorarioEmpleado(horarioEmpleado: HorarioEmpleado){
        this.horarioEmpleado = horarioEmpleado;
    }

    storeDataContratoEmpleado(contrato: Contrato){
        this.contrato = contrato;
    }

    storeDataVacaciones(vacacion: Vacacion){
        this.vacacion = vacacion;
    }
    storeDataHorasExtra(horasExtra: HorasExtra){
        this.horasExtra = horasExtra;
    }

    retrieveData(): Empleado{
        return this.empleado;
    }
    retrieveDataPermisos(): Permiso{
        return this.permisos;
    }

    retrieveDataHorario(): Horario{
        return this.horario;
    }

    retrieveDataMarcacion(): Marcacion{
        return this.marcacion;
    }

    retrieveDataCargo(): Cargo{
        return this.cargo;
    }

    retrieveDataHorarioEmpleado(): HorarioEmpleado{
        return this.horarioEmpleado;
    }

    retrieveDataContratoEmpleado(): Contrato{
        return this.contrato;
    }

    retrieveDataVacaciones(): Vacacion{
        return this.vacacion;
    }
    retrieveDataHorasExtra(): HorasExtra{
        return this.horasExtra;
    }

    buscarMarcacionesEmpleado(busquedaMarcacion: MarcacionFilter) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/busquedaMarcacionesEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaMarcacion))
            .map(res => <MarcacionResult[]> res)
            .catch(this.handleError);
    }

    busquedaRapidaMarcaciones(quickFilter: MarcacionQuickFilter) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/marcacion/busquedaRapidaMarcacionesEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(quickFilter))
            .map(res => <Marcacion[]> res)
            .catch(this.handleError);
    }

    buscarProyectos(busquedaProyectos: ProyectoFilter) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/proyecto/obtenerProyectos';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaProyectos))
            .map(res => <ProyectoResult[]> res)
            .catch(this.handleError);
    }

    buscarCargos(busquedaCargos: CargoFilter) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/cargo/obtenerCargos';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaCargos))
            .map(res => <Cargo[]> res)
            .catch(this.handleError);
    }

    buscarHorarios(busquedaHorario: HorarioFilter) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/horario/busquedaHorario';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaHorario))
            .map(res => <Horario[]> res)
            .catch(this.handleError);
    }

    obtenerMarcacionEmpleado(empleado: Empleado){

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/obtenerMarcacionEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(empleado))
            .map(res => <Marcacion> res)
            .catch(this.handleError);
    }

    obtenerSolicitudCambioMarcacion(idMarcacion: number){


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/marcacion/obtenerSolicitudCambio';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idMarcacion))
            .map(res => <SolicitudCambioMarcacion> res)
            .catch(this.handleError);
    }

    //Verificar
    eliminarPermisoEmpleado(permisos: PermisoEmpleado) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/eliminarPermisoEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(permisos))
            .map(res => <NotificacionResult> res)
            .catch(this.handleError);

    }

    aprobarPermisoEmpleado(permisos: PermisoEmpleado) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/permisoEmpleado/aprobarPermisoEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(permisos))
            .map(res => <String> res)
            .catch(this.handleError);

    }

    rechazarPermisoEmpleado(permisos: PermisoEmpleado) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/permisoEmpleado/rechazarPermisoEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(permisos))
            .map(res => <String> res)
            .catch(this.handleError);

    }
    /* ADMINISTRAR VACACIONES */
    registrarVacaciones(agendarVacacion: Vacacion) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/vacacionEmpleado/registrarVacaciones';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(agendarVacacion))
            .map(res => <NotificacionResult> res)
            .catch(this.handleError);


    }

    regularizarVacacion(agendarVacacion: Vacacion) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/vacacionEmpleado/regularizarVacacion';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(agendarVacacion))
            .map(res => <NotificacionResult> res)
            .catch(this.handleError);


    }

    actualizarVacacionEmpleado(adminVacacion: Vacacion) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/vacacionEmpleado/actualizarVacacionEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(adminVacacion))
            .map(res => <NotificacionResult> res)
            .catch(this.handleError);

    }
    enviarVacacionEmpleado(adminVacacion: Vacacion) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/vacacionEmpleado/enviarVacacionEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(adminVacacion))
            .map(res => <NotificacionResult> res)
            .catch(this.handleError);
    }
    eliminarVacacionEmpleado(adminVacacion: Vacacion) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/vacacionEmpleado/eliminarVacacionEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(adminVacacion))
            .map(res => <NotificacionResult> res)
            .catch(this.handleError);

    }
    devolverVacacionEmpleado(adminVacacion: Vacacion) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/vacacionEmpleado/devolverVacacionEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(adminVacacion))
            .map(res => <NotificacionResult> res)
            .catch(this.handleError);
    }
    aprobarVacacionEmpleado(adminVacacion: Vacacion) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/vacacionEmpleado/aprobarVacacionEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(adminVacacion))
            .map(res => <NotificacionResult> res)
            .catch(this.handleError);
    }
    rechazarVacacionEmpleado(adminVacacion: Vacacion) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/vacacionEmpleado/rechazarVacacionEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(adminVacacion))
            .map(res => <NotificacionResult> res)
            .catch(this.handleError);
    }

    actualizarDatosPersonalesVacaciones(vacacion: Vacacion) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/vacacionEmpleado/actualizarVacacionEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(vacacion))
            .map(res => <NotificacionResult> res)
            .catch(this.handleError);
    }



    enviarDatosPersonalesVacaciones(vacacion: Vacacion) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/vacacionEmpleado/enviarVacacionEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(vacacion))
            .map(res => <NotificacionResult> res)
            .catch(this.handleError);
    }

    /** ADMINISTRAR HORAS EXTRAS */

    actualizarDatosPersonalesHorasExtras(horaExtra: HorasExtra) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/horasExtra/actualizarHoraExtraEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(horaExtra))
            .map(res => <NotificacionResult> res)
            .catch(this.handleError);
    }


    registrarHorasExtra(horasExtra: HorasExtra){


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/horasExtra/registrarHorasExtra';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(horasExtra))
            .map(res => <NotificacionResult> res)
            //.map(res => <String> res)
            .catch(this.handleError);


    }

    eliminarHorasExtraEmpleado(idHorasExtra: number) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/eliminarHorasExtraEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idHorasExtra))
            .map(res => <NotificacionResult> res)
            .catch(this.handleError);

    }
    aprobarHorasExtraEmpleado(horasExtra: HorasExtra) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/aprobarHorasExtraEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(horasExtra))
            .map(res => <NotificacionResult> res)
            .catch(this.handleError);
    }
    rechazarHorasExtraEmpleado(horasExtra: HorasExtra) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/rechazarHorasExtraEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(horasExtra))
            .map(res => <NotificacionResult> res)
            .catch(this.handleError);
    }
    /**DAR DE BAJA */

    obtenerEquiposPendientesDevolucion(idEmpleado: number){

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/obtenerEquiposPendientesDevolucion?idEmpleado='+idEmpleado;
        return this.backendService.AuthRequest(RequestTypes.get, urlOptions)
            .map(res => <EquipoEntregado[]> res)
            .catch(this.handleError);
    }
    countEquiposPendientes(empleado: Empleado) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/countEquiposPendientesDevolucion';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(empleado))
            .map(res => <NotificacionResult> res)
            .catch(this.handleError);
    }
    registrarDarBajaEmpleado(empleado: Empleado) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/registrarDarBajaEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(empleado))
            .map(res => <NotificacionResult> res)
            .catch(this.handleError);
    }

    eliminarLicenciaEmpleado(licencia: any) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/licenciaEmpleado/eliminarLicencia';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(licencia))
            .map(res => <NotificacionResult> res)
            .catch(this.handleError);

    }
    guardarLicenciaEmpleado(licencia: Licencia) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/licenciaEmpleado/registrarLicencia';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(licencia))
            .map(res => <NotificacionResult> res)
            .catch(this.handleError);
    }

    aprobarLicenciaEmpleado(licencia: Licencia) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/licenciaEmpleado/aprobarLicencia';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(licencia))
            .map(res => <NotificacionResult> res)
            .catch(this.handleError);
    }

    validarLicenciaEmpleado(licencia: Licencia) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/licenciaEmpleado/validarLicencia';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(licencia))
            .map(res => <NotificacionResult> res)
            .catch(this.handleError);
    }

    /* ALERTAS*/
    obtenerMensajeAlertaEmpleado(empleadoDto: Empleado) {


        let url = '/api/alerta/obtenerMensajeAlerta';
        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = url;
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(empleadoDto))
            .map(res => <AlertaEmpleado[]> res)
            .catch(this.handleError);
    }


    obtenerAlertaById(idAlerta: any) {


        let url = '/api/alerta/obtenerAlertaDetalle';
        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = url;
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idAlerta))
            .map(res => <Alerta> res)
            .catch(this.handleError);

    }
    buscarAlertas(busquedaAlertas: AlertaFilter) {


        let url = '/api/alerta/obtenerAlertas';
        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = url;
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaAlertas))
            .map(res => <AlertaResult[]> res)
            .catch(this.handleError);
    }
    guardarAlerta(alerta: Alerta) {

        let url = '/api/alerta/registrarAlerta';
        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = url;
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(alerta))
            .map(res => <NotificacionResult> res)
            .catch(this.handleError);

    }

    /* REPORTE MARCACIONES */
    obtenerReporteMarcacionById(idReporteMarcacion: any) {
        let busquedaDetalleUrl = '/api/reporteMarcacion/obtenerReporteMarcacionDetalle';

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = busquedaDetalleUrl;
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idReporteMarcacion))
            .map(res => <ReporteMarcacion> res)
            .catch(this.handleError);
    }
    buscarReporteMarcaciones(busquedaMarcacion: ReporteMarcacionFilter) {

        let busquedaUrl = '/api/reporteMarcacion/obtenerReportesMarcacion';

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = busquedaUrl;
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,busquedaMarcacion)
            .map(res => <ReporteMarcacionResult[]> res)
            .catch(this.handleError);
    }
    buscarSubscriptores(reporteMarcacion: ReporteMarcacion) {

        let busquedaSubscriptoresUrl = '/api/reporteMarcacion/obtenerSubscriptoresReportesMarcacion';

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = busquedaSubscriptoresUrl;
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,reporteMarcacion)
            .map(res => <ReporteMarcacionResult[]> res)
            .catch(this.handleError);

    }
    guardarReporteMarcacion(reporteMarcacion: ReporteMarcacion) {

        let registrarUrl = '/api/reporteMarcacion/registrarReporteMarcacion';

        this.currentUser  = JSON.parse(sessionStorage.getItem("authenticatedUser"));
        reporteMarcacion.idEmpresa=this.currentUser.idEmpresa;

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = registrarUrl;
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(reporteMarcacion))
            .map(res => <NotificacionResult> res)
            .catch(this.handleError);
    }

    eliminarReporteMarcacion(reporteMarcacion: ReporteMarcacion) {
        let eliminarUrl = '/api/reporteMarcacion/eliminarReporteMarcacion';

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = eliminarUrl;
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(reporteMarcacion))
            .map(res => <NotificacionResult> res)
            .catch(this.handleError);
    }

    /**SESSION STORAGE*/
    storeSessionStorage(valueStore: string, dataVal: any){
        sessionStorage.setItem(valueStore,JSON.stringify(dataVal));
    }
    retrieveSessionStorage(valueRetrieve: string){
        return JSON.parse(sessionStorage.getItem(valueRetrieve) || '{}');
    }
    storeSessionStorageState(valueStore: string, dataVal: any){
        sessionStorage.setItem(valueStore,dataVal);
    }
    retrieveCommonValues(){

        let options = {
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
        return options;
    }

    obtenerEmpleadoEsPersonalConfianza(idEmpleado: number) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/obtenerEmpleadoEsPersonalConfianza';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idEmpleado)).map(res => <Empleado> res)
            .catch(this.handleError);

    }
}