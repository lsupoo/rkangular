import {AuditingEntity} from "../auditingEntity";
/**
 * Created by javier.cuicapuza on 12/22/2016.
 */
export class AlertaEmpleado extends AuditingEntity{

    constructor(
        public idAlertaEmpleado?: number,
        public idAlerta?: number,
        public idEmpleado?: number,
        public mensaje?: string,
        public estado?:string
    ){
        super();
    }
}