import {PeriodoEmpleado} from "./periodoEmpleado";
import {AuditingEntity} from "../auditingEntity";
export class PermisoEmpleado extends AuditingEntity{

     constructor(
         public idPermisoEmpleado?:number,
         public idEmpleado?:number,
         public idPeriodoEmpleado?:number,
         public codigo?: number,
         public periodo?:string,
         public motivo?:string,
         public nombreMotivo?:string,
         public razon?:string,
         public fecha?:string,
         public fechaRecuperacion?:string,
         public horaInicio?:string,
         public horaFin?:string,
         public horaInicioRecuperacion?:string,
         public horaFinRecuperacion?:string,
         public estado?:string,
         public jefeInmediato?:string,
         public nombreEstado?:string,
         public horas?:number,
         public idAtendidoPor?:number,
         public fechaPermiso?:Date,
         public comentarioResolucion?:String,
         public periodoEmpleado:PeriodoEmpleado = new PeriodoEmpleado()

     ) {
          super();
     }

}