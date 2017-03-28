import {Injectable} from "@angular/core";
import {Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import "rxjs/Rx";
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {HistorialLaboral} from "../../+dto/maintenance/historialLaboral";
import {Empleado} from "../../+dto/maintenance/empleado";
import {PeriodoEmpleado} from "../../+dto/maintenance/periodoEmpleado";
import {PermisoEmpleado} from "../../+dto/maintenance/permisoEmpleado";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {Vacacion} from "../../+dto/maintenance/vacacion";
import {HorasExtra} from "../../+dto/maintenance/horasExtra";
import {environment} from "../../../environments/environment";
import {LicenciaFilter} from "../../+dto/licenciaFilter";
import {PermisoFilter} from "../../+dto/permisoFilter";
import {PermisoEmpleadoResult} from "../../+dto/permisoEmpleadoResult";
import {PermisoEmpleadoQuickFilter} from "../../+dto/permisoEmpleadoQuickFilter";
import {IUrlOptions, RequestTypes} from "../../+rest/backend.model";
import {BackendService} from "../../+rest/backend.service";
import {ServiceBase} from "./serviceBase";

@Injectable()
export class PermisoService extends ServiceBase{

    localhost:  String = environment.backend;
    port: String = environment.port;

    private tablaGeneralUrl: string = 'http://'+this.localhost+':'+ this.port +'/api/tablaGeneral/';

    //empleado: Empleado = new Empleado();

    constructor(private backendService: BackendService) {
        super();

    }

    completarComboBox(metodo: string) {



        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/tablaGeneral/'+ metodo;
        return this.backendService.AuthRequest(RequestTypes.get, urlOptions)
            .map(res => <TablaGeneralResult[]> res)
            .catch(this.handleError);
    }

    obtenerHistoriaLaboralActual(empleado: Empleado) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/permisoEmpleado/obtenerHistoriaLaboralActual';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(empleado))
            .map(res => <HistorialLaboral> res)
            .catch(this.handleError);

    }

    obtenerHistoriasLaboralesActualPorEmpleado(empleado: Empleado) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/permisoEmpleado/obtenerHistoriasLaboralesActualPorEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(empleado))
            .map(res => <HistorialLaboral[]> res)
            .catch(this.handleError);

    }

    obtenerHistoriasLaboralesPorEmpleado(idEmpleado: number) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/permisoEmpleado/obtenerHistoriasLaboralesPorEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idEmpleado))
            .map(res => <HistorialLaboral[]> res)
            .catch(this.handleError);

    }

    obtenerHistoriaLaboralLicencia(busquedaLicencia: LicenciaFilter) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/permisoEmpleado/obtenerHistoriaLaboralLicencia';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaLicencia))
            .map(res => <HistorialLaboral> res)
            .catch(this.handleError);

    }

    obtenerInformacionAdicional(empleado: Empleado) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/informacionAdicionalHorasExtras';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(empleado))
            .map(res => <HorasExtra> res)
            .catch(this.handleError);

    }

    obtenerPeriodoEmpleadoActual(empleado: Empleado) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/permisoEmpleado/obtenerPeriodoEmpleadoActual';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(empleado))
            .map(res => <PeriodoEmpleado> res)
            .catch(this.handleError);

    }
    obtenerDiasDisponiblesDeVacacion(empleado: Empleado) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/vacacionEmpleado/obtenerDiasDisponibles';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(empleado))
            .map(res => <Vacacion> res)
            .catch(this.handleError);

    }
    obtenerPeriodoActual(empleado: Empleado) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/vacacionEmpleado/obtenerPeriodo';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(empleado))
            .map(res => <Vacacion> res)
            .catch(this.handleError);

    }

    /* ADMINISTRAR PERMISO */
    buscarPermisoEmpleado(busquedaPermisos: PermisoFilter) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/permisoEmpleado/busquedaPermisoEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaPermisos))
            .map(res => <PermisoEmpleadoResult[]> res)
            .catch(this.handleError);
    }

    busquedaRapidaPermisoEmpleado(quickFilter: PermisoEmpleadoQuickFilter) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/permisoEmpleado/busquedaRapidaPermisoEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(quickFilter))
            .map(res => <PermisoEmpleadoResult[]> res)
            .catch(this.handleError);
    }

    obtenerPermisoEmpleadoById(idPermisoEmpleado: any) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/permisoEmpleado/obtenerPermisoEmpleadoDetalle';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idPermisoEmpleado))
            .map(res => <PermisoEmpleado> res)
            .catch(this.handleError);

    }
    registrarPermisoEmpleado(permisoEmpleado: PermisoEmpleado) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/permisoEmpleado/registrarPermisoEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(permisoEmpleado))
            .map(res => <NotificacionResult> res)
            .catch(this.handleError);
    }

    actualizarPermisoEmpleado(permisoEmpleado: PermisoEmpleado) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/permisoEmpleado/actualizarPermisoEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(permisoEmpleado))
            .map(res => <NotificacionResult> res)
            .catch(this.handleError);
    }

    enviarPermisoEmpleado(permisoEmpleado: PermisoEmpleado) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/permisoEmpleado/enviarPermisoEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(permisoEmpleado))
            .map(res => <NotificacionResult> res)
            .catch(this.handleError);
    }

    aprobarPermisoEmpleado(permisoEmpleado: PermisoEmpleado) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/permisoEmpleado/aprobarPermisoEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(permisoEmpleado))
            .map(res => <NotificacionResult> res)
            .catch(this.handleError);
    }


    rechazarPermisoEmpleado(permisoEmpleado: PermisoEmpleado) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/permisoEmpleado/rechazarPermisoEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(permisoEmpleado))
            .map(res => <NotificacionResult> res)
            .catch(this.handleError);
    }

    devolverPermisoEmpleado(permisoEmpleado: PermisoEmpleado) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/permisoEmpleado/devolverPermisoEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(permisoEmpleado))
            .map(res => <NotificacionResult> res)
            .catch(this.handleError);
    }

    actualizarPermisoEmpleadoDatosPersonales(permisoEmpleado: PermisoEmpleado) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/permisoEmpleado/actualizarPermisoEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(permisoEmpleado))
            .map(res => <NotificacionResult> res)
            .catch(this.handleError);
    }

    enviarPermisoEmpleadoDatosPersonales(permisoEmpleado: PermisoEmpleado) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/permisoEmpleado/actualizarPermisoEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(permisoEmpleado))
            .map(res => <NotificacionResult> res)
            .catch(this.handleError);
    }

}
