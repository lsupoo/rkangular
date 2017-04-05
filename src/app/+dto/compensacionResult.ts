export class CompensacionResult {

     constructor(
         public idEmpleadoCompensacion?: number,
         public empleado?: string,
         public mes?: string,
         public horasTardanzaIngreso?: number,
         public horasTardanzaSalida?: number,
         public horasDemoraAlmuerzo?: number,
         public horasTrabajadas?: number,

         public horarioHorasTrabajo?: number,

         public vacaciones?:number,
         public licencias?:number,
         public inasistencias?:number,
         public horasPendientesTotal?:number

     ) {
     }


}
