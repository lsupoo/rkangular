import {AuditingEntity} from "../auditingEntity";
import {DepartamentoArea} from "./departamentoArea";
export class UnidadDeNegocio extends AuditingEntity {

  constructor(
      public idUnidadDeNegocio?:number,
      public idEmpresa?: number,
      public nombre?:string,
      public estado?:string,

      public nombreEstado?: string,
      public idJefe?: number,
      public idJefeReemplazo?: number,
      public jefe?: string,
      public jefeReemplazo?: string,
      public jefeNoDisponible:boolean=false,
      public departamentosArea:DepartamentoArea[]=[]
  ){
    super();
  }
}