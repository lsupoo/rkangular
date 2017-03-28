export class EmpresaResult {

     constructor(
         public idEmpresa?: number,
         public codigo?: string,
         public razonSocial?: string,
         public ruc?: string,
         public estado?: string,

         public idJefe?: number,
         public idJefeReemplazo?: number,
         public jefe?: string,
         public jefeReemplazo?: string

     ) {
     }


}
