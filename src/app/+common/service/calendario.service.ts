import {Injectable} from "@angular/core";
import {CalendarioResult} from "../../+dto/calendarioResult";
import {CalendarioFilter} from "../../+dto/calendarioFilter";
import {Calendario} from "../../+dto/maintenance/calendario";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {IUrlOptions, RequestTypes} from "../../+rest/backend.model";
import {BackendService} from "../../+rest/backend.service";
import {ServiceBase} from "./serviceBase";
/**
 * Created by javier.cuicapuza on 2/13/2017.
 */

@Injectable()
export class CalendarioService extends ServiceBase{

    private busquedaUrl = '/api/calendario/diasNoLaborables';
    private busquedaDetalleUrl = '/api/calendario/obtenerCalendarioDetalle';
    private registrarUrl = '/api/calendario/registrarCalendarioFeriado';
    private eliminarUrl = '/api/calendario/eliminarCalendario';

    constructor(private backendService: BackendService) {
        super();
    }

    obtenerDiasNoLaborables(busquedaCalendario: CalendarioFilter) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.busquedaUrl;

        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaCalendario))
            .map(res => <CalendarioResult[]> res)
            .catch(this.handleError);

    }
    obtenerCalendarioById(idCalendario: any){


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.busquedaDetalleUrl;

        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idCalendario))
            .map(res => <Calendario> res)
            .catch(this.handleError);

    }

    registrarCalendarioFeriado(calendario: Calendario){


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.registrarUrl;
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(calendario))
            .map(res => <NotificacionResult> res)
            .catch(this.handleError);

    }

    eliminarDiasNoLaborables(idCalendario: number) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.eliminarUrl;

        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idCalendario))
            .map(res => <NotificacionResult> res)
            .catch(this.handleError);
    }

}
