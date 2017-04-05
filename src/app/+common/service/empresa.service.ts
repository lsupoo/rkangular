import {Injectable} from "@angular/core";
import {Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import "rxjs/Rx";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {Empresa} from "../../+dto/maintenance/empresa";
import {EmpresaFilter} from "../../+dto/empresaFilter";
import {EmpresaResult} from "../../+dto/empresaResult";
import {IUrlOptions, RequestTypes} from "../../+rest/backend.model";
import {BackendService} from "../../+rest/backend.service";

@Injectable()
export class EmpresaService {

    private busquedaUrl = '/api/empresa/obtenerEmpresas';
    private busquedaDetalleUrl = '/api/empresa/obtenerEmpresa';
    private registrarUrl = '/api/empresa/registrarEmpresa';


    constructor(private backendService: BackendService) {
    }

    obtenerEmpresa(idEmpresa: number) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.busquedaDetalleUrl;
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idEmpresa)).map(res => <Empresa> res)
            .catch(this.handleError);

    }

    registrarEmpresa(empresa: Empresa){

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.registrarUrl;
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(empresa))
            .map(res => <NotificacionResult> res)
            .catch(this.handleError);

    }

    buscarEmpresa(busquedaEmpresa: EmpresaFilter) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.busquedaUrl;

        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaEmpresa))
            .map(res => <EmpresaResult[]> res)
            .catch(this.handleError);
    }

    private handleError(error: Response) {

        return Observable.throw(error.json().error || 'Server error');
    }
}