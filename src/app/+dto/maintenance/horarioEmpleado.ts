import {HorarioEmpleadoDia} from "./horarioEmpleadoDia";
import {AuditingEntity} from "../auditingEntity";
export class HorarioEmpleado extends AuditingEntity{

     constructor(
         public idHorarioEmpleado?: number,
         public idEmpleado?: number,
         public idHorario?: number,
         public inicioVigencia?: string,
         public finVigencia?: string,
         public tipoHorario?:string,
         public nombreTipoHorario?:string,
         public nombreHorario?:string,
         public horasSemanalHorario?:number,
         public horasSemanal?:number,
         public horariosEmpleadoDia:HorarioEmpleadoDia[]=[]

     ) {
          super();
     }


}