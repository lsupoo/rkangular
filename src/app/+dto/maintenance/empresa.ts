import {AuditingEntity} from "../auditingEntity";
import {UnidadDeNegocio} from "./unidadDeNegocio";

export class Empresa extends AuditingEntity{

     constructor(

         public idEmpresa?: number,
         public codigo?: string,
         public razonSocial?: string,
         public ruc?: string,
         public estado?: string,

         public nombreEstado?: string,
         public idJefe?: number,
         public idJefeReemplazo?: number,
         public jefeNoDisponible:boolean=false,
         public jefe?: string,
         public jefeReemplazo?: string,

         public unidadesDeNegocio:UnidadDeNegocio[]=[]
     ) {
          super();
     }


}
