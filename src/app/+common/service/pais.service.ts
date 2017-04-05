import {Injectable} from "@angular/core";
import {Response} from "@angular/http";
import {PaisDto} from "../../+personal/+empleado/paisDto";
import {DepartamentoDto} from "../../+personal/+empleado/departamentoDto";
import {Observable} from "rxjs/Observable";
import "rxjs/Rx";
import {BackendService} from "../../+rest/backend.service";
import {IUrlOptions, RequestTypes} from "../../+rest/backend.model";

declare var $: any;

@Injectable()
export class PaisService{

    constructor(private backendService: BackendService) {
    }
    
    completarComboPais() {
        
        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/pais/obtenerPaises';
        return this.backendService.AuthRequest(RequestTypes.get, urlOptions).map(res => <PaisDto[]> res).catch(this.handleError);
    }

    private handleError (error: Response) {

        return Observable.throw(error.json().error || 'Server error');
    }
    
    completarComboDepartamento(codigoPais:string) {
        

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/pais/obtenerDepartamentos?codigoPais='+codigoPais;
        return this.backendService.AuthRequest(RequestTypes.get, urlOptions).map(res => <DepartamentoDto[]> res).catch(this.handleError);
    }
    
    completarComboProvincia(codigoDpto:string) {
        

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/pais/obtenerProvincias?codigoDpto='+codigoDpto;
        return this.backendService.AuthRequest(RequestTypes.get, urlOptions).map(res => <DepartamentoDto[]> res).catch(this.handleError);
    }
    
    completarComboDistrito(codigoProvincia:string) {
        

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/pais/obtenerDistritos?codigoProvincia='+codigoProvincia;
        return this.backendService.AuthRequest(RequestTypes.get, urlOptions).map(res => <DepartamentoDto[]> res).catch(this.handleError);
    }

}
