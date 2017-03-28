import {Marcacion} from "./marcacion";
import {AuditingEntity} from "../auditingEntity";

export class SolicitudCambioMarcacion extends AuditingEntity{

    constructor(
        public idSolicitudCambioMarcacion?: number,
        public idAtendidoPor?: number,
        public idMarcacion?:number,
        public cambiarIngreso?: boolean,
        public cambiarInicioAlmuerzo?: boolean,
        public cambiarFinAlmuerzo?: boolean,
        public cambiarSalida?: boolean,

        public horaIngreso?: string,
        public horaInicioAlmuerzo?: string,
        public horaFinAlmuerzo?: string,
        public horaSalida?: string,

        public razonCambioHoraIngreso?: string,
        public razonCambioHoraInicioAlmuerzo?: string,
        public razonCambioHoraFinAlmuerzo?: string,
        public razonCambioHoraSalida?: string,

        public estado?:string,

        public tieneSolicitudCambio?:boolean,
        public marcacion:Marcacion=new Marcacion()

    ) {
        super();
    }


}