import {AuditingEntity} from "../auditingEntity";
import {PeriodoEmpleado} from "./periodoEmpleado";
export class Vacacion extends AuditingEntity{

    constructor(
        public idVacacion?: number,
        public idPeriodoEmpleado?: number,
        public periodo?:string,
        public codigo?: number,
        public idEmpleado?: number,
        public nombreEmpleado?: string,
        public idAtendidoPor?: number,
        public fechaInicio?: string,
        public fechaFin?: string,
        public diasCalendarios?: number,
        public diasHabiles?: number,
        public estado?:string,
        public nombreEstado?:string,
        public estadoString?:string,
        public jefeInmediato?:string,
        public nombreJefeInmediato?:string,
        public diasVacacionesDisponibles?:string,//observacion
        public comentarioResolucion?:string,
        public periodoEmpleado:PeriodoEmpleado = new PeriodoEmpleado()

    ) {
        super();
    }


}