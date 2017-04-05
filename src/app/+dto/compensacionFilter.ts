export class CompensacionFilter {

     constructor(
         public idUnidadDeNegocio?: number,
         public idDepartamentoArea?: number,
         public idProyecto?: number,
         public idEmpleado?: number,
         public idJefeInmediato?: number,
          public empleado?: string,
          public jefeInmediato?: string,

         public mes?:number,
         public idJefe?: number

     ) {
     }


}
