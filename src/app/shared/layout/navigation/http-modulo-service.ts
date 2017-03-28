/**
 * Created by josediaz on 25/11/2016.
 */
import {Injectable} from "@angular/core";
import {Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import "rxjs/Rx";
import "rxjs/add/operator/toPromise";
import {environment} from "../../../../environments/environment";
import {Modulo} from "../../../+dto/maintenance/modulo";
import {ModuloAccionFilter} from "../../../+dto/moduloAccionFilter";
import {ModuloAccionResult} from "../../../+dto/moduloAccionResult";
import {ModuloAccion} from "../../../+dto/maintenance/moduloAccion";
import {NotificacionResult} from "../../../+dto/notificacionResult";
import {AuthHttpError} from "angular2-jwt";
import {BackendService} from "../../../+rest/backend.service";
import {IUrlOptions, RequestTypes} from "../../../+rest/backend.model";
import {ChangeRolModel} from "../../../+dto/changeRolModel";
import {Router} from "@angular/router";

@Injectable()
export class ModuloService {

    localhost: String = environment.backend;
    port: String = environment.port;



    private modulosPermitidosUrl ='/api/modulo/modulosPermitidos?cuentaUsuario=';
    private busquedaUrl = '/api/modulo/obtenerModulos';
    private busquedaDetalleUrl = '/api/modulo/obtenerModuloDetalle';
    private registrarUrl = '/api/modulo/registrarModulo';


    constructor(private backendService: BackendService, private router : Router) {
    }



    public getModulosPermitidos(cuentaUsuario: string) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.modulosPermitidosUrl + cuentaUsuario;



        return this.backendService.AuthRequest(RequestTypes.get, urlOptions)
            .map(res => <Modulo[]> res)
            .catch( err=>
                this.backendService.handleError(err)
            );

    }

    public updateDefaultRole(cuentaUsuario:string, roleCode: string) {
        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/login/updateDefaultRole?cuentaUsuario='+cuentaUsuario+'&roleCode='+roleCode;
        return this.backendService.AuthRequest(RequestTypes.get, urlOptions)
            .map(res => <ChangeRolModel> res)
            .catch( err=>
                this.backendService.handleError(err)
            );
    }

    public buscarModulos(busquedaModulos: ModuloAccionFilter) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.busquedaUrl;

        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaModulos))
            .map(res => <ModuloAccionResult[]> res)
            .catch( err=>
                this.backendService.handleError(err)
            );
    }

    public buscarModuloDetalle(idModulo: any) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.busquedaDetalleUrl;

        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idModulo))
            .map(res => <ModuloAccion> res)
            .catch( err=>
                this.backendService.handleError(err)
            );
    }

    registrarModulo(moduloAccion: ModuloAccion) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.registrarUrl;

        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(moduloAccion))
            .map(res => <NotificacionResult> res)
            .catch( err=>
                this.backendService.handleError(err)
            );

    }

}