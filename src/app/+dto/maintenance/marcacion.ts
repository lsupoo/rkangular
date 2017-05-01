import {Empleado} from "./empleado";
import {SolicitudCambioMarcacion} from "./solicitudCambioMarcacion";
import {AuditingEntity} from "../auditingEntity";
export class Marcacion extends AuditingEntity{

     constructor(
         public idMarcacion?:number,
         public idEmpleado?:number,
         public nombreEmpleado?:string,
         public fecha?:string,
         public horaIngreso?:string,
         public horaInicioAlmuerzo?:string,
         public horaFinAlmuerzo?:string,
         public horaSalida?:string,
         public horaIngresoHorario?:string,
         public horaSalidaHorario?:string,
         public inasistencia?:string,
         public nombreCompletoEmpleado?:string,
         public codigoEmpleado?:string,
         public tardanza?:string,
         public solicitudCambio?:string,

         public nombreProyecto?:string,
         public nombreDepartamento?:string,
         public nombreUnidadNegocio?:string,
         public jefeInmediato?:string,
         public idJefeInmediato?:number,
         public reporteDiario:boolean=false,
         public reporteAcumulado:boolean=false,


         public horasTrabajoHorario?:number,
         public demoraEntrada?:number,
         public demoraAlmuerzo?:number,
         public demoraSalida?:number,
         public horasTrabajoReal?:number,
         public horasPermiso?:number,
         public horasExtra?:number,
         public horasTrabajoPendiente?:number,
          public estado?:string,

         public empleado:Empleado = new Empleado(),
         public solicitudesCambioMarcacion:SolicitudCambioMarcacion[]=[]

     ) {
          super();
     }


}