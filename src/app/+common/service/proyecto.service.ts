import {Injectable} from "@angular/core";
import {Headers, Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import "rxjs/Rx";
import {Cargo} from "../../+dto/maintenance/cargo";
import {environment} from "../../../environments/environment";
import 'rxjs/add/operator/toPromise';

import {NotificacionResult} from "../../+dto/notificacionResult";
import {Proyecto} from "../../+dto/maintenance/proyecto";
import {ProyectoFilter} from "../../+dto/proyectoFilter";
import {ProyectoResult} from "../../+dto/proyectoResult";
import {ProyectoQuickFilter} from "../../+dto/proyectoQuickFilter";
import {BackendService} from "../../+rest/backend.service";
import {IUrlOptions, RequestTypes} from "../../+rest/backend.model";
import {ServiceBase} from "./serviceBase";
import {AuthHttp} from "angular2-jwt";

@Injectable() 
export class ProyectoService extends ServiceBase {


  localhost:  String = environment.backend;
  port: String = environment.port;


  private busquedaUrl = '/api/proyecto/obtenerProyectos';
  private busquedaDetalleUrl = '/api/proyecto/obtenerProyectoDetalle';
  private busquedaRapidaUrl = '/api/proyecto/busquedaRapidaProyectos';
  private registrarUrl = '/api/proyecto/registrarProyecto';
  private eliminarUrl = '/api/proyecto/eliminarProyecto';

  constructor(private backendService: BackendService,private http: Http) {
    super();
  }

  cargoDto: Cargo = new Cargo();

  registrarProyecto(proyecto: Proyecto){

    let urlOptions: IUrlOptions = <IUrlOptions>{};
    urlOptions.restOfUrl = this.registrarUrl;
    return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(proyecto)).map(res => <NotificacionResult> res)
        .catch(this.handleError);
  }

  verProyecto(idProyecto: number) {


    let urlOptions: IUrlOptions = <IUrlOptions>{};
    urlOptions.restOfUrl = this.busquedaDetalleUrl;

    return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idProyecto)).map(res => <Proyecto> res)
        .catch(this.handleError);

  }

  buscarProyectos(busquedaProyectos: ProyectoFilter) {

     let urlOptions: IUrlOptions = <IUrlOptions>{};
    urlOptions.restOfUrl = this.busquedaUrl;

    return this.backendService.AuthRequest(RequestTypes.post, urlOptions,busquedaProyectos).map(res => <ProyectoResult[]> res)
        .catch(this.handleError);
  }

  busquedaRapidaProyecto(quickFilter: ProyectoQuickFilter) {

    let urlOptions: IUrlOptions = <IUrlOptions>{};
    urlOptions.restOfUrl = this.busquedaRapidaUrl;

    return this.backendService.AuthRequest(RequestTypes.post, urlOptions,quickFilter).map(res => <ProyectoResult[]> res)
        .catch(this.handleError);
  }

  eliminarProyecto(idProyecto: number) {

    let urlOptions: IUrlOptions = <IUrlOptions>{};
    urlOptions.restOfUrl = this.eliminarUrl;

    return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idProyecto)).map(res => <NotificacionResult> res)
        .catch(this.handleError);

  }

}