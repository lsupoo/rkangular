/**
 * Created by javier.cuicapuza on 1/18/2017.
 */
import {Injectable} from '@angular/core';
import {Http, ConnectionBackend, Request, RequestOptions, RequestOptionsArgs, Response} from '@angular/http';
import {ErrorNotifierService} from './error.notifier';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class CustomHttp extends Http {
    constructor(backend: ConnectionBackend,
                defaultOptions: RequestOptions,
                private errorService:ErrorNotifierService) {
        super(backend, defaultOptions);
    }

    request(url: string | Request, options?: RequestOptionsArgs): Observable<any> {
        return super.request(url, options)
            .catch((err: any): any => {
                this.errorService.notifyError(err);
                return Observable.empty();
            })
            .retryWhen(error => error.delay(500))
            .timeout(2000)
//            .timeout(2000, new Error('delay exceeded'))
            .finally(() => {
            });
    }

    get(url: string, options?: RequestOptionsArgs): Observable<any> {
        return super.get(url, options)
            .catch((err: any): any => {
                if (err.status === 400 || err.status === 422) {
                    return Observable.throw(err);
                } else {
                    this.errorService.notifyError(err);
                    return Observable.empty();
                }
            })
            .retryWhen(error => error.delay(500))
            .timeout(2000)
            //.timeout(2000, new Error('delay exceeded'))
            .finally(() => {
            });
    }

    post(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
        return super.post(url, body, options)
            .catch((err: any): any => {
                if (err.status === 400 || err.status === 422) {
                    return Observable.throw(err);
                } else {
                    this.errorService.notifyError(err);
                    return Observable.empty();
                }
            })
            .finally(() => {
            });
    }

}