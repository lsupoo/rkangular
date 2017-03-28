import {AuditingEntity} from "../auditingEntity";
export class DepartamentoArea extends AuditingEntity {
  /*idDepartamentoArea: number;
  idUnidadDeNegocio: number;
  nombre: string;*/
  constructor(
      public idDepartamentoArea?:number,
      public idUnidadDeNegocio?:number,
      public nombre?:string,
      public estado?:string,

      public nombreEstado?: string,
      public idJefe?: number,
      public idJefeReemplazo?: number,
      public jefe?: string,
      public jefeNoDisponible:boolean=false,
      public jefeReemplazo?: string
  ){
    super();
  }
}