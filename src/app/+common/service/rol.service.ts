import {Injectable} from "@angular/core";
import {RolFilter} from "../../+dto/rolFilter";
import {RolResult} from "../../+dto/rolResult";
import {Response} from "@angular/http";
import {Observable} from "rxjs";
import {Rol} from "../../+dto/maintenance/rol";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {Accion} from "../../+dto/maintenance/accion";
import {IUrlOptions, RequestTypes} from "../../+rest/backend.model";
import {BackendService} from "../../+rest/backend.service";
import {ServiceBase} from "./serviceBase";
/**
 * Created by javier.cuicapuza on 1/13/2017.
 */
@Injectable()
export class RolService extends ServiceBase {


    constructor(private backendService: BackendService) {
        super();
    }

    buscarRolEmpleado(busquedaRol: RolFilter){

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/rol/obtenerRolResult';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaRol)).map(res => <RolResult[]> res)
            .catch(this.handleError);

    }
    eliminarRolEmpleado(busquedaRol: number) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/rol/eliminarRolEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaRol)).map(res => <NotificacionResult> res)
            .catch(this.handleError);
    }
    obtenerRolById(idRol: any) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/rol/findRolById';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idRol)).map(res => <Rol> res)
            .catch(this.handleError);

    }

    obtenerSubModuleAccion() {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/rol/findAllSubModulosAccion';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions).map(res => <Rol> res)
            .catch(this.handleError);

    }

    updateAutorizacion(accion: Accion){

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/rol/updateAutorizacion';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(accion)).map(res => <NotificacionResult> res)
            .catch(this.handleError);
    }
    guardarRol(rol: Rol){

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/rol/actualizarRolAccion';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(rol)).map(res => <NotificacionResult> res)
            .catch(this.handleError);
    }

}