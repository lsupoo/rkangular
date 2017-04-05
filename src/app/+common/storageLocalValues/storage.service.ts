import {Http, Response, Headers, Jsonp} from "@angular/http";
import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {StorageResult} from "../../+dto/storageResult";
import {AutorizacionFilter} from "../../+dto/autorizacionFilter";
import {ServiceBase} from "../service/serviceBase";
/**
 * Created by javier.cuicapuza on 1/16/2017.
 */
@Injectable()
export class StorageService extends ServiceBase{

    localhost:  String = environment.backend;
    port: String = environment.port;
    private localStorageCommonsUrl = 'http://'+this.localhost+':'+this.port+'/localStorage/obtenerLocalStorage';

    constructor(private http:Http) {
        super();
    }

    /*CALL BACKEND*/
    retrieveComboLocalStorage(autorizacionFilter: AutorizacionFilter){
        let header = new Headers({'Content-Type': 'application/json'});
        return this.http.post(this.localStorageCommonsUrl,JSON.stringify(autorizacionFilter), {headers: header})
            .map(res => <StorageResult> res.json())
            .catch(this.handleError);

    }
    /*CALL SERVICE*/
    errorMessage: string;
    /*getRetrieveComboLocalStorage() {

        this.retrieveComboLocalStorage().subscribe(
            dataUnidadDeNegocioCombo => {this.localStorageValuesCommons(dataUnidadDeNegocioCombo)},
            error => this.errorMessage = <any>error
        );
    }*/

    public localStorageValuesCommons(data: StorageResult){
        localStorage.setItem("localStorageCommonsValues", JSON.stringify(data));
    }
    /*localRetrieveValuesCommons(){
        this.getRetrieveComboLocalStorage();
    }*/

    /*private handleError(error: Response) {
        return Observable.throw(error.json().error || 'Server error');
    }*/


}
