import {AuditingEntity} from "../auditingEntity";
export class HorasExtra extends AuditingEntity{

    constructor(
		public idHorasExtra?:number,
		public idEmpleado?:number,
		public fecha?: string,
		public horaSalidaHorario?: string,
		public horaSalidaSolicitado?: string, 
		public horas?:number,
		public horasAdicionales?:number,
		public motivo?: string,
		public estado?: string,
	    public nombreEstado?: string,
		public jefeInmediato?: string,
		public horasCompensadas?: string,
		public comentarioResolucion?: string,
		public horasSemanalesPendientes?: number,
		public idAtendidoPor?: number,
		public tipo?:string,
		public totalHorasExtras?: number,
		public horasNoCompensables?:number

	){
    	super();
	}

}