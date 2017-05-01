import {environment} from "../../../environments/environment";
import {Response} from "@angular/http";
import {Observable} from "rxjs";

declare var $: any;
export class ServiceBase {

    localhost: String = environment.backend;
    port: String = environment.port;


    constructor(){
    }

    protected handleError(error: Response) {
        return Observable.throw(error.json() || 'Server error');
    }


}
