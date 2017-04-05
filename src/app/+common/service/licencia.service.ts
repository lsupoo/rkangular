/**
 * Created by javier.cuicapuza on 1/10/2017.
 */
import {Injectable} from "@angular/core";
import {Http, Response, Jsonp} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {LicenciaFilter} from "../../+dto/licenciaFilter";
import {LicenciaResult} from "../../+dto/licenciaResult";
import {Licencia} from "../../+dto/maintenance/licencia";
import {LicenciaQuickFilter} from "../../+dto/licenciaQuickFilter";
import {IUrlOptions, RequestTypes} from "../../+rest/backend.model";
import {BackendService} from "../../+rest/backend.service";
import {PeriodoEmpleado} from "../../+dto/maintenance/periodoEmpleado";
import {NotificacionResult} from "../../+dto/notificacionResult";

@Injectable()
export class LicenciaService {



    constructor(private backendService: BackendService) {
    }

    private handleError(error: Response) {

        return Observable.throw(error.json().error || 'Server error');
    }

    obtenerLicenciaById(idLicencia: any) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/licenciaEmpleado/obtenerLicenciaDetalle';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idLicencia))
            .map(res => <Licencia> res)
            .catch(this.handleError);

    }
    buscarLicenciaEmpleado(busquedaLicencias: LicenciaFilter) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/licenciaEmpleado/obtenerLicencias';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaLicencias))
            .map(res => <LicenciaResult[]> res)
            .catch(this.handleError);

    }

    busquedaRapidaLicenciaEmpleado(quickFilter: LicenciaQuickFilter) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/licenciaEmpleado/busquedaRapidaLicencias';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(quickFilter))
            .map(res => <LicenciaResult[]> res)
            .catch(this.handleError);

    }

    verLicencias(periodoEmpleado: PeriodoEmpleado) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/licenciaEmpleado/verLicencias';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(periodoEmpleado))
            .map(res => <Licencia[]> res)
            .catch(this.handleError);

    }

    actualizarLicencia(licencia: Licencia) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/licenciaEmpleado/actualizarLicencia';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(licencia))
            .map(res => <NotificacionResult> res)
            .catch(this.handleError);
    }
}