import {PeriodoEmpleado} from "./periodoEmpleado";
import {DocumentoEmpleado} from "./documentoEmpleado";
import {AuditingEntity} from "../auditingEntity";
export class Licencia extends AuditingEntity{

     constructor(
         public idLicencia?: number,
         public idTipoLicencia?: number,
         public idEmpleado?: number,
         public idAtendidoPor?: number,
         public motivo?: string,
         public comentario?: string,
         public fechaInicio?:string,
         public fechaFin?:string,
         public dias?:number,
         public diaEntero?:boolean,
         public nombreDiaEntero?:string,
         public nombreMotivo?:string,
         public estado?:string,
         public nombreEstado?:string,
         public jefeInmediato?:string,
         public tipoLicencia?:string,
         public nombreTipoLicencia?:string,
         public nombreEmpleado?:string,
         public horaInicio?:string,
         public horaFin?:string,
         public periodo?:string,
         public comentarioResolucion?:string,
         public documentos:DocumentoEmpleado[]=[],
         public periodoEmpleado:PeriodoEmpleado = new PeriodoEmpleado()
     ) {
          super();
     }


}