import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {Http, Headers, Response} from "@angular/http";
import {PeriodoEmpleadoFilter} from "../../+dto/periodoEmpleadoFilter";
import {PeriodoEmpleadoResult} from "../../+dto/PeriodoEmpleadoResult";
import {Observable} from "rxjs";
import {IUrlOptions, RequestTypes} from "../../+rest/backend.model";
import {BackendService} from "../../+rest/backend.service";
/**
 * Created by javier.cuicapuza on 2/21/2017.
 */
@Injectable()
export class PeriodoEmpleadoService {



    constructor(private backendService: BackendService) {
    }

    buscarPeriodoEmpleado(periodoEmpleadoFilter: PeriodoEmpleadoFilter) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/periodoEmpleado/busquedaPeriodoEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(periodoEmpleadoFilter)).map(res => <PeriodoEmpleadoResult[]> res).catch(this.handleError);
    }

    private handleError(error: Response) {

        return Observable.throw(error.json().error || 'Server error');
    }

}
