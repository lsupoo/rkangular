/**
 * Created by javier.cuicapuza on 1/11/2017.
 */
import {Injectable} from "@angular/core";
import {Http, Response, Headers, Jsonp} from "@angular/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs/Observable";
import {MarcacionDashboardFilter} from "../../+dto/marcacionDashboardFilter";
import {MarcacionDashboardResult} from "../../+dto/marcacionDashboardResult";
import {PieChartDataResult} from "../../+dto/pieChartDataResult";
import {PermisoEmpleadoResult} from "../../+dto/permisoEmpleadoResult";
import {VacacionResult} from "../../+dto/vacacionResult";
import {HorasExtraResult} from "../../+dto/horasExtraResult";
import {HorasExtra} from "../../+dto/maintenance/horasExtra";
import {MarcacionDashboardEmpleadoFilter} from "../../+dto/marcacionDashboardEmpleadoFilter";
import {IndicadorRRHHResultViewModel} from "../../+dto/indicadorRRHHResultViewModel";
import {BackendService} from "../../+rest/backend.service";
import {IUrlOptions, RequestTypes} from "../../+rest/backend.model";

@Injectable()
export class DashBoardService {

    // localhost:  String = environment.backend;
    // port: String = environment.port;
    private buscarMarcacionesDashboardUrl = '/api/dashboard/busquedaMarcacionesDashboardRRHH';
    private buscarMarcacionesDashboardJefeUrl = '/api/dashboard/busquedaMarcacionesDashboardJefe';
    private buscarMarcacionesDashboardEmpleadoUrl = '/api/dashboard/buscarMarcacionesDashboardEmpleado';
    constructor(private backendService: BackendService) {
    }

    private handleError(error: Response) {
        return Observable.throw(error.json().error || 'Server error');
    }

    /* Dashboard */
    buscarMarcacionesDashboard(busquedaMarcacion: MarcacionDashboardFilter) {
        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.buscarMarcacionesDashboardUrl;
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaMarcacion)).map(res => <MarcacionDashboardResult[]> res)
            .catch(this.handleError);
    }

    buscarMarcacionesDashboardJefe(busquedaMarcacion: MarcacionDashboardFilter) {
        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.buscarMarcacionesDashboardJefeUrl;
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaMarcacion)).map(res => <MarcacionDashboardResult[]> res)
            .catch(this.handleError);
    }

    buscarMarcacionesDashboardEmpleado(busquedaMarcacion: MarcacionDashboardEmpleadoFilter) {
        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.buscarMarcacionesDashboardEmpleadoUrl;
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaMarcacion)).map(res => <MarcacionDashboardResult[]> res)
            .catch(this.handleError);
    }

    buscarMarcacionEmpleadoPieChart(busquedaMarcacion: MarcacionDashboardFilter) {
        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/dashboard/buscarMarcacionEmpleadoPieChart';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaMarcacion)).map(res => <PieChartDataResult[]> res)
            .catch(this.handleError);
    }

    buscarMarcacionPieChartJefe(busquedaMarcacion: MarcacionDashboardFilter) {
        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/dashboard/buscarMarcacionPieChartJefe';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaMarcacion)).map(res => <PieChartDataResult[]> res)
            .catch(this.handleError);
    }

    buscarEmpleadoIndicadorDashBoardEmpleado(busquedaMarcacion: MarcacionDashboardEmpleadoFilter) {
        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/dashboard/buscarEmpleadoIndicadorDashBoardXmes';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaMarcacion)).map(res => <PieChartDataResult[]> res)
            .catch(this.handleError);
    }

    buscarEmpleadoIndicadorDashBoardRRHH(busquedaMarcacion: MarcacionDashboardFilter) {
        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/dashboard/buscarIndicadorRRHHDashBoard';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaMarcacion)).map(res => <IndicadorRRHHResultViewModel[]> res)
            .catch(this.handleError);
    }

    buscarMarcacionEmpleadoPieChartEmpleado(busquedaMarcacion: MarcacionDashboardEmpleadoFilter) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/dashboard/buscarMarcacionEmpleadoPieChartEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaMarcacion)).map(res => <PieChartDataResult[]> res)
            .catch(this.handleError);
    }

    buscarPermisoDashboardRRHH(busquedaMarcacion: MarcacionDashboardFilter){
        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/dashboard/busquedaPermisoDashboardRRHH';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaMarcacion)).map(res => <PermisoEmpleadoResult[]> res)
            .catch(this.handleError);
    }
    buscarPermisoDashboardJefe(busquedaMarcacion: MarcacionDashboardFilter){
        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/dashboard/busquedaPermisoDashboardJefe';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaMarcacion)).map(res => <PermisoEmpleadoResult[]> res)
            .catch(this.handleError);
    }
    buscarPermisoDashboardEmpleado(busquedaMarcacion: MarcacionDashboardEmpleadoFilter){
        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/dashboard/busquedaPermisoDashboardEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaMarcacion)).map(res => <PermisoEmpleadoResult[]> res)
            .catch(this.handleError);
    }
    eliminarPermisoEmpleado(permisos: PermisoEmpleadoResult) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/eliminarPermisoEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(permisos)).map(res => <String> res)
            .catch(this.handleError);

    }

    eliminarVacacion(vacacion: VacacionResult) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/vacacionEmpleado/eliminarVacacionEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(vacacion)).map(res => <String> res)
            .catch(this.handleError);

    }

    eliminarHorasExtraEmpleado(horasExtra: HorasExtraResult) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/eliminarHorasExtraEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(horasExtra)).map(res => <String> res)
            .catch(this.handleError);

    }

    buscarVacacionesDashboardJefe(busquedaMarcacion: MarcacionDashboardFilter) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/dashboard/busquedaVacacionesDashboardJefe';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaMarcacion)).map(res => <VacacionResult[]> res)
            .catch(this.handleError);
    }

    buscarVacacionesDashboardRRHH(busquedaMarcacion: MarcacionDashboardFilter) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/dashboard/busquedaVacacionesDashboardRRHH';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaMarcacion)).map(res => <VacacionResult[]> res)
            .catch(this.handleError);
    }

    buscarVacacionesDashboardEmpleado(busquedaMarcacion: MarcacionDashboardEmpleadoFilter) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/dashboard/busquedaVacacioneDashboardEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaMarcacion)).map(res => <VacacionResult[]> res)
            .catch(this.handleError);
    }

    buscarHorasExtrasDashboardJefe(busquedaMarcacion: MarcacionDashboardFilter) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/dashboard/buscarHorasExtrasDashboardJefe';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaMarcacion)).map(res => <HorasExtraResult[]> res)
            .catch(this.handleError);
    }

    buscarHorasExtrasDashboardRRHH(busquedaMarcacion: MarcacionDashboardFilter) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/dashboard/busquedaHorasExtrasDashboardRRHH';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaMarcacion)).map(res => <HorasExtraResult[]> res)
            .catch(this.handleError);
    }

    buscarHorasExtrasDashboardEmpleado(busquedaMarcacion: MarcacionDashboardEmpleadoFilter) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/dashboard/busquedaHorasExtrasDashboardEmpledo';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaMarcacion)).map(res => <HorasExtraResult[]> res)
            .catch(this.handleError);
    }
}
