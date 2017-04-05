import {AuditingEntity} from "../auditingEntity";
export class ExperienciaLaboral extends AuditingEntity{

     constructor(
         public idExperienciaLaboral?: number,
         public razonSocial?: string,
         public departamento?: string,
         public cargo?: string,
         public descripcion?: string,
         public fechaInicio?: string,
         public fechaFin?: string

     ) {
          super();
     }


}