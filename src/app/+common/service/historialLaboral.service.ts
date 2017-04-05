import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import "rxjs/Rx";
import "rxjs/add/operator/toPromise";
import {HistorialLaboral} from "../../+dto/maintenance/historialLaboral";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {BackendService} from "../../+rest/backend.service";
import {IUrlOptions, RequestTypes} from "../../+rest/backend.model";
import {HistorialLaboralResult} from "../../+dto/historialLaboralResult";
import {ServiceBase} from "./serviceBase";


@Injectable() 
export class HistoriaLaboralService extends ServiceBase{


  historiaLaboral: HistorialLaboral = new HistorialLaboral();

  constructor(private backendService: BackendService) {
    super();

  }
  
  completar_Grid_Historia_Laboral(idEmpleado: number){

    let urlOptions: IUrlOptions = <IUrlOptions>{};
    urlOptions.restOfUrl = '/api/empleado/historiaLaboral?idEmpleado='+idEmpleado;
    return this.backendService.AuthRequest(RequestTypes.get, urlOptions).map(res => <HistorialLaboralResult[]> res)
        .catch(this.handleError);
  }


  eliminarHistorialLaboral(idHistorialLaboral: number){

    let urlOptions: IUrlOptions = <IUrlOptions>{};
    urlOptions.restOfUrl = '/api/cargo/eliminarCargo/'+idHistorialLaboral;
    return this.backendService.AuthRequest(RequestTypes.get, urlOptions).map(res => <NotificacionResult> res)
        .catch(this.handleError);
  }

  getHistoriaLaboralId(idHistorialLaboral: number){

    let urlOptions: IUrlOptions = <IUrlOptions>{};
    urlOptions.restOfUrl = '/api/empleado/editHistoriaLaboral?idHistorialLaboral='+idHistorialLaboral;
    return this.backendService.AuthRequest(RequestTypes.get, urlOptions).map(res => <HistorialLaboral[]> res)
        .catch(this.handleError);
  }

  obtenerHistorialLaboralById(idHistorialLaboral: number){


    let urlOptions: IUrlOptions = <IUrlOptions>{};
    urlOptions.restOfUrl = '/api/empleado/obtenerHistorialLaboralById';
    return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idHistorialLaboral)).map(res => <HistorialLaboral> res)
        .catch(this.handleError);
  }

  storeData(historiaLaboral: HistorialLaboral){
    this.historiaLaboral = historiaLaboral;
  }

  retrieveData(): HistorialLaboral{
    return this.historiaLaboral;
  }

  
  public updateCargo(historiaLaboral: HistorialLaboral){

    let urlOptions: IUrlOptions = <IUrlOptions>{};
    urlOptions.restOfUrl = '/api/cargo/actualizarCargo';

    return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(historiaLaboral))
        .map(res => <NotificacionResult> res)
        .catch(this.handleError);

  }

}