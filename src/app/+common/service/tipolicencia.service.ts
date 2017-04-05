/**
 * Created by javier.cuicapuza on 1/10/2017.
 */
import {Injectable} from "@angular/core";
import {Http, Response, Headers, Jsonp} from "@angular/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs/Observable";
import {Vacacion} from "../../+dto/maintenance/vacacion";
import {VacacionFilter} from "../../+dto/vacacionFilter";
import {VacacionResult} from "../../+dto/vacacionResult";
import {LicenciaFilter} from "../../+dto/licenciaFilter";
import {LicenciaResult} from "../../+dto/licenciaResult";
import {Licencia} from "../../+dto/maintenance/licencia";
import {TipoLicenciaFilter} from "../../+dto/tipoLicenciaFilter";
import {TipoLicenciaResult} from "../../+dto/tipoLicenciaResult";
import {TipoLicencia} from "../../+dto/maintenance/tipoLicencia";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {BackendService} from "../../+rest/backend.service";
import {IUrlOptions, RequestTypes} from "../../+rest/backend.model";
import {ServiceBase} from "./serviceBase";

@Injectable()
export class TipoLicenciaService extends ServiceBase{

    private busquedaUrl = '/api/tipoLicencia/obtenerTiposLicencias';
    private busquedaDetalleUrl = '/api/tipoLicencia/obtenerTipoLicenciaDetalle';
    private registrarUrl = '/api/tipoLicencia/registrarTipoLicencia';
    private eliminarUrl = '/api/tipoLicencia/eliminarTipoLicencia';

    constructor(private backendService: BackendService,private http: Http, private jsonp: Jsonp) {
        super();
    }


    obtenerTipoLicenciaDetalle(idTipoLicencia: any) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.busquedaDetalleUrl;

        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idTipoLicencia))
            .map(res => <Licencia> res)
            .catch(this.handleError);

    }

    registrarTipoLicencia(tipoLicencia: TipoLicencia) {
        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.registrarUrl;

        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(tipoLicencia))
            .map(res => <NotificacionResult> res)
            .catch(this.handleError);

    }

    obtenerTiposLicencias(busquedaTiposLicencias: TipoLicenciaFilter) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.busquedaUrl;

        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaTiposLicencias))
            .map(res => <TipoLicenciaResult[]> res)
            .catch(this.handleError);
    }

    eliminarTipoLicencia(tipoLicencia: TipoLicencia) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.eliminarUrl;

        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(tipoLicencia.idTipoLicencia))
            .map(res => <NotificacionResult> res)
            .catch(this.handleError);
    }
}