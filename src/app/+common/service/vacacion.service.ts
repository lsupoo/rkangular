/**
 * Created by javier.cuicapuza on 1/10/2017.
 */
import {Injectable} from "@angular/core";
import {Http, Response, Jsonp} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {Vacacion} from "../../+dto/maintenance/vacacion";
import {VacacionFilter} from "../../+dto/vacacionFilter";
import {VacacionResult} from "../../+dto/vacacionResult";
import {PeriodoEmpleado} from "../../+dto/maintenance/periodoEmpleado";
import {VacacionQuickFilter} from "../../+dto/vacacionQuickFilter";
import {BackendService} from "../../+rest/backend.service";
import {IUrlOptions, RequestTypes} from "../../+rest/backend.model";

@Injectable()
export class VacacionService {



    constructor(private backendService: BackendService) {
    }

    private handleError(error: Response) {
        return Observable.throw(error.json().error || 'Server error');
    }

    obtenerVacacionById(idVacacion: any) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/vacacionEmpleado/obtenerVacacionesEmpleadoDetalle';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idVacacion))
            .map(res => <Vacacion> res)
            .catch(this.handleError);

    }
    buscarVacacionesEmpleado(busquedaVacaciones: VacacionFilter) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/vacacionEmpleado/busquedaVacacionesEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaVacaciones))
            .map(res => <VacacionResult[]> res)
            .catch(this.handleError);
    }

    busquedaRapidaVacaciones(quickFilter: VacacionQuickFilter) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/vacacionEmpleado/busquedaRapidaVacacionesEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(quickFilter))
            .map(res => <VacacionResult[]> res)
            .catch(this.handleError);
    }

    verVacaciones(periodoEmpleado: PeriodoEmpleado) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/verVacaciones';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(periodoEmpleado))
            .map(res => <Vacacion[]> res)
            .catch(this.handleError);

    }
}