export class EmpleadoResult{

     constructor(
         public idEmpleado?: number,
         public nombre?: string,
         public codigo?:string,
         public apellidoPaterno?: string,
         public apellidoMaterno?:string,

         public tipoDocumento?:string,
         public numeroDocumento?:string,
         public emailInterno?:string,
         public estado?:string

     ) {
     }


}
