/**
 * Created by josediaz on 8/11/2016.
 */
import {PeriodoEmpleado} from "./periodoEmpleado";
import {AuditingEntity} from "../auditingEntity";

export class Permiso extends AuditingEntity{


    constructor(
        public idPermisoEmpleado?: number,
        public idEmpleado?: number,
        public idPeriodoEmpleado?: number,
        public idAtentidoPor?: number,
        public codigo?: number,
        public motivo?: string,
        public razon?:string,
        public fecha?:string,
        public horaInicio?:string,
        public horaFin?:string,
        public horas?:number,
        public fechaRecuperacion?:string,
        public horarioInicioRecuperacion?:string,
        public horarioFinRecuperacion?:string,
        public horaInicioRecuperacion?:string,
        public horaFinRecuperacion?:string,
        public periodoEmpleado:PeriodoEmpleado = new PeriodoEmpleado(),

        public estado?:string,
        public estadoString?:string,

    ) {
        super();
    }


}