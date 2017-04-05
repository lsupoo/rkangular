import {AuditingEntity} from "../auditingEntity";
export class Contrato extends AuditingEntity{

     constructor(
         public idContrato?: number,
         public idEmpleado?: number,
         public idHorario?: number,
         public fechaInicio?: string,
         public fechaFin?: string,
         public duracion?:string,
         public cargo?:string,
         public idMoneda?:number,
         public salario?:number,
         public direccion?:string,
         public tipoDocumento?:string,
         public numeroDocumento?:string,
         public estado?:string,
         public estadoString?:string,
         public tipoContrato?:string,
         public tipoContratoString?:string,
         public monedaString?:string,
         public nombreCompletoEmpleado?:string

     ) {
          super();
     }


}