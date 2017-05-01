/**
 * Created by josediaz on 22/02/2017.
 */
import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptionsArgs, Response } from '@angular/http';
import { Observable } from 'rxjs';
import {IUrlOptions, RequestTypes} from "./backend.model";
import {AuthHttp, AuthHttpError} from "angular2-jwt";
import {Message} from "primeng/primeng";
import {Router} from "@angular/router";

@Injectable()
export class BackendService {

    msgs: Message[] = [];

    constructor(
        private host: string,
        private http: Http,
        private authHttp: AuthHttp,
        private router: Router
    ) { }
    private constructUrl(urlOptions: IUrlOptions): string {
        return this.host + urlOptions.restOfUrl;
    }
    //T specifies a generic output of function
    public Request<T>(requestType: RequestTypes, urlOptions: IUrlOptions, body?: any, options?: RequestOptionsArgs) : Observable<T> {

        let response: Observable<Response>;
        //True in case of post, put and patch
        if (body && options) {
            response = this.http[RequestTypes[requestType]](
                this.constructUrl(urlOptions),
                body,
                options);
        }
        //True in case of post, put and patch if options is empty
        else if (body) {
            let header = new Headers({'Content-Type': 'application/json'});
            response = this.http[RequestTypes[requestType]](
                this.constructUrl(urlOptions),
                body, {headers: header});
        }
        //True in case of get, delete, head and options
        else if (options) {
            response = this.http[RequestTypes[requestType]](
                this.constructUrl(urlOptions),
                options);
        }
        //True in case of get, delete, head and options, if options is empty
        else {
            response = this.http[RequestTypes[requestType]](
                this.constructUrl(urlOptions),
                options);
        }
        return response.map((res) => <T>res.json());
    }
    //T specifies a generic output of function
    public AuthRequest<T>(requestType: RequestTypes, urlOptions: IUrlOptions, body?: any, options?: RequestOptionsArgs) : Observable<T> {

        let response: Observable<Response>;
        //True in case of post, put and patch

        if (body && options) {
            response = this.authHttp[RequestTypes[requestType]](
                this.constructUrl(urlOptions),
                body,
                options);
        }
        //True in case of post, put and patch if options is empty
        else if (body) {
            let header = new Headers({'Content-Type': 'application/json','Accept': 'application/json'});
            response = this.authHttp[RequestTypes[requestType]](
                this.constructUrl(urlOptions),
                body, {headers: header});
        }
        //True in case of get, delete, head and options
        else if (options) {
            response = this.authHttp[RequestTypes[requestType]](
                this.constructUrl(urlOptions),
                options);
        }
        //True in case of get, delete, head and options, if options is empty
        else {
            response = this.authHttp[RequestTypes[requestType]](
                this.constructUrl(urlOptions),
                options);
        }
        return response.map((res) => <T>res.json());
    }


    public notification(msgs:Message[],  error: any){
        this.msgs = msgs;
        this.msgs.push({severity: error.severity, summary: error.summary, detail:error.detail});
    }


    public handleError(error:Response){
        if(error instanceof AuthHttpError){
            this.router.navigate(['/nouser']);
            return   Observable.throw(error);
        }

        console.error('An error occurred', error);
        return Observable.throw(error.json().error || 'Server error');
    }

}