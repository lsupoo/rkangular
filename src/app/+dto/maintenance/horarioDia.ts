import {AuditingEntity} from "../auditingEntity";
export class HorarioDia extends AuditingEntity {

  constructor(
  public idHorarioDia?: number,
  public diaSemana?: string,
  public nombreDiaSemana?: string,

  public laboral?:string,
  public tiempoAlmuerzo?: number,
  public entrada?:string,
  public salida?:string
  ){
    super();

  }

}