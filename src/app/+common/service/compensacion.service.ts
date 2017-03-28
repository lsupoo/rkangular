import {Injectable} from "@angular/core";
import {Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import "rxjs/Rx";
import {CompensacionFilter} from "../../+dto/compensacionFilter";
import {CompensacionResult} from "../../+dto/compensacionResult";
import {Compensacion} from "../../+dto/maintenance/compensacion";
import {CompensacionQuickFilter} from "../../+dto/compensacionQuickFilter";
import {CompensacionDetalle} from "../../+dto/maintenance/compensacionDetalle";
import {BackendService} from "../../+rest/backend.service";
import {IUrlOptions, RequestTypes} from "../../+rest/backend.model";

@Injectable()
export class CompensacionService {


    private busquedaUrl = '/api/compensacion/obtenerCompensaciones';
    private busquedaRapidaUrl = '/api/compensacion/busquedaRapidaCompensaciones';
    private obtenerCompensacionUrl = '/api/compensacion/obtenerCompensacion';
    private obtenerCompensacionDetalleUrl = '/api/compensacion/obtenerCompensacionDetalle';

    constructor(private backendService: BackendService) {
    }


    buscarCompensaciones(compensacionFilter: CompensacionFilter) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.busquedaUrl;
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(compensacionFilter))
            .map(res => <CompensacionResult[]> res)
            .catch(this.handleError);
    }

    busquedaRapidaMarcaciones(quickFilter: CompensacionQuickFilter) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.busquedaRapidaUrl;
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(quickFilter))
            .map(res => <CompensacionResult[]> res)
            .catch(this.handleError);
    }

    obtenerCompensacion(idEmpleadoCompensacion: number) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.obtenerCompensacionUrl;
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idEmpleadoCompensacion))
            .map(res => <Compensacion> res)
            .catch(this.handleError);

    }

    obtenerCompensacionDetalle(idEmpleadoCompensacion: number) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.obtenerCompensacionDetalleUrl;
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idEmpleadoCompensacion))
            .map(res => <CompensacionDetalle> res)
            .catch(this.handleError);

    }

    private handleError(error: Response) {

        return Observable.throw(error.json().error || 'Server error');
    }
}