/**
 * Created by javier.cuicapuza on 1/3/2017.
 */
import {AuditingEntity} from "../auditingEntity";
export class AlertaSubscriptor extends AuditingEntity{
    constructor(
        public idAlertaSubscriptor?:number,
        public idAlerta?:number,
        public idEmpleado?:number,
        public nombreEmpleado?:string
    ){
        super();
    }
}