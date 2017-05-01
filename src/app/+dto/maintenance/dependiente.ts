import {AuditingEntity} from "../auditingEntity";
export class Dependiente extends  AuditingEntity{

     constructor(
         public idDependiente?: number,
         public nombre?: string,
         public apellidoPaterno?: string,
         public apellidoMaterno?:string,
         public relacion?:string,
         public tipoDocumento?:string,
         public numeroDocumento?:string,
         public fechaNacimiento?:string,
         public nombreRelacion?:string,
         public nombreTipoDocumento?:string
     ) {
          super();
     }


}