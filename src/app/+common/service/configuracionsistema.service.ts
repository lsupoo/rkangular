/**
 * Created by javier.cuicapuza on 1/10/2017.
 */
import {Injectable} from "@angular/core";
import {Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {ConfiguracionSistema} from "../../+dto/maintenance/configuracionSistema";
import {ConfiguracionSistemaFilter} from "../../+dto/configuracionSistemaFilter";
import {ConfiguracionSistemaResult} from "../../+dto/configuracionSistemaResult";
import {BackendService} from "../../+rest/backend.service";
import {IUrlOptions, RequestTypes} from "../../+rest/backend.model";

@Injectable()
export class ConfiguracionSistemaService {

    private busquedaUrl = '/api/configuracionSistema/obtenerConfiguracionesSistema';
    private busquedaDetalleUrl = '/api/configuracionSistema/obtenerConfiguracionSistemaDetalle';
    private registrarUrl = '/api/configuracionSistema/registrarConfiguracionSistema';


    constructor(private backendService: BackendService) {
    }

    private handleError(error: Response) {
        return Observable.throw(error.json().error || 'Server error');
    }

    obtenerConfiguracionSistemaDetalle(idConfiguracionSistema: any) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.busquedaDetalleUrl;

        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idConfiguracionSistema))
            .map(res => <ConfiguracionSistema> res)
            .catch(this.handleError);

    }

    registrarConfiguracionSistema(configuracionSistema: ConfiguracionSistema) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.registrarUrl;
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(configuracionSistema))
            .map(res => <NotificacionResult> res)
            .catch(this.handleError);


    }

    obtenerConfiguracionesSistema(busquedaConfiguracionSistema: ConfiguracionSistemaFilter) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.busquedaUrl;

        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,busquedaConfiguracionSistema)
            .map(res => <ConfiguracionSistemaResult[]> res)
            .catch(this.handleError);
    }


}