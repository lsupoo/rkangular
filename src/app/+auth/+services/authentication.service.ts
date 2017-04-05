import {Injectable} from "@angular/core";
import {Response} from "@angular/http";
import {Observable} from "rxjs";
import "rxjs/add/operator/map";
import {CurrentUser} from "../../+dto/currentUser";
import {StorageResult} from "../../+dto/storageResult";
import {tokenNotExpired} from "angular2-jwt";
import {Router} from "@angular/router";
import {AssignedRole} from "../../+dto/assignedRole";
import {BackendService} from "../../+rest/backend.service";
import {RequestTypes, IUrlOptions} from "../../+rest/backend.model";


@Injectable()
export class AuthenticationService {

    public token: string;

    private authenticateUrl = '/api/auth/login';
    private currentUserUrl =  '/login/authenticate?cuentaUsuario=';
    private localStorageCommonsUrl = '/localStorage/obtenerLocalStorage';
    private retrieveRolsNameUserUrl =  '/login/retrieveRolsNameUser?idUsuario=';

    constructor(private backendService: BackendService,  private router: Router) {
        this.token = localStorage.getItem('id_token');
    }

    public authenticateUser(cuentaUsuario: string) {
        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.currentUserUrl + cuentaUsuario;

        return this.backendService.Request(RequestTypes.get, urlOptions)
            .map(res => <CurrentUser> res)
            .catch(this.handleError);
    }

    public retrieveRolsNameUser(idUsuario: number) {
        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.retrieveRolsNameUserUrl + idUsuario;
        return this.backendService.Request(RequestTypes.get, urlOptions)
            .map(res => <AssignedRole[]> res)
            .catch(this.handleError);
    }

    retrieveComboLocalStorage(){
        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.localStorageCommonsUrl;
        return this.backendService.Request(RequestTypes.get, urlOptions)
            .map(res => <StorageResult> res)
            .catch(this.handleError);

    }

    public login(username: string, password: string): Observable<boolean> {
        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.authenticateUrl;
        return this.backendService.Request(RequestTypes.post, urlOptions, JSON.stringify({ username: username, password: password }))
            .map((response: any) => {
                // login successful if there's a jwt token in the response

                debugger;

                let token = response.token;
                if (token) {
                    // set token property
                    this.token = token;

                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('id_token', token);

                    // return true to indicate successful login
                    return true;
                } else {
                    // return false to indicate failed login
                    return false;
                }
            });
    }
    private handleError(error: Response) {
        return Observable.throw(error.json().error || 'Server error');
    }

    logout(): void {
        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.removeItem('id_token');
        localStorage.removeItem('modulos');
        localStorage.removeItem('rolName');
        localStorage.removeItem('localStorageCommonsValues');
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigate(['login']);
    }

    loggedIn() {
        return tokenNotExpired();
    }
}