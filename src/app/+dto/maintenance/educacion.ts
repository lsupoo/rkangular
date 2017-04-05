import {AuditingEntity} from "../auditingEntity";
export class Educacion extends AuditingEntity{

     constructor(
         public idEducacion?: number,
         public nivelEducacion?: string,
         public institucion?: string,
         public titulo?:string,
         public descripcion?:string,
         public fechaInicio?:string,
         public fechaFin?:string,
         public nombreNivelEducacion?:string
     ) {
          super();
     }


}