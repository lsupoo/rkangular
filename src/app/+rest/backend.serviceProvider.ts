import { Http } from '@angular/http';
import {BackendService} from "./backend.service";
import {environment} from "../../environments/environment";
import {AuthHttp} from "angular2-jwt";
import {Router} from "@angular/router";
export function provideBackendService() {
    let localhost:  String = environment.backend;
    let port: String = environment.port;
    let url = "http://" + localhost + ":" + port;
    return {
        provide: BackendService, useFactory: (http, authHttp, router) => {
            return new BackendService(url, http , authHttp, router);
        },
        deps: [Http, AuthHttp, Router]
    }
}