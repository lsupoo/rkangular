import {Injectable} from "@angular/core";
import {Http, Response, Headers, Jsonp} from "@angular/http";
import {Observable} from "rxjs/Observable";
import "rxjs/Rx";

import {environment} from "../../../environments/environment";
import {Usuario} from "../../+dto/maintenance/usuario";
import {NotificacionResult} from "../../+dto/notificacionResult";

@Injectable()
export class ResetService {

    localhost:  String = environment.backend;
    port: String = environment.port;

    private tablaGeneralUrl: string = 'http://'+this.localhost+':'+ this.port +'/tablaGeneral/';

    //empleado: Empleado = new Empleado();

    constructor(private http: Http, private jsonp: Jsonp) {
    }

    sendMailPasswordRecovery(usuario: Usuario) {

        //let url = 'http://'+this.localhost+':'+ this.port +'/dashboard/busquedaMarcacionesDashboard';
        let url = 'http://'+this.localhost+':'+ this.port +'/reset/forgotPassword';
        let header = new Headers({'Content-Type': 'application/json'});

        return this.http.post(url,JSON.stringify(usuario),
            {headers: header}).map(res => <Usuario> res.json())
            .catch(this.handleError);
    }

    validateLinkResetPassword(usuario: Usuario) {
        let url = 'http://'+this.localhost+':'+ this.port +'/reset/validateLink';
        let header = new Headers({'Content-Type': 'application/json'});

        return this.http.post(url,JSON.stringify(usuario),
            {headers: header}).map(res => <NotificacionResult> res.json())
            .catch(this.handleError);
    }

    resetPassword(usuario: Usuario) {
        let url = 'http://'+this.localhost+':'+ this.port +'/reset/resetPassword';
        let header = new Headers({'Content-Type': 'application/json'});

        return this.http.post(url,JSON.stringify(usuario),
            {headers: header}).map(res => <NotificacionResult> res.json())
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        return Observable.throw(error.json().error || 'Server error');
    }
}