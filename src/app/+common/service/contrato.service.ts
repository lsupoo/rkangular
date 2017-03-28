import {Injectable} from "@angular/core";
import {Http, Response, Jsonp} from "@angular/http";
import {Observable} from "rxjs/Observable";
import "rxjs/Rx";
import {ContratoResult} from "../../+dto/contratoResult";
import {Contrato} from "../../+dto/maintenance/contrato";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {RequestTypes, IUrlOptions} from "../../+rest/backend.model";
import {BackendService} from "../../+rest/backend.service";
import {HistorialLaboral} from "../../+dto/maintenance/historialLaboral";
import {ServiceBase} from "./serviceBase";

@Injectable()
export class ContratoService extends ServiceBase {

    private tablaGeneralUrl: string = '/api/tablaGeneral/';

    constructor(private backendService: BackendService) {
        super();
    }

    busquedaContratosEmpleado(idEmpleado: number) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/contrato/busquedaContratosPorEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idEmpleado)).map(res => <ContratoResult[]> res)
            .catch(this.handleError);

    }

    obtenerContratoEmpleado(idContrato: number) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/contrato/obtenerContrato';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idContrato)).map(res => <Contrato> res)
            .catch(this.handleError);

    }

    obtenerHistorialLaboralPorContratoEmpleado(idEmpleado: number) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/contrato/obtenerHistorialLaboralActualPorEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idEmpleado)).map(res => <HistorialLaboral> res)
            .catch(this.handleError);

    }

    registrarContratoEmpleado(contrato: Contrato) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/contrato/registrarContrato';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(contrato)).map(res => <NotificacionResult> res)
            .catch(this.handleError);

    }

    aprobarContratoEmpleado(contrato: Contrato) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/contrato/aprobarContrato';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(contrato)).map(res => <NotificacionResult> res)
            .catch(this.handleError);

    }

    eliminarContrato(idContrato: number) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/contrato/eliminarContrato';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idContrato)).map(res => <NotificacionResult> res)
            .catch(this.handleError);


    }

}