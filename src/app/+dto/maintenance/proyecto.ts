import {AuditingEntity} from "../auditingEntity";
export class Proyecto extends AuditingEntity{
  constructor(public idProyecto?: number,
              public idUnidadDeNegocio?:number,
              public idDepartamentoArea?: number,
              public idJefeProyecto?:number,
              public codigo?: string,
              public nombre?: string,
              public descripcion?: string,
              public estado?:string,
              public idJefeProyectoReemplazo?: number,
              public jefeNoDisponible: boolean=false,
              public cliente?: string,
              public fechaInicio?: string,
              public fechaFin?: string,
              public nombreJefeProyecto?:string,
              public nombreJefeProyectoReemplazo?: string
  ) {
    super();
  }
}