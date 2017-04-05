/**
 * Created by javier.cuicapuza on 2/13/2017.
 */
import {AuditingEntity} from "../auditingEntity";
export class Calendario extends AuditingEntity{

    constructor(
        public idCalendario?: number,
        public fecha?: string,
        public nombre?: string,
        public descripcion?:string,
        public diaCompleto?:boolean,
        public horaInicio?:string,
        public horaFin?:string
    ) {
        super();
    }


}