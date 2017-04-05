/**
 * Created by javier.cuicapuza on 1/10/2017.
 */
import {Injectable} from "@angular/core";
import {Http, Response, Jsonp} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {CentroCosto} from "../../+dto/maintenance/centroCosto";
import {CentroCostoFilter} from "../../+dto/centroCostoFilter";
import {CentroCostoResult} from "../../+dto/centroCostoResult";
import {BackendService} from "../../+rest/backend.service";
import {IUrlOptions, RequestTypes} from "../../+rest/backend.model";

@Injectable()
export class CentroCostoService {


    private busquedaUrl = '/api/centroCosto/buscarCentrosCostos';
    private busquedaDetalleUrl = '/api/centroCosto/obtenerCentroCostoDetalle';
    private registrarUrl = '/api/centroCosto/registrarCentroCosto';
    private eliminarUrl = '/api/centroCosto/eliminarCentroCosto';


    constructor(private backendService: BackendService) {
    }

    private handleError(error: Response) {
        return Observable.throw(error.json().error || 'Server error');
    }

    obtenerCentroCostoDetalle(idCentroCosto: any) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.busquedaDetalleUrl;

        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idCentroCosto))
            .map(res => <CentroCosto> res)
            .catch(this.handleError);

    }

    registrarCentroCosto(centroCosto: CentroCosto) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.registrarUrl;
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(centroCosto))
            .map(res => <NotificacionResult> res)
            .catch(this.handleError);

    }

    buscarCentrosCostos(busquedaCentroCosto: CentroCostoFilter) {
        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.busquedaUrl;

        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaCentroCosto))
            .map(res => <CentroCostoResult[]> res)
            .catch(this.handleError);
    }

    eliminarCentroCosto(idCentroCosto: number) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.eliminarUrl;

        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idCentroCosto))
            .map(res => <NotificacionResult> res)
            .catch(this.handleError);
    }
}