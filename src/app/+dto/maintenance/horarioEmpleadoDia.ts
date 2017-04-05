import {AuditingEntity} from "../auditingEntity";
export class HorarioEmpleadoDia extends AuditingEntity{

     constructor(
         public idHorarioEmpleadoDia?: number,
         public diaSemana?: string,
         public entrada?: string,
         public salida?:string,
         public tiempoAlmuerzo?:number,
         public nombreDiaSemana?:string,
         public laboral?:string
     ) {
          super();
     }


}