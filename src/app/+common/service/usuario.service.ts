/**
 * Created by javier.cuicapuza on 1/18/2017.
 */
import {Injectable} from "@angular/core";
import {RolFilter} from "../../+dto/rolFilter";
import {RolResult} from "../../+dto/rolResult";
import {Http, Response, Headers, Jsonp} from "@angular/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {UsuarioFilter} from "../../+dto/usuarioFilter";
import {UsuarioResult} from "../../+dto/usuarioResult";
import {Usuario} from "../../+dto/maintenance/usuario";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {AuthHttp} from "angular2-jwt";
import {UsuarioQuickFilter} from "../../+dto/usuarioQuickFilter";
import {IUrlOptions, RequestTypes} from "../../+rest/backend.model";
import {BackendService} from "../../+rest/backend.service";

@Injectable()
export class UsuarioService {

    localhost:  String = environment.backend;
    port: String = environment.port;
    private busquedaUrl = '/auth/obtenerUsuarios';
    private busquedaRapidaUrl = '/auth/busquedaRapidaUsuarios';
    private busquedaDetalleUrl = '/auth/obtenerUsuarioDetalle';
    private registrarUrl = '/auth/registrarUsuario';
    private eliminarUrl = '/auth/eliminarUsuario';
    private comboRol='/auth/cargarComboRol';

    constructor(private backendService: BackendService,private http: Http, private jsonp: Jsonp, private authHttp: AuthHttp) {
    }

    private handleError(err: Response) {
        if(err instanceof Response) {
            return Observable.throw(err.json().error || 'backend server error');
        }
        return Observable.throw(err || 'backend server error');
    }
    private _serverError(err: any) {
        if(err instanceof Response) {
            return Observable.throw(err.json().error || 'backend server error');
            // if you're using lite-server, use the following line
            // instead of the line above:
            //return Observable.throw(err.text() || 'backend server error');
        }
        return Observable.throw(err || 'backend server error');
    }

    /*buscarUsuarioEmpleado(busquedaRol: UsuarioFilter){
        let url = 'http://'+this.localhost+':'+ this.port +'/auth/obtenerUsuarios';
        let header = new Headers({'Content-Type': 'application/json'});

        return this.http.post(url, JSON.stringify(busquedaRol),
            {headers: header}).map(res => <UsuarioResult[]> res.json())
            .catch(this.handleError);
    }*/
    buscarUsuarioEmpleado(busquedaRol: UsuarioFilter){

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.busquedaUrl;

        return this.backendService.Request(RequestTypes.post, urlOptions,JSON.stringify(busquedaRol))
            .map(res => <UsuarioResult[]> res)
            .catch(this.handleError);
    }

    busquedaRapidaUsuarios(quickFilter: UsuarioQuickFilter){

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.busquedaRapidaUrl;

        return this.backendService.Request(RequestTypes.post, urlOptions,JSON.stringify(quickFilter))
            .map(res => <UsuarioResult[]> res)
            .catch(this.handleError);
    }

    obtenerUsuarioById(idUsuario: any) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.busquedaDetalleUrl;

        return this.backendService.Request(RequestTypes.post, urlOptions,JSON.stringify(idUsuario))
            .map(res => <Usuario> res)
            .catch(this.handleError);

    }
    guardarUsuario(usuario: Usuario) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.registrarUrl;

        return this.backendService.Request(RequestTypes.post, urlOptions,JSON.stringify(usuario))
            .map(res => <NotificacionResult> res)
            .catch(this.handleError);
    }

    eliminarUsuarioEmpleado(usuario: any) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.eliminarUrl;

        return this.backendService.Request(RequestTypes.post, urlOptions,JSON.stringify(usuario))
            .map(res => <NotificacionResult> res)
            .catch(this.handleError);

    }

    cargarComboRol() {
    /*let CARGAR_COMBO_ROL = 'http://'+this.localhost+':'+this.port+'/auth/cargarComboRol';
    return this.http.get(CARGAR_COMBO_ROL)
            .map(res => <RolResult[]> res.json())
            .catch(this.handleError);*/
        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.comboRol;

        return this.backendService.Request(RequestTypes.get, urlOptions,null)
            .map(res => <RolResult[]> res)
            .catch(this.handleError);

    }

}