import {BandaSalarial} from "./bandaSalarial";
import {AuditingEntity} from "../auditingEntity";
export class CentroCosto extends AuditingEntity{
  constructor(public idCentroCosto?: number,
    public idEmpresa?: number,
    public idUnidadDeNegocio?: number,
    public idDepartamentoArea?: number,
    public idProyecto?: number,
    public nombre?: string,
    public descripcion?: string,
    public estado?:string,


  ) {
    super();
  }
}