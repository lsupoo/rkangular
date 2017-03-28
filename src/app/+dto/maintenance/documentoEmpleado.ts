import {AuditingEntity} from "../auditingEntity";
export class DocumentoEmpleado extends AuditingEntity{

     constructor(
         public idDocumentoEmpleado?: number,
         public nombre?: string,
         public contenidoArchivo?: string,
         public tipoArchivo?:string,
         public nombreArchivo?:string,
         public tipoDocumento?:string

     ) {
          super();
     }


}